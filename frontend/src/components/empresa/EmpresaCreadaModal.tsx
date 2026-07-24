// src/components/empresa/EmpresaCreadaModal.tsx

import { ArrowRight, PartyPopper } from 'lucide-react';

interface EmpresaCreadaModalProps {
  abierto: boolean;
  nombreEmpresa: string;
  onContinuar: () => void;
}

export default function EmpresaCreadaModal({
  abierto,
  nombreEmpresa,
  onContinuar,
}: EmpresaCreadaModalProps) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-abacontex-dark px-8 py-10 text-center shadow-2xl">
        <PartyPopper className="mx-auto mb-5 h-12 w-12 text-abacontex-primary-three" />

        <h2 className="font-heading text-4xl font-bold text-white">
          ¡Empresa fundada!
        </h2>

        <p className="mt-4 text-sm text-white/75">
          Tu empresa <strong>{nombreEmpresa}</strong> fue registrada
          correctamente.
        </p>

        <button
          type="button"
          onClick={onContinuar}
          className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full bg-abacontex-primary-three px-6 py-3 font-medium text-white transition hover:bg-abacontex-primary-two"
        >
          Ir al dashboard
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}