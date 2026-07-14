import { Camera, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { UsuarioActual } from '../../../types/usuario.types';

interface DatosPersonalesDocenteProps {
  usuario: UsuarioActual;
}

export default function DatosPersonalesDocente({
  usuario,
}: DatosPersonalesDocenteProps) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellido, setApellido] = useState(usuario.apellido);

  useEffect(() => {
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
  }, [usuario.nombre, usuario.apellido]);

  const restaurarDatos = () => {
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
  };

  const iniciales =
    `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="font-semibold text-gray-900">Datos personales</h2>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          aria-label="Editar datos personales"
          title="Editar datos personales"
        >
          <Pencil size={19} />
        </button>
      </header>

      <div className="p-6">
        <div className="grid gap-8 lg:grid-cols-[150px_1fr]">
          <div className="flex flex-col items-center">
            <div className="relative">
              {usuario.fotoPerfilUrl ? (
                <img
                  src={usuario.fotoPerfilUrl}
                  alt={`Foto de ${usuario.nombre} ${usuario.apellido}`}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#e7eee3] text-3xl font-semibold text-[#587554]">
                  {iniciales}
                </div>
              )}

              <button
                type="button"
                className="absolute right-0 bottom-1 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
                aria-label="Cambiar foto de perfil"
                title="Cambio de foto pendiente de integración"
              >
                <Camera size={17} />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-400">
              JPG o PNG. Máx. 2 MB
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label
                htmlFor="nombre-docente"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nombre <span className="text-red-500">*</span>
              </label>

              <input
                id="nombre-docente"
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#668b61] focus:ring-2 focus:ring-[#668b61]/20"
              />
            </div>

            <div>
              <label
                htmlFor="apellido-docente"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Apellido <span className="text-red-500">*</span>
              </label>

              <input
                id="apellido-docente"
                type="text"
                value={apellido}
                onChange={(event) => setApellido(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#668b61] focus:ring-2 focus:ring-[#668b61]/20"
              />
            </div>

            <div>
              <label
                htmlFor="correo-docente"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Correo institucional
              </label>

              <input
                id="correo-docente"
                type="email"
                value={usuario.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={restaurarDatos}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled
                title="La actualización del perfil se habilitará cuando exista el endpoint correspondiente"
                className="cursor-not-allowed rounded-lg bg-[#668b61] px-4 py-2 text-sm font-medium text-white opacity-60"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Los campos marcados con <span className="text-red-500">*</span> son
          obligatorios.
        </p>
      </div>
    </section>
  );
}