import { ErrorDetalleItemDTO } from '../../dto/correccion/correccion.dto';

export interface ResultadoComparacionPlantilla {
  errores: ErrorDetalleItemDTO[];
  aciertos: number;
  diferenciasDetectadas: number;
  asientosIncompletos: number;
}
