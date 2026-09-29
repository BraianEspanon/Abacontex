import { BookOpen, ChartNoAxesColumnIncreasing, Scale, ScrollText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavegacionContabilidadProps {
  activa?: 'LIBRO_DIARIO' | 'LIBRO_MAYOR' | 'ESTADO_RESULTADO' | 'BALANCE_GENERAL';
}

const opciones = [
  {
    id: 'LIBRO_DIARIO',
    label: 'Libro diario',
    icono: BookOpen,
    ruta: '/alumno/contabilidad',
  },
  {
    id: 'LIBRO_MAYOR',
    label: 'Libro mayor',
    icono: ScrollText,
    ruta: '/alumno/contabilidad/libro-mayor',
  },
  {
    id: 'ESTADO_RESULTADO',
    label: 'Estado de resultado',
    icono: ChartNoAxesColumnIncreasing,
    ruta: '/alumno/contabilidad/estado-resultados',
  },
  {
    id: 'BALANCE_GENERAL',
    label: 'Balance general',
    icono: Scale,
    ruta: '/alumno/contabilidad/balance-general',
  },
] as const;

export default function NavegacionContabilidad({
  activa = 'LIBRO_DIARIO',
}: NavegacionContabilidadProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSeleccionar = (opcion: (typeof opciones)[number]) => {
    if (location.pathname === opcion.ruta) {
      return;
    }

    navigate(opcion.ruta);
  };

  return (
    <nav className="border-b border-gray-200">
      <div className="flex gap-7 overflow-x-auto">
        {opciones.map((opcion) => {
          const Icono = opcion.icono;
          const seleccionada = activa === opcion.id;

          return (
            <button
              key={opcion.id}
              type="button"
              onClick={() => handleSeleccionar(opcion)}
              className={[
                'group relative flex shrink-0 cursor-pointer items-center gap-2 px-1 pb-3 text-sm transition',
                seleccionada
                  ? 'font-semibold text-abacontex-primary'
                  : 'font-medium text-abacontex-gray-text hover:text-abacontex-primary',
              ].join(' ')}
            >
              <Icono
                className={[
                  'size-4 transition-transform',
                  seleccionada ? 'scale-105' : 'group-hover:scale-105',
                ].join(' ')}
              />

              <span className={seleccionada ? 'font-semibold' : 'font-medium'}>{opcion.label}</span>

              {seleccionada && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-abacontex-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
