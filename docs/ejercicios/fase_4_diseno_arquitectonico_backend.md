# Fase 4: Diseño Arquitectónico en Backend — Digitalización (OCR)

Este documento detalla el diseño técnico, la estructura de archivos, el flujo de datos y el desacoplamiento para implementar el submódulo de **Digitalización de Enunciados** en `backend/src/`, cumpliendo con [GuiaDesarrolloBackend.md](../GuiaDesarrolloBackend.md), [prompt-ia.md](../prompt-ia.md) y las decisiones acordadas en las Fases 1, 2 y 3.

---

## 1. Visión General del Pipeline

El endpoint `POST /ejercicios/digitalizar` es un servicio **asistencial sin persistencia en base de datos**:

1. Recibe el archivo multipart en memoria a través de Multer (`req.file`).
2. Valida la estructura de la petición con Zod (`validate(digitalizarEjercicioSchema)`).
3. Invoca al servicio de aplicación (`ejercicio.service.ts`).
4. Delega la extracción al proveedor de IA desacoplado (`integrations/ocr/ocr.service.ts`).
5. Transforma la imagen/PDF a Markdown limpio mediante **Gemini Flash**.
6. Retorna directamente `{ enunciadoTexto: string }` con código HTTP 200.

```text
HTTP Client (Docente)
      │
      │  POST /ejercicios/digitalizar (multipart/form-data)
      ▼
┌────────────────────────────────────────────────────────┐
│ Express Pipeline (ejercicio.routes.ts)                 │
│  ├─ 1. authenticate (Keycloak)                         │
│  ├─ 2. requireRole(ROLES.DOCENTE)                      │
│  └─ 3. uploadDocumento.single('archivo')               │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ ejercicio.controller.ts                                │
│  └─ Pasa req.file directamente al service              │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ ejercicio.service.ts                                   │
│  ├─ Valida presencia del archivo (req.file)            │
│  └─ Coordina la extracción con el módulo de OCR        │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ integrations/ocr/ocr.service.ts                        │
│  ├─ Prepara el buffer y mimetype (inlineData)          │
│  ├─ Ejecuta llamada a Gemini Flash con system prompt   │
│  └─ Extrae y sanitiza el Markdown resultante           │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
                 HTTP 200 { enunciadoTexto }
```

---

## 2. Mapa de Archivos a Incorporar en `backend/src/`

Siguiendo la convención por capas y el patrón existente de `src/integrations/storage/`:

```text
backend/src/
├── integrations/
│   └── ocr/
│       ├── ocr.types.ts            # Interfaces y tipos del proveedor de OCR
│       ├── gemini.client.ts        # Inicialización del cliente de IA (Gemini)
│       └── ocr.service.ts          # Implementación de extracción de documentos
│
├── dto/
│   └── ejercicio/
│       └── ejercicio.dto.ts        # Contrato de datos de respuesta (DTO)
│
├── services/
│   └── ejercicio.service.ts        # Lógica de aplicación y coordinación
│
├── controllers/
│   └── ejercicio.controller.ts     # Controlador HTTP delgado
│
├── routes/
│   └── ejercicio.routes.ts         # Definición del endpoint y middlewares
│
├── docs/
│   ├── schemas/
│   │   └── ejercicio.schema.ts     # Definición OpenAPI/Swagger de esquemas
│   └── paths/
│       └── ejercicio.paths.ts      # Definición OpenAPI/Swagger de endpoints
│
└── app.ts                          # Montaje de router: app.use('/ejercicios', ...)
```

---

## 3. Especificación de Componentes

### 3.1. Integración OCR (`src/integrations/ocr/`)

#### `ocr.types.ts`

Define el contrato abstracto del proveedor para asegurar que el backend no quede acoplado a un SDK particular:

```typescript
export interface ExtraccionDocumentoResult {
  enunciadoTexto: string;
}

export interface IOcrProvider {
  extraerTexto(
    buffer: Buffer,
    mimetype: string,
  ): Promise<ExtraccionDocumentoResult>;
}
```

#### `gemini.client.ts`

Inicializa el cliente de Google Gen AI reutilizando la variable de entorno `GEMINI_API_KEY`:

```typescript
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("ADVERTENCIA: GEMINI_API_KEY no está configurada.");
}

export const aiClient = new GoogleGenAI({ apiKey: apiKey ?? "" });
```

#### `ocr.service.ts`

Construye la carga multimodal, define el _System Instruction_ con las reglas contables de extracción a Markdown (GFM) y ejecuta la llamada:

- Convierte el `Buffer` en base64 con su respectivo `mimetype`.
- Usa el modelo `gemini-2.5-flash` o `gemini-2.0-flash` por su óptima relación velocidad/costo/visión.
- Limpia bloques de código envolventes tipo `markdown ... ` si el modelo los retorna, entregando el texto puro.

---

### 3.2. DTO (`src/dto/ejercicio/ejercicio.dto.ts`)

Al ser una subida pura de archivo en memoria (`multipart/form-data`), no requiere validación de body en la ruta. Los datos que viajan al cliente se tipan en su propio DTO:

```typescript
export interface DigitalizarEjercicioResponseDTO {
  enunciadoTexto: string;
}
```

---

### 3.3. Servicio de Aplicación (`src/services/ejercicio.service.ts`)

Responsabilidades:

- Recibir `file?: Express.Multer.File`.
- Aplicar guard clauses para verificar la presencia del archivo:
  ```typescript
  if (!file || !file.buffer) {
    throw new BadRequestError(
      "Debe adjuntar un archivo de imagen o PDF para digitalizar.",
    );
  }
  ```
- Validar que el archivo no esté vacío (`file.size > 0`).
- Invocar a `ocrService.extraerTexto(file.buffer, file.mimetype)`.
- Retornar `{ enunciadoTexto }`.

---

### 3.4. Controlador (`src/controllers/ejercicio.controller.ts`)

Controlador delgado y directo:

```typescript
import { Request, Response } from "express";
import * as ejercicioService from "../services/ejercicio.service";

export async function digitalizarEjercicio(req: Request, res: Response) {
  const resultado = await ejercicioService.digitalizarEjercicio(req.file);

  res.status(200).json(resultado);
}
```

---

### 3.5. Rutas (`src/routes/ejercicio.routes.ts`)

Pipeline limpio sin middlewares redundantes:

```typescript
import { Router } from "express";
import { ROLES } from "../constants/roles";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { uploadDocumento } from "../middleware/upload.middleware";
import { digitalizarEjercicio } from "../controllers/ejercicio.controller";

const router = Router();

router.post(
  "/digitalizar",
  authenticate,
  requireRole(ROLES.DOCENTE),
  uploadDocumento.single("archivo"),
  digitalizarEjercicio,
);

export default router;
```

---

## 4. Middleware de Carga y Soporte de PDFs

Actualmente, [`src/middleware/upload.middleware.ts`](../backend/src/middleware/upload.middleware.ts) permite `image/jpeg`, `image/png`, `image/webp` con límite de 5 MB.

Para soportar los requisitos acordados en la Fase 2:

1. **Límite de tamaño:** Extender a `10 MB` para el endpoint de digitalización o crear una variante específica (`uploadEjercicio` o parametrizar `ALLOWED_MIME_TYPES`).
2. **Formatos permitidos:** Incorporar `application/pdf` a los tipos MIME válidos para digitalización de enunciados.

---

## 5. Manejo de Errores y Casos Borde

Se utilizan exclusivamente las clases de error del dominio del proyecto:

| Escenario                    | Error Lanzado                     | Código HTTP | Mensaje al Usuario                                                                            |
| :--------------------------- | :-------------------------------- | :---------- | :-------------------------------------------------------------------------------------------- |
| Petición sin archivo adjunto | `BadRequestError`                 | 400         | "Debe adjuntar un archivo de imagen o PDF para digitalizar."                                  |
| Formato MIME no soportado    | `BadRequestError`                 | 400         | "Solo se permite cargar archivos de imagen (JPG, PNG, WEBP) o PDF."                           |
| Archivo supera los 10 MB     | `MulterError` / `BadRequestError` | 400         | "El archivo supera el tamaño máximo permitido de 10 MB."                                      |
| Imagen ilegible / sin texto  | `BadRequestError`                 | 400         | "No se pudo extraer texto del archivo. Verifique la nitidez de la imagen."                    |
| Falla de API / Timeout de IA | `BadRequestError`                 | 400         | "El servicio de digitalización no se encuentra disponible temporalmente. Intente nuevamente." |

---

## 6. Variables de Entorno Requeridas

Se añade al archivo `.env.example` y a los entornos de ejecución (`docker-compose.yml`):

```env
# =====================
# INTELIGENCIA ARTIFICIAL (OCR)
# =====================
GEMINI_API_KEY=tu_api_key_aqui

# Opcionales (con defaults en código):
# Modelos candidatos en orden de prioridad para fallback ante saturación (separados por coma)
GEMINI_OCR_MODELS=gemini-2.5-flash,gemini-2.0-flash

# Tamaño máximo de subida para documentos (en MB, default 10)
OCR_MAX_FILE_SIZE_MB=10

# Activa el proveedor Mock simulado para tests automáticos / CI o desarrollo frontend sin cuota (true/false)
OCR_MOCK_ENABLED=false
```
