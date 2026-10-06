# Fase 1: Especificación de Requisitos y Contratos de Datos — Generación de Ejercicios con IA

Este documento detalla el contrato de interfaz, validaciones, esquemas Zod y códigos de respuesta HTTP para el endpoint de **Generación de Enunciados Contables con IA**, complementando a [`Decisiones Ejercicios y correcciones.md`](./Decisiones%20Ejercicios%20y%20correcciones.md) y [`roadmap_generacion_ejercicios_ia.md`](./roadmap_generacion_ejercicios_ia.md).

---

## 1. Visión General del Servicio

- **Endpoint:** `POST /ejercicios/generar`
- **Tipo de servicio:** Asistencial sin estado (_stateless_). No persiste borradores ni ejercicios en la base de datos.
- **Consumo:** Invocado desde la pestaña **Crear con IA** mediante el botón `[ ✨ Generar enunciado ]` o `[ 🔄 Regenerar enunciado ]`.
- **Autenticación:** Requiere token Keycloak válido (`authenticate`).
- **Autorización:** Rol `DOCENTE` (`requireRole(ROLES.DOCENTE)`).
- **Content-Type:** `application/json`.

---

## 2. Parámetros de Entrada (Request)

A diferencia de la digitalización OCR (que es binaria multipart), este endpoint recibe un payload JSON estructurado:

| Campo                   | Tipo       | Requerido | Restricciones / Valores Permitidos                                                                                        | Descripción                                                                                                                                                                               |
| :---------------------- | :--------- | :-------- | :------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cursoId`               | `number`   | **Sí**    | Entero positivo (`> 0`)                                                                                                   | Identificador del curso (`Curso.idCurso`). El backend consulta el año (`Curso.año`) para inyectar la regla societaria: **5.° año $\rightarrow$ S.R.L.** vs **6.° año $\rightarrow$ S.A.** |
| `tipoEjercicio`         | `string`   | **Sí**    | `COMPRAS_VENTAS_BASICAS`<br>`OPERACIONES_COMERCIALES_INTEGRADAS`<br>`AJUSTES_HOJA_TRABAJO`<br>`COSTOS_PROCESO_PRODUCTIVO` | Categoría temática del ejercicio contable a generar.                                                                                                                                      |
| `dificultad`            | `string`   | **Sí**    | `BASICO`<br>`INTERMEDIO`<br>`AVANZADO`                                                                                    | Determina cantidad de operaciones (~4, ~6, ~10) y su nivel de interdependencia.                                                                                                           |
| `contenidosAdicionales` | `string[]` | No        | Elementos permitidos:<br>`IVA`, `INTERESES`, `DESCUENTOS`                                                                 | Aplica principalmente a `COMPRAS_VENTAS_BASICAS`. Puede enviarse vacío (`[]`).                                                                                                            |
| `contextoAdicional`     | `string`   | No        | Máximo 200 caracteres (trim)                                                                                              | Indicaciones libres acotadas del docente (ej. rubro de la empresa o formas de cobro preferidas).                                                                                          |

### Ejemplo de Payload (Request Body)

```json
{
  "cursoId": 3,
  "tipoEjercicio": "COMPRAS_VENTAS_BASICAS",
  "dificultad": "INTERMEDIO",
  "contenidosAdicionales": ["IVA", "INTERESES"],
  "contextoAdicional": "Empresa dedicada a la venta de indumentaria deportiva."
}
```

---

## 3. Esquemas y Tipos en Backend

### 3.1. Constantes de Dominio (`src/constants/ejercicio.constants.ts`)

```typescript
export const TIPOS_EJERCICIO = [
  "COMPRAS_VENTAS_BASICAS",
  "OPERACIONES_COMERCIALES_INTEGRADAS",
  "AJUSTES_HOJA_TRABAJO",
  "COSTOS_PROCESO_PRODUCTIVO",
] as const;

export type TipoEjercicio = (typeof TIPOS_EJERCICIO)[number];

export const DIFICULTADES_EJERCICIO = [
  "BASICO",
  "INTERMEDIO",
  "AVANZADO",
] as const;

export type DificultadEjercicio = (typeof DIFICULTADES_EJERCICIO)[number];

export const CONTENIDOS_ADICIONALES = [
  "IVA",
  "INTERESES",
  "DESCUENTOS",
] as const;

export type ContenidoAdicional = (typeof CONTENIDOS_ADICIONALES)[number];
```

### 3.2. Validador Zod (`src/validators/ejercicio.validator.ts`)

```typescript
import { z } from "zod";
import {
  TIPOS_EJERCICIO,
  DIFICULTADES_EJERCICIO,
  CONTENIDOS_ADICIONALES,
} from "../constants/ejercicio.constants";

export const generarEjercicioSchema = z.object({
  body: z.object({
    cursoId: z.coerce.number().int().positive({
      message: "El curso es obligatorio y debe ser un ID válido.",
    }),
    tipoEjercicio: z.enum(TIPOS_EJERCICIO, {
      message: "Tipo de ejercicio no válido.",
    }),
    dificultad: z.enum(DIFICULTADES_EJERCICIO, {
      message: "Dificultad no válida.",
    }),
    contenidosAdicionales: z
      .array(z.enum(CONTENIDOS_ADICIONALES))
      .optional()
      .default([]),
    contextoAdicional: z
      .string()
      .trim()
      .max(200, "El contexto adicional no puede superar los 200 caracteres.")
      .optional(),
  }),
});

export type GenerarEjercicioDTO = z.infer<
  typeof generarEjercicioSchema
>["body"];
```

---

## 4. Respuesta del Servicio (Response)

El endpoint responde con código HTTP **200 OK** y el DTO estructurado para alimentar directamente la tarjeta de **Vista previa del ejercicio**:

### DTO (`src/dto/ejercicio/ejercicio.dto.ts`)

```typescript
export interface GenerarEjercicioResponseDTO {
  enunciadoTexto: string;
}
```

### Ejemplo de Respuesta Exitosa (HTTP 200)

```json
{
  "enunciadoTexto": "### SportCenter S.R.L. - Responsable Inscripto\n\n1. **02/05 - Factura Original N° 0001-00004523** de Distribuidora Gol S.A. por 50 pares de zapatillas a $ 25.000,00 c/u más IVA (21%). Se abona en cuenta corriente comercial a 30 días con un interés del 4%.\n\n2. **08/05 - Factura Duplicado N° 0001-00000102** a consumidor final por 10 pares de zapatillas a $ 45.000,00 c/u IVA incluido. Se cobra en efectivo.\n\n3. **15/05 - Recibo Original N° 0001-00000840** abonando el saldo adeudado del punto 1 con cheque corriente de Banco Galicia."
}
```

---

## 5. Códigos de Estado y Manejo de Errores

| Código HTTP          | Error Lanzado       | Motivo / Causa                                                                                   | Mensaje de Respuesta                                                                                                         |
| :------------------- | :------------------ | :----------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **200 OK**           | -                   | Generación completada con éxito.                                                                 | `{ enunciadoTexto: "..." }`                                                                                                  |
| **400 Bad Request**  | `BadRequestError`   | JSON malformado, campo obligatorio ausente, enums inválidos o contexto > 200 caracteres.         | `"Datos inválidos"` + detalle Zod.                                                                                           |
| **400 Bad Request**  | `BadRequestError`   | Saturación persistente o falla en el servicio de IA de Gemini.                                   | `"El servicio de generación está experimentando una alta demanda temporal. Por favor, intentá nuevamente en unos segundos."` |
| **401 Unauthorized** | `UnauthorizedError` | Token Keycloak inexistente, expirado o con firma no válida.                                      | `"Token no provisto o inválido."`                                                                                            |
| **403 Forbidden**    | `ForbiddenError`    | El usuario autenticado no posee el rol `DOCENTE`.                                                | `"Acceso denegado: se requiere rol docente."`                                                                                |
| **404 Not Found**    | `NotFoundError`     | El `cursoId` indicado no existe en la base de datos o el docente no está asignado a dicho curso. | `"El curso especificado no fue encontrado o no tiene permisos sobre él."`                                                    |

---

## 6. Estado del Entorno de Ejecución

Se reutilizan las variables ya configuradas para el módulo de IA en `.env`:

- `GEMINI_API_KEY`: clave de acceso a Google AI Studio.
- `GEMINI_OCR_MODELS`: modelos candidatos (`gemini-2.5-flash`, `gemini-2.0-flash`).
- `OCR_MOCK_ENABLED`: proveedor mock disponible para pruebas automatizadas y CI/CD sin consumo de tokens.
