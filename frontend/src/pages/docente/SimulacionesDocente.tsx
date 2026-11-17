import { ChevronRight, Home, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';

import CardSimulacionDocente from '../../components/simulacion/CardSimulacionDocente';
import FiltrosSimulacionesDocente from '../../components/simulacion/FiltrosSimulacionesDocente';
import PaginacionSimulaciones from '../../components/simulacion/PaginacionSimulaciones';
import ResumenSimulacionesDocente from '../../components/simulacion/ResumenSimulacionesDocente';

import { useDebounce } from '../../hooks/useDebounce';
import { useFiltrosSimulacionesDocente } from '../../hooks/useFiltrosSimulacionesDocente';
import { useSimulacionesDocente } from '../../hooks/useSimulacionesDocente';

import type { EstadoFiltroSimulacionDocente } from '../../types/simulacion.types';

const PAGE_SIZE = 6;

export default function SimulacionesDocente() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [cursoId, setCursoId] = useState<number | null>(null);
  const [estado, setEstado] = useState<EstadoFiltroSimulacionDocente>('TODOS');
  const [page, setPage] = useState(1);

  const tituloDebounced = useDebounce(titulo, 400);

  const { data: filtrosData, isError: errorFiltros } = useFiltrosSimulacionesDocente();

  const { data, isLoading, isError, refetch } = useSimulacionesDocente({
    page,
    pageSize: PAGE_SIZE,
    cursoId: cursoId ?? undefined,
    titulo: tituloDebounced.trim() || undefined,
    estado: estado === 'TODOS' ? undefined : estado,
  });

  const cambiarTitulo = (valor: string) => {
    setTitulo(valor);
    setPage(1);
  };

  const cambiarCurso = (nuevoCursoId: number | null) => {
    setCursoId(nuevoCursoId);
    setPage(1);
  };

  const cambiarEstado = (nuevoEstado: EstadoFiltroSimulacionDocente) => {
    setEstado(nuevoEstado);
    setPage(1);
  };

  const limpiarFiltros = () => {
    setTitulo('');
    setCursoId(null);
    setEstado('TODOS');
    setPage(1);
  };

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      <nav className="flex items-center gap-2 text-sm text-abacontex-gray-text">
        <Link
          to="/docente"
          className="flex items-center gap-1 transition hover:text-abacontex-dark"
        >
          <Home className="size-4" />
          Inicio
        </Link>

        <ChevronRight className="size-4" />

        <span className="font-semibold text-abacontex-dark">Mis simulaciones</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="solid"
          label="Nueva simulación"
          icon={<Plus size={16} />}
          onClick={() => navigate('/docente/simulaciones/nueva')}
          className="h-10! rounded-lg! px-4! py-0! text-sm! font-semibold!"
        />
      </div>

      <FiltrosSimulacionesDocente
        titulo={titulo}
        cursoId={cursoId}
        estado={estado}
        cursos={filtrosData?.cursos ?? []}
        estados={
          filtrosData?.estados ?? [
            {
              clave: 'TODOS',
              label: 'Todos',
            },
          ]
        }
        onTituloChange={cambiarTitulo}
        onCursoChange={cambiarCurso}
        onEstadoChange={cambiarEstado}
        onLimpiarFiltros={limpiarFiltros}
      />

      {data && <ResumenSimulacionesDocente resumen={data.resumen} />}

      {data && data.items.length > 0 && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((simulacion) => (
            <CardSimulacionDocente key={simulacion.idSimulacion} simulacion={simulacion} />
          ))}
        </section>
      )}

      {data && data.totalItems > 0 && (
        <PaginacionSimulaciones
          page={page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      {errorFiltros && <p className="text-sm text-red-600">No fue posible cargar los filtros.</p>}

      {isLoading && <p className="text-sm text-abacontex-gray-text">Cargando simulaciones...</p>}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            No fue posible cargar las simulaciones.
          </p>

          <Button
            type="button"
            variant="outline"
            label="Reintentar"
            onClick={() => void refetch()}
            className="mt-3 h-9! rounded-lg! px-4! py-0! text-sm!"
          />
        </div>
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-abacontex-gray-text">
            No hay simulaciones para mostrar.
          </p>
        </div>
      )}
    </div>
  );
}
