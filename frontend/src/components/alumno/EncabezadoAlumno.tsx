import { Menu } from 'lucide-react';

import CampanaNotificaciones from '../notificaciones/CampanaNotificaciones';

interface EncabezadoAlumnoProps {
  titulo: string;
}

export default function EncabezadoAlumno({ titulo }: EncabezadoAlumnoProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#172019] px-6 text-white">
      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Abrir menú"
          className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Menu size={22} />
        </button>

        <h2 className="font-serif text-3xl font-semibold">{titulo}</h2>
      </div>

      <CampanaNotificaciones />
    </header>
  );
}
