import { Archive, DollarSign, PackageCheck, PackageX } from 'lucide-react';

import type { ProductoResumen } from '../../types/producto.types';

interface ResumenProductosProps {
  resumen: ProductoResumen;
}

interface CardResumenProps {
  titulo: string;
  valor: string | number;
  descripcion: string;
  icono: React.ReactNode;
  colorFondo: string;
  colorTexto: string;
}

function CardResumen({
  titulo,
  valor,
  descripcion,
  icono,
  colorFondo,
  colorTexto,
}: CardResumenProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorFondo}`}>
          <div className={colorTexto}>{icono}</div>
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">{titulo}</p>

          <p className={`mt-1 break-words text-2xl font-bold leading-tight ${colorTexto}`}>
            {valor}
          </p>

          <p className="mt-2 text-xs text-gray-500">{descripcion}</p>
        </div>
      </div>
    </article>
  );
}

export default function ResumenProductos({ resumen }: ResumenProductosProps) {
  return (
    <section className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <CardResumen
        titulo="Productos registrados"
        valor={resumen.total}
        descripcion="Total de productos"
        icono={<Archive size={22} />}
        colorFondo="bg-[#eef5ed]"
        colorTexto="text-[#4f6f52]"
      />

      <CardResumen
        titulo="Productos con stock"
        valor={resumen.conStock}
        descripcion="Disponibles para usar"
        icono={<PackageCheck size={22} />}
        colorFondo="bg-[#eef5ed]"
        colorTexto="text-[#4f6f52]"
      />

      <CardResumen
        titulo="Productos sin stock"
        valor={resumen.sinStock}
        descripcion="Stock igual a 0"
        icono={<PackageX size={22} />}
        colorFondo="bg-[#fdecec]"
        colorTexto="text-[#d14343]"
      />

      <CardResumen
        titulo="Valor estimado"
        valor={`$ ${resumen.valorEstimado.toLocaleString('es-AR')}`}
        descripcion="Stock disponible valorizado"
        icono={<DollarSign size={22} />}
        colorFondo="bg-[#f2f4e8]"
        colorTexto="text-[#5f8a52]"
      />
    </section>
  );
}
