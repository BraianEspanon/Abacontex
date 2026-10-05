import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface ProgresoEntregasProps {
  totalAlumnos: number;
  entregados: number;
  corregidos: number;
  pendientesCorreccion: number;
  sinEntregar: number;
}

interface TooltipPayload {
  name?: string;
  value?: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload?: TooltipPayload;
  }>;
}

const COLORES = ['#3A5137', '#91C8A8', '#EAB308', '#D1D5DB'];

function TooltipProgreso({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const dato = payload[0]?.payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-abacontex-black-text">{dato?.name}</p>

      <p className="mt-0.5 text-xs text-abacontex-gray-text">{dato?.value} alumnos</p>
    </div>
  );
}

export default function ProgresoEntregas({
  totalAlumnos,
  entregados,
  corregidos,
  pendientesCorreccion,
  sinEntregar,
}: ProgresoEntregasProps) {
  const porcentaje = (cantidad: number) => {
    if (!totalAlumnos) {
      return 0;
    }

    return Math.round((cantidad / totalAlumnos) * 100);
  };

  /*
   * Para el donut mostramos entregados vs. sin entregar.
   * Corregidos y pendientes son subconjuntos de los entregados,
   * por eso no deben sumarse como porciones independientes.
   */
  const datosGrafico = [
    {
      name: 'Entregados',
      value: entregados,
    },
    {
      name: 'Sin entregar',
      value: sinEntregar,
    },
  ];

  const referencias = [
    {
      nombre: 'Entregados',
      cantidad: entregados,
      porcentaje: porcentaje(entregados),
      color: COLORES[0],
    },
    {
      nombre: 'Corregidos',
      cantidad: corregidos,
      porcentaje: porcentaje(corregidos),
      color: COLORES[1],
    },
    {
      nombre: 'Pendientes de corrección',
      cantidad: pendientesCorreccion,
      porcentaje: porcentaje(pendientesCorreccion),
      color: COLORES[2],
    },
    {
      nombre: 'Sin entregar',
      cantidad: sinEntregar,
      porcentaje: porcentaje(sinEntregar),
      color: COLORES[3],
    },
  ];

  return (
    <div className="grid items-center gap-6 md:grid-cols-[180px_1fr]">
      <div className="relative mx-auto size-40 transition-transform duration-300 hover:scale-[1.03]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datosGrafico}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2}
              strokeWidth={0}
              animationDuration={800}
            >
              <Cell fill={COLORES[0]} />
              <Cell fill={COLORES[3]} />
            </Pie>

            <Tooltip content={<TooltipProgreso />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-abacontex-black-text">{totalAlumnos}</span>

          <span className="text-xs text-abacontex-gray-text">alumnos</span>
        </div>
      </div>

      <div className="space-y-2">
        {referencias.map((item) => (
          <div
            key={item.nombre}
            className="group grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-lg px-2 py-1.5 transition hover:bg-abacontex-light"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full transition-transform duration-200 group-hover:scale-125"
                style={{ backgroundColor: item.color }}
              />

              <span className="text-sm text-abacontex-gray-text">{item.nombre}</span>
            </div>

            <span className="text-sm font-semibold text-abacontex-black-text">{item.cantidad}</span>

            <span className="w-10 text-right text-sm text-abacontex-gray-text">
              {item.porcentaje}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
