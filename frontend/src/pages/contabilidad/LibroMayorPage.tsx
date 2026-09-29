import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

import CardLibroMayor from '../../components/contabilidad/CardLibroMayor';
import NavegacionContabilidad from '../../components/contabilidad/NavegacionContabilidad';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useLibroMayor } from '../../hooks/useLibroMayor';

export default function LibroMayorPage() {
  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  const {
    data: cuentas,
    isLoading: cargandoLibroMayor,
    isError: errorLibroMayor,
    refetch: refetchLibroMayor,
  } = useLibroMayor(tieneEmpresa);

  if (cargandoAlumno) {
    return <EstadoCarga mensaje="Cargando información contable..." />;
  }

  if (errorAlumno || !alumno) {
    return (
      <EstadoError
        titulo="No fue posible cargar tus datos"
        descripcion="Ocurrió un problema al consultar la información del alumno."
        onReintentar={() => void refetchAlumno()}
      />
    );
  }

  if (!tieneEmpresa) {
    return (
      <EstadoError
        titulo="Todavía no pertenecés a una empresa"
        descripcion="Para utilizar el módulo de Contabilidad primero tenés que formar parte de una empresa."
        mostrarReintentar={false}
      />
    );
  }

  if (cargandoLibroMayor) {
    return <EstadoCarga mensaje="Cargando Libro Mayor..." />;
  }

  if (errorLibroMayor || !cuentas) {
    return (
      <EstadoError
        titulo="No fue posible cargar el Libro Mayor"
        descripcion="Ocurrió un problema al consultar los movimientos contables."
        onReintentar={() => void refetchLibroMayor()}
      />
    );
  }

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          to="/alumno"
          className="inline-flex items-center gap-1.5 text-abacontex-gray-text transition hover:text-abacontex-black-text"
        >
          <Home className="size-4 shrink-0" />
          <span>Inicio</span>
        </Link>

        <ChevronRight className="size-4 shrink-0 text-abacontex-gray-text" />

        <Link
          to="/alumno/contabilidad"
          className="text-abacontex-gray-text transition hover:text-abacontex-black-text"
        >
          Gestión contable
        </Link>

        <ChevronRight className="size-4 shrink-0 text-abacontex-gray-text" />

        <span className="font-semibold text-abacontex-black-text">Libro mayor</span>
      </nav>

      {/* Encabezado */}
      <header>
        <h1 className="text-2xl font-semibold text-abacontex-black-text">Contabilidad</h1>

        <p className="mt-1 text-sm text-abacontex-gray-text">
          Consultá los movimientos acumulados por cuenta contable.
        </p>
      </header>

      {/* Navegación */}
      <NavegacionContabilidad activa="LIBRO_MAYOR" />

      {/* Contenido */}
      {cuentas.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
          <p className="font-medium text-abacontex-black-text">
            Todavía no hay movimientos para mostrar.
          </p>

          <p className="mt-1 text-sm text-abacontex-gray-text">
            Los movimientos aparecerán cuando se registren asientos en el Libro Diario.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cuentas.map((cuenta) => (
              <CardLibroMayor key={cuenta.cuentaId} cuenta={cuenta} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EstadoCarga({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex min-h-75 items-center justify-center">
      <p className="text-sm font-medium text-abacontex-gray-text">{mensaje}</p>
    </div>
  );
}

interface EstadoErrorProps {
  titulo: string;
  descripcion: string;
  onReintentar?: () => void;
  mostrarReintentar?: boolean;
}

function EstadoError({
  titulo,
  descripcion,
  onReintentar,
  mostrarReintentar = true,
}: EstadoErrorProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 font-sans">
      <h2 className="font-semibold text-red-800">{titulo}</h2>

      <p className="mt-1 text-sm text-red-700">{descripcion}</p>

      {mostrarReintentar && onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="mt-4 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
