import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import RoleSelection from '../pages/RoleSelection';
import ProtectedRoute from '../guards/ProtectedRoute';
import EstructuraPanelDocente from '../layouts/EstructuraPanelDocente';
import InicioDocente from '../pages/docente/InicioDocente';

export default function appRouter() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<LandingPage />} />

      {/* Ruta privada */}
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        }
      />
      <Route
  path="/docente"
  element={
    <ProtectedRoute>
      <EstructuraPanelDocente />
    </ProtectedRoute>
  }
>
  <Route index element={<InicioDocente />} />
</Route>
    </Routes>
    
    
  );
}
