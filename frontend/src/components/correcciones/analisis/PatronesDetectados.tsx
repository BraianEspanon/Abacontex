import { GitBranch } from 'lucide-react';

import type { AnalisisErroresCursoResponse } from '../../../types/analisisErrores.types';

type Patron = AnalisisErroresCursoResponse['patronesDetectados'][number];

interface Props {
  patrones: Patron[];
}

export default function PatronesDetectados({ patrones }: Props) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <GitBranch size={23} className="text-abacontex-primary" />

        <h2 className="font-heading text-lg font-semibold text-abacontex-black-text">
          Patrones detectados
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[450px] text-left text-xs">
          <thead className="bg-gray-50 text-slate-600">
            <tr>
              <th scope="col" className="px-3 py-2">
                #
              </th>

              <th scope="col" className="px-3 py-2">
                Error
              </th>

              <th scope="col" className="px-3 py-2">
                Ejercicios donde aparece
              </th>

              <th scope="col" className="px-3 py-2">
                Alumnos afectados
              </th>
            </tr>
          </thead>

          <tbody>
            {patrones.map((patron, index) => (
              <tr
                key={patron.tipoError}
                className={`border-b border-gray-100 last:border-0 ${
                  index === 0 ? 'bg-red-50/70' : ''
                }`}
              >
                <td className="px-3 py-2 font-semibold text-slate-600">{index + 1}</td>

                <td className="px-3 py-2 text-slate-700">{patron.label}</td>

                <td className="px-3 py-2 text-slate-700">
                  {patron.ejerciciosAfectados}{' '}
                  {patron.ejerciciosAfectados === 1 ? 'ejercicio' : 'ejercicios'}
                </td>

                <td className="px-3 py-2 text-slate-700">{patron.alumnosAfectados}</td>
              </tr>
            ))}

            {patrones.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                  No se detectaron patrones todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
