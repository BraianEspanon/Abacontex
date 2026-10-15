import { CalendarDays, ExternalLink, Save, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import LibroDiarioEditor from '../../components/ejercicios/resolucion/LibroDiarioEditor';

import { useGuardarResolucionEjercicio } from '../../hooks/useGuardarResolucionEjercicio';
import { useResolucionEjercicio } from '../../hooks/useResolucionEjercicio';

import type { ContenidoLibroDiario, TipoPlantillaEjercicio } from '../../types/ejercicio.types';

import { validarLibroDiarioResuelto } from '../../utils/validarLibroDiario';

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
    return (
      <div className="p-6 text-sm text-red-600">El identificador del ejercicio no es válido.</div>
    );
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Cargando resolución...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-sm text-red-600">No se pudo cargar la resolución del ejercicio.</div>
    );
  }

  const tipoActivo = tipoSeleccionado ?? data.plantillas[0]?.tipo ?? null;

  const plantillaActiva = data.plantillas.find((plantilla) => plantilla.tipo === tipoActivo);

  const libroDiario = data.plantillas.find((plantilla) => plantilla.tipo === 'LIBRO_DIARIO');

  const contenidoInicialLibroDiario = (libroDiario?.contenido as
    | ContenidoLibroDiario
    | undefined) ?? {
    asientos: [],
  };

  return (
    <div className="space-y-5 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Continuar resolución del ejercicio
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Completa la solución modelo del ejercicio utilizando las plantillas contables.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <CalendarDays size={17} className="text-gray-500" />

            <div>
              <p className="text-[11px] text-gray-500">Fecha límite</p>

              <p className="text-xs font-medium text-gray-800">
                {formatearFecha(data.fechaLimite)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEnunciadoAbierto(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Ver enunciado completo
            <ExternalLink size={15} />
          </button>
        </div>
      </div>

      {/* Resumen + progreso */}
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-gray-900">{data.titulo}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              Resolución
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              {data.estado}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-900">Progreso de resolución</p>

          <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
            <span>
              {progreso.resueltas} de {progreso.total} plantillas completadas
            </span>

            <span>{Math.round(progreso.porcentaje)}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-700 transition-all"
              style={{
                width: `${progreso.porcentaje}%`,
              }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            {data.plantillas.map((plantilla) => (
              <div key={plantilla.idEjercicioPlantilla} className="text-xs">
                <p className="font-medium text-gray-800">{NOMBRES_PLANTILLAS[plantilla.tipo]}</p>

                <p className="text-gray-500">{plantilla.estado}</p>
              </div>
            ))}
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
                className={`border-b-2 px-1 pb-3 text-sm font-medium ${
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

      {plantillaActiva?.tipo === 'LIBRO_DIARIO' && (
        <ResolucionLibroDiario
          key={libroDiario?.idEjercicioPlantilla ?? 'libro-diario'}
          idEjercicio={idEjercicio}
          contenidoInicial={contenidoInicialLibroDiario}
          estadoInicial={libroDiario?.estado}
        />
      )}

      {plantillaActiva && plantillaActiva.tipo !== 'LIBRO_DIARIO' && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
          La plantilla <strong>{NOMBRES_PLANTILLAS[plantillaActiva.tipo]}</strong> será implementada
          en el siguiente paso.
        </div>
      )}

      {/* Volver */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => navigate('/docente/ejercicios')}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Volver a Mis ejercicios
        </button>
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
      {/* Aviso de cambios sin guardar */}
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

      {/* Errores de validación */}
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

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
        {libroDiarioResuelto ? (
          hayCambiosSinGuardar ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-amber-700">Cambios sin guardar</span>

              <button
                type="button"
                disabled={guardarResolucion.isPending}
                onClick={() => void guardarLibroDiario('EN_EDICION')}
                className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
              >
                <Save size={16} />
                Guardar cambios
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              ✓ Libro Diario resuelto
            </div>
          )
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={guardarResolucion.isPending || !hayCambiosSinGuardar}
              onClick={() => void guardarLibroDiario('EN_EDICION')}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
              Guardar borrador
            </button>

            <button
              type="button"
              disabled={guardarResolucion.isPending}
              onClick={() => void guardarLibroDiario('RESUELTO')}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
            >
              ✓ Marcar como resuelto
            </button>
          </div>
        )}
      </div>
    </>
  );
}
