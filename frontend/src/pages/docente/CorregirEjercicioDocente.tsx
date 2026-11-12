import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import CabeceraCorreccion from '../../components/correcciones/CabeceraCorreccion';
import DetalleErrorModal from '../../components/correcciones/DetalleErrorModal';
import PlantillasCorreccion from '../../components/correcciones/PlantillasCorreccion';
import ResumenRevision from '../../components/correcciones/ResumenRevision';
import RetroalimentacionCorreccion from '../../components/correcciones/RetroalimentacionCorreccion';

import Button from '../../components/ui/Button';

import { useEstadoEntregaCorreccion } from '../../hooks/useEstadoEntregaCorreccion';
import {
  useEspacioTrabajoCorreccion,
  useMutacionesCorreccion,
} from '../../hooks/useEspacioTrabajoCorreccion';

import type {
  ErrorDetalleCorreccion,
  EstadoRevisionPlantilla,
} from '../../types/espacioTrabajoCorreccion.types';

function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const datos = error.response?.data as { message?: string; error?: string } | undefined;

    return datos?.message ?? datos?.error ?? 'No se pudo completar la operación.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado.';
}

export default function CorregirEjercicioDocente() {
  const { entregaId: entregaIdParam } = useParams();
  const entregaId = Number(entregaIdParam);

  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<number | null>(null);

  const [errorSeleccionado, setErrorSeleccionado] = useState<ErrorDetalleCorreccion | null>(null);

  const [retroalimentacion, setRetroalimentacion] = useState('');
  const [ultimoTextoGuardado, setUltimoTextoGuardado] = useState('');

  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const [finalizadaLocalmente, setFinalizadaLocalmente] = useState(false);

  const entregaInicializada = useRef<number | null>(null);

  const { data, isLoading, isError, refetch } = useEspacioTrabajoCorreccion(entregaId);

  const {
    data: estadoEntrega,
    isLoading: cargandoEstado,
    isError: errorEstado,
    refetch: recargarEstado,
  } = useEstadoEntregaCorreccion(data?.ejercicio.idEjercicio, entregaId);

  const { revisarPlantilla, guardarBorrador, guardarComentario, sugerirIa, finalizar } =
    useMutacionesCorreccion(entregaId);

  const plantillaActual =
    data?.plantillas.find(
      (plantilla) => plantilla.idEjercicioPlantilla === plantillaSeleccionada
    ) ?? data?.plantillas[0];

  const idPlantillaActual = plantillaActual?.idEjercicioPlantilla ?? null;

  // Inicializar los datos de una entrega.
  useEffect(() => {
    if (!data) return;

    if (entregaInicializada.current === entregaId) {
      return;
    }

    const textoInicial = data.retroalimentacionBorrador ?? '';

    setRetroalimentacion(textoInicial);
    setUltimoTextoGuardado(textoInicial);
    setFinalizadaLocalmente(false);
    setErrorSeleccionado(null);

    entregaInicializada.current = entregaId;
  }, [data, entregaId]);

  // Estado de la corrección.
  const estadoVerificado = estadoEntrega !== undefined && !errorEstado;

  const finalizada = finalizadaLocalmente || estadoEntrega === 'CORREGIDA';

  const accionesBloqueadas =
    !estadoVerificado ||
    finalizada ||
    revisarPlantilla.isPending ||
    guardarBorrador.isPending ||
    guardarComentario.isPending ||
    finalizar.isPending;

  const plantillasPendientes =
    data?.plantillas.filter((plantilla) => plantilla.estadoRevision !== 'CORREGIDA').length ?? 0;

  const cambiosSinGuardar = retroalimentacion !== ultimoTextoGuardado;

  const puedeFinalizar =
    estadoVerificado &&
    !finalizada &&
    Boolean(data?.plantillas.length) &&
    plantillasPendientes === 0 &&
    !accionesBloqueadas;

  // Recuperar el error actualizado después de una mutación.
  const errorActualizado = errorSeleccionado
    ? (data?.plantillas
        .flatMap((plantilla) => plantilla.errores)
        .find((error) => {
          if (error.idError !== null && errorSeleccionado.idError !== null) {
            return error.idError === errorSeleccionado.idError;
          }

          return (
            error.ejercicioPlantillaId === errorSeleccionado.ejercicioPlantillaId &&
            error.tipoError === errorSeleccionado.tipoError &&
            JSON.stringify(error.detalle) === JSON.stringify(errorSeleccionado.detalle)
          );
        }) ?? errorSeleccionado)
    : null;

  function limpiarMensajes() {
    setMensajeError(null);
    setMensajeExito(null);
  }

  // Cambiar el estado de una plantilla.
  async function cambiarEstado(plantillaId: number, estado: EstadoRevisionPlantilla) {
    if (accionesBloqueadas) return;

    limpiarMensajes();

    try {
      await revisarPlantilla.mutateAsync({
        plantillaId,
        datos: { estado },
      });

      setMensajeExito('Estado de revisión actualizado.');
    } catch (error) {
      setMensajeError(obtenerMensajeError(error));
    }
  }

  // Guardar la observación del docente.
  async function guardarObservacion(error: ErrorDetalleCorreccion, comentario: string) {
    if (accionesBloqueadas) {
      throw new Error('La corrección no está disponible para edición.');
    }

    limpiarMensajes();

    try {
      await guardarComentario.mutateAsync({
        ...(error.idError !== null ? { idError: error.idError } : {}),
        ejercicioPlantillaId: error.ejercicioPlantillaId,
        tipoError: error.tipoError,
        detalle: error.detalle,
        comentario: comentario || null,
      });

      setMensajeExito('Observación guardada correctamente.');
    } catch (errorGuardado) {
      setMensajeError(obtenerMensajeError(errorGuardado));

      throw errorGuardado;
    }
  }

  // Guardar borrador de retroalimentación.
  async function guardarRetroalimentacion() {
    if (accionesBloqueadas) return;

    limpiarMensajes();

    const textoActual = retroalimentacion;

    try {
      await guardarBorrador.mutateAsync({
        retroalimentacion: textoActual,
      });

      setUltimoTextoGuardado(textoActual);

      setMensajeExito('Borrador guardado correctamente.');
    } catch (error) {
      setMensajeError(obtenerMensajeError(error));
    }
  }

  // Generar sugerencia con IA.
  async function generarSugerencia() {
    if (accionesBloqueadas || !data?.controlIa.puedeSugerirIa || sugerirIa.isPending) {
      return;
    }

    if (
      retroalimentacion.trim() &&
      !window.confirm('La sugerencia reemplazará el texto actual. ¿Querés continuar?')
    ) {
      return;
    }

    limpiarMensajes();

    try {
      const resultado = await sugerirIa.mutateAsync();

      setRetroalimentacion(resultado.sugerencia.slice(0, 500));

      setMensajeExito('Sugerencia generada. Revisala antes de guardar o enviar.');
    } catch (error) {
      setMensajeError(obtenerMensajeError(error));
    }
  }

  // Finalizar la entrega.
  async function finalizarEntrega() {
    if (!puedeFinalizar || finalizar.isPending) {
      return;
    }

    const confirmado = window.confirm(
      '¿Querés finalizar esta corrección? Se notificará al alumno y ya no podrás modificarla.'
    );

    if (!confirmado) return;

    limpiarMensajes();

    try {
      const resultado = await finalizar.mutateAsync({
        retroalimentacion,
      });

      setFinalizadaLocalmente(true);

      setUltimoTextoGuardado(retroalimentacion);

      setMensajeExito(resultado.mensaje);

      await recargarEstado();
    } catch (error) {
      setMensajeError(obtenerMensajeError(error));
    }
  }

  // Validar identificador.
  if (!Number.isInteger(entregaId) || entregaId <= 0) {
    return <p className="p-6 text-sm text-red-600">El identificador de la entrega no es válido.</p>;
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Cargando espacio de corrección...</div>;
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-sm text-red-600">No se pudo cargar la entrega.</p>

        <Button
          type="button"
          label="Reintentar"
          variant="solid"
          onClick={() => void refetch()}
          className="!rounded-lg !px-4 !py-2 text-sm"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Cabecera */}
      <CabeceraCorreccion datos={data} />

      {/* Indicadores */}
      <ResumenRevision kpis={data.kpis} />

      {/* Verificación de estado */}
      {cargandoEstado && (
        <p className="text-sm text-gray-500">Verificando el estado de la corrección...</p>
      )}

      {errorEstado && (
        <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            No se pudo verificar el estado de la entrega. Las acciones permanecerán bloqueadas por
            seguridad.
          </p>

          <Button
            type="button"
            label="Reintentar"
            variant="outline"
            onClick={() => void recargarEstado()}
            className="!mt-3 !rounded-lg !px-3 !py-2 text-sm"
          />
        </div>
      )}

      {/* Mensaje de error */}
      {mensajeError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {mensajeError}
        </div>
      )}

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {mensajeExito}
        </div>
      )}

      {/* Plantillas */}
      <PlantillasCorreccion
        key={`${entregaId}-${idPlantillaActual}`}
        plantillas={data.plantillas}
        plantillaSeleccionada={idPlantillaActual}
        onSeleccionar={setPlantillaSeleccionada}
        onCambiarEstado={(id, estado) => void cambiarEstado(id, estado)}
        onComentarError={setErrorSeleccionado}
        guardando={accionesBloqueadas}
        finalizada={finalizada || !estadoVerificado}
      />

      {/* Retroalimentación */}
      <RetroalimentacionCorreccion
        texto={retroalimentacion}
        onCambiarTexto={setRetroalimentacion}
        onGuardar={() => void guardarRetroalimentacion()}
        onSugerirIa={() => void generarSugerencia()}
        onFinalizar={() => void finalizarEntrega()}
        guardando={guardarBorrador.isPending}
        sugiriendo={sugerirIa.isPending}
        finalizando={finalizar.isPending}
        puedeSugerirIa={estadoVerificado && !accionesBloqueadas && data.controlIa.puedeSugerirIa}
        motivoDeshabilitadoIa={data.controlIa.motivoDeshabilitadoIa}
        puedeFinalizar={puedeFinalizar}
        plantillasPendientes={plantillasPendientes}
        finalizada={finalizada || !estadoVerificado}
        cambiosSinGuardar={cambiosSinGuardar}
      />

      {/* Modal de detalle del error */}
      {errorActualizado && (
        <DetalleErrorModal
          key={
            errorActualizado.idError ??
            `${errorActualizado.ejercicioPlantillaId}-${errorActualizado.tipoError}-${JSON.stringify(errorActualizado.detalle)}`
          }
          error={errorActualizado}
          guardando={guardarComentario.isPending}
          soloLectura={finalizada || !estadoVerificado}
          onCerrar={() => setErrorSeleccionado(null)}
          onGuardar={guardarObservacion}
        />
      )}
    </div>
  );
}
