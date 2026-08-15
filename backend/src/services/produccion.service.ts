import { AuthUser } from '../types/express';
import { ESTADOS_PRODUCCION } from '../constants/estados-produccion';
import { ESTADOS_PEDIDOS } from '../constants/estados-pedidos';

import * as produccionRepository from '../repositories/produccion.repository';
import * as usuarioRepository from '../repositories/usuario.repository';
import * as productoRepository from '../repositories/producto.repository';
import * as pedidoRepository from '../repositories/pedido.repository';
import * as transactionRepository from '../repositories/transaction.repository';

import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict.error';
import { ForbiddenError } from '../errors/forbidden.error';

import { CrearOrdenProduccionDTO, OrdenProduccionIdDTO } from '../validators/produccion.validator';
import {
  mapearPedidoAsociable,
  mapearOrdenTablero,
  mapearDetalleOrden,
} from '../dto/orden-produccion/ord.mapper';

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

  if (usuario.alumno.empresa.curso.año !== 6) {
    throw new ForbiddenError(
      'Solo los alumnos de 6° año pueden acceder a las órdenes de producción.'
    );
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
  let esPrimeraOrdenDelPedido = false;

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

    if (pedido.estado.nombre === ESTADOS_PEDIDOS.PENDIENTE) {
      esPrimeraOrdenDelPedido = true;
    }
  }

  const estadoPendiente = await produccionRepository.findEstadoPendiente();

  return transactionRepository.ejecutarTransaccion(async (tx) => {
    const ahora = new Date();

    const orden = await produccionRepository.createOrdenProduccion(
      {
        empresaId: alumno.empresa.id,
        productoId: producto.id,
        estadoId: estadoPendiente.idEstado,
        pedidoId,
        responsableId: usuario.id,
        cantidad,
        prioridad: data.prioridad,
      },
      tx
    );

    await produccionRepository.crearHistorialEstado(
      orden.idOrden,
      estadoPendiente.idEstado,
      usuario.id,
      ahora,
      tx
    );

    if (pedidoId !== undefined && esPrimeraOrdenDelPedido) {
      const estadoEnProduccion = await pedidoRepository.findEstadoEnProduccion(tx);

      await pedidoRepository.updateEstadoPedido(pedidoId, estadoEnProduccion.idEstado, tx);
    }

    return orden;
  });
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
    (orden) => orden.estado === ESTADOS_PRODUCCION.EN_PRODUCCION
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

export async function iniciarOrdenProduccion(user: AuthUser, data: OrdenProduccionIdDTO) {
  const usuario = await obtenerUsuario(user);

  const orden = await produccionRepository.findOrdenByIdAndEmpresaOrThrow(
    data.idOrden,
    usuario.alumno.empresa.id
  );

  if (orden.estado.nombre !== ESTADOS_PRODUCCION.PENDIENTE) {
    throw new BadRequestError(
      'Solo se pueden iniciar órdenes de producción que se encuentren pendientes.'
    );
  }

  const estadoEnProduccion = await produccionRepository.findEstadoEnProduccion();

  return produccionRepository.iniciarOrdenProduccion(
    orden.idOrden,
    orden.estado.idEstado,
    estadoEnProduccion.idEstado,
    usuario.id
  );
}

export async function finalizarOrdenProduccion(user: AuthUser, data: OrdenProduccionIdDTO) {
  const usuario = await obtenerUsuario(user);

  const orden = await produccionRepository.findOrdenByIdAndEmpresaOrThrow(
    data.idOrden,
    usuario.alumno.empresa.id
  );

  // La orden solamente puede finalizarse si actualmente está
  // en estado En Producción.
  if (orden.estado.nombre !== ESTADOS_PRODUCCION.EN_PRODUCCION) {
    throw new BadRequestError(
      'Solo se pueden finalizar órdenes de producción que se encuentren en producción.'
    );
  }

  const estadoFinalizada = await produccionRepository.findEstadoFinalizada();

  return transactionRepository.ejecutarTransaccion(async (tx) => {
    const ahora = new Date();

    // Cierra el período correspondiente al estado En Producción.
    await produccionRepository.cerrarHistorialEstado(
      tx,
      orden.idOrden,
      orden.estado.idEstado,
      ahora
    );

    // Actualiza la orden al estado Finalizada.
    const ordenFinalizada = await produccionRepository.finalizarOrden(
      tx,
      orden.idOrden,
      estadoFinalizada.idEstado
    );

    // Registra el inicio del estado Finalizada.
    await produccionRepository.crearHistorialEstado(
      orden.idOrden,
      estadoFinalizada.idEstado,
      usuario.id,
      ahora,
      tx
    );

    /*
     * Si la orden está asociada a un pedido,
     * la producción se utiliza para cubrir el faltante
     * de ese producto en dicho pedido.
     */
    if (orden.pedidoId) {
      await pedidoRepository.cubrirFaltante(orden.pedidoId, orden.productoId, orden.cantidad, tx);

      /*
       * Una vez cubierto el faltante de este producto,
       * verificamos si el pedido todavía tiene otros
       * productos pendientes de cubrir.
       */
      const tieneFaltantes = await pedidoRepository.tieneFaltantes(orden.pedidoId, tx);

      /*
       * Si ya no quedan faltantes, el pedido queda
       * listo para entregar.
       */
      if (!tieneFaltantes) {
        const estadoListoParaEntregar = await pedidoRepository.findEstadoListoParaEntregar(tx);

        await pedidoRepository.updateEstadoPedido(
          orden.pedidoId,
          estadoListoParaEntregar.idEstado,
          tx
        );
      }
    } else {
      /*
       * Si la orden NO está asociada a un pedido,
       * la producción pasa a formar parte del stock disponible.
       */

      await productoRepository.incrementarStock(tx, orden.productoId, orden.cantidad);
    }

    return ordenFinalizada;
  });
}

export async function obtenerDetalleOrdenProduccion(user: AuthUser, data: OrdenProduccionIdDTO) {
  const usuario = await obtenerUsuario(user);

  const orden = await produccionRepository.findDetalleOrdenProduccionOrThrow(
    data.idOrden,
    usuario.alumno.empresa.id
  );

  return mapearDetalleOrden(orden);
}
