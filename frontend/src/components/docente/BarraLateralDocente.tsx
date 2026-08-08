import { NavLink } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Medal,
  NotebookText,
  Settings,
  UserRound,
  UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useUsuarioActual } from '../../hooks/useUsuarioActual';

interface OpcionMenu {
  etiqueta: string;
  icono: LucideIcon;
  ruta?: string;
}

const opcionesMenu: OpcionMenu[] = [
  {
    etiqueta: 'Panel docente',
    icono: LayoutDashboard,
    ruta: '/docente',
  },
  {
    etiqueta: 'Cursos',
    icono: GraduationCap,
  },
  {
    etiqueta: 'Empresas',
    icono: Building2,
    ruta: '/docente/empresas',
  },
  {
    etiqueta: 'Alumnos',
    icono: UsersRound,
  },
  {
    etiqueta: 'Simulación empresarial',
    icono: BriefcaseBusiness,
  },
  {
    etiqueta: 'Ejercicios',
    icono: NotebookText,
  },
  {
    etiqueta: 'Correcciones',
    icono: ClipboardCheck,
  },
  {
    etiqueta: 'Gamificación',
    icono: Medal,
  },
  {
    etiqueta: 'Métricas',
    icono: ChartNoAxesCombined,
  },
  {
    etiqueta: 'Administración',
    icono: Settings,
  },
  {
    etiqueta: 'Manual de cuentas',
    icono: BookOpen,
  },
  {
    etiqueta: 'Perfil',
    icono: UserRound,
    ruta: '/docente/perfil',
  },
];

export default function BarraLateralDocente() {
  const { keycloak } = useKeycloak();
  const { data: usuario, isLoading: cargandoUsuario } = useUsuarioActual();

  const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Docente';

  const iniciales = usuario
    ? `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase()
    : 'DO';

  const nombreRol =
    usuario?.rolSistema?.nombreRol === 'DOCENTE'
      ? 'Docente'
      : (usuario?.rolSistema?.nombreRol ?? 'Docente');

  const cerrarSesion = () => {
    void keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#17231b] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#769a75]">
          <span className="text-lg font-bold">✦</span>
        </div>

        <div>
          <p className="font-heading text-lg font-bold tracking-wide">ABACONTEX</p>

          <p className="text-xs text-white/60">Panel docente</p>
        </div>
      </div>

      {/* Menú */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {opcionesMenu.map(({ etiqueta, icono: Icono, ruta }) => {
          if (ruta) {
            return (
              <NavLink
                key={etiqueta}
                to={ruta}
                end={ruta === '/docente'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-abacontex-primary-three font-medium text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white',
                  ].join(' ')
                }
              >
                <Icono size={18} />
                <span>{etiqueta}</span>
              </NavLink>
            );
          }

          return (
            <button
              key={etiqueta}
              type="button"
              className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/55"
              disabled
              title="Próximamente"
            >
              <Icono size={18} />
              <span>{etiqueta}</span>
            </button>
          );
        })}
      </nav>

      {/* Usuario */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f0e9] text-sm font-semibold text-[#17231b]">
            {cargandoUsuario ? '...' : iniciales}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {cargandoUsuario ? 'Cargando...' : nombreCompleto}
            </p>

            <p className="text-xs text-white/60">{cargandoUsuario ? '...' : nombreRol}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={cerrarSesion}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
