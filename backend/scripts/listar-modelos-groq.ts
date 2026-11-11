import dotenv from 'dotenv';
import path from 'path';
import OpenAI from 'openai';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('❌ No se encontró GROQ_API_KEY en las variables de entorno (.env).');
    process.exit(1);
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
  });

  try {
    const res = await client.models.list();
    console.log('\n======================================================================');
    console.log('📋 MODELOS REALMENTE HABILITADOS EN TU API KEY DE GROQ:');
    console.log('======================================================================');
    const sorted = res.data.map((m) => m.id).sort();
    for (const id of sorted) {
      console.log(`🔹 ${id}`);
    }
    console.log('======================================================================');
    console.log(`Total: ${sorted.length} modelos encontrados.`);
    console.log('💡 Podés copiar cualquiera de estos nombres exactos en tu GROQ_MODEL_SIMULACION');
    console.log('======================================================================\n');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Error al consultar la API de Groq:', errorMsg);
  }
}

main();
