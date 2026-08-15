import { Prisma } from '@prisma/client';
import { AuthUser } from '../types/express';

import { CrearPedidoDTO, PedidoIdDTO } from '../validators/pedido.validator';

import * as pedidoRepository from '../repositories/pedido.repository';
import * as alumnoRepository from '../repositories/alumno.repository';

import { ForbiddenError } from '../errors/forbidden.error';
import { NotFoundError } from '../errors/not-found.error';
import { BadRequestError } from '../errors/bad-request-error';

import {
  toDetalleCalculado,
  toCrearPedidoResponse,
  toObtenerDetallePedidoResponse,
  toKanbanPedidosResponse,
} from '../dto/pedido/ped.mapper';
import { FaltanteStock, ProductoPedido } from '../models/pedido.models';
import { PedidoCambioEstadoResponseDTO } from '../dto/pedido/ped-cambio-estado.dto';

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

  //Construir pedido
  const { detalles, montoTotal, faltantesStock } = construirPedido(data, productos);

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
    detalles
  );

  // Respuesta
  return toCrearPedidoResponse(pedido, faltantesStock);
}

function construirPedido(data: CrearPedidoDTO, productos: ProductoPedido[]) {
  let montoTotal = new Prisma.Decimal(0);

  const faltantesStock: FaltanteStock[] = [];

  const detalles = data.productos.map((item) => {
    const producto = productos.find((p) => p.id === item.productoId)!;

    const detalle = toDetalleCalculado(producto, item.cantidad);

    montoTotal = montoTotal.add(detalle.subtotal);

    if (detalle.cantidadPendiente > 0) {
      faltantesStock.push({
        idProducto: producto.id,
        producto: producto.nombre,
        solicitado: detalle.cantidad,
        cubierto: detalle.cantidadConStock,
        faltante: detalle.cantidadPendiente,
      });
    }

    return detalle;
  });

  return {
    detalles,
    montoTotal,
    faltantesStock,
  };
}

export async function obtenerDetallePedido(user: AuthUser, params: PedidoIdDTO) {
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

  return toObtenerDetallePedidoResponse(pedido);
}

export async function obtenerKanbanPedidos(user: AuthUser) {
  // Obtener usuario y empresa
  const usuario = await alumnoRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ForbiddenError('El alumno no completó su registro.');
  }

  if (!usuario.alumno.empresa) {
    throw new ForbiddenError('El usuario no pertenece a una empresa.');
  }

  // Buscar pedidos
  const pedidos = await pedidoRepository.findKanbanByEmpresa(usuario.alumno.empresa.id);

  // Respuesta
  return toKanbanPedidosResponse(pedidos);
}

export async function marcarPedidoListoParaEntregar(
  user: AuthUser,
  params: PedidoIdDTO
): Promise<PedidoCambioEstadoResponseDTO> {
  // Obtener usuario y empresa
  const usuario = await alumnoRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ForbiddenError('El alumno no completó su registro.');
  }

  if (!usuario.alumno.empresa) {
    throw new ForbiddenError('El usuario no pertenece a una empresa.');
  }

  // Buscar pedido
  const pedido = await pedidoRepository.findByIdAndEmpresaForCambioEstado(
    params.idPedido,
    usuario.alumno.empresa.id
  );

  if (!pedido) {
    throw new NotFoundError('No se encontró el pedido.');
  }

  // Validar estado actual
  if (pedido.estado.nombre !== 'PENDIENTE') {
    //Este endpoint está pensando desde PENDIENTE hasta LISTO PARA ENTREGAR.
    //Si el pedido está en producción, este cambio se hará desde otro endpoint.
    //REVISAR CUANDO SE IMPLEMENTE PRODUCCIÓN
    throw new BadRequestError(
      'Solo los pedidos pendientes pueden marcarse como listos para entregar.'
    );
  }

  // Validar productos pendientes
  const tienePendientes = pedido.detalles.some((detalle) => detalle.cantidadPendiente > 0);

  if (tienePendientes) {
    throw new BadRequestError('El pedido posee productos pendientes de producción.');
  }

  // Obtener estado destino
  const estado = await pedidoRepository.findEstadoListoParaEntregar();

  // Actualizar
  const pedidoActualizado = await pedidoRepository.updateEstadoPedido(
    pedido.idPedido,
    estado.idEstado
  );

  // Respuesta
  const response: PedidoCambioEstadoResponseDTO = {
    numeroPedido: pedidoActualizado.idPedido,
    estado: pedidoActualizado.estado.nombre,
    mensaje: 'Pedido marcado como listo para entregar.',
  };

  return response;
}

export async function completarPedido(
  user: AuthUser,
  params: PedidoIdDTO
): Promise<PedidoCambioEstadoResponseDTO> {
  const usuario = await alumnoRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ForbiddenError('El alumno no completó su registro.');
  }

  if (!usuario.alumno.empresa) {
    throw new ForbiddenError('El usuario no pertenece a una empresa.');
  }

  const pedido = await pedidoRepository.findByIdAndEmpresa(
    params.idPedido,
    usuario.alumno.empresa.id
  );

  if (!pedido) {
    throw new NotFoundError('No se encontró el pedido.');
  }

  if (pedido.estado.nombre !== 'LISTO_PARA_ENTREGAR') {
    throw new BadRequestError('Solo los pedidos listos para entregar pueden completarse.');
  }

  const estadoCompletado = await pedidoRepository.findEstadoCompletado();

  const pedidoActualizado = await pedidoRepository.updateEstadoPedido(
    pedido.idPedido,
    estadoCompletado.idEstado
  );

  const response: PedidoCambioEstadoResponseDTO = {
    numeroPedido: pedidoActualizado.idPedido,
    estado: pedidoActualizado.estado.nombre,
    mensaje: 'Pedido marcado como completado.',
  };

  return response;
}
