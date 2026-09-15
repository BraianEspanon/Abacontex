import { aiClient } from './gemini.client';
import { BadRequestError } from '../../errors/bad-request-error';
import type { ExtraccionDocumentoResult, IOcrProvider } from './ocr.types';

const SYSTEM_INSTRUCTION = `Sos un asistente especializado en digitalización y transcripción de documentos educativos contables para el sistema Abacontex.
Tu objetivo es transcribir fielmente el enunciado del ejercicio a partir de la imagen o documento provisto.

REGLAS DE EXTRACCIÓN:
1. Formato de salida:
   - Devolvé ÚNICAMENTE el texto del enunciado formateado en Markdown estándar (GFM).
   - No agregues introducciones conversacionales, saludos, ni despedidas.
   - No envuelvas toda la respuesta en bloques de código (no uses \`\`\`markdown al inicio y final).
2. Párrafos, incisos y saltos de línea:
   - Cada inciso, operación, ítem o consigna (ej. a), b), c)... o 1-, 2-... o 1), 2)...) DEBE estar separado obligatoriamente por una línea en blanco (doble salto de línea) para que Markdown no los colapse en el mismo renglón.
3. Signos monetarios y números:
   - Escribí el signo pesos de forma natural con un espacio antes del número (ej. $ 150.000,00 o $ 200.000). NO uses barra invertida ni escapes (usá "$" puro).
   - Conservá estrictamente el formato de puntuación argentino: punto para miles y coma para decimales.
4. Tablas contables:
   - Usá sintaxis de tablas Markdown con pipes (|).
   - Alineá los importes numéricos a la derecha.
   - Si una celda no tiene importe o contiene un guión en el original, colocá "-".
   - Asegurate de que los totales de la tabla coincidan exactamente con la imagen.
5. Consignas, comprobantes y jerarquía:
   - Conservá la estructura jerárquica de listas y viñetas.
   - Resaltá en negrita comprobantes comerciales (ej. **Factura Original**, **Duplicado Factura A**).
   - Mantené los títulos y subtítulos institucionales del encabezado con ### o **.`;

const DEFAULT_MODELOS = ['gemini-3.6-flash', 'gemini-3.7-flash'];
const MAX_REINTENTOS_POR_MODELO = 2;

function getModelosCandidatos(): string[] {
  const envModels = process.env.GEMINI_OCR_MODELS;
  if (envModels) {
    const parsed = envModels
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    if (parsed.length > 0) return parsed;
  }
  return DEFAULT_MODELOS;
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function esErrorAltaDemanda(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const err = error as Record<string, unknown>;
  const innerError =
    typeof err.error === 'object' && err.error !== null
      ? (err.error as Record<string, unknown>)
      : undefined;

  const status = err.status ?? err.code ?? err.statusCode ?? innerError?.status ?? innerError?.code;
  const message =
    typeof err.message === 'string'
      ? err.message.toLowerCase()
      : typeof innerError?.message === 'string'
        ? innerError.message.toLowerCase()
        : '';

  return (
    status === 503 ||
    status === 429 ||
    status === '503' ||
    status === '429' ||
    status === 'UNAVAILABLE' ||
    message.includes('high demand') ||
    message.includes('unavailable') ||
    message.includes('resource exhausted')
  );
}

export class GeminiOcrProvider implements IOcrProvider {
  async extraerTexto(buffer: Buffer, mimetype: string): Promise<ExtraccionDocumentoResult> {
    if (!process.env.GEMINI_API_KEY) {
      throw new BadRequestError(
        'El servicio de digitalización no se encuentra configurado (falta GEMINI_API_KEY).'
      );
    }

    const base64Data = buffer.toString('base64');
    let ultimoError: unknown = null;

    const modelos = getModelosCandidatos();

    for (const modelo of modelos) {
      for (let intento = 1; intento <= MAX_REINTENTOS_POR_MODELO; intento++) {
        try {
          const response = await aiClient.models.generateContent({
            model: modelo,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      data: base64Data,
                      mimeType: mimetype,
                    },
                  },
                  {
                    text: 'Transcribí el enunciado del ejercicio contable siguiendo las reglas del sistema.',
                  },
                ],
              },
            ],
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.1,
            },
          });

          const rawText = response.text?.trim();

          if (!rawText) {
            throw new BadRequestError(
              'No se pudo extraer texto del archivo. Verifique que la imagen sea legible.'
            );
          }

          const cleanedText = rawText
            .replace(/^```(?:markdown)?\s*\n/i, '')
            .replace(/\n```\s*$/i, '')
            .trim();

          return {
            enunciadoTexto: cleanedText,
          };
        } catch (error: unknown) {
          if (error instanceof BadRequestError) {
            throw error;
          }

          ultimoError = error;

          if (esErrorAltaDemanda(error)) {
            console.warn(
              `Modelo ${modelo} con alta demanda/503 (intento ${intento}/${MAX_REINTENTOS_POR_MODELO}). Esperando antes de reintentar...`
            );
            await esperar(intento * 1500);
            continue;
          }

          // Si el error no es de saturación/demanda, no insistimos con el mismo modelo
          break;
        }
      }
    }

    console.error('Error definitivo durante la digitalización con Gemini:', ultimoError);

    if (esErrorAltaDemanda(ultimoError)) {
      throw new BadRequestError(
        'El servicio de digitalización está experimentando una alta demanda temporal. Por favor, intentá nuevamente en unos segundos.'
      );
    }

    throw new BadRequestError(
      'No fue posible digitalizar el documento. Intente nuevamente o verifique que el archivo sea legible.'
    );
  }
}

export class MockOcrProvider implements IOcrProvider {
  async extraerTexto(_buffer: Buffer, _mimetype: string): Promise<ExtraccionDocumentoResult> {
    return {
      enunciadoTexto:
        '1. 01/03/2024 - Se inicia la actividad comercial con un capital de $ 500.000 en efectivo y $ 1.200.000 en mercaderías.\n\n' +
        '2. 05/03/2024 - Se compran mercaderías por $ 300.000 abonando el 50% con cheque de Banco Nación y el resto en cuenta corriente a 30 días.\n\n' +
        '3. 12/03/2024 - Se venden mercaderías por $ 450.000 en efectivo. El costo de las mercaderías vendidas fue de $ 200.000.',
    };
  }
}

export class DelegatingOcrService implements IOcrProvider {
  private geminiProvider = new GeminiOcrProvider();
  private mockProvider = new MockOcrProvider();

  async extraerTexto(buffer: Buffer, mimetype: string): Promise<ExtraccionDocumentoResult> {
    if (process.env.OCR_MOCK_ENABLED === 'true') {
      return this.mockProvider.extraerTexto(buffer, mimetype);
    }
    return this.geminiProvider.extraerTexto(buffer, mimetype);
  }
}

export const ocrService: IOcrProvider = new DelegatingOcrService();
