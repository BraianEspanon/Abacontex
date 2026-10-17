import { Outlet } from 'react-router-dom';

import BarraLateralDocente from '../components/docente/BarraLateralDocente';
import EncabezadoDocente from '../components/docente/EncabezadoDocente';

export default function EstructuraPanelDocente() {
  return (
    <div className="flex h-screen overflow-hidden bg-abacontex-light font-sans">
      <BarraLateralDocente />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <EncabezadoDocente />

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
