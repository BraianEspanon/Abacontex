import { X } from 'lucide-react';
import { useState } from 'react';

import { useCambiarRolParticipante } from '../../hooks/useCambiarRolParticipante';
import { useRolesEmpresa } from '../../hooks/useRolesEmpresa';

import type { IntegranteEmpresa } from '../../api/empresa.api';

interface CambiarRolModalProps {
  abierto: boolean;
  integrante: IntegranteEmpresa | null;
  onCerrar: () => void;
}

export default function CambiarRolModal({ abierto, integrante, onCerrar }: CambiarRolModalProps) {
  if (!abierto || !integrante) {
    return null;
  }

  return (
    <CambiarRolModalContenido key={integrante.id} integrante={integrante} onCerrar={onCerrar} />
  );
}

interface CambiarRolModalContenidoProps {
  integrante: IntegranteEmpresa;
  onCerrar: () => void;
}

function CambiarRolModalContenido({ integrante, onCerrar }: CambiarRolModalContenidoProps) {
  const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(
    integrante.rolEmpresa?.id ?? null
  );
  const [error, setError] = useState<string | null>(null);

  const { data: roles = [], isLoading: cargandoRoles } = useRolesEmpresa();
  const cambiarRolMutation = useCambiarRolParticipante();

  const rolesDisponibles = roles.filter((rol) => rol.nombreRol.toUpperCase() !== 'CEO');

  const handleCambiarRol = (valor: string) => {
    setRolSeleccionado(valor === '' ? null : Number(valor));
    setError(null);
  };

  const handleGuardar = async () => {
    if (!rolSeleccionado) {
      setError('Seleccioná un rol.');
      return;
    }

    if (rolSeleccionado === integrante.rolEmpresa?.id) {
      onCerrar();
      return;
    }

    setError(null);

    try {
      await cambiarRolMutation.mutateAsync({
        idAlumno: integrante.id,
        datos: {
          idRolEmpresa: rolSeleccionado,
        },
      });

      onCerrar();
    } catch {
      setError('No se pudo actualizar el rol del integrante. Intentá nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Cambiar rol</h2>

            <p className="mt-1 text-sm text-gray-500">
              Modificá el rol de {integrante.nombre} {integrante.apellido}.
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={cambiarRolMutation.isPending}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-gray-700">Integrante</p>

            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">
                {integrante.nombre} {integrante.apellido}
              </p>

              <p className="mt-0.5 text-sm text-gray-500">{integrante.email}</p>
            </div>
          </div>

          <div>
            <label htmlFor="rol-integrante" className="text-sm font-medium text-gray-700">
              Rol
            </label>

            <select
              id="rol-integrante"
              value={rolSeleccionado ?? ''}
              onChange={(event) => handleCambiarRol(event.target.value)}
              disabled={cargandoRoles || cambiarRolMutation.isPending}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-gray-100"
            >
              <option value="">Seleccionar rol</option>

              {rolesDisponibles.map((rol) => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.nombreRol}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onCerrar}
            disabled={cambiarRolMutation.isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleGuardar}
            disabled={cargandoRoles || cambiarRolMutation.isPending || !rolSeleccionado}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cambiarRolMutation.isPending ? 'Guardando...' : 'Guardar cambio'}
          </button>
        </div>
      </div>
    </div>
  );
}
