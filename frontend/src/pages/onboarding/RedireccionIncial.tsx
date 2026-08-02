import { Navigate } from 'react-router-dom';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useInvitacion } from '../../hooks/useInvitacion';

export default function RedireccionInicial() {
  const { data: alumno, isLoading: isLoadingAlumno, isError: isAlumnoError } = useAlumnoActual();

  const debeConsultarInvitacion = alumno?.registroCompleto === false;

  const {
    data: invitacion,
    isLoading: isLoadingInvitacion,
    isError: isInvitacionError,
  } = useInvitacion(debeConsultarInvitacion);

  if (isLoadingAlumno) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontext-light-bg">
        <p className="text-lg text-abacontex-gray-text">Cargando tu información...</p>
      </div>
    );
  }

  if (isAlumnoError || !alumno) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontext-light-bg px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="mb-2 text-xl font-bold text-abacontex-black-text">
            No pudimos cargar tu perfil
          </h1>

          <p className="text-abacontex-gray-text">
            Ocurrió un error al obtener la información de tu cuenta. Intentá nuevamente.
          </p>
        </div>
      </div>
    );
  }

  if (alumno.registroCompleto) {
    return <Navigate to="/alumno/empresa" replace />;
  }

  if (isLoadingInvitacion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontext-light-bg">
        <p className="text-lg text-abacontex-gray-text">Verificando si tenés una invitación...</p>
      </div>
    );
  }

  if (isInvitacionError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontext-light-bg px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="mb-2 text-xl font-bold text-abacontex-black-text">
            No pudimos verificar tu invitación
          </h1>

          <p className="text-abacontex-gray-text">
            Ocurrió un error al consultar el estado de tu registro. Intentá nuevamente.
          </p>
        </div>
      </div>
    );
  }

  if (invitacion?.estado === 'PENDIENTE') {
    return <Navigate to="/onboarding/invitacion" replace />;
  }

  return <Navigate to="/setup" replace />;
}
