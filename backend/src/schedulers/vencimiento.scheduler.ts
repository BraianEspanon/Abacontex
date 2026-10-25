import cron from 'node-cron';
import { procesarNotificacionesVencimientoProximo } from '../services/notificacion.service';

let isRunning = false;

/**
 * Inicializa el planificador de alertas automáticas para ejercicios con fecha límite próxima (24h).
 */
export function initVencimientoScheduler(): void {
  // 1. Cron periódico: se ejecuta al minuto 0 de cada hora (ej: 01:00, 02:00, etc.)
  cron.schedule('0 * * * *', async () => {
    if (isRunning) {
      console.warn('[Scheduler Vencimientos] Tarea previa aún en ejecución. Omitiendo ciclo.');
      return;
    }

    isRunning = true;
    try {
      const resultado = await procesarNotificacionesVencimientoProximo();
      if (resultado.notificacionesEnviadas > 0) {
        console.log(
          `[Scheduler Vencimientos] Ciclo completado: ${resultado.notificacionesEnviadas} notificaciones enviadas sobre ${resultado.ejerciciosEvaluados} ejercicios evaluados.`
        );
      }
    } catch (error) {
      console.error('[Scheduler Vencimientos] Error inesperado durante el ciclo:', error);
    } finally {
      isRunning = false;
    }
  });

  console.log('[Scheduler Vencimientos] Tarea programada registrada (ejecución horaria).');

  // 2. Disparo inicial opcional en ambiente de desarrollo (3 segundos post-arranque)
  const isDev =
    process.env.ENVIRONMENT === 'development' ||
    process.env.NODE_ENV === 'development' ||
    !process.env.NODE_ENV;

  if (isDev) {
    setTimeout(async () => {
      console.log(
        '[Scheduler Vencimientos] [DEV] Ejecutando verificación inicial de vencimientos...'
      );
      try {
        const resultado = await procesarNotificacionesVencimientoProximo();
        console.log('[Scheduler Vencimientos] [DEV] Resultado de verificación inicial:', resultado);
      } catch (error) {
        console.error('[Scheduler Vencimientos] [DEV] Error en verificación inicial:', error);
      }
    }, 3000);
  }
}
