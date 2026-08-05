import { CheckCircle2 } from 'lucide-react';
import type { RoleCardProps } from '../../types/ui.types';

export default function RoleCard({
  id,
  title,
  description,
  icon: Icon,
  isSelected,
  onClick,
}: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`group relative flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
        isSelected
          ? 'border-abacontex-primary bg-abacontex-primary/5 shadow-sm'
          : 'border-abacontex-gray/40 bg-white hover:border-abacontex-primary-three'
      }`}
    >
      {isSelected && (
        <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-abacontex-primary" />
      )}

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
          isSelected
            ? 'bg-abacontex-primary text-white'
            : 'bg-abacontext-light-bg text-abacontex-dark group-hover:bg-abacontex-primary-three/15'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 pr-6">
        <h3
          className={`mb-1 font-heading text-lg font-bold ${
            isSelected ? 'text-abacontex-primary' : 'text-abacontex-black-text'
          }`}
        >
          {title}
        </h3>

        <p className="text-sm leading-5 text-abacontex-gray-text">{description}</p>
      </div>
    </button>
  );
}
