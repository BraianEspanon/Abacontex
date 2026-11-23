import { BarChart3, CheckCircle2, MessageCircleMore, MinusCircle, Star } from 'lucide-react';

type Props = {
  devolucion: string;
  fortalezas: string[];
  aspectosMejora: string[];
};

export default function DevolucionSimulacion({ devolucion, fortalezas, aspectosMejora }: Props) {
  return (
    <div className="rounded-2xl border border-gray-300/70 bg-white/60 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <MessageCircleMore className="h-5 w-5 text-abacontex-text" />

        <h3 className="font-outfit text-base font-semibold text-abacontex-text">
          Devolución de Aba
        </h3>
      </div>

      <p className="mt-2 font-outfit text-base text-abacontex-text-secondary">{devolucion}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-green-50/80 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 fill-abacontex-primary3 text-abacontex-primary3" />

            <p className="font-outfit font-semibold text-abacontex-text">Fortalezas</p>
          </div>

          <div className="space-y-2">
            {fortalezas.map((fortaleza) => (
              <div
                key={fortaleza}
                className="flex items-start gap-2 font-outfit text-sm text-abacontex-text-secondary"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-abacontex-primary3 text-white" />

                <span>{fortaleza}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-orange-50/80 p-4">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-400" />

            <p className="font-outfit font-semibold text-abacontex-text">A mejorar</p>
          </div>

          <div className="space-y-2">
            {aspectosMejora.map((aspecto) => (
              <div
                key={aspecto}
                className="flex items-start gap-2 font-outfit text-sm text-abacontex-text-secondary"
              >
                <MinusCircle className="mt-0.5 h-4 w-4 shrink-0 fill-orange-400 text-white" />

                <span>{aspecto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
