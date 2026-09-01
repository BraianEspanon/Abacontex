import { BriefcaseBusiness, ChevronRight, GraduationCap, Home, Mail, Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useUsuarioActual } from '../../hooks/useUsuarioActual';

export default function PerfilAlumno() {
  const navigate = useNavigate();

  const { data: alumno, isLoading, isError, refetch } = useAlumnoActual();
  const { data: usuario, isLoading: cargandoUsuario } = useUsuarioActual();

  if (isLoading || cargandoUsuario) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm text-abacontex-gray-text">Cargando información del perfil...</p>
      </div>
    );
  }

  if (isError || !alumno) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-800">No se pudo cargar el perfil</h1>

        <p className="mt-2 text-sm text-red-700">
          Ocurrió un problema al obtener la información del alumno.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const inicial = alumno.nombre.trim().charAt(0).toUpperCase() || 'A';

  return (
    <div className="mx-auto w-full max-w-340">
      <nav
        aria-label="Migas de pan"
        className="mb-7 flex items-center gap-2 text-sm text-abacontex-gray-text"
      >
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-abacontex-dark">
          <Home size={16} />
          Inicio
        </Link>

        <ChevronRight size={15} />

        <span className="font-semibold text-abacontex-dark">Mi perfil</span>
      </nav>

      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-md">
        <header className="px-6 pt-5">
          <h2 className="font-sans text-xl font-semibold text-abacontex-black-text">
            Información personal
          </h2>

          <div className="mt-3 border-b border-gray-300" />
        </header>

        <div className="px-7 py-8 sm:px-10">
          <h1 className="mb-7 text-center font-heading text-4xl font-bold text-abacontex-primary-two">
            {alumno.nombre} {alumno.apellido}
          </h1>

          <div className="grid items-center gap-8 md:grid-cols-[140px_1fr]">
            <div className="flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full text-xl text-white">
                {usuario?.fotoPerfilUrl ? (
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full">
                    <img
                      src={usuario.fotoPerfilUrl}
                      alt={`Foto de ${alumno.nombre} ${alumno.apellido}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-400 text-xl text-white">
                    {inicial}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4 border-b border-gray-300 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-abacontex-primary-two">
                    <Mail size={18} />
                  </div>

                  <span className="font-medium text-abacontex-black-text">Mail institucional</span>
                </div>

                <span className="text-right text-abacontex-gray-text">{alumno.email}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-gray-300 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-abacontex-primary-two">
                    <GraduationCap size={20} />
                  </div>

                  <span className="font-medium text-abacontex-black-text">Curso</span>
                </div>

                <span className="text-right text-abacontex-gray-text">
                  {alumno.curso?.nombre ?? 'Sin curso asignado'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-abacontex-primary-three/15 text-abacontex-primary-two">
                    <BriefcaseBusiness size={18} />
                  </div>

                  <span className="font-medium text-abacontex-black-text">
                    Rol dentro de la empresa
                  </span>
                </div>

                <span className="text-right text-abacontex-gray-text">
                  {alumno.rolEmpresa?.nombre ?? 'Sin rol asignado'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/alumno/perfil/editar')}
              className="flex items-center gap-2 cursor-pointer rounded-xl bg-abacontex-primary-three px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-abacontex-primary-two"
            >
              <Pencil size={17} />
              Editar datos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
