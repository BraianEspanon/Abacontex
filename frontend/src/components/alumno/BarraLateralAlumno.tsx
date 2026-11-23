import { useKeycloak } from '@react-keycloak/web';
import {
  BadgeDollarSign,
  BookOpen,
  Building2,
  Calculator,
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
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import LogoAbacontex from '../ui/LogoAbacontex';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';

import type { BarraLateralProps } from '../../types/ui.types';

import { esCursoSexto } from '../../utils/curso.utils';

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
    nombre: 'Productos',
    ruta: '/alumno/productos',
    icono: Package,
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
    soloSexto: true,
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
    icono: BadgeDollarSign,
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

export default function BarraLateralAlumno({ colapsado }: BarraLateralProps) {
  const { keycloak } = useKeycloak();

  const { data: alumno, isLoading: cargandoAlumno, isError: errorAlumno } = useAlumnoActual();

  const nombreCompleto = alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Alumno';

  const iniciales = alumno
    ? `${alumno.nombre.charAt(0)}${alumno.apellido.charAt(0)}`.toUpperCase()
    : 'AL';

  const cerrarSesion = () => {
    void keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const mostrarProduccion = !cargandoAlumno && !errorAlumno && esCursoSexto(alumno?.curso?.nombre);

  return (
    <aside
      className={[
        'flex h-screen shrink-0 flex-col bg-[#17231b] text-white',
        'transition-[width] duration-300 ease-in-out',
        colapsado ? 'w-18' : 'w-60',
      ].join(' ')}
    >
      {/* Logo */}
      <div className="border-b border-white/10">
        <LogoAbacontex colapsado={colapsado} />
      </div>

      {/* Menú */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {opcionesMenu.map((opcion) => {
            if (opcion.soloSexto && !mostrarProduccion) {
              return null;
            }

            const Icono = opcion.icono;

            return (
              <li key={opcion.ruta}>
                <NavLink
                  to={opcion.ruta}
                  end={opcion.end}
                  title={colapsado ? opcion.nombre : undefined}
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

                  {!colapsado && <span>{opcion.nombre}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Usuario y cerrar sesión */}
      <div className={['border-t border-white/10', colapsado ? 'px-2 py-4' : 'p-4'].join(' ')}>
        <div
          className={['mb-4 flex items-center', colapsado ? 'justify-center' : 'gap-3'].join(' ')}
        >
          <div
            title={colapsado ? nombreCompleto : undefined}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2f0e9] text-sm font-semibold text-[#17231b]"
          >
            {cargandoAlumno ? '...' : iniciales}
          </div>

          {!colapsado && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {cargandoAlumno ? 'Cargando...' : nombreCompleto}
              </p>

              <p className="text-xs text-white/60">{cargandoAlumno ? '...' : 'Alumno'}</p>
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
