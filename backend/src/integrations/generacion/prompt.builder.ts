import {
  REGLAS_BASE,
  REGLAS_CURSO,
  REGLAS_TIPO,
  REGLAS_DIFICULTAD,
  REGLAS_CONTENIDOS_ADICIONALES,
} from './catalogo.reglas';
import { ConstruirPromptParams, PromptGeneracionResult } from './generacion.types';

export function construirPromptGeneracion(params: ConstruirPromptParams): PromptGeneracionResult {
  const {
    cursoAño = 5,
    tipoEjercicio,
    dificultad,
    contenidosAdicionales = [],
    contextoAdicional,
  } = params;

  // 1. Seleccionar regla del curso (default 5.° año si no está especificado o mapeado)
  const reglaCurso = REGLAS_CURSO[cursoAño] ?? REGLAS_CURSO[5] ?? '';

  // 2. Seleccionar regla del tipo de ejercicio
  const reglaTipo = REGLAS_TIPO[tipoEjercicio];

  // 3. Seleccionar regla de dificultad
  const reglaDificultad = REGLAS_DIFICULTAD[dificultad];

  // 4. Compilar secciones del user prompt
  const secciones: string[] = [
    'Por favor generá un ejercicio contable escolar conforme a los siguientes parámetros y directivas:',
    reglaCurso,
    reglaTipo,
    reglaDificultad,
  ];

  // 5. Inyectar contenidos adicionales si existen
  if (contenidosAdicionales.length > 0) {
    const lineasAdicionales = contenidosAdicionales
      .map((item) => REGLAS_CONTENIDOS_ADICIONALES[item])
      .filter(Boolean)
      .join('\n');

    if (lineasAdicionales.length > 0) {
      secciones.push(`CONTENIDOS ADICIONALES OBLIGATORIOS:\n${lineasAdicionales}`);
    }
  }

  // 6. Inyectar contexto libre adicional si el docente lo proveyó
  if (contextoAdicional && contextoAdicional.trim().length > 0) {
    secciones.push(
      `CONTEXTO ESPECÍFICO DEL DOCENTE (RUBRO / CASO):\n"${contextoAdicional.trim()}"\nUtilizá este contexto para definir el rubro de la empresa ficticia, artículos comercializados y detalles narrativos sin alterar las reglas contables.`
    );
  }

  // 7. Cierre imperativo
  secciones.push(
    'CONSIGNA FINAL:\nRedactá el enunciado completo en Markdown (GFM) estructurado y listo para usar en el aula, cumpliendo rigurosamente todas las reglas precedentes.'
  );

  return {
    systemInstruction: REGLAS_BASE,
    userPrompt: secciones.join('\n\n'),
  };
}
