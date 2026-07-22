export interface InvitacionDTO {
  empresaId: number;
  createdById: string;
  email: string;
  token: string;
  fechaExpiracion: Date;
}
