import { AlertCircle, CheckCircle2, FileWarning } from 'lucide-react';

import type { EspacioTrabajoCorreccion } from '../../types/espacioTrabajoCorreccion.types';

interface ResumenRevisionProps {
  kpis: EspacioTrabajoCorreccion['kpis'];
}

export default function ResumenRevision({ kpis }: ResumenRevisionProps) {
  const indicadores = [
    {
      titulo: 'Aciertos',
      valor: kpis.aciertos,
      descripcion: 'Comparaciones correctas',
      icono: CheckCircle2,
      color: 'text-green-700',
      fondo: 'bg-green-50',
    },
    {
      titulo: 'Diferencias detectadas',
      valor: kpis.diferenciasDetectadas,
      descripcion: 'En cuentas o importes',
      icono: AlertCircle,
      color: 'text-red-600',
      fondo: 'bg-red-50',
    },
    {
      titulo: 'Asientos incompletos',
      valor: kpis.asientosIncompletos,
      descripcion: 'Pendientes de completar',
      icono: FileWarning,
      color: 'text-orange-600',
      fondo: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:max-w-4xl">
      {indicadores.map((indicador) => {
        const Icono = indicador.icono;

        return (
          <div
            key={indicador.titulo}
            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${indicador.fondo}`}
            >
              <Icono size={24} className={indicador.color} />
            </div>

            <div className="min-w-0">
              <p className={`text-2xl font-bold ${indicador.color}`}>{indicador.valor}</p>

              <p className="text-sm font-medium text-gray-900">{indicador.titulo}</p>

              <p className="text-xs text-gray-500">{indicador.descripcion}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
