import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';

import { EditarCuentaDTO } from '../validators/cuenta.validator';

import { NotFoundError } from '../errors/not-found.error';
import { ConflictError } from '../errors/conflict.error';

export async function findByCodigo(codigo: string, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.cuentaContable.findUnique({
    where: { codigo },
  });
}

export async function findByCodigoOrThrow(codigo: string, tx?: Prisma.TransactionClient) {
  const cuenta = await findByCodigo(codigo, tx);

  if (!cuenta) {
    throw new NotFoundError('Cuenta contable no encontrada.', { codigo });
  }

  return cuenta;
}

export async function ensureCodigoIsUnique(codigo: string, tx?: Prisma.TransactionClient) {
  const existente = await findByCodigo(codigo, tx);

  if (existente) {
    throw new ConflictError('Ya existe una cuenta registrada con el código ingresado.', {
      codigo,
    });
  }
}

export async function findByNombre(nombre: string, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.cuentaContable.findFirst({
    where: {
      nombre: {
        equals: nombre,
        mode: 'insensitive',
      },
    },
  });
}

export async function ensureNombreIsUnique(nombre: string, tx?: Prisma.TransactionClient) {
  const existente = await findByNombre(nombre, tx);

  if (existente) {
    throw new ConflictError('Ya existe una cuenta registrada con el nombre ingresado.', {
      nombre,
    });
  }
}

export async function findById(idCuenta: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.cuentaContable.findUnique({
    where: { idCuenta },
    include: {
      rubro: {
        include: {
          tipoCuenta: true,
        },
      },
    },
  });
}

export async function findByIdOrThrow(idCuenta: number, tx?: Prisma.TransactionClient) {
  const cuenta = await findById(idCuenta, tx);

  if (!cuenta) {
    throw new NotFoundError('Cuenta contable no encontrada.', { idCuenta });
  }

  return cuenta;
}

export async function ensureNombreIsUniqueExcludingId(
  nombre: string,
  idCuentaExcluir: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const existente = await db.cuentaContable.findFirst({
    where: {
      idCuenta: {
        not: idCuentaExcluir,
      },
      nombre: {
        equals: nombre,
        mode: 'insensitive',
      },
    },
  });

  if (existente) {
    throw new ConflictError('Ya existe una cuenta registrada con el nombre ingresado.', {
      nombre,
    });
  }
}

export async function findRubroById(idRubro: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.rubroCuentaContable.findFirst({
    where: {
      idRubro,
      activo: true,
    },
  });
}

export async function findRubroByIdOrThrow(idRubro: number, tx?: Prisma.TransactionClient) {
  const rubro = await findRubroById(idRubro, tx);

  if (!rubro) {
    throw new NotFoundError('El rubro seleccionado no existe o no está activo.', {
      idRubro,
    });
  }

  return rubro;
}

export async function findTiposWithRubros(tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.tipoCuentaContable.findMany({
    include: {
      rubros: {
        where: {
          activo: true,
        },
        orderBy: {
          nombre: 'asc',
        },
      },
    },
    orderBy: {
      idTipoCuenta: 'asc',
    },
  });
}

export async function createCuenta(
  data: {
    codigo: string;
    nombre: string;
    idRubro: number;
    descripcion: string;
  },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.cuentaContable.create({
    data,
    include: {
      rubro: {
        include: {
          tipoCuenta: true,
        },
      },
    },
  });
}

export async function updateCuenta(
  idCuenta: number,
  data: EditarCuentaDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.cuentaContable.update({
    where: { idCuenta },
    data,
    include: {
      rubro: {
        include: {
          tipoCuenta: true,
        },
      },
    },
  });
}
