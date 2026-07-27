// src/components/ui/BokehContainer.tsx
import type { BokehContainerProps } from '../../types/ui.types';

export default function BokehContainer({ children, className = '' }: BokehContainerProps) {
  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      {/* --- LUNARES DE FONDO --- */}
      <div className="absolute top-[12%] left-[8%] w-14 h-14 bg-abacontex-primary-three/20 rounded-full pointer-events-none z-0" />
      <div className="absolute top-[45%] left-[28%] w-6 h-6 bg-abacontex-primary-three/15 rounded-full pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[18%] w-20 h-20 bg-abacontex-primary-three/10 rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[25%] left-[50%] w-10 h-10 bg-abacontex-primary-three/25 rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[15%] right-[12%] w-16 h-16 bg-abacontex-primary-three/15 rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[12%] w-16 h-16 bg-abacontex-primary-three/15 rounded-full pointer-events-none z-0" />
      <div className="absolute top-[5%] right-[2%] w-20 h-20 bg-abacontex-primary-three/10 rounded-full pointer-events-none z-0" />

      {/* El contenido de la simulación va por encima */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
