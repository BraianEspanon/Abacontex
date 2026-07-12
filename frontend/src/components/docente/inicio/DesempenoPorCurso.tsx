import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const datosCursos = [
  {
    curso: '5to A',
    participacion: 75,
    desempeno: 72,
    empresas: 68,
  },
  {
    curso: '6to A',
    participacion: 78,
    desempeno: 81,
    empresas: 84,
  },
  {
    curso: '6to B',
    participacion: 71,
    desempeno: 75,
    empresas: 65,
  },
];

export default function DesempenoPorCurso() {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-[#20251f]">
        Participación y desempeño por curso
      </h3>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={datosCursos}
            margin={{
              top: 10,
              right: 5,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="curso" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 10 }} />

            <Bar
              dataKey="participacion"
              name="Participación"
              fill="#557650"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="desempeno"
              name="Desempeño promedio"
              fill="#9b8068"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="empresas"
              name="Empresas a tiempo"
              fill="#a9bba3"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}