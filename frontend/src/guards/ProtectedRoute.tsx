import {Navigate} from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import type { ReactNode } from 'react';

export default function ProtectedRoute ({children}: {children: ReactNode}) {
    const {keycloak, initialized} = useKeycloak()

    if (!initialized) {
        return <div className="min-h-screen flex items-center justify-center bg-abacontex-light font-sans text-abacontex-gray-text">Cargando seguridad...</div>;
    }

    if (!keycloak.authenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}