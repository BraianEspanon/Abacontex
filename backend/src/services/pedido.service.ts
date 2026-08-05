import { Prisma } from '@prisma/client';
import { AuthUser } from '../types/express';

import { CrearPedidoDTO, ObtenerDetallePedidoDTO } from '../validators/pedido.validator';

import * as pedidoRepository from '../repositories/pedido.repository';
import * as alumnoRepository from '../repositories/alumno.repository';

import { ForbiddenError } from '../errors/forbidden.error';
import { NotFoundError } from '../errors/not-found.error';
import { toDetalleCalculado, toCrearPedidoResponse } from '../dto/pedido/ped.mapper';
import { FaltanteStock, ProductoPedido } from '../models/pedido.models';

export async function crearPedido(user: AuthUser, data: CrearPedidoDTO) {
  // Obtener alumno y empresa
  const usuario = await alumnoRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ForbiddenError('El alumno no completó su registro.');
  }

  if (!usuario.alumno.empresa) {
    throw new ForbiddenError('El usuario no pertenece a una empresa.');
  }

  // Buscar productos
  const productoIds = data.productos.map((p) => p.productoId);
  const productos = await pedidoRepository.findProductosByIdsAndEmpresa(
    usuario.alumno.empresa.id,
    productoIds
  );

  if (productos.length !== productoIds.length) {
    throw new NotFoundError('Uno o más productos no están activos o no pertenecen a la empresa.');
  }

  // Obtener estado inicial
  const estadoPendiente = await pedidoRepository.findEstadoPendiente();

  //Calcular detalle
  const { detalles, montoTotal, hayStockSuficiente, faltantesStock } = calcularDetalles(
    data,
    productos
  );

  //Transacción
  const pedido = await pedidoRepository.createPedido(
    {
      empresa: {
        connect: {
          id: usuario.alumno.empresa.id,
        },
      },
      usuario: {
        connect: {
          id: usuario.alumno.id,
        },
      },
      estado: {
        connect: {
          idEstado: estadoPendiente.idEstado,
        },
      },
      clienteNombre: data.clienteNombre,
      clienteMail: data.clienteMail,
      montoTotal,
    },
    detalles,
    hayStockSuficiente
  );

  // Respuesta
  return toCrearPedidoResponse(pedido, hayStockSuficiente, faltantesStock);
}

function calcularDetalles(data: CrearPedidoDTO, productos: ProductoPedido[]) {
  let montoTotal = new Prisma.Decimal(0);
  let hayStockSuficiente = true;
  const faltantesStock: FaltanteStock[] = [];

  const detalles = data.productos.map((item) => {
    const producto = productos.find((p) => p.id === item.productoId)!;

    if (producto.stock < item.cantidad) {
      hayStockSuficiente = false;

      faltantesStock.push({
        producto: producto.nombre,
        solicitado: item.cantidad,
        cubierto: producto.stock,
        faltante: item.cantidad - producto.stock,
      });
    }

    const subtotal = producto.precioUnitario.mul(item.cantidad);

    montoTotal = montoTotal.add(subtotal);

    return toDetalleCalculado(producto, item.cantidad);
  });

  return {
    detalles,
    montoTotal,
    hayStockSuficiente,
    faltantesStock,
  };
}

export async function obtenerDetallePedido(user: AuthUser, params: ObtenerDetallePedidoDTO) {
  // Obtener usuario con empresa
  const usuario = await alumnoRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ForbiddenError('El alumno no completó su registro.');
  }

  if (!usuario.alumno.empresa) {
    throw new ForbiddenError('El usuario no pertenece a una empresa.');
  }

  // Buscar pedido
  const pedido = await pedidoRepository.findByIdAndEmpresa(
    params.idPedido,
    usuario.alumno.empresa.id
  );

  if (!pedido) {
    throw new NotFoundError('No se encontró el pedido.');
  }

  return {
    numeroPedido: pedido.idPedido,

    cliente: {
      nombre: pedido.clienteNombre,
      mail: pedido.clienteMail,
    },

    estado: pedido.estado.nombre,

    fecha: pedido.fecha,

    creadoPor: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`,

    total: pedido.montoTotal,

    productos: pedido.detalles.map((detalle) => ({
      id: detalle.producto.id,
      nombre: detalle.producto.nombre,
      descripcion: detalle.producto.descripcion,
      fotoUrl: detalle.producto.fotoUrl,

      cantidad: detalle.cantidad,
      precioUnitario: detalle.precioUnitario,
      subtotal: detalle.subtotal,
    })),
  };
}
