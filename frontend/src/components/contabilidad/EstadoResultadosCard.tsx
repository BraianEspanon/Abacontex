import type {
  CuentaReporte,
  EstadoResultadosResponse,
  TipoResultadoEjercicio,
} from '../../types/contabilidad.types';

import { formatearMonto } from '../../utils/facturacion.utils';

interface EstadoResultadosCardProps {
  reporte: EstadoResultadosResponse;
}

export default function EstadoResultadosCard({ reporte }: EstadoResultadosCardProps) {
  const resultado = obtenerEstiloResultado(reporte.tipoResultado);

  return (
    <section className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 font-sans shadow-sm">
      <h2 className="text-center text-2xl font-semibold text-abacontex-black-text">
        Estado de resultados
      </h2>

      <div className="mt-6">
        <SeccionResultado
          titulo="Ingresos totales"
          total={reporte.totalIngresos}
          cuentas={reporte.ingresos}
          claseTotal="text-abacontex-primary-three"
        />

        <SeccionResultado
          titulo="Egresos totales"
          total={reporte.totalEgresos}
          cuentas={reporte.egresos}
          claseTotal="text-red-600"
        />
      </div>

      <div className="mt-8 border-t border-gray-300 pt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-abacontex-black-text">
              Resultado del período:
            </span>

            <span className={`text-base font-semibold ${resultado.clase}`}>{resultado.texto}</span>
          </div>

          <span className={`text-lg font-semibold ${resultado.clase}`}>
            {formatearMonto(reporte.resultadoEjercicio)}
          </span>
        </div>
      </div>
    </section>
  );
}

interface SeccionResultadoProps {
  titulo: string;
  total: number;
  cuentas: CuentaReporte[];
  claseTotal: string;
}

function SeccionResultado({ titulo, total, cuentas, claseTotal }: SeccionResultadoProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between gap-4 border-b border-gray-300 pb-2">
        <h3 className="text-lg font-semibold text-abacontex-black-text">{titulo}</h3>

        <span className={`text-lg font-semibold ${claseTotal}`}>{formatearMonto(total)}</span>
      </div>

      <div className="divide-y divide-gray-100">
        {cuentas.length === 0 ? (
          <p className="py-4 text-sm text-abacontex-gray-text">No hay cuentas para mostrar.</p>
        ) : (
          cuentas.map((cuenta) => (
            <div
              key={cuenta.cuentaId}
              className="flex items-center justify-between gap-4 py-3 text-sm"
            >
              <span className="text-abacontex-gray-text">
                {cuenta.codigo} - {cuenta.nombre}
              </span>

              <span className="font-medium text-abacontex-gray-text">
                {formatearMonto(cuenta.saldo)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function obtenerEstiloResultado(tipoResultado: TipoResultadoEjercicio) {
  switch (tipoResultado) {
    case 'GANANCIA':
      return {
        texto: 'Ganancia',
        clase: 'text-abacontex-primary-three',
      };

    case 'PERDIDA':
      return {
        texto: 'Pérdida',
        clase: 'text-red-600',
      };

    case 'NEUTRO':
      return {
        texto: 'Neutro',
        clase: 'text-abacontex-gray-text',
      };
  }
}
