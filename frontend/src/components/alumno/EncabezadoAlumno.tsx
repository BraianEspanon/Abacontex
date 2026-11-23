import { Menu } from 'lucide-react';

import CampanaNotificaciones from '../notificaciones/CampanaNotificaciones';

import type { EncabezadoAlumnoProps } from '../../types/ui.types';

export default function EncabezadoAlumno({
  titulo,
  sidebarColapsado,
  onAlternarSidebar,
}: EncabezadoAlumnoProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#17231b] px-5 text-white">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onAlternarSidebar}
          aria-label={sidebarColapsado ? 'Expandir menú lateral' : 'Contraer menú lateral'}
          aria-expanded={!sidebarColapsado}
          className="rounded-md p-2 transition-colors hover:bg-white/10"
        >
          <Menu size={21} />
        </button>

        <h1 className="font-heading text-2xl font-semibold">{titulo}</h1>
      </div>

      <CampanaNotificaciones />
    </header>
  );
}
