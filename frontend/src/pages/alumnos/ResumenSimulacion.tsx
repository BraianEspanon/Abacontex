import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  House,
  ListChecks,
  MessageCircleMore,
  Settings,
  Trophy,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import abaImg from '../../assets/aba-feedback.png';

import DevolucionSimulacion from '../../components/simulacion/DevolucionSimulacion';
import PuntajeCircularSimulacion from '../../components/simulacion/PuntajeCircularSimulacion';
import Button from '../../components/ui/Button';

export default function ResumenSimulacion() {
  const navigate = useNavigate();

  /*
   * Mock temporal.
   * Después esto vendrá del hook correspondiente.
   */
  const simulacion = {
    idSimulacionEmpresa: 1,
    titulo: 'Título de la simulación',
    estado: 'Finalizada',
    fechaLimite: '18 de octubre de 2026',
    fechaFinalizacion: '20 de octubre de 2026',
    tema: 'Producción y operaciones',
    eventosCompletados: 5,
    totalEventos: 5,
    puntaje: 82,
    roles: ['CEO', 'CIO', 'CCO'],
    devolucion: 'Tu equipo analizó bien la situación, priorizó la continuidad de la producción.',
    fortalezas: [
      'Buena priorización de la producción',
      'Capacidad de respuesta ante imprevistos',
      'Trabajo en equipo y coordinación',
    ],
    aspectosMejora: [
      'Evaluar antes el impacto financiero',
      'Mayor coordinación entre áreas',
      'Considerar más escenarios alternativos',
    ],
  };

  const datosEncabezado = [
    {
      titulo: 'Fecha de límite',
      valor: simulacion.fechaLimite,
      icono: CalendarDays,
    },
    {
      titulo: 'Fecha de finalización',
      valor: simulacion.fechaFinalizacion,
      icono: Trophy,
    },
    {
      titulo: 'Tema de la simulación',
      valor: simulacion.tema,
      icono: ClipboardList,
    },
    {
      titulo: 'Eventos completados',
      valor: `${simulacion.eventosCompletados} de ${simulacion.totalEventos} eventos`,
      icono: ListChecks,
    },
  ];

  const datosResumen = [
    {
      titulo: 'Área temática',
      valor: simulacion.tema,
      icono: Settings,
    },
    {
      titulo: 'Eventos completados',
      valor: `${simulacion.eventosCompletados} de ${simulacion.totalEventos} eventos`,
      icono: FileText,
    },
    {
      titulo: 'Roles que intervinieron',
      valor: simulacion.roles.join(', '),
      icono: Users,
    },
  ];

  const volverAMisSimulaciones = () => {
    navigate('/alumno/simulacion');
  };

  const verConversacion = () => {
    navigate(`/alumno/simulacion/${simulacion.idSimulacionEmpresa}`);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 font-outfit text-lg">
        <House className="h-5 w-5 text-abacontex-text-secondary" />

        <ChevronRight className="h-4 w-4 text-abacontex-text-secondary" />

        <Link
          to="#"
          className="text-abacontex-text-secondary transition-colors hover:text-abacontex-primary"
        >
          Mis simulaciones
        </Link>

        <ChevronRight className="h-4 w-4 text-abacontex-text-secondary" />

        <span className="font-semibold text-abacontex-text">Ver resumen</span>
      </div>

      {/* Encabezado */}
      <section className="rounded-2xl bg-white/70 p-5 shadow-md backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-outfit text-3xl font-bold text-abacontex-text">
            {simulacion.titulo}
          </h1>

          <span className="rounded-xl bg-green-200/80 px-2 py-1 font-outfit text-sm font-medium text-abacontex-primary">
            {simulacion.estado}
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
              <Icono className="h-7 w-7 shrink-0 text-abacontex-text-secondary" />

              <div className="min-w-0">
                <p className="font-outfit text-sm font-medium text-abacontex-text">{titulo}</p>

                <p className="mt-1 font-outfit text-sm text-abacontex-text-secondary">{valor}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contenido principal */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(330px,1fr)]">
        {/* Resultado */}
        <section className="rounded-2xl bg-white/70 p-6 shadow-md backdrop-blur-sm">
          <h2 className="font-outfit text-2xl font-medium text-abacontex-primary">
            ¡Simulación finalizada!
          </h2>

          <p className="mt-2 font-outfit text-lg text-abacontex-text-secondary">
            Has completado todos los eventos de la simulación.
          </p>

          <div className="relative mt-6 flex flex-col items-center gap-6 lg:flex-row">
            <div className="flex shrink-0 justify-center lg:w-40">
              <PuntajeCircularSimulacion puntaje={simulacion.puntaje} />
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h3 className="font-outfit text-xl font-semibold text-abacontex-text">
                Puntuación final
              </h3>

              <p className="mt-2 max-w-xs font-outfit leading-relaxed text-abacontex-text-secondary">
                Has obtenido {simulacion.puntaje} puntos sobre 100 en esta simulación.
              </p>
            </div>

            <img src={abaImg} alt="Aba" className="w-48 shrink-0 object-contain lg:w-56" />
          </div>

          <div className="mt-5">
            <DevolucionSimulacion
              devolucion={simulacion.devolucion}
              fortalezas={simulacion.fortalezas}
              aspectosMejora={simulacion.aspectosMejora}
            />
          </div>
        </section>

        {/* Resumen lateral */}
        <aside className="flex min-h-[510px] flex-col rounded-2xl bg-white/70 p-5 shadow-md backdrop-blur-sm">
          <h2 className="border-b border-gray-300 pb-3 font-outfit text-2xl font-semibold text-abacontex-text">
            Resumen de la simulación
          </h2>

          <div className="divide-y divide-gray-300">
            {datosResumen.map(({ titulo, valor, icono: Icono }) => (
              <div key={titulo} className="flex gap-3 py-4">
                <Icono className="h-7 w-7 shrink-0 text-abacontex-text-secondary" />

                <div>
                  <p className="font-outfit font-medium text-abacontex-text">{titulo}</p>

                  <p className="mt-1 font-outfit text-sm text-abacontex-text-secondary">{valor}</p>
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
              onClick={volverAMisSimulaciones}
              className="h-10! w-full! rounded-lg!"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
