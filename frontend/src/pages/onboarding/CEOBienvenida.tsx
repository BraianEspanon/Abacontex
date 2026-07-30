import { Building2, Users, ArrowRight, TrophyIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';

export default function CEOBienvenida() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/onboarding/empresa');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-abacontext-light-bg px-4 py-10 font-sans sm:px-6">
      <section className="w-full max-w-4xl overflow-hidden rounded-4xl bg-white shadow-xl shadow-abacontex-dark/5">
        <header className="relative overflow-hidden bg-abacontex-dark px-8 py-12 text-center md:px-14 md:py-16">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-abacontex-primary opacity-20" />
          <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-abacontex-primary-three opacity-20" />

          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-abacontex-primary-three text-white shadow-lg">
              <Building2 className="h-10 w-10" />
            </div>

            <h1 className="mb-4 font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              ¡Bienvenido, CEO!
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-abacontex-light/80">
              Como CEO de tu equipo, tu misión es crear la empresa, armar el equipo y liderar la
              simulación. ¡Empecemos!
            </p>
          </div>
        </header>

        <div className="p-8 md:p-12">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-abacontex-black-text">
            Tus próximos pasos
          </h2>

          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-abacontex-gray/20 bg-abacontex-light-bg p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-abacontex-primary text-white">
                <Building2 className="h-7 w-7" />
              </div>

              <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-abacontex-primary-three">
                Paso 1
              </span>

              <h3 className="mb-3 font-heading text-xl font-bold text-abacontex-black-text">
                Crear la empresa
              </h3>

              <p className="leading-relaxed text-abacontex-gray-text">
                Definí el nombre, rubro y logo que va a representarlos.
              </p>
            </article>

            <article className="rounded-3xl border border-abacontex-gray/20 bg-abacontex-light-bg p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-abacontex-primary text-white">
                <Users className="h-7 w-7" />
              </div>

              <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-abacontex-primary-three">
                Paso 2
              </span>

              <h3 className="mb-3 font-heading text-xl font-bold text-abacontex-black-text">
                Sumá a tu equipo
              </h3>

              <p className="leading-relaxed text-abacontex-gray-text">
                Buscá a tus compañeros registrados o invitalos por correo.
              </p>
            </article>

            <article className="rounded-3xl border border-abacontex-gray/20 bg-abacontex-light-bg p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-abacontex-primary text-white">
                <TrophyIcon className="h-7 w-7" />
              </div>

              <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-abacontex-primary-three">
                Paso 3
              </span>

              <h3 className="mb-3 font-heading text-xl font-bold text-abacontex-black-text">
                ¡A competir!
              </h3>

              <p className="leading-relaxed text-abacontex-gray-text">
                Empezá la simulación y tomá las primeras decisiones estratégicas.
              </p>
            </article>
          </div>

          <div className="flex justify-center">
            <Button
              label="Crear mi empresa"
              variant="solid"
              icon={<ArrowRight className="ml-2 h-5 w-5" />}
              onClick={handleContinue}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
