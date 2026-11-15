import { CalendarDays, ClipboardList, Eye, FileCheck2, Home, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { EspacioTrabajoCorreccion } from '../../types/espacioTrabajoCorreccion.types';

interface CabeceraCorreccionProps {
  datos: EspacioTrabajoCorreccion;
}

export default function CabeceraCorreccion({ datos }: CabeceraCorreccionProps) {
  const { alumno, ejercicio, entrega } = datos;

  const fechaEntrega = entrega.fechaEntrega
    ? new Date(entrega.fechaEntrega).toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Sin fecha registrada';

  function verResolucionModelo() {
    window.dispatchEvent(new Event('correcciones:ver-modelo'));
  }

  return (
    <div className="space-y-4">
      <nav
        aria-label="Ruta de navegación"
        className="flex flex-wrap items-center gap-2 text-sm text-gray-500"
      >
        <Link to="/docente" className="hover:text-abacontex-primary" aria-label="Inicio">
          <Home size={17} />
        </Link>

        <span>/</span>

        <Link to="/docente/correcciones" className="hover:text-abacontex-primary">
          Correcciones
        </Link>

        <span>/</span>

        <Link
          to={`/docente/correcciones/ejercicios/${ejercicio.idEjercicio}/entregas`}
          className="hover:text-abacontex-primary"
        >
          Entregas
        </Link>

        <span>/</span>

        <span className="font-semibold text-gray-900">Corregir ejercicio</span>
      </nav>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Alumno */}
          <div className="flex min-w-[210px] flex-1 items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <UserRound size={21} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {alumno.nombre} {alumno.apellido}
              </p>

              <p className="truncate text-xs text-gray-500">{alumno.email}</p>
            </div>
          </div>

          <div className="hidden h-12 w-px bg-gray-200 lg:block" />

          {/* Ejercicio */}
          <div className="flex min-w-[190px] flex-1 items-center gap-3 p-4">
            <ClipboardList size={21} className="shrink-0 text-gray-500" />

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Ejercicio</p>

              <p className="truncate text-sm font-semibold text-gray-900">{ejercicio.titulo}</p>

              <p className="text-xs text-gray-500">{alumno.curso.nombreCurso}</p>
            </div>
          </div>

          <div className="hidden h-12 w-px bg-gray-200 lg:block" />

          {/* Fecha de entrega */}
          <div className="flex min-w-[185px] flex-1 items-center gap-3 p-4">
            <CalendarDays size={21} className="shrink-0 text-gray-500" />

            <div>
              <p className="text-xs text-gray-500">Fecha de entrega</p>

              <p className="text-sm font-semibold text-gray-900">{fechaEntrega}</p>

              {entrega.fueraDeTermino && (
                <span className="text-xs font-medium text-amber-700">Fuera de término</span>
              )}
            </div>
          </div>

          <div className="hidden h-12 w-px bg-gray-200 lg:block" />

          {/* Plantillas */}
          <div className="flex min-w-[145px] items-center gap-3 p-4">
            <FileCheck2 size={21} className="shrink-0 text-gray-500" />

            <div>
              <p className="text-xs text-gray-500">Plantillas resueltas</p>

              <p className="text-sm font-semibold text-gray-900">
                {ejercicio.plantillasResueltas} de {ejercicio.totalPlantillas}
              </p>
            </div>
          </div>
        </div>

        {/* Botón para consultar la resolución modelo */}
        {ejercicio.tieneResolucionDocente && (
          <button
            type="button"
            onClick={verResolucionModelo}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Eye size={17} />
            Ver resolución modelo
          </button>
        )}
      </div>
    </div>
  );
}
