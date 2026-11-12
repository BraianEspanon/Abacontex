import { useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Home,
  MessageSquareText,
  UserRound,
} from 'lucide-react';

import { Link, useParams } from 'react-router-dom';

import axios from 'axios';

import PlantillasCorreccionAlumno from '../../components/ejercicios/correccion/PlantillasCorreccionAlumno';
import DetalleErrorModal from '../../components/correcciones/DetalleErrorModal';

import { useCorreccionAlumno } from '../../hooks/useCorreccionAlumno';

import type { ErrorDetalleCorreccion } from '../../types/espacioTrabajoCorreccion.types';

function formatearFecha(fecha: string | null) {
  if (!fecha) return 'No disponible';

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
}

export default function CorreccionEjercicioAlumno() {
  const { idEjercicio: idParam } = useParams();

  const idEjercicio = Number(idParam);

  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<number | null>(null);

  const [errorSeleccionado, setErrorSeleccionado] = useState<ErrorDetalleCorreccion | null>(null);

  const { data, isLoading, isError, error, refetch } = useCorreccionAlumno(idEjercicio);

  if (!Number.isInteger(idEjercicio) || idEjercicio <= 0) {
    return <p className="p-6 text-sm text-red-600">El identificador del ejercicio no es válido.</p>;
  }

  if (isLoading) {
    return <p className="p-6 text-sm text-gray-500">Cargando corrección del ejercicio...</p>;
  }

  if (isError || !data) {
    const noDisponible = axios.isAxiosError(error) && error.response?.status === 404;

    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-red-600">
          {noDisponible
            ? 'La corrección todavía no está disponible o no se encontró el ejercicio.'
            : 'No se pudo cargar la corrección del ejercicio.'}
        </p>

        <div className="flex gap-3">
          <Link
            to="/alumno/ejercicios"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
          >
            Volver a Mis ejercicios
          </Link>

          {!noDisponible && (
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-lg bg-abacontex-primary-three px-4 py-2 text-sm text-white"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  const nombreDocente = `${data.docente.nombre} ${data.docente.apellido}`.trim();

  return (
    <div className="space-y-6 p-6 text-abacontex-black-text">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-abacontex-gray-text">
        <Link to="/alumno" className="flex items-center gap-1">
          <Home className="size-4" />
          Inicio
        </Link>

        <ChevronRight className="size-4" />

        <Link to="/alumno/ejercicios">Mis ejercicios</Link>

        <ChevronRight className="size-4" />

        <span className="font-semibold text-abacontex-dark">Ver corrección</span>
      </nav>

      <header className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-abacontex-dark">{data.titulo}</h1>

            <p className="mt-2 text-sm text-gray-500">Corrección del docente</p>
          </div>

          <span className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700">
            Corregido
          </span>
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-start gap-2">
            <UserRound className="size-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Docente</p>
              <p className="font-medium">{nombreDocente}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CalendarDays className="size-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Fecha de entrega</p>
              <p className="font-medium">{formatearFecha(data.entrega.fechaEntrega)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <ClipboardCheck className="size-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Fecha de corrección</p>
              <p className="font-medium">{formatearFecha(data.correccion.fechaCorreccion)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileText className="size-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Plantillas entregadas</p>
              <p className="font-medium">
                {
                  data.plantillas.filter((plantilla) => plantilla.estadoAlumno === 'COMPLETADA')
                    .length
                }{' '}
                de {data.plantillas.length}
              </p>
            </div>
          </div>
        </div>

        <details className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-abacontex-dark">
            Ver enunciado completo
          </summary>

          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <p className="whitespace-pre-wrap">{data.enunciado}</p>

            {data.indicaciones && (
              <div>
                <p className="font-semibold">Indicaciones</p>
                <p className="mt-1 whitespace-pre-wrap">{data.indicaciones}</p>
              </div>
            )}
          </div>
        </details>
      </header>

      <PlantillasCorreccionAlumno
        plantillas={data.plantillas}
        plantillaSeleccionada={plantillaSeleccionada}
        onSeleccionar={setPlantillaSeleccionada}
        onVerError={setErrorSeleccionado}
      />

      <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-abacontex-dark">
          <MessageSquareText className="size-5 text-abacontex-primary" />
          Retroalimentación del docente
        </h2>

        {data.correccion.retroalimentacion?.trim() ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {data.correccion.retroalimentacion}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            El docente no agregó una retroalimentación general.
          </p>
        )}
      </section>

      <Link
        to="/alumno/ejercicios"
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-abacontex-dark transition hover:bg-gray-50"
      >
        <ArrowLeft className="size-4" />
        Volver a Mis ejercicios
      </Link>

      <DetalleErrorModal
        error={errorSeleccionado}
        guardando={false}
        soloLectura
        onCerrar={() => setErrorSeleccionado(null)}
        onGuardar={async () => {}}
      />
    </div>
  );
}
