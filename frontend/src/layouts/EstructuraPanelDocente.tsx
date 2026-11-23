import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import BarraLateralDocente from '../components/docente/BarraLateralDocente';
import EncabezadoDocente from '../components/docente/EncabezadoDocente';

export default function EstructuraPanelDocente() {
  const [sidebarColapsado, setSidebarColapsado] = useState(false);

  const alternarSidebar = () => {
    setSidebarColapsado((valorActual) => !valorActual);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-abacontex-light font-sans">
      <BarraLateralDocente colapsado={sidebarColapsado} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <EncabezadoDocente
          sidebarColapsado={sidebarColapsado}
          onAlternarSidebar={alternarSidebar}
        />

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
