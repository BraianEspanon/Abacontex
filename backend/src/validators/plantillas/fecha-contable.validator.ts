import { z } from 'zod';

export const REGEX_FECHA_DDMMAAAA = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

/**
 * Valida que una cadena cumpla formato DD/MM/AAAA y corresponda a una fecha real del calendario.
 */
export function esFechaValidaDDMMAAAA(fechaStr: string): boolean {
  if (!REGEX_FECHA_DDMMAAAA.test(fechaStr)) return false;
  const [diaStr, mesStr, anioStr] = fechaStr.split('/');
  if (!diaStr || !mesStr || !anioStr) return false;

  const dia = parseInt(diaStr, 10);
  const mes = parseInt(mesStr, 10);
  const anio = parseInt(anioStr, 10);

  const date = new Date(anio, mes - 1, dia);
  return (
    date.getFullYear() === anio &&
    date.getMonth() === mes - 1 &&
    date.getDate() === dia
  );
}

export const fechaContableOpcionalSchema = z
  .string()
  .trim()
  .default('')
  .refine((val) => val === '' || esFechaValidaDDMMAAAA(val), {
    message:
      'La fecha debe tener el formato DD/MM/AAAA y ser una fecha válida del calendario (ej: 02/05/2026).',
  });

export const fechaContableObligatoriaSchema = z
  .string({ message: 'La fecha es obligatoria.' })
  .trim()
  .refine((val) => esFechaValidaDDMMAAAA(val), {
    message:
      'La fecha es obligatoria, debe tener formato DD/MM/AAAA y ser válida en el calendario (ej: 02/05/2026).',
  });
