import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Home,
  Lightbulb,
  MessageCircle,
  Settings2,
  Trophy,
  Users,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import abaImg from '../../assets/aba-feedback.png';

import Button from '../../components/ui/Button';

import { useResumenFinalSimulacion } from '../../hooks/useResumenFinalSimulacion';
import PuntajeCircularSimulacion from '../../components/simulacion/PuntajeCircularSimulacion';

export default function FeedbackSimulacionDocente() {
  const navigate = useNavigate();

  const { idSimulacion, idSimulacionEmpresa } = useParams();

  const idSimulacionNumero = Number(idSimulacion);

  const idSimulacionEmpresaNumero = Number(idSimulacionEmpresa);

  const { data, isLoading, isError, refetch } =
    useResumenFinalSimulacion(idSimulacionEmpresaNumero);

  if (!Number.isInteger(idSimulacionEmpresaNumero) || idSimulacionEmpresaNumero <= 0) {
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

        <Link
          to={`/docente/simulaciones/${idSimulacionNumero}/entregas/${idSimulacionEmpresaNumero}`}
          className="transition hover:text-abacontex-dark"
        >
          {data?.empresa.nombre ?? 'Ver simulación'}
        </Link>

        <ChevronRight size={16} />

        <span className="font-semibold text-abacontex-dark">Feedback</span>
      </nav>

      {isLoading && <p className="text-sm text-abacontex-gray-text">Cargando feedback...</p>}

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

      {data && (
        <>
          {/* Cabecera */}
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold">{data.titulo}</h1>

              <span className="rounded-lg bg-abacontex-primary-three px-3 py-1 text-sm font-medium text-white">
                Finalizada
              </span>
            </div>

            <div className="mt-5 grid gap-4 rounded-xl bg-abacontex-light p-4 md:grid-cols-2 xl:grid-cols-4">
              <DatoCabecera
                icono={<CalendarDays size={23} />}
                label="Fecha límite"
                valor={formatearFecha(data.fechaLimite)}
              />

              <DatoCabecera
                icono={<Trophy size={23} />}
                label="Fecha de finalización"
                valor={data.fechaFinalizacion ? formatearFecha(data.fechaFinalizacion) : '-'}
              />

              <DatoCabecera
                icono={<ClipboardList size={23} />}
                label="Tema de la simulación"
                valor={data.flujoEmpresarial}
              />

              <DatoCabecera
                icono={<CheckCircle2 size={23} />}
                label="Eventos completados"
                valor={`${data.eventosCompletados} de ${data.cantEventosTotales} eventos`}
              />
            </div>
          </section>

          <div className="grid items-start gap-5 xl:grid-cols-[1.7fr_0.95fr]">
            {/* Resultado principal */}
            <section className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-md">
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold text-abacontex-primary">
                  ¡Simulación finalizada!
                </h2>

                <p className="mt-2 text-sm text-abacontex-gray-text">
                  La empresa completó todos los eventos de la simulación.
                </p>

                <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row">
                  <PuntajeCircularSimulacion puntaje={data.puntajeFinal} />

                  <div className="max-w-sm">
                    <h3 className="text-xl font-semibold">Puntuación final</h3>

                    <p className="mt-2 text-sm leading-6 text-abacontex-gray-text">
                      La empresa{' '}
                      <span className="font-semibold text-abacontex-black-text">
                        {data.empresa.nombre}
                      </span>{' '}
                      ha obtenido{' '}
                      <span className="font-semibold text-abacontex-primary">
                        {Math.round(data.puntajeFinal)} puntos
                      </span>{' '}
                      sobre 100 en esta simulación.
                    </p>
                  </div>
                </div>

                {/* Devolución Aba */}
                <div className="mt-8 rounded-2xl bg-abacontex-light p-5">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={20} className="text-abacontex-primary" />

                    <h3 className="text-lg font-semibold">Devolución de Aba</h3>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-abacontex-black-text">
                    {data.feedbackFinal.resumenGeneral}
                  </p>

                  {data.feedbackFinal.fortalezas.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={17} className="text-abacontex-primary-three" />

                        <h4 className="text-sm font-semibold">Fortalezas</h4>
                      </div>

                      <ul className="mt-2 space-y-1.5 pl-6 text-sm text-abacontex-gray-text">
                        {data.feedbackFinal.fortalezas.map((fortaleza) => (
                          <li key={fortaleza} className="list-disc">
                            {fortaleza}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.feedbackFinal.aspectosAMejorar.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <Lightbulb size={17} className="text-orange-500" />

                        <h4 className="text-sm font-semibold">Aspectos a mejorar</h4>
                      </div>

                      <ul className="mt-2 space-y-1.5 pl-6 text-sm text-abacontex-gray-text">
                        {data.feedbackFinal.aspectosAMejorar.map((aspecto) => (
                          <li key={aspecto} className="list-disc">
                            {aspecto}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.feedbackFinal.conclusion && (
                    <div className="mt-5 border-t border-gray-200 pt-4">
                      <p className="text-sm leading-6 text-abacontex-black-text">
                        {data.feedbackFinal.conclusion}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Aba decorativo */}
              <img
                src={abaImg}
                alt="Aba"
                className="pointer-events-none absolute top-8 right-4 hidden w-44 object-contain opacity-95 lg:block"
              />
            </section>

            {/* Resumen lateral */}
            <aside className="rounded-2xl bg-white shadow-md">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-xl font-semibold">Resumen de la simulación</h2>
              </div>

              <div className="divide-y divide-gray-100">
                <ItemResumen
                  icono={<Settings2 size={20} />}
                  label="Área temática"
                  valor={data.flujoEmpresarial}
                />

                <ItemResumen
                  icono={<ClipboardList size={20} />}
                  label="Eventos completados"
                  valor={`${data.eventosCompletados} de ${data.cantEventosTotales} eventos`}
                />

                <ItemResumen
                  icono={<Users size={20} />}
                  label="Roles que intervinieron"
                  valor={
                    data.rolesIntervinieron.length > 0 ? data.rolesIntervinieron.join(', ') : '-'
                  }
                />
              </div>

              <div className="p-5">
                <Button
                  type="button"
                  variant="outline"
                  label="Volver a entregas"
                  icon={<ArrowLeft size={15} />}
                  iconPosition="left"
                  onClick={() => navigate(`/docente/simulaciones/${idSimulacionNumero}/entregas`)}
                  className="h-10! w-full rounded-lg! py-0! text-sm!"
                />
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

interface DatoCabeceraProps {
  icono: React.ReactNode;
  label: string;
  valor: string;
}

function DatoCabecera({ icono, label, valor }: DatoCabeceraProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 text-abacontex-primary">{icono}</div>

      <div>
        <p className="text-xs font-medium">{label}</p>

        <p className="mt-1 text-sm text-abacontex-gray-text">{valor}</p>
      </div>
    </div>
  );
}

interface ItemResumenProps {
  icono: React.ReactNode;
  label: string;
  valor: string;
}

function ItemResumen({ icono, label, valor }: ItemResumenProps) {
  return (
    <div className="flex items-start gap-3 px-5 py-5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-abacontex-primary-three/10 text-abacontex-primary">
        {icono}
      </div>

      <div>
        <p className="text-sm font-semibold">{label}</p>

        <p className="mt-1 text-sm text-abacontex-gray-text">{valor}</p>
      </div>
    </div>
  );
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
}
