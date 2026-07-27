import { ChevronRight, GraduationCap, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CursoDocenteResumen } from '../../../types/docente.types';

interface CursosAsignadosDocenteProps {
  cursos: CursoDocenteResumen[];
}

export default function CursosAsignadosDocente({ cursos }: CursosAsignadosDocenteProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
        <h2 className="font-semibold text-abacontex-dark">Cursos asignados</h2>

        <span className="rounded-md bg-abacontex-primary-three px-3 py-1 text-xs font-semibold text-white">
          {cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}
        </span>
      </header>

      {cursos.length > 0 ? (
        <div>
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="flex min-h-[72px] items-center justify-between border-b border-gray-200 px-5 py-2.5 last:border-b-0"
            >
              <div className="flex items-center">
                <div className="flex h-14 min-w-14 items-center justify-center rounded-md bg-abacontex-primary-three px-2 text-center text-sm font-semibold leading-tight text-white shadow-sm">
                  {curso.nombre}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-abacontex-primary-two">
                  <UsersRound size={18} />
                </div>

                <div className="min-w-10 text-center">
                  <p className="text-xl font-semibold leading-none text-abacontex-dark">
                    {curso.alumnos}
                  </p>

                  <p className="mt-1 text-[11px] text-abacontex-gray-text">
                    {curso.alumnos === 1 ? 'alumno' : 'alumnos'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center px-6 py-9 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-abacontex-primary-two">
            <GraduationCap size={24} />
          </div>

          <p className="mt-3 font-medium text-abacontex-black-text">No hay cursos asignados</p>

          <p className="mt-1 max-w-xs text-sm text-abacontex-gray-text">
            Los cursos asignados aparecerán cuando estén disponibles.
          </p>
        </div>
      )}

      <footer className="border-t border-gray-200 px-5 py-3">
        <Link
          to="/docente/cursos"
          className="flex items-center justify-center gap-1 text-sm font-medium text-abacontex-primary-two transition hover:text-abacontex-primary"
        >
          Ver todos mis cursos
          <ChevronRight size={16} />
        </Link>
      </footer>
    </section>
  );
}
