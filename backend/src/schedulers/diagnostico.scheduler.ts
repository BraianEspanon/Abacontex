import cron from 'node-cron';
import { procesarDiagnosticosSemanalesCursos } from '../services/correccion.service';

let isRunning = false;

/**
 * Inicializa el planificador automático semanal de diagnóstico pedagógico con IA para cursos.
 * Se ejecuta todos los domingos a las 23:00 hs para preparar la planificación escolar del docente para el lunes.
 */
export function initDiagnosticoScheduler(): void {
  // 1. Cron semanal: se ejecuta todos los domingos a las 23:00 hs ('0 23 * * 0')
  cron.schedule('0 23 * * 0', async () => {
    if (isRunning) {
      console.warn('[Scheduler Diagnóstico] Tarea previa aún en ejecución. Omitiendo ciclo.');
      return;
    }

    isRunning = true;
    try {
      console.log('[Scheduler Diagnóstico] Iniciando ciclo semanal de evaluación de cursos...');
      const resultado = await procesarDiagnosticosSemanalesCursos();
      console.log(
        `[Scheduler Diagnóstico] Ciclo completado: ${resultado.actualizados} actualizados con IA, ` +
          `${resultado.omitidosSinCambio} vigentes sin variación de tendencia, ` +
          `${resultado.omitidosPorDatosInsuficientes} omitidos (<10 errores). Total evaluados: ${resultado.evaluados}.`
      );
    } catch (error) {
      console.error('[Scheduler Diagnóstico] Error inesperado durante el ciclo semanal:', error);
    } finally {
      isRunning = false;
    }
  });

  console.log(
    '[Scheduler Diagnóstico] Tarea programada registrada (ejecución semanal: domingos 23:00 hs).'
  );

  // 2. Disparo inicial opcional en ambiente de desarrollo (5 segundos post-arranque)
  const isDev =
    process.env.ENVIRONMENT === 'development' ||
    process.env.NODE_ENV === 'development' ||
    !process.env.NODE_ENV;

  if (isDev) {
    setTimeout(async () => {
      console.log(
        '[Scheduler Diagnóstico] [DEV] Ejecutando verificación inicial de diagnósticos de cursos...'
      );
      try {
        const resultado = await procesarDiagnosticosSemanalesCursos();
        console.log(
          `[Scheduler Diagnóstico] [DEV] Verificación inicial completada: ${resultado.actualizados} actualizados, ` +
            `${resultado.omitidosSinCambio} vigentes sin variación, ${resultado.omitidosPorDatosInsuficientes} sin datos suficientes.`
        );
      } catch (error) {
        console.error('[Scheduler Diagnóstico] [DEV] Error en verificación inicial:', error);
      }
    }, 5000);
  }
}
