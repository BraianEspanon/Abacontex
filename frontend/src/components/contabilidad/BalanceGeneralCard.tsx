import { TriangleAlert } from 'lucide-react';

import type { BalanceGeneralResponse, CuentaReporte } from '../../types/contabilidad.types';

import { formatearMonto } from '../../utils/facturacion.utils';

interface BalanceGeneralCardProps {
  balance: BalanceGeneralResponse;
}

export default function BalanceGeneralCard({ balance }: BalanceGeneralCardProps) {
  return (
    <section className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 font-sans shadow-sm">
      <h2 className="text-center text-2xl font-semibold text-abacontex-black-text">
        Estado de Situación Patrimonial - Balance general
      </h2>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* ACTIVO */}
        <div>
          <SeccionBalance
            titulo="Activo"
            cuentas={balance.activos}
            total={balance.totalActivo}
            etiquetaTotal="Total activo"
          />
        </div>

        {/* PASIVO + PATRIMONIO */}
        <div className="space-y-6">
          <SeccionBalance
            titulo="Pasivo"
            cuentas={balance.pasivos}
            total={balance.totalPasivo}
            etiquetaTotal="Total pasivo"
          />

          <SeccionPatrimonio
            cuentas={balance.patrimonioNeto}
            resultadoEjercicio={balance.resultadoEjercicio}
            total={balance.totalPatrimonioNeto}
          />
        </div>
      </div>

      {/* ECUACIÓN PATRIMONIAL */}
      <div className="mt-7 border-t border-gray-300 pt-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 grid-cols-[auto_1fr] items-center gap-4">
            <span className="rounded-xl bg-abacontex-primary px-3 py-1.5 text-sm font-semibold text-abacontex-light">
              A = P + PN
            </span>

            <span className="text-center text-base font-semibold text-abacontex-black-text">
              {formatearMonto(balance.totalActivo)}
              {' = '}
              {formatearMonto(balance.totalPasivoMasPatrimonioNeto)}
            </span>
          </div>

          <div className="flex max-w-xs items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2">
            <TriangleAlert className="size-5 shrink-0 text-red-600" />

            <p className="text-xs font-medium leading-snug text-red-700">
              {balance.mensajeError || 'No se cumple con la igualdad patrimonial'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SeccionBalanceProps {
  titulo: string;
  cuentas: CuentaReporte[];
  total: number;
  etiquetaTotal: string;
}

function SeccionBalance({ titulo, cuentas, total, etiquetaTotal }: SeccionBalanceProps) {
  return (
    <div>
      <h3 className="border-b border-gray-300 pb-2 text-lg font-semibold text-abacontex-gray-text">
        {titulo}
      </h3>

      <div className="mt-3 space-y-2">
        {cuentas.length === 0 ? (
          <p className="text-sm text-abacontex-gray-text">No hay cuentas para mostrar.</p>
        ) : (
          cuentas.map((cuenta) => <FilaCuenta key={cuenta.cuentaId} cuenta={cuenta} />)
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-abacontex-primary-three">{etiquetaTotal}</span>

        <span className="text-sm font-semibold text-abacontex-primary-three">
          {formatearMonto(total)}
        </span>
      </div>
    </div>
  );
}

interface SeccionPatrimonioProps {
  cuentas: CuentaReporte[];
  resultadoEjercicio: number;
  total: number;
}

function SeccionPatrimonio({ cuentas, resultadoEjercicio, total }: SeccionPatrimonioProps) {
  return (
    <div>
      <h3 className="border-b border-gray-300 pb-2 text-lg font-semibold text-abacontex-gray-text">
        Patrimonio neto
      </h3>

      <div className="mt-3 space-y-2">
        {cuentas.map((cuenta) => (
          <FilaCuenta key={cuenta.cuentaId} cuenta={cuenta} />
        ))}

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-abacontex-black-text">Resultado del ejercicio</span>

          <span className="font-medium text-abacontex-black-text">
            {formatearMonto(resultadoEjercicio)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-abacontex-primary-three">
          Total patrimonio neto
        </span>

        <span className="text-sm font-semibold text-abacontex-primary-three">
          {formatearMonto(total)}
        </span>
      </div>
    </div>
  );
}

function FilaCuenta({ cuenta }: { cuenta: CuentaReporte }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-abacontex-black-text">{cuenta.nombre}</span>

      <span className="font-medium text-abacontex-black-text">{formatearMonto(cuenta.saldo)}</span>
    </div>
  );
}
