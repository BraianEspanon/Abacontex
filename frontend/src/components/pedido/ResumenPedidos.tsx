import { ArchiveRestore, Box, DollarSign, PackageX } from 'lucide-react';

import type { ResumenPedidos as ResumenPedidosType } from '../../types/pedido.types';

interface ResumenPedidosProps {
  resumen: ResumenPedidosType;
}

export default function ResumenPedidos({ resumen }: ResumenPedidosProps) {
  const tarjetas = [
    {
      titulo: 'Pedidos totales',
      valor: resumen.total,
      descripcion: 'Todos los pedidos',
      icono: Box,
      clasesIcono: 'bg-[#eef4eb] text-[#496647]',
      clasesValor: 'text-gray-900',
    },
    {
      titulo: 'Pendientes',
      valor: resumen.pendientes,
      descripcion: 'En espera de producción',
      icono: ArchiveRestore,
      clasesIcono: 'bg-[#eef4eb] text-[#496647]',
      clasesValor: 'text-gray-900',
    },
    {
      titulo: 'En producción',
      valor: resumen.enProduccion,
      descripcion: 'Órdenes activas',
      icono: PackageX,
      clasesIcono: 'bg-red-50 text-red-500',
      clasesValor: 'text-red-500',
    },
    {
      titulo: 'Terminados',
      valor: resumen.listosParaEntregar,
      descripcion: 'Listos para entregar',
      icono: DollarSign,
      clasesIcono: 'bg-gray-100 text-[#496647]',
      clasesValor: 'text-[#6f9468]',
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {tarjetas.map(({ titulo, valor, descripcion, icono: Icono, clasesIcono, clasesValor }) => (
        <article key={titulo} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Ícono */}
            <div
              className={[
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                clasesIcono,
              ].join(' ')}
            >
              <Icono className="h-6 w-6" strokeWidth={2} />
            </div>

            {/* Información */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{titulo}</p>

              <p className={['mt-1 text-2xl font-semibold leading-none', clasesValor].join(' ')}>
                {valor}
              </p>

              <p className="mt-2 text-sm text-gray-500">{descripcion}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
