export function agregarDias(fecha: Date, dias: number): Date {
  const nuevaFecha = new Date(fecha);

  nuevaFecha.setDate(nuevaFecha.getDate() + dias);

  return nuevaFecha;
}

export function obtenerFechaExpiracionInvitacion(): Date {
  return agregarDias(new Date(), 7);
}
