import axios from 'axios';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import BarraVisualConversacion from '../../components/simulacion/BarraVisualConversacion';
import DecisionActivaAlumno from '../../components/simulacion/DecisionActivaAlumno';
import EquipoConversacionSimulacion from '../../components/simulacion/EquipoConversacionSimulacion';
import HistorialConversacionSimulacion from '../../components/simulacion/HistorialConversacionSimulacion';
import ProgresoConversacionSimulacion from '../../components/simulacion/ProgresoConversacionSimulacion';
import Button from '../../components/ui/Button';

import { useConversacionSimulacion } from '../../hooks/useConversacionSimulacion';
import { useResponderDecisionSimulacion } from '../../hooks/useResponderDecisionSimulacion';

export default function ConversacionSimulacionAlumno() {
  const { id } = useParams();

  const navigate = useNavigate();

  const idSimulacionEmpresa = Number(id);

  const { data, isLoading, isError, refetch } = useConversacionSimulacion(idSimulacionEmpresa);

  const responderDecision = useResponderDecisionSimulacion();

  const [idOpcionSeleccionada, setIdOpcionSeleccionada] = useState<number | null>(null);

  const [textoOpcionSeleccionada, setTextoOpcionSeleccionada] = useState('');

  function seleccionarOpcion(idOpcion: number, texto: string) {
    setIdOpcionSeleccionada(idOpcion);
    setTextoOpcionSeleccionada(texto);
  }

  async function handleResponder() {
    if (idOpcionSeleccionada === null) {
      return;
    }

    try {
      const respuesta = await responderDecision.mutateAsync({
        idSimulacionEmpresa,
        idOpcion: idOpcionSeleccionada,
      });

      setIdOpcionSeleccionada(null);
      setTextoOpcionSeleccionada('');

      if (respuesta.finalizada) {
        navigate(`/alumno/simulacion/${idSimulacionEmpresa}/resumen`);
      }
    } catch {
      // el error ya se muestra abajo
    }
  }

  if (!Number.isInteger(idSimulacionEmpresa) || idSimulacionEmpresa <= 0) {
    return <p className="text-sm text-red-600">La simulación indicada no es válida.</p>;
  }

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-abacontex-gray-text">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-abacontex-dark">
          <Home size={16} />
          Inicio
        </Link>

        <ChevronRight size={16} />

        <Link to="/alumno/simulacion" className="transition hover:text-abacontex-dark">
          Mis simulaciones
        </Link>

        <ChevronRight size={16} />

        <span className="font-semibold text-abacontex-dark">Simulación en curso</span>
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
          <aside className="space-y-4">
            <ProgresoConversacionSimulacion
              eventoActual={data.progreso.eventoActualNumero}
              totalEventos={data.progreso.cantEventosTotales}
              porcentaje={data.progreso.porcentajeProgreso}
            />

            <EquipoConversacionSimulacion integrantes={data.integrantes} finalizada={false} />
          </aside>

          <HistorialConversacionSimulacion
            titulo={data.titulo}
            integrantes={data.integrantes}
            mensajes={data.mensajes}
          >
            <div className="space-y-3 border-t border-gray-100 p-4">
              {data.decisionActiva && (
                <DecisionActivaAlumno
                  decision={data.decisionActiva}
                  idOpcionSeleccionada={idOpcionSeleccionada}
                  onSeleccionar={seleccionarOpcion}
                />
              )}

              {responderDecision.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {obtenerMensajeError(responderDecision.error)}
                </div>
              )}

              <BarraVisualConversacion
                textoSeleccionado={textoOpcionSeleccionada}
                puedeEnviar={
                  data.decisionActiva?.puedeDecidir === true && idOpcionSeleccionada !== null
                }
                enviando={responderDecision.isPending}
                onEnviar={() => void handleResponder()}
              />
            </div>
          </HistorialConversacionSimulacion>
        </div>
      )}
    </div>
  );
}

function obtenerMensajeError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const datos = error.response?.data as
      | {
          message?: string;
          error?: string;
        }
      | undefined;

    return datos?.message ?? datos?.error ?? 'No se pudo registrar la decisión.';
  }

  return 'No se pudo registrar la decisión.';
}
