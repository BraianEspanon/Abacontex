export interface AlumnoActualResponse {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  registroCompleto: boolean;

  curso: {
    id: number;
    nombre: string;
  } | null;

  rolEmpresa: {
    id: number;
    nombre: string;
    descripcion: string | null;
  } | null;

  empresa: {
    id: number;
    nombre: string;
  } | null;
}
