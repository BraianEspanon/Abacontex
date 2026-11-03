# Reverse Proxy Nginx — Abacontex

Este directorio contiene la arquitectura y configuración del **Reverse Proxy Nginx** contenerizado para Abacontex, aplicado a todos los entornos (desarrollo, testing local y producción).

---

## Estructura

```text
proxy/
├── conf.d/
│   ├── dev.conf         # Configuración para Desarrollo (Vite HMR WebSockets + Backend + Keycloak)
│   └── default.conf     # Configuración para Producción / Release (SPA Nginx + Subdominios)
├── certs/
│   └── .gitkeep         # Almacén de certificados SSL (excluidos en .gitignore)
└── README.md
```

---

## Archivos de Configuración

### 1. Desarrollo (`conf.d/dev.conf`)
- Utilizado automáticamente por `docker-compose.yml`.
- Enruta el Frontend a `frontend:5173` (Vite dev server).
- Habilita WebSockets con `$connection_upgrade` para que **Hot Module Replacement (HMR)** funcione en vivo al modificar componentes React.
- Enruta `/api/` y WebSockets `/socket.io/` a `backend:3000`.
- Enruta autenticación a `keycloak:8080`.
- Elimina cualquier conflicto de CORS al operar bajo el mismo origen `http://localhost`.

### 2. Producción / Release (`conf.d/default.conf`)
- Utilizado por `docker-compose.release.yml` y `docker-compose.test.local.yml`.
- Enruta el Frontend a `frontend:80` (Nginx Alpine con assets estáticos compilados).
- Soporta nombres de dominio virtuales (Virtual Hosts):
  - `abacontex.institucion.edu.ar` $\rightarrow$ Frontend SPA
  - `api.abacontex.institucion.edu.ar` $\rightarrow$ Backend API y Socket.IO
  - `auth.abacontex.institucion.edu.ar` $\rightarrow$ Keycloak IAM
- Soporte para certificados SSL/TLS en `proxy/certs/`.

---

## Cómo Ejecutarlo

### En Desarrollo:
```bash
docker compose up -d
```
Acceso:
- `http://localhost/` $\rightarrow$ Aplicación Frontend (con recarga instantánea)
- `http://localhost/api/` $\rightarrow$ Backend API
- `http://localhost/health` $\rightarrow$ Estado de salud

*(Nota: Los puertos individuales `5173`, `3000`, `8080` siguen estando accesibles directamente).*

### En Producción:
```bash
docker compose -f docker-compose.release.yml up -d
```
