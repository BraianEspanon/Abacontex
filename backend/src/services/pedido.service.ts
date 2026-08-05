import { Prisma } from '@prisma/client';
import { AuthUser } from '../types/express';

import { CrearPedidoDTO, ObtenerDetallePedidoDTO } from '../validators/pedido.validator';

import * as pedidoRepository from '../repositories/pedido.repository';
import * as alumnoRepository from '../repositories/alumno.repository';

import { ForbiddenError } from '../errors/forbidden.error';
import { NotFoundError } from '../errors/not-found.error';
import {
  toDetalleCalculado,
  toCrearPedidoResponse,
  toObtenerDetallePedidoResponse,
} from '../dto/pedido/ped.mapper';
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

  return toObtenerDetallePedidoResponse(pedido);
}
