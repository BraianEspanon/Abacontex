#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Abacontex - Generador de Certificados SSL Autofirmados (Desarrollo / Fallback)
# ==============================================================================
# Genera certificados SSL autofirmados en proxy/certs/ para permitir que Nginx
# inicie con HTTPS habilitado antes de emitir los certificados oficiales con Let's Encrypt.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERTS_DIR="${SCRIPT_DIR}/../proxy/certs"

mkdir -p "${CERTS_DIR}"

if [[ -f "${CERTS_DIR}/fullchain.pem" && -f "${CERTS_DIR}/privkey.pem" ]]; then
    echo "ℹ️  Ya existen certificados en ${CERTS_DIR}."
    echo "   Si desea regenerarlos, elimine fullchain.pem y privkey.pem y vuelva a ejecutar."
    exit 0
fi

echo "🔐 Generando certificados SSL autofirmados de desarrollo/fallback..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "${CERTS_DIR}/privkey.pem" \
  -out "${CERTS_DIR}/fullchain.pem" \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"

chmod 600 "${CERTS_DIR}/privkey.pem"
chmod 644 "${CERTS_DIR}/fullchain.pem"

echo "✅ Certificados generados exitosamente en ${CERTS_DIR}:"
echo "   - ${CERTS_DIR}/fullchain.pem"
echo "   - ${CERTS_DIR}/privkey.pem"

