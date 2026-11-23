import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface PuntajeCircularSimulacionProps {
  puntaje: number;
}

const COLORES = {
  puntaje: '#3A5137',
  restante: '#E5E7EB',
};

export default function PuntajeCircularSimulacion({ puntaje }: PuntajeCircularSimulacionProps) {
  const valor = Math.max(0, Math.min(100, puntaje));

  const datos = [
    {
      name: 'Puntaje',
      value: valor,
    },
    {
      name: 'Restante',
      value: 100 - valor,
    },
  ];

  return (
    <div className="relative mx-auto size-40 shrink-0 transition-transform duration-300 hover:scale-[1.03]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={datos}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={72}
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
            animationDuration={800}
          >
            <Cell fill={COLORES.puntaje} />
            <Cell fill={COLORES.restante} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-abacontex-primary">
          {Math.round(valor)} / 100
        </span>
      </div>
    </div>
  );
}
