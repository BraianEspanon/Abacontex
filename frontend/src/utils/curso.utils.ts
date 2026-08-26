export function obtenerAnioCurso(nombreCurso?: string | null): number | null {
  if (!nombreCurso) {
    return null;
  }

  const nombreNormalizado = nombreCurso
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (
    nombreNormalizado.includes('6to') ||
    nombreNormalizado.includes('6°') ||
    nombreNormalizado.includes('6º') ||
    nombreNormalizado.includes('sexto')
  ) {
    return 6;
  }

  if (
    nombreNormalizado.includes('5to') ||
    nombreNormalizado.includes('5°') ||
    nombreNormalizado.includes('5º') ||
    nombreNormalizado.includes('quinto')
  ) {
    return 5;
  }

  return null;
}

export function esCursoSexto(nombreCurso?: string | null): boolean {
  return obtenerAnioCurso(nombreCurso) === 6;
}

export function esCursoQuinto(nombreCurso?: string | null): boolean {
  return obtenerAnioCurso(nombreCurso) === 5;
}
