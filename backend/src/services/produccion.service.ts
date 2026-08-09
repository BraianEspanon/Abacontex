import { AuthUser } from '../types/express';
import { ESTADOS_PRODUCCION } from '../constants/estados-produccion';

import * as produccionRepository from '../repositories/produccion.repository';
import * as usuarioRepository from '../repositories/usuario.repository';
import * as productoRepository from '../repositories/producto.repository';
import * as pedidoRepository from '../repositories/pedido.repository';

import { BadRequestError } from '../errors/bad-request-error';

import { CrearOrdenProduccionDTO } from '../validators/produccion.validator';
import { ConflictError } from '../errors/conflict.error';

async function obtenerUsuario(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError(
      'Debes completar tu registro antes de realizar operaciones sobre productos.'
    );
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  if (usuario.alumno.empresa.curso.idCurso) {
    console.log('ACORDARSE DE SOLUCIONAR AÑO DEL CURSO', usuario.alumno.empresa.curso.idCurso);
    //throw new ForbiddenError('Solo los alumnos de 6° año pueden crear órdenes de producción.');
  }

  return {
    ...usuario,
    alumno: {
      ...usuario.alumno,
      empresa: usuario.alumno.empresa,
    },
  };
}

export async function crearOrdenProduccion(user: AuthUser, data: CrearOrdenProduccionDTO) {
  const usuario = await obtenerUsuario(user);

  const alumno = usuario.alumno;

  const producto = await productoRepository.findByIdAndEmpresaOrThrow(
    data.productoId,
    alumno.empresa.id
  );

  let pedidoId: number | undefined;
  let cantidad = data.cantidadProducir;

  if (data.pedidoId !== undefined) {
    const pedido = await pedidoRepository.findByIdAndEmpresaOrThrow(
      data.pedidoId,
      alumno.empresa.id
    );

    const detalle = await pedidoRepository.findDetallePedidoOrThrow(
      pedido.idPedido,
      data.productoId
    );

    if (detalle.cantidadPendiente <= 0) {
      throw new BadRequestError(
        'El producto seleccionado no tiene faltante de stock en el pedido.'
      );
    }

    const ordenExistente = await produccionRepository.findByPedidoAndProducto(
      pedido.idPedido,
      data.productoId
    );

    if (ordenExistente) {
      throw new ConflictError('Ya existe una orden de producción para este producto del pedido.');
    }

    if (data.cantidadProducir !== detalle.cantidadPendiente) {
      throw new BadRequestError(
        'La cantidad a producir debe coincidir con la cantidad pendiente del pedido.'
      );
    }

    pedidoId = pedido.idPedido;
    cantidad = detalle.cantidadPendiente;
  }

  const estadoPendiente = await produccionRepository.findEstadoPendiente();

  return produccionRepository.createOrdenProduccion({
    empresaId: alumno.empresa.id,
    productoId: producto.id,
    estadoId: estadoPendiente.idEstado,
    pedidoId,
    responsableId: usuario.id,
    cantidad,
    prioridad: data.prioridad,
  });
}
function mapearPedidoAsociable(
  pedido: Awaited<ReturnType<typeof produccionRepository.findPedidosAsociables>>[number]
) {
  // Obtiene los IDs de los productos que ya tienen una orden de producción asociada al pedido.
  const productosConOrden = new Set(pedido.ordenesProduccion.map((orden) => orden.productoId));

  // Filtra los productos que tienen faltante de stock y que todavía no poseen una orden de producción.
  const faltantesAsociables = pedido.detalles.filter(
    (detalle) => !productosConOrden.has(detalle.productoId)
  );

  // Construye la respuesta del pedido incluyendo únicamente los faltantes que pueden asociarse a una nueva orden.
  return {
    idPedido: pedido.idPedido,
    clienteNombre: pedido.clienteNombre,
    fecha: pedido.fecha,
    faltantes: faltantesAsociables.map((detalle) => ({
      productoId: detalle.productoId,
      productoNombre: detalle.producto.nombre,
      cantidadPendiente: detalle.cantidadPendiente,
    })),
  };
}

export async function obtenerPedidosAsociables(user: AuthUser) {
  // Obtiene el usuario autenticado y valida que pertenezca a una empresa.
  const usuario = await obtenerUsuario(user);

  // Obtiene los pedidos de la empresa que poseen productos con faltante de stock.
  const pedidos = await produccionRepository.findPedidosAsociables(usuario.alumno.empresa.id);

  // Adapta cada pedido al formato que necesita el módulo de producción.
  const pedidosMapeados = pedidos.map(mapearPedidoAsociable);

  // Descarta los pedidos cuyos faltantes ya tienen todos una orden de producción asociada.
  return pedidosMapeados.filter((pedido) => pedido.faltantes.length > 0);
}

function mapearOrdenTablero(
  orden: Awaited<ReturnType<typeof produccionRepository.findOrdenesParaTablero>>[number]
) {
  return {
    idOrden: orden.idOrden,
    productoId: orden.producto.id,
    productoNombre: orden.producto.nombre,
    cantidad: orden.cantidad,
    prioridad: orden.prioridad,
    estado: orden.estado.nombre,
    pedidoId: orden.pedido?.idPedido ?? null,
    fechaCreacion: orden.createdAt,
  };
}

export async function obtenerTableroProduccion(user: AuthUser) {
  // Obtiene el usuario autenticado y valida que pertenezca a una empresa.
  const usuario = await obtenerUsuario(user);

  // Obtiene todas las órdenes de producción correspondientes a la empresa.
  const ordenes = await produccionRepository.findOrdenesParaTablero(usuario.alumno.empresa.id);

  // Adapta las órdenes al formato utilizado por el tablero.
  const ordenesMapeadas = ordenes.map(mapearOrdenTablero);

  // Organiza las órdenes según su estado actual.
  const pendientes = ordenesMapeadas.filter(
    (orden) => orden.estado === ESTADOS_PRODUCCION.PENDIENTE
  );

  const enProceso = ordenesMapeadas.filter(
    (orden) => orden.estado === ESTADOS_PRODUCCION.EN_PRODUCCIÓN
  );

  const finalizadas = ordenesMapeadas.filter(
    (orden) => orden.estado === ESTADOS_PRODUCCION.FINALIZADA
  );

  return {
    resumen: {
      total: ordenesMapeadas.length,
      pendientes: pendientes.length,
      enProceso: enProceso.length,
      finalizadas: finalizadas.length,
    },
    columnas: {
      pendientes,
      enProceso,
      finalizadas,
    },
  };
}
