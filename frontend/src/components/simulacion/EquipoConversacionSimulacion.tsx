import type { IntegranteSimulacion } from '../../types/simulacion.types';

interface EquipoConversacionSimulacionProps {
  integrantes: IntegranteSimulacion[];
  finalizada: boolean;
  onVerFeedback?: () => void;
}

export default function EquipoConversacionSimulacion({
  integrantes,
  finalizada,
  onVerFeedback,
}: EquipoConversacionSimulacionProps) {
  return (
    <section className="flex min-h-96 flex-col rounded-2xl bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold text-abacontex-black-text">Equipo de la empresa</h2>

      <div className="mt-5 space-y-2">
        {integrantes.map((integrante) => (
          <div
            key={integrante.idAlumno}
            className="flex items-center gap-3 rounded-lg bg-abacontex-light px-3 py-2"
          >
            {integrante.fotoPerfilUrl ? (
              <img
                src={integrante.fotoPerfilUrl}
                alt={`${integrante.nombre} ${integrante.apellido}`}
                className="size-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-abacontex-primary-three/20 text-xs font-semibold text-abacontex-primary">
                {obtenerIniciales(integrante.nombre, integrante.apellido)}
              </div>
            )}

            <span className="w-12 shrink-0 text-sm font-semibold text-abacontex-primary">
              {integrante.rol}
            </span>

            <span className="min-w-0 truncate text-sm text-abacontex-black-text">
              {integrante.nombre} {integrante.apellido}
            </span>
          </div>
        ))}
      </div>

      {finalizada && onVerFeedback && (
        <button
          type="button"
          onClick={onVerFeedback}
          className="mt-auto flex h-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-abacontex-black-text transition hover:bg-abacontex-light"
        >
          Ver feedback →
        </button>
      )}
    </section>
  );
}

function obtenerIniciales(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}
