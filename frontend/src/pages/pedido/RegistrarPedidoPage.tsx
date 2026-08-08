import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RegistrarPedidoForm, {
  RegistrarPedidoFormValues,
} from '../../components/pedido/RegistrarPedidoForm';
import { useCrearPedido } from '../../hooks/useCrearPedido';

export default function RegistrarPedidoPage() {
  const navigate = useNavigate();
  const { mutateAsync: crearPedido, isPending } = useCrearPedido();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: RegistrarPedidoFormValues) => {
    setErrorMessage(null);
    try {
      await crearPedido({
        cliente: values.cliente,
        fecha: values.fecha,
        items: values.items.map((item) => ({
          productoId: Number(item.productoId),
          cantidad: Number(item.cantidad),
        })),
      });

      // Tras guardar exitosamente, volvemos a la pantalla Kanban
      navigate('/alumno/pedidos');
    } catch (error: any) {
      console.error('Error al registrar el pedido:', error);
      const msg =
        error?.response?.data?.message ||
        'Ocurrió un error al intentar guardar el pedido. Revisa los datos o la conexión.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <button
          type="button"
          onClick={() => navigate('/alumno/pedidos')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 mb-3 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a Mis Pedidos
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Registrar Pedido</h1>
        <p className="text-sm text-gray-500 mt-1">
          Completa el formulario para registrar un nuevo pedido de venta.
        </p>
      </div>

      <RegistrarPedidoForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        onCancel={() => navigate('/alumno/pedidos')}
        errorMessage={errorMessage}
      />
    </div>
  );
}
