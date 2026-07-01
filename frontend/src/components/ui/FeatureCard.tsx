import type { FeatureCardProps } from "../../types/ui.types";

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (

    <div className="group bg-abacontext-light-bg p-8 rounded-3xl border-abacontex-gray/60 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-abacontex-accent/50 flex flex-col items-center text-center gap-5 cursor-default">
      
      {/* Contenedor del ícono */}
      {icon && (
        <div className="p-3 bg-abacontext-light-bg text-abacontex-primary rounded-2xl w-fit mb-4 transition-colors duration-300 group-hover:bg-abacontex-primary group-hover:text-white">
          {icon}
        </div>
      )}

      {/* Contenedor de los textos */}
      <div className="flex flex-col gap-3">
        <h3 className="font-sans text-xl font-bold text-abacontex-black-text transition-colors duration-300 group-hover:text-abacontex-primary">
          {title}
        </h3>
        <p className="font-sans text-abacontex-gray-text leading-relaxed text-sm">
          {description}
        </p>
      </div>

    </div>
  );
}