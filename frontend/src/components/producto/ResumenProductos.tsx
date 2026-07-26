import type { ProductoResumen } from '../../types/producto.types';

interface ResumenProductosProps {
  resumen: ProductoResumen;
}

export default function ResumenProductos({
  resumen,
}: ResumenProductosProps) {
  return (
    <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Resumen</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">
            Productos registrados
          </p>

          <p className="mt-2 text-2xl font-bold">
            {resumen.total}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">
            Productos con stock
          </p>

          <p className="mt-2 text-2xl font-bold">
            {resumen.conStock}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">
            Productos sin stock
          </p>

          <p className="mt-2 text-2xl font-bold">
            {resumen.sinStock}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">
            Valor estimado
          </p>

          <p className="mt-2 text-2xl font-bold">
            $
            {resumen.valorEstimado.toLocaleString('es-AR')}
          </p>
        </div>
      </div>
    </section>
  );
}