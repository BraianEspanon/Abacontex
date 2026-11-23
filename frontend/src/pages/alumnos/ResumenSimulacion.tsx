import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  Home,
  ListChecks,
  MessageCircleMore,
  Settings,
  Trophy,
  Users,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import abaImg from '../../assets/aba-feedback.png';

import DevolucionSimulacion from '../../components/simulacion/DevolucionSimulacion';
import PuntajeCircularSimulacion from '../../components/simulacion/PuntajeCircularSimulacion';
import Button from '../../components/ui/Button';

import { useResumenFinalSimulacion } from '../../hooks/useResumenFinalSimulacion';

export default function ResumenSimulacion() {
  const { id } = useParams();

  const navigate = useNavigate();

  const idSimulacionEmpresa = Number(id);

  const {
    data: simulacion,
    isLoading,
    isError,
    refetch,
  } = useResumenFinalSimulacion(idSimulacionEmpresa);

  const volverAMisSimulaciones = () => {
    navigate('/alumno/simulacion');
  };

  const verConversacion = () => {
    navigate(`/alumno/simulacion/${idSimulacionEmpresa}`);
  };

  if (!Number.isInteger(idSimulacionEmpresa) || idSimulacionEmpresa <= 0) {
    return <p className="text-sm text-red-600">La simulación indicada no es válida.</p>;
  }

  const datosEncabezado = simulacion
    ? [
        {
          titulo: 'Fecha de límite',
          valor: formatearFecha(simulacion.fechaLimite),
          icono: CalendarDays,
        },
        {
          titulo: 'Fecha de finalización',
          valor: formatearFecha(simulacion.fechaFinalizacion) ?? '—',
          icono: Trophy,
        },
        {
          titulo: 'Tema de la simulación',
          valor: simulacion.flujoEmpresarial,
          icono: ClipboardList,
        },
        {
          titulo: 'Eventos completados',
          valor: `${simulacion.eventosCompletados} de ${simulacion.cantEventosTotales} eventos`,
          icono: ListChecks,
        },
      ]
    : [];

  const datosResumen = simulacion
    ? [
        {
          titulo: 'Área temática',
          valor: simulacion.flujoEmpresarial,
          icono: Settings,
        },
        {
          titulo: 'Eventos completados',
          valor: `${simulacion.eventosCompletados} de ${simulacion.cantEventosTotales} eventos`,
          icono: FileText,
        },
        {
          titulo: 'Roles que intervinieron',
          valor:
            simulacion.rolesIntervinieron.length > 0
              ? simulacion.rolesIntervinieron.join(', ')
              : '—',
          icono: Users,
        },
      ]
    : [];

  return (
    <div className="space-y-5 pb-8 font-sans text-abacontex-black-text">
      {/* Breadcrumb */}
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

        <span className="font-semibold text-abacontex-dark">Ver resumen</span>
      </nav>

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-abacontex-gray-text">Cargando resumen de la simulación...</p>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            No fue posible cargar el resumen de la simulación.
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

      {simulacion && (
        <>
          {/* Encabezado */}
          <section className="rounded-2xl bg-white/70 p-5 shadow-md backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-abacontex-dark">{simulacion.titulo}</h1>

              <span className="rounded-xl bg-green-200/80 px-2 py-1 text-sm font-medium text-abacontex-primary">
                Finalizada
              </span>
            </div>

            <div className="mt-4 grid overflow-hidden rounded-xl border border-gray-300/70 bg-gray-100/60 sm:grid-cols-2 xl:grid-cols-4">
              {datosEncabezado.map(({ titulo, valor, icono: Icono }, index) => (
                <div
                  key={titulo}
                  className={[
                    'flex min-h-18 items-center gap-3 px-4 py-3',
                    index !== datosEncabezado.length - 1 ? 'xl:border-r xl:border-gray-300' : '',
                  ].join(' ')}
                >
                  <Icono className="h-7 w-7 shrink-0 text-abacontex-gray-text" />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-abacontex-dark">{titulo}</p>

                    <p className="mt-1 text-sm text-abacontex-gray-text">{valor}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contenido principal */}
          <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(330px,1fr)]">
            {/* Resultado */}
            <section className="rounded-2xl bg-white/70 p-6 shadow-md backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-abacontex-primary">¡Simulación finalizada!</h2>

              <p className="mt-2 text-lg text-abacontex-gray-text">
                Has completado todos los eventos de la simulación.
              </p>

              <div className="relative mt-6 flex flex-col items-center gap-6 lg:flex-row">
                <div className="flex shrink-0 justify-center lg:w-40">
                  <PuntajeCircularSimulacion puntaje={simulacion.puntajeFinal} />
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-abacontex-dark">Puntuación final</h3>

                  <p className="mt-2 max-w-xs leading-relaxed text-abacontex-gray-text">
                    Has obtenido {simulacion.puntajeFinal} puntos sobre 100 en esta simulación.
                  </p>
                </div>

                <img src={abaImg} alt="Aba" className="w-48 shrink-0 object-contain lg:w-56" />
              </div>

              <div className="mt-5">
                <DevolucionSimulacion
                  devolucion={simulacion.feedbackFinal.resumenGeneral}
                  fortalezas={simulacion.feedbackFinal.fortalezas}
                  aspectosMejora={simulacion.feedbackFinal.aspectosAMejorar}
                />
              </div>
            </section>

            {/* Resumen lateral */}
            <aside className="flex min-h-127.5 flex-col rounded-2xl bg-white/70 p-5 shadow-md backdrop-blur-sm">
              <h2 className="border-b border-gray-300 pb-3 text-2xl font-semibold text-abacontex-dark">
                Resumen de la simulación
              </h2>

              <div className="divide-y divide-gray-300">
                {datosResumen.map(({ titulo, valor, icono: Icono }) => (
                  <div key={titulo} className="flex gap-3 py-4">
                    <Icono className="h-7 w-7 shrink-0 text-abacontex-gray-text" />

                    <div>
                      <p className="font-medium text-abacontex-dark">{titulo}</p>

                      <p className="mt-1 text-sm text-abacontex-gray-text">{valor}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto space-y-3 pt-8">
                <Button
                  type="button"
                  variant="solid"
                  label="Ver conversación"
                  icon={<MessageCircleMore className="h-4 w-4" />}
                  onClick={verConversacion}
                  className="h-10! w-full! rounded-lg!"
                />

                <Button
                  type="button"
                  variant="outline"
                  label="Volver a mis simulaciones"
                  icon={<ArrowLeft className="h-4 w-4" />}
                  iconPosition="left"
                  onClick={volverAMisSimulaciones}
                  className="h-10! w-full! rounded-lg!"
                />
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function formatearFecha(fecha: string | null) {
  if (!fecha) {
    return '—';
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Argentina/Cordoba',
  }).format(new Date(fecha));
}
