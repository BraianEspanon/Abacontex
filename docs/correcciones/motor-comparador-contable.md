# Especificación del Motor de Comparación Contable Determinista

Este documento detalla exhaustivamente las reglas contables, comprobaciones deterministas y tipos de errores detectados en el **Espacio de Trabajo de Corrección** (`GET /correcciones/entregas/:entregaId`) dentro de Abacontex.

---

## 1. Principio de Diseño y Filosofía

```
┌────────────────────────────────────────────────────────────────────────┐
│               MOTOR DETERMINISTA EN MEMORIA (< 20 ms)                  │
├────────────────────────────────────────────────────────────────────────┤
│ • Sin consumo de tokens de Inteligencia Artificial (Cero Costo).       │
│ • Comparación matemática y de dominio entre Alumno y Solución Modelo.  │
│ • Detección a nivel de celda para renderizado visual (rojo/alerta).    │
│ • Cálculo instantáneo de KPIs y control de acceso a sugerencia IA.    │
└────────────────────────────────────────────────────────────────────────┘
```

La comparación se realiza elemento por elemento según la plantilla analizada, mapeando cada discrepancia al enum `TipoErrorCorreccion` de Prisma y enriqueciéndola con un objeto `detalle` estructurado para que el frontend pueda resaltar visualmente la celda observada.

---

## 2. Comprobaciones Puntuales por Plantilla

### 2.1. Plantilla 1: Libro Diario (`LIBRO_DIARIO`)

Archivo de lógica: [`backend/src/utils/comparadores-plantillas/libro-diario.comparador.ts`](../../backend/src/utils/comparadores-plantillas/libro-diario.comparador.ts)

| Situación Detectada | Error Emitido (`TipoErrorCorreccion`) | Celda Observada | Detalle Reportado | Impacto en KPIs |
| :--- | :--- | :--- | :--- | :--- |
| **Asiento omitido por completo** | `CUENTA_OMITIDA` (para cada línea esperada) | `cuenta` | Número de asiento, cuenta esperada y motivo. | `asientosIncompletos++` |
| **Asiento desbalanceado** (Total Debe $\neq$ Total Haber con $\Delta > 0.01$) | `IMPORTE_INCORRECTO` | `balance` | N° de asiento, sumatoria de Debe vs sumatoria de Haber. | `asientosIncompletos++` |
| **Cuenta contable incorrecta** (el alumno utilizó una cuenta no esperada en esa posición) | `CUENTA_INCORRECTA` | `cuenta` | N° de asiento, cuenta esperada vs cuenta utilizada por el alumno. | `diferenciasDetectadas++` |
| **Cuenta omitida en el asiento** (falta una de las líneas requeridas) | `CUENTA_OMITIDA` | `cuenta` | N° de asiento, cuenta faltante que debía registrarse. | `asientosIncompletos++` |
| **Cuenta adicional no requerida** (el alumno agregó renglones sobrantes) | `CUENTA_ADICIONAL` | `cuenta` | N° de asiento, cuenta sobrante detectada. | `diferenciasDetectadas++` |
| **Variación patrimonial errónea** (ej. colocó `A-` en vez de `A+`) | `TIPO_MOVIMIENTO_INCORRECTO` | `movimiento` | N° de asiento, movimiento esperado vs obtenido. | `diferenciasDetectadas++` |
| **Debe y Haber invertidos** (se acreditó una cuenta que debía debitarse o viceversa) | `DEBE_HABER_INVERTIDO` | `debe_haber` | N° de asiento, valores esperados e invertidos. | `diferenciasDetectadas++` |
| **Importe individual incorrecto** (valor numérico con $\Delta > 0.01$) | `IMPORTE_INCORRECTO` | `debe` o `haber` | N° de asiento, columna afectada, importe esperado vs ingresado. | `diferenciasDetectadas++` |
| **Asiento 100% idéntico y balanceado** | *(Sin error)* | — | Coincidencia exacta con la solución docente. | `aciertos++` |

---

### 2.2. Plantilla 2: Libro Mayor (`LIBRO_MAYOR`)

Archivo de lógica: [`backend/src/utils/comparadores-plantillas/libro-mayor.comparador.ts`](../../backend/src/utils/comparadores-plantillas/libro-mayor.comparador.ts)

| Situación Detectada | Error Emitido (`TipoErrorCorreccion`) | Celda Observada | Detalle Reportado | Impacto en KPIs |
| :--- | :--- | :--- | :--- | :--- |
| **Sustitución de cuenta unívoca** (falta exactamente 1 esperada y sobra 1 entregada) | `CUENTA_INCORRECTA` | `cuenta` | Cuenta esperada vs cuenta entregada. | `diferenciasDetectadas++` |
| **Cuenta omitida de mayorizar** (falta la ficha T en casos de ambigüedad de 2 o más cuentas) | `CUENTA_MAYORIZAR_OMITIDA` | `cuenta` | ID y nombre de la cuenta omitida. | `asientosIncompletos++` |
| **Cuenta adicional / indebida** (mayorizó una cuenta que no correspondía en casos múltiples) | `CUENTA_ADICIONAL` | `cuenta` | ID y nombre de la cuenta sobrante. | `diferenciasDetectadas++` |
| **Importe acumulado incorrecto** (total de débitos en Debe o créditos en Haber $\Delta > 0.01$) | `IMPORTE_INCORRECTO` | `debe` o `haber` | Cuenta afectada, columna, importe acumulado esperado vs obtenido. | `diferenciasDetectadas++` |
| **Saldo final incorrecto** (diferencia en el saldo absoluto $\Delta > 0.01$) | `SALDO_FINAL_INCORRECTO` | `saldo` | Cuenta afectada, saldo calculado esperado vs obtenido. | `diferenciasDetectadas++` |
| **Tipo de saldo incorrecto** (clasificó como `ACREEDOR`/`DEUDOR` cuando sus movimientos dan `SALDADA`, o difiere de la solución) | `TIPO_SALDO_INCORRECTO` | `tipoSaldo` | Cuenta, tipo de saldo esperado/calculado vs seleccionado por el alumno. | `diferenciasDetectadas++` |
| **Cuenta mayorizada correctamente** | *(Sin error)* | — | Coincidencia en totales, saldo y tipo de saldo. | `aciertos++` |

#### Heurística de Emparejamiento en Libro Mayor (Independiente del orden):
1. **Emparejamiento exacto:** Primero empareja todas las cuentas coincidentes por `idCuenta` sin importar en qué orden las cargó el alumno.
2. **Certeza Unívoca ($1$ a $1$):** Si tras el paso 1 queda exactamente **1 cuenta sin emparejar en el docente** y **1 cuenta sin emparejar en el alumno**, se asume sustitución directa:
   - Se emite `CUENTA_INCORRECTA` por la selección de la cuenta (evitando penalizar como faltante y sobrante al mismo tiempo).
   - Se comparan los importes acumulados de Debe y Haber (`IMPORTE_INCORRECTO`), el saldo neto numérico (`SALDO_FINAL_INCORRECTO`) y el tipo de saldo (`TIPO_SALDO_INCORRECTO`) de la cuenta sustituta contra la solución esperada de la cuenta docente.
3. **Múltiples huérfanas (Ambigüedad):** Si faltan 2 o más y sobran 2 o más (o cantidades asimétricas), no se adivinan intenciones para evitar falsos errores de importes cruzados; se marcan las faltantes como `CUENTA_MAYORIZAR_OMITIDA` y las sobrantes como `CUENTA_ADICIONAL`.
4. **Evaluación de consistencia interna del saldo:** Toda cuenta presentada por el alumno (incluso si fue clasificada como `CUENTA_INCORRECTA` o `CUENTA_ADICIONAL`) se valida contra sus propios movimientos; si sus números dan saldo cero y seleccionó `ACREEDOR`, se marca `TIPO_SALDO_INCORRECTO` para garantizar el aprendizaje del cálculo de la cuenta T.

---

### 2.3. Plantilla 3: Libro IVA (`LIBRO_IVA`)

Archivo de lógica: [`backend/src/utils/comparadores-plantillas/libro-iva.comparador.ts`](../../backend/src/utils/comparadores-plantillas/libro-iva.comparador.ts)

| Situación Detectada | Error Emitido (`TipoErrorCorreccion`) | Celda Observada | Detalle Reportado | Impacto en KPIs |
| :--- | :--- | :--- | :--- | :--- |
| **Sustitución de comprobante 1 a 1** (falta 1 esperado y sobra 1 entregado en Compras/Ventas) | `COMPROBANTE_OMITIDO` | `comprobante` | N° de comprobante esperado vs entregado. Se evalúan importes del sustituto. | `diferenciasDetectadas++` |
| **Comprobante omitido** (factura ausente en casos múltiples) | `COMPROBANTE_OMITIDO` | `comprobante` | Sección (`Compras`/`Ventas`), N° de comprobante y emisor/receptor. | `asientosIncompletos++` |
| **Comprobante adicional** (factura cargada que no correspondía en casos múltiples) | `COMPROBANTE_ADICIONAL` | `comprobante` | Sección, N° de comprobante no contemplado. | `diferenciasDetectadas++` |
| **Importe incorrecto en comprobante** (Neto gravado, IVA o Total con $\Delta > 0.01$) | `IMPORTE_INCORRECTO` | `netoGravado`, `iva` o `total` | Sección, columna específica con importe esperado vs obtenido. | `diferenciasDetectadas++` |
| **Liquidación mensual de IVA incorrecta o faltante** | `CLASIFICACION_SALDO_INCORRECTA` | `resultado` | Resultado esperado (`A_PAGAR` vs `A_FAVOR_CONTRIBUYENTE`) vs obtenido. | `diferenciasDetectadas++` |
| **Puntos de control correctos** (comprobante, neto, iva, total o liquidación mensual) | *(Sin error)* | — | Coincidencia exacta con la solución docente en cada campo. | `aciertos++` |

> [!NOTE]
> **Criterio Pedagógico sobre la Fecha:** Por diseño deliberado para evitar falsos positivos y frustración innecesaria en el alumno, la fecha del comprobante no se penaliza con `FECHA_INCORRECTA`, ya que en la práctica formativa escolar el foco contable radica en el cálculo del Neto Gravado, el IVA (21%) y la determinación de la posición mensual del contribuyente.

---

### 2.4. Plantilla 4: Hoja de Trabajo (`HOJA_TRABAJO`)

Archivo de lógica: [`backend/src/utils/comparadores-plantillas/hoja-trabajo.comparador.ts`](../../backend/src/utils/comparadores-plantillas/hoja-trabajo.comparador.ts)

| Situación Detectada | Error Emitido (`TipoErrorCorreccion`) | Celda Observada | Detalle Reportado | Impacto en KPIs |
| :--- | :--- | :--- | :--- | :--- |
| **Cuenta omitida en el balance de 10 columnas** | `CUENTA_OMITIDA` | `fila` | ID y nombre de la cuenta faltante en la grilla. | `asientosIncompletos++` |
| **Cuenta adicional no contemplada** | `CUENTA_ADICIONAL` | `fila` | ID y nombre de la cuenta sobrante en la grilla. | `diferenciasDetectadas++` |
| **Diferencias numéricas por etapa** (Saldos sin ajustar, Ajustes, Saldos ajustados, Patrimonial o Resultados) | `IMPORTE_INCORRECTO` | `subcolumna` | Cuenta, columna específica observada, desglose esperado vs obtenido. | `diferenciasDetectadas++` |
| **Resultado del ejercicio sin completar** | `RESULTADO_EJERCICIO_INCOMPLETO` | `resultadoDelEjercicio` | Indicación de que el renglón final no fue resuelto. | `asientosIncompletos++` |
| **Resultado del ejercicio incorrecto** | `RESULTADO_EJERCICIO_INCORRECTO` | `resultadoDelEjercicio` | Valores y distribución esperada vs obtenida. | `diferenciasDetectadas++` |
| **Puntos de control correctos** (cuenta presente, etapa de columnas o resultado final idéntico) | *(Sin error)* | — | Coincidencia en cada fase evaluable sin penalizar la fila completa si otra etapa falla. | `aciertos++` |

---

## 3. Resumen de KPIs y Métricas del Workspace

Al evaluar todas las plantillas habilitadas en el ejercicio, el orquestador ([`backend/src/utils/comparadores-plantillas/index.ts`](../../backend/src/utils/comparadores-plantillas/index.ts)) calcula los KPIs bajo el principio de diseño visual y pedagógico: **"Lugar donde puede haber error, si no lo es, es acierto"**:

1. **`aciertos`**: Suma de todos los registros o campos evaluables resueltos correctamente y de forma idéntica a la solución modelo:
   * **En Libro Diario:** Cada línea de asiento evalúa cuenta, variación patrimonial e importe; cada acierto suma +1 individualmente.
   * **En Libro Mayor:** Cada cuenta T evalúa 5 puntos de control independientes (Cuenta seleccionada, Total Debe, Total Haber, Saldo final neto y Tipo de saldo); cada uno que no presente error suma +1 acierto (hasta 5 aciertos por cuenta T).
   * **En Libro IVA:** Cada comprobante evalúa N° de comprobante, Neto gravado, IVA y Total facturado (hasta 4 aciertos por factura), más +1 acierto por la determinación de la liquidación mensual.
   * **En Hoja de Trabajo:** Cada cuenta evalúa su inclusión en la grilla más las 5 etapas de columnas (hasta 6 aciertos por fila), más +1 acierto por el Resultado del Ejercicio.
2. **`diferenciasDetectadas`**: Conteo de discrepancias conceptuales o numéricas (cuentas incorrectas, Debe/Haber invertidos, variaciones de importes, comprobantes adicionales o tipos de saldo erróneos).
3. **`asientosIncompletos`**: Conteo de elementos estructuralmente faltantes o desbalanceados (asientos desbalanceados, cuentas/comprobantes omitidos, o resultado del ejercicio incompleto).
4. **`totalErrores`**: Suma acumulada de todos los errores identificados en la entrega (`diferenciasDetectadas + asientosIncompletos`).
5. **Consistencia con la UI:** La suma `aciertos + diferenciasDetectadas + asientosIncompletos` representa el **total de registros evaluados** que se muestra en la cabecera del prototipo (ej: *"8 Aciertos de 12 registros"*).

---

## 4. Gobernanza del Botón de Asistencia IA

Conforme a la regla pedagógica y de control de costos de `docs/correcciones/endpoints-correcciones.md`:

```typescript
const puedeSugerirIa = totalErrores >= 3;
```

- **Si `totalErrores >= 3`:**
  - `puedeSugerirIa`: `true`
  - `motivoDeshabilitadoIa`: `null`
- **Si `totalErrores === 0`:**
  - `puedeSugerirIa`: `false`
  - `motivoDeshabilitadoIa`: `"El ejercicio no presenta errores contables detectados."`
- **Si `totalErrores === 1` o `2`:**
  - `puedeSugerirIa`: `false`
  - `motivoDeshabilitadoIa`: `"Se requieren al menos 3 errores detectados para habilitar la sugerencia pedagógica con IA."`

