import { AlertTriangle, Eye } from 'lucide-react';

import LibroDiarioCorreccion from '../../correcciones/LibroDiarioCorreccion';
import LibroMayorCorreccion from '../../correcciones/LibroMayorCorreccion';
import LibroIvaCorreccion from '../../correcciones/LibroIvaCorreccion';
import HojaTrabajoCorreccion from '../../correcciones/HojaTrabajoCorreccion';

import type {
  ConsultaCorreccionAlumnoResponse,
  PlantillaCorreccionAlumno,
} from '../../../types/entrega.types';

import type { ErrorDetalleCorreccion } from '../../../types/espacioTrabajoCorreccion.types';

import type {
  ContenidoLibroDiario,
  ContenidoLibroMayor,
  ContenidoLibroIva,
  ContenidoHojaTrabajo,
} from '../../../types/ejercicio.types';

interface PlantillasCorreccionAlumnoProps {
  plantillas: ConsultaCorreccionAlumnoResponse['plantillas'];
  plantillaSeleccionada: number | null;
  onSeleccionar: (id: number) => void;
  onVerError: (error: ErrorDetalleCorreccion) => void;
}

function esContenidoValido(
  contenido: unknown,
  propiedad: string
): contenido is Record<string, unknown> {
  return (
    typeof contenido === 'object' &&
    contenido !== null &&
    !Array.isArray(contenido) &&
    Array.isArray((contenido as Record<string, unknown>)[propiedad])
  );
}

interface VisualizadorProps {
  plantilla: PlantillaCorreccionAlumno;
  onVerError: (error: ErrorDetalleCorreccion) => void;
}

function VisualizadorPlantillaAlumno({ plantilla, onVerError }: VisualizadorProps) {
  const { tipo, contenidoAlumno, errores } = plantilla;

  if (contenidoAlumno === null) {
    return (
      <p className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
        No hay una resolución disponible.
      </p>
    );
  }

  const seleccionarError = (indice: number) => {
    const error = errores[indice];

    if (error) {
      onVerError(error);
    }
  };

  switch (tipo) {
    case 'LIBRO_DIARIO':
      if (esContenidoValido(contenidoAlumno, 'asientos')) {
        return (
          <LibroDiarioCorreccion
            contenido={contenidoAlumno as unknown as ContenidoLibroDiario}
            errores={errores}
            onSeleccionarError={seleccionarError}
          />
        );
      }
      break;

    case 'LIBRO_MAYOR':
      if (esContenidoValido(contenidoAlumno, 'cuentas')) {
        return (
          <LibroMayorCorreccion
            contenido={contenidoAlumno as unknown as ContenidoLibroMayor}
            errores={errores}
            onSeleccionarError={seleccionarError}
          />
        );
      }
      break;

    case 'LIBRO_IVA':
      if (
        esContenidoValido(contenidoAlumno, 'compras') &&
        esContenidoValido(contenidoAlumno, 'ventas')
      ) {
        return (
          <LibroIvaCorreccion
            contenido={contenidoAlumno as unknown as ContenidoLibroIva}
            errores={errores}
            onSeleccionarError={seleccionarError}
          />
        );
      }
      break;

    case 'HOJA_TRABAJO':
      if (esContenidoValido(contenidoAlumno, 'filas')) {
        return (
          <HojaTrabajoCorreccion
            contenido={contenidoAlumno as unknown as ContenidoHojaTrabajo}
            errores={errores}
            onSeleccionarError={(error) => onVerError(error)}
          />
        );
      }
      break;
  }

  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      No se pudo interpretar el contenido de esta plantilla.
    </p>
  );
}

export default function PlantillasCorreccionAlumno({
  plantillas,
  plantillaSeleccionada,
  onSeleccionar,
  onVerError,
}: PlantillasCorreccionAlumnoProps) {
  const plantilla =
    plantillas.find((item) => item.idEjercicioPlantilla === plantillaSeleccionada) ?? plantillas[0];

  if (!plantilla) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        No hay plantillas disponibles.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div
        role="tablist"
        aria-label="Plantillas corregidas"
        className="flex flex-wrap gap-5 border-b border-gray-200"
      >
        {plantillas.map((item) => {
          const activa = item.idEjercicioPlantilla === plantilla.idEjercicioPlantilla;

          return (
            <button
              key={item.idEjercicioPlantilla}
              type="button"
              role="tab"
              aria-selected={activa}
              onClick={() => onSeleccionar(item.idEjercicioPlantilla)}
              className={`border-b-2 px-1 pb-3 pt-2 text-sm transition ${
                activa
                  ? 'border-abacontex-primary font-semibold text-abacontex-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {item.nombre}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tu resolución</h2>

          <p className="mt-1 text-sm text-gray-500">
            {plantilla.nombre} · {plantilla.errores.length}{' '}
            {plantilla.errores.length === 1 ? 'error detectado' : 'errores detectados'}
          </p>
        </div>

        <div className="min-w-0 overflow-x-auto">
          <VisualizadorPlantillaAlumno plantilla={plantilla} onVerError={onVerError} />
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <AlertTriangle className="size-5 text-red-600" />
            Observaciones ({plantilla.errores.length})
          </h3>

          {plantilla.errores.length === 0 ? (
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              No se registraron errores en esta plantilla.
            </p>
          ) : (
            <div className="space-y-3">
              {plantilla.errores.map((error, indice) => (
                <article
                  key={error.idError}
                  className="rounded-lg border border-red-200 bg-red-50/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-red-700">Observación {indice + 1}</p>

                      <p className="mt-1 text-sm text-gray-700">
                        {error.tipoError.replaceAll('_', ' ').toLowerCase()}
                      </p>

                      {error.comentarioDocente && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                          {error.comentarioDocente}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onVerError(error)}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50"
                    >
                      <Eye className="size-4" />
                      Ver detalle
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
