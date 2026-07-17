export interface DocenteActualResponseDTO {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  cursos: {
    id: number;
    nombre: string;
  }[];
}
