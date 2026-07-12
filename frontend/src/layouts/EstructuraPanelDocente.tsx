import { Outlet } from 'react-router-dom';
import BarraLateralDocente from '../components/docente/BarraLateralDocente';
import EncabezadoDocente from '../components/docente/EncabezadoDocente';

export default function EstructuraPanelDocente() {
  return (
    <div className="flex min-h-screen bg-[#f7f5f1]">
      <BarraLateralDocente />

      <div className="flex min-w-0 flex-1 flex-col">
        <EncabezadoDocente />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}