import { isAxiosError } from 'axios';
import { Eye, EyeOff, LockKeyhole, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { useActualizarPassword } from '../../../hooks/useActualizarPassword';

interface CambiarPasswordModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

interface ContenidoCambiarPasswordModalProps {
  onCerrar: () => void;
}

const LONGITUD_MINIMA_PASSWORD = 8;

const PASSWORD_SEGURA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function ContenidoCambiarPasswordModal({ onCerrar }: ContenidoCambiarPasswordModalProps) {
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmacionPassword, setConfirmacionPassword] = useState('');

  const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false);
  const [mostrarPasswordNueva, setMostrarPasswordNueva] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [mensajeValidacion, setMensajeValidacion] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const {
    mutate: cambiarPassword,
    isPending,
    isError,
    error,
    reset: reiniciarMutacion,
  } = useActualizarPassword();

  const cerrarModal = useCallback(() => {
    if (isPending) {
      return;
    }

    onCerrar();
  }, [isPending, onCerrar]);

  useEffect(() => {
    const manejarEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cerrarModal();
      }
    };

    document.addEventListener('keydown', manejarEscape);

    return () => {
      document.removeEventListener('keydown', manejarEscape);
    };
  }, [cerrarModal]);

  const obtenerMensajeError = () => {
    if (!isError) {
      return null;
    }

    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        return 'La contraseña actual ingresada es incorrecta.';
      }

      if (error.response?.status === 400) {
        return 'La nueva contraseña no cumple con los requisitos establecidos.';
      }

      if (error.response?.status === 404) {
        return 'No se encontró el usuario autenticado.';
      }
    }

    return 'No se pudo cambiar la contraseña. Intentá nuevamente.';
  };

  const guardarPassword = () => {
    setMensajeValidacion(null);
    setMensajeExito(null);
    reiniciarMutacion();

    if (!passwordActual || !passwordNueva || !confirmacionPassword) {
      setMensajeValidacion('Todos los campos son obligatorios.');
      return;
    }

    if (passwordNueva.length < LONGITUD_MINIMA_PASSWORD) {
      setMensajeValidacion(
        `La nueva contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres.`
      );
      return;
    }

    if (!PASSWORD_SEGURA.test(passwordNueva)) {
      setMensajeValidacion(
        'La nueva contraseña debe incluir al menos una mayúscula, una minúscula y un número.'
      );
      return;
    }

    if (passwordNueva !== confirmacionPassword) {
      setMensajeValidacion('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    if (passwordActual === passwordNueva) {
      setMensajeValidacion('La nueva contraseña debe ser diferente de la contraseña actual.');
      return;
    }

    cambiarPassword(
      {
        currentPassword: passwordActual,
        newPassword: passwordNueva,
      },
      {
        onSuccess: () => {
          setPasswordActual('');
          setPasswordNueva('');
          setConfirmacionPassword('');
          setMensajeExito('La contraseña se actualizó correctamente.');
        },
      }
    );
  };

  const mensajeError = obtenerMensajeError();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-cambiar-password"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          cerrarModal();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-abacontex-primary-two">
              <LockKeyhole size={20} />
            </div>

            <div>
              <h2 id="titulo-cambiar-password" className="font-semibold text-abacontex-dark">
                Cambiar contraseña
              </h2>

              <p className="text-sm text-abacontex-gray-text">
                Ingresá tu contraseña actual y una nueva.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={cerrarModal}
            disabled={isPending}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </header>

        <form
          className="space-y-4 px-6 py-5"
          onSubmit={(event) => {
            event.preventDefault();
            guardarPassword();
          }}
        >
          <div>
            <label
              htmlFor="password-actual"
              className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
            >
              Contraseña actual <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                id="password-actual"
                type={mostrarPasswordActual ? 'text' : 'password'}
                value={passwordActual}
                onChange={(event) => {
                  setPasswordActual(event.target.value);
                  setMensajeValidacion(null);
                  setMensajeExito(null);
                  reiniciarMutacion();
                }}
                disabled={isPending}
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20 disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setMostrarPasswordActual((valorActual) => !valorActual)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
                aria-label={
                  mostrarPasswordActual ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'
                }
              >
                {mostrarPasswordActual ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="password-nueva"
              className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
            >
              Nueva contraseña <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                id="password-nueva"
                type={mostrarPasswordNueva ? 'text' : 'password'}
                value={passwordNueva}
                onChange={(event) => {
                  setPasswordNueva(event.target.value);
                  setMensajeValidacion(null);
                  setMensajeExito(null);
                  reiniciarMutacion();
                }}
                disabled={isPending}
                minLength={LONGITUD_MINIMA_PASSWORD}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20 disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setMostrarPasswordNueva((valorActual) => !valorActual)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
                aria-label={
                  mostrarPasswordNueva ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'
                }
              >
                {mostrarPasswordNueva ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmacion-password"
              className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
            >
              Confirmar nueva contraseña <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                id="confirmacion-password"
                type={mostrarConfirmacion ? 'text' : 'password'}
                value={confirmacionPassword}
                onChange={(event) => {
                  setConfirmacionPassword(event.target.value);
                  setMensajeValidacion(null);
                  setMensajeExito(null);
                  reiniciarMutacion();
                }}
                disabled={isPending}
                minLength={LONGITUD_MINIMA_PASSWORD}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 text-sm text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20 disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setMostrarConfirmacion((valorActual) => !valorActual)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
                aria-label={mostrarConfirmacion ? 'Ocultar confirmación' : 'Mostrar confirmación'}
              >
                {mostrarConfirmacion ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mensajeValidacion && (
            <p role="alert" className="text-sm text-amber-700">
              {mensajeValidacion}
            </p>
          )}

          {mensajeError && (
            <p role="alert" className="text-sm text-red-600">
              {mensajeError}
            </p>
          )}

          {mensajeExito && (
            <p role="status" className="text-sm text-green-700">
              {mensajeExito}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={cerrarModal}
              disabled={isPending}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mensajeExito ? 'Cerrar' : 'Cancelar'}
            </button>

            {!mensajeExito && (
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-abacontex-primary-three px-4 py-2 text-sm font-medium text-white transition hover:bg-abacontex-primary-two disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CambiarPasswordModal({ abierto, onCerrar }: CambiarPasswordModalProps) {
  if (!abierto) {
    return null;
  }

  return <ContenidoCambiarPasswordModal onCerrar={onCerrar} />;
}
