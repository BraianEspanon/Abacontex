import { Prisma } from '@prisma/client';
import { HistorialConciliacionItemDTO } from './conciliacion.dto';

export type HistorialConciliacionPayload = Prisma.ConciliacionFinancieraGetPayload<{
  select: {
    idConciliacion: true;
    fecha: true;
    saldoEsperado: true;
    saldoContado: true;
    diferencia: true;
    observacion: true;
    alumno: {
      select: {
        usuario: {
          select: {
            nombre: true;
            apellido: true;
          };
        };
      };
    };
  };
}>;

export class ConciliacionMapper {
  static toHistorialDTO(conciliacion: HistorialConciliacionPayload): HistorialConciliacionItemDTO {
    return {
      idConciliacion: conciliacion.idConciliacion,
      fecha: conciliacion.fecha,
      alumno: `${conciliacion.alumno.usuario.nombre} ${conciliacion.alumno.usuario.apellido}`,
      saldoEsperado: Number(conciliacion.saldoEsperado),
      saldoContado: Number(conciliacion.saldoContado),
      diferencia: Number(conciliacion.diferencia),
      observacion: conciliacion.observacion,
    };
  }
}
