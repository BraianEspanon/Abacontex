import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import BarraLateralAlumno from '../components/alumno/BarraLateralAlumno';
import EncabezadoAlumno from '../components/alumno/EncabezadoAlumno';

const titulosPorRuta: Record<string, string> = {
  '/alumno': 'Inicio',
  '/alumno/empresa/editar': 'Editar empresa',

  '/alumno/productos': 'Productos',
  '/alumno/productos/registrar': 'Registrar producto',

  '/alumno/pedidos': 'Pedidos',
  '/alumno/pedidos/registrar': 'Registrar pedido',

  '/alumno/produccion': 'Producción',
  '/alumno/ventas': 'Ventas',
  '/alumno/facturacion': 'Facturación',
  '/alumno/facturacion/ventas-pendientes': 'Facturación',
  '/alumno/facturacion/nueva': 'Generar factura',

  '/alumno/finanzas': 'Finanzas',

  '/alumno/contabilidad': 'Contabilidad',
  '/alumno/contabilidad/libro-diario': 'Libro diario',

  '/alumno/ejercicios': 'Mis ejercicios',
  '/alumno/simulacion': 'Simulación empresarial',
  '/alumno/logros': 'Logros',
  '/alumno/manual-cuentas': 'Manual de cuentas',
  '/alumno/perfil': 'Perfil',
  '/alumno/perfil/editar': 'Perfil',
};

function obtenerTituloPorRuta(pathname: string) {
  if (pathname.startsWith('/alumno/contabilidad/asientos/registrar/')) {
    return 'Registrar asiento';
  }

  if (pathname.startsWith('/alumno/contabilidad/asientos/') && pathname.endsWith('/editar')) {
    return 'Editar asiento';
  }

  if (pathname.startsWith('/alumno/simulacion')) {
    return 'Simulación empresarial';
  }

  return titulosPorRuta[pathname] ?? 'Panel del alumno';
}

export default function EstructuraPanelAlumno() {
  const location = useLocation();

  const [sidebarColapsado, setSidebarColapsado] = useState(false);

  const titulo = obtenerTituloPorRuta(location.pathname);

  const alternarSidebar = () => {
    setSidebarColapsado((valorActual) => !valorActual);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f5f1] font-sans">
      <BarraLateralAlumno colapsado={sidebarColapsado} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <EncabezadoAlumno
          titulo={titulo}
          sidebarColapsado={sidebarColapsado}
          onAlternarSidebar={alternarSidebar}
        />

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
