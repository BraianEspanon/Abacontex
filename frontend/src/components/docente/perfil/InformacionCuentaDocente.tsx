import {
  CalendarDays,
  CircleCheck,
  LockKeyhole,
  UserRound,
} from 'lucide-react';
import type { UsuarioActual } from '../../../types/usuario.types';

interface InformacionCuentaDocenteProps {
  usuario: UsuarioActual;
}

function formatearFecha(fecha?: string) {
  if (!fecha) {
    return 'No disponible';
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return 'No disponible';
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fechaConvertida);
}

export default function InformacionCuentaDocente({
  usuario,
}: InformacionCuentaDocenteProps) {
  const estadoCuenta = usuario.activo === false ? 'Inactivo' : 'Activo';

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">
          Información de la cuenta
        </h2>
      </header>

      <div className="px-6">
        <div className="flex items-center gap-4 border-b border-gray-200 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7eee3] text-[#668b61]">
            <UserRound size={20} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Rol</p>
            <p className="font-medium text-gray-900">
              {usuario.rolSistema?.nombreRol ?? 'No disponible'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-gray-200 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7eee3] text-[#668b61]">
            <CircleCheck size={20} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Estado de la cuenta</p>
            <p className="font-medium text-gray-900">{estadoCuenta}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7eee3] text-[#668b61]">
            <CalendarDays size={20} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Fecha de alta</p>
            <p className="font-medium text-gray-900">
              {formatearFecha(usuario.fechaAlta)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          type="button"
          disabled
          title="El cambio de contraseña se gestionará mediante Keycloak"
          className="mx-auto flex cursor-not-allow.ed items-center gap-2 rounded-lg bg-[#668b61] px-4 py-2 text-sm font-medium text-white opacity-60"
        >
          <LockKeyhole size={16} />
          Cambiar contraseña
        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
          Te recomendamos mantener tu contraseña segura y no compartirla con
          otras personas.
        </p>
      </div>
    </section>
  );
}