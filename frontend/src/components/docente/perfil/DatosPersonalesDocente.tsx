import { Camera, Pencil } from 'lucide-react';
import { useState } from 'react';

import { useActualizarUsuarioActual } from '../../../hooks/useActualizarUsuarioActual';
import type { UsuarioActual } from '../../../types/usuario.types';

interface DatosPersonalesDocenteProps {
  usuario: UsuarioActual;
}

const LONGITUD_MINIMA = 2;
const LONGITUD_MAXIMA = 100;

export default function DatosPersonalesDocente({ usuario }: DatosPersonalesDocenteProps) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellido, setApellido] = useState(usuario.apellido);
  const [editando, setEditando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeValidacion, setMensajeValidacion] = useState<string | null>(null);

  const {
    mutate: actualizarUsuario,
    isPending,
    isError,
    reset: reiniciarMutacion,
  } = useActualizarUsuarioActual();

  const nombreLimpio = nombre.trim();
  const apellidoLimpio = apellido.trim();

  const hayCambios =
    nombreLimpio !== usuario.nombre.trim() || apellidoLimpio !== usuario.apellido.trim();

  const formularioValido =
    nombreLimpio.length >= LONGITUD_MINIMA &&
    apellidoLimpio.length >= LONGITUD_MINIMA &&
    nombreLimpio.length <= LONGITUD_MAXIMA &&
    apellidoLimpio.length <= LONGITUD_MAXIMA;

  const restaurarDatos = () => {
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setEditando(false);
    setMensajeExito(null);
    setMensajeValidacion(null);
    reiniciarMutacion();
  };

  const activarEdicion = () => {
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setEditando(true);
    setMensajeExito(null);
    setMensajeValidacion(null);
    reiniciarMutacion();
  };

  const guardarCambios = () => {
    setMensajeExito(null);
    setMensajeValidacion(null);
    reiniciarMutacion();

    if (!nombreLimpio || !apellidoLimpio) {
      setMensajeValidacion('El nombre y el apellido son obligatorios.');
      return;
    }

    if (nombreLimpio.length < LONGITUD_MINIMA) {
      setMensajeValidacion(`El nombre debe tener al menos ${LONGITUD_MINIMA} caracteres.`);
      return;
    }

    if (apellidoLimpio.length < LONGITUD_MINIMA) {
      setMensajeValidacion(`El apellido debe tener al menos ${LONGITUD_MINIMA} caracteres.`);
      return;
    }

    if (nombreLimpio.length > LONGITUD_MAXIMA) {
      setMensajeValidacion(`El nombre no puede superar los ${LONGITUD_MAXIMA} caracteres.`);
      return;
    }

    if (apellidoLimpio.length > LONGITUD_MAXIMA) {
      setMensajeValidacion(`El apellido no puede superar los ${LONGITUD_MAXIMA} caracteres.`);
      return;
    }

    if (!hayCambios) {
      setMensajeValidacion('No se realizaron cambios en los datos.');
      return;
    }

    actualizarUsuario(
      {
        nombre: nombreLimpio,
        apellido: apellidoLimpio,
        idRolEmpresa: null,
      },
      {
        onSuccess: () => {
          setNombre(nombreLimpio);
          setApellido(apellidoLimpio);
          setEditando(false);
          setMensajeExito('Los datos personales se actualizaron correctamente.');
        },
      }
    );
  };

  const iniciales = `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();

  const claseInputEditable = editando
    ? 'border-gray-300 bg-white text-abacontex-black-text focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20'
    : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-600';

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
        <h2 className="font-semibold text-abacontex-dark">Datos personales</h2>

        <button
          type="button"
          onClick={activarEdicion}
          disabled={editando || isPending}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-abacontex-dark disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Editar datos personales"
          title="Editar datos personales"
        >
          <Pencil size={19} />
        </button>
      </header>

      <div className="p-5">
        <div className="grid gap-7 lg:grid-cols-[135px_1fr]">
          <div className="flex flex-col items-center">
            <div className="relative">
              {usuario.fotoPerfilUrl ? (
                <img
                  src={usuario.fotoPerfilUrl}
                  alt={`Foto de ${usuario.nombre} ${usuario.apellido}`}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-2xl font-semibold text-abacontex-primary-two">
                  {iniciales}
                </div>
              )}

              <button
                type="button"
                disabled={!editando || isPending}
                className="absolute right-0 bottom-1 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Cambiar foto de perfil"
                title={
                  editando
                    ? 'Cambio de foto pendiente de integración'
                    : 'Activá la edición para cambiar la foto'
                }
              >
                <Camera size={15} />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-400">JPG o PNG. Máx. 2 MB</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              guardarCambios();
            }}
          >
            <div>
              <label
                htmlFor="nombre-docente"
                className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
              >
                Nombre <span className="text-red-500">*</span>
              </label>

              <input
                id="nombre-docente"
                type="text"
                value={nombre}
                disabled={!editando || isPending}
                onChange={(event) => {
                  setNombre(event.target.value);
                  setMensajeValidacion(null);
                  setMensajeExito(null);
                }}
                minLength={LONGITUD_MINIMA}
                maxLength={LONGITUD_MAXIMA}
                autoComplete="given-name"
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${claseInputEditable}`}
              />
            </div>

            <div>
              <label
                htmlFor="apellido-docente"
                className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
              >
                Apellido <span className="text-red-500">*</span>
              </label>

              <input
                id="apellido-docente"
                type="text"
                value={apellido}
                disabled={!editando || isPending}
                onChange={(event) => {
                  setApellido(event.target.value);
                  setMensajeValidacion(null);
                  setMensajeExito(null);
                }}
                minLength={LONGITUD_MINIMA}
                maxLength={LONGITUD_MAXIMA}
                autoComplete="family-name"
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${claseInputEditable}`}
              />
            </div>

            <div>
              <label
                htmlFor="correo-docente"
                className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
              >
                Correo institucional
              </label>

              <input
                id="correo-docente"
                type="email"
                value={usuario.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
              />
            </div>

            {mensajeValidacion && (
              <p role="alert" className="text-sm text-amber-700">
                {mensajeValidacion}
              </p>
            )}

            {isError && (
              <p role="alert" className="text-sm text-red-600">
                No se pudieron actualizar los datos. Verificá la información e intentá nuevamente.
              </p>
            )}

            {mensajeExito && (
              <p role="status" className="text-sm text-green-700">
                {mensajeExito}
              </p>
            )}

            {editando && (
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={restaurarDatos}
                  disabled={isPending}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isPending || !formularioValido || !hayCambios}
                  className="rounded-md bg-abacontex-primary-three px-4 py-2 text-sm font-medium text-white transition hover:bg-abacontex-primary-two disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            )}
          </form>
        </div>
        <p className="mt-5 text-xs text-gray-500">
          Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
        </p>
      </div>
    </section>
  );
}
