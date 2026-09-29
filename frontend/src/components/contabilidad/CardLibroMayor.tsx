import { CheckCircle2, TriangleAlert, XCircle } from 'lucide-react';

import type { CuentaLibroMayor } from '../../types/contabilidad.types';

import { formatearMonto } from '../../utils/facturacion.utils';

interface CardLibroMayorProps {
  cuenta: CuentaLibroMayor;
}

export default function CardLibroMayor({ cuenta }: CardLibroMayorProps) {
  const estadoSaldo = obtenerEstadoSaldo(cuenta);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 font-sans shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-abacontex-black-text">{cuenta.nombre}</h3>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${obtenerClaseTipoCuenta(
            cuenta.tipoCuenta
          )}`}
        >
          {formatearTipoCuenta(cuenta.tipoCuenta)}
        </span>
      </div>

      <div className="my-3 border-t border-gray-200" />

      <div className="grid grid-cols-3 gap-3 text-center">
        <DatoMonto
          etiqueta="Débito"
          valor={cuenta.totalDebito}
          claseValor="text-abacontex-primary-three"
        />

        <DatoMonto etiqueta="Crédito" valor={cuenta.totalCredito} claseValor="text-indigo-700" />

        <DatoMonto etiqueta="Saldo" valor={cuenta.saldo} claseValor="text-abacontex-black-text" />
      </div>

      <div className="mt-3 flex justify-center">
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${estadoSaldo.clase}`}
        >
          {estadoSaldo.icono}

          <span>{estadoSaldo.texto}</span>
        </div>
      </div>

      {!cuenta.esSaldoCorrecto && (
        <div className="mt-3 flex items-center text-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <TriangleAlert className="size-6 shrink-0 text-red-600" />

          <div className="min-w-0">
            <p className="text-sm text-center font-semibold text-red-700">Saldo incorrecto</p>

            <p className="mt-0.5 text-xs leading-relaxed text-red-600">
              {cuenta.mensajeError || 'Revisar libro diario'}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

interface DatoMontoProps {
  etiqueta: string;
  valor: number;
  claseValor: string;
}

function DatoMonto({ etiqueta, valor, claseValor }: DatoMontoProps) {
  return (
    <div>
      <p className="text-xs font-medium text-abacontex-gray-text">{etiqueta}</p>

      <p className={`mt-1 text-sm font-semibold ${claseValor}`}>{formatearMonto(valor)}</p>
    </div>
  );
}

function obtenerEstadoSaldo(cuenta: CuentaLibroMayor) {
  if (!cuenta.esSaldoCorrecto) {
    return {
      texto: formatearTipoSaldo(cuenta.tipoSaldo),
      clase: 'text-red-600',
      icono: <XCircle className="size-3.5" />,
    };
  }

  if (cuenta.tipoSaldo === 'ACREEDOR') {
    return {
      texto: 'Saldo acreedor',
      clase: 'text-abacontex-secondary-two',
      icono: <CheckCircle2 className="size-3.5" />,
    };
  }

  if (cuenta.tipoSaldo === 'SALDADA') {
    return {
      texto: 'Cuenta saldada',
      clase: 'text-abacontex-gray-text',
      icono: <CheckCircle2 className="size-3.5" />,
    };
  }

  return {
    texto: 'Saldo deudor',
    clase: 'text-abacontex-primary',
    icono: <CheckCircle2 className="size-3.5" />,
  };
}

function formatearTipoSaldo(tipoSaldo: CuentaLibroMayor['tipoSaldo']) {
  switch (tipoSaldo) {
    case 'ACREEDOR':
      return 'Saldo acreedor';

    case 'SALDADA':
      return 'Cuenta saldada';

    default:
      return 'Saldo deudor';
  }
}

function formatearTipoCuenta(tipoCuenta: string) {
  switch (tipoCuenta) {
    case 'ACTIVO':
      return 'Activo';

    case 'PASIVO':
      return 'Pasivo';

    case 'PATRIMONIO_NETO':
      return 'Patrimonio neto';

    case 'RESULTADO_POSITIVO':
      return 'Ingreso';

    case 'RESULTADO_NEGATIVO':
      return 'Egreso';

    default:
      return tipoCuenta;
  }
}

function obtenerClaseTipoCuenta(tipoCuenta: string) {
  switch (tipoCuenta) {
    case 'ACTIVO':
      return 'bg-green-100 text-abacontex-primary';

    case 'PASIVO':
      return 'bg-red-100 text-red-700';

    case 'PATRIMONIO_NETO':
      return 'bg-amber-100 text-amber-700';

    case 'RESULTADO_POSITIVO':
      return 'bg-indigo-100 text-indigo-700';

    case 'RESULTADO_NEGATIVO':
      return 'bg-orange-100 text-orange-700';

    default:
      return 'bg-gray-100 text-abacontex-gray-text';
  }
}
