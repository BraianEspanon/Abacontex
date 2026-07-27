import { Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const titulosPorRuta: Record<string, string> = {
  '/docente': 'Inicio',
  '/docente/perfil': 'Perfil',
  '/docente/cursos': 'Cursos',
  '/docente/empresas': 'Empresas',
  '/docente/alumnos': 'Alumnos',
};

export default function EncabezadoDocente() {
  const { pathname } = useLocation();

  const titulo = titulosPorRuta[pathname] ?? 'Panel docente';

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-abacontex-dark px-5 text-white">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 transition-colors hover:bg-white/10"
          aria-label="Abrir menú"
        >
          <Menu size={21} />
        </button>

        <h1 className="font-heading text-2xl font-semibold">{titulo}</h1>
      </div>

      <button
        type="button"
        className="relative rounded-md p-2 transition-colors hover:bg-white/10"
        aria-label="Ver notificaciones"
      >
        <Bell size={20} />

        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
      </button>
    </header>
  );
}
