import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Home,
  LockKeyhole,
  Save,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useUsuarioActual } from '../../hooks/useUsuarioActual';
import { isAxiosError } from 'axios';
import { useActualizarPassword } from '../../hooks/useActualizarPassword';
import { useActualizarUsuarioActual } from '../../hooks/useActualizarUsuarioActual';

const LONGITUD_MINIMA_NOMBRE = 2;
const LONGITUD_MAXIMA_NOMBRE = 100;

const TAMANO_MAXIMO_FOTO = 5 * 1024 * 1024;
const TIPOS_FOTO_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

const REGEX_NOMBRE = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;

const validarNombre = (valor: string, campo: 'nombre' | 'apellido') => {
  const limpio = valor.trim();
  const etiqueta = campo === 'nombre' ? 'El nombre' : 'El apellido';

  if (!limpio) {
    return `${etiqueta} es obligatorio.`;
  }

  if (limpio.length < LONGITUD_MINIMA_NOMBRE) {
    return `${etiqueta} debe tener al menos ${LONGITUD_MINIMA_NOMBRE} caracteres.`;
  }

  if (limpio.length > LONGITUD_MAXIMA_NOMBRE) {
    return `${etiqueta} no puede superar los ${LONGITUD_MAXIMA_NOMBRE} caracteres.`;
  }

  if (!REGEX_NOMBRE.test(limpio)) {
    return `${etiqueta} solo puede contener letras, espacios, guiones y apóstrofes.`;
  }

  return '';
};

export default function EditarPerfilAlumno() {
  const navigate = useNavigate();
  const inputFotoRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: actualizarUsuario, isPending: actualizandoUsuario } =
    useActualizarUsuarioActual();

  const { mutateAsync: cambiarPassword, isPending: actualizandoPassword } = useActualizarPassword();

  const { data: alumno, isLoading: cargandoAlumno, isError: errorAlumno } = useAlumnoActual();

  const { data: usuario, isLoading: cargandoUsuario, isError: errorUsuario } = useUsuarioActual();

  const [nombreEditado, setNombreEditado] = useState<string | null>(null);
  const [apellidoEditado, setApellidoEditado] = useState<string | null>(null);

  const [foto, setFoto] = useState<File | null>(null);
  const [eliminarFoto, setEliminarFoto] = useState(false);
  const [errorFoto, setErrorFoto] = useState('');

  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmacion, setPasswordConfirmacion] = useState('');

  const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false);
  const [mostrarPasswordNueva, setMostrarPasswordNueva] = useState(false);
  const [mostrarPasswordConfirmacion, setMostrarPasswordConfirmacion] = useState(false);

  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [guardadoCorrecto, setGuardadoCorrecto] = useState(false);

  const [mensajeFormulario, setMensajeFormulario] = useState<string | null>(null);

  const guardando = actualizandoUsuario || actualizandoPassword;

  const nombre = nombreEditado ?? alumno?.nombre ?? '';
  const apellido = apellidoEditado ?? alumno?.apellido ?? '';

  const errorNombre = validarNombre(nombre, 'nombre');
  const errorApellido = validarNombre(apellido, 'apellido');

  const quiereCambiarPassword =
    passwordActual.length > 0 || passwordNueva.length > 0 || passwordConfirmacion.length > 0;

  const erroresPassword = useMemo(() => {
    if (!quiereCambiarPassword) {
      return {
        actual: '',
        nueva: '',
        confirmacion: '',
      };
    }

    let actual = '';
    let nueva = '';
    let confirmacion = '';

    if (!passwordActual) {
      actual = 'La contraseña actual es obligatoria para cambiarla.';
    }

    if (!passwordNueva) {
      nueva = 'La nueva contraseña es obligatoria.';
    } else if (passwordNueva.length < 8) {
      nueva = 'Debe tener al menos 8 caracteres.';
    } else if (!/[a-z]/.test(passwordNueva)) {
      nueva = 'Debe contener al menos una letra minúscula.';
    } else if (!/[A-Z]/.test(passwordNueva)) {
      nueva = 'Debe contener al menos una letra mayúscula.';
    } else if (!/[0-9]/.test(passwordNueva)) {
      nueva = 'Debe contener al menos un número.';
    } else if (passwordNueva === passwordActual) {
      nueva = 'La nueva contraseña debe ser distinta a la actual.';
    }

    if (!passwordConfirmacion) {
      confirmacion = 'Debés confirmar la nueva contraseña.';
    } else if (passwordConfirmacion !== passwordNueva) {
      confirmacion = 'Las contraseñas no coinciden.';
    }

    return {
      actual,
      nueva,
      confirmacion,
    };
  }, [passwordActual, passwordNueva, passwordConfirmacion, quiereCambiarPassword]);

  const fotoPreview = useMemo(() => {
    if (!foto) {
      return null;
    }

    return URL.createObjectURL(foto);
  }, [foto]);

  useEffect(() => {
    return () => {
      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

  if (cargandoAlumno || cargandoUsuario) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm text-abacontex-gray-text">Cargando información del perfil...</p>
      </div>
    );
  }

  if (errorAlumno || errorUsuario || !alumno || !usuario) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-800">No se pudo cargar el perfil</h1>

        <p className="mt-2 text-sm text-red-700">
          Ocurrió un problema al obtener la información del alumno.
        </p>
      </div>
    );
  }

  const nombreLimpio = nombre.trim();
  const apellidoLimpio = apellido.trim();

  const hayCambiosDatos =
    nombreLimpio !== alumno.nombre.trim() || apellidoLimpio !== alumno.apellido.trim();

  const hayCambiosFoto = foto !== null || eliminarFoto;

  const hayCambios = hayCambiosDatos || hayCambiosFoto || quiereCambiarPassword;

  const passwordValida =
    !quiereCambiarPassword ||
    (!erroresPassword.actual && !erroresPassword.nueva && !erroresPassword.confirmacion);

  const inicial = alumno.nombre.trim().charAt(0).toUpperCase() || 'A';

  const fotoMostrada = eliminarFoto ? null : (fotoPreview ?? usuario.fotoPerfilUrl ?? null);

  const handleFotoSeleccionada = (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      return;
    }

    setErrorFoto('');

    if (!TIPOS_FOTO_PERMITIDOS.includes(archivo.type)) {
      setErrorFoto('La foto debe ser JPG, PNG o WEBP.');
      event.target.value = '';
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_FOTO) {
      setErrorFoto('La foto no puede superar los 5 MB.');
      event.target.value = '';
      return;
    }

    setFoto(archivo);
    setEliminarFoto(false);
  };

  const handleEliminarFoto = () => {
    setFoto(null);
    setEliminarFoto(true);
    setErrorFoto('');

    if (inputFotoRef.current) {
      inputFotoRef.current.value = '';
    }
  };

  const handleCancelar = () => {
    navigate('/alumno/perfil');
  };

  const obtenerMensajeError = (error: unknown) => {
    if (isAxiosError(error)) {
      const respuesta = error.response?.data as { message?: string; mensaje?: string } | undefined;

      if (error.response?.status === 401) {
        return 'La contraseña actual ingresada es incorrecta.';
      }

      if (respuesta?.message) {
        return respuesta.message;
      }

      if (respuesta?.mensaje) {
        return respuesta.mensaje;
      }

      if (error.response?.status === 400) {
        return 'Los datos ingresados no son válidos. Revisalos e intentá nuevamente.';
      }

      if (error.response?.status === 404) {
        return 'No se encontró el usuario autenticado.';
      }
    }

    return 'No se pudieron guardar los cambios. Intentá nuevamente.';
  };

  const handleGuardar = () => {
    setMensajeFormulario(null);

    if (!nombreLimpio || !apellidoLimpio) {
      setMensajeFormulario('Existen datos faltantes. Revise e intente nuevamente.');
      return;
    }

    if (errorNombre || errorApellido || errorFoto) {
      setMensajeFormulario('Hay datos inválidos. Revisá los campos marcados e intentá nuevamente.');
      return;
    }

    if (!passwordValida) {
      setMensajeFormulario('Revisá los datos ingresados para el cambio de contraseña.');
      return;
    }

    if (!hayCambios) {
      return;
    }

    setConfirmacionAbierta(true);
  };

  const confirmarGuardado = async () => {
    setConfirmacionAbierta(false);
    setMensajeFormulario(null);

    let datosPersonalesActualizados = false;

    try {
      if (hayCambiosDatos || hayCambiosFoto) {
        await actualizarUsuario({
          nombre: nombreLimpio,
          apellido: apellidoLimpio,
          foto,
          eliminarFoto,
        });

        datosPersonalesActualizados = true;
      }

      if (quiereCambiarPassword) {
        try {
          await cambiarPassword({
            currentPassword: passwordActual,
            newPassword: passwordNueva,
          });
        } catch (error) {
          if (datosPersonalesActualizados) {
            setMensajeFormulario(
              `Los datos personales se actualizaron correctamente, pero no se pudo cambiar la contraseña. ${obtenerMensajeError(
                error
              )}`
            );

            return;
          }

          setMensajeFormulario(obtenerMensajeError(error));
          return;
        }
      }

      setGuardadoCorrecto(true);
    } catch (error) {
      setMensajeFormulario(obtenerMensajeError(error));
    }
  };

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

        <Link to="/alumno/perfil" className="transition hover:text-abacontex-dark">
          Mi perfil
        </Link>

        <ChevronRight size={15} />

        <span className="font-semibold text-abacontex-dark">Editar</span>
      </nav>

      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-md">
        <header className="px-6 pt-5">
          <h2 className="font-sans text-xl font-bold text-abacontex-black-text">
            Información personal
          </h2>

          <div className="mt-3 border-b border-gray-300" />
        </header>

        <div className="px-7 py-8 sm:px-10">
          <div className="grid gap-8 md:grid-cols-[150px_1fr]">
            <div className="flex flex-col items-center">
              <div className="relative">
                {fotoMostrada ? (
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full">
                    <img
                      src={fotoMostrada}
                      alt={`Foto de ${alumno.nombre} ${alumno.apellido}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-400 text-xl text-white">
                    {inicial}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => inputFotoRef.current?.click()}
                  className="absolute right-0 bottom-1 cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
                  aria-label="Cambiar foto de perfil"
                  title="Cambiar foto de perfil"
                >
                  <Camera size={17} />
                </button>

                <input
                  ref={inputFotoRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFotoSeleccionada}
                  className="hidden"
                />
              </div>

              <p className="mt-3 text-center text-xs text-gray-500">JPG, PNG o WEBP. Máx. 5 MB</p>

              {(usuario.fotoPerfilUrl || foto) && !eliminarFoto && (
                <button
                  type="button"
                  onClick={handleEliminarFoto}
                  className="mt-2 flex items-center cursor-pointer gap-1 text-xs text-red-600 transition hover:text-red-700"
                >
                  <Trash2 size={14} />
                  Eliminar foto
                </button>
              )}

              {errorFoto && <p className="mt-2 text-center text-xs text-red-600">{errorFoto}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nombre-alumno"
                  className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
                >
                  Nombre <span className="text-red-500">*</span>
                </label>

                <input
                  id="nombre-alumno"
                  type="text"
                  value={nombre}
                  maxLength={LONGITUD_MAXIMA_NOMBRE}
                  autoComplete="given-name"
                  onChange={(event) => setNombreEditado(event.target.value)}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition ${
                    errorNombre
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20'
                  }`}
                />

                <div className="mt-1 flex items-start justify-between gap-2">
                  <div>{errorNombre && <p className="text-xs text-red-600">{errorNombre}</p>}</div>

                  <span
                    className={`shrink-0 text-xs ${
                      nombre.length >= LONGITUD_MAXIMA_NOMBRE ? 'text-red-600' : 'text-gray-400'
                    }`}
                  >
                    {nombre.length}/{LONGITUD_MAXIMA_NOMBRE}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="apellido-alumno"
                  className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
                >
                  Apellido <span className="text-red-500">*</span>
                </label>

                <input
                  id="apellido-alumno"
                  type="text"
                  value={apellido}
                  maxLength={LONGITUD_MAXIMA_NOMBRE}
                  autoComplete="family-name"
                  onChange={(event) => setApellidoEditado(event.target.value)}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition ${
                    errorApellido
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20'
                  }`}
                />

                <div className="mt-1 flex items-start justify-between gap-2">
                  <div>
                    {errorApellido && <p className="text-xs text-red-600">{errorApellido}</p>}
                  </div>

                  <span
                    className={`shrink-0 text-xs ${
                      apellido.length >= LONGITUD_MAXIMA_NOMBRE ? 'text-red-600' : 'text-gray-400'
                    }`}
                  >
                    {apellido.length}/{LONGITUD_MAXIMA_NOMBRE}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="correo-alumno"
                  className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
                >
                  Correo institucional
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="correo-alumno"
                    type="email"
                    value={alumno.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 py-2 pr-3 pl-10 text-sm text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="curso-alumno"
                  className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
                >
                  Curso
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="curso-alumno"
                    type="text"
                    value={alumno.curso?.nombre ?? 'Sin curso asignado'}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 py-2 pr-3 pl-10 text-sm text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="rol-alumno"
                  className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
                >
                  Rol
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="rol-alumno"
                    type="text"
                    value={alumno.rolEmpresa?.nombre ?? 'Sin rol asignado'}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 py-2 pr-3 pl-10 text-sm text-gray-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="mt-2 border-t border-gray-200 pt-5">
                  <h3 className="mb-4 text-sm font-semibold text-abacontex-black-text">
                    Cambiar contraseña
                  </h3>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="password-actual"
                        className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
                      >
                        Contraseña actual
                      </label>

                      <div className="relative">
                        <input
                          id="password-actual"
                          type={mostrarPasswordActual ? 'text' : 'password'}
                          value={passwordActual}
                          autoComplete="current-password"
                          onChange={(event) => setPasswordActual(event.target.value)}
                          className={`w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm outline-none transition ${
                            erroresPassword.actual
                              ? 'border-red-500'
                              : 'border-gray-300 focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20'
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => setMostrarPasswordActual((valor) => !valor)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            mostrarPasswordActual
                              ? 'Ocultar contraseña actual'
                              : 'Mostrar contraseña actual'
                          }
                        >
                          {mostrarPasswordActual ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>

                      {erroresPassword.actual && (
                        <p className="mt-1 text-xs text-red-600">{erroresPassword.actual}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="password-nueva"
                        className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
                      >
                        Nueva contraseña
                      </label>

                      <div className="relative">
                        <input
                          id="password-nueva"
                          type={mostrarPasswordNueva ? 'text' : 'password'}
                          value={passwordNueva}
                          autoComplete="new-password"
                          onChange={(event) => setPasswordNueva(event.target.value)}
                          className={`w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm outline-none transition ${
                            erroresPassword.nueva
                              ? 'border-red-500'
                              : 'border-gray-300 focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20'
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => setMostrarPasswordNueva((valor) => !valor)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            mostrarPasswordNueva
                              ? 'Ocultar nueva contraseña'
                              : 'Mostrar nueva contraseña'
                          }
                        >
                          {mostrarPasswordNueva ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>

                      {erroresPassword.nueva && (
                        <p className="mt-1 text-xs text-red-600">{erroresPassword.nueva}</p>
                      )}

                      <p className="mt-1 text-xs text-gray-400">
                        Mín. 8 caracteres, una mayúscula, una minúscula y un número.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="password-confirmacion"
                        className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
                      >
                        Confirmar contraseña
                      </label>

                      <div className="relative">
                        <input
                          id="password-confirmacion"
                          type={mostrarPasswordConfirmacion ? 'text' : 'password'}
                          value={passwordConfirmacion}
                          autoComplete="new-password"
                          onChange={(event) => setPasswordConfirmacion(event.target.value)}
                          className={`w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm outline-none transition ${
                            erroresPassword.confirmacion
                              ? 'border-red-500'
                              : 'border-gray-300 focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20'
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => setMostrarPasswordConfirmacion((valor) => !valor)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            mostrarPasswordConfirmacion
                              ? 'Ocultar confirmación de contraseña'
                              : 'Mostrar confirmación de contraseña'
                          }
                        >
                          {mostrarPasswordConfirmacion ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>

                      {erroresPassword.confirmacion && (
                        <p className="mt-1 text-xs text-red-600">{erroresPassword.confirmacion}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {mensajeFormulario && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />

              <span>{mensajeFormulario}</span>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelar}
                className="rounded-md border border-gray-300 px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleGuardar}
                disabled={!hayCambios || guardando}
                className="flex items-center gap-2 rounded-md cursor-pointer bg-abacontex-primary-three px-4 py-2 text-sm font-medium text-white transition hover:bg-abacontex-primary-two disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={17} />
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {confirmacionAbierta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-confirmar-perfil"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !guardando) {
              setConfirmacionAbierta(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h2
                  id="titulo-confirmar-perfil"
                  className="font-heading text-xl font-semibold text-abacontex-dark"
                >
                  Confirmar cambios
                </h2>

                <p className="mt-2 text-sm text-abacontex-gray-text">
                  ¿Está seguro que desea guardar los cambios?
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmacionAbierta(false)}
                disabled={guardando}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => void confirmarGuardado()}
                disabled={guardando}
                className="rounded-md bg-abacontex-primary-three px-4 py-2 text-sm font-medium text-white transition hover:bg-abacontex-primary-two disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {guardadoCorrecto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-perfil-actualizado"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <h2
                  id="titulo-perfil-actualizado"
                  className="font-heading text-xl font-semibold text-abacontex-dark"
                >
                  Perfil actualizado
                </h2>

                <p className="mt-2 text-sm text-abacontex-gray-text">
                  Los cambios se guardaron correctamente.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/alumno/perfil')}
                className="rounded-md bg-abacontex-primary-three px-5 py-2 text-sm font-medium text-white transition hover:bg-abacontex-primary-two"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
