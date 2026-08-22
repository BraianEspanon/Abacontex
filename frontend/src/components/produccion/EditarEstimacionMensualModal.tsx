import { BarChart3, CalendarDays, CheckCircle2, Pencil, Save, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../ui/Button';

import type { MesPlanificacionAnual } from '../../types/planificacion.types';

interface EditarEstimacionMensualModalProps {
  abierto: boolean;
  mes: MesPlanificacionAnual | null;
  cicloLectivo: number;
  guardando?: boolean;
  onCerrar: () => void;
  onGuardar: (idDetalle: number, unidadesEstimadas: number) => void;
}

interface ContenidoModalProps {
  mes: MesPlanificacionAnual;
  cicloLectivo: number;
  guardando: boolean;
  onCerrar: () => void;
  onGuardar: (idDetalle: number, unidadesEstimadas: number) => void;
}

const nombresMeses = [
  '',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export default function EditarEstimacionMensualModal({
  abierto,
  mes,
  cicloLectivo,
  guardando = false,
  onCerrar,
  onGuardar,
}: EditarEstimacionMensualModalProps) {
  if (!abierto || !mes) {
    return null;
  }

  return (
    <ContenidoModal
      key={mes.id}
      mes={mes}
      cicloLectivo={cicloLectivo}
      guardando={guardando}
      onCerrar={onCerrar}
      onGuardar={onGuardar}
    />
  );
}

function ContenidoModal({
  mes,
  cicloLectivo,
  guardando,
  onCerrar,
  onGuardar,
}: ContenidoModalProps) {
  const [nuevaEstimacion, setNuevaEstimacion] = useState<number | ''>(mes.unidadesEstimadas);

  const cumplimientoEstimado = useMemo(() => {
    if (nuevaEstimacion === '' || nuevaEstimacion <= 0) {
      return 0;
    }

    return (mes.unidadesProducidas / nuevaEstimacion) * 100;
  }, [mes.unidadesProducidas, nuevaEstimacion]);

  const estimacionValida =
    nuevaEstimacion !== '' && Number.isInteger(nuevaEstimacion) && nuevaEstimacion >= 0;

  const handleGuardar = () => {
    if (!estimacionValida) {
      return;
    }

    onGuardar(mes.id, nuevaEstimacion);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onMouseDown={onCerrar}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf3e8] text-[#496647]">
              <Pencil className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">Editar estimación mensual</h2>

              <p className="mt-1 text-sm text-gray-500">
                Actualizá la producción esperada de tu empresa para el mes seleccionado.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="mesPlanificacion"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Mes
              </label>

              <div className="relative">
                <CalendarDays className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  id="mesPlanificacion"
                  type="text"
                  value={`${nombresMeses[mes.mes]} ${cicloLectivo}`}
                  disabled
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pr-3 pl-10 text-sm text-gray-700"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="nuevaEstimacion"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Producción estimada del mes
              </label>

              <div className="relative">
                <input
                  id="nuevaEstimacion"
                  type="number"
                  min={0}
                  step={1}
                  value={nuevaEstimacion}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value === '') {
                      setNuevaEstimacion('');
                      return;
                    }

                    const numero = Number(value);

                    if (!Number.isInteger(numero) || numero < 0) {
                      return;
                    }

                    setNuevaEstimacion(numero);
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
                />

                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-gray-400">
                  u.
                </span>
              </div>
            </div>
          </div>

          <section className="rounded-xl bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-[#496647]">Resumen</h3>

            <div className="mt-3 space-y-3">
              <FilaResumen
                icono={<CheckCircle2 className="h-4 w-4" />}
                etiqueta="Producido actual"
                valor={`${mes.unidadesProducidas} u.`}
              />

              <FilaResumen
                icono={<BarChart3 className="h-4 w-4" />}
                etiqueta="Estimación actual"
                valor={`${mes.unidadesEstimadas} u.`}
              />

              <FilaResumen
                icono={<Pencil className="h-4 w-4" />}
                etiqueta="Nueva estimación"
                valor={nuevaEstimacion === '' ? '—' : `${nuevaEstimacion} u.`}
              />
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-700">Cumplimiento estimado</span>

                <span className="text-lg font-bold text-[#496647]">
                  {Math.round(cumplimientoEstimado)}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#6f9468] transition-all"
                  style={{
                    width: `${Math.min(100, Math.max(0, cumplimientoEstimado))}%`,
                  }}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
          <Button
            type="button"
            variant="outline"
            label="Cancelar"
            onClick={onCerrar}
            disabled={guardando}
            className="!px-5 !py-2.5"
          />

          <Button
            type="button"
            variant="solid"
            label={guardando ? 'Guardando...' : 'Guardar estimación'}
            icon={<Save className="h-4 w-4" />}
            onClick={handleGuardar}
            disabled={guardando || !estimacionValida}
            className="!px-5 !py-2.5"
          />
        </div>
      </div>
    </div>
  );
}

interface FilaResumenProps {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
}

function FilaResumen({ icono, etiqueta, valor }: FilaResumenProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-gray-500">
        <span className="text-[#496647]">{icono}</span>

        <span className="text-xs">{etiqueta}</span>
      </div>

      <span className="text-sm font-semibold text-gray-800">{valor}</span>
    </div>
  );
}
