// src/pages/empresa/CrearEmpresaPage.tsx

import axios from 'axios';
import { ArrowRight, Building2, ShieldX } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DatosEmpresaForm from '../../components/empresa/DatosEmpresaForm';
import EmpresaCreadaModal from '../../components/empresa/EmpresaCreadaModal';
import SelectorIntegrantes from '../../components/empresa/SelectorIntegrantes';
import BokehContainer from '../../components/ui/BokehContainer';
import Button from '../../components/ui/Button';

import { useAgregarParticipantesEmpresa } from '../../hooks/useAgregarParticipantesEmpresa';
import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useCandidatosEmpresa } from '../../hooks/useCandidatosEmpresa';
import { useCrearEmpresa } from '../../hooks/useCrearEmpresa';
import { useCrearInvitacionesEmpresa } from '../../hooks/useCrearInvitacionesEmpresa';
import { useDebounce } from '../../hooks/useDebounce';

import type { AlumnoDisponible, InvitacionPendiente } from '../../types/empresa.types';

interface ErrorApi {
  status?: string;
  code?: string;
  message?: string;
  error?: string;
  details?: {
    email?: string;
  };
}

type TipoErrorConfiguracion = 'ERROR_CREACION' | 'ERROR_PARCIAL' | null;

export default function CrearEmpresaPage() {
  const navigate = useNavigate();

  const {
    data: alumnoActual,
    isLoading: cargandoAlumnoActual,
    isError: errorAlumnoActual,
  } = useAlumnoActual();

  const [nombre, setNombre] = useState('');
  const [actividad, setActividad] = useState('');
  const [logo, setLogo] = useState<File | null>(null);

  const [errorNombre, setErrorNombre] = useState('');
  const [errorActividad, setErrorActividad] = useState('');
  const [errorLogo, setErrorLogo] = useState('');

  const [errorConfiguracion, setErrorConfiguracion] = useState('');

  const [tipoErrorConfiguracion, setTipoErrorConfiguracion] =
    useState<TipoErrorConfiguracion>(null);

  const [empresaYaCreada, setEmpresaYaCreada] = useState(false);

  const [seleccionados, setSeleccionados] = useState<AlumnoDisponible[]>([]);

  const [invitaciones, setInvitaciones] = useState<InvitacionPendiente[]>([]);

  const [modalAbierto, setModalAbierto] = useState(false);

  const [busquedaCandidato, setBusquedaCandidato] = useState('');

  const nombreRef = useRef<HTMLDivElement>(null);
  const actividadRef = useRef<HTMLDivElement>(null);

  const logoPreview = useMemo(() => {
    if (!logo) {
      return null;
    }

    return URL.createObjectURL(logo);
  }, [logo]);

  const busquedaDebounced = useDebounce(busquedaCandidato, 400);

  const {
    data: candidatos = [],
    isLoading: cargandoCandidatos,
    isFetching: buscandoCandidatos,
    isError: errorCandidatos,
    refetch: recargarCandidatos,
  } = useCandidatosEmpresa(busquedaDebounced);

  const cargandoAlumnos = cargandoCandidatos || buscandoCandidatos;

  const crearEmpresaMutation = useCrearEmpresa();

  const agregarParticipantesMutation = useAgregarParticipantesEmpresa();

  const crearInvitacionesMutation = useCrearInvitacionesEmpresa();

  const procesando =
    crearEmpresaMutation.isPending ||
    agregarParticipantesMutation.isPending ||
    crearInvitacionesMutation.isPending;

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleToggleAlumno = (alumno: AlumnoDisponible) => {
    setSeleccionados((actuales) => {
      const yaSeleccionado = actuales.some((integrante) => integrante.id === alumno.id);

      if (yaSeleccionado) {
        return actuales.filter((integrante) => integrante.id !== alumno.id);
      }

      return [...actuales, alumno];
    });
  };

  const handleAgregarInvitacion = (email: string) => {
    setInvitaciones((actuales) => [
      ...actuales,
      {
        id: crypto.randomUUID(),
        email,
      },
    ]);
  };

  const handleEliminarInvitacion = (id: string) => {
    setInvitaciones((actuales) => actuales.filter((invitacion) => invitacion.id !== id));
  };

  const validarFormulario = () => {
    let valido = true;

    let primerCampoConError: 'nombre' | 'actividad' | null = null;

    if (!nombre.trim()) {
      setErrorNombre('El nombre de la empresa es obligatorio.');

      valido = false;
      primerCampoConError = 'nombre';
    } else {
      setErrorNombre('');
    }

    if (!actividad.trim()) {
      setErrorActividad('La actividad de la empresa es obligatoria.');

      valido = false;

      if (!primerCampoConError) {
        primerCampoConError = 'actividad';
      }
    } else {
      setErrorActividad('');
    }

    if (errorLogo) {
      valido = false;
    }

    if (!valido) {
      setTimeout(() => {
        if (primerCampoConError === 'nombre') {
          nombreRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }

        if (primerCampoConError === 'actividad') {
          actividadRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 0);
    }

    return valido;
  };

  const obtenerErrorApi = (error: unknown) => {
    if (!axios.isAxiosError<ErrorApi>(error)) {
      return {
        status: undefined,
        code: undefined,
        message: 'Ocurrió un error inesperado. Intentá nuevamente.',
        email: undefined,
      };
    }

    return {
      status: error.response?.status,
      code: error.response?.data?.code,
      message:
        error.response?.data?.message ??
        error.response?.data?.error ??
        'Ocurrió un error al procesar la solicitud.',
      email: error.response?.data?.details?.email,
    };
  };

  const manejarErrorInvitaciones = (error: unknown) => {
    const { status, code, message, email } = obtenerErrorApi(error);

    setTipoErrorConfiguracion('ERROR_PARCIAL');

    if (
      status === 409 &&
      code === 'CONFLICT' &&
      message === 'El correo ya pertenece a un usuario registrado.'
    ) {
      setErrorConfiguracion(
        `La empresa fue creada correctamente, pero no se pudieron enviar todas las invitaciones. ${
          email ? `El correo ${email} ya pertenece a un usuario registrado.` : message
        } Buscá a ese alumno desde la opción "Buscar alumnos registrados".`
      );

      return;
    }

    if (
      status === 409 &&
      code === 'CONFLICT' &&
      message.startsWith('Ya existe una invitación pendiente para')
    ) {
      setErrorConfiguracion(
        `La empresa fue creada correctamente, pero no se pudieron enviar todas las invitaciones. ${message}`
      );

      return;
    }

    setErrorConfiguracion(
      `La empresa fue creada correctamente, pero no se pudieron enviar todas las invitaciones. ${message}`
    );
  };

  const handleFundarEmpresa = async () => {
    if (empresaYaCreada) {
      navigate('/alumno/empresa');
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    setErrorConfiguracion('');
    setTipoErrorConfiguracion(null);

    /*
     * PASO 1:
     * Crear empresa.
     *
     * Si falla esta operación, la empresa NO existe.
     */
    try {
      await crearEmpresaMutation.mutateAsync({
        nombre: nombre.trim(),
        actividad: actividad.trim(),
        logo,
      });
    } catch (error) {
      const { message } = obtenerErrorApi(error);

      setTipoErrorConfiguracion('ERROR_CREACION');

      setErrorConfiguracion(`No se pudo crear la empresa. ${message}`);

      return;
    }

    /*
     * A partir de este punto la empresa YA existe.
     */
    setEmpresaYaCreada(true);

    /*
     * PASO 2:
     * Agregar alumnos registrados.
     */
    if (seleccionados.length > 0) {
      try {
        await agregarParticipantesMutation.mutateAsync({
          participantes: seleccionados.map((alumno) => alumno.id),
        });
      } catch (error) {
        const { message } = obtenerErrorApi(error);

        setTipoErrorConfiguracion('ERROR_PARCIAL');

        setErrorConfiguracion(
          `La empresa fue creada correctamente, pero no se pudieron incorporar todos los alumnos seleccionados. ${message}`
        );

        return;
      }
    }

    /*
     * PASO 3:
     * Enviar invitaciones por correo.
     */
    if (invitaciones.length > 0) {
      try {
        await crearInvitacionesMutation.mutateAsync({
          emails: invitaciones.map((invitacion) => invitacion.email),
        });
      } catch (error) {
        manejarErrorInvitaciones(error);
        return;
      }
    }

    /*
     * Todo salió correctamente.
     */
    setModalAbierto(true);
  };

  /*
   * Primero verificamos la información del alumno.
   */
  if (cargandoAlumnoActual) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-abacontex-light-bg">
        <p className="text-sm text-abacontex-gray-text">Verificando tu información...</p>
      </main>
    );
  }

  if (errorAlumnoActual || !alumnoActual) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-abacontex-light-bg px-4">
        <section className="flex w-full max-w-xl flex-col items-center rounded-2xl bg-white px-8 py-10 text-center shadow-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <ShieldX className="h-9 w-9 text-red-500" />
          </div>

          <h1 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
            No pudimos verificar tu información
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-abacontex-gray-text">
            Ocurrió un problema al consultar tu perfil. Intentá nuevamente en unos minutos.
          </p>

          <Button
            label="Volver a Mi empresa"
            variant="solid"
            onClick={() => navigate('/alumno/empresa')}
            className="mt-7"
          />
        </section>
      </main>
    );
  }

  const esCEO = alumnoActual.rolEmpresa?.nombre.toUpperCase() === 'CEO';

  /*
   * Solo un CEO puede crear una empresa.
   */
  if (!esCEO) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-abacontex-light-bg px-4">
        <section className="flex w-full max-w-xl flex-col items-center rounded-2xl bg-white px-8 py-10 text-center shadow-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <ShieldX className="h-9 w-9 text-red-500" />
          </div>

          <h1 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
            No podés crear una empresa
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-abacontex-gray-text">
            Solo el alumno que tenga asignado el rol de Director Ejecutivo (CEO) puede crear una
            empresa.
          </p>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-abacontex-gray-text">
            Si todavía no pertenecés a una empresa, esperá a que el Director Ejecutivo de tu equipo
            te incorpore o te envíe una invitación.
          </p>

          <Button
            label="Volver a Mi empresa"
            variant="solid"
            onClick={() => navigate('/alumno/empresa')}
            className="mt-7"
          />
        </section>
      </main>
    );
  }

  /*
   * Un CEO que ya pertenece a una empresa
   * no puede crear otra.
   */
  if (alumnoActual.empresa) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-abacontex-light-bg px-4">
        <section className="flex w-full max-w-xl flex-col items-center rounded-2xl bg-white px-8 py-10 text-center shadow-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
            <Building2 size={36} className="text-abacontex-primary" />
          </div>

          <h1 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
            Ya tenés una empresa
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-abacontex-gray-text">
            Ya pertenecés a{' '}
            <strong className="font-semibold text-abacontex-black-text">
              {alumnoActual.empresa.nombre}
            </strong>
            . No es posible crear una segunda empresa mientras formes parte de una existente.
          </p>

          <Button
            label="Ir a mi empresa"
            variant="solid"
            icon={<ArrowRight className="h-5 w-5" />}
            onClick={() => navigate('/alumno/empresa')}
            className="mt-7"
          />
        </section>
      </main>
    );
  }

  /*
   * CEO sin empresa:
   * puede acceder normalmente a la creación.
   */
  return (
    <>
      <main className="min-h-screen bg-abacontex-light-bg font-sans">
        <header className="bg-abacontex-dark text-white">
          <BokehContainer className="px-4 py-12 sm:px-6 md:py-16">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-abacontex-primary-three text-white shadow-lg">
                <Building2 className="h-8 w-8" />
              </div>

              <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
                Creá tu empresa
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                Definí la identidad de tu empresa y conformá el equipo que participará de la
                simulación empresarial.
              </p>
            </div>
          </BokehContainer>
        </header>

        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-abacontex-primary-three">
              Configuración inicial
            </p>

            <h2 className="mt-2 font-heading text-2xl font-bold text-abacontex-black-text sm:text-3xl">
              Completá los datos de tu empresa
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-abacontex-gray-text sm:text-base">
              Primero cargá la información principal y después elegí a los integrantes que formarán
              parte del equipo.
            </p>
          </div>

          <div className="space-y-7">
            <DatosEmpresaForm
              nombre={nombre}
              actividad={actividad}
              logo={logo}
              logoPreview={logoPreview}
              errorNombre={errorNombre}
              errorActividad={errorActividad}
              errorLogo={errorLogo}
              nombreRef={nombreRef}
              actividadRef={actividadRef}
              onNombreChange={(value) => {
                setNombre(value);

                if (errorNombre) {
                  setErrorNombre('');
                }
              }}
              onActividadChange={(value) => {
                setActividad(value);

                if (errorActividad) {
                  setErrorActividad('');
                }
              }}
              onLogoChange={(archivo) => {
                setLogo(archivo);

                if (!archivo) {
                  setErrorLogo('');
                }
              }}
              onLogoError={setErrorLogo}
            />

            <SelectorIntegrantes
              alumnos={candidatos}
              seleccionados={seleccionados}
              invitaciones={invitaciones}
              busqueda={busquedaCandidato}
              cargandoAlumnos={cargandoAlumnos}
              errorAlumnos={errorCandidatos}
              onBusquedaChange={setBusquedaCandidato}
              onReintentarBusqueda={() => {
                void recargarCandidatos();
              }}
              onToggleAlumno={handleToggleAlumno}
              onAgregarInvitacion={handleAgregarInvitacion}
              onEliminarInvitacion={handleEliminarInvitacion}
            />

            {errorConfiguracion && (
              <div
                className={`rounded-2xl border px-5 py-4 ${
                  tipoErrorConfiguracion === 'ERROR_PARCIAL'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <p
                  className={`text-center text-sm font-medium leading-relaxed ${
                    tipoErrorConfiguracion === 'ERROR_PARCIAL' ? 'text-amber-800' : 'text-red-600'
                  }`}
                >
                  {errorConfiguracion}
                </p>
              </div>
            )}

            <div className="flex justify-center border-t border-abacontex-gray/30 pt-7">
              {empresaYaCreada ? (
                <Button
                  label="Ir a mi empresa"
                  variant="solid"
                  icon={<ArrowRight className="h-5 w-5" />}
                  onClick={() => navigate('/alumno/empresa')}
                  className="w-full py-4 text-lg sm:w-auto sm:min-w-72"
                />
              ) : (
                <Button
                  label={procesando ? 'Configurando empresa...' : 'Fundar mi empresa'}
                  variant="solid"
                  icon={!procesando ? <ArrowRight className="h-5 w-5" /> : undefined}
                  onClick={() => {
                    void handleFundarEmpresa();
                  }}
                  disabled={procesando}
                  className="w-full py-4 text-lg sm:w-auto sm:min-w-72"
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <EmpresaCreadaModal
        abierto={modalAbierto}
        nombreEmpresa={nombre}
        onContinuar={() => navigate('/alumno/empresa')}
      />
    </>
  );
}
