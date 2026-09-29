import { useNavigate } from 'react-router-dom';

interface NavegacionContabilidadProps {
  activa?: 'LIBRO_DIARIO' | 'LIBRO_MAYOR' | 'ESTADO_RESULTADO' | 'BALANCE_GENERAL';
}

const opciones = [
  {
    id: 'LIBRO_DIARIO',
    label: 'Libro diario',
    ruta: '/alumno/contabilidad',
  },
  {
    id: 'LIBRO_MAYOR',
    label: 'Libro mayor',
    ruta: '/alumno/contabilidad/libro-mayor',
  },
  {
    id: 'ESTADO_RESULTADO',
    label: 'Estado de resultado',
    ruta: '/alumno/contabilidad/estado-resultados',
  },
  {
    id: 'BALANCE_GENERAL',
    label: 'Balance general',
    ruta: '/alumno/contabilidad/balance-general',
  },
] as const;

export default function NavegacionContabilidad({
  activa = 'LIBRO_DIARIO',
}: NavegacionContabilidadProps) {
  const navigate = useNavigate();

  const handleSeleccionar = (opcion: (typeof opciones)[number]) => {
    if (opcion.id === activa) {
      return;
    }

    navigate(opcion.ruta);
  };

  return (
    <nav className="w-fit max-w-full">
      <div className="flex overflow-x-auto rounded-lg border border-gray-300 bg-gray-50 p-1">
        {opciones.map((opcion) => {
          const seleccionada = activa === opcion.id;

          return (
            <button
              key={opcion.id}
              type="button"
              onClick={() => handleSeleccionar(opcion)}
              aria-current={seleccionada ? 'page' : undefined}
              className={[
                'shrink-0 rounded-md px-5 py-2 text-xs font-medium transition-colors duration-200',
                seleccionada
                  ? 'cursor-default bg-abacontex-primary text-white shadow-sm'
                  : 'cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-abacontex-primary',
              ].join(' ')}
            >
              {opcion.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
