import { Bell, Menu } from 'lucide-react';

export default function EncabezadoDocente() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-black/10 bg-[#17231b] px-5 text-white">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 transition-colors hover:bg-white/10"
          aria-label="Abrir menú"
        >
          <Menu size={21} />
        </button>

        <h1 className="font-serif text-2xl font-semibold">Inicio</h1>
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