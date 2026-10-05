import { Check, Eye, Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import MarkdownEjercicio from './MarkdownEjercicio';

interface ModalEditarEnunciadoProps {
  abierto: boolean;
  enunciado: string;
  onCerrar: () => void;
  onGuardar: (enunciado: string) => void;
}

type ModoVista = 'EDITAR' | 'PREVISUALIZAR';

export default function ModalEditarEnunciado({
  abierto,
  enunciado,
  onCerrar,
  onGuardar,
}: ModalEditarEnunciadoProps) {
  const [texto, setTexto] = useState(enunciado);

  const [modoVista, setModoVista] = useState<ModoVista>('EDITAR');

  useEffect(() => {
    if (abierto) {
      setTexto(enunciado);
      setModoVista('EDITAR');
    }
  }, [abierto, enunciado]);

  if (!abierto) {
    return null;
  }

  const guardar = () => {
    onGuardar(texto);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-abacontex-dark">Editar enunciado</h2>

            <p className="mt-1 text-sm text-abacontex-gray-text">
              Corregí cualquier detalle detectado durante la digitalización.
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-abacontex-gray-text transition hover:bg-abacontex-light hover:text-abacontex-dark"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-gray-200 px-6 pt-4">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setModoVista('EDITAR')}
              className={[
                'flex cursor-pointer items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition',
                modoVista === 'EDITAR'
                  ? 'border-abacontex-primary text-abacontex-primary'
                  : 'border-transparent text-abacontex-gray-text hover:text-abacontex-dark',
              ].join(' ')}
            >
              <Pencil className="size-4" />
              Editar
            </button>

            <button
              type="button"
              onClick={() => setModoVista('PREVISUALIZAR')}
              className={[
                'flex cursor-pointer items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition',
                modoVista === 'PREVISUALIZAR'
                  ? 'border-abacontex-primary text-abacontex-primary'
                  : 'border-transparent text-abacontex-gray-text hover:text-abacontex-dark',
              ].join(' ')}
            >
              <Eye className="size-4" />
              Vista previa
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {modoVista === 'EDITAR' ? (
            <>
              <textarea
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
                rows={16}
                className="min-h-96 w-full resize-y rounded-xl border border-gray-300 p-4 font-sans text-sm leading-relaxed text-abacontex-black-text outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/15"
                placeholder="Enunciado del ejercicio..."
                autoFocus
              />

              <p className="mt-2 text-xs text-abacontex-gray-text">
                El formato del ejercicio se conserva automáticamente. Podés corregir palabras,
                importes, fechas o cualquier dato del enunciado.
              </p>
            </>
          ) : (
            <div className="min-h-96 rounded-xl border border-gray-200 bg-white p-5">
              {texto.trim() ? (
                <MarkdownEjercicio contenido={texto} />
              ) : (
                <div className="flex min-h-80 items-center justify-center text-center">
                  <p className="text-sm text-abacontex-gray-text">
                    No hay contenido para previsualizar.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onCerrar}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-semibold transition hover:bg-abacontex-light"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={guardar}
            disabled={!texto.trim()}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-abacontex-primary-three px-5 text-sm font-semibold text-white transition hover:bg-abacontex-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="size-4" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
