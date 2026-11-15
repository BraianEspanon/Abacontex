import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Save, X } from 'lucide-react';

import Button from '../ui/Button';

import type { ErrorDetalleCorreccion } from '../../types/espacioTrabajoCorreccion.types';

interface DetalleErrorModalProps {
  error: ErrorDetalleCorreccion | null;
  guardando: boolean;
  soloLectura?: boolean;
  onCerrar: () => void;
  onGuardar: (error: ErrorDetalleCorreccion, comentario: string) => Promise<void>;
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
  COMPROBANTE_OMITIDO: 'Comprobante omitido o incorrecto',
  COMPROBANTE_ADICIONAL: 'Comprobante adicional',
  CLASIFICACION_SALDO_INCORRECTA: 'Clasificación del saldo incorrecta',
  CUENTA_OMITIDA: 'Cuenta omitida',
  CUENTA_ADICIONAL: 'Cuenta adicional',
  RESULTADO_EJERCICIO_INCOMPLETO: 'Resultado del ejercicio incompleto',
  RESULTADO_EJERCICIO_INCORRECTO: 'Resultado del ejercicio incorrecto',
};

const nombresCampos: Record<string, string> = {
  movimiento: 'Tipo de movimiento',
  cuenta: 'Cuenta contable',
  debe: 'Debe',
  haber: 'Haber',
  saldo: 'Saldo final',
  tipoSaldo: 'Tipo de saldo',
  comprobante: 'Número de comprobante',
  netoGravado: 'Neto gravado',
  iva: 'IVA facturado',
  total: 'Total facturado',
  resultado: 'Resultado de liquidación',
  fila: 'Cuenta contable',
};

const nombresColumnas: Record<string, string> = {
  saldosSinAjustar: 'Saldos sin ajustar',
  ajustes: 'Ajustes',
  saldosAjustados: 'Saldos ajustados',
  estadoPatrimonial: 'Estado patrimonial',
  estadoResultados: 'Estado de resultados',
  resultadoDelEjercicio: 'Resultado del ejercicio',
};

const nombresSubcampos: Record<string, string> = {
  deudor: 'Deudor',
  acreedor: 'Acreedor',
  debe: 'Debe',
  haber: 'Haber',
  activo: 'Activo',
  pasivoMasPn: 'Pasivo + Patrimonio Neto',
  negativo: 'Negativo',
  positivo: 'Positivo',
};

const valoresLegibles: Record<string, string> = {
  A_FAVOR_CONTRIBUYENTE: 'A favor del contribuyente',
  A_PAGAR: 'A pagar',
  DEUDOR: 'Deudor',
  ACREEDOR: 'Acreedor',
  SALDADA: 'Saldada',
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

function mostrarValor(valor: string | null): string {
  if (valor === null) return 'No informado';

  return valoresLegibles[valor] ?? valor;
}

function esObjetoDetalle(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function obtenerValoresComparacion(detalle: Record<string, unknown>): {
  obtenido: string | null;
  esperado: string | null;
} {
  const { obtenido, esperado } = detalle;

  const celda = textoDetalle(detalle.celda);

  const obtenidoEsObjeto = esObjetoDetalle(obtenido);
  const esperadoEsObjeto = esObjetoDetalle(esperado);

  // Libro Diario, Libro Mayor y Libro IVA:
  // valores simples.
  if (!obtenidoEsObjeto && !esperadoEsObjeto) {
    return {
      obtenido: textoDetalle(obtenido),
      esperado: textoDetalle(esperado),
    };
  }

  // Hoja de Trabajo:
  // valores compuestos por dos o más campos.
  const objetoObtenido = obtenidoEsObjeto ? obtenido : {};
  const objetoEsperado = esperadoEsObjeto ? esperado : {};

  const claves = Array.from(
    new Set([...Object.keys(objetoEsperado), ...Object.keys(objetoObtenido)])
  );

  // Cuando el comparador identifica una única celda,
  // mostramos directamente el valor correspondiente.
  if (celda && claves.includes(celda)) {
    return {
      obtenido: textoDetalle(objetoObtenido[celda]),
      esperado: textoDetalle(objetoEsperado[celda]),
    };
  }

  // Si hay diferencias en ambas columnas,
  // identificamos los campos que realmente difieren.
  const clavesDiferentes = claves.filter((clave) => {
    const valorObtenido = objetoObtenido[clave];
    const valorEsperado = objetoEsperado[clave];

    if (typeof valorObtenido === 'number' && typeof valorEsperado === 'number') {
      return Math.abs(valorObtenido - valorEsperado) > 0.01;
    }

    return valorObtenido !== valorEsperado;
  });

  const clavesAMostrar = clavesDiferentes.length > 0 ? clavesDiferentes : claves;

  function formatearObjeto(objeto: Record<string, unknown>): string {
    return clavesAMostrar
      .map((clave) => {
        const nombre = nombresSubcampos[clave] ?? clave;
        const valor = mostrarValor(textoDetalle(objeto[clave]));

        return `${nombre}: ${valor}`;
      })
      .join(' · ');
  }

  return {
    obtenido: formatearObjeto(objetoObtenido),
    esperado: formatearObjeto(objetoEsperado),
  };
}

export default function DetalleErrorModal({
  error,
  guardando,
  soloLectura = false,
  onCerrar,
  onGuardar,
}: DetalleErrorModalProps) {
  const [comentario, setComentario] = useState(error?.comentarioDocente ?? '');
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!error) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function manejarTeclado(evento: KeyboardEvent) {
      if (evento.key === 'Escape' && !guardando) {
        onCerrar();
      }
    }

    document.addEventListener('keydown', manejarTeclado);

    if (!soloLectura) {
      textareaRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener('keydown', manejarTeclado);
    };
  }, [error, guardando, soloLectura, onCerrar]);

  if (!error) return null;

  const detalle = error.detalle;

  const titulo =
    nombresErrores[error.tipoError] ?? error.tipoError.replaceAll('_', ' ').toLowerCase();

  const numeroAsiento = textoDetalle(detalle.numeroAsiento);
  const numeroLinea = textoDetalle(detalle.numeroLinea);
  const cuenta = textoDetalle(detalle.cuenta);

  const columnaOriginal = textoDetalle(detalle.columna);
  const celdaOriginal = textoDetalle(detalle.campo ?? detalle.celda);

  const columna = columnaOriginal ? (nombresColumnas[columnaOriginal] ?? columnaOriginal) : null;

  const campo = celdaOriginal
    ? (nombresSubcampos[celdaOriginal] ??
      nombresCampos[celdaOriginal] ??
      nombresColumnas[celdaOriginal] ??
      celdaOriginal)
    : columna;

  const { obtenido, esperado } = obtenerValoresComparacion(detalle);

  const motivo = textoDetalle(detalle.motivo);

  const comentarioOriginal = error.comentarioDocente ?? '';

  const cambiosSinGuardar = comentario.trim() !== comentarioOriginal.trim();

  async function guardar() {
    if (!error || guardando || soloLectura || !cambiosSinGuardar) {
      return;
    }

    const errorActual = error;

    setMensajeError(null);

    try {
      await onGuardar(errorActual, comentario.trim());
      onCerrar();
    } catch {
      setMensajeError('No se pudo guardar la observación. Intentá nuevamente.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget && !guardando) {
          onCerrar();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalle-error"
        aria-describedby={motivo ? 'descripcion-detalle-error' : undefined}
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
          {/* Cabecera */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-11 w-11 shrink-0 flex items-center justify-center rounded-full bg-red-100">
                <AlertTriangle size={23} className="text-red-600" />
              </div>

              <div className="min-w-0">
                <h2 id="titulo-detalle-error" className="text-xl font-semibold text-gray-900">
                  Detalle del error
                </h2>

                <p className="mt-0.5 break-words text-xs text-gray-500">
                  {titulo.charAt(0).toUpperCase() + titulo.slice(1)}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Cerrar detalle del error"
              onClick={onCerrar}
              disabled={guardando}
              className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Ubicación del error */}
          <div className="mt-5 grid grid-cols-2 divide-x divide-gray-200 rounded-lg border border-gray-200 bg-gray-50">
            <div className="min-w-0 px-3 py-3 text-center">
              <p className="text-xs text-gray-500">Ubicación</p>

              <p className="mt-1 break-words text-sm font-semibold text-gray-900">
                {numeroAsiento
                  ? `Asiento N.º ${numeroAsiento}`
                  : cuenta
                    ? `Cuenta: ${cuenta}`
                    : 'Plantilla del ejercicio'}

                {numeroLinea ? ` · Línea ${numeroLinea}` : ''}
              </p>
            </div>

            <div className="min-w-0 px-3 py-3 text-center">
              <p className="text-xs text-gray-500">Campo con error</p>

              <p className="mt-1 break-words text-sm font-semibold text-gray-900">
                {columna && campo && columna !== campo
                  ? `${columna} · ${campo}`
                  : (campo ?? cuenta ?? titulo)}
              </p>
            </div>
          </div>

          {/* Comparación de valores */}
          {(obtenido !== null || esperado !== null) && (
            <div className="mt-4 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2">
              {/* Valor ingresado por el alumno */}
              <div className="flex min-w-0 flex-col rounded-lg bg-red-50 p-3">
                <p className="text-xs font-semibold text-gray-700">Ingresado por el alumno</p>

                <div className="mt-2 flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-red-200 bg-red-100/60 px-3 py-2">
                  <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-sm font-semibold leading-relaxed text-red-700">
                    {mostrarValor(obtenido)}
                  </span>

                  <AlertTriangle size={17} className="shrink-0 text-red-600" />
                </div>
              </div>

              {/* Valor esperado */}
              <div className="flex min-w-0 flex-col rounded-lg bg-green-50 p-3">
                <p className="text-xs font-semibold text-gray-700">Valor esperado</p>

                <div className="mt-2 flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-green-200 bg-green-100/60 px-3 py-2">
                  <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-sm font-semibold leading-relaxed text-green-700">
                    {mostrarValor(esperado)}
                  </span>

                  <CheckCircle2 size={17} className="shrink-0 text-green-600" />
                </div>
              </div>
            </div>
          )}

          {/* Motivo de la diferencia */}
          {motivo && (
            <div
              id="descripcion-detalle-error"
              className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3"
            >
              <p className="text-xs font-semibold text-gray-700">Motivo de la diferencia</p>

              <p className="mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-relaxed text-gray-600">
                {motivo}
              </p>
            </div>
          )}

          {/* Comentario del docente */}
          <div className="mt-5">
            <label
              htmlFor="comentario-error"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              Comentario del docente
              <span className="ml-1 font-normal text-gray-500">(opcional)</span>
            </label>

            <textarea
              ref={textareaRef}
              id="comentario-error"
              value={comentario}
              onChange={(evento) => setComentario(evento.target.value)}
              maxLength={255}
              rows={4}
              disabled={guardando || soloLectura}
              placeholder="Escribí una observación para ayudar al alumno a comprender el error..."
              className="w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-800 outline-none transition focus:border-abacontex-primary focus:ring-1 focus:ring-abacontex-primary disabled:cursor-not-allowed disabled:bg-gray-50"
            />

            <div className="mt-1 flex items-center justify-between gap-2 text-xs text-gray-500">
              <span>Máx. 255 caracteres</span>

              <span className="tabular-nums">{comentario.length}/255</span>
            </div>

            {soloLectura && (
              <p className="mt-2 text-xs text-gray-500">
                Esta corrección está en modo consulta. No se pueden modificar las observaciones.
              </p>
            )}
          </div>

          {/* Mensaje de error */}
          {mensajeError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {mensajeError}
            </p>
          )}

          {/* Acciones */}
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              label={soloLectura ? 'Cerrar' : 'Cancelar'}
              variant="outline"
              onClick={onCerrar}
              disabled={guardando}
              className="!rounded-lg !px-4 !py-2 text-sm"
            />

            {!soloLectura && (
              <Button
                type="button"
                label={guardando ? 'Guardando...' : 'Guardar cambios'}
                variant="solid"
                icon={<Save size={16} />}
                onClick={() => void guardar()}
                disabled={guardando || !cambiosSinGuardar}
                className="!rounded-lg !px-4 !py-2 text-sm"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
