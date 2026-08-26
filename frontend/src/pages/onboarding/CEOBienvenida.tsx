import { ArrowRight } from 'lucide-react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';

import BokehContainer from '../../components/ui/BokehContainer';
import Button from '../../components/ui/Button';

const PASOS_CEO = [
  {
    numero: 1,
    titulo: 'Creá tu empresa',
    descripcion: 'Definí el nombre, rubro y logo que va a representarlos.',
  },
  {
    numero: 2,
    titulo: 'Sumá a tu equipo',
    descripcion: 'Buscá a tus compañeros registrados o invitalos por correo.',
  },
  {
    numero: 3,
    titulo: '¡A competir!',
    descripcion: 'Empezá la simulación y tomá las primeras decisiones estratégicas.',
  },
];

export default function CEOBienvenida() {
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  const firstName =
    keycloak.tokenParsed?.given_name ?? keycloak.tokenParsed?.name?.split(' ')[0] ?? 'CEO';

  const handleContinue = () => {
    navigate('/alumno/empresa/crear');
  };

  return (
    <main className="min-h-screen bg-abacontex-dark font-sans text-white">
      <BokehContainer className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
          {/* PRESENTACIÓN */}
          <header className="mb-12 max-w-4xl text-center md:mb-16">
            <h1 className="mb-6 font-heading text-4xl font-extrabold leading-tight tracking-wide text-abacontex-light sm:text-5xl lg:text-6xl">
              ¡Bienvenid@, {firstName}!
            </h1>

            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
              Como <strong className="font-bold">CEO</strong> de tu equipo, tu misión es crear la
              empresa, armar el equipo y liderar la simulación. ¡Empecemos!
            </p>
          </header>

          {/* PASOS */}
          <div className="mb-10 grid w-full max-w-4xl gap-8 md:grid-cols-3">
            {PASOS_CEO.map((paso) => (
              <article
                key={paso.numero}
                className="relative flex min-h-60 flex-col items-center rounded-2xl bg-abacontex-light/60 px-5 pb-7 pt-20 text-center text-abacontex-black-text shadow-lg backdrop-blur-sm"
              >
                <div className="absolute -top-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#9A7A61] font-heading text-6xl font-extrabold text-white shadow-md">
                  {paso.numero}
                </div>

                <h2 className="mb-4 font-heading text-2xl font-extrabold leading-tight">
                  {paso.titulo}
                </h2>

                <p className="text-base leading-snug text-[#2C2C2C] sm:text-lg">
                  {paso.descripcion}
                </p>
              </article>
            ))}
          </div>

          {/* ACCIÓN */}
          <Button
            label="Crear mi empresa"
            variant="solid"
            icon={<ArrowRight className="h-5 w-5" />}
            className="rounded-full px-8"
            onClick={handleContinue}
          />
        </section>
      </BokehContainer>
    </main>
  );
}
