import { ArrowRight, Clock3, FileText, PiggyBank, ReceiptText } from 'lucide-react';

import type { ResumenFacturacion as ResumenFacturacionType } from '../../types/facturacion.types';

import { formatearMonto } from '../../utils/facturacion.utils';

interface ResumenFacturacionProps {
  resumen: ResumenFacturacionType;
  onVerVentasPendientes: () => void;
}

export default function ResumenFacturacion({
  resumen,
  onVerVentasPendientes,
}: ResumenFacturacionProps) {
  const cardClassName =
    'group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg';

  const iconContainerClassName =
    'flex size-12 shrink-0 items-center justify-center rounded-full bg-abacontex-primary/10 transition-transform duration-200 group-hover:scale-105';

  return (
    <section className="grid gap-4 font-sans md:grid-cols-2 xl:grid-cols-4">
      <article className={cardClassName}>
        <div className={iconContainerClassName}>
          <FileText className="size-6 text-abacontex-primary" />
        </div>

        <div className="min-w-0 flex-1 text-center">
          <p className="font-medium text-abacontex-black-text">Facturas emitidas</p>

          <p className="mt-1 text-2xl font-semibold text-abacontex-primary">
            {resumen.facturasEmitidas}
          </p>

          <p className="mt-1 text-xs font-light text-abacontex-gray-text">Total acumulado</p>
        </div>
      </article>

      <article className={cardClassName}>
        <div className={iconContainerClassName}>
          <Clock3 className="size-6 text-abacontex-primary" />
        </div>

        <div className="min-w-0 flex-1 text-center">
          <p className="font-medium leading-tight text-abacontex-black-text">
            Ventas pendientes de facturar
          </p>

          <p className="mt-1 text-2xl font-semibold text-abacontex-primary">
            {resumen.ventasPendientes}
          </p>

          <button
            type="button"
            onClick={onVerVentasPendientes}
            className="mt-1 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-abacontex-primary-two underline decoration-abacontex-primary-three underline-offset-2 transition hover:text-abacontex-primary"
          >
            Ver ventas
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </article>

      <article className={cardClassName}>
        <div className={iconContainerClassName}>
          <ReceiptText className="size-6 text-abacontex-primary" />
        </div>

        <div className="min-w-0 flex-1 text-center">
          <p className="font-medium text-abacontex-black-text">Facturación del mes</p>

          <p className="mt-1 text-2xl font-semibold text-abacontex-primary">
            {formatearMonto(resumen.facturacionMes)}
          </p>

          <p className="mt-1 text-xs font-light text-abacontex-gray-text">Este mes</p>
        </div>
      </article>

      <article className={cardClassName}>
        <div className={iconContainerClassName}>
          <PiggyBank className="size-6 text-abacontex-primary" />
        </div>

        <div className="min-w-0 flex-1 text-center">
          <p className="font-medium text-abacontex-black-text">Monto facturado</p>

          <p className="mt-1 text-2xl font-semibold text-abacontex-primary">
            {formatearMonto(resumen.montoFacturado)}
          </p>

          <p className="mt-1 text-xs font-light text-abacontex-gray-text">Total acumulado</p>
        </div>
      </article>
    </section>
  );
}
