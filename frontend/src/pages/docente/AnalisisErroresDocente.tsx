import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronRight, Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import Button from '../../components/ui/Button';

import KpisAnalisisErrores from '../../components/correcciones/analisis/KpisAnalisisErrores';
import ErroresFrecuentes from '../../components/correcciones/analisis/ErroresFrecuentes';
import PatronesDetectados from '../../components/correcciones/analisis/PatronesDetectados';
import ResumenIaCurso from '../../components/correcciones/analisis/ResumenIaCurso';
import AlumnosMasAfectados from '../../components/correcciones/analisis/AlumnosMasAfectados';
import DistribucionErroresPlantilla from '../../components/correcciones/analisis/DistribucionErroresPlantilla';

import { obtenerFiltrosCorrecciones } from '../../api/correccion.api';
import { useAnalisisErroresCurso } from '../../hooks/useAnalisisErroresCurso';
import { useSugerirRefuerzoCurso } from '../../hooks/useSugerirRefuerzoCurso';

export default function AnalisisErroresDocente() {
  const [cursoId, setCursoId] = useState<number | null>(null);

  const filtros = useQuery({
    queryKey: ['correcciones', 'filtros'],
    queryFn: obtenerFiltrosCorrecciones,
  });

  const cursos = filtros.data?.cursos ?? [];

  const cursoSeleccionado =
    cursoId !== null && cursos.some((curso) => curso.idCurso === cursoId)
      ? cursoId
      : (cursos[0]?.idCurso ?? null);

  const analisis = useAnalisisErroresCurso(cursoSeleccionado);
  const generarIa = useSugerirRefuerzoCurso(cursoSeleccionado);

  const datos = analisis.data?.curso.idCurso === cursoSeleccionado ? analisis.data : undefined;

  const cambiarCurso = (nuevoCursoId: number) => {
    if (generarIa.isPending) return;

    setCursoId(nuevoCursoId);
    generarIa.reset();
  };

  return (
    <div className="space-y-5 p-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Ruta de navegación"
        className="flex flex-wrap items-center gap-3 text-sm text-abacontex-gray-text"
      >
        <Link to="/docente" aria-label="Ir al inicio">
          <Home size={19} />
        </Link>

        <ChevronRight size={15} />

        <Link to="/docente">Inicio</Link>

        <ChevronRight size={15} />

        <Link to="/docente/correcciones">Correcciones</Link>

        <ChevronRight size={15} />

        <span aria-current="page" className="font-semibold text-abacontex-black-text">
          Análisis de errores
        </span>
      </nav>

      {/* Encabezado */}
      <header>
        <h1 className="font-heading text-2xl font-semibold text-abacontex-black-text">
          Análisis de errores
        </h1>

        <p className="mt-1 text-sm text-abacontex-gray-text">
          Identificá dificultades frecuentes y oportunidades de refuerzo para tus estudiantes.
        </p>
      </header>

      {/* Error al cargar los cursos */}
      {filtros.isError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-3 text-sm text-red-700">No se pudieron cargar los cursos.</p>

          <Button
            type="button"
            label="Reintentar"
            variant="outline"
            onClick={() => void filtros.refetch()}
            className="!rounded-lg !px-4 !py-2 text-sm"
          />
        </div>
      )}

      {/* Cargando cursos */}
      {filtros.isPending && <p className="text-sm text-abacontex-gray-text">Cargando cursos...</p>}

      {/* Sin cursos */}
      {filtros.isSuccess && cursos.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-abacontex-gray-text">
            No tenés cursos asignados para analizar.
          </p>
        </div>
      )}

      {/* Cargando análisis */}
      {analisis.isPending && cursoSeleccionado !== null && (
        <div
          role="status"
          className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-abacontex-gray-text"
        >
          Cargando análisis de errores...
        </div>
      )}

      {/* Error al consultar el análisis */}
      {analisis.isError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={18} />
            No se pudo obtener el análisis del curso.
          </div>

          <Button
            type="button"
            label="Reintentar"
            variant="outline"
            onClick={() => void analisis.refetch()}
            className="!rounded-lg !px-4 !py-2 text-sm"
          />
        </div>
      )}

      {/* Contenido principal */}
      {datos && !analisis.isError && (
        <>
          {/* Indicadores */}
          <KpisAnalisisErrores kpis={datos.kpis} />

          {/* Selector de cursos */}
          <div
            role="group"
            aria-label="Seleccionar curso"
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-gray-300 bg-gray-100 p-1"
          >
            {cursos.map((curso) => {
              const seleccionado = cursoSeleccionado === curso.idCurso;

              return (
                <Button
                  key={curso.idCurso}
                  type="button"
                  label={curso.nombreCurso}
                  variant="solid"
                  aria-pressed={seleccionado}
                  disabled={generarIa.isPending}
                  onClick={() => cambiarCurso(curso.idCurso)}
                  className={
                    seleccionado
                      ? '!rounded-lg !bg-abacontex-primary !px-6 !py-2 text-sm !text-white'
                      : '!rounded-lg !bg-transparent !px-6 !py-2 text-sm !font-medium !text-abacontex-gray-text !shadow-none hover:!bg-white'
                  }
                />
              );
            })}
          </div>

          {/* Distribución de dos columnas */}
          <div className="grid items-start gap-4 xl:grid-cols-2">
            {/* Columna izquierda */}
            <div className="min-w-0 space-y-4">
              <ErroresFrecuentes errores={datos.erroresFrecuentes} />

              <PatronesDetectados patrones={datos.patronesDetectados} />
            </div>

            {/* Columna derecha */}
            <div className="min-w-0 space-y-4">
              <ResumenIaCurso
                diagnostico={datos.diagnosticoIa}
                controlIa={datos.controlIa}
                generando={generarIa.isPending}
                errorGeneracion={generarIa.isError}
                onGenerar={() => generarIa.mutate()}
              />

              <AlumnosMasAfectados alumnos={datos.alumnosMasAfectados} />
            </div>
          </div>

          {/* Distribución de errores por plantilla */}
          <DistribucionErroresPlantilla distribucion={datos.distribucionPlantillas} />
        </>
      )}

      {/* Selector de cursos mientras se carga el análisis */}
      {!datos && cursos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cursos.map((curso) => (
            <Button
              key={curso.idCurso}
              type="button"
              label={curso.nombreCurso}
              variant={cursoSeleccionado === curso.idCurso ? 'solid' : 'outline'}
              disabled={generarIa.isPending}
              onClick={() => cambiarCurso(curso.idCurso)}
              className="!rounded-lg !px-4 !py-2 text-sm"
            />
          ))}
        </div>
      )}
    </div>
  );
}
