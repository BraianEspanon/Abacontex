import { Clock, Mail } from 'lucide-react';

import type { InvitacionEmpresaEnviada } from '../../types/invitacion.types';

interface InvitacionesPendientesProps {
  invitaciones: InvitacionEmpresaEnviada[];
  cargando: boolean;
  error: boolean;
}

export default function InvitacionesPendientes({
  invitaciones,
  cargando,
  error,
}: InvitacionesPendientesProps) {
  if (cargando) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-lg border border-gray-200 bg-gray-50/40">
        <p className="text-sm text-abacontex-gray-text">Cargando invitaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-lg border border-red-100 bg-red-50/30">
        <p className="text-sm text-red-600">No se pudieron cargar las invitaciones.</p>
      </div>
    );
  }

  const pendientes = invitaciones.filter(
    (invitacion) => invitacion.estado.toUpperCase() === 'PENDIENTE'
  );

  if (pendientes.length === 0) {
    return (
      <div className="flex min-h-24 flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50/30">
        <Mail className="h-5 w-5 text-gray-400" />

        <p className="mt-2 text-sm text-abacontex-gray-text">No hay invitaciones pendientes.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                Correo electrónico
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Estado</th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                Vencimiento
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {pendientes.map((invitacion) => (
              <tr key={invitacion.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Mail className="h-4 w-4 text-gray-500" />
                    </div>

                    <span className="truncate text-sm font-medium text-gray-900">
                      {invitacion.email}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Pendiente
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 shrink-0" />

                    {new Intl.DateTimeFormat('es-AR').format(new Date(invitacion.fechaExpiracion))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
