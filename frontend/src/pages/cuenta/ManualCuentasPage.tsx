import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import FiltrosCuentas from '../../components/cuenta/FiltrosCuentas';
import TablaCuentas from '../../components/cuenta/TablaCuentas';

import { useCuentas } from '../../hooks/useCuentas';
import { useTiposCuenta } from '../../hooks/useTiposCuenta';

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

export default function ManualCuentasPage() {
  const [page, setPage] = useState(1);

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

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Manual de cuentas</span>
      </nav>

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
        />
      )}
    </div>
  );
}
