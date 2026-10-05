import {
  Camera,
  ChevronRight,
  Home,
  Image as ImageIcon,
  Pencil,
  Sparkles,
  LoaderCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DetalleEjercicio } from '../../types/ejercicio.types';
import ModalEditarEnunciado from '../../components/ejercicios/ModalEditarEnunciado';
import SubirArchivoEjercicio from '../../components/ejercicios/SubirArchivoEjercicio';
import { useCrearEjercicio } from '../../hooks/useCrearEjercicio';
import { useCursosDocente } from '../../hooks/useCursosDocente';
import { useDigitalizarEjercicio } from '../../hooks/useDigitalizarEjercicio';
import { useEjercicioDetalle } from '../../hooks/useEjercicioDetalle';
import { useEditarEjercicio } from '../../hooks/useEditarEjercicio';
import MarkdownEjercicio from '../../components/ejercicios/MarkdownEjercicio';

const PLANTILLAS = [
  {
    id: 'LIBRO_DIARIO',
    label: 'Libro diario',
  },
  {
    id: 'LIBRO_MAYOR',
    label: 'Libro mayor',
  },
  {
    id: 'LIBRO_IVA',
    label: 'IVA',
  },
  {
    id: 'HOJA_TRABAJO',
    label: 'Hoja de trabajo',
  },
] as const;

type TipoPlantilla = (typeof PLANTILLAS)[number]['id'];

export default function NuevoEjercicioDigitalizar() {
  const [searchParams] = useSearchParams();

  const idEditar = Number(searchParams.get('editar') ?? 0);
  const modoEdicion = idEditar > 0;

  const {
    data: ejercicioEditar,
    isLoading: cargandoEjercicio,
    isError: errorEjercicio,
  } = useEjercicioDetalle(idEditar);

  if (modoEdicion && cargandoEjercicio) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-abacontex-gray-text">Cargando ejercicio...</p>
      </div>
    );
  }

  if (modoEdicion && (errorEjercicio || !ejercicioEditar)) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-red-600">No fue posible cargar el ejercicio.</p>
      </div>
    );
  }

  return (
    <FormularioEjercicioDigitalizar
      key={ejercicioEditar?.idEjercicio ?? 'nuevo'}
      idEditar={idEditar}
      ejercicioEditar={ejercicioEditar}
    />
  );
}

interface FormularioEjercicioDigitalizarProps {
  idEditar: number;
  ejercicioEditar?: DetalleEjercicio;
}

function FormularioEjercicioDigitalizar({
  idEditar,
  ejercicioEditar,
}: FormularioEjercicioDigitalizarProps) {
  const [archivo, setArchivo] = useState<File | null>(null);

  const [enunciado, setEnunciado] = useState(ejercicioEditar?.enunciado ?? '');

  const [titulo, setTitulo] = useState(ejercicioEditar?.titulo ?? '');

  const [cursoId, setCursoId] = useState(
    ejercicioEditar ? String(ejercicioEditar.curso.idCurso) : ''
  );

  const [fechaLimite, setFechaLimite] = useState(
    ejercicioEditar ? convertirISOAFechaInput(ejercicioEditar.fechaLimite) : ''
  );

  const [plantillas, setPlantillas] = useState<TipoPlantilla[]>(
    ejercicioEditar
      ? ejercicioEditar.plantillas.map((plantilla) => plantilla.tipo as TipoPlantilla)
      : []
  );

  const [resolverAhora, setResolverAhora] = useState(false);

  const [editandoEnunciado, setEditandoEnunciado] = useState(false);

  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

  const navigate = useNavigate();

  const { data: cursos, isLoading: cargandoCursos } = useCursosDocente();

  const digitalizar = useDigitalizarEjercicio();

  const crearEjercicio = useCrearEjercicio();

  const editarEjercicio = useEditarEjercicio();

  const modoEdicion = idEditar > 0;

  const procesarArchivo = () => {
    if (!archivo) {
      return;
    }

    digitalizar.mutate(archivo, {
      onSuccess: (respuesta) => {
        setEnunciado(respuesta.enunciadoTexto);
      },
    });
  };

  const alternarPlantilla = (plantilla: TipoPlantilla) => {
    setPlantillas((actuales) =>
      actuales.includes(plantilla)
        ? actuales.filter((item) => item !== plantilla)
        : [...actuales, plantilla]
    );
  };

  const guardarEjercicio = (estado: 'BORRADOR' | 'ENVIADO') => {
    setErrorFormulario(null);

    if (
      !titulo.trim() ||
      !cursoId ||
      !enunciado.trim() ||
      !fechaLimite ||
      plantillas.length === 0
    ) {
      setErrorFormulario(
        'Completá todos los campos obligatorios y seleccioná al menos una plantilla.'
      );

      return;
    }

    const fechaISO = convertirFechaLimiteAISO(fechaLimite);

    const datos = {
      titulo: titulo.trim(),
      cursoId: Number(cursoId),
      enunciado: enunciado.trim(),
      fechaLimite: fechaISO,
      estado,
      plantillas,
    };

    if (modoEdicion) {
      editarEjercicio.mutate(
        {
          idEjercicio: idEditar,
          datos,
        },
        {
          onSuccess: () => {
            navigate(`/docente/ejercicios/${idEditar}`);
          },
          onError: () => {
            setErrorFormulario('No fue posible actualizar el ejercicio.');
          },
        }
      );

      return;
    }

    crearEjercicio.mutate(
      {
        ...datos,
        generacionIA: null,
      },
      {
        onSuccess: () => {
          navigate('/docente/ejercicios');
        },
      }
    );
  };

  const cursoSeleccionado = cursos?.find((curso) => String(curso.id) === cursoId);

  const formularioListo =
    titulo.trim() && cursoId && enunciado.trim() && fechaLimite && plantillas.length > 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-4 font-sans text-abacontex-black-text sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-abacontex-gray-text">
        <Link
          to="/docente"
          className="flex items-center gap-1 transition hover:text-abacontex-dark"
        >
          <Home className="size-4" />
          Inicio
        </Link>

        <ChevronRight className="size-4" />

        <Link to="/docente/ejercicios" className="transition hover:text-abacontex-dark">
          Ejercicios
        </Link>

        <ChevronRight className="size-4" />

        <span className="font-semibold text-abacontex-dark">Nuevo ejercicio</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold">Nuevo ejercicio</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          className="group flex items-center gap-4 rounded-xl border border-abacontex-primary-three bg-green-50 p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex size-11 items-center justify-center text-abacontex-primary">
            <Camera className="size-7" />
          </div>

          <div>
            <p className="font-semibold text-abacontex-black-text">Digitalizar ejercicio</p>

            <p className="mt-1 text-sm text-abacontex-gray-text">
              Subí una foto o PDF y lo convertimos en ejercicio
            </p>
          </div>
        </button>

        <Link
          to="/docente/ejercicios/nuevo/ia"
          className="group flex items-center gap-4 rounded-xl border border-gray-300 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-abacontex-primary-three/40 hover:shadow-md"
        >
          <div className="flex size-11 items-center justify-center text-abacontex-gray-text transition group-hover:text-abacontex-primary">
            <Sparkles className="size-7" />
          </div>

          <div>
            <p className="font-semibold text-abacontex-black-text">Crear con IA</p>

            <p className="mt-1 text-sm text-abacontex-gray-text">
              Generá un ejercicio contable con ayuda de la IA
            </p>
          </div>
        </Link>
      </div>

      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="text-base font-semibold">1. Subí el enunciado del ejercicio</h2>

            <div className="mt-4">
              <SubirArchivoEjercicio
                archivo={archivo}
                onArchivoChange={(nuevoArchivo) => {
                  setArchivo(nuevoArchivo);
                  setEnunciado('');
                }}
                disabled={digitalizar.isPending}
              />
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                disabled={!archivo || digitalizar.isPending}
                onClick={procesarArchivo}
                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-abacontex-primary-three px-4 text-sm font-semibold text-white transition hover:bg-abacontex-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {digitalizar.isPending ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Digitalizar'
                )}
              </button>
            </div>

            {digitalizar.isError && (
              <p className="mt-3 text-sm font-medium text-red-600">
                No fue posible digitalizar el archivo.
              </p>
            )}

            {archivo && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-green-50 text-abacontex-primary">
                  <ImageIcon className="size-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{archivo.name}</p>

                  <p className="text-xs text-abacontex-gray-text">
                    {(archivo.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="text-base font-semibold">2. Datos del ejercicio</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-[1.25fr_0.8fr_0.75fr]">
              <div>
                <label htmlFor="titulo" className="mb-2 block text-sm font-medium">
                  Título del ejercicio
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  id="titulo"
                  value={titulo}
                  maxLength={100}
                  onChange={(event) => setTitulo(event.target.value)}
                  placeholder="Ingrese título..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
                />

                <div className="mt-1 flex justify-between text-xs text-abacontex-gray-text">
                  <span>Máx. 100 caracteres</span>

                  <span>{titulo.length}/100</span>
                </div>
              </div>

              <div>
                <label htmlFor="curso" className="mb-2 block text-sm font-medium">
                  Curso
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  id="curso"
                  value={cursoId}
                  disabled={cargandoCursos}
                  onChange={(event) => setCursoId(event.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
                >
                  <option value="">Seleccione una opción</option>

                  {cursos?.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fecha" className="mb-2 block text-sm font-medium">
                  Fecha límite
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  id="fecha"
                  type="date"
                  value={fechaLimite}
                  min={obtenerFechaActual()}
                  onChange={(event) => setFechaLimite(event.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="text-base font-semibold">
              3. Plantillas a habilitar para la resolución
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {PLANTILLAS.map((plantilla) => {
                const seleccionada = plantillas.includes(plantilla.id);

                return (
                  <button
                    key={plantilla.id}
                    type="button"
                    onClick={() => alternarPlantilla(plantilla.id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition',
                      seleccionada
                        ? 'border-abacontex-primary-three bg-green-100 text-abacontex-dark'
                        : 'border-gray-300 bg-white hover:bg-abacontex-light',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex size-5 items-center justify-center rounded border',
                        seleccionada
                          ? 'border-abacontex-primary bg-abacontex-primary text-white'
                          : 'border-gray-300 bg-white',
                      ].join(' ')}
                    >
                      {seleccionada ? '✓' : ''}
                    </span>

                    {plantilla.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-md">
            <h2 className="text-base font-semibold">4. Resolución del docente</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setResolverAhora(true)}
                className={[
                  'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                  resolverAhora
                    ? 'border-abacontex-primary-three bg-white shadow-sm'
                    : 'border-transparent text-abacontex-gray-text',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex size-4 items-center justify-center rounded-full border',
                    resolverAhora ? 'border-abacontex-primary' : 'border-abacontex-gray-text',
                  ].join(' ')}
                >
                  {resolverAhora && <span className="size-2 rounded-full bg-abacontex-primary" />}
                </span>
                Resolver ahora
              </button>

              <button
                type="button"
                onClick={() => setResolverAhora(false)}
                className={[
                  'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                  !resolverAhora
                    ? 'border-gray-400 bg-white shadow-sm'
                    : 'border-transparent text-abacontex-gray-text',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex size-4 items-center justify-center rounded-full border',
                    !resolverAhora ? 'border-abacontex-primary' : 'border-abacontex-gray-text',
                  ].join(' ')}
                >
                  {!resolverAhora && <span className="size-2 rounded-full bg-abacontex-primary" />}
                </span>
                Resolver más tarde
              </button>
            </div>

            {!resolverAhora && (
              <p className="mt-3 text-xs text-abacontex-gray-text">
                Este ejercicio quedará como{' '}
                <span className="font-medium text-orange-500">“Sin resolver”</span> en Mis
                ejercicios hasta que subas tu propia resolución.
              </p>
            )}
          </section>
        </div>

        <aside className="xl:sticky xl:top-5">
          <div className="flex min-h-155 flex-col rounded-2xl bg-white p-5 shadow-md">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-sm font-semibold">Vista previa del ejercicio</h2>

              <button
                type="button"
                disabled={!enunciado}
                onClick={() => setEditandoEnunciado(true)}
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-abacontex-gray-text transition hover:bg-abacontex-light hover:text-abacontex-primary disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Editar enunciado"
              >
                <Pencil className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden py-4">
              {digitalizar.isPending ? (
                <div className="space-y-4">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />

                  <div className="space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-11/12 animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100" />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-gray-100" />
                  </div>

                  <div className="rounded-xl border border-gray-200 p-3">
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="h-7 animate-pulse rounded bg-gray-100" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-abacontex-primary-three/5 p-3">
                    <LoaderCircle className="size-5 animate-spin text-abacontex-primary" />

                    <div>
                      <p className="text-sm font-medium">Estamos interpretando el archivo</p>

                      <p className="mt-0.5 text-xs text-abacontex-gray-text">
                        Puede tardar unos segundos.
                      </p>
                    </div>
                  </div>
                </div>
              ) : enunciado ? (
                <div className="max-h-130 overflow-y-auto pr-2">
                  <MarkdownEjercicio contenido={enunciado} />
                </div>
              ) : (
                <div className="flex h-full min-h-80 items-center justify-center text-center">
                  <p className="max-w-xs text-sm text-abacontex-gray-text">
                    Cuando digitalices el archivo, el enunciado aparecerá acá.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-3 border-t border-gray-200 pt-4 text-xs">
              <div>
                <p className="font-medium">Curso</p>

                <p className="mt-1 text-abacontex-gray-text">{cursoSeleccionado?.nombre ?? '-'}</p>
              </div>

              <div>
                <p className="font-medium">Plantillas</p>

                <p className="mt-1 text-abacontex-gray-text">{plantillas.length}</p>
              </div>

              <div>
                <p className="font-medium">Fecha límite</p>

                <p className="mt-1 text-abacontex-gray-text">
                  {fechaLimite ? formatearFecha(fechaLimite) : '-'}
                </p>
              </div>

              <div>
                <p className="font-medium">Estado</p>

                <span className="mt-1 inline-flex rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-500">
                  Borrador
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {errorFormulario && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{errorFormulario}</p>
        </div>
      )}

      {crearEjercicio.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">No fue posible guardar el ejercicio.</p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
        <Link
          to={modoEdicion ? `/docente/ejercicios/${idEditar}` : '/docente/ejercicios'}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-semibold transition hover:bg-abacontex-light"
        >
          Cancelar
        </Link>

        <button
          type="button"
          disabled={
            !formularioListo ||
            digitalizar.isPending ||
            crearEjercicio.isPending ||
            editarEjercicio.isPending
          }
          onClick={() => guardarEjercicio('BORRADOR')}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-abacontex-primary-three px-5 text-sm font-semibold text-abacontex-primary transition hover:bg-abacontex-primary-three/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Guardar borrador
        </button>

        <button
          type="button"
          disabled={
            !formularioListo ||
            digitalizar.isPending ||
            crearEjercicio.isPending ||
            editarEjercicio.isPending
          }
          onClick={() => guardarEjercicio('ENVIADO')}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-abacontex-primary-three px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-abacontex-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {crearEjercicio.isPending || editarEjercicio.isPending
            ? 'Guardando...'
            : 'Enviar a alumnos'}
        </button>
      </div>

      <ModalEditarEnunciado
        abierto={editandoEnunciado}
        enunciado={enunciado}
        onCerrar={() => setEditandoEnunciado(false)}
        onGuardar={setEnunciado}
      />
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

function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split('-');

  return `${dia}/${mes}/${anio}`;
}

function convertirFechaLimiteAISO(fecha: string) {
  const [anio, mes, dia] = fecha.split('-').map(Number);

  const fechaLocal = new Date(anio, mes - 1, dia, 23, 59, 0);

  return fechaLocal.toISOString();
}

function convertirISOAFechaInput(fecha: string) {
  const valor = new Date(fecha);

  const anio = valor.getFullYear();
  const mes = String(valor.getMonth() + 1).padStart(2, '0');
  const dia = String(valor.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}
