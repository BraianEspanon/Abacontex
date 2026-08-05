import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  GraduationCap,
  LockKeyhole,
  Mail,
  UserRound,
  Eye,
  EyeOff,
} from 'lucide-react';

import BokehContainer from '../../components/ui/BokehContainer';
import Button from '../../components/ui/Button';
import { useCursos } from '../../hooks/useCursos';
import { useCrearDocente } from '../../hooks/useCrearDocente';

interface DatosDocente {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

interface RequisitoPassword {
  texto: string;
  cumplido: boolean;
}

const DATOS_INICIALES: DatosDocente = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
};

export default function RegistroDocentePage() {
  const { keycloak } = useKeycloak();

  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [datos, setDatos] = useState<DatosDocente>(DATOS_INICIALES);
  const [cursoIds, setCursoIds] = useState<number[]>([]);
  const [mensajeError, setMensajeError] = useState('');

  const {
    data: cursos = [],
    isLoading: cargandoCursos,
    isError: errorCursos,
    refetch: recargarCursos,
  } = useCursos();

  const { mutate: ejecutarCrearDocente, isPending: creandoDocente } = useCrearDocente();

  const requisitosPassword: RequisitoPassword[] = [
    {
      texto: 'Mínimo 8 caracteres',
      cumplido: datos.password.length >= 8,
    },
    {
      texto: 'Una mayúscula',
      cumplido: /[A-Z]/.test(datos.password),
    },
    {
      texto: 'Una minúscula',
      cumplido: /[a-z]/.test(datos.password),
    },
    {
      texto: 'Un número',
      cumplido: /\d/.test(datos.password),
    },
  ];

  const passwordValida = requisitosPassword.every((requisito) => requisito.cumplido);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleCambiarDato = (campo: keyof DatosDocente, valor: string) => {
    setDatos((datosActuales) => ({
      ...datosActuales,
      [campo]: valor,
    }));

    if (mensajeError) {
      setMensajeError('');
    }
  };

  const handleContinuar = () => {
    const nombre = datos.nombre.trim();
    const apellido = datos.apellido.trim();
    const email = datos.email.trim();
    const password = datos.password;

    if (!nombre || !apellido || !email || !password.trim()) {
      setMensajeError('Completá todos los campos para continuar.');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido) {
      setMensajeError('Ingresá un correo electrónico válido.');
      return;
    }

    if (!passwordValida) {
      setMensajeError('La contraseña todavía no cumple con todos los requisitos.');
      return;
    }

    setMensajeError('');
    setPaso(2);
  };

  const handleToggleCurso = (idCurso: number) => {
    setCursoIds((cursosActuales) =>
      cursosActuales.includes(idCurso)
        ? cursosActuales.filter((id) => id !== idCurso)
        : [...cursosActuales, idCurso]
    );

    if (mensajeError) {
      setMensajeError('');
    }
  };

  const handleCrearCuenta = () => {
    if (cursoIds.length === 0) {
      setMensajeError('Seleccioná al menos un curso.');
      return;
    }

    setMensajeError('');

    ejecutarCrearDocente(
      {
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        email: datos.email.trim(),
        password: datos.password,
        cursoIds,
      },
      {
        onSuccess: () => {
          setPaso(3);
        },
        onError: (error) => {
          setMensajeError(
            error instanceof Error ? error.message : 'No se pudo crear la cuenta docente.'
          );
        },
      }
    );
  };

  const handleIngresar = async () => {
    await keycloak.logout({
      redirectUri: `${window.location.origin}/docente/login`,
    });
  };

  if (paso === 1) {
    return (
      <main className="min-h-screen bg-abacontex-dark font-sans text-white">
        <BokehContainer className="flex min-h-screen items-center px-5 py-10 sm:px-8 lg:px-14">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
            <section className="w-full">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-abacontex-primary-three font-semibold">
                  1
                </div>

                <div className="h-px w-12 bg-white/30" />

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/60">
                  2
                </div>
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-abacontex-primary-three">
                Registro docente
              </p>

              <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
                ¡Bienvenido docente!
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Completá tus datos para crear tu cuenta y comenzar a gestionar tus cursos en
                Abacontex.
              </p>

              <div className="mt-9 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="nombreDocente"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
                    Nombre
                  </label>

                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-abacontex-gray-text" />

                    <input
                      id="nombreDocente"
                      type="text"
                      value={datos.nombre}
                      onChange={(event) => handleCambiarDato('nombre', event.target.value)}
                      placeholder="Ingresá tu nombre"
                      autoComplete="given-name"
                      className="w-full rounded-full border border-transparent bg-abacontex-light py-3.5 pl-12 pr-4 text-abacontex-black-text outline-none transition placeholder:text-abacontex-gray-text/70 focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/30"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="apellidoDocente"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
                    Apellido
                  </label>

                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-abacontex-gray-text" />

                    <input
                      id="apellidoDocente"
                      type="text"
                      value={datos.apellido}
                      onChange={(event) => handleCambiarDato('apellido', event.target.value)}
                      placeholder="Ingresá tu apellido"
                      autoComplete="family-name"
                      className="w-full rounded-full border border-transparent bg-abacontex-light py-3.5 pl-12 pr-4 text-abacontex-black-text outline-none transition placeholder:text-abacontex-gray-text/70 focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/30"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="emailDocente"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
                    Correo electrónico
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-abacontex-gray-text" />

                    <input
                      id="emailDocente"
                      type="email"
                      value={datos.email}
                      onChange={(event) => handleCambiarDato('email', event.target.value)}
                      placeholder="nombre@ipgsanmartin.edu.ar"
                      autoComplete="email"
                      className="w-full rounded-full border border-transparent bg-abacontex-light py-3.5 pl-12 pr-4 text-abacontex-black-text outline-none transition placeholder:text-abacontex-gray-text/70 focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/30"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="passwordDocente"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
                    Contraseña
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-abacontex-gray-text" />

                    <input
                      id="passwordDocente"
                      type={mostrarPassword ? 'text' : 'password'}
                      value={datos.password}
                      onChange={(event) => handleCambiarDato('password', event.target.value)}
                      placeholder="Creá una contraseña segura"
                      autoComplete="new-password"
                      className="w-full rounded-full border border-transparent bg-abacontex-light py-3.5 pl-12 pr-12 text-abacontex-black-text outline-none transition placeholder:text-abacontex-gray-text/70 focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/30"
                    />

                    <button
                      type="button"
                      onClick={() => setMostrarPassword((estadoActual) => !estadoActual)}
                      aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-abacontex-gray-text transition hover:text-abacontex-primary focus:outline-none"
                    >
                      {mostrarPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {requisitosPassword.map((requisito) => (
                      <div
                        key={requisito.texto}
                        className={`flex items-center gap-2 text-sm transition-colors ${
                          requisito.cumplido ? 'text-green-300' : 'text-white/55'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            requisito.cumplido
                              ? 'border-green-300 bg-green-300 text-abacontex-dark'
                              : 'border-white/30'
                          }`}
                        >
                          {requisito.cumplido && <Check className="h-3.5 w-3.5" />}
                        </span>

                        <span>{requisito.texto}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {mensajeError && (
                <div className="mt-5 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-3">
                  <p className="text-sm text-red-100">{mensajeError}</p>
                </div>
              )}

              <div className="mt-7 flex justify-center">
                <Button
                  label="Continuar"
                  variant="solid"
                  icon={<ArrowRight className="h-5 w-5" />}
                  onClick={handleContinuar}
                  className="w-full px-8 py-3.5 sm:w-auto"
                />
              </div>
            </section>

            <aside className="hidden justify-center lg:flex">
              <div
                className="relative flex h-120
               w-full items-end justify-center"
              >
                <div className="absolute bottom-4 h-20 w-72 rounded-full bg-black/20 blur-xl" />

                <img
                  src="/img/docente-bienvenida.png"
                  alt="Aba dando la bienvenida al docente"
                  className="relative z-10 max-h-177.5 w-auto object-contain"
                />
              </div>
            </aside>
          </div>
        </BokehContainer>
      </main>
    );
  }

  if (paso === 2) {
    return (
      <main className="min-h-screen bg-abacontex-dark font-sans text-white">
        <BokehContainer className="flex min-h-screen items-center px-5 py-10 sm:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-8 flex justify-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-abacontex-primary-three">
                  <Check className="h-5 w-5" />
                </div>

                <div className="h-px w-14 bg-abacontex-primary-three" />

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-abacontex-primary-three font-semibold">
                  2
                </div>
              </div>
            </div>

            <section className="overflow-hidden rounded-3xl bg-abacontex-light text-abacontex-black-text shadow-2xl">
              <header className="relative overflow-hidden bg-abacontex-primary px-6 py-8 text-center text-white sm:px-10">
                <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/5" />
                <div className="absolute -bottom-12 right-10 h-32 w-32 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                    <GraduationCap className="h-8 w-8" />
                  </div>

                  <h1 className="font-heading text-3xl font-bold sm:text-4xl">
                    Seleccioná tus cursos
                  </h1>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                    Elegí uno o más cursos que estarán asociados a tu cuenta docente.
                  </p>
                </div>
              </header>

              <div className="p-6 sm:p-9">
                {cargandoCursos && (
                  <div className="flex min-h-56 items-center justify-center">
                    <p className="text-abacontex-gray-text">Cargando cursos disponibles...</p>
                  </div>
                )}

                {errorCursos && (
                  <div className="flex min-h-56 flex-col items-center justify-center text-center">
                    <BookOpen className="mb-4 h-10 w-10 text-abacontex-primary" />

                    <p className="font-semibold text-abacontex-black-text">
                      No pudimos cargar los cursos.
                    </p>

                    <Button
                      label="Reintentar"
                      variant="outline"
                      onClick={() => {
                        void recargarCursos();
                      }}
                      className="mt-5"
                    />
                  </div>
                )}

                {!cargandoCursos && !errorCursos && cursos.length === 0 && (
                  <div className="flex min-h-56 flex-col items-center justify-center text-center">
                    <BookOpen className="mb-4 h-10 w-10 text-abacontex-primary" />

                    <p className="font-semibold text-abacontex-black-text">
                      No hay cursos disponibles.
                    </p>

                    <p className="mt-2 text-sm text-abacontex-gray-text">
                      No encontramos cursos para asociar a la cuenta docente.
                    </p>
                  </div>
                )}

                {!cargandoCursos && !errorCursos && cursos.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {cursos.map((curso) => {
                      const seleccionado = cursoIds.includes(curso.idCurso);

                      return (
                        <button
                          key={curso.idCurso}
                          type="button"
                          onClick={() => handleToggleCurso(curso.idCurso)}
                          className={`group flex min-h-24 items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                            seleccionado
                              ? 'border-abacontex-primary-three bg-abacontex-primary-three/10 shadow-md'
                              : 'border-abacontex-gray/40 bg-white hover:-translate-y-0.5 hover:border-abacontex-primary-three/60 hover:shadow-md'
                          }`}
                        >
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
                              seleccionado
                                ? 'bg-abacontex-primary-three text-white'
                                : 'bg-abacontex-primary/10 text-abacontex-primary'
                            }`}
                          >
                            <BookOpen className="h-6 w-6" />
                          </div>

                          <span className="flex-1 font-semibold text-abacontex-black-text">
                            {curso.nombreCurso}
                          </span>

                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                              seleccionado
                                ? 'border-abacontex-primary-three bg-abacontex-primary-three text-white'
                                : 'border-abacontex-gray'
                            }`}
                          >
                            {seleccionado && <Check className="h-4 w-4" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {mensajeError && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-center text-sm text-red-600">{mensajeError}</p>
                  </div>
                )}

                <div className="mt-8 flex flex-col-reverse justify-center gap-3 border-t border-abacontex-gray/30 pt-7 sm:flex-row">
                  <Button
                    label="Volver"
                    variant="outline"
                    icon={<ArrowLeft className="h-5 w-5" />}
                    onClick={() => {
                      setMensajeError('');
                      setPaso(1);
                    }}
                    disabled={creandoDocente}
                  />

                  <Button
                    label={creandoDocente ? 'Creando cuenta...' : 'Crear mi cuenta'}
                    variant="solid"
                    icon={!creandoDocente ? <ArrowRight className="h-5 w-5" /> : undefined}
                    onClick={handleCrearCuenta}
                    disabled={
                      creandoDocente || cargandoCursos || errorCursos || cursos.length === 0
                    }
                  />
                </div>
              </div>
            </section>
          </div>
        </BokehContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-abacontex-dark font-sans text-white">
      <BokehContainer className="flex min-h-screen items-center justify-center px-5 py-10">
        <section className="mx-auto w-full max-w-xl rounded-3xl bg-abacontex-light p-8 text-center text-abacontex-black-text shadow-2xl sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary-three/15">
            <CheckCircle2 className="h-11 w-11 text-abacontex-primary-three" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-abacontex-primary-three">
            Registro completado
          </p>

          <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
            ¡Tu cuenta docente fue creada!
          </h1>

          <p className="mx-auto mt-5 max-w-md leading-relaxed text-abacontex-gray-text">
            Ingresá nuevamente con tu correo electrónico y la contraseña que acabás de registrar
            para acceder al panel docente.
          </p>

          <div className="mt-8">
            <Button
              label="Iniciar sesión"
              variant="solid"
              icon={<ArrowRight className="h-5 w-5" />}
              onClick={handleIngresar}
              className="w-full sm:w-auto"
            />
          </div>
        </section>
      </BokehContainer>
    </main>
  );
}
