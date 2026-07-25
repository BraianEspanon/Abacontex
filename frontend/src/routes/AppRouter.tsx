import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../guards/ProtectedRoute';
import EstructuraPanelDocente from '../layouts/EstructuraPanelDocente';
import InicioDocente from '../pages/docente/InicioDocente';
import PerfilDocente from '../pages/docente/PerfilDocente';
import LandingPage from '../pages/LandingPage';
import RoleSelection from '../pages/RoleSelection';
import CrearEmpresaPage from '../pages/empresa/CrearEmpresaPage';
import EstructuraPanelAlumno from '../layouts/EstructuraPanelAlumno';
import EditarEmpresaPage from '../pages/empresa/EditarEmpresaPage';
import MiEmpresaPage from '../pages/empresa/MiEmpresaPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />

      {/* Configuración inicial */}
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        }
      />

      {/* Crear empresa */}
      <Route
        path="/empresa/crear"
        element={
          <ProtectedRoute>
            <CrearEmpresaPage />
          </ProtectedRoute>
        }
      />

      {/* Panel docente */}
      <Route
        path="/docente"
        element={
          <ProtectedRoute>
            <EstructuraPanelDocente />
          </ProtectedRoute>
        }
      >
        <Route index element={<InicioDocente />} />
        <Route path="perfil" element={<PerfilDocente />} />
      </Route>

      {/* Panel alumno */}
      <Route
        path="/alumno"
        element={
          <ProtectedRoute>
            <EstructuraPanelAlumno />
          </ProtectedRoute>
        }
      >
        <Route path="empresa/editar" element={<EditarEmpresaPage />} />
      </Route>
      <Route path="/alumno" element={<EstructuraPanelAlumno />}>
        <Route path="empresa" element={<MiEmpresaPage />} />

        <Route path="empresa/editar" element={<EditarEmpresaPage />} />
      </Route>
    </Routes>
  );
}
