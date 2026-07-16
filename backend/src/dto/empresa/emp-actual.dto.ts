export interface EmpresaActualResponseDTO {
  id: number;
  nombre: string;
  actividad: string;
  logoUrl: string | null;
  puntos: number;

  curso: {
    id: number;
    nombre: string;
  };

  cicloLectivo: {
    id: number;
    nombre: number;
  };

  integrantes: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;

    rolEmpresa: {
      id: number;
      nombre: string;
    } | null;
  }[];
}
