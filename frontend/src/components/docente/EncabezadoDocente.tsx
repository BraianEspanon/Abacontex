import { Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import type { EncabezadoPanelProps } from '../../types/ui.types';

const titulosPorRuta: Record<string, string> = {
  '/docente': 'Inicio',
  '/docente/perfil': 'Perfil',
  '/docente/cursos': 'Cursos',
  '/docente/empresas': 'Empresas',
  '/docente/alumnos': 'Alumnos',
  '/docente/manual-cuentas': 'Manual de cuentas',

  '/docente/ejercicios': 'Mis ejercicios',
  '/docente/ejercicios/nuevo': 'Nuevo ejercicio',
  '/docente/ejercicios/nuevo/ia': 'Nuevo ejercicio con IA',
  '/docente/simulaciones': 'Simulación empresarial',
  '/docente/simulaciones/nueva': 'Nueva simulación',
};

export default function EncabezadoDocente({
  sidebarColapsado,
  onAlternarSidebar,
}: EncabezadoPanelProps) {
  const { pathname } = useLocation();

  const titulo =
    titulosPorRuta[pathname] ??
    (pathname.startsWith('/docente/simulaciones/')
      ? 'Simulación empresarial'
      : pathname.startsWith('/docente/ejercicios/')
        ? 'Detalle del ejercicio'
        : 'Panel docente');

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-[#17231b] px-5 text-white">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onAlternarSidebar}
          className="rounded-md p-2 transition-colors hover:bg-white/10"
          aria-label={sidebarColapsado ? 'Expandir menú lateral' : 'Contraer menú lateral'}
          aria-expanded={!sidebarColapsado}
        >
          <Menu size={21} />
        </button>

        <h1 className="font-heading text-4xl font-semibold tracking-[0.02em]">{titulo}</h1>
      </div>

      <button
        type="button"
        className="relative rounded-md p-2 transition-colors hover:bg-white/10"
        aria-label="Ver notificaciones"
      >
        <Bell size={20} />

        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </button>
    </header>
  );
}
