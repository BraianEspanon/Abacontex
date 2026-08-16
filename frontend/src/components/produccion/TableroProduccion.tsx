import { useState } from 'react';

import type {
  EstadoOrdenProduccion,
  OrdenProduccionTarjeta,
  TableroProduccion as TableroProduccionType,
} from '../../types/produccion.types';

import ColumnaProduccion from './ColumnaProduccion';

interface OrdenArrastrada {
  orden: OrdenProduccionTarjeta;
  estadoOrigen: EstadoOrdenProduccion;
}

interface TableroProduccionProps {
  columnas: TableroProduccionType['columnas'];
  onVerDetalle: (idOrden: number) => void;
  onIniciar: (idOrden: number) => void;
  onFinalizar: (idOrden: number) => void;
}

export default function TableroProduccion({
  columnas,
  onVerDetalle,
  onIniciar,
  onFinalizar,
}: TableroProduccionProps) {
  const [ordenArrastrada, setOrdenArrastrada] = useState<OrdenArrastrada | null>(null);

  const handleIniciarArrastre = (
    orden: OrdenProduccionTarjeta,
    estadoOrigen: EstadoOrdenProduccion
  ) => {
    setOrdenArrastrada({
      orden,
      estadoOrigen,
    });
  };

  const handleFinalizarArrastre = () => {
    setOrdenArrastrada(null);
  };

  const esDestinoValido = (estadoDestino: EstadoOrdenProduccion) => {
    if (!ordenArrastrada) {
      return false;
    }

    if (ordenArrastrada.estadoOrigen === 'PENDIENTE' && estadoDestino === 'EN_PRODUCCION') {
      return true;
    }

    if (ordenArrastrada.estadoOrigen === 'EN_PRODUCCION' && estadoDestino === 'FINALIZADA') {
      return true;
    }

    return false;
  };

  const handleSoltar = (estadoDestino: EstadoOrdenProduccion) => {
    if (!ordenArrastrada) {
      return;
    }

    if (!esDestinoValido(estadoDestino)) {
      setOrdenArrastrada(null);
      return;
    }

    const { orden, estadoOrigen } = ordenArrastrada;

    if (estadoOrigen === 'PENDIENTE' && estadoDestino === 'EN_PRODUCCION') {
      onIniciar(orden.idOrden);
    }

    if (estadoOrigen === 'EN_PRODUCCION' && estadoDestino === 'FINALIZADA') {
      onFinalizar(orden.idOrden);
    }

    setOrdenArrastrada(null);
  };

  const arrastrando = ordenArrastrada !== null;

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <ColumnaProduccion
        titulo="Pendientes"
        estado="PENDIENTE"
        ordenes={columnas.pendientes}
        arrastrando={arrastrando}
        esDestinoValido={esDestinoValido('PENDIENTE')}
        onVerDetalle={onVerDetalle}
        onIniciar={onIniciar}
        onFinalizar={onFinalizar}
        onIniciarArrastre={handleIniciarArrastre}
        onFinalizarArrastre={handleFinalizarArrastre}
        onSoltar={handleSoltar}
      />

      <ColumnaProduccion
        titulo="En producción"
        estado="EN_PRODUCCION"
        ordenes={columnas.enProceso}
        arrastrando={arrastrando}
        esDestinoValido={esDestinoValido('EN_PRODUCCION')}
        onVerDetalle={onVerDetalle}
        onIniciar={onIniciar}
        onFinalizar={onFinalizar}
        onIniciarArrastre={handleIniciarArrastre}
        onFinalizarArrastre={handleFinalizarArrastre}
        onSoltar={handleSoltar}
      />

      <ColumnaProduccion
        titulo="Finalizadas"
        estado="FINALIZADA"
        ordenes={columnas.finalizadas}
        arrastrando={arrastrando}
        esDestinoValido={esDestinoValido('FINALIZADA')}
        onVerDetalle={onVerDetalle}
        onIniciar={onIniciar}
        onFinalizar={onFinalizar}
        onIniciarArrastre={handleIniciarArrastre}
        onFinalizarArrastre={handleFinalizarArrastre}
        onSoltar={handleSoltar}
      />
    </section>
  );
}
