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
  },
  {
    id: 'LIBRO_MAYOR',
    label: 'Libro mayor',
    icono: ScrollText,
  },
  {
    id: 'ESTADO_RESULTADO',
    label: 'Estado de resultado',
    icono: ChartNoAxesColumnIncreasing,
  },
  {
    id: 'BALANCE_GENERAL',
    label: 'Balance general',
    icono: Scale,
  },
] as const;

export default function NavegacionContabilidad({
  activa = 'LIBRO_DIARIO',
}: NavegacionContabilidadProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const estaEnPaginaPrincipal = location.pathname === '/alumno/contabilidad';

  const handleSeleccionar = (id: (typeof opciones)[number]['id']) => {
    /*
     * "Libro diario" representa la sección principal
     * de Contabilidad.
     *
     * Si ya estamos en /alumno/contabilidad,
     * no hacemos nada.
     *
     * Desde Libro Diario, Registrar asiento o
     * Editar asiento vuelve a la página principal.
     */
    if (id === 'LIBRO_DIARIO' && !estaEnPaginaPrincipal) {
      navigate('/alumno/contabilidad');
    }
  };

  return (
    <nav className="border-b border-gray-200">
      <div className="flex gap-7 overflow-x-auto">
        {opciones.map((opcion) => {
          const Icono = opcion.icono;
          const seleccionada = activa === opcion.id;

          const esLibroDiario = opcion.id === 'LIBRO_DIARIO';

          const puedeNavegar = esLibroDiario && !estaEnPaginaPrincipal;

          return (
            <button
              key={opcion.id}
              type="button"
              onClick={() => handleSeleccionar(opcion.id)}
              disabled={!puedeNavegar}
              className={[
                'relative flex shrink-0 items-center gap-2 px-1 pb-3 text-sm font-medium',
                seleccionada ? 'text-[#496647]' : 'text-gray-400',

                puedeNavegar ? 'cursor-pointer transition hover:text-[#3f5b3d]' : 'cursor-default',
              ].join(' ')}
            >
              <Icono className="h-4 w-4" />

              {opcion.label}

              {seleccionada && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-[#496647]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
