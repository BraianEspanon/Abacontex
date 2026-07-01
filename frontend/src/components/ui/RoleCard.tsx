import { CheckCircle2 } from 'lucide-react';
import type { RoleCardProps } from '../../types/ui.types';

export default function RoleCard({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  isSelected, 
  onClick 
}: RoleCardProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(id)}
            className={`relative flex flex-col items-center p-6 rounded-2xl text-center transition-all duration-300 border border-abacontex-gray-text/60 w-full ${
                isSelected 
                ? 'border-abacontex-primary bg-abacontex-primary/5 shadow-md' 
                : 'border-abacontex-gray/30 bg-white hover:border-abacontex-primary-three hover:shadow-sm'
            }`}
            >
            {/* Icono de Check (Solo visible si la tarjeta está seleccionada) */}
            {isSelected && (
                <CheckCircle2 className="absolute top-4 right-4 text-abacontex-primary w-6 h-6 animate-in fade-in zoom-in" />
            )}

            {/* Contenedor del Icono Principal */}
            <div className={`p-3 rounded-xl mb-2 transition-colors duration-300 ${
                isSelected ? 'bg-abacontex-primary text-white' : 'bg-abacontex-light-bg text-abacontex-dark'
            }`}>
                <Icon className="w-6 h-6" />
            </div>
            
            {/* Textos */}
            <h3 className={`font-bold text-lg mb-1 font-heading ${
                isSelected ? 'text-abacontex-primary' : 'text-abacontex-black-text'
            }`}>
                {title}
            </h3>
            <p className="text-sm text-abacontex-gray-text line-clamp-2 font-sans">
                {description}
            </p>
        </button>
  );
}