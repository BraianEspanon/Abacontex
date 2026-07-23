import { EstadoInvitacion, InvitacionEmpresa } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { InvitacionDTO } from '../dto/invitacion/inv-crear.dto';
import { NotFoundError } from '../errors/not-found.error';

export async function crearInvitaciones(data: InvitacionDTO[]) {
  return prisma.$transaction(async (tx) => {
    const invitaciones = [];

    for (const invitacion of data) {
      const creada = await tx.invitacionEmpresa.create({
        data: invitacion,
      });

      invitaciones.push(creada);
    }

    return invitaciones;
  });
}

export async function findPendienteByEmail(email: string) {
  return prisma.invitacionEmpresa.findFirst({
    where: {
      email,
      estado: EstadoInvitacion.PENDIENTE,
      fechaExpiracion: {
        gt: new Date(),
      },
    },
    include: {
      empresa: {
        select: {
          id: true,
          nombre: true,
          actividad: true,
          logoUrl: true,
        },
      },
    },
  });
}

export async function findByEmpresaAndEmail(empresaId: number, email: string) {
  return prisma.invitacionEmpresa.findUnique({
    where: {
      empresaId_email: {
        empresaId,
        email,
      },
    },
  });
}

export async function findByIdOrThrow(id: number) {
  const invitacion = await prisma.invitacionEmpresa.findUnique({
    where: {
      id,
    },
    include: {
      empresa: true,
    },
  });

  if (!invitacion) {
    throw new NotFoundError('La invitación no existe.');
  }

  return invitacion;
}

export async function aceptar(invitacion: InvitacionEmpresa, idAlumno: string) {
  return prisma.$transaction(async (tx) => {
    await tx.alumno.update({
      where: {
        id: idAlumno,
      },
      data: {
        idEmpresa: invitacion.empresaId,
      },
    });

    await tx.invitacionEmpresa.update({
      where: {
        id: invitacion.id,
      },
      data: {
        estado: EstadoInvitacion.ACEPTADA,
      },
    });
  });
}

export async function rechazar(idInvitacion: number) {
  return prisma.invitacionEmpresa.update({
    where: {
      id: idInvitacion,
    },
    data: {
      estado: EstadoInvitacion.CANCELADA,
    },
  });
}

export async function findByEmpresa(empresaId: number) {
  return prisma.invitacionEmpresa.findMany({
    where: {
      empresaId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
