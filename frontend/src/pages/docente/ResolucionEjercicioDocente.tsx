import { CalendarDays, ExternalLink, FileText, Save, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import HojaTrabajoEditor from '../../components/ejercicios/resolucion/HojaTrabajoEditor';
import LibroDiarioEditor from '../../components/ejercicios/resolucion/LibroDiarioEditor';
import LibroIvaEditor from '../../components/ejercicios/resolucion/LibroIvaEditor';
import LibroMayorEditor from '../../components/ejercicios/resolucion/LibroMayorEditor';
import Button from '../../components/ui/Button';

import { useGuardarResolucionEjercicio } from '../../hooks/useGuardarResolucionEjercicio';
import { useResolucionEjercicio } from '../../hooks/useResolucionEjercicio';

import type {
  ContenidoHojaTrabajo,
  ContenidoLibroDiario,
  ContenidoLibroIva,
  ContenidoLibroMayor,
  TipoPlantillaEjercicio,
} from '../../types/ejercicio.types';

import { validarHojaTrabajoResuelta } from '../../utils/validarHojaTrabajo';
import { validarLibroDiarioResuelto } from '../../utils/validarLibroDiario';
import { validarLibroIvaResuelto } from '../../utils/validarLibroIva';
import { validarLibroMayorResuelto } from '../../utils/validarLibroMayor';

const NOMBRES_PLANTILLAS: Record<TipoPlantillaEjercicio, string> = {
  LIBRO_DIARIO: 'Libro diario',
  HOJA_TRABAJO: 'Hoja de trabajo',
  LIBRO_IVA: 'Libro IVA',
  LIBRO_MAYOR: 'Libro mayor',
};

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
}

function obtenerEstadoVisualPlantilla(estado: string) {
  if (estado === 'RESUELTO') {
    return 'Terminado';
  }

  if (estado === 'EN_EDICION') {
    return 'En edición';
  }

  return 'Pendiente';
}

export default function ResolucionEjercicioDocente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const idEjercicio = id ? Number(id) : undefined;

  const { data, isLoading, isError } = useResolucionEjercicio(idEjercicio);

  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoPlantillaEjercicio | null>(null);

  const [enunciadoAbierto, setEnunciadoAbierto] = useState(false);

  const progreso = useMemo(() => {
    if (!data) {
      return {
        resueltas: 0,
        total: 0,
        porcentaje: 0,
      };
    }

    const total = data.plantillas.length;

    const resueltas = data.plantillas.filter((plantilla) => plantilla.estado === 'RESUELTO').length;

    return {
      resueltas,
      total,
      porcentaje: total > 0 ? (resueltas / total) * 100 : 0,
    };
  }, [data]);

  if (!idEjercicio || Number.isNaN(idEjercicio)) {
    return <div className="text-sm text-red-600">El identificador del ejercicio no es válido.</div>;
  }

  if (isLoading) {
    return <div className="text-sm text-gray-500">Cargando resolución...</div>;
  }

  if (isError || !data) {
    return (
      <div className="text-sm text-red-600">No se pudo cargar la resolución del ejercicio.</div>
    );
  }

  const tipoActivo = tipoSeleccionado ?? data.plantillas[0]?.tipo ?? null;

  const plantillaActiva = data.plantillas.find((plantilla) => plantilla.tipo === tipoActivo);

  // ==========================================================================
  // Libro Diario
  // ==========================================================================

  const libroDiario = data.plantillas.find((plantilla) => plantilla.tipo === 'LIBRO_DIARIO');

  const contenidoInicialLibroDiario = (libroDiario?.contenido as
    | ContenidoLibroDiario
    | undefined) ?? {
    asientos: [],
  };

  // ==========================================================================
  // Libro Mayor
  // ==========================================================================

  const libroMayor = data.plantillas.find((plantilla) => plantilla.tipo === 'LIBRO_MAYOR');

  const contenidoInicialLibroMayor = (libroMayor?.contenido as ContenidoLibroMayor | undefined) ?? {
    cuentas: [],
  };

  // ==========================================================================
  // Libro IVA
  // ==========================================================================

  const libroIva = data.plantillas.find((plantilla) => plantilla.tipo === 'LIBRO_IVA');

  const contenidoInicialLibroIva = (libroIva?.contenido as ContenidoLibroIva | undefined) ?? {
    compras: [],
    ventas: [],
    resultado: null,
  };

  // ==========================================================================
  // Hoja de Trabajo
  // ==========================================================================

  const hojaTrabajo = data.plantillas.find((plantilla) => plantilla.tipo === 'HOJA_TRABAJO');

  const contenidoInicialHojaTrabajo = (hojaTrabajo?.contenido as
    | ContenidoHojaTrabajo
    | undefined) ?? {
    filas: [],
  };

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link to="/docente" className="hover:text-green-700">
          Inicio
        </Link>

        <span>&gt;</span>

        <Link to="/docente/ejercicios" className="hover:text-green-700">
          Mis ejercicios
        </Link>

        <span>&gt;</span>

        <span className="font-medium text-gray-900">Continuar resolución</span>
      </div>

      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold leading-tight text-gray-900">
            Continuar resolución del ejercicio
          </h1>

          <p className="mt-0.5 text-sm leading-tight text-gray-500">
            Completa la solución modelo del ejercicio utilizando las plantillas contables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3">
            <CalendarDays size={16} className="shrink-0 text-gray-500" />

            <div className="leading-tight">
              <p className="text-[10px] text-gray-500">Fecha límite</p>

              <p className="text-xs font-medium text-gray-800">
                {formatearFecha(data.fechaLimite)}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            label="Ver enunciado completo"
            icon={<ExternalLink size={14} />}
            onClick={() => setEnunciadoAbierto(true)}
            className="!h-10 !rounded-lg !px-4 !py-0 !text-sm !font-medium"
          />
        </div>
      </div>

      {/* Resumen + progreso */}
      <div className="grid gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Datos del ejercicio */}
        <div className="flex min-h-[92px] items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
            <FileText size={23} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900" title={data.titulo}>
              {data.titulo}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-600">
                Resolución
              </span>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                  data.estado === 'RESUELTO'
                    ? 'bg-green-100 text-green-700'
                    : data.estado === 'EN_EDICION'
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {data.estado === 'RESUELTO'
                  ? 'Resuelto'
                  : data.estado === 'EN_EDICION'
                    ? 'En edición'
                    : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="min-h-[92px] rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <div className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 text-gray-600">
              <FileText size={12} />
            </div>

            <p className="text-sm font-semibold text-gray-900">Progreso de resolución</p>
          </div>

          <div className="mt-2.5 flex flex-col gap-3 xl:flex-row xl:items-center">
            {/* Barra */}
            <div className="min-w-[180px] flex-1 xl:max-w-[260px]">
              <p className="mb-1.5 text-[11px] text-gray-500">
                {progreso.resueltas} de {progreso.total} plantillas completadas
              </p>

              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-700 transition-all"
                  style={{
                    width: `${progreso.porcentaje}%`,
                  }}
                />
              </div>
            </div>

            {/* Estado de cada plantilla */}
            <div className="flex flex-1 flex-wrap items-start justify-start gap-x-5 gap-y-2 xl:justify-end">
              {data.plantillas.map((plantilla) => {
                const resuelta = plantilla.estado === 'RESUELTO';
                const enEdicion = plantilla.estado === 'EN_EDICION';

                return (
                  <div key={plantilla.idEjercicioPlantilla} className="flex items-start gap-1.5">
                    <span
                      className={`mt-[3px] flex h-3 w-3 shrink-0 items-center justify-center rounded-full border ${
                        resuelta
                          ? 'border-green-700'
                          : enEdicion
                            ? 'border-green-600'
                            : 'border-gray-400'
                      }`}
                    >
                      {resuelta && <span className="h-1.5 w-1.5 rounded-full bg-green-700" />}

                      {enEdicion && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                    </span>

                    <div className="leading-tight">
                      <p className="whitespace-nowrap text-[11px] font-medium text-gray-700">
                        {NOMBRES_PLANTILLAS[plantilla.tipo]}
                      </p>

                      <p
                        className={`mt-0.5 whitespace-nowrap text-[10px] ${
                          resuelta
                            ? 'text-green-700'
                            : enEdicion
                              ? 'text-gray-600'
                              : 'text-gray-400'
                        }`}
                      >
                        {obtenerEstadoVisualPlantilla(plantilla.estado)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-5 overflow-x-auto">
          {data.plantillas.map((plantilla) => {
            const activa = tipoActivo === plantilla.tipo;

            return (
              <button
                key={plantilla.idEjercicioPlantilla}
                type="button"
                onClick={() => setTipoSeleccionado(plantilla.tipo)}
                className={`border-b-2 px-1 pb-2 pt-0.5 text-sm font-medium ${
                  activa
                    ? 'border-green-700 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {NOMBRES_PLANTILLAS[plantilla.tipo]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Libro Diario */}
      {plantillaActiva?.tipo === 'LIBRO_DIARIO' && (
        <ResolucionLibroDiario
          key={libroDiario?.idEjercicioPlantilla ?? 'libro-diario'}
          idEjercicio={idEjercicio}
          contenidoInicial={contenidoInicialLibroDiario}
          estadoInicial={libroDiario?.estado}
        />
      )}

      {/* Libro Mayor */}
      {plantillaActiva?.tipo === 'LIBRO_MAYOR' && (
        <ResolucionLibroMayor
          key={libroMayor?.idEjercicioPlantilla ?? 'libro-mayor'}
          idEjercicio={idEjercicio}
          contenidoInicial={contenidoInicialLibroMayor}
          estadoInicial={libroMayor?.estado}
        />
      )}

      {/* Libro IVA */}
      {plantillaActiva?.tipo === 'LIBRO_IVA' && (
        <ResolucionLibroIva
          key={libroIva?.idEjercicioPlantilla ?? 'libro-iva'}
          idEjercicio={idEjercicio}
          contenidoInicial={contenidoInicialLibroIva}
          estadoInicial={libroIva?.estado}
        />
      )}

      {/* Hoja de Trabajo */}
      {plantillaActiva?.tipo === 'HOJA_TRABAJO' && (
        <ResolucionHojaTrabajo
          key={hojaTrabajo?.idEjercicioPlantilla ?? 'hoja-trabajo'}
          idEjercicio={idEjercicio}
          contenidoInicial={contenidoInicialHojaTrabajo}
          estadoInicial={hojaTrabajo?.estado}
        />
      )}

      {/* Volver */}
      <div className="border-t border-gray-200 pt-3">
        <Button
          type="button"
          variant="outline"
          label="← Volver a Mis ejercicios"
          onClick={() => navigate('/docente/ejercicios')}
          className="!rounded-lg !border-gray-300 !px-4 !py-2 !text-sm !font-medium !text-gray-700 hover:!bg-gray-50"
        />
      </div>

      {/* Modal del enunciado */}
      {enunciadoAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEnunciadoAbierto(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Enunciado del ejercicio</p>

                <h2 className="text-lg font-semibold text-gray-900">{data.titulo}</h2>
              </div>

              <button
                type="button"
                onClick={() => setEnunciadoAbierto(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Cerrar enunciado"
              >
                <X size={18} />
              </button>
            </div>

            <div className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {data.enunciado}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Resolución Libro Diario
// ============================================================================

interface ResolucionLibroDiarioProps {
  idEjercicio: number;
  contenidoInicial: ContenidoLibroDiario;
  estadoInicial?: string;
}

function ResolucionLibroDiario({
  idEjercicio,
  contenidoInicial,
  estadoInicial,
}: ResolucionLibroDiarioProps) {
  const guardarResolucion = useGuardarResolucionEjercicio();

  const [contenidoDiario, setContenidoDiario] = useState<ContenidoLibroDiario>(contenidoInicial);

  const [erroresLibroDiario, setErroresLibroDiario] = useState<string[]>([]);

  const [hayCambiosSinGuardar, setHayCambiosSinGuardar] = useState(false);

  const libroDiarioResuelto = estadoInicial === 'RESUELTO';

  function cambiarContenidoDiario(nuevoContenido: ContenidoLibroDiario) {
    setContenidoDiario(nuevoContenido);
    setHayCambiosSinGuardar(true);

    if (erroresLibroDiario.length > 0) {
      setErroresLibroDiario([]);
    }
  }

  async function guardarLibroDiario(estado: 'EN_EDICION' | 'RESUELTO') {
    if (estado === 'RESUELTO') {
      const errores = validarLibroDiarioResuelto(contenidoDiario);

      if (errores.length > 0) {
        setErroresLibroDiario(
          errores.map((error) =>
            error.asiento ? `Asiento N° ${error.asiento}: ${error.mensaje}` : error.mensaje
          )
        );

        return;
      }
    }

    setErroresLibroDiario([]);

    await guardarResolucion.mutateAsync({
      idEjercicio,
      datos: {
        tipo: 'LIBRO_DIARIO',
        estado,
        contenido: contenidoDiario,
      },
    });

    setHayCambiosSinGuardar(false);
  }

  return (
    <>
      {hayCambiosSinGuardar && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-800">
            Hay cambios sin guardar en el Libro Diario.
          </p>

          {libroDiarioResuelto && (
            <p className="mt-1 text-xs text-amber-700">
              La versión guardada continúa marcada como resuelta hasta que guardes estos cambios.
            </p>
          )}
        </div>
      )}

      <LibroDiarioEditor contenido={contenidoDiario} onChange={cambiarContenidoDiario} />

      {erroresLibroDiario.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            No se puede marcar el Libro Diario como resuelto.
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {erroresLibroDiario.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
        {libroDiarioResuelto ? (
          hayCambiosSinGuardar ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-amber-700">Cambios sin guardar</span>

              <Button
                type="button"
                variant="solid"
                label="Guardar cambios"
                icon={<Save size={16} />}
                disabled={guardarResolucion.isPending}
                onClick={() => void guardarLibroDiario('EN_EDICION')}
                className="!rounded-lg !px-4 !py-2 !text-sm"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              ✓ Libro Diario resuelto
            </div>
          )
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              label="Guardar borrador"
              icon={<Save size={16} />}
              disabled={guardarResolucion.isPending || !hayCambiosSinGuardar}
              onClick={() => void guardarLibroDiario('EN_EDICION')}
              className="!rounded-lg !border-gray-300 !px-4 !py-2 !text-sm !font-medium !text-gray-700 hover:!bg-gray-50"
            />

            <Button
              type="button"
              variant="solid"
              label="✓ Marcar como resuelto"
              disabled={guardarResolucion.isPending}
              onClick={() => void guardarLibroDiario('RESUELTO')}
              className="!rounded-lg !px-4 !py-2 !text-sm"
            />
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// Resolución Libro Mayor
// ============================================================================

interface ResolucionLibroMayorProps {
  idEjercicio: number;
  contenidoInicial: ContenidoLibroMayor;
  estadoInicial?: string;
}

function ResolucionLibroMayor({
  idEjercicio,
  contenidoInicial,
  estadoInicial,
}: ResolucionLibroMayorProps) {
  const guardarResolucion = useGuardarResolucionEjercicio();

  const [contenidoMayor, setContenidoMayor] = useState<ContenidoLibroMayor>(contenidoInicial);

  const [erroresLibroMayor, setErroresLibroMayor] = useState<string[]>([]);

  const [hayCambiosSinGuardar, setHayCambiosSinGuardar] = useState(false);

  const libroMayorResuelto = estadoInicial === 'RESUELTO';

  function cambiarContenidoMayor(nuevoContenido: ContenidoLibroMayor) {
    setContenidoMayor(nuevoContenido);
    setHayCambiosSinGuardar(true);

    if (erroresLibroMayor.length > 0) {
      setErroresLibroMayor([]);
    }
  }

  async function guardarLibroMayor(estado: 'EN_EDICION' | 'RESUELTO') {
    if (estado === 'RESUELTO') {
      const errores = validarLibroMayorResuelto(contenidoMayor);

      if (errores.length > 0) {
        setErroresLibroMayor(
          errores.map((error) => {
            if (error.cuenta && error.movimiento) {
              return `Cuenta N° ${error.cuenta}, movimiento N° ${error.movimiento}: ${error.mensaje}`;
            }

            if (error.cuenta) {
              return `Cuenta N° ${error.cuenta}: ${error.mensaje}`;
            }

            return error.mensaje;
          })
        );

        return;
      }
    }

    setErroresLibroMayor([]);

    await guardarResolucion.mutateAsync({
      idEjercicio,
      datos: {
        tipo: 'LIBRO_MAYOR',
        estado,
        contenido: contenidoMayor,
      },
    });

    setHayCambiosSinGuardar(false);
  }

  return (
    <>
      {hayCambiosSinGuardar && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-800">
            Hay cambios sin guardar en el Libro Mayor.
          </p>

          {libroMayorResuelto && (
            <p className="mt-1 text-xs text-amber-700">
              La versión guardada continúa marcada como resuelta hasta que guardes estos cambios.
            </p>
          )}
        </div>
      )}

      <LibroMayorEditor contenido={contenidoMayor} onChange={cambiarContenidoMayor} />

      {erroresLibroMayor.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            No se puede marcar el Libro Mayor como resuelto.
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {erroresLibroMayor.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
        {libroMayorResuelto ? (
          hayCambiosSinGuardar ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-amber-700">Cambios sin guardar</span>

              <Button
                type="button"
                variant="solid"
                label="Guardar cambios"
                icon={<Save size={16} />}
                disabled={guardarResolucion.isPending}
                onClick={() => void guardarLibroMayor('EN_EDICION')}
                className="!rounded-lg !px-4 !py-2 !text-sm"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              ✓ Libro Mayor resuelto
            </div>
          )
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              label="Guardar borrador"
              icon={<Save size={16} />}
              disabled={guardarResolucion.isPending || !hayCambiosSinGuardar}
              onClick={() => void guardarLibroMayor('EN_EDICION')}
              className="!rounded-lg !border-gray-300 !px-4 !py-2 !text-sm !font-medium !text-gray-700 hover:!bg-gray-50"
            />

            <Button
              type="button"
              variant="solid"
              label="✓ Marcar como resuelto"
              disabled={guardarResolucion.isPending}
              onClick={() => void guardarLibroMayor('RESUELTO')}
              className="!rounded-lg !px-4 !py-2 !text-sm"
            />
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// Resolución Libro IVA
// ============================================================================

interface ResolucionLibroIvaProps {
  idEjercicio: number;
  contenidoInicial: ContenidoLibroIva;
  estadoInicial?: string;
}

function ResolucionLibroIva({
  idEjercicio,
  contenidoInicial,
  estadoInicial,
}: ResolucionLibroIvaProps) {
  const guardarResolucion = useGuardarResolucionEjercicio();

  const [contenidoIva, setContenidoIva] = useState<ContenidoLibroIva>(contenidoInicial);

  const [erroresLibroIva, setErroresLibroIva] = useState<string[]>([]);

  const [hayCambiosSinGuardar, setHayCambiosSinGuardar] = useState(false);

  const libroIvaResuelto = estadoInicial === 'RESUELTO';

  function cambiarContenidoIva(nuevoContenido: ContenidoLibroIva) {
    setContenidoIva(nuevoContenido);
    setHayCambiosSinGuardar(true);

    if (erroresLibroIva.length > 0) {
      setErroresLibroIva([]);
    }
  }

  async function guardarLibroIva(estado: 'EN_EDICION' | 'RESUELTO') {
    if (estado === 'RESUELTO') {
      const errores = validarLibroIvaResuelto(contenidoIva);

      if (errores.length > 0) {
        setErroresLibroIva(
          errores.map((error) => {
            if (error.seccion && error.comprobante) {
              const seccion = error.seccion === 'COMPRA' ? 'Compra' : 'Venta';

              return `${seccion} N° ${error.comprobante}: ${error.mensaje}`;
            }

            return error.mensaje;
          })
        );

        return;
      }
    }

    setErroresLibroIva([]);

    await guardarResolucion.mutateAsync({
      idEjercicio,
      datos: {
        tipo: 'LIBRO_IVA',
        estado,
        contenido: contenidoIva,
      },
    });

    setHayCambiosSinGuardar(false);
  }

  return (
    <>
      {hayCambiosSinGuardar && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-800">
            Hay cambios sin guardar en el Libro IVA.
          </p>

          {libroIvaResuelto && (
            <p className="mt-1 text-xs text-amber-700">
              La versión guardada continúa marcada como resuelta hasta que guardes estos cambios.
            </p>
          )}
        </div>
      )}

      <LibroIvaEditor contenido={contenidoIva} onChange={cambiarContenidoIva} />

      {erroresLibroIva.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            No se puede marcar el Libro IVA como resuelto.
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {erroresLibroIva.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
        {libroIvaResuelto ? (
          hayCambiosSinGuardar ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-amber-700">Cambios sin guardar</span>

              <Button
                type="button"
                variant="solid"
                label="Guardar cambios"
                icon={<Save size={16} />}
                disabled={guardarResolucion.isPending}
                onClick={() => void guardarLibroIva('EN_EDICION')}
                className="!rounded-lg !px-4 !py-2 !text-sm"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              ✓ Libro IVA resuelto
            </div>
          )
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              label="Guardar borrador"
              icon={<Save size={16} />}
              disabled={guardarResolucion.isPending || !hayCambiosSinGuardar}
              onClick={() => void guardarLibroIva('EN_EDICION')}
              className="!rounded-lg !border-gray-300 !px-4 !py-2 !text-sm !font-medium !text-gray-700 hover:!bg-gray-50"
            />

            <Button
              type="button"
              variant="solid"
              label="✓ Marcar como resuelto"
              disabled={guardarResolucion.isPending}
              onClick={() => void guardarLibroIva('RESUELTO')}
              className="!rounded-lg !px-4 !py-2 !text-sm"
            />
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// Resolución Hoja de Trabajo
// ============================================================================

interface ResolucionHojaTrabajoProps {
  idEjercicio: number;
  contenidoInicial: ContenidoHojaTrabajo;
  estadoInicial?: string;
}

function ResolucionHojaTrabajo({
  idEjercicio,
  contenidoInicial,
  estadoInicial,
}: ResolucionHojaTrabajoProps) {
  const guardarResolucion = useGuardarResolucionEjercicio();

  const [contenidoHojaTrabajo, setContenidoHojaTrabajo] =
    useState<ContenidoHojaTrabajo>(contenidoInicial);

  const [erroresHojaTrabajo, setErroresHojaTrabajo] = useState<string[]>([]);

  const [hayCambiosSinGuardar, setHayCambiosSinGuardar] = useState(false);

  const hojaTrabajoResuelta = estadoInicial === 'RESUELTO';

  function cambiarContenidoHojaTrabajo(nuevoContenido: ContenidoHojaTrabajo) {
    setContenidoHojaTrabajo(nuevoContenido);
    setHayCambiosSinGuardar(true);

    if (erroresHojaTrabajo.length > 0) {
      setErroresHojaTrabajo([]);
    }
  }

  async function guardarHojaTrabajo(estado: 'EN_EDICION' | 'RESUELTO') {
    if (estado === 'RESUELTO') {
      const errores = validarHojaTrabajoResuelta(contenidoHojaTrabajo);

      if (errores.length > 0) {
        setErroresHojaTrabajo(
          errores.map((error) =>
            error.fila ? `Fila N° ${error.fila}: ${error.mensaje}` : error.mensaje
          )
        );

        return;
      }
    }

    setErroresHojaTrabajo([]);

    await guardarResolucion.mutateAsync({
      idEjercicio,
      datos: {
        tipo: 'HOJA_TRABAJO',
        estado,
        contenido: contenidoHojaTrabajo,
      },
    });

    setHayCambiosSinGuardar(false);
  }

  return (
    <>
      {hayCambiosSinGuardar && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-800">
            Hay cambios sin guardar en la Hoja de Trabajo.
          </p>

          {hojaTrabajoResuelta && (
            <p className="mt-1 text-xs text-amber-700">
              La versión guardada continúa marcada como resuelta hasta que guardes estos cambios.
            </p>
          )}
        </div>
      )}

      <HojaTrabajoEditor contenido={contenidoHojaTrabajo} onChange={cambiarContenidoHojaTrabajo} />

      {erroresHojaTrabajo.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            No se puede marcar la Hoja de Trabajo como resuelta.
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {erroresHojaTrabajo.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
        {hojaTrabajoResuelta ? (
          hayCambiosSinGuardar ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-amber-700">Cambios sin guardar</span>

              <Button
                type="button"
                variant="solid"
                label="Guardar cambios"
                icon={<Save size={16} />}
                disabled={guardarResolucion.isPending}
                onClick={() => void guardarHojaTrabajo('EN_EDICION')}
                className="!rounded-lg !px-4 !py-2 !text-sm"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              ✓ Hoja de Trabajo resuelta
            </div>
          )
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              label="Guardar borrador"
              icon={<Save size={16} />}
              disabled={guardarResolucion.isPending || !hayCambiosSinGuardar}
              onClick={() => void guardarHojaTrabajo('EN_EDICION')}
              className="!rounded-lg !border-gray-300 !px-4 !py-2 !text-sm !font-medium !text-gray-700 hover:!bg-gray-50"
            />

            <Button
              type="button"
              variant="solid"
              label="✓ Marcar como resuelto"
              disabled={guardarResolucion.isPending}
              onClick={() => void guardarHojaTrabajo('RESUELTO')}
              className="!rounded-lg !px-4 !py-2 !text-sm"
            />
          </div>
        )}
      </div>
    </>
  );
}
