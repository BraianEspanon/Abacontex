export interface CandidatoResponseDTO {
  id: string;

  nombre: string;

  apellido: string;

  email: string;

  fotoPerfilUrl: string | null;

  rolEmpresa: {
    id: number;
    nombre: string;
  } | null;
}
