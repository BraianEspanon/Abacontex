import axios from 'axios';
import { ChevronRight, Home, Send, Settings2, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';

import { useCrearSimulacion } from '../../hooks/useCrearSimulacion';
import { useFiltrosSimulacionesDocente } from '../../hooks/useFiltrosSimulacionesDocente';
import { useOpcionesCrearSimulacion } from '../../hooks/useOpcionesCrearSimulacion';

import type { DificultadSimulacion, DuracionSimulacion } from '../../types/simulacion.types';

export default function NuevaSimulacionDocente() {
  const navigate = useNavigate();

  const [cursoId, setCursoId] = useState<number | null>(null);

  const [fechaLimite, setFechaLimite] = useState('');

  const [flujoEmpresarial, setFlujoEmpresarial] = useState('');

  const [dificultad, setDificultad] = useState<DificultadSimulacion | null>(null);

  const [duracion, setDuracion] = useState<DuracionSimulacion | null>(null);

  const [eventosSorpresa, setEventosSorpresa] = useState(false);

  const [tipoEventoSorpresa, setTipoEventoSorpresa] = useState('');

  const [usarDatosEmpresa, setUsarDatosEmpresa] = useState(true);

  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

  const {
    data: opciones,
    isLoading: cargandoOpciones,
    isError: errorOpciones,
  } = useOpcionesCrearSimulacion();

  const { data: filtros, isLoading: cargandoCursos } = useFiltrosSimulacionesDocente();

  const crearSimulacion = useCrearSimulacion();

  const cursoSeleccionado = useMemo(
    () => filtros?.cursos.find((curso) => curso.idCurso === cursoId),
    [filtros?.cursos, cursoId]
  );

  const dificultadSeleccionada = useMemo(
    () => opciones?.dificultades.find((opcion) => opcion.id === dificultad),
    [opciones?.dificultades, dificultad]
  );

  const duracionSeleccionada = useMemo(
    () => opciones?.duraciones.find((opcion) => opcion.id === duracion),
    [opciones?.duraciones, duracion]
  );

  const formularioCompleto =
    cursoId !== null &&
    fechaLimite !== '' &&
    flujoEmpresarial !== '' &&
    dificultad !== null &&
    duracion !== null &&
    (!eventosSorpresa || tipoEventoSorpresa !== '');

  async function handleGenerarYEnviar() {
    if (!cursoId || !fechaLimite || !flujoEmpresarial || !dificultad || !duracion) {
      setErrorFormulario('Completá todos los campos obligatorios.');

      return;
    }

    if (eventosSorpresa && !tipoEventoSorpresa) {
      setErrorFormulario('Seleccioná el tipo de evento sorpresa.');

      return;
    }

    setErrorFormulario(null);

    try {
      const fechaIso = new Date(`${fechaLimite}T23:59:00`).toISOString();

      await crearSimulacion.mutateAsync({
        cursoId,
        flujoEmpresarial,
        dificultad,
        duracion,
        eventosSorpresa,
        usarDatosEmpresa,
        fechaLimite: fechaIso,
        ...(eventosSorpresa && tipoEventoSorpresa
          ? {
              tipoEventoSorpresa,
            }
          : {}),
      });

      navigate('/docente/simulaciones');
    } catch (error) {
      setErrorFormulario(obtenerMensajeError(error));
    }
  }

  return (
    <div className="space-y-6 font-sans text-abacontex-black-text">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-abacontex-gray-text">
        <Link
          to="/docente"
          className="flex items-center gap-1 transition hover:text-abacontex-dark"
        >
          <Home className="size-4" />
          Inicio
        </Link>

        <ChevronRight className="size-4" />

        <Link to="/docente/simulaciones" className="transition hover:text-abacontex-dark">
          Mis simulaciones
        </Link>

        <ChevronRight className="size-4" />

        <span className="font-semibold text-abacontex-dark">Nueva simulación</span>
      </nav>

      {errorOpciones && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No fue posible cargar las opciones para crear la simulación.
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        {/* IZQUIERDA */}
        <div className="space-y-5">
          {/* Información general */}
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="text-base font-semibold">Información general</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="curso-simulacion" className="mb-2 block text-sm font-medium">
                  Curso <span className="text-red-600">*</span>
                </label>

                <select
                  id="curso-simulacion"
                  value={cursoId ?? ''}
                  disabled={cargandoCursos}
                  onChange={(event) =>
                    setCursoId(event.target.value ? Number(event.target.value) : null)
                  }
                  className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">Seleccione una opción</option>

                  {filtros?.cursos.map((curso) => (
                    <option key={curso.idCurso} value={curso.idCurso}>
                      {curso.nombreCurso}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fecha-limite-simulacion" className="mb-2 block text-sm font-medium">
                  Fecha límite <span className="text-red-600">*</span>
                </label>

                <input
                  id="fecha-limite-simulacion"
                  type="date"
                  value={fechaLimite}
                  min={obtenerFechaActual()}
                  onChange={(event) => setFechaLimite(event.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
                />
              </div>
            </div>
          </section>

          {/* Configuración */}
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="text-base font-semibold">Configuración del escenario</h2>

            <div className="mt-5 space-y-5">
              {/* Flujo */}
              <div>
                <label htmlFor="flujo-empresarial" className="mb-2 block text-sm font-medium">
                  Flujo empresarial <span className="text-red-600">*</span>
                </label>

                <select
                  id="flujo-empresarial"
                  value={flujoEmpresarial}
                  disabled={cargandoOpciones}
                  onChange={(event) => setFlujoEmpresarial(event.target.value)}
                  className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">Seleccione una opción</option>

                  {opciones?.flujosEmpresariales.map((opcion) => (
                    <option key={opcion.id} value={opcion.id}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dificultad + duración */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium">
                    Dificultad <span className="text-red-600">*</span>
                  </p>

                  <div className="grid h-12 grid-cols-3 rounded-lg border border-gray-300 bg-white p-1">
                    {opciones?.dificultades.map((opcion) => {
                      const seleccionada = dificultad === opcion.id;

                      return (
                        <button
                          key={opcion.id}
                          type="button"
                          onClick={() => setDificultad(opcion.id)}
                          className={[
                            'cursor-pointer rounded-md px-2 text-xs font-medium transition',
                            seleccionada
                              ? 'bg-abacontex-primary text-white'
                              : 'text-abacontex-black-text hover:bg-abacontex-light',
                          ].join(' ')}
                        >
                          {opcion.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">
                    Duración <span className="text-red-600">*</span>
                  </p>

                  <div className="grid h-12 grid-cols-3 rounded-lg border border-gray-300 bg-white p-1">
                    {opciones?.duraciones.map((opcion) => {
                      const seleccionada = duracion === opcion.id;

                      return (
                        <button
                          key={opcion.id}
                          type="button"
                          onClick={() => setDuracion(opcion.id)}
                          className={[
                            'flex cursor-pointer flex-col items-center justify-center rounded-md px-1 transition',
                            seleccionada
                              ? 'bg-abacontex-primary text-white'
                              : 'text-abacontex-black-text hover:bg-abacontex-light',
                          ].join(' ')}
                        >
                          <span className="text-xs font-medium">{opcion.label}</span>

                          <span
                            className={[
                              'mt-0.5 text-[9px]',
                              seleccionada ? 'text-white/80' : 'text-abacontex-gray-text',
                            ].join(' ')}
                          >
                            {opcion.subtitulo}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Evento sorpresa */}
              <div>
                <p className="text-sm font-medium">Evento sorpresa</p>

                <div className="mt-3 flex items-start gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={eventosSorpresa}
                    onClick={() => {
                      setEventosSorpresa((valor) => !valor);

                      if (eventosSorpresa) {
                        setTipoEventoSorpresa('');
                      }
                    }}
                    className={[
                      'relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer rounded-full transition',
                      eventosSorpresa ? 'bg-abacontex-primary-three' : 'bg-gray-300',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'absolute top-1 size-4 rounded-full bg-white shadow-sm transition-all',
                        eventosSorpresa ? 'left-6' : 'left-1',
                      ].join(' ')}
                    />
                  </button>

                  <div>
                    <p className="text-sm font-medium">Incluir eventos sorpresa</p>

                    <p className="mt-1 text-xs leading-5 text-abacontex-gray-text">
                      Se incorporarán situaciones inesperadas que modificarán el contexto de la
                      empresa.
                    </p>
                  </div>
                </div>

                {eventosSorpresa && (
                  <div className="mt-4">
                    <label
                      htmlFor="tipo-evento-sorpresa"
                      className="mb-2 block text-sm font-medium"
                    >
                      Tipo de evento sorpresa <span className="text-red-600">*</span>
                    </label>

                    <select
                      id="tipo-evento-sorpresa"
                      value={tipoEventoSorpresa}
                      onChange={(event) => setTipoEventoSorpresa(event.target.value)}
                      className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
                    >
                      <option value="">Seleccione una opción</option>

                      {opciones?.tiposEventoSorpresa.map((opcion) => (
                        <option key={opcion.id} value={opcion.id}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Datos empresa */}
              <div>
                <p className="text-sm font-medium">Datos de la empresa</p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setUsarDatosEmpresa(true)}
                    className={[
                      'cursor-pointer rounded-xl border p-3 text-left transition',
                      usarDatosEmpresa
                        ? 'border-abacontex-primary-three bg-abacontex-primary-three/5'
                        : 'border-gray-200 bg-white hover:border-gray-300',
                    ].join(' ')}
                  >
                    <div className="flex gap-3">
                      <span
                        className={[
                          'mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border',
                          usarDatosEmpresa ? 'border-abacontex-primary-three' : 'border-gray-400',
                        ].join(' ')}
                      >
                        {usarDatosEmpresa && (
                          <span className="size-2 rounded-full bg-abacontex-primary-three" />
                        )}
                      </span>

                      <div>
                        <p className="text-xs font-semibold">Usar datos de la empresa del curso</p>

                        <p className="mt-1 text-[11px] leading-4 text-abacontex-gray-text">
                          Se tomará la configuración, productos, stock, costos y saldos actuales de
                          la empresa.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUsarDatosEmpresa(false)}
                    className={[
                      'cursor-pointer rounded-xl border p-3 text-left transition',
                      !usarDatosEmpresa
                        ? 'border-abacontex-primary-three bg-abacontex-primary-three/5'
                        : 'border-gray-200 bg-white hover:border-gray-300',
                    ].join(' ')}
                  >
                    <div className="flex gap-3">
                      <span
                        className={[
                          'mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border',
                          !usarDatosEmpresa ? 'border-abacontex-primary-three' : 'border-gray-400',
                        ].join(' ')}
                      >
                        {!usarDatosEmpresa && (
                          <span className="size-2 rounded-full bg-abacontex-primary-three" />
                        )}
                      </span>

                      <div>
                        <p className="text-xs font-semibold">Usar datos estándar</p>

                        <p className="mt-1 text-[11px] leading-4 text-abacontex-gray-text">
                          Se utilizarán datos genéricos predefinidos por el sistema para todas las
                          empresas.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* DERECHA */}
        <aside className="space-y-5 xl:sticky xl:top-5">
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-abacontex-primary-three" />

              <h2 className="text-base font-semibold">Generación con IA</h2>
            </div>

            <p className="mt-4 text-sm leading-6 text-abacontex-gray-text">
              Al enviar la configuración, Aba generará automáticamente el escenario, los eventos y
              las decisiones de la simulación. Luego será asignada a las empresas del curso.
            </p>
          </section>

          <section className="rounded-2xl bg-white shadow-md">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-semibold">Vista previa</h2>
            </div>

            <div className="space-y-5 p-5">
              <ItemVistaPrevia
                label="Curso"
                valor={cursoSeleccionado?.nombreCurso ?? 'Sin seleccionar'}
              />

              <ItemVistaPrevia
                label="Flujo empresarial"
                valor={flujoEmpresarial || 'Sin seleccionar'}
              />

              <ItemVistaPrevia
                label="Fecha límite"
                valor={fechaLimite ? formatearFechaPrevia(fechaLimite) : 'Sin seleccionar'}
              />

              <ItemVistaPrevia
                label="Dificultad"
                valor={dificultadSeleccionada?.label ?? 'Sin seleccionar'}
              />

              <ItemVistaPrevia
                label="Duración"
                valor={
                  duracionSeleccionada
                    ? `${duracionSeleccionada.label} - ${duracionSeleccionada.subtitulo}`
                    : 'Sin seleccionar'
                }
              />

              <ItemVistaPrevia
                label="Eventos sorpresa"
                valor={
                  eventosSorpresa
                    ? tipoEventoSorpresa
                      ? `Sí - ${tipoEventoSorpresa}`
                      : 'Sí'
                    : 'No'
                }
              />

              <ItemVistaPrevia
                label="Datos"
                valor={
                  usarDatosEmpresa ? 'Usar datos de la empresa del curso' : 'Usar datos estándar'
                }
              />
            </div>
          </section>
        </aside>
      </div>

      {errorFormulario && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorFormulario}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="solid"
          label={
            crearSimulacion.isPending ? 'Generando simulación...' : 'Generar y enviar simulación'
          }
          icon={<Send size={16} />}
          disabled={!formularioCompleto || crearSimulacion.isPending || cargandoOpciones}
          onClick={() => void handleGenerarYEnviar()}
          className="h-10! rounded-lg! px-5! py-0! text-sm! font-semibold!"
        />
      </div>
    </div>
  );
}

interface ItemVistaPreviaProps {
  label: string;
  valor: string;
}

function ItemVistaPrevia({ label, valor }: ItemVistaPreviaProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-abacontex-primary-three/10 text-abacontex-primary">
        <Settings2 size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>

        <p className="mt-0.5 wrap-break-word text-sm text-abacontex-gray-text">{valor}</p>
      </div>
    </div>
  );
}

function obtenerFechaActual() {
  const hoy = new Date();

  const anio = hoy.getFullYear();

  const mes = String(hoy.getMonth() + 1).padStart(2, '0');

  const dia = String(hoy.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

function formatearFechaPrevia(fecha: string) {
  const valor = new Date(`${fecha}T23:59:00`);

  return (
    new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(valor) + ' - 23:59'
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

    return datos?.message ?? datos?.error ?? 'No se pudo generar la simulación.';
  }

  return 'No se pudo generar la simulación. Intentá nuevamente.';
}
