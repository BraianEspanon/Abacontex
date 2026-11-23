import type { LogoAbacontexProps } from '../../types/ui.types';

export default function LogoAbacontex({ colapsado = false }: LogoAbacontexProps) {
  return (
    <div className="flex h-16 w-full items-center justify-center px-2">
      <img
        src="/img/Logo.png"
        alt="Abacontex"
        className={[
          'object-contain transition-all duration-300',
          colapsado ? 'h-11 w-14' : 'h-14 w-44',
        ].join(' ')}
      />
    </div>
  );
}
