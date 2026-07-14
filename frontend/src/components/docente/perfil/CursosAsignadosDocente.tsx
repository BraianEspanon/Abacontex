import { ChevronRight, GraduationCap, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CursoAsignado } from '../../../types/usuario.types';

interface CursosAsignadosDocenteProps {
  cursos: CursoAsignado[];
}

export default function CursosAsignadosDocente({
  cursos,
}: CursosAsignadosDocenteProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="font-semibold text-gray-900">Cursos asignados</h2>

        <span className="rounded-md bg-[#668b61] px-3 py-1 text-xs font-semibold text-white">
          {cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}
        </span>
      </header>

      {cursos.length > 0 ? (
        <div>
          {cursos.map((curso) => (
            <div
              key={curso.idCurso}
              className="flex items-center justify-between border-b border-gray-100 px-6 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 min-w-14 items-center justify-center rounded-lg bg-[#668b61] px-3 text-center text-sm font-semibold text-white">
                  {curso.nombreCurso}
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2ea] text-[#668b61]">
                  <UsersRound size={18} />
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {curso.cantidadAlumnos ?? '—'}
                  </p>
                  <p className="text-xs text-gray-500">alumnos</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf2ea] text-[#668b61]">
            <GraduationCap size={24} />
          </div>

          <p className="mt-3 font-medium text-gray-800">
            No hay cursos disponibles
          </p>

          <p className="mt-1 max-w-xs text-sm text-gray-500">
            Los cursos asignados aparecerán cuando estén disponibles desde el
            backend.
          </p>
        </div>
      )}

      <footer className="border-t border-gray-200 px-6 py-3">
        <Link
          to="/docente/cursos"
          className="flex items-center justify-center gap-1 text-sm font-medium text-[#587554] transition hover:text-[#3f583d]"
        >
          Ver todos mis cursos
          <ChevronRight size={16} />
        </Link>
      </footer>
    </section>
  );
}