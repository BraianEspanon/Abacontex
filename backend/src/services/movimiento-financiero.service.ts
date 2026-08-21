import { AuthUser } from '../types/express';
import { Prisma } from '@prisma/client';

import { RegistrarMovimientoDTO } from '../validators/movimiento-financiero.validator';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as metodoPagoRepository from '../repositories/metodo-pago.repository';
import * as movimientoFinancieroRepository from '../repositories/movimiento-financiero.repository';

import { ConflictError } from '../errors/conflict.error';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found.error';

export async function obtenerCategoriasAgrupadas() {
  const categorias = await movimientoFinancieroRepository.findAllCategorias();

  const agrupadas = categorias.reduce(
    (acc, categoria) => {
      const tipo = categoria.tipoMovimiento.nombre.toLowerCase();

      if (!acc[tipo]) {
        acc[tipo] = [];
      }

      acc[tipo].push({
        idCategoria: categoria.idCategoria,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      });

      return acc;
    },
    {} as Record<string, Array<{ idCategoria: number; nombre: string; descripcion: string | null }>>
  );

  return agrupadas;
}

export async function registrarMovimiento(user: AuthUser, data: RegistrarMovimientoDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const empresa = usuario.alumno.empresa;
  const añoCurso = empresa.curso.año;
  const añoAcademico = empresa.cicloLectivo.año;

  const fechaIngresada = new Date(data.fecha);
  const hoy = new Date();

  if (fechaIngresada > hoy) {
    throw new BadRequestError('La fecha del movimiento no puede ser en el futuro.');
  }

  if (fechaIngresada.getFullYear() < añoAcademico) {
    throw new BadRequestError(
      `La fecha del movimiento no puede ser anterior al ciclo lectivo actual (${añoAcademico}).`,
      { fechaIngresada }
    );
  }

  const metodoPagoCurso = await metodoPagoRepository.findByIdAndAño(data.idMetodoPago, añoCurso);

  if (!metodoPagoCurso) {
    throw new BadRequestError('El método de pago no es válido para el curso actual.', {
      añoCurso,
      idMetodoPago: data.idMetodoPago,
    });
  }

  const categoria = await movimientoFinancieroRepository.findCategoriaById(data.idCategoria);

  if (!categoria) {
    throw new NotFoundError('La categoría de movimiento no existe.');
  }

  const estadoRegistrado = await movimientoFinancieroRepository.findEstadoRegistrado();

  return movimientoFinancieroRepository.create({
    idEmpresa: empresa.id,
    idUsuario: usuario.id,
    idCategoria: data.idCategoria,
    idMetodoPago: data.idMetodoPago,
    idEstado: estadoRegistrado.idEstado,
    fecha: fechaIngresada,
    concepto: data.concepto,
    importe: new Prisma.Decimal(data.importe),
    observaciones: data.observaciones || null,
    esAutomatico: false,
  });
}
