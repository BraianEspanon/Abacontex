import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Eye,
  FileText,
  MessageSquareText,
} from 'lucide-react';

import Button from '../ui/Button';

import LibroDiarioEditor from '../ejercicios/resolucion/LibroDiarioEditor';
import LibroMayorEditor from '../ejercicios/resolucion/LibroMayorEditor';
import LibroIvaEditor from '../ejercicios/resolucion/LibroIvaEditor';
import HojaTrabajoEditor from '../ejercicios/resolucion/HojaTrabajoEditor';

import LibroDiarioCorreccion from './LibroDiarioCorreccion';
import LibroMayorCorreccion from './LibroMayorCorreccion';
import LibroIvaCorreccion from './LibroIvaCorreccion';
import HojaTrabajoCorreccion from './HojaTrabajoCorreccion';

import type {
  ContenidoLibroDiario,
  ContenidoLibroMayor,
  ContenidoLibroIva,
  ContenidoHojaTrabajo,
} from '../../types/ejercicio.types';

import type {
  ErrorDetalleCorreccion,
  EstadoRevisionPlantilla,
  PlantillaEspacioTrabajo,
} from '../../types/espacioTrabajoCorreccion.types';

interface PlantillasCorreccionProps {
  plantillas: PlantillaEspacioTrabajo[];
  plantillaSeleccionada: number | null;
  onSeleccionar: (id: number) => void;
  onCambiarEstado: (id: number, estado: EstadoRevisionPlantilla) => void;
  onComentarError: (error: ErrorDetalleCorreccion) => void;
  guardando: boolean;
  finalizada: boolean;
}

const sinCambios = () => {};

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

interface VisualizadorPlantillaProps {
  tipo: string;
  contenido: unknown;
  errores?: ErrorDetalleCorreccion[];
  onSeleccionarError?: (indiceError: number) => void;
}

function VisualizadorPlantilla({
  tipo,
  contenido,
  errores = [],
  onSeleccionarError,
}: VisualizadorPlantillaProps) {
  if (contenido === null || contenido === undefined) {
    return (
      <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
        No hay una resolución disponible.
      </p>
    );
  }

  switch (tipo) {
    case 'LIBRO_DIARIO': {
      if (esContenidoValido(contenido, 'asientos')) {
        const contenidoDiario = contenido as unknown as ContenidoLibroDiario;

        if (onSeleccionarError) {
          return (
            <LibroDiarioCorreccion
              contenido={contenidoDiario}
              errores={errores}
              onSeleccionarError={onSeleccionarError}
            />
          );
        }

        return <LibroDiarioEditor contenido={contenidoDiario} onChange={sinCambios} soloLectura />;
      }

      break;
    }

    case 'LIBRO_MAYOR': {
      if (esContenidoValido(contenido, 'cuentas')) {
        const contenidoMayor = contenido as unknown as ContenidoLibroMayor;

        if (onSeleccionarError) {
          return (
            <LibroMayorCorreccion
              contenido={contenidoMayor}
              errores={errores}
              onSeleccionarError={onSeleccionarError}
            />
          );
        }

        return <LibroMayorEditor contenido={contenidoMayor} onChange={sinCambios} soloLectura />;
      }

      break;
    }

    case 'LIBRO_IVA': {
      if (esContenidoValido(contenido, 'compras') && esContenidoValido(contenido, 'ventas')) {
        const contenidoIva = contenido as unknown as ContenidoLibroIva;

        if (onSeleccionarError) {
          return (
            <LibroIvaCorreccion
              contenido={contenidoIva}
              errores={errores}
              onSeleccionarError={onSeleccionarError}
            />
          );
        }

        return <LibroIvaEditor contenido={contenidoIva} onChange={sinCambios} soloLectura />;
      }

      break;
    }

    case 'HOJA_TRABAJO': {
      if (esContenidoValido(contenido, 'filas')) {
        const contenidoHoja = contenido as unknown as ContenidoHojaTrabajo;

        if (onSeleccionarError) {
          return (
            <HojaTrabajoCorreccion
              contenido={contenidoHoja}
              errores={errores}
              onSeleccionarError={(error) => {
                const indice = errores.indexOf(error);

                if (indice >= 0) {
                  onSeleccionarError(indice);
                }
              }}
            />
          );
        }

        return <HojaTrabajoEditor contenido={contenidoHoja} onChange={sinCambios} soloLectura />;
      }

      break;
    }
  }

  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      No se pudo interpretar el contenido de esta plantilla.
    </p>
  );
}

const nombresErrores: Record<string, string> = {
  TIPO_MOVIMIENTO_INCORRECTO: 'Tipo de movimiento incorrecto',
  CUENTA_INCORRECTA: 'Cuenta contable incorrecta',
  IMPORTE_INCORRECTO: 'Importe incorrecto',
  ASIENTO_INCOMPLETO: 'Asiento incompleto',
  ASIENTO_FALTANTE: 'Asiento faltante',
  ASIENTO_ADICIONAL: 'Asiento adicional',
  DIFERENCIA_IMPORTE: 'Diferencia de importe',
  VALOR_INCORRECTO: 'Valor incorrecto',
  SALDO_FINAL_INCORRECTO: 'Saldo final incorrecto',
  TIPO_SALDO_INCORRECTO: 'Tipo de saldo incorrecto',
  CUENTA_ADICIONAL: 'Cuenta adicional',
  CUENTA_OMITIDA: 'Cuenta omitida',
  CUENTA_MAYORIZAR_OMITIDA: 'Cuenta omitida en la mayorización',
  COMPROBANTE_OMITIDO: 'Comprobante omitido o incorrecto',
  COMPROBANTE_ADICIONAL: 'Comprobante adicional',
  CLASIFICACION_SALDO_INCORRECTA: 'Clasificación del saldo incorrecta',
  RESULTADO_EJERCICIO_INCOMPLETO: 'Resultado del ejercicio incompleto',
  RESULTADO_EJERCICIO_INCORRECTO: 'Resultado del ejercicio incorrecto',
};

const nombresCampos: Record<string, string> = {
  cuenta: 'Cuenta contable',
  debe: 'Total Debe',
  haber: 'Total Haber',
  saldo: 'Saldo final',
  tipoSaldo: 'Tipo de saldo',
  comprobante: 'Número de comprobante',
  netoGravado: 'Neto gravado',
  iva: 'IVA facturado',
  total: 'Total facturado',
  resultado: 'Resultado de liquidación',
  fila: 'Fila de la cuenta',
  saldosSinAjustar: 'Saldos sin ajustar',
  ajustes: 'Ajustes',
  saldosAjustados: 'Saldos ajustados',
  estadoPatrimonial: 'Estado patrimonial',
  estadoResultados: 'Estado de resultados',
  resultadoDelEjercicio: 'Resultado del ejercicio',
  deudor: 'Deudor',
  acreedor: 'Acreedor',
  activo: 'Activo',
  pasivoMasPn: 'Pasivo + Patrimonio Neto',
  negativo: 'Negativo',
  positivo: 'Positivo',
};

function textoDetalle(valor: unknown): string | null {
  if (typeof valor === 'string' || typeof valor === 'number') {
    return String(valor);
  }

  if (typeof valor === 'boolean') {
    return valor ? 'Sí' : 'No';
  }

  return null;
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function nombreCampo(clave: string): string {
  return nombresCampos[clave] ?? clave;
}

function formatearValorDetalle(valor: unknown): string | null {
  const texto = textoDetalle(valor);

  if (texto !== null) {
    return texto;
  }

  if (!esRegistro(valor)) {
    return null;
  }

  const partes = Object.entries(valor).map(([clave, contenido]) => {
    const textoValor = textoDetalle(contenido);

    return `${nombreCampo(clave)}: ${textoValor ?? '-'}`;
  });

  return partes.length > 0 ? partes.join(' · ') : null;
}

interface TarjetaErrorProps {
  error: ErrorDetalleCorreccion;
  onVerDetalle: (error: ErrorDetalleCorreccion) => void;
}

function TarjetaError({ error, onVerDetalle }: TarjetaErrorProps) {
  const titulo =
    nombresErrores[error.tipoError] ?? error.tipoError.replaceAll('_', ' ').toLowerCase();

  const numeroAsiento = textoDetalle(error.detalle.numeroAsiento);

  const cuenta = textoDetalle(error.detalle.cuenta);
  const seccion = textoDetalle(error.detalle.seccion);
  const comprobante = textoDetalle(error.detalle.comprobante);
  const columna = textoDetalle(error.detalle.columna);

  const campoOriginal = textoDetalle(error.detalle.campo ?? error.detalle.celda);

  const campo = campoOriginal ? nombreCampo(campoOriginal) : null;

  const columnaLegible = columna ? nombreCampo(columna) : null;

  const esperado = formatearValorDetalle(error.detalle.esperado);

  const obtenido = formatearValorDetalle(error.detalle.obtenido);

  const motivo = textoDetalle(error.detalle.motivo);

  const tieneObservacion = Boolean(error.comentarioDocente?.trim());

  return (
    <article className="rounded-lg border border-red-200 bg-red-50/40 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
          <AlertTriangle size={16} className="shrink-0" />

          <span>{titulo.charAt(0).toUpperCase() + titulo.slice(1)}</span>
        </div>

        {numeroAsiento && (
          <span className="text-xs text-gray-500">Asiento N.º {numeroAsiento}</span>
        )}
      </div>

      {(cuenta ||
        seccion ||
        comprobante ||
        columnaLegible ||
        campo ||
        esperado !== null ||
        obtenido !== null) && (
        <div className="mt-2 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {cuenta && (
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Cuenta</p>

              <p className="break-words font-medium text-gray-800">{cuenta}</p>
            </div>
          )}

          {seccion && (
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Sección</p>

              <p className="font-medium text-gray-800">{seccion}</p>
            </div>
          )}

          {comprobante && (
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Comprobante</p>

              <p className="font-medium text-gray-800">N.º {comprobante}</p>
            </div>
          )}

          {columnaLegible && (
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Columna</p>

              <p className="break-words font-medium text-gray-800">{columnaLegible}</p>
            </div>
          )}

          {campo && (
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Campo</p>

              <p className="break-words font-medium text-gray-800">{campo}</p>
            </div>
          )}

          {obtenido !== null && (
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Ingresado por el alumno</p>

              <p className="break-words font-medium text-red-700">{obtenido}</p>
            </div>
          )}

          {esperado !== null && (
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Esperado</p>

              <p className="break-words font-medium text-green-700">{esperado}</p>
            </div>
          )}
        </div>
      )}

      {motivo && <p className="mt-2 break-words text-xs leading-relaxed text-gray-600">{motivo}</p>}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-red-100 pt-3">
        {tieneObservacion ? (
          <div className="inline-flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700">
            <MessageSquareText size={15} className="shrink-0" />

            <span>Con observación del docente</span>

            <CheckCircle2 size={14} className="shrink-0" />
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <MessageSquareText size={15} className="shrink-0" />

            <span>Sin observación del docente</span>
          </div>
        )}

        <Button
          type="button"
          label="Ver detalle y observación"
          variant="outline"
          onClick={() => onVerDetalle(error)}
          icon={<Eye size={15} />}
          className="!rounded-lg !border-red-200 !px-3 !py-1.5 !text-xs !text-red-700 hover:!bg-red-100"
        />
      </div>
    </article>
  );
}

export default function PlantillasCorreccion({
  plantillas,
  plantillaSeleccionada,
  onSeleccionar,
  onCambiarEstado,
  onComentarError,
  guardando,
  finalizada,
}: PlantillasCorreccionProps) {
  const [mostrarErrores, setMostrarErrores] = useState(false);

  const [mostrarModelo, setMostrarModelo] = useState(false);

  const plantilla =
    plantillas.find((item) => item.idEjercicioPlantilla === plantillaSeleccionada) ?? plantillas[0];

  function seleccionarError(indiceError: number) {
    const error = plantilla?.errores[indiceError];

    if (!error) return;

    onComentarError(error);
  }

  // Escuchar la solicitud de mostrar la resolución modelo.
  useEffect(() => {
    function abrirModelo() {
      setMostrarModelo(true);
    }

    window.addEventListener('correcciones:ver-modelo', abrirModelo);

    return () => {
      window.removeEventListener('correcciones:ver-modelo', abrirModelo);
    };
  }, []);

  // Desplazar la pantalla cuando se muestra el modelo.
  useEffect(() => {
    if (!mostrarModelo) return;

    document.getElementById('resolucion-modelo-docente')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [mostrarModelo]);

  if (plantillas.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        No hay plantillas habilitadas para este ejercicio.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Pestañas de plantillas */}
      <div
        role="tablist"
        aria-label="Plantillas del ejercicio"
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
              className={`inline-flex items-center gap-2 border-b-2 px-1 pb-3 pt-2 text-sm transition ${
                activa
                  ? 'border-abacontex-primary font-semibold text-abacontex-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {item.nombre}

              {item.estadoRevision === 'CORREGIDA' && (
                <CheckCircle2 size={15} className="text-green-600" aria-label="Revisada" />
              )}
            </button>
          );
        })}
      </div>

      {/* Resolución del alumno */}
      <section
        role="tabpanel"
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Resolución del alumno</h2>

          <p className="mt-1 text-xs text-gray-500">
            {plantilla.nombre} · {plantilla.errores.length}{' '}
            {plantilla.errores.length === 1 ? 'error detectado' : 'errores detectados'}
          </p>
        </div>

        <div className="min-w-0 overflow-x-auto">
          <VisualizadorPlantilla
            tipo={plantilla.tipo}
            contenido={plantilla.contenidoAlumno}
            errores={plantilla.errores}
            onSeleccionarError={seleccionarError}
          />
        </div>

        {/* Controles de visualización */}
        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => setMostrarErrores((anterior) => !anterior)}
            aria-expanded={mostrarErrores}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <AlertTriangle
              size={16}
              className={plantilla.errores.length ? 'text-red-600' : 'text-green-600'}
            />
            Errores detectados ({plantilla.errores.length})
            {mostrarErrores ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {plantilla.contenidoDocente !== null && plantilla.contenidoDocente !== undefined && (
            <button
              type="button"
              onClick={() => setMostrarModelo((anterior) => !anterior)}
              aria-expanded={mostrarModelo}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Eye size={16} />

              {mostrarModelo ? 'Ocultar resolución modelo' : 'Ver resolución modelo'}

              {mostrarModelo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>

        {/* Listado de errores detectados */}
        {mostrarErrores && (
          <div className="space-y-2">
            {plantilla.errores.length === 0 ? (
              <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                No se detectaron errores en esta plantilla.
              </p>
            ) : (
              plantilla.errores.map((error, indice) => (
                <TarjetaError
                  key={error.idError ?? `${error.tipoError}-${indice}`}
                  error={error}
                  onVerDetalle={onComentarError}
                />
              ))
            )}
          </div>
        )}

        {/* Resolución modelo del docente */}
        <div id="resolucion-modelo-docente" className="scroll-mt-6">
          {mostrarModelo && (
            <div className="space-y-3 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-abacontex-primary" />

                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Resolución modelo del docente
                  </h3>

                  <p className="text-xs text-gray-500">Solución de referencia para la corrección</p>
                </div>
              </div>

              <div className="min-w-0 overflow-x-auto">
                <VisualizadorPlantilla
                  tipo={plantilla.tipo}
                  contenido={plantilla.contenidoDocente}
                />
              </div>
            </div>
          )}
        </div>

        {/* Estado de revisión */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
          <Button
            type="button"
            label={
              plantilla.estadoRevision === 'CORREGIDA'
                ? 'Marcar como pendiente'
                : 'Marcar como corregida'
            }
            variant={plantilla.estadoRevision === 'CORREGIDA' ? 'outline' : 'solid'}
            icon={
              plantilla.estadoRevision === 'CORREGIDA' ? (
                <Circle size={17} />
              ) : (
                <CheckCircle2 size={17} />
              )
            }
            disabled={guardando || finalizada}
            onClick={() =>
              onCambiarEstado(
                plantilla.idEjercicioPlantilla,
                plantilla.estadoRevision === 'CORREGIDA' ? 'PENDIENTE' : 'CORREGIDA'
              )
            }
            className="text-sm"
          />
        </div>
      </section>
    </div>
  );
}
