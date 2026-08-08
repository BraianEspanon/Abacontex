import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../guards/ProtectedRoute';

import EstructuraPanelAlumno from '../layouts/EstructuraPanelAlumno';
import EstructuraPanelDocente from '../layouts/EstructuraPanelDocente';

import InicioDocente from '../pages/docente/InicioDocente';
import PerfilDocente from '../pages/docente/PerfilDocente';
import EmpresasDocente from '../pages/docente/EmpresasDocente';

import CrearEmpresaPage from '../pages/empresa/CrearEmpresaPage';
import EditarEmpresaPage from '../pages/empresa/EditarEmpresaPage';
import MiEmpresaPage from '../pages/empresa/MiEmpresaPage';

import LandingPage from '../pages/LandingPage';
import ProductosPage from '../pages/producto/ProductosPage';
import RegistrarProductoPage from '../pages/producto/RegistrarProductoPage';
import RoleSelection from '../pages/RoleSelection';
import EditarProductoPage from '../pages/producto/EditarProductoPage';

import CEOBienvenida from '../pages/onboarding/CEOBienvenida';
import RedireccionInicial from '../pages/onboarding/RedireccionIncial';
import InvitacionPage from '../pages/onboarding/InvitacionPage';

import RegistroDocentePage from '../pages/docente/RegistroDocente';
import LoginDocente from '../pages/docente/LoginDocente';

// --- NUEVOS IMPORTS DE PEDIDOS ---
import PedidosPage from '../pages/pedido/PedidosPage';
import RegistrarPedidoPage from '../pages/pedido/RegistrarPedidoPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />

      {/* Decide a dónde redireccionar */}
      <Route
        path="/inicio"
        element={
          <ProtectedRoute>
            <RedireccionInicial />
          </ProtectedRoute>
        }
      />

      <Route
        path="onboarding/invitacion"
        element={
          <ProtectedRoute>
            <InvitacionPage />
          </ProtectedRoute>
        }
      />

      {/* Configuración inicial */}
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/onboarding/ceo"
        element={
          <ProtectedRoute>
            <CEOBienvenida />
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

      {/* Registro del docente */}
      <Route
        path="/docente/registro"
        element={
          <ProtectedRoute>
            <RegistroDocentePage />
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
        <Route path="empresas" element={<EmpresasDocente />} />
      </Route>

      <Route path="/docente/login" element={<LoginDocente />} />

      {/* Panel alumno */}
      <Route
        path="/alumno"
        element={
          <ProtectedRoute>
            <EstructuraPanelAlumno />
          </ProtectedRoute>
        }
      >
        <Route path="empresa" element={<MiEmpresaPage />} />
        <Route path="empresa/editar" element={<EditarEmpresaPage />} />

        <Route path="productos" element={<ProductosPage />} />
        <Route path="productos/registrar" element={<RegistrarProductoPage />} />
        <Route path="productos/:id/editar" element={<EditarProductoPage />} />

        {/* --- NUEVAS RUTAS DE PEDIDOS --- */}
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="pedidos/nuevo" element={<RegistrarPedidoPage />} />
      </Route>
    </Routes>
  );
}
