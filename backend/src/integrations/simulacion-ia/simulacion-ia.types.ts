import {
  ClasificacionOpcionSimulacion,
  DificultadSimulacion,
  DuracionSimulacion,
} from '@prisma/client';
import { FlujoEmpresarial } from '../../constants/simulacion.constants';

export interface OpcionGeneradaIA {
  id: string; // ej: "E1-O1"
  texto: string;
  clasificacion: ClasificacionOpcionSimulacion;
  siguienteEventoId?: string | undefined;
  cambiosSimulados?: Record<string, unknown> | undefined;
}

export interface EventoGeneradoIA {
  id: string; // ej: "E1"
  tipo: 'DECISION' | 'INFORMATIVO' | 'FINAL';
  emisor: string; // ABA, CLIENTE, PROVEEDOR, PRODUCCION, FINANZAS, etc.
  esSorpresa: boolean;
  mensaje: string;
  rolesHabilitados?: string[] | undefined; // ej: ["COO", "CCO"]
  opciones?: OpcionGeneradaIA[] | undefined;
  siguienteEventoId?: string | undefined; // Para eventos informativos
}

export interface EstructuraSimulacionGeneradaIA {
  titulo: string;
  contextoInicial: string;
  eventoInicialId: string;
  eventos: EventoGeneradoIA[];
}

export interface GenerarSimulacionParams {
  flujo: FlujoEmpresarial;
  dificultad: DificultadSimulacion;
  duracion: DuracionSimulacion;
  eventosSorpresa: boolean;
  tipoEventoSorpresa?: string | undefined;
  usarDatosEmpresa: boolean;
}

export interface ISimulacionGeneratorProvider {
  generarEstructuraSimulacion(
    params: GenerarSimulacionParams
  ): Promise<EstructuraSimulacionGeneradaIA>;
}
