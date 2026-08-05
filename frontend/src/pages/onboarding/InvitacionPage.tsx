import { ArrowRight, Building2, GraduationCap, Mail, UserRound } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useInvitacion } from '../../hooks/useInvitacion';
import { useAceptarInvitacion } from '../../hooks/useAceptarInvitacion';
import { useRechazarInvitacion } from '../../hooks/useRechazarInvitacion';
import Button from '../../components/ui/Button';

export default function InvitacionPage() {
  const navigate = useNavigate();

  const { data: invitacion, isLoading, isError } = useInvitacion();

  const aceptarInvitacion = useAceptarInvitacion();
  const rechazarInvitacion = useRechazarInvitacion();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontex-light">
        <p className="font-sans text-abacontex-gray-text">Cargando invitación...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontex-light">
        <p className="font-sans text-abacontex-gray-text">No pudimos cargar la invitación.</p>
      </div>
    );
  }

  if (!invitacion) {
    return <Navigate to="/setup" replace />;
  }

  if (invitacion.estado === 'ACEPTADA') {
    return <Navigate to="/setup" replace />;
  }

  const invitacionActiva = invitacion;

  const nombreInvitador = `${invitacion.createdBy.nombre} ${invitacion.createdBy.apellido}`;

  function handleAceptar() {
    aceptarInvitacion.mutate(invitacionActiva.id, {
      onSuccess: () => {
        navigate('/setup', { replace: true });
      },
    });
  }

  function handleRechazar() {
    rechazarInvitacion.mutate(invitacionActiva.id, {
      onSuccess: () => {
        navigate('/setup', { replace: true });
      },
    });
  }

  const procesando = aceptarInvitacion.isPending || rechazarInvitacion.isPending;

  return (
    <div className="min-h-screen bg-abacontex-light font-sans">
      <header className="relative flex h-28 items-center justify-center overflow-hidden bg-abacontex-dark shadow-md">
        <div className="absolute -left-12 -top-8 h-28 w-28 rounded-full bg-abacontex-primary/30" />
        <div className="absolute left-1/4 -top-16 h-32 w-32 rounded-full bg-abacontex-primary/25" />
        <div className="absolute right-1/4 top-10 h-14 w-14 rounded-full bg-abacontex-primary/30" />
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-abacontex-primary/30" />

        <img
          src="/img/Logo.png"
          alt="Abacontex"
          className="relative z-10 mx-auto h-22 w-auto object-contain mb-2"
        />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-14 pt-4">
        <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#cde7c5]">
          <Mail className="h-10 w-10 text-abacontex-primary" strokeWidth={1.8} />
        </div>

        <h1 className="mt-7 text-center font-heading text-4xl font-bold tracking-wide text-abacontex-black-text">
          ¡Te invitaron a una empresa!
        </h1>

        <p className="mt-5 text-center text-base text-abacontex-gray-text">
          Sumate al equipo para continuar tu registro en Abacontex
        </p>

        <section className="mt-9 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <h2 className="px-6 pb-3 pt-6 font-medium text-abacontex-primary-three">
            Resumen de la invitación
          </h2>

          <div className="flex items-center gap-4 border-b border-gray-200 px-8 py-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <Building2 className="h-7 w-7 text-abacontex-primary" strokeWidth={1.7} />
            </div>

            <span className="text-sm text-abacontex-gray-text">Empresa</span>

            <strong className="ml-auto text-sm font-semibold text-abacontex-black-text">
              {invitacionActiva.empresa.nombre}
            </strong>
          </div>

          <div className="flex items-center gap-4 border-b border-gray-200 px-8 py-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <GraduationCap className="h-7 w-7 text-abacontex-primary" strokeWidth={1.7} />
            </div>

            <span className="text-sm text-abacontex-gray-text">Curso</span>

            <strong className="ml-auto text-sm font-semibold text-abacontex-black-text">
              {invitacionActiva.empresa.curso.nombreCurso}
            </strong>
          </div>

          <div className="flex items-center gap-4 px-8 py-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <UserRound className="h-7 w-7 text-abacontex-primary" strokeWidth={1.7} />
            </div>

            <span className="text-sm text-abacontex-gray-text">Invitado por</span>

            <strong className="ml-auto text-sm font-semibold text-abacontex-black-text">
              {nombreInvitador}
            </strong>
          </div>
        </section>

        <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
          <Button
            label={rechazarInvitacion.isPending ? 'Rechazando...' : 'Rechazar'}
            variant="outline"
            onClick={handleRechazar}
            disabled={procesando}
          />

          <Button
            label={aceptarInvitacion.isPending ? 'Aceptando...' : 'Aceptar invitación'}
            variant="solid"
            icon={<ArrowRight className="h-5 w-5" />}
            onClick={handleAceptar}
            disabled={procesando}
          />
        </div>
      </main>
    </div>
  );
}
