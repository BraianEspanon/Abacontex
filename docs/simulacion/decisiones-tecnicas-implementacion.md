# Adenda: Decisiones Técnicas y Ajustes de Implementación
## Módulo de Simulación Empresarial — ABACONTEX

> **Propósito del documento:**  
> Este documento complementa al archivo funcional principal (`decisiones simulacion.md`).  
> Registra de manera formal todas las **decisiones arquitectónicas, técnicas y ajustes pedagógicos** que surgieron durante la implementación del backend para asegurar la viabilidad técnica con Modelos de Lenguaje (LLMs), optimizar el consumo de tokens y garantizar una integración 100% coherente con el ERP de los alumnos.

---

### Índice de Decisiones
1. [Motor de Placeholders Dinámicos e Instanciación en Memoria](#1-motor-de-placeholders-dinámicos-e-instanciación-en-memoria)
2. [Sincronización de Escala Operativa: Stock Real vs. Make to Order](#2-sincronización-de-escala-operativa-stock-real-vs-make-to-order)
3. [Arquitectura del Grafo: 2 Ciclos de Bifurcación Obligatorios](#3-arquitectura-del-grafo-2-ciclos-de-bifurcación-obligatorios)
4. [Regla de «Cero Empates» de Puntos en una Misma Decisión](#4-regla-de-cero-empates-de-puntos-en-una-misma-decisión)
5. [Inclusión de «Trampas Seductoras» (Opciones de 1 y 0 puntos)](#5-inclusión-de-trampas-seductoras-opciones-de-1-y-0-puntos)
6. [Redacción Ejecutiva Neutra y Regla de «Cero Spoilers»](#6-redacción-ejecutiva-neutra-y-regla-de-cero-spoilers)
7. [Minificación de Tokens en el Prompt y Normalización Bidireccional](#7-minificación-de-tokens-en-el-prompt-y-normalización-bidireccional)
8. [Algoritmo DFS de Cobertura Garantizada de Roles](#8-algoritmo-dfs-de-cobertura-garantizada-de-roles)
9. [Cálculo del Plazo Base de Fabricación (Fórmula Acotada con Setup)](#9-cálculo-del-plazo-base-de-fabricación-fórmula-acotada-con-setup)
10. [Valores de Contingencia cuando `usarDatosEmpresa = false`](#10-valores-de-contingencia-cuando-usardatosempresa--false)
11. [Selección Aleatoria de Producto Activo para la Instanciación](#11-selección-aleatoria-de-producto-activo-para-la-instanciación)

---

### 1. Motor de Placeholders Dinámicos e Instanciación en Memoria

* **Contexto del Documento Funcional:**  
  El documento especificaba que para un mismo curso debía generarse una situación base común, pero que cada empresa participante debía experimentar variaciones en cantidades, productos, nombres y dinero para evitar copias directas.
* **El desafío técnico:**  
  Si el backend llamara a la IA una vez por cada empresa del curso (ej: 10 empresas), el tiempo de espera se multiplicaría por 10 y el costo/cuota de tokens por minuto (TPM) colapsaría el servicio.
* **Decisión adoptada:**  
  Se diseñó un **sistema de placeholders con modificadores proporcionales**:
  * La IA genera **una única plantilla abstracta** para todo el curso usando:
    * `{{empresa}}`: Nombre de la empresa participante.
    * `{{producto}}`: Producto que fabrica la empresa.
    * `{{cantidad}}` y `{{cantidad:PROPORCION}}` (ej: `{{cantidad:1.5}}` para 150% de la demanda).
    * `{{monto}}` y `{{monto:PROPORCION}}` (ej: `{{monto:0.1}}` para costos o recargos).
    * `{{plazo}}` y `{{plazo:PROPORCION}}` (ej: `{{plazo:0.5}}` para plazos urgentes).
  * Luego, una función utilitaria en el backend (`instanciarEstructuraParaEmpresa`) toma la plantilla abstracta y la "instancia" en memoria para cada empresa en milisegundos, reemplazando las variables con los datos de su propio ERP.
* **Resultado:** 1 sola llamada a la IA por curso. Ahorro masivo de tokens, latencia reducida y experiencia personalizada por empresa.

---

### 2. Sincronización de Escala Operativa: Stock Real vs. Make to Order

* **Problema detectado durante las pruebas:**  
  Inicialmente existía un factor que alteraba el stock base según la dificultad (Básica: 0.5, Intermedia: 0.85, Avanzada: 1.2). Esto creaba un "doble factor" al combinarse con las proporciones que inventaba la IA (`{{cantidad:1.5}}`). Además, surgía el caso crítico de las **empresas que producen por encargo (Make to Order - MTO)**, cuyo stock físico en bodega es naturalmente **0**, o empresas que recién inician y aún no cargaron stock en el ERP.
* **Decisión adoptada:**  
  Se estandarizó la escala operativa de forma simple y predecible:
  1. **Empresas con stock físico en bodega (`stock > 0`):** La escala operativa es directamente su stock real:
     $$\text{cantidadBase} = \text{Stock físico real del ERP}$$
  2. **Empresas por encargo (MTO / stock 0) o sin datos cargados:** Se utiliza un lote operativo estándar de **50 unidades**:
     $$\text{cantidadBase} = 50$$
* **Impacto en el aula:**  
  Cubre el 100% de los modelos de negocio. Una fábrica masiva con stock en depósito usa su inventario físico, y un taller que produce a medida bajo encargo arranca con una escala de referencia sólida y consistente.

---

### 3. Arquitectura del Grafo: 2 Ciclos de Bifurcación Obligatorios

* **Problema detectado durante las pruebas:**  
  La IA tendía a bifurcar en la primera decisión (E1) hacia dos ramas (E2 y E3), pero tras reconverger en E4 encadenaba todas las decisiones posteriores de forma estrictamente lineal (`E4 -> E5 -> E6 -> E7 -> E8 -> E9`). Esto generaba un "efecto tren" donde las decisiones intermedias no cambiaban el rumbo de la historia.
* **Decisión adoptada:**  
  Se estableció como regla estricta en el generador la estructura de **Dos Ciclos de Bifurcación y Reconvergencia**:
  * **Ciclo 1 (Inicio):** E1 bifurca hacia E2 (rama operativa) y E3 (rama comercial/tecnológica). Ambas reconvergen en E4 (evento sorpresa transversal).
  * **Ciclo 2 (Intermedio):** E5 vuelve a bifurcar obligatoriamente hacia E6 (rama compras/proveedor) y E7 (rama comunicación/CCO). Ambas reconvergen en E8 (balance/eficiencia).
  * **Cierre:** E9 (decisión estratégica final) $\rightarrow$ E10 (Conclusión).
* **Resultado:** Los alumnos experimentan **4 caminos posibles e independientes**, manteniendo controlada la complejidad del grafo (máximo 2 ramas abiertas en paralelo, tal como exigía el documento funcional).

---

### 4. Regla de «Cero Empates» de Puntos en una Misma Decisión

* **Contraste con el documento funcional:**  
  El documento original (línea 200) mencionaba: *«Puede haber más de una alternativa con la misma clasificación (ej: A: Adecuada, B: Muy adecuada, C: Adecuada)»*.
* **Ajuste pedagógico aplicado:**  
  Al probar en vivo decisiones con dos opciones de 2 puntos (ADECUADA vs. ADECUADA), se comprobó que **se anulaba la diferenciación evaluativa**: el equipo sumaba 2 puntos cualquiera fuera su voto.
* **Regla adoptada:**  
  **Cada opción dentro de un mismo evento DEBE tener un valor de puntos diferente:**
  * En decisiones de 2 opciones: una debe ser superior a la otra (ej: **3 vs. 2**, **2 vs. 1**, o **3 vs. 1**).
  * En decisiones de 3 opciones: escala escalonada en 3 niveles (**3 pts, 2 pts y 1 pto**).
* **Resultado:** Cada voto del equipo altera de forma concreta y visible el puntaje final.

---

### 5. Inclusión de «Trampas Seductoras» (Opciones de 1 y 0 puntos)

* **Problema detectado durante las pruebas:**  
  Si la IA solo generaba opciones de 3 puntos (Muy adecuada) y 2 puntos (Adecuada), el puntaje más bajo posible que un equipo podía sacar (eligiendo siempre la peor opción) era:
  $$\frac{2}{3} \approx 66.7\%$$
  Ningún equipo podía reprobar la simulación, incluso votando al azar.
* **Decisión adoptada:**  
  Se instruyó a la IA a incluir de forma selectiva (en 2 o 3 momentos clave de crisis o tentación) **opciones de 1 punto (Poco adecuada) e incluso 0 puntos (Inadecuada)**:
  * Deben ser **trampas seductoras**: decisiones que a primera vista parecen atajos atractivos (ej: aceptar un pedido gigante sin capacidad en planta, recortar controles de calidad, tomar deuda usurera o cancelar unilateralmente contratos de proveedores).
* **Resultado:** Un equipo que actúe con descuido o precipitación terminará con calificaciones de **35% a 50% (Reprobado)**, devolviendo tensión y rigor evaluativo a la simulación.

---

### 6. Redacción Ejecutiva Neutra y Regla de «Cero Spoilers»

* **Problema detectado durante las pruebas:**  
  Para justificar por qué una opción valía 1 o 0 puntos, la IA añadía coletillas explicativas delatoras:
  * *«Aceptar el pedido completo comprometiendo la capacidad al máximo...»*
  * *«Rechazar la sobrecarga, asumiendo el riesgo de perder la cuenta.»*
  * *«Limitar la comunicación, asumiendo el riesgo de percepción negativa.»*
  Cualquier alumno descartaba estas opciones por sentido común sin necesidad de analizar la empresa.
* **Decisión adoptada:**  
  Se prohibieron taxativamente en el prompt frases delatoras (`asumiendo el riesgo de`, `comprometiendo`, `sacrificando`).
  * **Regla:** Las opciones describen **únicamente la acción ejecutiva concreta** a votar (qué se aprueba, plazos y dinero).
  * Los riesgos de cuello de botella, margen bajo o cancelación los **debe calcular y debatir el equipo** con los datos de su ERP.

---

### 7. Minificación de Tokens en el Prompt y Normalización Bidireccional

* **El desafío técnico:**  
  Los esquemas JSON extensos con nombres de atributos largos (`siguienteEventoId`, `rolesHabilitados`, `cambiosSimulados`, `esSorpresa: false`) hacían que las simulaciones largas (8 a 10 eventos) superaran el límite estricto de **1.000 tokens de salida por minuto** de modelos como Qwen 27B en Groq, provocando errores HTTP 429.
* **Decisión adoptada:**  
  Se implementó una **capa de compresión semántica**:
  1. En el prompt, la IA genera claves compactas:
     * `sig` en lugar de `siguienteEventoId`.
     * `roles` en lugar de `rolesHabilitados`.
     * `pts` (0, 1, 2, 3) en lugar de `"MUY_ADECUADA"`.
     * `impacto` en lugar de `cambiosSimulados`.
     * Omisión obligatoria de `esSorpresa: false` y de impactos vacíos `{}`.
  2. En el backend (`simulacion-ia.service.ts`), la función `normalizarEstructuraIa` expande automáticamente el JSON a la estructura canónica completa antes de guardarlo en la base de datos de PostgreSQL.
* **Resultado:** Reducción del tamaño del JSON en un **40%**, garantizando que simulaciones de 9 a 10 eventos se generen en menos de 850 tokens sin cortes.

---

### 8. Algoritmo DFS de Cobertura Garantizada de Roles

* **El desafío técnico:**  
  El documento exige que todos los integrantes con roles asignados tengan al menos una decisión en cualquier camino que recorra su empresa. Sin embargo, los LLMs no garantizan matemáticamente que una rama no elegida deje a un rol sin jugar.
* **Decisión adoptada:**  
  Se programó un algoritmo determinístico de teoría de grafos en `simulacion.util.ts`:
  * Función `garantizarCoberturaRolesEnTodosLosCaminos`.
  * Recorre todos los caminos desde el evento inicial hasta el final utilizando **búsqueda en profundidad (DFS)**.
  * Si detecta que en algún camino un rol disponible no interviene, inyecta automáticamente su rol en la decisión más afín de ese recorrido.

---

### 9. Cálculo del Plazo Base de Fabricación (Fórmula Acotada con Setup)

* **Problema detectado durante las pruebas:**  
  En un sistema educativo, los timestamps registrados en las órdenes de producción del ERP sufren ruidos y distorsiones extremas causados por el uso en clase:
  * Órdenes de prueba creadas y cerradas en 2 minutos durante la explicación del docente ($\approx 0$ días).
  * Órdenes olvidadas abiertas durante semanas o meses ($> 20$ días).
  Intentar inferir la velocidad de planta con promedios de fechas generaba plazos erráticos o inconsistentes.
* **Decisión adoptada:**  
  Se implementó una **fórmula matemática robusta y acotada** que vincula directamente la escala del lote (`cantidadBase`) con un tiempo de producción creíble en días:
  $$\text{plazoBase} = \text{clamp}\left(2 + \text{redondear}\left(\frac{\text{cantidadBase}}{15}\right), \ 3, \ 10\right)$$
  * **Estructura de la fórmula:**
    * **2 días fijos de alistamiento (setup):** Preparación de herramental, abastecimiento de materias primas y puesta a punto de líneas.
    * **1 día adicional cada 15 unidades producidas:** Representa la tasa de producción continua de la planta.
  * **Límites de protección:**
    * **Límite inferior (Piso = 3 días):** Evita plazos instantáneos o inverosímiles para lotes pequeños.
    * **Límite superior (Techo = 10 días):** Evita plazos desmedidos que superen el calendario o el horizonte temporal de la simulación.
  * **Comportamiento práctico en el aula:**
    * Lote de 15 unidades $\rightarrow$ 3 días (piso).
    * Lote de 50 unidades (estándar MTO / contingencia) $\rightarrow$ 5 días.
    * Lote de 60 unidades (ej: Aura Mobiliario) $\rightarrow$ 6 días.
    * Lote de 90 unidades $\rightarrow$ 8 días.
    * Lotes de 120 o más unidades $\rightarrow$ 10 días (techo).
* **Impacto:** Simplicidad absoluta, cero dependencia de timestamps ruidosos y total coherencia matemática para los alumnos al evaluar si un pedido urgente es viable o requiere turnos especiales.

---

### 10. Valores de Contingencia cuando `usarDatosEmpresa = false`

* **Definición técnica:**  
  Para los casos en que el docente desmarque la opción (por ejemplo, en la primera clase cuando los alumnos todavía no crearon productos en el ERP), se fijaron valores de contingencia homogéneos:
  * Producto: *"Artículos de producción"*.
  * Stock base: `50 unidades`.
  * Precio base: `$ 1.500`.
  * Plazo base: `5 días`.
  * Valuación base: `$ 75.000`.

---

### 11. Selección Aleatoria de Producto Activo para la Instanciación

* **Problema detectado durante la integración:**  
  Cuando una empresa del curso cuenta con múltiples productos en su catálogo del ERP (por ejemplo, una fábrica de muebles con *Silla ergonómica*, *Mesa ejecutiva* y *Escritorio nórdico*), tomar por defecto el primer elemento del arreglo (`productos[0]`) generaba monotonía y predecibilidad: simulaciones sucesivas o empresas con catálogos similares terminaban trabajando siempre sobre el mismo artículo. Por otro lado, tomar productos inactivos o archivados podía generar incongruencias con la operativa real de los alumnos.
* **Decisión adoptada:**  
  Se implementó un algoritmo de selección aleatoria acotado a productos vigentes en `instanciarEstructuraParaEmpresa`:
  1. Se filtran únicamente los productos que se encuentren activos en el ERP de la empresa (`p.activo !== false`).
  2. Si existen productos activos, se elige uno de forma aleatoria mediante selección uniforme:
     ```typescript
     const productosActivos = (empresa.productos ?? []).filter((p) => p.activo !== false);
     const prodReal =
       productosActivos.length > 0
         ? productosActivos[Math.floor(Math.random() * productosActivos.length)]
         : empresa.productos[0];
     ```
  3. A partir del producto seleccionado, se extraen su nombre (`prodReal.nombre`), stock físico real (`stockReal`) y precio unitario de lista (`precioBase`), los cuales alimentan los placeholders de la simulación.
  4. En caso de que la empresa no cuente con productos o `usarDatosEmpresa` sea `false`, se realiza el fallback seguro a los valores de contingencia definidos en el punto anterior (*"Artículos de producción"*, stock 50, precio $ 1.500).
* **Impacto:** Fomenta la rejugabilidad, aporta dinamismo entre diferentes empresas del mismo curso y garantiza que solo se utilicen productos que los alumnos reconocen como activos en su negocio.

---

*Documento generado en el marco de la implementación técnica del módulo de Simulación Empresarial de Abacontex.*
