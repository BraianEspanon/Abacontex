import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const datosEvolucion = [
  {
    mes: 'Marzo',
    sextoII: 100,
    sextoIII: 50,
    quintoII: 55,
  },
  {
    mes: 'Abril',
    sextoII: 200,
    sextoIII: 100,
    quintoII: 100,
  },
  {
    mes: 'Mayo',
    sextoII: 200,
    sextoIII: 80,
    quintoII: 120,
  },
];

export default function GraficoEvolucion() {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-[#20251f]">
          Evolución del puntaje empresarial promedio
        </h3>

        <select
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#64895e]"
          defaultValue="3"
          aria-label="Periodo del gráfico"
        >
          <option value="3">Últimos 3 meses</option>
          <option value="6">Últimos 6 meses</option>
          <option value="12">Últimos 12 meses</option>
        </select>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={datosEvolucion}
            margin={{
              top: 10,
              right: 20,
              left: -15,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 250]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            <Line
              type="monotone"
              dataKey="sextoII"
              name="6to II"
              stroke="#8b7cf6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="sextoIII"
              name="6to III"
              stroke="#ed7e73"
              strokeWidth={2}
              dot={{ r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="quintoII"
              name="5to II"
              stroke="#69c5cf"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}