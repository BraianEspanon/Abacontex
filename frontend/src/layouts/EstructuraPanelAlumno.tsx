import { Outlet, useLocation } from 'react-router-dom';

import BarraLateralAlumno from '../components/alumno/BarraLateralAlumno';
import EncabezadoAlumno from '../components/alumno/EncabezadoAlumno';

const titulosPorRuta: Record<string, string> = {
  '/alumno': 'Inicio',
  '/alumno/empresa/editar': 'Editar empresa',
  '/alumno/inventario': 'Inventario',
  '/alumno/pedidos': 'Pedidos',
  '/alumno/produccion': 'Producción',
  '/alumno/ventas': 'Ventas',
  '/alumno/facturacion': 'Facturación',
  '/alumno/finanzas': 'Finanzas',
  '/alumno/contabilidad': 'Contabilidad',
  '/alumno/ejercicios': 'Mis ejercicios',
  '/alumno/simulacion': 'Simulación empresarial',
  '/alumno/logros': 'Logros',
  '/alumno/manual-cuentas': 'Manual de cuentas',
  '/alumno/perfil': 'Perfil',
};

export default function EstructuraPanelAlumno() {
  const location = useLocation();

  const titulo = titulosPorRuta[location.pathname] ?? 'Panel del alumno';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f5f1]">
      <BarraLateralAlumno />

      <div className="flex min-w-0 flex-1 flex-col">
        <EncabezadoAlumno titulo={titulo} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
