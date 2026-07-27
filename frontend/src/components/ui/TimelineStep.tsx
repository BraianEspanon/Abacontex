import type { TimelineStepProps } from '../../types/ui.types';

export default function TimelineStep({ number, title, icon, isLast = false }: TimelineStepProps) {
  return (
    <div className="relative flex flex-col items-center flex-1 group">
      {/* --- LA LÍNEA HORIZONTAL --- */}

      {!isLast && (
        <div
          className="hidden lg:block absolute top-6 left-1/2 w-full h-0.5 bg-linear-to-r from-abacontext-light-bg
         to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 z-0"
        />
      )}

      {/* --- EL NODO (CÍRCULO CON NÚMERO) --- */}
      <div className="relative z-10 w-12 h-12 rounded-full bg-abacontex-dark text-white flex items-center justify-center font-bold text-xl border-4 border-abacontex-primary-two shadow-md ring-4 ring-abacontex-primary transition-all duration-300 group-hover:border-white group-hover:shadow-[0_0_15px_rgba(106,143,101,0.6)] mb-8">
        {number}
      </div>

      {/* --- LA TARJETA  --- */}
      <div className="relative z-10 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-abacontex-primary-two flex flex-col items-center justify-center gap-4 text-center w-full max-w-50 cursor-default">
        <div className="p-4 bg-abacontex-light text-abacontex-primary rounded-2xl transition-colors duration-300 group-hover:bg-abacontex-primary group-hover:text-white">
          {icon}
        </div>
        <h3 className="font-heading text-lg font-bold text-abacontext-light-bg leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
}
