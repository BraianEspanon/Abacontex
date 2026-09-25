import 'dotenv/config';
import OpenAI from 'openai';
import { construirPromptGeneracion } from './prompt.builder';
import { ConstruirPromptParams } from './generacion.types';

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.error('❌ ERROR: La variable de entorno GROQ_API_KEY no está definida en .env');
  process.exit(1);
}

const groqClient = new OpenAI({
  apiKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODELO = process.env.GROQ_MODEL_GENERACION || 'openai/gpt-oss-120b';

const CASOS_PRUEBA: { nombre: string; params: ConstruirPromptParams }[] = [
  {
    nombre: 'Caso 1: Compras y Ventas Básicas (5.° Año S.R.L. - Intermedio - IVA + Intereses)',
    params: {
      cursoAño: 5,
      tipoEjercicio: 'COMPRAS_VENTAS_BASICAS',
      dificultad: 'INTERMEDIO',
      contenidosAdicionales: ['IVA', 'INTERESES'],
      contextoAdicional:
        'Empresa dedicada a la venta de artículos de librería y papelería comercial.',
    },
  },
  {
    nombre: 'Caso 2: Operaciones Comerciales Integradas (6.° Año S.A. - Avanzado)',
    params: {
      cursoAño: 6,
      tipoEjercicio: 'OPERACIONES_COMERCIALES_INTEGRADAS',
      dificultad: 'AVANZADO',
      contenidosAdicionales: [],
      contextoAdicional: 'Distribuidora mayorista de electrodomésticos y tecnología.',
    },
  },
  {
    nombre: 'Caso 3: Ajustes y Hoja de Trabajo (5.° Año S.R.L. - Intermedio)',
    params: {
      cursoAño: 5,
      tipoEjercicio: 'AJUSTES_HOJA_TRABAJO',
      dificultad: 'INTERMEDIO',
      contenidosAdicionales: [],
    },
  },
  {
    nombre: 'Caso 4: Costos y Proceso Productivo (6.° Año S.A. - Avanzado)',
    params: {
      cursoAño: 6,
      tipoEjercicio: 'COSTOS_PROCESO_PRODUCTIVO',
      dificultad: 'AVANZADO',
      contenidosAdicionales: [],
      contextoAdicional: 'Fábrica de indumentaria deportiva y calzado.',
    },
  },
];

async function resolverModelo(): Promise<string> {
  try {
    const list = await groqClient.models.list();
    const modelIds = list.data.map((m) => m.id);
    console.log('📋 Modelos disponibles en tu cuenta de Groq:');
    console.log(modelIds.map((id) => `  - ${id}`).join('\n'));
    console.log('');

    // Si el configurado está disponible, usarlo
    if (modelIds.includes(MODELO)) {
      return MODELO;
    }

    // Si no, buscar alternativas comunes
    const candidatos = [
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'qwen/qwen3.8-27b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-70b-8192',
    ];

    for (const c of candidatos) {
      if (modelIds.includes(c)) {
        console.warn(
          `⚠️  Modelo '${MODELO}' no encontrado. Usando alternativa disponible: [${c}]\n`
        );
        return c;
      }
    }

    // Fallback al primer modelo disponible
    const primerModelo = modelIds[0];
    if (primerModelo) {
      console.warn(`⚠️  Usando primer modelo disponible: [${primerModelo}]\n`);
      return primerModelo;
    }
  } catch (err) {
    console.warn(
      '⚠️ No se pudo consultar la lista de modelos de Groq, usando valor por defecto:',
      err
    );
  }

  return MODELO;
}

async function generarEjercicioGroq(
  modelo: string,
  systemInstruction: string,
  userPrompt: string
): Promise<string> {
  const completion = await groqClient.chat.completions.create({
    model: modelo,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
  });

  const texto = completion.choices[0]?.message?.content?.trim() ?? '';
  return texto;
}

async function ejecutarPoC() {
  console.log(`=== INICIANDO PoC DE GENERACIÓN CON GROQ (SDK OpenAI) ===\n`);

  const modeloActivo = await resolverModelo();
  console.log(`🚀 Modelo seleccionado para la prueba: [${modeloActivo}]\n`);

  for (const caso of CASOS_PRUEBA) {
    console.log(`------------------------------------------------------------`);
    console.log(`PROBANDO: ${caso.nombre}`);
    console.log(`------------------------------------------------------------`);

    const { systemInstruction, userPrompt } = construirPromptGeneracion(caso.params);

    const inicio = Date.now();
    try {
      const texto = await generarEjercicioGroq(modeloActivo, systemInstruction, userPrompt);
      const duracionMs = Date.now() - inicio;

      console.log(`✅ Generado con éxito`);
      console.log(`⏱️  Tiempo de respuesta: ${duracionMs} ms`);
      console.log(`📏 Longitud generada: ${texto.length} caracteres`);
      console.log(`\n--- VISTA PREVIA DEL ENUNCIADO GENERADO ---\n`);
      console.log(texto);
      console.log(`\n------------------------------------------------------------\n`);
    } catch (error) {
      console.error(`❌ Error generando ${caso.nombre}:`, error);
    }
  }

  console.log('=== PoC FINALIZADA ===');
}

ejecutarPoC().catch(console.error);
