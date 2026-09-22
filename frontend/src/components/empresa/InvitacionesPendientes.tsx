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
      <div className="rounded-2xl bg-white p-8 text-center shadow-md">
        <p className="text-sm text-abacontex-gray-text">Cargando invitaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-md">
        <p className="text-sm text-red-600">No se pudieron cargar las invitaciones.</p>
      </div>
    );
  }

  const pendientes = invitaciones.filter(
    (invitacion) => invitacion.estado.toUpperCase() === 'PENDIENTE'
  );

  if (pendientes.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-md">
        <Mail className="mx-auto h-6 w-6 text-gray-400" />

        <p className="mt-3 text-sm text-abacontex-gray-text">No hay invitaciones pendientes.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-[minmax(0,1fr)_180px_180px] border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <span>Correo</span>
        <span>Estado</span>
        <span>Vencimiento</span>
      </div>

      {pendientes.map((invitacion) => (
        <div
          key={invitacion.id}
          className="grid grid-cols-[minmax(0,1fr)_180px_180px] items-center border-b border-gray-100 px-6 py-4 last:border-b-0"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
              <Mail className="h-4 w-4 text-amber-700" />
            </div>

            <span className="truncate text-sm font-medium text-gray-900">{invitacion.email}</span>
          </div>

          <div>
            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              Pendiente
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4 shrink-0" />

            {new Intl.DateTimeFormat('es-AR').format(new Date(invitacion.fechaExpiracion))}
          </div>
        </div>
      ))}
    </div>
  );
}
