import OpenAI from 'openai';
import { BadRequestError } from '../../errors/bad-request-error';
import { construirPromptGeneracion } from './prompt.builder';
import type {
  ConstruirPromptParams,
  GeneracionEnunciadoResult,
  IEjercicioGeneratorProvider,
} from './generacion.types';

export class GroqGeneracionProvider implements IEjercicioGeneratorProvider {
  private client?: OpenAI;

  private getClient(): OpenAI {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new BadRequestError(
        'El servicio de generación de ejercicios no se encuentra configurado (falta GROQ_API_KEY).'
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

  async generarEnunciado(params: ConstruirPromptParams): Promise<GeneracionEnunciadoResult> {
    const client = this.getClient();
    const modelo = process.env.GROQ_MODEL_GENERACION || 'openai/gpt-oss-120b';

    const { systemInstruction, userPrompt } = construirPromptGeneracion(params);

    try {
      const completion = await client.chat.completions.create({
        model: modelo,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      });

      const rawText = completion.choices[0]?.message?.content?.trim() ?? '';

      if (!rawText) {
        throw new BadRequestError(
          'No se pudo generar el enunciado. Por favor, intentá nuevamente.'
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

      console.error('Error durante la generación de ejercicio con Groq:', error);

      const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        throw new BadRequestError(
          'El servicio de generación está experimentando una alta demanda temporal. Por favor, intentá nuevamente en unos segundos.'
        );
      }

      throw new BadRequestError(
        'Ocurrió un error al generar el enunciado con inteligencia artificial. Intente nuevamente.'
      );
    }
  }
}

export class MockGeneracionProvider implements IEjercicioGeneratorProvider {
  async generarEnunciado(params: ConstruirPromptParams): Promise<GeneracionEnunciadoResult> {
    const empresa =
      params.cursoAño === 6 ? 'Industrial del Plata S.A.' : 'Distribuidora del Centro S.R.L.';
    const condicionIva = 'Responsable Inscripto';

    const mockText =
      `**${empresa}**  \n` +
      `Rubro: Comercio general.  \n` +
      `Condición frente al IVA: ${condicionIva}.  \n\n` +
      `1. 02/05 – **Factura Original N.° 001** por compra de 100 unidades de mercaderías a $ 500,00 c/u. Condiciones: IVA 21%. Se abona 50% al contado en efectivo y el 50% a 30 días en cuenta corriente comercial.  \n\n` +
      `2. 10/05 – **Factura Duplicado N.° 010** por venta de 60 unidades a $ 900,00 c/u. Condiciones: IVA 21%. Se cobra 40% al contado y el saldo con cheque de pago diferido a 30 días.  \n\n` +
      `3. 15/05 – **Recibo Original N.° 005** cancelando el saldo adeudado de la operación 1 mediante transferencia bancaria.  \n\n` +
      `4. 20/05 – **Recibo Duplicado N.° 012** depositando el cheque diferido en cuenta corriente de Banco Nación.  \n\n` +
      `---\n\n` +
      `### Se pide:\n` +
      `Registrar en el Libro Diario general cada una de las operaciones descritas y determinar los saldos finales al cierre.`;

    return {
      enunciadoTexto: mockText,
    };
  }
}

export class DelegatingGeneracionService implements IEjercicioGeneratorProvider {
  private realProvider = new GroqGeneracionProvider();
  private mockProvider = new MockGeneracionProvider();

  async generarEnunciado(params: ConstruirPromptParams): Promise<GeneracionEnunciadoResult> {
    if (process.env.GENERACION_MOCK_ENABLED === 'true') {
      return this.mockProvider.generarEnunciado(params);
    }
    return this.realProvider.generarEnunciado(params);
  }
}

export const generacionService: IEjercicioGeneratorProvider = new DelegatingGeneracionService();
