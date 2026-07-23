import crypto from 'crypto';

export function generarTokenInvitacion(): string {
  return crypto.randomUUID();
}
