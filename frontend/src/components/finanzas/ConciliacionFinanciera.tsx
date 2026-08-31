import axios from 'axios';
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  FileText,
  Save,
} from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';

import { useConciliaciones } from '../../hooks/useConciliaciones';
import { useRegistrarConciliacion } from '../../hooks/useRegistrarConciliacion';
import { useResumenConciliacion } from '../../hooks/useResumenConciliacion';

const PAGE_SIZE = 10;

interface Props {
  tabs?: ReactNode;
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

function formatearMoneda(valor: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha));
}

export default function ConciliacionFinanciera({ tabs }: Props) {
  const [page, setPage] = useState(1);

  const [saldoContado, setSaldoContado] = useState('');
  const [observacion, setObservacion] = useState('');

  const [errorFormulario, setErrorFormulario] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const {
    data: resumen,
    isLoading: cargandoResumen,
    isError: errorResumen,
    refetch: recargarResumen,
  } = useResumenConciliacion();

  const {
    data: historial,
    isLoading: cargandoHistorial,
    isError: errorHistorial,
  } = useConciliaciones({
    page,
    pageSize: PAGE_SIZE,
  });

  const registrarConciliacionMutation = useRegistrarConciliacion();

  const saldoEsperado = resumen?.saldoEsperado ?? 0;

  const saldoContadoNumero = useMemo(() => {
    if (saldoContado.trim() === '') {
      return null;
    }

    const numero = Number(saldoContado);

    return Number.isFinite(numero) ? numero : null;
  }, [saldoContado]);

  const diferencia = saldoContadoNumero === null ? null : saldoContadoNumero - saldoEsperado;

  const hayDiferencia = diferencia !== null && Math.abs(diferencia) > 0.000001;

  const limpiarFormulario = () => {
    setSaldoContado('');
    setObservacion('');
    setErrorFormulario('');
    setMensajeExito('');
  };

  const handleRegistrar = async () => {
    setErrorFormulario('');
    setMensajeExito('');

    if (saldoContadoNumero === null) {
      setErrorFormulario('Ingresá el saldo contado en caja.');
      return;
    }

    if (saldoContadoNumero < 0) {
      setErrorFormulario('El saldo contado no puede ser negativo.');
      return;
    }

    if (hayDiferencia && observacion.trim() === '') {
      setErrorFormulario('La observación es obligatoria cuando existe una diferencia.');
      return;
    }

    if (observacion.trim().length > 250) {
      setErrorFormulario('La observación no puede superar los 250 caracteres.');
      return;
    }

    try {
      await registrarConciliacionMutation.mutateAsync({
        saldoEsperado,
        saldoContado: saldoContadoNumero,
        ...(observacion.trim()
          ? {
              observacion: observacion.trim(),
            }
          : {}),
      });

      setSaldoContado('');
      setObservacion('');
      setPage(1);

      setMensajeExito('La conciliación financiera fue registrada correctamente.');
    } catch (error) {
      if (!axios.isAxiosError<ErrorResponse>(error)) {
        setErrorFormulario('Ocurrió un error inesperado al registrar la conciliación.');
        return;
      }

      if (error.response?.status === 409) {
        setErrorFormulario(
          error.response.data?.message ??
            'El saldo cambió porque se registraron nuevos movimientos. Revisá la conciliación e intentá nuevamente.'
        );

        await recargarResumen();
        return;
      }

      setErrorFormulario(
        error.response?.data?.message ??
          error.response?.data?.error ??
          'No se pudo registrar la conciliación.'
      );
    }
  };

  if (cargandoResumen) {
    return (
      <section className="mx-auto max-w-6xl rounded-xl bg-white p-5 text-center shadow-sm">
        <p className="text-sm text-gray-500">Cargando información de conciliación...</p>
      </section>
    );
  }

  if (errorResumen) {
    return (
      <section className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        No se pudo cargar la información necesaria para realizar la conciliación.
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {/* RESUMEN DE CONCILIACIÓN */}
      <div className="grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
        <article className="flex min-h-[76px] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <FileText size={19} className="text-abacontex-primary" />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700">Saldo según sistema</p>

            <p className="mt-0.5 text-lg font-semibold text-abacontex-primary">
              {formatearMoneda(saldoEsperado)}
            </p>
          </div>
        </article>

        <article className="flex min-h-[76px] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <FileCheck2 size={19} className="text-abacontex-primary" />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700">Movimientos del período</p>

            <p className="mt-0.5 text-lg font-semibold text-abacontex-primary">
              {resumen?.movimientosPeriodo ?? 0}
            </p>
          </div>
        </article>

        <article className="flex min-h-[76px] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <CalendarDays size={19} className="text-abacontex-primary" />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700">Última conciliación</p>

            <p className="mt-0.5 text-lg font-semibold text-abacontex-primary">
              {resumen?.ultimaConciliacion
                ? formatearFecha(resumen.ultimaConciliacion)
                : 'Sin conciliaciones'}
            </p>
          </div>
        </article>
      </div>

      {/* TABS */}
      {tabs}

      {/* FORMULARIO */}
      <section className="mx-auto w-full max-w-6xl rounded-xl bg-white px-6 py-5 shadow-sm">
        <h2 className="font-heading text-base font-semibold text-abacontex-black-text">
          Conciliar saldo de caja
        </h2>

        {errorFormulario && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {errorFormulario}
          </div>
        )}

        {mensajeExito && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
            {mensajeExito}
          </div>
        )}

        <div className="mx-auto mt-5 max-w-4xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-[1fr_230px] md:items-center">
            <label className="text-sm text-gray-600">Saldo según sistema</label>

            <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-right text-sm font-semibold text-abacontex-primary">
              {formatearMoneda(saldoEsperado)}
            </div>

            <label htmlFor="saldoContado" className="text-sm text-gray-600">
              Saldo contado
            </label>

            <input
              id="saldoContado"
              type="number"
              min="0"
              step="0.01"
              value={saldoContado}
              onChange={(event) => {
                setSaldoContado(event.target.value);
                setErrorFormulario('');
                setMensajeExito('');
              }}
              placeholder="0,00"
              className="rounded-md border border-gray-300 px-3 py-2 text-right text-sm outline-none transition focus:border-abacontex-primary"
            />

            <label className="text-sm text-gray-600">Diferencia (caja - sistema)</label>

            <div className="flex items-center gap-2">
              <div
                className={`flex-1 rounded-md border px-3 py-2 text-right text-sm font-semibold ${
                  diferencia === null
                    ? 'border-gray-300 bg-gray-50 text-gray-500'
                    : hayDiferencia
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-green-300 bg-green-50 text-green-700'
                }`}
              >
                {diferencia === null ? formatearMoneda(0) : formatearMoneda(diferencia)}
              </div>

              {hayDiferencia && (
                <div
                  className="hidden items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-2 text-[11px] font-medium text-red-600 lg:flex"
                  title="Existe una diferencia entre el saldo registrado y el saldo contado."
                >
                  <AlertTriangle size={14} />
                  Diferencia
                </div>
              )}
            </div>
          </div>

          {/* OBSERVACIÓN */}
          <div className="mt-3">
            <label htmlFor="observacionConciliacion" className="mb-1 block text-sm text-gray-600">
              Observación
              {hayDiferencia && <span className="ml-1 text-red-600">*</span>}
            </label>

            <textarea
              id="observacionConciliacion"
              rows={2}
              maxLength={250}
              value={observacion}
              onChange={(event) => {
                setObservacion(event.target.value);
                setErrorFormulario('');
                setMensajeExito('');
              }}
              placeholder={
                hayDiferencia
                  ? 'Indicá el motivo de la diferencia detectada'
                  : 'Observación opcional'
              }
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-abacontex-primary"
            />

            <div className="mt-1 flex justify-between">
              <span className="text-[11px] text-gray-400">Máx. 250 caracteres</span>

              <span className="text-[11px] text-gray-400">{observacion.length}/250</span>
            </div>
          </div>

          {/* ACCIONES */}
          <div className="mt-3 flex justify-center gap-3 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={limpiarFormulario}
              disabled={registrarConciliacionMutation.isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => void handleRegistrar()}
              disabled={registrarConciliacionMutation.isPending || saldoContadoNumero === null}
              className="inline-flex items-center gap-2 rounded-md bg-abacontex-primary px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-abacontex-primary-two disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={14} />

              {registrarConciliacionMutation.isPending
                ? 'Registrando...'
                : 'Registrar conciliación'}
            </button>
          </div>
        </div>
      </section>

      {/* HISTORIAL */}
      <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="px-4 py-3">
          <h2 className="font-heading text-base font-semibold text-abacontex-black-text">
            Historial de conciliaciones
          </h2>
        </div>

        {errorHistorial ? (
          <div className="border-t border-gray-200 px-4 py-5 text-center text-sm text-red-600">
            No se pudo cargar el historial de conciliaciones.
          </div>
        ) : cargandoHistorial ? (
          <div className="border-t border-gray-200 px-4 py-5 text-center text-sm text-gray-500">
            Cargando historial...
          </div>
        ) : !historial?.items.length ? (
          <div className="border-t border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
            Todavía no se registraron conciliaciones financieras.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead className="bg-gray-100 text-xs font-semibold text-gray-700">
                  <tr>
                    <th className="px-4 py-2.5">Fecha</th>
                    <th className="px-4 py-2.5">Alumno</th>
                    <th className="px-4 py-2.5">Saldo sistema</th>
                    <th className="px-4 py-2.5">Caja informada</th>
                    <th className="px-4 py-2.5">Diferencia</th>
                    <th className="px-4 py-2.5">Observación</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {historial.items.map((item) => {
                    const tieneDiferencia = Math.abs(item.diferencia) > 0.000001;

                    return (
                      <tr key={item.idConciliacion} className="transition hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-2.5 text-xs text-gray-700">
                          {formatearFecha(item.fecha)}
                        </td>

                        <td className="px-4 py-2.5 text-xs text-gray-700">{item.alumno}</td>

                        <td className="whitespace-nowrap px-4 py-2.5 text-xs text-gray-700">
                          {formatearMoneda(item.saldoEsperado)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-2.5 text-xs text-gray-700">
                          {formatearMoneda(item.saldoContado)}
                        </td>

                        <td
                          className={`whitespace-nowrap px-4 py-2.5 text-xs font-semibold ${
                            tieneDiferencia ? 'text-red-600' : 'text-green-700'
                          }`}
                        >
                          {tieneDiferencia ? formatearMoneda(item.diferencia) : '-'}
                        </td>

                        <td className="max-w-xs px-4 py-2.5 text-xs text-gray-600">
                          {item.observacion ?? '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <footer className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5">
              <p className="text-[11px] text-gray-500">
                Mostrando {historial.items.length} de {historial.totalItems} conciliaciones
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((paginaActual) => Math.max(1, paginaActual - 1))}
                  disabled={page <= 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={14} />
                </button>

                <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-abacontex-primary px-2 text-xs font-medium text-white">
                  {page}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((paginaActual) => paginaActual + 1)}
                  disabled={page >= (historial.totalPages ?? 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
