export function formatearNumeroFactura(idFactura: number): string {
  return `FA-${String(idFactura).padStart(4, '0')}`;
}

export function formatearNumeroVenta(idVenta: number): string {
  return `VEN-${String(idVenta).padStart(4, '0')}`;
}

export function formatearMonto(valor: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat('es-AR').format(new Date(fecha));
}
