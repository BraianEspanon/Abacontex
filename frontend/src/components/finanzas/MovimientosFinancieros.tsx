import { useState } from 'react';

import FiltrosMovimientos from './FiltrosMovimientos';
import TablaMovimientos from './TablaMovimientos';

import { useMovimientosFinancieros } from '../../hooks/useMovimientosFinancieros';
import { useTiposMovimiento } from '../../hooks/useTiposMovimiento';

const PAGE_SIZE = 10;

export default function MovimientosFinancieros() {
  const [page, setPage] = useState(1);
  const [mes, setMes] = useState<number | null>(null);
  const [idTipoMovimiento, setIdTipoMovimiento] = useState<number | null>(null);

  const { data, isLoading, isError } = useMovimientosFinancieros({
    page,
    pageSize: PAGE_SIZE,
    mes: mes ?? undefined,
    idTipoMovimiento: idTipoMovimiento ?? undefined,
  });

  const { data: tiposMovimiento = [], isLoading: cargandoTipos } = useTiposMovimiento();

  const cambiarTipoMovimiento = (nuevoTipo: number | null) => {
    setIdTipoMovimiento(nuevoTipo);
    setPage(1);
  };

  const cambiarMes = (nuevoMes: number | null) => {
    setMes(nuevoMes);
    setPage(1);
  };

  const limpiarFiltros = () => {
    setIdTipoMovimiento(null);
    setMes(null);
    setPage(1);
  };

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 px-5 py-5 text-sm text-red-700">
        No se pudo cargar el historial de movimientos financieros.
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <FiltrosMovimientos
        tiposMovimiento={tiposMovimiento}
        idTipoMovimiento={idTipoMovimiento}
        mes={mes}
        onTipoMovimientoChange={cambiarTipoMovimiento}
        onMesChange={cambiarMes}
        onLimpiar={limpiarFiltros}
      />

      <TablaMovimientos
        movimientos={data?.items ?? []}
        page={data?.page ?? page}
        pageSize={data?.pageSize ?? PAGE_SIZE}
        totalItems={data?.totalItems ?? 0}
        totalPages={data?.totalPages ?? 0}
        isLoading={isLoading || cargandoTipos}
        onPageChange={setPage}
      />
    </div>
  );
}
