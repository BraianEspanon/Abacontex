import { ShoppingBag, Clock, Package, CheckCircle } from 'lucide-react';
import type { PedidoListado } from '../../types/pedido.types';

interface ResumenPedidosProps {
  pedidos: PedidoListado[];
}

export default function ResumenPedidos({ pedidos }: ResumenPedidosProps) {
  const totalPedidos = pedidos.length;
  const pendientes = pedidos.filter((p) => p.estado === 'PENDIENTE').length;
  const enPreparacion = pedidos.filter((p) => p.estado === 'EN_PREPARACION').length;
  const completados = pedidos.filter(
    (p) => p.estado === 'ENVIADO' || p.estado === 'ENTREGADO'
  ).length;

  const kpis = [
    {
      titulo: 'Total Pedidos',
      valor: totalPedidos,
      icono: ShoppingBag,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      titulo: 'Pendientes',
      valor: pendientes,
      icono: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      titulo: 'En Preparación',
      valor: enPreparacion,
      icono: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      titulo: 'Enviados / Entregados',
      valor: completados,
      icono: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icono = kpi.icono;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
              <Icono size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.titulo}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.valor}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}