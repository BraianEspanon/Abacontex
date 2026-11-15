import { UsersRound } from 'lucide-react';

import type { AnalisisErroresCursoResponse } from '../../../types/analisisErrores.types';

type Alumno = AnalisisErroresCursoResponse['alumnosMasAfectados'][number];

interface Props {
  alumnos: Alumno[];
}

function obtenerIniciales(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

export default function AlumnosMasAfectados({ alumnos }: Props) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <UsersRound size={23} className="text-abacontex-primary" />

        <h2 className="font-heading text-lg font-semibold text-abacontex-black-text">
          Alumnos más afectados
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[430px] text-left text-xs">
          <thead className="bg-gray-50 text-slate-600">
            <tr>
              <th scope="col" className="px-3 py-2">
                #
              </th>

              <th scope="col" className="px-3 py-2">
                Alumno
              </th>

              <th scope="col" className="px-3 py-2 text-center">
                Errores
              </th>

              <th scope="col" className="px-3 py-2 text-center">
                Ejercicios con error
              </th>
            </tr>
          </thead>

          <tbody>
            {alumnos.map((alumno, index) => (
              <tr key={alumno.idAlumno} className="border-b border-gray-100 last:border-0">
                <td className="px-3 py-2 font-medium text-slate-600">{index + 1}</td>

                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                      {obtenerIniciales(alumno.nombre, alumno.apellido)}
                    </span>

                    <span className="font-medium text-slate-700">
                      {alumno.nombre} {alumno.apellido}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-2 text-center">
                  <span className="inline-flex min-w-8 justify-center rounded-full bg-red-100 px-2 py-1 font-semibold text-red-600">
                    {alumno.totalErrores}
                  </span>
                </td>

                <td className="px-3 py-2 text-center text-slate-700">
                  {alumno.ejerciciosConErrores}
                </td>
              </tr>
            ))}

            {alumnos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                  No hay alumnos con errores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
