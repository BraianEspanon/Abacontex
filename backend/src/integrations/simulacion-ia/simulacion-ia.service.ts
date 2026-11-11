import OpenAI from 'openai';
import { BadRequestError } from '../../errors/bad-request-error';
import {
  CLASIFICACION_POR_PUNTOS,
  ClasificacionOpcionSimulacion,
} from '../../constants/simulacion.constants';
import { construirPromptGeneracionSimulacion } from './prompt.builder';
import { crearMockEstructuraSimulacion } from './simulacion-ia.mock';
import type {
  EstructuraSimulacionGeneradaIA,
  GenerarSimulacionParams,
  ISimulacionGeneratorProvider,
} from './simulacion-ia.types';

function repararJsonLlm(jsonStr: string): string {
  let res = jsonStr;
  // 1. Eliminar comas finales antes de } o ]
  res = res.replace(/,(\s*[}\]])/g, '$1');
  // 2. Insertar comas faltantes entre objetos } {
  res = res.replace(/}(\s*){/g, '},$1{');
  // 3. Insertar comas faltantes entre arrays y objetos ] {
  res = res.replace(/](\s*){/g, '],$1{');
  return res;
}

export class GroqSimulacionProvider implements ISimulacionGeneratorProvider {
  private client?: OpenAI;

  private getClient(): OpenAI {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new BadRequestError(
        'El servicio de IA para simulaciones no se encuentra configurado (falta GROQ_API_KEY).'
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

  async generarEstructuraSimulacion(
    params: GenerarSimulacionParams
  ): Promise<EstructuraSimulacionGeneradaIA> {
    const client = this.getClient();
    const modelo = process.env.GROQ_MODEL_SIMULACION || 'qwen/qwen3.8-27b';

    const { systemInstruction, userPrompt } = construirPromptGeneracionSimulacion(params);
    const supportsJsonMode = !modelo.toLowerCase().includes('gpt-oss');

    try {
      const completion = await client.chat.completions.create({
        model: modelo,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4500,
        ...(supportsJsonMode ? { response_format: { type: 'json_object' } } : {}),
      });

      const rawText = completion.choices[0]?.message?.content?.trim() ?? '';
      if (!rawText) {
        throw new BadRequestError('La IA no devolvió contenido para la simulación.');
      }

      simulacionIaService.setUltimoJsonCrudo(rawText);

      // Extraer el bloque JSON más externo en caso de que venga con bloques markdown o texto adicional
      let jsonText = rawText;
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      let parsed: EstructuraSimulacionGeneradaIA;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        try {
          const reparado = repararJsonLlm(jsonText);
          parsed = JSON.parse(reparado);
        } catch (syntaxErr: unknown) {
          const errObj = syntaxErr as Error;
          console.error('\n❌ Error de sintaxis en el JSON del modelo:', errObj.message);
          const matchPos = errObj.message.match(/position (\d+)/);
          if (matchPos && matchPos[1]) {
            const pos = parseInt(matchPos[1], 10);
            console.error('Fragmento con el error de sintaxis:');
            console.error(
              jsonText.slice(Math.max(0, pos - 120), Math.min(jsonText.length, pos + 120))
            );
          }
          throw syntaxErr;
        }
      }

      // Sanitizar eventos y normalizar claves compactas
      parsed.eventos = parsed.eventos
        .filter((ev) => typeof ev === 'object' && ev !== null && typeof ev.id === 'string')
        .map((ev) => {
          const evAny = ev as unknown as Record<string, unknown>;
          if (evAny.roles && !ev.rolesHabilitados) {
            ev.rolesHabilitados = evAny.roles as string[];
          }
          if (evAny.sig && !ev.siguienteEventoId) {
            ev.siguienteEventoId = String(evAny.sig);
          }
          ev.esSorpresa = ev.esSorpresa === true;

          if (ev.opciones && Array.isArray(ev.opciones)) {
            ev.opciones = ev.opciones
              .filter(
                (op) => typeof op === 'object' && op !== null && typeof op.texto === 'string'
              )
              .map((op) => {
                const opAny = op as unknown as Record<string, unknown>;
                if (opAny.sig && !op.siguienteEventoId) {
                  op.siguienteEventoId = String(opAny.sig);
                }
                if (opAny.impacto && !op.cambiosSimulados) {
                  op.cambiosSimulados = opAny.impacto as Record<string, unknown>;
                }
                if (typeof opAny.pts === 'number') {
                  op.clasificacion =
                    CLASIFICACION_POR_PUNTOS[opAny.pts] ?? ClasificacionOpcionSimulacion.ADECUADA;
                } else if (typeof opAny.eval === 'number') {
                  op.clasificacion =
                    CLASIFICACION_POR_PUNTOS[opAny.eval] ?? ClasificacionOpcionSimulacion.ADECUADA;
                } else if (!op.clasificacion) {
                  op.clasificacion = ClasificacionOpcionSimulacion.ADECUADA;
                }
                delete opAny.sig;
                delete opAny.impacto;
                delete opAny.pts;
                delete opAny.eval;
                return op;
              });
          }

          delete evAny.roles;
          delete evAny.sig;
          return ev;
        });

      if (parsed.eventos.length === 0) {
        throw new BadRequestError(
          'La estructura de la simulación generada es inválida o no contiene eventos.'
        );
      }

      return parsed;
    } catch (error: unknown) {
      if (error instanceof BadRequestError) throw error;
      console.error('Error al generar estructura de simulación con IA:', error);
      throw new BadRequestError(
        'Ocurrió un error al generar la simulación con inteligencia artificial. Intente nuevamente.'
      );
    }
  }
}

export class MockSimulacionProvider implements ISimulacionGeneratorProvider {
  async generarEstructuraSimulacion(
    params: GenerarSimulacionParams
  ): Promise<EstructuraSimulacionGeneradaIA> {
    const mock = crearMockEstructuraSimulacion(params);
    simulacionIaService.setUltimoJsonCrudo(JSON.stringify(mock, null, 2));
    return mock;
  }
}

export function getSimulacionGeneratorProvider(): ISimulacionGeneratorProvider {
  const isMock = process.env.SIMULACION_IA_MOCK_ENABLED === 'true' || !process.env.GROQ_API_KEY;

  if (isMock) {
    return new MockSimulacionProvider();
  }

  return new GroqSimulacionProvider();
}

export class SimulacionIaService {
  private provider = getSimulacionGeneratorProvider();
  private ultimoJsonCrudo?: string;

  async generarEstructuraParaCurso(
    params: GenerarSimulacionParams
  ): Promise<EstructuraSimulacionGeneradaIA> {
    return this.provider.generarEstructuraSimulacion(params);
  }

  getUltimoJsonCrudo(): string | undefined {
    return this.ultimoJsonCrudo;
  }

  setUltimoJsonCrudo(raw: string): void {
    this.ultimoJsonCrudo = raw;
  }
}

export const simulacionIaService = new SimulacionIaService();
