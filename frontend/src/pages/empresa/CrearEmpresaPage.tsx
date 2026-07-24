// src/pages/empresa/CrearEmpresaPage.tsx

import { Building2, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatosEmpresaForm from '../../components/empresa/DatosEmpresaForm';
import EmpresaCreadaModal from '../../components/empresa/EmpresaCreadaModal';
import SelectorIntegrantes from '../../components/empresa/SelectorIntegrantes';
import { useCandidatosEmpresa } from '../../hooks/useCandidatosEmpresa';
import { useDebounce } from '../../hooks/useDebounce';
import type {
  AlumnoDisponible,
  InvitacionPendiente,
} from '../../types/empresa.types';



export default function CrearEmpresaPage() {
  
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [actividad, setActividad] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [seleccionados, setSeleccionados] = useState<AlumnoDisponible[]>(
    [],
  );
  const [invitaciones, setInvitaciones] = useState<InvitacionPendiente[]>(
    [],
  );

  const [errorNombre, setErrorNombre] = useState('');
  const [errorActividad, setErrorActividad] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);


  const [busquedaCandidato, setBusquedaCandidato] = useState('');

const busquedaDebounced = useDebounce(busquedaCandidato, 400);

const {
  data: candidatos = [],
  isLoading: cargandoCandidatos,
  isFetching: buscandoCandidatos,
  isError: errorCandidatos,
  refetch: recargarCandidatos,
} = useCandidatosEmpresa(busquedaDebounced);

const cargandoAlumnos = cargandoCandidatos || buscandoCandidatos;

  useEffect(() => {
    if (!logo) {
      setLogoPreview(null);
      return;
    }

    const urlTemporal = URL.createObjectURL(logo);
    setLogoPreview(urlTemporal);

    return () => URL.revokeObjectURL(urlTemporal);
  }, [logo]);

  const handleToggleAlumno = (alumno: AlumnoDisponible) => {
    setSeleccionados((actuales) => {
      const yaSeleccionado = actuales.some(
        (integrante) => integrante.id === alumno.id,
      );

      if (yaSeleccionado) {
        return actuales.filter(
          (integrante) => integrante.id !== alumno.id,
        );
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
    setInvitaciones((actuales) =>
      actuales.filter((invitacion) => invitacion.id !== id),
    );
  };

  const validarFormulario = () => {
    let valido = true;

    if (!nombre.trim()) {
      setErrorNombre('El nombre de la empresa es obligatorio.');
      valido = false;
    } else {
      setErrorNombre('');
    }

    if (!actividad.trim()) {
      setErrorActividad('La actividad de la empresa es obligatoria.');
      valido = false;
    } else {
      setErrorActividad('');
    }

    return valido;
  };

  const handleFundarEmpresa = () => {
    if (!validarFormulario()) return;

    const datosEmpresa = {
      nombre: nombre.trim(),
      actividad: actividad.trim(),
      logo,
      integrantesIds: seleccionados.map((alumno) => alumno.id),
      invitaciones: invitaciones.map((invitacion) => invitacion.email),
    };

    console.log('Empresa a crear:', datosEmpresa);

    setModalAbierto(true);
  };

  

  return (
    <>
      <main className="min-h-screen bg-abacontext-light-bg px-4 py-10 font-sans sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <header className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-abacontex-primary/10">
              <Building2 className="h-6 w-6 text-abacontex-primary" />
            </div>

            <h1 className="font-heading text-4xl font-bold text-abacontex-black-text sm:text-5xl">
              Crear tu empresa
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-abacontex-gray-text">
              Completá los datos principales y conformá el equipo que
              participará de la simulación empresarial.
            </p>
          </header>

          <div className="space-y-6">
            <DatosEmpresaForm
              nombre={nombre}
              actividad={actividad}
              logo={logo}
              logoPreview={logoPreview}
              errorNombre={errorNombre}
              errorActividad={errorActividad}
              onNombreChange={(value) => {
                setNombre(value);
                if (errorNombre) setErrorNombre('');
              }}
              onActividadChange={(value) => {
                setActividad(value);
                if (errorActividad) setErrorActividad('');
              }}
              onLogoChange={setLogo}
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

            <button
              type="button"
              onClick={handleFundarEmpresa}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-abacontex-primary px-6 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-abacontex-primary-two"
            >
              Fundar mi empresa
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>

      <EmpresaCreadaModal
        abierto={modalAbierto}
        nombreEmpresa={nombre}
        onContinuar={() => navigate('/empresa')}
      />
    </>
  );
}