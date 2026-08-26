import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Factory,
  GraduationCap,
  Home,
  Save,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

import Button from '../../components/ui/Button';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useCrearPlanificacionAnual } from '../../hooks/useCrearPlanificacionAnual';

import type { CrearPlanificacionRequest } from '../../types/planificacion.types';

import { esCursoSexto } from '../../utils/curso.utils';

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

interface EstimacionMensual {
  mes: number;
  unidadesEstimadas: number | '';
}

export default function CargarPlanificacionAnualPage() {
  const navigate = useNavigate();

  const crearPlanificacion = useCrearPlanificacionAnual();

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const esSexto = esCursoSexto(alumno?.curso?.nombre);

  const tieneEmpresa = Boolean(alumno?.empresa);

  const [mesInicio, setMesInicio] = useState(3);

  const [mesFin, setMesFin] = useState(12);

  const [estimaciones, setEstimaciones] = useState<Record<number, number | ''>>({});

  const mesesPlanificados = useMemo(() => {
    if (mesInicio > mesFin) {
      return [];
    }

    const meses: EstimacionMensual[] = [];

    for (let mes = mesInicio; mes <= mesFin; mes += 1) {
      meses.push({
        mes,
        unidadesEstimadas: estimaciones[mes] ?? '',
      });
    }

    return meses;
  }, [mesInicio, mesFin, estimaciones]);

  const cantidadMeses = mesesPlanificados.length;

  const unidadesEstimadasAnuales = mesesPlanificados.reduce(
    (total, detalle) => total + (detalle.unidadesEstimadas === '' ? 0 : detalle.unidadesEstimadas),
    0
  );

  const todosLosMesesCompletos =
    mesesPlanificados.length > 0 &&
    mesesPlanificados.every(
      (detalle) => detalle.unidadesEstimadas !== '' && detalle.unidadesEstimadas >= 0
    );

  const handleCambiarMesInicio = (valor: number) => {
    setMesInicio(valor);

    if (valor > mesFin) {
      setMesFin(valor);
    }
  };

  const handleCambiarMesFin = (valor: number) => {
    setMesFin(valor);

    if (valor < mesInicio) {
      setMesInicio(valor);
    }
  };

  const handleCambiarEstimacion = (mes: number, valor: string) => {
    if (valor === '') {
      setEstimaciones((actuales) => ({
        ...actuales,
        [mes]: '',
      }));

      return;
    }

    const numero = Number(valor);

    if (!Number.isInteger(numero) || numero < 0) {
      return;
    }

    setEstimaciones((actuales) => ({
      ...actuales,
      [mes]: numero,
    }));
  };

  const handleGuardar = () => {
    if (!todosLosMesesCompletos) {
      return;
    }

    const payload: CrearPlanificacionRequest = {
      mesInicio,
      mesFin,

      detalles: mesesPlanificados.map((detalle) => ({
        mes: detalle.mes,
        unidadesEstimadas: detalle.unidadesEstimadas === '' ? 0 : detalle.unidadesEstimadas,
      })),
    };

    crearPlanificacion.mutate(payload, {
      onSuccess: () => {
        navigate('/alumno/produccion/planificacion');
      },
    });
  };

  if (cargandoAlumno) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando planificación...</p>
      </div>
    );
  }

  if (errorAlumno || !alumno) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          No fue posible comprobar la información del alumno
        </h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un problema al consultar tu curso y tus datos actuales.
        </p>

        <button
          type="button"
          onClick={() => refetchAlumno()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!esSexto) {
    return (
      <EstadoCargaNoDisponible
        icono={<GraduationCap className="h-9 w-9 text-abacontex-primary" />}
        titulo="La planificación anual no está disponible para tu curso"
        descripcion="Esta funcionalidad forma parte del módulo de Producción y está disponible únicamente para alumnos de 6.º año."
      />
    );
  }

  if (!tieneEmpresa) {
    return (
      <EstadoCargaNoDisponible
        icono={<Factory className="h-9 w-9 text-abacontex-primary" />}
        titulo="Todavía no pertenecés a una empresa"
        descripcion="Para cargar una planificación anual primero tenés que formar parte de una empresa de tu curso."
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link to="/alumno/produccion" className="transition hover:text-gray-700">
          Producción
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link to="/alumno/produccion/planificacion" className="transition hover:text-gray-700">
          Planificación de producción
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Cargar planificación</span>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cargar planificación anual</h1>

          <p className="mt-1 text-sm text-gray-500">
            Definí el período de planificación y las unidades estimadas para cada mes.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          label="Volver a planificación"
          icon={<ChevronLeft className="h-4 w-4" />}
          onClick={() => navigate('/alumno/produccion/planificacion')}
          className="!px-4 !py-2.5"
        />
      </header>

      {crearPlanificacion.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-800">No fue posible guardar la planificación.</p>

          <p className="mt-1 text-sm text-red-700">
            Revisá los datos ingresados e intentá nuevamente.
          </p>
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[1.55fr_0.7fr]">
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="mesInicio" className="mb-1.5 block text-sm font-medium text-gray-700">
                Mes de inicio de planificación
              </label>

              <select
                id="mesInicio"
                value={mesInicio}
                onChange={(event) => handleCambiarMesInicio(Number(event.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
              >
                {nombresMeses.slice(1).map((nombre, index) => {
                  const mes = index + 1;

                  return (
                    <option key={mes} value={mes}>
                      {nombre}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="mesFin" className="mb-1.5 block text-sm font-medium text-gray-700">
                Mes de fin de planificación
              </label>

              <select
                id="mesFin"
                value={mesFin}
                onChange={(event) => handleCambiarMesFin(Number(event.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
              >
                {nombresMeses.slice(1).map((nombre, index) => {
                  const mes = index + 1;

                  return (
                    <option key={mes} value={mes}>
                      {nombre}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <section className="overflow-hidden border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px]">
                <thead className="bg-gray-100">
                  <tr className="text-left text-xs font-semibold text-gray-700">
                    <th className="px-5 py-3">Mes</th>

                    <th className="px-5 py-3 text-center">Producción estimada (u.)</th>

                    <th className="px-5 py-3 text-center">Estado</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {mesesPlanificados.map((detalle) => {
                    const cargado = detalle.unidadesEstimadas !== '';

                    return (
                      <tr key={detalle.mes}>
                        <td className="px-5 py-2.5 text-sm text-gray-600">
                          {nombresMeses[detalle.mes]}
                        </td>

                        <td className="px-5 py-2.5">
                          <div className="mx-auto max-w-[160px]">
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={detalle.unidadesEstimadas}
                              onChange={(event) =>
                                handleCambiarEstimacion(detalle.mes, event.target.value)
                              }
                              placeholder="Ingresá unidades"
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-center text-xs outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
                            />
                          </div>
                        </td>

                        <td className="px-5 py-2.5 text-center">
                          <span
                            className={[
                              'inline-flex rounded-full px-3 py-1 text-xs font-medium',
                              cargado ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500',
                            ].join(' ')}
                          >
                            {cargado ? 'Cargado' : 'Sin cargar'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#496647]">Resumen de la planificación</h2>

          <div className="mt-5 divide-y divide-gray-100">
            <FilaResumen
              icono={<CalendarDays className="h-5 w-5" />}
              titulo="Meses a planificar"
              valor={cantidadMeses.toString()}
            />

            <FilaResumen
              icono={<BarChart3 className="h-5 w-5" />}
              titulo="Unidades estimadas anuales"
              valor={todosLosMesesCompletos ? `${unidadesEstimadasAnuales} u.` : '— u.'}
            />

            <FilaResumen
              icono={<Save className="h-5 w-5" />}
              titulo="Estado general"
              valor={todosLosMesesCompletos ? 'Listo para guardar' : 'Pendiente de carga'}
              destacado
            />
          </div>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <p className="text-xs leading-relaxed text-gray-500">
              La estimación anual corresponde a la suma de las unidades planificadas para todos los
              meses seleccionados.
            </p>
          </div>
        </aside>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          label="Cancelar"
          onClick={() => navigate('/alumno/produccion/planificacion')}
          disabled={crearPlanificacion.isPending}
          className="!px-5 !py-2.5"
        />

        <Button
          type="button"
          variant="solid"
          label={crearPlanificacion.isPending ? 'Guardando...' : 'Guardar estimación'}
          icon={<Save className="h-4 w-4" />}
          onClick={handleGuardar}
          disabled={crearPlanificacion.isPending || !todosLosMesesCompletos}
          className="!px-5 !py-2.5"
        />
      </div>
    </div>
  );
}

interface EstadoCargaNoDisponibleProps {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
}

function EstadoCargaNoDisponible({ icono, titulo, descripcion }: EstadoCargaNoDisponibleProps) {
  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Planificación de producción</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Cargar planificación anual</h1>

        <p className="mt-1 text-sm text-gray-500">
          Definí el período de planificación y las unidades estimadas para cada mes.
        </p>
      </header>

      <div className="flex justify-center pt-6">
        <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
            {icono}
          </div>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
            {titulo}
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
            {descripcion}
          </p>
        </section>
      </div>
    </div>
  );
}

interface FilaResumenProps {
  icono: React.ReactNode;
  titulo: string;
  valor: string;
  destacado?: boolean;
}

function FilaResumen({ icono, titulo, valor, destacado = false }: FilaResumenProps) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <div
        className={[
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          destacado ? 'bg-orange-50 text-orange-600' : 'bg-[#f1f5ef] text-[#496647]',
        ].join(' ')}
      >
        {icono}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-500">{titulo}</p>

        <p
          className={['mt-1 font-semibold', destacado ? 'text-orange-600' : 'text-gray-900'].join(
            ' '
          )}
        >
          {valor}
        </p>
      </div>
    </div>
  );
}
