import OpenAI from 'openai';
import { ExternalServiceError } from '../../errors/external-service.error';
import { BadRequestError } from '../../errors/bad-request-error';
import type {
  DiagnosticoCursoIaResult,
  GenerarDiagnosticoCursoParams,
  GenerarSugerenciaEntregaParams,
  ICorreccionIaProvider,
} from './correccion-ia.types';

const SYSTEM_INSTRUCTION = `Sos un docente de contabilidad en escuelas secundarias y técnicas de Argentina en la plataforma educativa Abacontex.
Tu objetivo es escribirle una devolución pedagógica, breve y constructiva a un alumno sobre su ejercicio.

REGLAS DE ORO:
1. Hablá directamente al estudiante con voseo argentino natural (ej: "Revisá", "Tené en cuenta", "Fijate").
2. CERO META-ANÁLISIS: NUNCA uses frases como "los problemas se agrupan en", "se detectaron errores en", "analizando tu entrega". Andá directo al concepto contable que debe repasar.
3. PRECISIÓN CONTABLE:
   - En Libro Diario: cada asiento debe balancear obligatoriamente (Total Debe = Total Haber).
   - En Libro Mayor: hablá siempre de "cuentas" o "mayorizaciones", nunca de "asientos". El saldo surge de la diferencia entre Debe y Haber (si Debe > Haber es Saldo Deudor; si Haber > Debe es Saldo Acreedor; si ambos totales son iguales la cuenta queda Saldada). NUNCA digas que Debe y Haber deben ser iguales en una cuenta de mayor.
   - En IVA: IVA Crédito Fiscal corresponde a compras y gastos; IVA Débito Fiscal a ventas.
4. ESTRUCTURA:
   - Señalá con calidez qué concepto contable revisar.
   - Dale una recomendación práctica y orientadora para resolverlo.
5. Longitud máxima: 400 a 480 caracteres (texto plano, sin asteriscos, sin viñetas, sin saludos formales ni firmas).

EJEMPLO DE BUENA DEVOLUCIÓN:
"Tené presente que en el Libro Mayor el tipo de saldo surge de la diferencia entre columnas: si la sumatoria del Haber supera al Debe, el saldo resultante es Acreedor, y solo queda 'Saldada' cuando ambos totales son idénticos. Revisá las sumas de cada cuenta antes de definir su saldo final."`;

const SYSTEM_INSTRUCTION_CURSO = `Sos un asesor pedagógico y docente especialista en didáctica contable para escuelas secundarias y técnicas de Argentina.
Tu objetivo es analizar las estadísticas consolidadas de un curso y redactar un diagnóstico pedagógico sintético para la tarjeta visual del colega docente.

PAUTAS PEDAGÓGICAS:
1. Español de Argentina con tono profesional, empático y orientado a la planificación didáctica de clases.
2. No uses nombres de código del sistema (como "cuentas adicionales", "comprobante adicional" o "tipo de movimiento incorrecto"). Traducilos a conceptos contables reales (ej: "delimitación de las cuentas que intervienen en la operación", "imputación en columnas Debe y Haber").
3. Cada viñeta de "cosasAReforzar" debe comenzar obligatoriamente con un verbo en infinitivo (ej: "Identificar...", "Revisar...", "Practicar...", "Diferenciar..."). No sugieras tareas administrativas ni rúbricas; enfocate exclusivamente en los conceptos contables a ejercitar.

FORMATO DE SALIDA OBLIGATORIO:
Respondé únicamente un objeto JSON válido con la siguiente estructura y estilo:
{
  "resumenGeneral": "Los ejercicios analizados muestran que la principal dificultad radica en la delimitación precisa de las cuentas que intervienen en la operación y en el balance de asientos. Esto impacta en la posterior mayorización y en la determinación de saldos.",
  "cosasAReforzar": [
    "Identificar las cuentas contables que intervienen según la documentación respaldatoria.",
    "Revisar el uso correcto de las columnas Debe y Haber antes de mayorizar.",
    "Practicar la determinación de saldos deudores y acreedores en el Libro Mayor.",
    "Diferenciar claramente el IVA en operaciones de compras y ventas."
  ]
}`;

function construirPromptUsuario(params: GenerarSugerenciaEntregaParams): string {
  const lineasErrores = params.errores.map((e, idx) => {
    const partes: string[] = [`${idx + 1}. [${e.plantilla}] ${e.tipoError}`];

    const motivo = e.detalle.motivo;
    if (typeof motivo === 'string' && motivo.trim()) {
      partes.push(`Motivo: ${motivo.trim()}`);
    }

    const esperado = e.detalle.esperado;
    const obtenido = e.detalle.obtenido;
    if (esperado !== undefined && obtenido !== undefined) {
      partes.push(`Esperado: "${esperado}" | Ingresado: "${obtenido}"`);
    }

    return partes.join(' - ');
  });

  return (
    `Ejercicio: "${params.tituloEjercicio}"\n` +
    `Observaciones detectadas en la resolución del alumno (${params.errores.length} en total):\n` +
    lineasErrores.join('\n') +
    '\n\nEscribí la devolución pedagógica para el alumno en español argentino (máximo 480 caracteres, sin metanálisis):'
  );
}

function construirPromptUsuarioCurso(params: GenerarDiagnosticoCursoParams): string {
  const lineasDistribucion = params.distribucionErrores
    .map(
      (d) =>
        `- ${d.label}: ${d.porcentaje}% de las entregas del curso (${d.cantidadEntregasAfectadas} entregas afectadas)`
    )
    .join('\n');

  return (
    `Curso: ${params.nombreCurso}\n` +
    `Entregas analizadas: ${params.totalEntregas}\n` +
    `Total de observaciones contables: ${params.totalErrores}\n` +
    `Dificultad predominante: ${params.errorPrincipal}\n` +
    `Plantilla contable con mayor concentración de errores: ${params.plantillaPrincipal}\n\n` +
    `Distribución de frecuencias por tema:\n${lineasDistribucion}\n\n` +
    `Generá el diagnóstico pedagógico en formato JSON (con las propiedades "resumenGeneral" y "cosasAReforzar"):`
  );
}

function normalizarLongitud(texto: string, maxLongitud: number = 500): string {
  if (texto.length <= maxLongitud) {
    return texto;
  }

  const recorte = texto.slice(0, maxLongitud - 3);
  const ultimoPunto = recorte.lastIndexOf('.');
  if (ultimoPunto > 200) {
    return recorte.slice(0, ultimoPunto + 1).trim();
  }

  return recorte.trim() + '...';
}

export class GroqCorreccionIaProvider implements ICorreccionIaProvider {
  private client?: OpenAI;

  private getClient(): OpenAI {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new ExternalServiceError(
        'Groq',
        'El servicio de asistencia con IA no se encuentra configurado (falta GROQ_API_KEY).'
      );
    }

    if (!this.client) {
      this.client = new OpenAI({
        apiKey,
        baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
      });
    }

    return this.client;
  }

  async generarSugerenciaRetroalimentacion(
    params: GenerarSugerenciaEntregaParams
  ): Promise<string> {
    if (!params.errores || params.errores.length === 0) {
      throw new BadRequestError('No se proporcionaron errores para generar la sugerencia.');
    }

    const client = this.getClient();
    const modelo = process.env.GROQ_MODEL_GENERACION || 'llama-3.3-70b-versatile';

    const promptUsuario = construirPromptUsuario(params);

    try {
      const completion = await client.chat.completions.create({
        model: modelo,
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          { role: 'user', content: promptUsuario },
        ],
        temperature: 0.2,
      });

      const rawText = completion.choices[0]?.message?.content?.trim() ?? '';

      if (!rawText) {
        throw new ExternalServiceError(
          'Groq',
          'El servicio de asistencia con IA no devolvió ninguna sugerencia.'
        );
      }

      const limpio = rawText
        .replace(/^```(?:markdown)?\s*\n/i, '')
        .replace(/\n```\s*$/i, '')
        .replace(/[*_#`]/g, '')
        .trim();

      return normalizarLongitud(limpio, 500);
    } catch (error: unknown) {
      if (error instanceof ExternalServiceError || error instanceof BadRequestError) {
        throw error;
      }

      console.error('Error durante la sugerencia de corrección con Groq:', error);

      const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        throw new ExternalServiceError(
          'Groq',
          'El servicio de asistencia con IA está experimentando alta demanda. Podés reintentar en unos segundos o continuar manualmente.'
        );
      }

      throw new ExternalServiceError(
        'Groq',
        'El servicio de asistencia con IA no se encuentra disponible temporalmente. Podés continuar con la corrección manual.',
        error
      );
    }
  }

  async generarDiagnosticoCurso(
    params: GenerarDiagnosticoCursoParams
  ): Promise<DiagnosticoCursoIaResult> {
    const client = this.getClient();
    const modelo = process.env.GROQ_MODEL_GENERACION || 'llama-3.3-70b-versatile';
    const promptUsuario = construirPromptUsuarioCurso(params);

    try {
      let rawText = '';
      try {
        const completion = await client.chat.completions.create({
          model: modelo,
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION_CURSO },
            { role: 'user', content: promptUsuario },
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' },
        });

        rawText = completion.choices[0]?.message?.content?.trim() ?? '';
      } catch (apiError: unknown) {
        const errMsg = apiError instanceof Error ? apiError.message : String(apiError);
        const isJsonValidateFailed =
          errMsg.includes('validate JSON') || errMsg.includes('json_validate_failed');

        if (isJsonValidateFailed) {
          // Fallback resiliente: si el validador JSON en el borde de Groq falla, reintentar sin forzar response_format y parsear de forma tolerante
          const fallback = await client.chat.completions.create({
            model: modelo,
            messages: [
              { role: 'system', content: SYSTEM_INSTRUCTION_CURSO },
              { role: 'user', content: promptUsuario },
            ],
            temperature: 0.1,
          });

          rawText = fallback.choices[0]?.message?.content?.trim() ?? '';
        } else {
          throw apiError;
        }
      }

      if (!rawText) {
        throw new ExternalServiceError(
          'Groq',
          'El servicio de asistencia con IA no devolvió ningún diagnóstico.'
        );
      }

      const limpio = rawText
        .replace(/^```(?:json)?\s*\n/i, '')
        .replace(/\n```\s*$/i, '')
        .trim();

      let parsed: unknown = null;
      try {
        parsed = JSON.parse(limpio);
      } catch {
        const match = limpio.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch {
            parsed = null;
          }
        }
      }

      if (!parsed || typeof parsed !== 'object') {
        throw new ExternalServiceError(
          'Groq',
          'La respuesta del servicio de asistencia con IA no tiene un formato JSON válido.'
        );
      }

      const resObj = parsed as {
        resumenGeneral?: unknown;
        cosasAReforzar?: unknown;
      };

      const resumenGeneral =
        typeof resObj.resumenGeneral === 'string' && resObj.resumenGeneral.trim()
          ? normalizarLongitud(resObj.resumenGeneral.trim(), 400)
          : 'Los ejercicios analizados muestran que la principal dificultad radica en la delimitación de las cuentas y el balance de asientos.';

      let cosasAReforzar: string[] = [];
      if (Array.isArray(resObj.cosasAReforzar)) {
        cosasAReforzar = resObj.cosasAReforzar
          .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
          .map((c) => normalizarLongitud(c.trim(), 150))
          .slice(0, 4);
      }

      if (cosasAReforzar.length === 0) {
        cosasAReforzar = [
          'Identificar las cuentas contables que intervienen según la documentación respaldatoria.',
          'Revisar el uso correcto de las columnas Debe y Haber antes de mayorizar.',
          'Practicar la determinación de saldos deudores y acreedores en el Libro Mayor.',
        ];
      }

      return {
        resumenGeneral,
        cosasAReforzar,
      };
    } catch (error: unknown) {
      if (error instanceof ExternalServiceError || error instanceof BadRequestError) {
        throw error;
      }

      console.error('Error durante la generación de diagnóstico de curso con Groq:', error);

      const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        throw new ExternalServiceError(
          'Groq',
          'El servicio de asistencia con IA está experimentando alta demanda. Podés reintentar en unos segundos.'
        );
      }

      throw new ExternalServiceError(
        'Groq',
        'El servicio de asistencia con IA no se encuentra disponible temporalmente.',
        error
      );
    }
  }
}

export class MockCorreccionIaProvider implements ICorreccionIaProvider {
  async generarSugerenciaRetroalimentacion(
    _params: GenerarSugerenciaEntregaParams
  ): Promise<string> {
    return (
      'Revisá la registración de las cuentas en el Libro Mayor y Diario. ' +
      'Asegurate de que los importes imputados en el Debe y en el Haber coincidan con los comprobantes respaldatorios ' +
      'y que las cuentas mayorizadas determinen su saldo según la diferencia de sus columnas.'
    );
  }

  async generarDiagnosticoCurso(
    _params: GenerarDiagnosticoCursoParams
  ): Promise<DiagnosticoCursoIaResult> {
    return {
      resumenGeneral:
        'Los ejercicios analizados muestran que la principal dificultad radica en la delimitación de las cuentas que intervienen en el hecho económico y el balance de asientos en el Libro Diario, repercutiendo en la posterior mayorización y cálculo de saldos.',
      cosasAReforzar: [
        'Identificar las cuentas contables que intervienen según la documentación respaldatoria.',
        'Revisar el uso correcto de las columnas Debe y Haber antes de mayorizar.',
        'Practicar la clasificación y determinación de saldos (deudor / acreedor).',
        'Diferenciar claramente el tratamiento de IVA en operaciones de compras y ventas.',
      ],
    };
  }
}

export class DelegatingCorreccionIaService implements ICorreccionIaProvider {
  private realProvider = new GroqCorreccionIaProvider();
  private mockProvider = new MockCorreccionIaProvider();

  async generarSugerenciaRetroalimentacion(
    params: GenerarSugerenciaEntregaParams
  ): Promise<string> {
    if (process.env.CORRECCION_IA_MOCK_ENABLED === 'true') {
      return this.mockProvider.generarSugerenciaRetroalimentacion(params);
    }
    return this.realProvider.generarSugerenciaRetroalimentacion(params);
  }

  async generarDiagnosticoCurso(
    params: GenerarDiagnosticoCursoParams
  ): Promise<DiagnosticoCursoIaResult> {
    if (process.env.CORRECCION_IA_MOCK_ENABLED === 'true') {
      return this.mockProvider.generarDiagnosticoCurso(params);
    }
    return this.realProvider.generarDiagnosticoCurso(params);
  }
}

export const correccionIaService: ICorreccionIaProvider = new DelegatingCorreccionIaService();
