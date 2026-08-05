import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Settings,
  Wallet,
  Cpu,
  Megaphone,
  Network,
  Target,
  GraduationCap,
  ArrowRightFromLine,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import RoleCard from '../components/ui/RoleCard';
import Button from '../components/ui/Button';
import { useDatosRegistro } from '../hooks/useDatosRegistro';
import { useCompletarRegistro } from '../hooks/useCompletarRegistro';
import InvitacionRoleSelection from './onboarding/InvitacionRoleSelection';

const ROLE_ICONS: Record<string, LucideIcon> = {
  CEO: Briefcase,
  COO: Settings,
  CFO: Wallet,
  CTO: Cpu,
  CCO: Megaphone,
  CIO: Network,
  CMO: Target,
};

export default function RoleSelection() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const firstName =
    keycloak.tokenParsed?.given_name || keycloak.tokenParsed?.preferred_username || 'Alumno';

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const { data: datosRegistro, isLoading, isError } = useDatosRegistro();

  const {
    mutate: completarRegistro,
    isPending,
    isError: isRegistrationError,
  } = useCompletarRegistro();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontext-light-bg">
        <p className="text-lg text-abacontex-gray-text">Cargando cursos y roles...</p>
      </div>
    );
  }

  if (isError || !datosRegistro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abacontext-light-bg px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="mb-2 text-xl font-bold text-abacontex-black-text">
            No pudimos cargar la información
          </h1>

          <p className="text-abacontex-gray-text">
            Ocurrió un error al obtener los datos del registro. Intentá nuevamente.
          </p>
        </div>
      </div>
    );
  }

  const roles = datosRegistro.rolesEmpresa;

  const selectedRole = roles.find((role) => role.idRol === selectedRoleId);

  const isFormValid = selectedRoleId !== null && selectedCourseId !== null && !isPending;

  const handleContinue = () => {
    if (selectedRoleId === null) {
      return;
    }

    if (datosRegistro.tipo === 'NORMAL') {
      if (selectedCourseId === null) {
        return;
      }

      completarRegistro(
        {
          idCurso: selectedCourseId,
          idRolEmpresa: selectedRoleId,
        },
        {
          onSuccess: () => {
            if (selectedRole?.nombreRol.toUpperCase() === 'CEO') {
              navigate('/onboarding/ceo', { replace: true });
              return;
            }

            navigate('/alumno/empresa', { replace: true });
          },
        }
      );

      return;
    }

    completarRegistro(
      {
        idRolEmpresa: selectedRoleId,
      },
      {
        onSuccess: () => {
          navigate('/alumno/empresa', { replace: true });
        },
      }
    );
  };

  if (datosRegistro.tipo === 'INVITACION') {
    return (
      <InvitacionRoleSelection
        firstName={firstName}
        datosRegistro={datosRegistro}
        selectedRoleId={selectedRoleId}
        isPending={isPending}
        hasError={isRegistrationError}
        onSelectRole={setSelectedRoleId}
        onComplete={handleContinue}
        onCancel={() => navigate('/inicio', { replace: true })}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-abacontext-light-bg px-4 py-10 font-sans sm:px-6">
      <div className="mb-8 w-full max-w-4xl overflow-hidden rounded-4xl bg-white shadow-xl shadow-abacontex-dark/5">
        {/* HEADER */}
        <div className="relative overflow-hidden bg-[#1d2620] px-8 py-10 text-center md:px-12 md:py-14">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#2d3a31] opacity-80 mix-blend-screen" />

          <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-[#2d3a31] opacity-80 mix-blend-screen" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-8 flex w-full max-w-87.5 items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6a9071] font-heading text-2xl font-bold text-white shadow-lg">
                1
              </div>

              <div className="h-1 flex-1 bg-[#6a9071] opacity-70" />

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6a9071] font-heading text-2xl font-bold text-white shadow-lg">
                2
              </div>
            </div>

            <h1 className="mb-3 font-heading text-5xl font-extrabold tracking-tight text-white">
              ¡Casi listo, {firstName}!
            </h1>

            <p className="max-w-lg font-heading text-xl font-light text-abacontex-light/80">
              Elegí tu rol en la empresa y tu curso para completar el registro
            </p>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="p-8 md:p-10">
          {/* CURSOS: SOLO REGISTRO NORMAL */}
          {datosRegistro.tipo === 'NORMAL' && (
            <section className="mb-10">
              <h2 className="mb-5 border-b border-abacontex-gray/20 pb-2 font-heading text-xl font-bold text-abacontex-black-text">
                Seleccioná tu curso
              </h2>

              {datosRegistro.cursos.length === 0 ? (
                <p className="text-abacontex-gray-text">No hay cursos disponibles.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {datosRegistro.cursos.map((curso) => (
                    <RoleCard
                      key={curso.idCurso}
                      id={curso.idCurso}
                      title={curso.nombreCurso}
                      description="Curso académico"
                      icon={GraduationCap}
                      isSelected={selectedCourseId === curso.idCurso}
                      onClick={setSelectedCourseId}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ROLES */}
          <section className="mb-8">
            <h2 className="mb-5 border-b border-abacontex-gray/20 pb-2 font-heading text-xl font-bold text-abacontex-black-text">
              Seleccioná tu rol
            </h2>

            {roles.length === 0 ? (
              <p className="text-abacontex-gray-text">No hay roles empresariales disponibles.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => {
                  const Icon = ROLE_ICONS[role.nombreRol.toUpperCase()] ?? Briefcase;

                  return (
                    <RoleCard
                      key={role.idRol}
                      id={role.idRol}
                      title={role.nombreRol}
                      description={role.descripcion}
                      icon={Icon}
                      isSelected={selectedRoleId === role.idRol}
                      onClick={setSelectedRoleId}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {isRegistrationError && (
            <p className="mb-4 text-center text-sm font-medium text-red-600">
              No pudimos guardar tu curso y rol. Intentá nuevamente.
            </p>
          )}

          {/* BOTÓN */}
          <div className="flex flex-col items-center justify-end pt-6">
            <div
              className={`transition-all duration-300 ${
                !isFormValid ? 'cursor-not-allowed opacity-50 grayscale' : 'opacity-100'
              }`}
            >
              <Button
                label={isPending ? 'Guardando...' : 'Completar registro'}
                variant={isFormValid ? 'solid' : 'outline'}
                icon={
                  <ArrowRightFromLine className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                }
                onClick={handleContinue}
                disabled={!isFormValid}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
