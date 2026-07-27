import { NavLink } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import {
  BookOpen,
  Boxes,
  Building2,
  ClipboardList,
  Factory,
  GraduationCap,
  House,
  LogOut,
  Package,
  ReceiptText,
  Sparkles,
  Trophy,
  UserRound,
  WalletCards,
  Calculator,
} from 'lucide-react';

const opcionesMenu = [
  {
    nombre: 'Inicio',
    ruta: '/alumno',
    icono: House,
    end: true,
  },
  {
    nombre: 'Mi empresa',
    ruta: '/alumno/empresa',
    icono: Building2,
  },
  {
    nombre: 'Inventario',
    ruta: '/alumno/inventario',
    icono: Boxes,
  },
  {
    nombre: 'Pedidos',
    ruta: '/alumno/pedidos',
    icono: ClipboardList,
  },
  {
    nombre: 'Producción',
    ruta: '/alumno/produccion',
    icono: Factory,
  },
  {
    nombre: 'Ventas',
    ruta: '/alumno/ventas',
    icono: WalletCards,
  },
  {
    nombre: 'Facturación',
    ruta: '/alumno/facturacion',
    icono: ReceiptText,
  },
  {
    nombre: 'Finanzas',
    ruta: '/alumno/finanzas',
    icono: Package,
  },
  {
    nombre: 'Contabilidad',
    ruta: '/alumno/contabilidad',
    icono: Calculator,
  },
  {
    nombre: 'Mis ejercicios',
    ruta: '/alumno/ejercicios',
    icono: GraduationCap,
  },
  {
    nombre: 'Simulación empresarial',
    ruta: '/alumno/simulacion',
    icono: Sparkles,
  },
  {
    nombre: 'Logros',
    ruta: '/alumno/logros',
    icono: Trophy,
  },
  {
    nombre: 'Manual de cuentas',
    ruta: '/alumno/manual-cuentas',
    icono: BookOpen,
  },
  {
    nombre: 'Perfil',
    ruta: '/alumno/perfil',
    icono: UserRound,
  },
];

export default function BarraLateralAlumno() {
  const { keycloak } = useKeycloak();

  const cerrarSesion = () => {
    void keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#172019] text-white">
      <div className="border-b border-white/10 px-6 py-5">
        <h1 className="font-serif text-xl font-semibold">Abacontex</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {opcionesMenu.map((opcion) => {
            const Icono = opcion.icono;

            return (
              <li key={opcion.ruta}>
                <NavLink
                  to={opcion.ruta}
                  end={opcion.end}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-lg px-3 py-2',
                      'text-sm transition-colors',
                      isActive
                        ? 'bg-[#496647] text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white',
                    ].join(' ')
                  }
                >
                  <Icono size={18} />
                  <span>{opcion.nombre}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={cerrarSesion}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
