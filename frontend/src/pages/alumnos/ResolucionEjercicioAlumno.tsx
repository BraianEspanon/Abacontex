import {
  ArrowLeft,
  Check,
  ChevronRight,
  ExternalLink,
  FileText,
  Home,
  Save,
  X,
} from 'lucide-react';

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import HojaTrabajoEditor from '../../components/ejercicios/resolucion/HojaTrabajoEditor';
import LibroDiarioEditor from '../../components/ejercicios/resolucion/LibroDiarioEditor';
import LibroIvaEditor from '../../components/ejercicios/resolucion/LibroIvaEditor';
import LibroMayorEditor from '../../components/ejercicios/resolucion/LibroMayorEditor';
import MarkdownEjercicio from '../../components/ejercicios/MarkdownEjercicio';
import Button from '../../components/ui/Button';

import { useGuardarPlantillaAlumno } from '../../hooks/useGuardarPlantillaAlumno';
import { useResolucionAlumno } from '../../hooks/useResolucionAlumno';

import type {
  ContenidoHojaTrabajo,
  ContenidoLibroDiario,
  ContenidoLibroIva,
  ContenidoLibroMayor,
  TipoPlantillaEjercicio,
} from '../../types/ejercicio.types';

import type {
  PlantillaResolucionAlumno,
  ResolucionAlumnoResponse,
} from '../../types/entrega.types';

const NOMBRES_PLANTILLAS: Record<TipoPlantillaEjercicio, string> = {
  LIBRO_DIARIO: 'Libro diario',
  HOJA_TRABAJO: 'Hoja de trabajo',
  LIBRO_IVA: 'Libro IVA',
  LIBRO_MAYOR: 'Libro mayor',
};

export default function ResolucionEjercicioAlumno() {
  const { id } = useParams();

  const idEjercicio = id ? Number(id) : undefined;

  const { data, isLoading, isError, refetch } = useResolucionAlumno(idEjercicio);

  if (!idEjercicio || Number.isNaN(idEjercicio)) {
    return <p className="text-sm text-red-600">El identificador del ejercicio no es válido.</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-abacontex-gray-text">Cargando resolución...</p>;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">
          No fue posible cargar la resolución del ejercicio.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-2 cursor-pointer text-sm font-semibold text-red-700 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return <ContenidoResolucionAlumno key={data.idEntrega} resolucion={data} />;
}

interface ContenidoResolucionAlumnoProps {
  resolucion: ResolucionAlumnoResponse;
}

function ContenidoResolucionAlumno({ resolucion }: ContenidoResolucionAlumnoProps) {
  const navigate = useNavigate();

  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoPlantillaEjercicio | null>(
    resolucion.plantillas[0]?.tipo ?? null
  );

  const [enunciadoAbierto, setEnunciadoAbierto] = useState(false);

  const totalPlantillas = resolucion.plantillas.length;

  const completadas = resolucion.plantillas.filter(
    (plantilla) => plantilla.estado === 'COMPLETADA'
  ).length;

  const porcentaje = totalPlantillas > 0 ? (completadas / totalPlantillas) * 100 : 0;

  const plantillaActiva =
    resolucion.plantillas.find((plantilla) => plantilla.tipo === tipoSeleccionado) ??
    resolucion.plantillas[0];

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-abacontex-gray-text">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-abacontex-dark">
          <Home className="size-4" />
          Inicio
        </Link>

        <ChevronRight className="size-4" />

        <Link to="/alumno/ejercicios" className="transition hover:text-abacontex-dark">
          Mis ejercicios
        </Link>

        <ChevronRight className="size-4" />

        <Link
          to={`/alumno/ejercicios/${resolucion.idEjercicio}`}
          className="transition hover:text-abacontex-dark"
        >
          Detalle
        </Link>

        <ChevronRight className="size-4" />

        <span className="font-semibold text-abacontex-dark">
          {resolucion.bloqueado ? 'Ver resolución' : 'Resolver ejercicio'}
        </span>
      </nav>

      {/* Encabezado */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-abacontex-dark">{resolucion.titulo}</h1>

          {!resolucion.bloqueado && (
            <p className="mt-3 text-sm text-abacontex-gray-text">
              Completá la resolución del ejercicio utilizando las plantillas contables.
            </p>
          )}

          {resolucion.bloqueado && (
            <p className="mt-3 text-sm text-abacontex-gray-text">
              Esta resolución ya fue entregada y se encuentra disponible únicamente para consulta.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-white px-4">
            <div>
              <p className="text-xs text-abacontex-gray-text">Fecha límite</p>

              <p className="text-sm font-medium text-abacontex-dark">
                {formatearFecha(resolucion.fechaLimite)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEnunciadoAbierto(true)}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-abacontex-dark transition hover:bg-abacontex-light"
          >
            Ver enunciado completo
            <ExternalLink className="size-4" />
          </button>
        </div>
      </div>

      {/* Progreso */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-3">
          <FileText className="size-5 text-abacontex-primary" />

          <h2 className="font-semibold text-abacontex-dark">Progreso de resolución</h2>
        </div>

        <div className="flex flex-col gap-5 px-5 py-4 lg:flex-row lg:items-center">
          <div className="min-w-56 lg:w-72">
            <p className="mb-2 text-xs text-abacontex-gray-text">
              {completadas} de {totalPlantillas} plantillas completadas
            </p>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-abacontex-primary-three transition-all duration-300"
                style={{
                  width: `${porcentaje}%`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-wrap gap-x-7 gap-y-3">
            {resolucion.plantillas.map((plantilla) => (
              <EstadoPlantilla key={plantilla.idEjercicioPlantilla} plantilla={plantilla} />
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-gray-300">
        <div className="flex gap-6 overflow-x-auto">
          {resolucion.plantillas.map((plantilla) => {
            const activa = plantilla.tipo === plantillaActiva?.tipo;

            return (
              <button
                key={plantilla.idEjercicioPlantilla}
                type="button"
                onClick={() => setTipoSeleccionado(plantilla.tipo)}
                className={[
                  'cursor-pointer whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium transition',
                  activa
                    ? 'border-abacontex-primary-three font-semibold text-abacontex-primary'
                    : 'border-transparent text-abacontex-gray-text hover:text-abacontex-dark',
                ].join(' ')}
              >
                {NOMBRES_PLANTILLAS[plantilla.tipo]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      {plantillaActiva && (
        <section className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <EditorPlantillaAlumno
            key={`${plantillaActiva.idEjercicioPlantilla}-${plantillaActiva.tipo}`}
            idEjercicio={resolucion.idEjercicio}
            plantilla={plantillaActiva}
            bloqueado={resolucion.bloqueado}
          />
        </section>
      )}

      {/* Volver */}
      <div className="flex border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => navigate(`/alumno/ejercicios/${resolucion.idEjercicio}`)}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-abacontex-dark transition hover:bg-abacontex-light"
        >
          <ArrowLeft className="size-4" />
          Volver al detalle
        </button>
      </div>

      {/* Modal enunciado */}
      {enunciadoAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={() => setEnunciadoAbierto(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <p className="text-sm text-abacontex-gray-text">Enunciado del ejercicio</p>

                <h2 className="mt-1 text-lg font-semibold text-abacontex-dark">
                  {resolucion.titulo}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEnunciadoAbierto(false)}
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-abacontex-gray-text transition hover:bg-abacontex-light hover:text-abacontex-dark"
                aria-label="Cerrar enunciado"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <MarkdownEjercicio contenido={resolucion.enunciado} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface EstadoPlantillaProps {
  plantilla: PlantillaResolucionAlumno;
}

function EstadoPlantilla({ plantilla }: EstadoPlantillaProps) {
  const completada = plantilla.estado === 'COMPLETADA';

  const enEdicion = plantilla.estado === 'EN_EDICION';

  return (
    <div className="flex min-w-28 items-start gap-2">
      <span
        className={[
          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
          completada
            ? 'border-abacontex-primary-three bg-abacontex-primary-three'
            : enEdicion
              ? 'border-abacontex-primary-three'
              : 'border-gray-400',
        ].join(' ')}
      >
        {completada && <Check className="size-3 text-white" />}

        {enEdicion && <span className="size-2 rounded-full bg-abacontex-primary-three" />}
      </span>

      <div>
        <p className="whitespace-nowrap text-xs font-medium text-abacontex-dark">
          {NOMBRES_PLANTILLAS[plantilla.tipo]}
        </p>

        <p
          className={[
            'mt-1 text-xs',
            completada
              ? 'text-abacontex-primary'
              : enEdicion
                ? 'text-abacontex-gray-text'
                : 'text-gray-400',
          ].join(' ')}
        >
          {completada ? 'Resuelto' : enEdicion ? 'En edición' : 'Pendiente'}
        </p>
      </div>
    </div>
  );
}

interface EditorPlantillaAlumnoProps {
  idEjercicio: number;
  plantilla: PlantillaResolucionAlumno;
  bloqueado: boolean;
}

function EditorPlantillaAlumno({ idEjercicio, plantilla, bloqueado }: EditorPlantillaAlumnoProps) {
  if (plantilla.tipo === 'LIBRO_DIARIO') {
    return (
      <ResolucionLibroDiarioAlumno
        idEjercicio={idEjercicio}
        plantilla={plantilla}
        bloqueado={bloqueado}
      />
    );
  }

  if (plantilla.tipo === 'LIBRO_MAYOR') {
    return (
      <ResolucionLibroMayorAlumno
        idEjercicio={idEjercicio}
        plantilla={plantilla}
        bloqueado={bloqueado}
      />
    );
  }

  if (plantilla.tipo === 'LIBRO_IVA') {
    return (
      <ResolucionLibroIvaAlumno
        idEjercicio={idEjercicio}
        plantilla={plantilla}
        bloqueado={bloqueado}
      />
    );
  }

  return (
    <ResolucionHojaTrabajoAlumno
      idEjercicio={idEjercicio}
      plantilla={plantilla}
      bloqueado={bloqueado}
    />
  );
}

interface ResolucionPlantillaProps {
  idEjercicio: number;
  plantilla: PlantillaResolucionAlumno;
  bloqueado: boolean;
}

/* ============================================================
   LIBRO DIARIO
============================================================ */

function ResolucionLibroDiarioAlumno({
  idEjercicio,
  plantilla,
  bloqueado,
}: ResolucionPlantillaProps) {
  const guardar = useGuardarPlantillaAlumno();

  const [contenido, setContenido] = useState<ContenidoLibroDiario>(
    (plantilla.contenido as ContenidoLibroDiario | null) ?? {
      asientos: [],
    }
  );

  const [hayCambios, setHayCambios] = useState(false);

  const puedeCompletar = contenido.asientos.some(
    (asiento) =>
      asiento.fecha.trim() !== '' || asiento.concepto.trim() !== '' || asiento.lineas.length > 0
  );

  const cambiarContenido = (nuevoContenido: ContenidoLibroDiario) => {
    setContenido(nuevoContenido);
    setHayCambios(true);
  };

  const guardarPlantilla = async (estado: 'EN_EDICION' | 'COMPLETADA') => {
    await guardar.mutateAsync({
      idEjercicio,
      datos: {
        tipo: 'LIBRO_DIARIO',
        estado,
        contenido,
      },
    });

    setHayCambios(false);
  };

  return (
    <ContenedorEditor
      bloqueado={bloqueado}
      hayCambios={hayCambios}
      puedeCompletar={puedeCompletar}
      guardando={guardar.isPending}
      estado={plantilla.estado}
      onGuardar={() => void guardarPlantilla('EN_EDICION')}
      onCompletar={() => void guardarPlantilla('COMPLETADA')}
    >
      <LibroDiarioEditor
        contenido={contenido}
        onChange={cambiarContenido}
        mostrarEstadoBalance={false}
      />
    </ContenedorEditor>
  );
}

/* ============================================================
   LIBRO MAYOR
============================================================ */

function ResolucionLibroMayorAlumno({
  idEjercicio,
  plantilla,
  bloqueado,
}: ResolucionPlantillaProps) {
  const guardar = useGuardarPlantillaAlumno();

  const [contenido, setContenido] = useState<ContenidoLibroMayor>(
    (plantilla.contenido as ContenidoLibroMayor | null) ?? {
      cuentas: [],
    }
  );

  const [hayCambios, setHayCambios] = useState(false);

  const puedeCompletar = contenido.cuentas.length > 0;

  const cambiarContenido = (nuevoContenido: ContenidoLibroMayor) => {
    setContenido(nuevoContenido);
    setHayCambios(true);
  };

  const guardarPlantilla = async (estado: 'EN_EDICION' | 'COMPLETADA') => {
    await guardar.mutateAsync({
      idEjercicio,
      datos: {
        tipo: 'LIBRO_MAYOR',
        estado,
        contenido,
      },
    });

    setHayCambios(false);
  };

  return (
    <ContenedorEditor
      bloqueado={bloqueado}
      hayCambios={hayCambios}
      puedeCompletar={puedeCompletar}
      guardando={guardar.isPending}
      estado={plantilla.estado}
      onGuardar={() => void guardarPlantilla('EN_EDICION')}
      onCompletar={() => void guardarPlantilla('COMPLETADA')}
    >
      <LibroMayorEditor contenido={contenido} onChange={cambiarContenido} />
    </ContenedorEditor>
  );
}

/* ============================================================
   LIBRO IVA
============================================================ */

function ResolucionLibroIvaAlumno({ idEjercicio, plantilla, bloqueado }: ResolucionPlantillaProps) {
  const guardar = useGuardarPlantillaAlumno();

  const [contenido, setContenido] = useState<ContenidoLibroIva>(
    (plantilla.contenido as ContenidoLibroIva | null) ?? {
      compras: [],
      ventas: [],
      resultado: null,
    }
  );

  const [hayCambios, setHayCambios] = useState(false);

  const puedeCompletar = contenido.compras.length > 0 || contenido.ventas.length > 0;

  const cambiarContenido = (nuevoContenido: ContenidoLibroIva) => {
    setContenido(nuevoContenido);
    setHayCambios(true);
  };

  const guardarPlantilla = async (estado: 'EN_EDICION' | 'COMPLETADA') => {
    await guardar.mutateAsync({
      idEjercicio,
      datos: {
        tipo: 'LIBRO_IVA',
        estado,
        contenido,
      },
    });

    setHayCambios(false);
  };

  return (
    <ContenedorEditor
      bloqueado={bloqueado}
      hayCambios={hayCambios}
      puedeCompletar={puedeCompletar}
      guardando={guardar.isPending}
      estado={plantilla.estado}
      onGuardar={() => void guardarPlantilla('EN_EDICION')}
      onCompletar={() => void guardarPlantilla('COMPLETADA')}
    >
      <LibroIvaEditor contenido={contenido} onChange={cambiarContenido} />
    </ContenedorEditor>
  );
}

/* ============================================================
   HOJA DE TRABAJO
============================================================ */

function ResolucionHojaTrabajoAlumno({
  idEjercicio,
  plantilla,
  bloqueado,
}: ResolucionPlantillaProps) {
  const guardar = useGuardarPlantillaAlumno();

  const [contenido, setContenido] = useState<ContenidoHojaTrabajo>(
    (plantilla.contenido as ContenidoHojaTrabajo | null) ?? {
      filas: [],
    }
  );

  const [hayCambios, setHayCambios] = useState(false);

  const puedeCompletar = contenido.filas.length > 0;

  const cambiarContenido = (nuevoContenido: ContenidoHojaTrabajo) => {
    setContenido(nuevoContenido);
    setHayCambios(true);
  };

  const guardarPlantilla = async (estado: 'EN_EDICION' | 'COMPLETADA') => {
    await guardar.mutateAsync({
      idEjercicio,
      datos: {
        tipo: 'HOJA_TRABAJO',
        estado,
        contenido,
      },
    });

    setHayCambios(false);
  };

  return (
    <ContenedorEditor
      bloqueado={bloqueado}
      hayCambios={hayCambios}
      puedeCompletar={puedeCompletar}
      guardando={guardar.isPending}
      estado={plantilla.estado}
      onGuardar={() => void guardarPlantilla('EN_EDICION')}
      onCompletar={() => void guardarPlantilla('COMPLETADA')}
    >
      <HojaTrabajoEditor contenido={contenido} onChange={cambiarContenido} />
    </ContenedorEditor>
  );
}

/* ============================================================
   BOTONES COMUNES
============================================================ */

interface ContenedorEditorProps {
  bloqueado: boolean;
  hayCambios: boolean;
  guardando: boolean;
  puedeCompletar: boolean;
  estado: PlantillaResolucionAlumno['estado'];
  onGuardar: () => void;
  onCompletar: () => void;
  children: React.ReactNode;
}

function ContenedorEditor({
  bloqueado,
  hayCambios,
  guardando,
  puedeCompletar,
  estado,
  onGuardar,
  onCompletar,
  children,
}: ContenedorEditorProps) {
  const puedeGuardarBorrador = hayCambios && !guardando;

  const puedeGuardarComoResuelto =
    puedeCompletar && !guardando && (estado !== 'COMPLETADA' || hayCambios);

  return (
    <div className="space-y-5">
      <div>{children}</div>

      {!bloqueado && (
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            label="Guardar borrador"
            icon={<Save size={16} />}
            disabled={!puedeGuardarBorrador}
            onClick={onGuardar}
            className="h-10! rounded-lg! border-gray-300! px-5! py-0! text-sm! font-semibold! text-abacontex-dark! hover:bg-abacontex-light!"
          />

          <Button
            type="button"
            variant="solid"
            label={estado === 'COMPLETADA' ? 'Guardar como resuelto' : 'Marcar como resuelto'}
            icon={<Check size={16} />}
            disabled={!puedeGuardarComoResuelto}
            onClick={onCompletar}
            className="h-10! rounded-lg! px-5! py-0! text-sm! font-semibold!"
          />
        </div>
      )}

      {bloqueado && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-abacontex-primary">
            Esta resolución ya fue entregada y no puede modificarse.
          </p>
        </div>
      )}
    </div>
  );
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
}
