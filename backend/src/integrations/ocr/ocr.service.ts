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

export class GeminiOcrProvider implements IOcrProvider {
  private readonly modelName = 'gemini-3.6-flash';

  async extraerTexto(buffer: Buffer, mimetype: string): Promise<ExtraccionDocumentoResult> {
    if (!process.env.GEMINI_API_KEY) {
      throw new BadRequestError(
        'El servicio de digitalización no se encuentra configurado (falta GEMINI_API_KEY).'
      );
    }

    try {
      const response = await aiClient.models.generateContent({
        model: this.modelName,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: buffer.toString('base64'),
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

      // Si el modelo envolvió la respuesta en ```markdown ... ```, limpiamos la envoltura
      const cleanedText = rawText
        .replace(/^```(?:markdown)?\s*\n/i, '')
        .replace(/\n```\s*$/i, '')
        .trim();

      return {
        enunciadoTexto: cleanedText,
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }

      console.error('Error durante la digitalización con Gemini:', error);
      throw new BadRequestError(
        'No fue posible digitalizar el documento. Intente nuevamente o verifique que el archivo sea legible.'
      );
    }
  }
}

export const ocrService = new GeminiOcrProvider();
