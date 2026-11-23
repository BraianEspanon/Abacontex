import { ChevronRight, Home, Eye } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/ui/Button';

import EquipoConversacionSimulacion from '../../components/simulacion/EquipoConversacionSimulacion';
import HistorialConversacionSimulacion from '../../components/simulacion/HistorialConversacionSimulacion';
import ProgresoConversacionSimulacion from '../../components/simulacion/ProgresoConversacionSimulacion';

import { useConversacionSimulacion } from '../../hooks/useConversacionSimulacion';

export default function ConversacionSimulacionDocente() {
  const { idSimulacion, idSimulacionEmpresa: idSimulacionEmpresaParam } = useParams();

  const idSimulacionNumero = Number(idSimulacion);
  const idSimulacionEmpresa = Number(idSimulacionEmpresaParam);

  const { data, isLoading, isError, refetch } = useConversacionSimulacion(idSimulacionEmpresa);
  const navigate = useNavigate();

  if (!Number.isInteger(idSimulacionEmpresa) || idSimulacionEmpresa <= 0) {
    return <p className="text-sm text-red-600">La simulación indicada no es válida.</p>;
  }

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-abacontex-gray-text">
        <Link
          to="/docente"
          className="flex items-center gap-1 transition hover:text-abacontex-dark"
        >
          <Home size={16} />
          Inicio
        </Link>

        <ChevronRight size={16} />

        <Link to="/docente/simulaciones" className="transition hover:text-abacontex-dark">
          Mis simulaciones
        </Link>

        <ChevronRight size={16} />

        <Link
          to={`/docente/simulaciones/${idSimulacionNumero}/entregas`}
          className="transition hover:text-abacontex-dark"
        >
          Entregas
        </Link>

        <ChevronRight size={16} />

        <span className="font-semibold text-abacontex-dark">Ver simulación</span>
      </nav>

      {isLoading && <p className="text-sm text-abacontex-gray-text">Cargando simulación...</p>}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">No fue posible cargar la simulación.</p>

          <Button
            type="button"
            variant="outline"
            label="Reintentar"
            onClick={() => void refetch()}
            className="mt-3 h-9! rounded-lg! px-4! py-0! text-sm!"
          />
        </div>
      )}

      {data && (
        <div className="grid items-start gap-4 lg:grid-cols-[265px_minmax(0,1fr)]">
          {/* Columna izquierda */}
          <aside className="space-y-4">
            <ProgresoConversacionSimulacion
              eventoActual={data.progreso.eventoActualNumero}
              totalEventos={data.progreso.cantEventosTotales}
              porcentaje={data.progreso.porcentajeProgreso}
            />

            <EquipoConversacionSimulacion
              integrantes={data.integrantes}
              finalizada={data.estado === 'FINALIZADA'}
              onVerFeedback={() =>
                navigate(
                  `/docente/simulaciones/${idSimulacionNumero}/entregas/${idSimulacionEmpresa}/feedback`
                )
              }
            />
          </aside>

          {/* Chat */}
          <HistorialConversacionSimulacion
            titulo={data.titulo}
            integrantes={data.integrantes}
            mensajes={data.mensajes}
            modoLectura
          >
            <footer className="border-t border-gray-100 p-4">
              <div className="flex items-center justify-center gap-2 rounded-lg bg-abacontex-light px-4 py-3 text-sm text-abacontex-gray-text">
                <Eye size={16} />
                Estás visualizando la simulación en modo lectura.
              </div>
            </footer>
          </HistorialConversacionSimulacion>
        </div>
      )}
    </div>
  );
}
