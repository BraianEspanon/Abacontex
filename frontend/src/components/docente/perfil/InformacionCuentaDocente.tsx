import { CalendarDays, CircleCheck, LockKeyhole, UserRound } from 'lucide-react';
import { useState } from 'react';

import type { UsuarioActual } from '../../../types/usuario.types';
import CambiarPasswordModal from './CambiarPasswordModal';

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

function formatearRol(rol?: string) {
  if (!rol) {
    return 'No disponible';
  }

  return rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase();
}

export default function InformacionCuentaDocente({ usuario }: InformacionCuentaDocenteProps) {
  const [modalPasswordAbierto, setModalPasswordAbierto] = useState(false);

  const estadoCuenta = usuario.activo === false ? 'Inactivo' : 'Activo';

  const filas = [
    {
      etiqueta: 'Rol',
      valor: formatearRol(usuario.rolSistema?.nombreRol),
      icono: UserRound,
    },
    {
      etiqueta: 'Estado de la cuenta',
      valor: estadoCuenta,
      icono: CircleCheck,
    },
    {
      etiqueta: 'Fecha de alta',
      valor: formatearFecha(usuario.fechaAlta),
      icono: CalendarDays,
    },
  ];

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <header className="border-b border-gray-200 px-5 py-3.5">
          <h2 className="font-semibold text-abacontex-dark">Información de la cuenta</h2>
        </header>

        <div className="px-5">
          {filas.map(({ etiqueta, valor, icono: Icono }, index) => (
            <div
              key={etiqueta}
              className={`flex items-center gap-4 py-4 ${
                index < filas.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-abacontex-primary-two">
                <Icono size={20} />
              </div>

              <div>
                <p className="text-sm text-abacontex-gray-text">{etiqueta}</p>
                <p className="font-medium text-abacontex-dark">{valor}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pt-1 pb-5">
          <button
            type="button"
            onClick={() => setModalPasswordAbierto(true)}
            className="mx-auto flex items-center gap-2 rounded-md bg-abacontex-primary-three px-4 py-2 text-sm font-medium text-white transition hover:bg-abacontex-primary-two"
          >
            <LockKeyhole size={16} />
            Cambiar contraseña
          </button>

          <p className="mx-auto mt-4 max-w-sm text-center text-xs leading-4 text-gray-400">
            Te recomendamos mantener tu contraseña segura y no compartirla con otras personas.
          </p>
        </div>
      </section>

      <CambiarPasswordModal
        abierto={modalPasswordAbierto}
        onCerrar={() => setModalPasswordAbierto(false)}
      />
    </>
  );
}
