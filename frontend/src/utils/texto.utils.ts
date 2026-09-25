export function formatearNombreEnum(valor: string): string {
  const texto = valor.replaceAll('_', ' ').toLowerCase();

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
