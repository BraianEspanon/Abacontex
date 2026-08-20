import { CheckCircle2, Clock3, PackageCheck, Settings2 } from 'lucide-react';

import type { ResumenPedidos as ResumenPedidosType } from '../../types/pedido.types';

interface ResumenPedidosProps {
  resumen: ResumenPedidosType;
}

export default function ResumenPedidos({ resumen }: ResumenPedidosProps) {
  const tarjetas = [
    {
      titulo: 'Pedidos totales',
      valor: resumen.total,
      icono: PackageCheck,
    },
    {
      titulo: 'Pendientes',
      valor: resumen.pendientes,
      icono: Clock3,
    },
    {
      titulo: 'En producción',
      valor: resumen.enProduccion,
      icono: Settings2,
    },
    {
      titulo: 'Listos para entregar',
      valor: resumen.listosParaEntregar,
      icono: CheckCircle2,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {tarjetas.map(({ titulo, valor, icono: Icono }) => (
        <article key={titulo} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{titulo}</p>

              <p className="mt-2 text-3xl font-semibold text-gray-900">{valor}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
              <Icono className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
