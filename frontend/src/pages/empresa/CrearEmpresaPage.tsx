// src/pages/empresa/CrearEmpresaPage.tsx

import { ArrowRight, Building2 } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import DatosEmpresaForm from '../../components/empresa/DatosEmpresaForm';
import EmpresaCreadaModal from '../../components/empresa/EmpresaCreadaModal';
import SelectorIntegrantes from '../../components/empresa/SelectorIntegrantes';
import BokehContainer from '../../components/ui/BokehContainer';
import Button from '../../components/ui/Button';

import { useCandidatosEmpresa } from '../../hooks/useCandidatosEmpresa';
import { useDebounce } from '../../hooks/useDebounce';
import { useCrearEmpresa } from '../../hooks/useCrearEmpresa';
import { useAgregarParticipantesEmpresa } from '../../hooks/useAgregarParticipantesEmpresa';

import type { AlumnoDisponible, InvitacionPendiente } from '../../types/empresa.types';

export default function CrearEmpresaPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [actividad, setActividad] = useState('');
  const [logo, setLogo] = useState<File | null>(null);

  const [errorNombre, setErrorNombre] = useState('');
  const [errorActividad, setErrorActividad] = useState('');
  const [errorLogo, setErrorLogo] = useState('');

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

  const {
    mutate: ejecutarCreacionEmpresa,
    isPending: creandoEmpresa,
    isError: errorCreandoEmpresa,
    error: errorCreacionEmpresa,
  } = useCrearEmpresa();

  const { mutate: ejecutarAgregarParticipantes } = useAgregarParticipantesEmpresa();

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

  const handleFundarEmpresa = () => {
    if (!validarFormulario()) {
      return;
    }

    ejecutarCreacionEmpresa(
      {
        nombre: nombre.trim(),
        actividad: actividad.trim(),
        logo,
      },
      {
        onSuccess: (empresaCreada) => {
          console.log('Empresa creada:', empresaCreada);

          if (seleccionados.length === 0) {
            setModalAbierto(true);
            return;
          }

          ejecutarAgregarParticipantes(
            {
              participantes: seleccionados.map((alumno) => alumno.id),
            },
            {
              onSuccess: () => {
                console.log('Participantes agregados');
                setModalAbierto(true);
              },
            }
          );
        },
      }
    );
  };

  return (
    <>
      <main className="min-h-screen bg-abacontex-light-bg font-sans">
        {/* ENCABEZADO */}
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

        {/* CONTENIDO */}
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

            {errorCreandoEmpresa && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-center text-sm font-medium text-red-600">
                  {errorCreacionEmpresa instanceof Error
                    ? errorCreacionEmpresa.message
                    : 'No se pudo crear la empresa.'}
                </p>
              </div>
            )}

            <div className="flex justify-center border-t border-abacontex-gray/30 pt-7">
              <Button
                label={creandoEmpresa ? 'Creando empresa...' : 'Fundar mi empresa'}
                variant="solid"
                icon={!creandoEmpresa ? <ArrowRight className="h-5 w-5" /> : undefined}
                onClick={handleFundarEmpresa}
                disabled={creandoEmpresa}
                className="w-full py-4 text-lg sm:w-auto sm:min-w-72"
              />
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
