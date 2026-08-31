import { ChevronRight, Home, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import EditarCuentaModal from '../../components/cuenta/EditarCuentaModal';
import FiltrosCuentas from '../../components/cuenta/FiltrosCuentas';
import NuevaCuentaModal from '../../components/cuenta/NuevaCuentaModal';
import TablaCuentas from '../../components/cuenta/TablaCuentas';

import { useCuentas } from '../../hooks/useCuentas';
import { useTiposCuenta } from '../../hooks/useTiposCuenta';

import type { CuentaContable } from '../../types/cuenta.types';

interface FiltrosManualCuenta {
  search: string;
  tipoCuentaId: number | null;
  rubroId: number | null;
}

const filtrosIniciales: FiltrosManualCuenta = {
  search: '',
  tipoCuentaId: null,
  rubroId: null,
};

const PAGE_SIZE = 10;

export default function ManualCuentasDocentePage() {
  const [page, setPage] = useState(1);

  const [modalNuevaCuentaAbierto, setModalNuevaCuentaAbierto] = useState(false);

  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaContable | null>(null);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const [filtrosFormulario, setFiltrosFormulario] = useState<FiltrosManualCuenta>(filtrosIniciales);

  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosManualCuenta>(filtrosIniciales);

  const { data, isLoading, isError, refetch } = useCuentas({
    search: filtrosAplicados.search.trim() || undefined,
    idTipoCuenta: filtrosAplicados.tipoCuentaId ?? undefined,
    idRubro: filtrosAplicados.rubroId ?? undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const {
    data: tiposCuenta = [],
    isLoading: cargandoTipos,
    isError: errorTipos,
  } = useTiposCuenta();

  const hayFiltrosAplicados =
    filtrosAplicados.search.trim() !== '' ||
    filtrosAplicados.tipoCuentaId !== null ||
    filtrosAplicados.rubroId !== null;

  const mostrarMensajeExito = (mensaje: string) => {
    setMensajeExito(mensaje);

    window.setTimeout(() => {
      setMensajeExito(null);
    }, 3500);
  };

  const handleTipoCuentaChange = (tipoCuentaId: number | null) => {
    setFiltrosFormulario((prev) => {
      if (tipoCuentaId === null) {
        return {
          ...prev,
          tipoCuentaId: null,
        };
      }

      const nuevoTipo = tiposCuenta.find((tipo) => tipo.idTipoCuenta === tipoCuentaId);

      const rubroActualPerteneceAlNuevoTipo =
        prev.rubroId !== null && nuevoTipo?.rubros.some((rubro) => rubro.idRubro === prev.rubroId);

      return {
        ...prev,
        tipoCuentaId,
        rubroId: rubroActualPerteneceAlNuevoTipo ? prev.rubroId : null,
      };
    });
  };

  const handleBuscar = () => {
    setPage(1);

    setFiltrosAplicados({
      search: filtrosFormulario.search.trim(),
      tipoCuentaId: filtrosFormulario.tipoCuentaId,
      rubroId: filtrosFormulario.rubroId,
    });
  };

  const handleLimpiar = () => {
    setFiltrosFormulario(filtrosIniciales);
    setFiltrosAplicados(filtrosIniciales);
    setPage(1);
  };

  const handleEditarCuenta = (cuenta: CuentaContable) => {
    setCuentaSeleccionada(cuenta);
  };

  const handleCuentaCreada = () => {
    setPage(1);

    mostrarMensajeExito('La cuenta fue creada correctamente.');
  };

  const handleCuentaActualizada = () => {
    mostrarMensajeExito('La cuenta fue modificada correctamente.');
  };

  return (
    <>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/docente" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Manual de cuentas</span>
        </nav>

        {/* Acción docente */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setModalNuevaCuentaAbierto(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6f9468] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#5f8259]"
          >
            <Plus className="h-4 w-4" />
            Nueva cuenta
          </button>
        </div>

        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div className="fixed right-6 top-20 z-50 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-medium text-green-800 shadow-lg">
            {mensajeExito}
          </div>
        )}

        {/* Filtros */}
        <FiltrosCuentas
          search={filtrosFormulario.search}
          tipoCuentaId={filtrosFormulario.tipoCuentaId}
          rubroId={filtrosFormulario.rubroId}
          tiposCuenta={tiposCuenta}
          onSearchChange={(search) =>
            setFiltrosFormulario((prev) => ({
              ...prev,
              search,
            }))
          }
          onTipoCuentaChange={handleTipoCuentaChange}
          onRubroChange={(rubroId) =>
            setFiltrosFormulario((prev) => ({
              ...prev,
              rubroId,
            }))
          }
          onBuscar={handleBuscar}
          onLimpiar={handleLimpiar}
        />

        {cargandoTipos && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500 shadow-sm">
            Cargando filtros...
          </div>
        )}

        {errorTipos && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            No se pudieron cargar los tipos y rubros de cuenta.
          </div>
        )}

        {isLoading && (
          <div className="flex min-h-52 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <p className="text-sm text-gray-500">Cargando Manual de cuentas...</p>
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 text-center">
            <p className="text-sm text-red-700">No se pudo cargar el Manual de cuentas.</p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-xl bg-[#496647] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3f583e]"
            >
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !isError && data && (
          <TablaCuentas
            cuentas={data.items}
            page={data.page}
            pageSize={data.pageSize}
            totalItems={data.totalItems}
            totalPages={data.totalPages}
            hayFiltrosAplicados={hayFiltrosAplicados}
            onPageChange={setPage}
            onEditar={handleEditarCuenta}
          />
        )}
      </div>

      <NuevaCuentaModal
        abierto={modalNuevaCuentaAbierto}
        tiposCuenta={tiposCuenta}
        onCerrar={() => setModalNuevaCuentaAbierto(false)}
        onCreada={handleCuentaCreada}
      />

      <EditarCuentaModal
        abierto={cuentaSeleccionada !== null}
        cuenta={cuentaSeleccionada}
        onCerrar={() => setCuentaSeleccionada(null)}
        onActualizada={handleCuentaActualizada}
      />
    </>
  );
}
