interface ProgresoConversacionSimulacionProps {
  eventoActual: number;
  totalEventos: number;
  porcentaje: number;
}

export default function ProgresoConversacionSimulacion({
  eventoActual,
  totalEventos,
  porcentaje,
}: ProgresoConversacionSimulacionProps) {
  const cantidadSegmentos = totalEventos > 0 ? totalEventos : 1;

  return (
    <section className="rounded-2xl bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold text-abacontex-black-text">Progreso de la simulación</h2>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span>
          {eventoActual} de {totalEventos} eventos
        </span>

        <span className="font-medium">{Math.round(porcentaje)}%</span>
      </div>

      <div className="mt-2 flex gap-1">
        {Array.from({ length: cantidadSegmentos }, (_, index) => {
          const completado = index < eventoActual;

          return (
            <div
              key={index}
              className={[
                'h-1.5 flex-1 rounded-full',
                completado ? 'bg-abacontex-primary-three' : 'bg-gray-200',
              ].join(' ')}
            />
          );
        })}
      </div>
    </section>
  );
}
