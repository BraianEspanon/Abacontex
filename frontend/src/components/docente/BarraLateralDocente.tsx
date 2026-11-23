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
import { NavLink } from 'react-router-dom';
import type { BarraLateralProps } from '../../types/ui.types';
import { useUsuarioActual } from '../../hooks/useUsuarioActual';
import LogoAbacontex from '../ui/LogoAbacontex';

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
    ruta: '/docente/simulaciones',
  },
  {
    etiqueta: 'Ejercicios',
    icono: NotebookText,
    ruta: '/docente/ejercicios',
  },
  {
    etiqueta: 'Correcciones',
    icono: ClipboardCheck,
    ruta: '/docente/correcciones',
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
    ruta: '/docente/manual-cuentas',
  },
  {
    etiqueta: 'Perfil',
    icono: UserRound,
    ruta: '/docente/perfil',
  },
];

export default function BarraLateralDocente({ colapsado }: BarraLateralProps) {
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
    <aside
      className={[
        'flex h-screen shrink-0 flex-col bg-[#17231b] text-white',
        'transition-[width] duration-300 ease-in-out',
        colapsado ? 'w-18' : 'w-60',
      ].join(' ')}
    >
      <div className="border-b border-white/10">
        <LogoAbacontex colapsado={colapsado} />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {opcionesMenu.map(({ etiqueta, icono: Icono, ruta }) => {
          if (ruta) {
            return (
              <NavLink
                key={etiqueta}
                to={ruta}
                end={ruta === '/docente'}
                title={colapsado ? etiqueta : undefined}
                className={({ isActive }) =>
                  [
                    'flex items-center rounded-lg py-2.5 text-sm transition-colors',
                    colapsado ? 'justify-center px-2' : 'gap-3 px-3',
                    isActive
                      ? 'bg-abacontex-primary-three font-medium text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white',
                  ].join(' ')
                }
              >
                <Icono size={20} className="shrink-0" />

                {!colapsado && <span>{etiqueta}</span>}
              </NavLink>
            );
          }

          return (
            <button
              key={etiqueta}
              type="button"
              disabled
              title={colapsado ? `${etiqueta} - Próximamente` : 'Próximamente'}
              className={[
                'flex w-full cursor-not-allowed items-center rounded-lg py-2.5 text-sm text-white/55',
                colapsado ? 'justify-center px-2' : 'gap-3 px-3 text-left',
              ].join(' ')}
            >
              <Icono size={20} className="shrink-0" />

              {!colapsado && <span>{etiqueta}</span>}
            </button>
          );
        })}
      </nav>

      <div className={['border-t border-white/10', colapsado ? 'px-2 py-4' : 'p-4'].join(' ')}>
        <div
          className={['mb-4 flex items-center', colapsado ? 'justify-center' : 'gap-3'].join(' ')}
        >
          <div
            title={colapsado ? nombreCompleto : undefined}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2f0e9] text-sm font-semibold text-[#17231b]"
          >
            {cargandoUsuario ? '...' : iniciales}
          </div>

          {!colapsado && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {cargandoUsuario ? 'Cargando...' : nombreCompleto}
              </p>

              <p className="text-xs text-white/60">{cargandoUsuario ? '...' : nombreRol}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={cerrarSesion}
          title={colapsado ? 'Cerrar sesión' : undefined}
          className={[
            'flex w-full items-center rounded-lg py-2 text-sm text-white/75 transition-colors',
            'hover:bg-white/10 hover:text-white',
            colapsado ? 'justify-center px-2' : 'gap-3 px-3',
          ].join(' ')}
        >
          <LogOut size={19} className="shrink-0" />

          {!colapsado && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
