import { AuthUser } from '../types/express';

import { ESTADOS_PEDIDOS } from '../constants/estados-pedidos';
import { METODOS_PAGO } from '../constants/metodos-pago';
import { CUOTAS_VENTA } from '../constants/cantidad-cuotas';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '../constants/audit.constants';

import { Prisma } from '@prisma/client';

import { ObtenerVentasQueryDTO, RegistrarVentaDTO } from '../validators/venta.validator';

import * as auditLogService from './audit-log.service';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as pedidoRepository from '../repositories/pedido.repository';
import * as metodoPagoRepository from '../repositories/metodo-pago.repository';
import * as transactionRepository from '../repositories/transaction.repository';
import * as ventaRepository from '../repositories/venta.repository';
import * as movimientoFinancieroRepository from '../repositories/movimiento-financiero.repository';

import { ConflictError } from '../errors/conflict.error';
import { BadRequestError } from '../errors/bad-request-error';

export async function obtenerPedidosListos(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  return pedidoRepository.findPedidosListosParaVenta(usuario.alumno.empresa.id);
}

type PedidoConDetalles = Prisma.PedidoGetPayload<{
  include: {
    detalles: {
      include: {
        producto: {
          select: {
            id: true;
            precioVenta: true;
            precioConsumidorFinal: true;
          };
        };
      };
    };
  };
}>;

function calcularVenta(pedido: PedidoConDetalles, data: RegistrarVentaDTO) {
  // 1. Recorrer los detalles del pedido y calcular el precio unitario y subtotal para cada producto
  const detallesVenta = pedido.detalles.map((detalle) => {
    let precioUnitario: Prisma.Decimal;

    // Si la venta aplica IVA, usamos el precio de venta normal
    // Caso contrario, usamos el precio consumidor final
    if (data.aplicaIva) {
      precioUnitario = detalle.producto.precioVenta;
    } else {
      precioUnitario = detalle.producto.precioConsumidorFinal;
    }

    const subtotal = precioUnitario.mul(detalle.cantidad);

    return {
      productoId: detalle.productoId,
      cantidad: detalle.cantidad,
      precioUnitario,
      subtotal,
    };
  });

  // 2. Sumar el subtotal de todos los detalles para obtener el subtotal inicial de la venta
  const subtotal = detallesVenta.reduce(
    (total, detalle) => total.add(detalle.subtotal),
    new Prisma.Decimal(0)
  );

  let importeAjuste = new Prisma.Decimal(0);

  // 3. Si hay un porcentaje de ajuste (descuento o recargo), calculamos su valor en dinero
  if (data.tipoAjuste !== 'NINGUNO') {
    importeAjuste = subtotal.mul(data.porcentajeAjuste).div(100);
  }

  let subtotalConAjuste = subtotal;

  // 4. Aplicar el ajuste al subtotal inicial dependiendo de si es descuento o recargo
  if (data.tipoAjuste === 'DESCUENTO') {
    subtotalConAjuste = subtotal.sub(importeAjuste);
  }

  if (data.tipoAjuste === 'RECARGO') {
    subtotalConAjuste = subtotal.add(importeAjuste);
  }

  let importeIva = new Prisma.Decimal(0);

  // 5. Si la venta aplica IVA, calculamos el 21% sobre el subtotal ya ajustado
  if (data.aplicaIva) {
    importeIva = subtotalConAjuste.mul(21).div(100);
  }

  // 6. Sumamos el monto del IVA al subtotal ajustado
  const totalConIva = subtotalConAjuste.add(importeIva);

  let importeInteres = new Prisma.Decimal(0);

  // 7. Si hay interés (usualmente por pago en cuotas con crédito), lo calculamos sobre el total que incluye IVA
  if (data.porcentajeInteres > 0) {
    importeInteres = totalConIva.mul(data.porcentajeInteres).div(100);
  }

  // 8. El total final es la suma del importe total (con IVA) y los intereses generados
  const totalFinal = totalConIva.add(importeInteres);

  return {
    detallesVenta,
    subtotal,
    importeAjuste,
    importeIva,
    importeInteres,
    totalFinal,
  };
}

export async function registrarVenta(user: AuthUser, data: RegistrarVentaDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const empresa = usuario.alumno.empresa;

  const pedido = await pedidoRepository.findByIdAndEmpresa(data.pedidoId, empresa.id);

  if (!pedido) {
    throw new ConflictError('El pedido no existe o no pertenece a la empresa.');
  }

  if (pedido.estado.nombre !== ESTADOS_PEDIDOS.LISTO_PARA_ENTREGAR) {
    throw new BadRequestError(
      'Solo pueden registrarse ventas asociadas a pedidos listos para entregar.'
    );
  }

  if (pedido.venta) {
    throw new ConflictError('El pedido ya tiene una venta registrada.');
  }

  const año = empresa.curso.año;
  const metodoPagoId = data.metodoPagoId;

  const metodoPagoCurso = await metodoPagoRepository.findByIdAndAño(metodoPagoId, año);

  if (!metodoPagoCurso) {
    throw new BadRequestError('No sé encontró un método de pago válido para el curso.', {
      año,
      metodoPagoId,
    });
  }

  const metodoPago = metodoPagoCurso.metodoPago;

  if (metodoPago.nombre === METODOS_PAGO.CREDITO) {
    if (data.cantidadCuotas === null || !CUOTAS_VENTA.includes(data.cantidadCuotas)) {
      throw new BadRequestError(
        'Debe especificar una cantidad de cuotas válida (1 o más) para el pago con crédito.'
      );
    }
  } else {
    if (data.cantidadCuotas !== null) {
      throw new BadRequestError(
        'Las cuotas solo pueden seleccionarse cuando el método de pago es crédito.'
      );
    }

    if (data.porcentajeInteres !== 0) {
      throw new BadRequestError(
        'El interés solo puede aplicarse cuando el método de pago es crédito.'
      );
    }
  }

  if (data.tipoAjuste === 'NINGUNO' && data.porcentajeAjuste !== 0) {
    throw new BadRequestError(
      'El porcentaje de ajuste debe ser 0 cuando no se aplica descuento ni recargo.'
    );
  }

  const calculo = calcularVenta(pedido, data);

  return transactionRepository.ejecutarTransaccion(async (tx) => {
    const venta = await ventaRepository.create(
      {
        empresaId: empresa.id,
        pedidoId: pedido.idPedido,
        usuarioId: usuario.id,
        metodoPagoId: data.metodoPagoId,

        subtotal: calculo.subtotal,

        tipoAjuste: data.tipoAjuste,
        porcentajeAjuste: data.porcentajeAjuste,
        importeAjuste: calculo.importeAjuste,

        aplicaIva: data.aplicaIva,
        importeIva: calculo.importeIva,

        cantidadCuotas: data.cantidadCuotas,

        porcentajeInteres: data.porcentajeInteres,
        importeInteres: calculo.importeInteres,

        totalFinal: calculo.totalFinal,
      },
      tx
    );

    await ventaRepository.createDetalles(
      venta.idVenta,
      calculo.detallesVenta.map((detalle) => ({
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        subtotal: detalle.subtotal,
      })),
      tx
    );

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.VENTA,
      entityId: venta.idVenta,
      empresaId: empresa.id,
      newValues: {
        ventaId: venta.idVenta,
        pedidoId: pedido.idPedido,
        totalFinal: calculo.totalFinal,
        metodoPagoId: data.metodoPagoId,
        aplicaIva: venta.aplicaIva,
        detalles: calculo.detallesVenta.map((d) => ({
          productoId: d.productoId,
          cantidad: d.cantidad,
          subtotal: d.subtotal,
        })),
      },
      description: 'Se registró una nueva venta',
    });

    const estadoPedidoCompletado = await pedidoRepository.findEstadoCompletado(tx);
    await pedidoRepository.updateEstadoPedido(pedido.idPedido, estadoPedidoCompletado.idEstado, tx);

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.PEDIDO,
      entityId: pedido.idPedido,
      empresaId: empresa.id,
      newValues: { estado: estadoPedidoCompletado.nombre },
      description: 'El pedido pasó a Completado al registrarse su venta',
    });

    const categoriaVenta = await movimientoFinancieroRepository.findCategoriaVenta(tx);
    const estadoRegistrado = await movimientoFinancieroRepository.findEstadoPendiente(tx);

    if (!categoriaVenta || !estadoRegistrado) {
      throw new ConflictError(
        'Error interno: Faltan las configuraciones del sistema para registrar el movimiento (categoría o estado).'
      );
    }

    const movimiento = await movimientoFinancieroRepository.create(
      {
        idEmpresa: empresa.id,
        idUsuario: usuario.id,
        idCategoria: categoriaVenta.idCategoria,
        idMetodoPago: data.metodoPagoId,
        idEstado: estadoRegistrado.idEstado,
        ventaId: venta.idVenta,
        concepto: `Venta - Pedido #${pedido.idPedido}`,
        importe: calculo.totalFinal,
        esAutomatico: true,
      },
      tx
    );

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.MOVIMIENTO_FINANCIERO,
      entityId: movimiento.idMovimiento,
      empresaId: empresa.id,
      newValues: {
        idMovimiento: movimiento.idMovimiento,
        importe: movimiento.importe,
        concepto: movimiento.concepto,
        idCategoria: movimiento.idCategoria,
        idMetodoPago: movimiento.idMetodoPago,
        fecha: movimiento.fecha,
        ventaId: movimiento.ventaId,
        esAutomatico: true,
      },
      description: 'Se registró un movimiento financiero automático asociado a la venta',
    });

    return {
      ...venta,
      clienteNombre: pedido.clienteNombre,
    };
  });
}

export async function obtenerDetalleVenta(user: AuthUser, idVenta: number) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const empresa = usuario.alumno.empresa;

  const venta = await ventaRepository.findByIdAndEmpresaOrThrow(idVenta, empresa.id);

  return {
    idVenta: venta.idVenta,
    pedidoId: venta.pedidoId,
    fecha: venta.fecha,
    estado: venta.estado,
    cliente: {
      nombre: venta.pedido.clienteNombre,
      email: venta.pedido.clienteMail,
    },
    condicionesComerciales: {
      formaPago: venta.metodoPago.nombre,
      tipoAjuste: venta.tipoAjuste,
      porcentajeAjuste: Number(venta.porcentajeAjuste),
      importeAjuste: Number(venta.importeAjuste),
      aplicaIva: venta.aplicaIva,
      cantidadCuotas: venta.cantidadCuotas,
      porcentajeInteres: Number(venta.porcentajeInteres),
      importeInteres: Number(venta.importeInteres),
    },
    totales: {
      subtotal: Number(venta.subtotal),
      importeIva: Number(venta.importeIva),
      totalFinal: Number(venta.totalFinal),
    },
    detalles: venta.detalles.map((detalle) => ({
      idDetalleVenta: detalle.idDetalleVenta,
      productoId: detalle.productoId,
      nombreProducto: detalle.producto.nombre,
      cantidad: detalle.cantidad,
      precioUnitario: Number(detalle.precioUnitario),
      subtotal: Number(detalle.subtotal),
    })),
  };
}

export async function obtenerVentas(user: AuthUser, filtros: ObtenerVentasQueryDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const empresa = usuario.alumno.empresa;

  const ahora = new Date();
  const fechaInicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const fechaFinMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);

  const [resumenData, { total, items: ventas }] = await Promise.all([
    ventaRepository.obtenerResumenVentas(empresa.id, fechaInicioMes, fechaFinMes),
    ventaRepository.findByEmpresa(empresa.id, filtros),
  ]);

  const promedioVenta =
    resumenData.totalVentas > 0 ? resumenData.totalVendido / resumenData.totalVentas : 0;

  return {
    resumen: {
      ventasRegistradas: resumenData.totalVentas,
      totalVendido: resumenData.totalVendido,
      ventasMes: resumenData.ventasMes,
      promedioVenta,
    },
    items: ventas.map((venta) => ({
      idVenta: venta.idVenta,
      pedidoId: venta.pedidoId,
      cliente: venta.pedido.clienteNombre,
      metodoPago: venta.metodoPago.nombre,
      metodoPagoId: venta.metodoPago.idMetodoPago,
      montoTotal: Number(venta.totalFinal),
      fecha: venta.fecha,
      estado: venta.estado,
    })),
    page: filtros.page,
    pageSize: filtros.pageSize,
    totalItems: total,
    totalPages: Math.ceil(total / filtros.pageSize),
  };
}
