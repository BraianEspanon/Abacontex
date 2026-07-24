// src/components/empresa/SelectorIntegrantes.tsx

import { Mail, Search, UserRoundPlus, X } from 'lucide-react';
import { useState } from 'react';
import type {
  AlumnoDisponible,
  InvitacionPendiente,
} from '../../types/empresa.types';

interface SelectorIntegrantesProps {
  alumnos: AlumnoDisponible[];
  seleccionados: AlumnoDisponible[];
  invitaciones: InvitacionPendiente[];

  busqueda: string;
  cargandoAlumnos: boolean;
  errorAlumnos: boolean;

  onBusquedaChange: (value: string) => void;
  onReintentarBusqueda: () => void;
  onToggleAlumno: (alumno: AlumnoDisponible) => void;
  onAgregarInvitacion: (email: string) => void;
  onEliminarInvitacion: (id: string) => void;
}

export default function SelectorIntegrantes({
  alumnos,
  seleccionados,
  invitaciones,
  busqueda,
  cargandoAlumnos,
  errorAlumnos,
  onBusquedaChange,
  onReintentarBusqueda,
  onToggleAlumno,
  onAgregarInvitacion,
  onEliminarInvitacion,
}: SelectorIntegrantesProps) {
  const [pestanaActiva, setPestanaActiva] = useState<
    'registrados' | 'invitacion'
  >('registrados');
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

  const estaSeleccionado = (id: string) =>
    seleccionados.some((alumno) => alumno.id === id);

  const handleAgregarInvitacion = () => {
    const correo = email.trim().toLowerCase();

    if (!correo) {
      setErrorEmail('Ingresá una dirección de correo.');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    if (!emailValido) {
      setErrorEmail('Ingresá una dirección de correo válida.');
      return;
    }

    const yaInvitado = invitaciones.some(
      (invitacion) => invitacion.email === correo,
    );

    if (yaInvitado) {
      setErrorEmail('Ese correo ya fue agregado.');
      return;
    }

    onAgregarInvitacion(correo);
    setEmail('');
    setErrorEmail('');
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <UserRoundPlus className="h-5 w-5 text-abacontex-primary" />
          <h2 className="font-heading text-xl font-bold text-abacontex-black-text">
            Agregar integrantes
          </h2>
        </div>

        <p className="mt-1 text-sm text-abacontex-gray-text">
          Buscá compañeros registrados o invitá integrantes mediante correo.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 rounded-xl bg-abacontext-light-bg p-1">
        <button
          type="button"
          onClick={() => setPestanaActiva('registrados')}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            pestanaActiva === 'registrados'
              ? 'bg-white text-abacontex-dark shadow-sm'
              : 'text-abacontex-gray-text'
          }`}
        >
          Buscar alumnos registrados
        </button>

        <button
          type="button"
          onClick={() => setPestanaActiva('invitacion')}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            pestanaActiva === 'invitacion'
              ? 'bg-white text-abacontex-dark shadow-sm'
              : 'text-abacontex-gray-text'
          }`}
        >
          Invitar por correo
        </button>
      </div>

      {pestanaActiva === 'registrados' ? (
        <>
          <div className="relative mb-3">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-abacontex-gray-text" />

            <input
              type="search"
              value={busqueda}
               onChange={(event) => onBusquedaChange(event.target.value)}
              placeholder="Buscá por nombre, apellido, correo o curso..."
              className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 text-sm outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20"
            />
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-gray-200">
  {cargandoAlumnos ? (
    <div className="flex items-center justify-center p-6">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-abacontex-primary border-t-transparent" />

      <p className="ml-3 text-sm text-abacontex-gray-text">
        Buscando alumnos disponibles...
      </p>
    </div>
  ) : errorAlumnos ? (
    <div className="p-6 text-center">
      <p className="text-sm text-red-600">
        No se pudieron cargar los alumnos disponibles.
      </p>

      <button
        type="button"
        onClick={onReintentarBusqueda}
        className="mt-3 text-sm font-semibold text-abacontex-primary hover:underline"
      >
        Intentar nuevamente
      </button>
    </div>
  ) : alumnos.length === 0 ? (
    <div className="p-6 text-center">
      <p className="text-sm text-abacontex-gray-text">
        {busqueda.trim()
          ? 'No se encontraron alumnos con ese criterio.'
          : 'No hay alumnos disponibles en tu curso.'}
      </p>
    </div>
  ) : (
    alumnos.map((alumno) => {
      const seleccionado = estaSeleccionado(alumno.id);

      return (
        <label
          key={alumno.id}
          className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-abacontext-light-bg"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-abacontex-primary text-xs font-semibold text-white">
            {alumno.nombre.charAt(0)}
            {alumno.apellido.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-medium text-abacontex-black-text">
              {alumno.nombre} {alumno.apellido}
            </p>

            <p className="truncate text-xs text-abacontex-gray-text">
              {alumno.rolEmpresa?.nombre
                ? `${alumno.rolEmpresa.nombre} · `
                : ''}
              {alumno.email}
            </p>
          </div>

          <input
            type="checkbox"
            checked={seleccionado}
            onChange={() => onToggleAlumno(alumno)}
            className="h-4 w-4 accent-abacontex-primary"
          />
        </label>
      );
    })
  )}
</div>
        </>
      ) : (
        <div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-abacontex-gray-text" />

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrorEmail('');
                }}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 text-sm outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20"
              />
            </div>

            <button
              type="button"
              onClick={handleAgregarInvitacion}
              className="rounded-xl bg-abacontex-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-abacontex-primary-two"
            >
              Agregar
            </button>
          </div>

          {errorEmail && (
            <p className="mt-2 text-sm text-red-600">{errorEmail}</p>
          )}
        </div>
      )}

      {(seleccionados.length > 0 || invitaciones.length > 0) && (
        <div className="mt-5 border-t border-gray-200 pt-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-abacontex-gray-text">
            Integrantes agregados
          </h3>

          <div className="flex flex-wrap gap-2">
            {seleccionados.map((alumno) => (
              <button
                key={alumno.id}
                type="button"
                onClick={() => onToggleAlumno(alumno)}
                className="inline-flex items-center gap-2 rounded-full border border-abacontex-primary/20 bg-abacontex-primary/10 px-3 py-2 text-sm text-abacontex-primary"
              >
                {alumno.nombre} {alumno.apellido}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}

            {invitaciones.map((invitacion) => (
              <button
                key={invitacion.id}
                type="button"
                onClick={() => onEliminarInvitacion(invitacion.id)}
                className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800"
              >
                {invitacion.email}
                <span className="text-xs">Pendiente</span>
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}