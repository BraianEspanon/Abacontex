import axios from 'axios';
import { X } from 'lucide-react';
import { useState } from 'react';

import SelectorIntegrantes from './SelectorIntegrantes';

import { useAgregarParticipantesEmpresa } from '../../hooks/useAgregarParticipantesEmpresa';
import { useCandidatosEmpresa } from '../../hooks/useCandidatosEmpresa';
import { useCrearInvitacionesEmpresa } from '../../hooks/useCrearInvitacionesEmpresa';
import { useDebounce } from '../../hooks/useDebounce';

import type { AlumnoDisponible, InvitacionPendiente } from '../../types/empresa.types';

interface AgregarIntegranteModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

interface RespuestaErrorApi {
  message?: string;
  error?: string;
}

function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError<RespuestaErrorApi>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      'No se pudieron agregar los integrantes.'
    );
  }

  return 'Ocurrió un error inesperado. Intentá nuevamente.';
}

export default function AgregarIntegranteModal({ abierto, onCerrar }: AgregarIntegranteModalProps) {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<AlumnoDisponible[]>([]);
  const [invitaciones, setInvitaciones] = useState<InvitacionPendiente[]>([]);
  const [error, setError] = useState('');

  const busquedaDebounced = useDebounce(busqueda, 400);

  const {
    data: alumnos = [],
    isLoading: cargandoAlumnos,
    isError: errorAlumnos,
    refetch: reintentarBusqueda,
  } = useCandidatosEmpresa(busquedaDebounced);

  const agregarParticipantes = useAgregarParticipantesEmpresa();
  const crearInvitaciones = useCrearInvitacionesEmpresa();

  const enviando = agregarParticipantes.isPending || crearInvitaciones.isPending;

  if (!abierto) {
    return null;
  }

  const limpiar = () => {
    setBusqueda('');
    setSeleccionados([]);
    setInvitaciones([]);
    setError('');
  };

  const handleCerrar = () => {
    if (enviando) {
      return;
    }

    limpiar();
    onCerrar();
  };

  const handleToggleAlumno = (alumno: AlumnoDisponible) => {
    setError('');

    setSeleccionados((actuales) => {
      const yaSeleccionado = actuales.some((seleccionado) => seleccionado.id === alumno.id);

      if (yaSeleccionado) {
        return actuales.filter((seleccionado) => seleccionado.id !== alumno.id);
      }

      return [...actuales, alumno];
    });
  };

  const handleAgregarInvitacion = (email: string) => {
    setError('');

    setInvitaciones((actuales) => [
      ...actuales,
      {
        id: crypto.randomUUID(),
        email,
      },
    ]);
  };

  const handleEliminarInvitacion = (id: string) => {
    setInvitaciones((actuales) => actuales.filter((invitacion) => invitacion.id !== id));
  };

  const handleConfirmar = async () => {
    if (seleccionados.length === 0 && invitaciones.length === 0) {
      setError('Seleccioná al menos un alumno registrado o agregá una invitación por correo.');
      return;
    }

    setError('');

    try {
      /*
       * Primero incorporamos los alumnos que ya están registrados.
       */
      if (seleccionados.length > 0) {
        await agregarParticipantes.mutateAsync({
          participantes: seleccionados.map((alumno) => alumno.id),
        });
      }

      /*
       * Luego enviamos las invitaciones a quienes todavía
       * no están registrados.
       */
      if (invitaciones.length > 0) {
        await crearInvitaciones.mutateAsync({
          emails: invitaciones.map((invitacion) => invitacion.email),
        });
      }

      limpiar();
      onCerrar();
    } catch (err) {
      setError(obtenerMensajeError(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-abacontext-light-bg shadow-xl">
        {/* Encabezado */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-abacontex-black-text">
              Agregar integrante
            </h2>

            <p className="mt-1 text-sm text-abacontex-gray-text">
              Incorporá alumnos registrados o enviá una invitación por correo.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCerrar}
            disabled={enviando}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <SelectorIntegrantes
            alumnos={alumnos}
            seleccionados={seleccionados}
            invitaciones={invitaciones}
            busqueda={busqueda}
            cargandoAlumnos={cargandoAlumnos}
            errorAlumnos={errorAlumnos}
            onBusquedaChange={setBusqueda}
            onReintentarBusqueda={() => {
              void reintentarBusqueda();
            }}
            onToggleAlumno={handleToggleAlumno}
            onAgregarInvitacion={handleAgregarInvitacion}
            onEliminarInvitacion={handleEliminarInvitacion}
          />

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={handleCerrar}
            disabled={enviando}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirmar}
            disabled={enviando || (seleccionados.length === 0 && invitaciones.length === 0)}
            className="rounded-xl bg-abacontex-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-abacontex-primary-two disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
