import { Paperclip, Send } from 'lucide-react';

interface BarraVisualConversacionProps {
  textoSeleccionado: string;
  puedeEnviar: boolean;
  enviando: boolean;
  onEnviar: () => void;
}

export default function BarraVisualConversacion({
  textoSeleccionado,
  puedeEnviar,
  enviando,
  onEnviar,
}: BarraVisualConversacionProps) {
  return (
    <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-4">
      <button
        type="button"
        disabled
        aria-label="Adjuntar archivo"
        className="flex size-9 cursor-not-allowed items-center justify-center rounded-lg border border-gray-200 text-gray-400"
      >
        <Paperclip size={18} />
      </button>

      <div className="flex min-h-9 flex-1 items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
        {textoSeleccionado ? (
          <span className="text-abacontex-black-text">{textoSeleccionado}</span>
        ) : (
          <span className="text-gray-400">Seleccioná una opción para responder</span>
        )}
      </div>

      <button
        type="button"
        disabled={!puedeEnviar || enviando}
        onClick={onEnviar}
        aria-label="Enviar respuesta"
        className={[
          'flex size-9 items-center justify-center rounded-lg text-white transition',
          puedeEnviar && !enviando
            ? 'cursor-pointer bg-abacontex-primary-three hover:bg-abacontex-primary'
            : 'cursor-not-allowed bg-abacontex-primary/40',
        ].join(' ')}
      >
        <Send size={17} />
      </button>
    </div>
  );
}
