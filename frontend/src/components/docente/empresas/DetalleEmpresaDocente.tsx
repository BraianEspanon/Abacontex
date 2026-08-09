import { CalendarDays, Mail, Users, X } from 'lucide-react';

import type { EmpresaDocenteDetalle } from '../../../types/empresa-docente.type';

interface DetalleEmpresaDocenteProps {
  empresa: EmpresaDocenteDetalle;
  onClose: () => void;
}

function formatearFecha(fecha: string | null) {
  if (!fecha) {
    return 'Sin información';
  }

  const fechaFormateada = new Date(fecha);

  if (Number.isNaN(fechaFormateada.getTime())) {
    return 'Sin información';
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fechaFormateada);
}

export default function DetalleEmpresaDocente({ empresa, onClose }: DetalleEmpresaDocenteProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* =====================================================
          ENCABEZADO
          ===================================================== */}
      <header className="flex shrink-0 items-start justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Detalle de la empresa</h2>

          <p className="mt-0.5 text-xs text-gray-500">Información de la empresa seleccionada</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle de empresa"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <X size={18} />
        </button>
      </header>

      {/* =====================================================
          CONTENIDO
          ===================================================== */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {/* Información principal */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-start gap-3">
            {empresa.logoUrl ? (
              <img
                src={empresa.logoUrl}
                alt={`Logo de ${empresa.nombre}`}
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#eef3ee] text-lg font-semibold text-[#769a75]">
                {empresa.nombre.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-gray-900">{empresa.nombre}</h3>

              <p className="mt-1 text-xs leading-4 text-gray-500">{empresa.actividad}</p>
            </div>

            <span
              className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                empresa.activa === true
                  ? 'bg-[#eaf4e9] text-[#4f6f52]'
                  : empresa.activa === false
                    ? 'bg-[#fce9e8] text-[#b84545]'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {empresa.activa === true
                ? 'Activa'
                : empresa.activa === false
                  ? 'Inactiva'
                  : 'Sin información'}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
            <div>
              <p className="text-[11px] text-gray-400">Curso</p>

              <p className="mt-1 text-sm font-medium text-gray-800">{empresa.curso}</p>
            </div>

            <div>
              <p className="text-[11px] text-gray-400">Integrantes</p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {empresa.cantidadIntegrantes}
              </p>
            </div>
          </div>
        </section>

        {/* Contactos */}
        <section className="mt-5">
          <div className="mb-3 flex items-center gap-2">
            <Mail size={17} className="text-gray-500" />

            <h3 className="text-sm font-semibold text-gray-900">Contactos</h3>
          </div>

          {empresa.contactos.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              No hay contactos registrados.
            </div>
          ) : (
            <div className="space-y-2">
              {empresa.contactos.map((contacto) => (
                <div
                  key={contacto}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                >
                  {contacto}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Integrantes */}
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={17} className="text-gray-500" />

              <h3 className="text-sm font-semibold text-gray-900">Integrantes</h3>
            </div>

            <span className="text-xs text-gray-500">{empresa.integrantes.length}</span>
          </div>

          {empresa.integrantes.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              No hay integrantes registrados.
            </div>
          ) : (
            <div className="space-y-2">
              {empresa.integrantes.map((integrante) => (
                <div
                  key={integrante.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef3ee] text-xs font-semibold text-[#769a75]">
                    {integrante.nombre.charAt(0)}
                    {integrante.apellido.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {integrante.nombre} {integrante.apellido}
                    </p>

                    <p className="truncate text-xs text-gray-500">{integrante.email}</p>

                    {integrante.rolEmpresa && (
                      <p className="mt-0.5 text-[11px] text-gray-400">{integrante.rolEmpresa}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Fecha de creación */}
        <section className="mt-5 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-gray-500" />

            <span className="text-xs text-gray-500">Fecha de creación</span>

            <span className="ml-auto text-xs font-medium text-gray-800">
              {formatearFecha(empresa.fechaCreacion)}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
