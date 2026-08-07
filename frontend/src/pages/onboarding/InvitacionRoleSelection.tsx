import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Cpu,
  GraduationCap,
  Megaphone,
  Network,
  Settings,
  Target,
  Wallet,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { RegistroInvitacionResponse } from '../../types/registro.types';

import Button from '../../components/ui/Button';
import RoleCard from '../../components/ui/RoleCard';

interface InvitacionRoleSelectionProps {
  firstName: string;
  datosRegistro: RegistroInvitacionResponse;
  selectedRoleId: number | null;
  isPending: boolean;
  hasError: boolean;
  onSelectRole: (idRol: number) => void;
  onComplete: () => void;
  onCancel: () => void;
}

const ROLE_ICONS: Record<string, LucideIcon> = {
  COO: Settings,
  CFO: Wallet,
  CTO: Cpu,
  CCO: Megaphone,
  CIO: Network,
  CMO: Target,
};

export default function InvitacionRoleSelection({
  firstName,
  datosRegistro,
  selectedRoleId,
  isPending,
  hasError,
  onSelectRole,
  onComplete,
  onCancel,
}: InvitacionRoleSelectionProps) {
  const puedeCompletar = selectedRoleId !== null && !isPending;

  return (
    <main className="min-h-screen bg-[#F8F6F2] px-4 py-10 font-sans sm:px-6">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_16px_45px_rgba(26,31,26,0.08)]">
        {/* HEADER INTEGRADO */}
        <header className="relative overflow-hidden bg-[#1A1F1A] px-6 py-10 text-center text-white sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -bottom-20 -left-14 h-40 w-40 rounded-full bg-[#3E4E42]" />

          <div className="pointer-events-none absolute -right-8 -top-16 h-44 w-44 rounded-full bg-[#3E4E42]" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-7 flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6A8F65] text-lg font-semibold">
                1
              </div>

              <div className="h-1 w-40 bg-[#6A8F65] sm:w-60" />

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6A8F65] text-lg font-semibold">
                2
              </div>
            </div>

            <h1 className="mb-3 font-heading text-4xl font-bold sm:text-5xl">
              ¡Casi listo, {firstName}!
            </h1>

            <p className="text-base text-white/75 sm:text-lg">
              Elegí tu rol dentro de la empresa y completá tu registro
            </p>
          </div>
        </header>

        {/* CONTENIDO */}
        <section className="p-6 sm:p-9">
          {/* DATOS DE LA INVITACIÓN */}
          <div className="mb-9">
            <h2 className="mb-5 font-heading text-2xl font-bold text-[#1A1F1A]">
              Datos de la invitación
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-[#D7DCD5] bg-[#F8F6F2] px-5 py-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EEE6]">
                  <Building2 className="h-5 w-5 text-[#3A5137]" />
                </div>

                <div>
                  <p className="mb-1 text-sm text-[#6B7280]">Empresa</p>

                  <p className="font-semibold text-[#1A1F1A]">{datosRegistro.empresa.nombre}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[#D7DCD5] bg-[#F8F6F2] px-5 py-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EEE6]">
                  <GraduationCap className="h-5 w-5 text-[#3A5137]" />
                </div>

                <div>
                  <p className="mb-1 text-sm text-[#6B7280]">Curso</p>

                  <p className="font-semibold text-[#1A1F1A]">{datosRegistro.curso.nombreCurso}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ROLES */}
          <div>
            <h2 className="mb-5 font-heading text-2xl font-bold text-[#1A1F1A]">Elegí tu rol</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {datosRegistro.rolesEmpresa.map((role) => {
                const Icon = ROLE_ICONS[role.nombreRol.toUpperCase()] ?? BriefcaseBusiness;

                return (
                  <RoleCard
                    key={role.idRol}
                    id={role.idRol}
                    title={role.nombreRol}
                    description={role.descripcion}
                    icon={Icon}
                    isSelected={selectedRoleId === role.idRol}
                    onClick={onSelectRole}
                  />
                );
              })}
            </div>
          </div>

          {hasError && (
            <p className="mt-6 text-center text-sm font-medium text-red-600">
              No pudimos completar el registro. Intentá nuevamente.
            </p>
          )}

          {/* ACCIONES */}
          <div className="mt-10 flex flex-col-reverse items-center justify-center gap-3 border-t border-[#E5E7EB] pt-7 sm:flex-row">
            <Button
              label="Cancelar"
              variant="outline"
              icon={<X className="h-5 w-5" />}
              onClick={onCancel}
              disabled={isPending}
            />

            <Button
              label={isPending ? 'Guardando...' : 'Completar registro'}
              variant="solid"
              icon={<ArrowRight className="h-5 w-5" />}
              onClick={onComplete}
              disabled={!puedeCompletar}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
