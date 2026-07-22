export function getRegistrationUrl(email: string): string {
  return (
    `${process.env.KEYCLOAK_ISSUER}` +
    `/protocol/openid-connect/registrations` +
    `?client_id=${process.env.KEYCLOAK_FRONTEND_CLIENT_ID}` +
    `&response_type=code` +
    `&scope=openid` +
    `&redirect_uri=${process.env.FRONTEND_URL}` +
    `&login_hint=${encodeURIComponent(email)}`
  );
}
