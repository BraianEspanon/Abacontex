export interface CursoDocente {
  id: number;
  nombre: string;
}

export interface DocenteActual {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  cursos: CursoDocente[];
}
