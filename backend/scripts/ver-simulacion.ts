import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (process.argv.includes('--mock')) {
  process.env.SIMULACION_IA_MOCK_ENABLED = 'true';
} else {
  delete process.env.SIMULACION_IA_MOCK_ENABLED;
}

import { simulacionIaService } from '../src/integrations/simulacion-ia/simulacion-ia.service';
import { construirPromptGeneracionSimulacion } from '../src/integrations/simulacion-ia/prompt.builder';
import { instanciarEstructuraParaEmpresa } from '../src/utils/simulacion.util';
import type { EmpresaSimulacionEntity } from '../src/repositories/simulacion.repository';
import { Prisma } from '@prisma/client';
import { PUNTOS_POR_CLASIFICACION } from '../src/constants/simulacion.constants';

async function main() {
  const isMock = process.env.SIMULACION_IA_MOCK_ENABLED === 'true' || !process.env.GROQ_API_KEY;
  const modeloConfigurado = process.env.GROQ_MODEL_SIMULACION || 'qwen/qwen3.8-27b';

  console.log('\n======================================================================');
  console.log('🚀 GENERADOR Y VISUALIZADOR DE SIMULACIÓN - ABACONTEX');
  console.log('======================================================================');
  if (isMock) {
    console.log('📦 PROVEEDOR: MOCK ESTRUCTURADO (Simulación sintética local)');
    console.log('💡 Tip: Para usar la IA real asegurate de tener GROQ_API_KEY en tu .env');
  } else {
    console.log('🌐 PROVEEDOR: API REAL DE GROQ');
    console.log(`🤖 MODELO:    ${modeloConfigurado}`);
  }
  console.log('======================================================================\n');

  // Empresa de prueba realista
  const empresaPrueba: EmpresaSimulacionEntity = {
    id: 1,
    idCurso: 1,
    idCicloLectivo: 1,
    nombre: 'Aura Mobiliario S.A.',
    actividad: 'Fabricación de muebles de diseño',
    logoUrl: null,
    logoPublicId: null,
    puntos: 150,
    fechaCreacion: new Date(),
    activo: true,
    alumnos: [
      {
        id: 'user-1',
        idCurso: 1,
        idRolEmpresa: 1,
        idEmpresa: 1,
        usuario: {
          id: 'u1',
          keycloakId: 'k1',
          email: 'coo@aura.com',
          nombre: 'Martín',
          apellido: 'Gómez',
          rolSistemaId: 3,
          fotoPerfilUrl: null,
          fotoPerfilPublicId: null,
          fechaAlta: new Date(),
        },
        rolEmpresa: { idRol: 1, nombreRol: 'COO', descripcion: 'Operaciones y Producción' },
      },
      {
        id: 'user-2',
        idCurso: 1,
        idRolEmpresa: 2,
        idEmpresa: 1,
        usuario: {
          id: 'u2',
          keycloakId: 'k2',
          email: 'cco@aura.com',
          nombre: 'Lucía',
          apellido: 'Pérez',
          rolSistemaId: 3,
          fotoPerfilUrl: null,
          fotoPerfilPublicId: null,
          fechaAlta: new Date(),
        },
        rolEmpresa: { idRol: 2, nombreRol: 'CCO', descripcion: 'Comunicación y Clientes' },
      },
      {
        id: 'user-3',
        idCurso: 1,
        idRolEmpresa: 3,
        idEmpresa: 1,
        usuario: {
          id: 'u3',
          keycloakId: 'k3',
          email: 'cfo@aura.com',
          nombre: 'Santiago',
          apellido: 'Díaz',
          rolSistemaId: 3,
          fotoPerfilUrl: null,
          fotoPerfilPublicId: null,
          fechaAlta: new Date(),
        },
        rolEmpresa: { idRol: 3, nombreRol: 'CFO', descripcion: 'Finanzas' },
      },
      {
        id: 'user-4',
        idCurso: 1,
        idRolEmpresa: 4,
        idEmpresa: 1,
        usuario: {
          id: 'u4',
          keycloakId: 'k4',
          email: 'ceo@aura.com',
          nombre: 'Sofía',
          apellido: 'Rodríguez',
          rolSistemaId: 3,
          fotoPerfilUrl: null,
          fotoPerfilPublicId: null,
          fechaAlta: new Date(),
        },
        rolEmpresa: { idRol: 4, nombreRol: 'CEO', descripcion: 'Dirección General' },
      },
    ],
    productos: [
      {
        nombre: 'Escritorio Ergonómico Pro',
        stock: 60,
        precioVenta: new Prisma.Decimal(45000),
        activo: true,
      },
    ],
    ordenesProduccion: [
      {
        cantidad: 60,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
        historialEstados: [
          {
            estado: { nombre: 'En Producción' },
            fechaInicio: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
            fechaFin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // Duró 6 días
          },
        ],
      },
    ],
  };

  const params = {
    flujo: 'Crecimiento y expansión' as const,
    dificultad: 'AVANZADA' as const,
    duracion: 'LARGA' as const,
    eventosSorpresa: true,
    usarDatosEmpresa: true,
    tipoEventoSorpresa: 'Cambio del cliente' as const,
    rolesDisponibles: ['COO', 'CCO', 'CFO', 'CEO'],
  };

  // 1. Mostrar el Prompt generado
  const { systemInstruction, userPrompt } = construirPromptGeneracionSimulacion(params);

  console.log('======================================================================');
  console.log('📝 1. PROMPT GENERADO (ENVIADO A LA IA)');
  console.log('======================================================================');
  console.log('\n--- SYSTEM INSTRUCTION ---');
  console.log(systemInstruction);
  console.log('\n--- USER PROMPT ---');
  console.log(userPrompt);

  // 2. Ejecutar la llamada a la IA
  console.log('\n======================================================================');
  console.log('🤖 2. RESPUESTA CRUDA DE LA IA (TEXTO DIRECTO SIN MODIFICAR)');
  console.log('======================================================================\n');
  const estructuraBase = await simulacionIaService.generarEstructuraParaCurso(params);
  const textoCrudo = simulacionIaService.getUltimoJsonCrudo();
  console.log(textoCrudo ?? JSON.stringify(estructuraBase, null, 2));

  // 3. Instanciar en el Backend para la empresa
  console.log('\n======================================================================');
  console.log(`⚙️ 3. INSTANCIACIÓN EN EL BACKEND PARA "${empresaPrueba.nombre}"`);
  console.log('======================================================================\n');

  const { estructuraAdaptada, variablesIniciales } = instanciarEstructuraParaEmpresa(
    estructuraBase,
    empresaPrueba,
    true,
    params.dificultad
  );

  console.log(`🏢 Empresa: ${empresaPrueba.nombre}`);
  console.log(`📦 Variables calculadas:`, JSON.stringify(variablesIniciales, null, 2));
  console.log(`\n📖 Contexto de partida:\n${estructuraAdaptada.contextoInicial}\n`);

  console.log('----------------------------------------------------------------------');
  console.log('🌳 RECORRIDO DE LA CONVERSACIÓN RESULTANTE:');
  console.log('----------------------------------------------------------------------\n');

  for (const ev of estructuraAdaptada.eventos) {
    const sorpresaTag = ev.esSorpresa ? ' ⚡ [EVENTO SORPRESA]' : '';
    const rolesTag =
      ev.rolesHabilitados && ev.rolesHabilitados.length > 0
        ? ` [Roles habilitados: ${ev.rolesHabilitados.join(', ')}]`
        : '';

    console.log(`🔹 [${ev.id}] (${ev.tipo}) - Emisor: ${ev.emisor}${sorpresaTag}${rolesTag}`);
    console.log(`   💬 "${ev.mensaje}"`);

    if (ev.opciones && ev.opciones.length > 0) {
      console.log('   Opciones:');
      for (const op of ev.opciones) {
        const cambiosStr = op.cambiosSimulados
          ? ` -> Impacto: ${JSON.stringify(op.cambiosSimulados)}`
          : '';
        const pts = PUNTOS_POR_CLASIFICACION[op.clasificacion] ?? 0;
        console.log(`     👉 [${op.id}] [${op.clasificacion} (${pts} pts)] ${op.texto}`);
        console.log(`        ⏩ Conduce a: [${op.siguienteEventoId}]${cambiosStr}`);
      }
    } else if (ev.siguienteEventoId) {
      console.log(`   ⏩ Siguiente evento: [${ev.siguienteEventoId}]`);
    }
    console.log('');
  }

  console.log('======================================================================');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
