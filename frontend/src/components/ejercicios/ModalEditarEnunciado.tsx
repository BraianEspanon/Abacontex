import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModalEditarEnunciadoProps {
  abierto: boolean;
  enunciado: string;
  onCerrar: () => void;
  onGuardar: (enunciado: string) => void;
}

export default function ModalEditarEnunciado({
  abierto,
  enunciado,
  onCerrar,
  onGuardar,
}: ModalEditarEnunciadoProps) {
  const [texto, setTexto] = useState(enunciado);

  useEffect(() => {
    if (abierto) {
      setTexto(enunciado);
    }
  }, [abierto, enunciado]);

  if (!abierto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-abacontex-black-text">Editar enunciado</h2>

            <p className="mt-1 text-sm text-abacontex-gray-text">
              Corregí el texto obtenido de la digitalización.
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-abacontex-gray-text transition hover:bg-abacontex-light hover:text-abacontex-black-text"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <textarea
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          rows={14}
          className="mt-5 w-full resize-y rounded-xl border border-gray-300 p-4 text-sm leading-relaxed outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCerrar}
            className="h-10 cursor-pointer rounded-lg border border-gray-300 px-4 text-sm font-semibold transition hover:bg-abacontex-light"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => {
              onGuardar(texto);
              onCerrar();
            }}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-abacontex-primary-three px-4 text-sm font-semibold text-white transition hover:bg-abacontex-primary"
          >
            <Check className="size-4" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
