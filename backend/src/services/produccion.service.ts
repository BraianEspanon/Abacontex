import { AuthUser } from '../types/express';

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
