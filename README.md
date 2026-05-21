# **Nexora-G05**
Nexora es una plataforma ERP educativa. El sistema integra funcionalidades de gestión académica y administrativa junto con herramientas de asistencia pedagógica potenciadas mediante Inteligencia Artificial.

El proyecto se desarrolla bajo una arquitectura web distribuida basada en contenedores, utilizando tecnologías modernas tanto para frontend como backend, priorizando escalabilidad, mantenibilidad y desacoplamiento entre componentes.

---

# Tecnologías
## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Axios

## Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- Socket.IO
- Zod

## Infraestructura y DevOps
- Docker
- Docker Compose
- GitHub Actions

## Base de Datos y Seguridad
- PostgreSQL
- Keycloak

## Integraciones externas
- APIs de Inteligencia Artificial
- Servicio SMTP para envío de correos electrónicos

# Arquitectura general

La plataforma utiliza una arquitectura basada en contenedores desacoplados:

- Frontend web desarrollado en React
- Backend API REST desarrollado en Express
- Base de datos PostgreSQL
- Servidor de autenticación y autorización Keycloak
- Integraciones externas para IA y servicios de correo

La solución se organiza bajo una estrategia Monorepo, centralizando código fuente, documentación técnica y artefactos de planificación dentro de un único repositorio.

# Estructura del repositorio

```text
/
├── frontend/      # Aplicación frontend React
├── backend/       # API backend Express
├── database/      # Scripts y migraciones de base de datos
├── keycloak/      # Configuración del servidor Keycloak
├── docs/          # Documentación técnica y funcional
│   ├── adrs/                  # Architecture Decision Records
│   ├── user_stories/          # Historias de usuario
│   ├── casos_de_prueba/       # Casos de prueba y QA
│   ├── requerimientos/        # Requerimientos funcionales y técnicos
│   └── minutas/               # Minutas y registros de reuniones
├── planning/      # Artefactos de planificación
└── README.md
```

# Instalación
A definir

# Variables de entorno
A definir

# Política de ramas
El proyecto utiliza una estrategia de ramas basada en integración progresiva:

| Rama | Propósito |
|---|---|
| `main` | Contiene la versión estable y aprobada del sistema |
| `test` | Validaciones QA y pruebas funcionales previas a producción |
| `develop` | Integración de funcionalidades y correcciones |
| `feature/*` | Desarrollo de nuevas funcionalidades |
| `fix/*` | Corrección de errores |

Toda integración hacia ramas principales se realiza mediante Pull Requests y revisión previa del código.

## Flujo de trabajo
1. Crear una rama desde `develop`
2. Desarrollar la funcionalidad o corrección
3. Crear un Pull Request
4. Realizar revisión técnica
5. Integrar cambios en `develop`
6. Promover cambios a `test`
7. Ejecutar pruebas funcionales y QA
8. Liberar versión estable en `main`

### Consideraciones
- No se permiten commits directos sobre las ramas `develop`, `test` y `main`
- Todo Pull Request deberá contar con al menos una aprobación antes de ser integrado

## Convención commits
| Prefijo | Descripción |
|---|---|
| `feat:` | Incorporación de nuevas funcionalidades |
| `fix:` | Corrección de errores |
| `docs:` | Modificaciones en documentación |
| `refactor:` | Reestructuración interna del código sin alterar funcionalidades |
| `style:` | Cambios de formato o estilos visuales |
| `test:` | Incorporación o modificación de pruebas |
| `chore:` | Tareas de mantenimiento y configuración |

## Versionado
El sistema utiliza Semantic Versioning (SemVer):

```text
MAJOR.MINOR.PATCH
```

- `MAJOR`: cambios incompatibles
- `MINOR`: nuevas funcionalidades
- `PATCH`: corrección de errores

Las versiones estables son liberadas sobre la rama `main` y etiquetadas mediante tags de Git.

---

# Información adicional
## Equipo
Proyecto desarrollado por estudiantes de Ingeniería en Sistemas – UTN FRC.

### Integrantes
- Araoz, Noel 
- Bacci Fernández, Nazarena 
- Españon Acevedo, Braian Abel 
- Insfran, Agustina Ayelén
- Torazza Pacheco, María Marta 


## Gestion de configuracion
Consultar: `/docs/gestion_configuracion.md`