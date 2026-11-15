17. # **Simulación empresarial** {#simulación-empresarial}

- ## **Generación de la simulación** {#generación-de-la-simulación}

Las simulaciones empresariales serán generadas mediante inteligencia artificial a partir de parámetros definidos por el docente, información disponible de la empresa y los roles asignados a sus integrantes.

La simulación deberá representar una situación empresarial realista en la que los alumnos deban analizar información, tomar decisiones y, cuando corresponda,moverse a otros módulos para buscar datos o realizar acciones.

La IA generará previamente la estructura general de la simulación, incluyendo eventos, posibles decisiones, consecuencias, condiciones y criterios de evaluación. Durante la ejecución, el sistema recorrerá dicha estructura evitando realizar una nueva consulta a la IA ante cada decisión del alumno. O sea, básicamente la IA plantea toda la situación completa con sus opciones y caminos según qué opción se elija y después nosotros vamos filtrando eso, tipo no se va a generar a medida que eligen porque se rompe todo. 

Para evitar árboles de decisiones excesivamente grandes, las simulaciones utilizarán bifurcaciones controladas y reconvergencias. No toda decisión abrirá una rama completamente nueva: muchas simplemente modificarán variables, condiciones o criterios de evaluación que podrán influir más adelante.

Cada evento generado deberá indicar también un **emisor**, que será utilizado por el frontend para representar visualmente quién comunica la situación dentro del chat de la simulación.

Los emisores serán simples y predefinidos, por ejemplo: **ABA, CLIENTE, PROVEEDOR, PRODUCCIÓN, FINANZAS** u otro actor interno cuando corresponda. La IA seleccionará el emisor según el contexto del evento, sin generar personajes, nombres o información adicional innecesaria.

- ## **Participación de los roles** {#participación-de-los-roles}

Los roles participantes no serán seleccionados manualmente por el docente. El sistema obtendrá automáticamente los roles asignados a los integrantes de cada empresa y la simulación deberá garantizar una participación significativa de todos ellos.

Los roles contemplados son:

* CEO – Dirección general.  
* COO – Operaciones.  
* CFO – Finanzas.  
* CTO – Tecnología.  
* CCO – Comunicación.  
* CIO – Información.  
* CMO – Marketing.

La participación de un rol podrá consistir en tomar una decisión, analizar información, realizar una acción dentro del ERP, aprobar una propuesta o proporcionar información necesaria para continuar con el flujo.

La IA deberá evitar asignar intervenciones artificiales únicamente con el objetivo de incluir un rol. Cada participación deberá guardar relación con la situación empresarial planteada.

- ## **Visualización y respuesta de eventos** {#visualización-y-respuesta-de-eventos}

Todos los integrantes de una empresa podrán visualizar el desarrollo completo de la simulación independientemente de su rol.

Sin embargo, cada evento indicará qué rol o roles se encuentran habilitados para responderlo.

Los alumnos cuyo rol no corresponda al evento podrán visualizar la situación y las decisiones tomadas, pero no ejecutar la respuesta.

Un evento podrá estar dirigido a:

* Un único rol.  
* Varios roles posibles.  
* Todos los integrantes de la empresa.

Cuando un evento pueda ser respondido por más de un rol, la primera respuesta válida registrada resolverá el evento.

La IA deberá distribuir los eventos de forma que todos los roles existentes tengan participación significativa y, cuando sea posible, asignar algunos eventos a un único rol para evitar que una misma persona concentre todas las decisiones. 

Visualmente, los eventos se presentarán en formato de conversación. Cada mensaje utilizará el emisor definido por la IA para mostrar el avatar o identificación correspondiente.

**Aba funcionará como la voz del sistema**, pudiendo presentar situaciones, indicar qué roles se encuentran habilitados para responder o comunicar transiciones dentro de la simulación. Otros eventos podrán mostrarse como mensajes de un cliente, proveedor o área interna de la empresa según corresponda.

Se utilizará un único emisor principal por evento para evitar conversaciones innecesariamente extensas y mantener controlado el tamaño de la respuesta generada por IA.

- ## **Flujos empresariales disponibles** {#flujos-empresariales-disponibles}

El docente seleccionará un flujo empresarial general sobre el cual se generará la simulación. Los flujos definidos inicialmente son:

* Venta y gestión de pedidos.  
* Compras y abastecimiento.  
* Producción y operaciones.  
* Gestión financiera.  
* Contabilidad y cierre.  
* Marketing y comunicación.  
* Reclamos y postventa.  
* Crisis empresarial.  
* Crecimiento y expansión.

Cada flujo representa una categoría general y no una secuencia fija de actividades.

A partir del flujo seleccionado, la IA podrá generar diferentes situaciones compatibles. Por ejemplo, dentro de Producción y operaciones podrán aparecer cambios de cantidad solicitada, faltantes de materias primas, retrasos, problemas de calidad o limitaciones de capacidad.

Esto permitirá mantener objetivos pedagógicos similares evitando que las simulaciones sean repetitivas o predecibles.

Cada flujo tendrá roles naturalmente asociados que serán utilizados como orientación durante la generación.

Sin embargo, la IA deberá adaptar el escenario a la composición real de la empresa e incorporar de manera coherente todos los roles existentes.

Cuando un rol no tenga una participación evidente dentro del flujo principal, podrá incorporarse mediante un evento secundario relacionado con la situación, siempre que dicha intervención resulte empresarialmente razonable.

Por ejemplo, en una simulación de venta:

* CCO puede recibir y gestionar la comunicación con el cliente.  
* COO puede evaluar si se puede cumplir con el pedido.  
* CFO puede analizar costos o disponibilidad de dinero.  
* CEO puede intervenir ante una decisión importante o excepcional.  
* CMO puede detectar una oportunidad comercial o de difusión.  
* CIO puede aportar información o indicadores necesarios.  
* CTO puede intervenir si aparece una necesidad o problema tecnológico asociado.

La idea es que todos participen de una misma historia, no que cada rol reciba un ejercicio independiente.

- ## **Temas posibles según el flujo** {#temas-posibles-según-el-flujo}

Para evitar que la IA genere situaciones demasiados genéricas, cada flujo tendrá asociados distintos temas o situaciones que puede utilizar como base:

| Flujos | Temas que puede incluir | Roles que pueden intervenir |
| ----- | ----- | ----- |
| Venta y gestión de pedidos | pedidos nuevos \| pedidos urgentes \| aumento o reducción de cants \| negociación de precios \| descuentos \| condiciones especiales \| falta de stock \| cambios en la fecha de entrega \| pedidos de clientes importantes \| cancelaciones \| ventas con baja rentabilidad \| necesidad de confirmar capacidad antes de aceptar | CCO, COO, CFO, CEO y CMO.  |
| Compras y abastecimiento | necesidades de nuevos insumos \| selección entre proveedores \| diferencias de precio \| diferencias de plazo \| entregas parciales \| incumplimiento del proveedor \| aumento inesperado de costos \| compra urgente \| necesidad de negociar condiciones \| compra excesiva o insuficiente \| proveedores alternativos | COO, CFO, CEO, CIO y CCO |
| Producción y operaciones | planificación de producción \| falta de materia prima \| capacidad insuficiente \| aumento inesperado del pedido \| retrasos \| productos defectuosos \| necesidad de rehacer producción \| problemas de calidad \| necesidad de tercerizar \| prioridades entre distintos pedidos \| demoras logísticas \| utilización ineficiente de recursos. | COO, CFO, CEO, CTO y CIO  |
| Gestión financiera | falta de liquidez \| necesidad de financiamiento \| inversiones \| pagos importantes \| análisis de rentabilidad \| costos inesperados \| comparación entre alternativas de financiamiento \| priorización de gastos \| reducción de márgenes \| necesidad de mantener reservas \| evaluación de una compra importante | CFO, CEO, COO y CIO |
| Contabilidad y cierre  | diferencias entre registros \| facturas pendientes \| conciliaciones \| errores de registración \| documentación faltante \| gastos no registrados \| ingresos pendientes de imputar \| necesidad de revisar movimientos \| diferencias entre información contable y operativa \| cierre de período | CFO, CIO y CEO |
| Marketing y comunicación | lanzamiento de producto \| campaña promocional \| caída de ventas \| oportunidad de difusión \| comunicación con clientes \| cambios de imagen \| promociones \| publicidad \| comunicación frente a un problema \| estrategia frente a comentarios negativos \| necesidad de aumentar demandas\| | CMO, CCO, CFO y CEO |
| Reclamos y postventa | producto defectuoso \| entrega incorrecta \| demora \| devolución \| pedido incompleto \| solicitud de compensación \| cambio de producto \| nota de crédito \| cliente importante insatisfecho \| reclamo público | CCO, COO, CFO CEO y CMO |
| Crisis empresarial | proveedor que incumple \| caída de un sistema \| problema grave de producción \| faltante crítico de stock \| error en un pedido importante \| problema de calidad \| pérdida de información \| demora logística \| cliente clave que amenaza con cancelar \| gasto inesperado importante  | Este flujo puede involucrar prácticamente cualquier combinación de roles dependiendo del tipo de crisis. |
| Crecimiento y expansión | aumento fuerte de demanda \| lanzamiento de nuevos productos \| necesidad de aumentar capacidad \| contratación de nuevos recursos \| inversión \| ingreso a nuevos mercados \| apertura de nuevos canales \| incorporación de tecnología \| nuevos proveedores \| análisis de rentabilidad de una expansión | CEO, CFO, COO, CMO, CTO, CIO y CCO.  |

- ## **Qué información deberá recibir la IA sobre los roles** {#qué-información-deberá-recibir-la-ia-sobre-los-roles}

Además del flujo seleccionado, la IA deberá conocer qué responsabilidad tiene cada rol para no asignar tareas incoherentes. 

* CEO: Decisiones estratégicas, prioridades, aprobación de excepciones, riesgos importantes, crecimiento y conflictos entre áreas.  
* COO: Producción, stock, logística, proveedores, capacidad operativa, entregas y cumplimiento de plazos.  
* CFO: Caja, costos, presupuesto, pagos, rentabilidad, financiamiento e inversiones.  
* CTO: Tecnología utilizada por la empresa, automatización, infraestructura y resolución de problemas tecnológicos.  
* CCO: Comunicación interna y externa, relación comunicacional con clientes y proveedores, reclamos, mensajes institucionales y coordinación de respuestas. También puede participar en situaciones vinculadas con ventas o pedidos cuando exista comunicación directa con clientes.  
* CIO: Información utilizada para la toma de decisiones, reportes, indicadores, disponibilidad y consistencia de datos.  
* CMO: Marketing, campañas, promociones, posicionamiento, generación de demanda y lanzamiento de productos.

- ## **Parámetros que configura el docente** {#parámetros-que-configura-el-docente}

El docente deberá completar los siguientes parámetros necesarios para orientar la generación:

* **Flujo empresarial**, que sería el tema sobre el cual se va armar la simulación.   
* **Dificultad:**  
  * **Básica:** situaciones más directas, pocas variables y consecuencias fáciles de interpretar. Por ejemplo: un cliente aumenta un pedido y hay que revisar si existe stock suficiente antes de confirmarlo.   
  * **Intermedia:** combina varias áreas, incluye más de una opción razonable y consecuencias que pueden aparecer más adelante. Por ejemplo: aceptar un aumento de pedido permite mantener al cliente, pero obliga a elegir entre un proveedor más caro con entrega inmediata o uno más barato que puede generar una demora   
  * **Avanzada:** mayor incertidumbre, conflictos entre objetivos, información incompleta y decisiones con ventajas y desventajas importantes. Por ejemplo: un pedido estratégico puede generar una oportunidad comercial importante, pero requiere invertir más dinero, usar capacidad destinada a otro cliente y asumir riesgo de demora.   
* **Duración:**   
  * **Corta:**  4 a 6 eventos  
  * **Media:** 6 a 8 eventos   
  * **Larga:** 8 a 10 eventos  
  * **NOTA:** La cantidad definida por duración es orientativa. El mínimo de eventos deberá ajustarse cuando sea necesario para garantizar al menos una intervención significativa de cada rol activo en la empresa.  
* **Eventos sorpresa:** activados o desactivados  
* **Uso de datos de la empresa:** define si la IA debe adaptar la situación utilizando productos, stock, caja, pedidos u otra información real de la empresa simulada. 

### **Eventos sorpresa** {#eventos-sorpresa}

Si el docente activa esta opción, la simulación podrá incluir entre 1 y 2 eventos sorpresa. Estos eventos deben ser coherentes con el flujo y con la situación que se está desarrollando. Los eventos sorpresa posibles serán:

* **Cambio del cliente:** modifica cantidad, plazo, características del pedido o alguna condición previamente acordada.  
* **Problema con proveedor:** demora, entrega parcial, aumento de precio o falta de disponibilidad.  
* **Faltante o diferencia de stock:** el stock disponible no coincide con lo esperado o no alcanza para cumplir con la operación.  
* **Costo inesperado:** aparece un gasto adicional que modifica la rentabilidad o requiere revisar una decisión.  
* **Problema operativo o tecnológico:** falla de un proceso, sistema o recurso necesario para continuar.  
* **Problema de calidad:** se detecta un defecto, error o incumplimiento antes o después de una entrega.  
* **Reclamo o situación con el cliente:** demora, producto incorrecto, disconformidad o solicitud de compensación.  
* **Oportunidad inesperada:** aparece un nuevo pedido, posibilidad de promoción, proveedor conveniente o situación que puede beneficiar a la empresa si se aprovecha correctamente.

La IA deberá seleccionar únicamente eventos compatibles con el flujo y evitar repetir el mismo tipo de sorpresa dentro de una simulación.

Los eventos podrán modificar variables como stock, caja, costos, tiempo, riesgo o satisfacción del cliente y, en algunos casos, habilitar una bifurcación diferente del flujo.

### **Regla sobre las opciones** {#regla-sobre-las-opciones}

Las alternativas de decisión deben ser razonables incluso en dificultad básica. No se deberán generar opciones evidentemente absurdas o incorrectas solo para facilitar la elección. La dificultad se reflejará principalmente en la cantidad de información a analizar, las consecuencias y los trade-offs, no en hacer que una opción sea demasiado obvia.

- ## **Caminos y bifurcaciones** {#caminos-y-bifurcaciones}

No se generará un camino distinto para cada combinación posible de respuestas.

La mayoría de las decisiones:

* modificarán variables internas;  
* sumarán o restarán criterios de evaluación;  
* cambiarán condiciones para eventos posteriores;  
* o llevarán nuevamente a un evento común.

Se permitirá un máximo aproximado de 2 bifurcaciones reales abiertas al mismo tiempo.

La idea es que la simulación se sienta dinámica sin generar árboles imposibles de mantener ni consumir tokens innecesarios.

### **Regla de variación entre empresas** {#regla-de-variación-entre-empresas}

Para un mismo curso se generará una situación base común, manteniendo flujo, dificultad y objetivo. Para cada empresa se podrán variar datos, nombres, productos, cantidades y algunos eventos secundarios, de manera que los grupos no reciban exactamente el mismo caso pero sigan resolviendo un desafío comparable. 

- ## **Evaluación y puntaje** {#evaluación-y-puntaje}

El puntaje será único por empresa. Cuando la IA genere la simulación completa, también deberá clasificar cada una de las opciones que propone según qué tan conveniente considera que es dentro de esa situación:

* **Muy adecuada**  
* **Adecuada**  
* **Poco adecuada**  
* **Inadecuada**

La IA **no asignará directamente los puntos**. El sistema tendrá una tabla interna que traduzca esas clasificaciones a valores numéricos:

* Muy adecuada → 3 puntos.  
* Adecuada → 2 puntos.  
* Poco adecuada → 1 punto.  
* Inadecuada → 0 puntos.

De esta forma, la IA decide qué tan conveniente es cada alternativa según el contexto que ella misma generó, pero el sistema mantiene control sobre el cálculo del puntaje.

Las opciones deben ser razonables y no existir siempre una única respuesta evidentemente correcta. Puede haber más de una alternativa con la misma clasificación.

**Ejemplo:**

Situación: *El cliente solicita agregar 20 unidades a un pedido que ya está en producción sin modificar la fecha de entrega.*

La IA podría generar:

* A \- Aceptar el aumento y reorganizar la producción → **Adecuada**.  
* B \- Verificar primero stock, insumos y capacidad antes de confirmar → **Muy adecuada**.  
* C \- Mantener la entrega original y negociar una segunda entrega para las unidades adicionales → **Adecuada**.

ABACONTEX traduce internamente esas clasificaciones a:

* Adecuada → 2 puntos.  
* Muy adecuada → 3 puntos.  
* Adecuada → 2 puntos.

Si la empresa selecciona la segunda opción, el sistema suma **3 puntos** y continúa con el evento que la IA ya haya asociado previamente a esa alternativa.

Al finalizar la simulación se calcula:

**Puntaje final \= (Puntos obtenidos / Puntos máximos posibles) × 100**

Los alumnos no verán los puntos asociados a cada opción durante la simulación.

### **Feedback final** {#feedback-final}

Al finalizar la simulación, se realizará una nueva consulta a la IA enviando solamente la información relevante de la experiencia realizada, por ejemplo:

* situación inicial;  
* decisiones efectivamente tomadas por la empresa;  
* clasificación y puntos obtenidos en esas decisiones;  
* resultado final alcanzado.

Con esa información se le solicitará a la IA que genere un feedback breve indicando, por ejemplo:

* qué decisiones fueron buenas;  
* cuáles fueron más riesgosas;  
* qué aspectos podrían haber analizado mejor;  
* cómo influyeron sus decisiones en el resultado final.

De esta forma, la IA se utiliza una vez para generar la simulación y una vez al final para interpretar el recorrido realizado, evitando consultas adicionales después de cada decisión.

- ## **Uso de datos de la empresa** {#uso-de-datos-de-la-empresa}

Cuando el docente habilite esta opción, la IA podrá utilizar información actual de la empresa para generar una situación más realista, por ejemplo productos, stock, caja, pedidos, precios u otros datos disponibles. Estos datos se utilizarán únicamente como **punto de partida de la simulación**.

La simulación deberá mantener su propio estado interno, por lo que las decisiones tomadas por los alumnos **no modificarán los datos reales de la empresa**. Por ejemplo, si una empresa tiene 80 unidades de un producto y durante la simulación decide comprar 30 más, el stock simulado podrá pasar a 110 unidades, pero el stock real de la empresa seguirá siendo 80\.

De esta manera, la simulación puede utilizar información real y generar consecuencias coherentes sin afectar el funcionamiento normal de los demás módulos.

- ## **Generación mediante prompt** {#generación-mediante-prompt}

La simulación se generará completa en una única consulta inicial a la IA. La idea es que la IA no vaya inventando qué ocurre después de cada respuesta, sino que deje preparados desde el comienzo los eventos, opciones y caminos posibles.

Cuando el docente genere una simulación, el backend combinará:

* **Parámetros seleccionados por el docente:** flujo, dificultad, duración, eventos sorpresa y uso de datos de la empresa.  
* **Información del flujo seleccionado:** temas posibles sobre los que puede tratar la simulación y roles normalmente relacionados con ese flujo.  
* **Roles que realmente existen en la empresa:** junto con la responsabilidad general de cada uno.  
* **Datos actuales de la empresa**, si el docente habilitó su utilización.  
* **Reglas internas definidas por ABACONTEX.**

Por ejemplo, si el docente selecciona **Producción y operaciones**, se enviarán solamente los temas asociados a producción, por ejemplo: falta de materia prima, capacidad insuficiente, retrasos, etc. (lo que está en el cuadro arriba)

También se informará que los roles más relacionados con este flujo son COO, CFO, CEO, CTO y CIO. Sin embargo, la IA deberá revisar los roles que realmente existen en esa empresa e intentar dar participación significativa a todos. Si algún rol no encaja naturalmente en el problema principal, podrá incorporarlo mediante un evento secundario relacionado, sin forzar situaciones incoherentes.

### **Reglas internas de ABACONTEX** {#reglas-internas-de-abacontex}

Estas reglas no las decide el docente. Son condiciones fijas que el sistema agrega al prompt para mantener las simulaciones controladas:

* Generar toda la simulación en una única respuesta.  
* Respetar la cantidad aproximada de eventos según la duración seleccionada.  
* Si la cantidad de eventos no alcanza para incluir los roles existentes, podrá agregarse algún evento adicional.  
* Todos los roles existentes deben tener al menos una participación significativa, siempre que pueda hacerse de forma coherente.  
* Cada evento debe indicar qué rol o roles pueden responder.  
* Las opciones deben ser razonables y generar una duda real. Incluso en dificultad básica no deben existir respuestas evidentemente correctas frente a alternativas absurdas.  
* Puede haber más de una opción igualmente conveniente.  
* Cada opción deberá ser clasificada por la IA como **Muy adecuada, Adecuada, Poco adecuada o Inadecuada**. La IA no asignará puntos; ABACONTEX traducirá posteriormente esa clasificación mediante su tabla interna.  
* Cada opción deberá indicar qué evento previamente generado continúa después de seleccionarla.  
* No generar una rama completamente nueva para cada combinación de respuestas. Los caminos pueden separarse cuando tenga sentido y luego volver a encontrarse en eventos comunes.  
* Mantener como máximo aproximadamente dos bifurcaciones reales abiertas al mismo tiempo.  
* Si están habilitados, incorporar entre uno y dos eventos sorpresa coherentes con el escenario y sin repetir el mismo tipo.  
* Si una decisión modifica un dato concreto necesario para continuar la historia, como stock, caja, costos, cantidades comprometidas o tiempo disponible, ese cambio debe mantenerse únicamente dentro del estado de la simulación y ser tenido en cuenta en los eventos posteriores correspondientes.  
* No modificar nunca la información real de la empresa.  
* Utilizar los datos reales de la empresa únicamente cuando ayuden a construir una situación coherente.  
* Mantener una dificultad comparable entre las distintas empresas aunque cambien productos, cantidades, nombres u otros detalles.  
* Evitar generar explicaciones largas sobre cada opción. Durante la generación inicial solo se necesita la clasificación de la alternativa; el análisis de las decisiones tomadas se realizará en el feedback final.  
* Cada evento deberá indicar un **emisor principal**, seleccionado por la IA según el contenido de la situación. Se utilizarán emisores simples y predefinidos por ABACONTEX: **ABA** para mensajes del sistema, presentación de situaciones o transiciones; **CLIENTE** para solicitudes, cambios o reclamos; **PROVEEDOR** para información sobre entregas, disponibilidad, precios o incumplimientos; **PRODUCCION** para información operativa, capacidad, stock o fabricación; y **FINANZAS** para situaciones relacionadas con caja, costos, pagos o rentabilidad. Cuando corresponda podrá utilizarse otro actor interno coherente con el escenario. Se utilizará un único emisor por evento y su aparición no determinará si el evento es sorpresa, ya que eso se indicará de forma independiente.

### **Ejemplo simplificado de prompt** {#ejemplo-simplificado-de-prompt}

Supongamos que el docente selecciona:

* **Flujo:** Producción y operaciones.  
* **Dificultad:** Intermedia.  
* **Duración:** Media.  
* **Eventos sorpresa:** Sí.  
* **Uso de datos de la empresa:** Sí.

La empresa tiene los roles CEO, COO, CFO, CCO y CMO.

El backend podría construir una instrucción similar a:

> *Generá una simulación empresarial completa para una empresa educativa de ABACONTEX.*

> *Flujo seleccionado: Producción y operaciones.*

> *Temas posibles del flujo: planificación de producción, falta de materia prima, capacidad insuficiente, aumento inesperado de pedidos, retrasos, problemas de calidad, tercerización, prioridades entre pedidos, demoras logísticas y utilización de recursos.*

> *Roles existentes en la empresa: CEO, COO, CFO, CCO y CMO.*

> *Responsabilidades:*

> * *CEO: decisiones estratégicas, prioridades y excepciones.*  
> * *COO: producción, stock, logística y capacidad operativa.*  
> * *CFO: caja, costos, pagos y rentabilidad.*  
> * *CCO: comunicación con clientes y proveedores.*  
> * *CMO: marketing, promociones y oportunidades comerciales.*

> *Todos los roles existentes deben participar de manera significativa. No es necesario que todos intervengan en el problema principal: pueden incorporarse mediante eventos secundarios coherentes con la historia.*

> *Dificultad intermedia: combinar más de un área, presentar varias alternativas razonables y permitir que algunas consecuencias aparezcan posteriormente.*

> *Duración media: generar aproximadamente entre 6 y 8 eventos, pudiendo agregar alguno más si es necesario para incluir coherentemente a todos los roles.*

> *Las opciones deben ser razonables y no debe existir siempre una respuesta evidentemente correcta. Puede haber varias alternativas defendibles con distintas ventajas o consecuencias.*

> *Para cada opción, clasificá internamente su conveniencia como Muy adecuada, Adecuada, Poco adecuada o Inadecuada. No asignes puntos numéricos.*

> *Cada opción debe indicar cuál de los eventos que estás generando deberá mostrarse después si la empresa la selecciona.*

> *No generes un camino completamente diferente para cada combinación posible. Permití bifurcaciones cuando tengan sentido, pero hacé que distintos caminos puedan volver a encontrarse.*

> *Si una decisión modifica un dato concreto de la simulación, como stock, caja, costos, cantidad comprometida o tiempo, mantené ese cambio dentro de la simulación y consideralo en los eventos posteriores de ese camino.*

> *Los datos reales de la empresa se utilizan únicamente como punto de partida y nunca deben modificarse.*

> *Incorporá entre uno y dos eventos sorpresa coherentes con la situación.*

> *Generá toda la estructura de la simulación en esta única respuesta.*

Por ejemplo, la IA podría plantear inicialmente que un cliente solicita aumentar un pedido que ya se encuentra en producción.

La simulación podría dejar preparados desde el comienzo caminos como:

* si la empresa acepta inmediatamente el aumento, posteriormente puede aparecer un faltante de insumos;  
* si primero revisa capacidad y stock, puede descubrir que solo puede producir parte del aumento sin retrasarse;  
* si negocia una entrega parcial, puede aparecer posteriormente la respuesta del cliente.

Todos esos eventos ya deben estar generados en la respuesta inicial.

Durante la ejecución, si los alumnos seleccionan la segunda opción, el sistema simplemente registra la decisión, obtiene su clasificación para calcular el puntaje y muestra el evento que la IA ya había asociado a esa alternativa. No se realiza una nueva consulta a la IA en ese momento.

- ## **Estructura JSON de la simulación** {#estructura-json-de-la-simulación}

Una posible estructura posible sería:

{ "titulo": "Pedido extraordinario en plena producción",  
  "contextoInicial": "La empresa se encuentra produciendo un pedido de 100 unidades cuando el cliente solicita aumentar la cantidad manteniendo la fecha de entrega.",  
  "eventoInicialId": "E1",  
  "eventos": \[  
    {  
      "id": "E1",  
      "tipo": "decision",  
      "emisor": "CLIENTE",  
      "esSorpresa": false,  
      "mensaje": "El cliente solicita agregar 20 unidades al pedido sin modificar la fecha.",  
      "rolesHabilitados": \["COO", "CCO"\],  
      "opciones": \[  
        {  
          "id": "E1-O1",  
          "texto": "Aceptar el aumento y reorganizar la producción.",  
          "clasificacion": "ADECUADA",  
          "siguienteEventoId": "E2"  
        },  
        {  
          "id": "E1-O2",  
          "texto": "Revisar primero stock, insumos y capacidad antes de confirmar.",  
          "clasificacion": "MUY\_ADECUADA",  
          "siguienteEventoId": "E3"  
        },  
        {  
          "id": "E1-O3",  
          "texto": "Mantener las 100 unidades originales y negociar una segunda entrega.",  
          "clasificacion": "ADECUADA",  
          "siguienteEventoId": "E4"  
        }  
      \]  
    },  
    {  
      "id": "E2",  
      "tipo": "decision",  
      "emisor": "PRODUCCION",  
      "esSorpresa": false,  
      "mensaje": "Luego de aceptar el pedido, Producción detecta que no cuenta con suficientes insumos.",  
      "rolesHabilitados": \["COO", "CFO"\],  
      "opciones": \[\]  
    },  
    {  
      "id": "E3",  
      "tipo": "informativo",  
      "emisor": "ABA",  
      "esSorpresa": false,  
      "mensaje": "Luego de revisar la capacidad, se determina que pueden producir 15 unidades adicionales sin afectar la entrega.",  
      "siguienteEventoId": "E5"  
    }  
  \]  
}

La idea principal es que cada opción indique directamente a qué evento continúa. Por ejemplo:

No se consulta otra vez a la IA.

### **Tipos de evento** {#tipos-de-evento}

Inicialmente se pueden manejar pocos tipos:

* **decisión:** el alumno debe seleccionar una alternativa.  
* **informativo:** muestra una consecuencia o información y continúa el flujo.  
* **final:** indica que ese recorrido de la simulación terminó.

### **Clasificación de las opciones** {#clasificación-de-las-opciones}

La IA devolverá solamente: “clasificación”:”MUY\_ADECUADA” e internamente nosotros tenemos la equivalencia de los puntos de cada clasificación. 

### **Cambios dentro de la simulación** {#cambios-dentro-de-la-simulación}

Algunas decisiones pueden modificar datos concretos que sean necesarios para eventos posteriores. En esos casos, la opción podrá incluir, de forma opcional:

Esto se utilizará solamente cuando el cambio tenga sentido para continuar la simulación. Por ejemplo, 

- disminución de stock  
- utilización de caja  
- aumento de costos  
- modificación de una cant comprometida  
- cambio de tiempo o plazo disponible

### **Información que se registra mientras se ejecuta** {#información-que-se-registra-mientras-se-ejecuta}

La estructura anterior representa lo que generó la IA. Por separado, abacontex deberá ir registrando qué camino tomó realmente la empresa. Por ejemplo  \-----------------\>

Aunque el puntaje sea único por empresa, se guarda quién tomó cada decisión para conservar la trazabilidad y poder conocer la participación dentro de la simulación. 

### **Información a guardar en BD** {#información-a-guardar-en-bd}

No necesariamente se debe guardar el JSON entero en una única tabla. La estructura definitiva queda a criterio del diseño de BD, pero funcionalmente necesitamos conservar:

* simulación y configuración utilizada;  
* empresa que la está realizando;  
* estructura de eventos generada;  
* opciones de cada evento;  
* clasificación de cada opción;  
* relación entre opción y siguiente evento;  
* estado actual de la simulación;  
* cambios simulados, cuando existan;  
* decisiones tomadas;  
* alumno y rol que tomó cada decisión;  
* puntos obtenidos;  
* puntaje final de la empresa;  
* feedback final.

- ## **Ejemplo simplificado de recorrido** {#ejemplo-simplificado-de-recorrido}

Supongamos una simulación de **Producción y operaciones**.

**Situación inicial:** La empresa debe entregar 100 unidades a un cliente. Durante la producción, el cliente solicita agregar 20 unidades más sin modificar la fecha de entrega.

**Evento 1**

**Responden COO o CCO**

Opciones:

* Aceptar el aumento y reorganizar la producción → **Adecuada** → lleva al Evento 2\.  
* Revisar stock, insumos y capacidad antes de confirmar → **Muy adecuada** → lleva al Evento 3\.  
* Mantener las 100 unidades y negociar otra fecha para las 20 adicionales → **Adecuada** → lleva al Evento 4\.

*La empresa selecciona la segunda opción*.

ABACONTEX:

* registra la decisión;  
* traduce **Muy adecuada \= 3 puntos**;  
* muestra el Evento 3\.

### **Evento 3** {#evento-3}

Producción informa que pueden fabricar 15 unidades adicionales sin problemas, pero para completar las 5 restantes sería necesario comprar insumos con entrega urgente.

**Responden COO o CFO**

Opciones:

* Comprar al proveedor urgente, aunque sea más caro → **Adecuada** → Evento 5\.  
* Producir solamente las 15 unidades posibles y negociar las 5 restantes → **Muy adecuada** → Evento 5\.  
* Reorganizar otros pedidos para liberar recursos → **Poco adecuada** → Evento 5\.

En este caso, las tres opciones vuelven al mismo evento. La decisión modifica cómo llega la empresa a ese punto, pero no es necesario crear una rama completamente distinta.

### **Evento 5** {#evento-5}

El cliente confirma la recepción del pedido y la simulación finaliza.

ABACONTEX calcula el puntaje obtenido respecto del máximo posible y genera el resultado final.

Por ejemplo: **Puntos obtenidos: 6/6 → Puntaje final: 100/100**

Luego se realiza la segunda llamada a IA enviando únicamente:

* situación inicial;  
* decisiones efectivamente tomadas;  
* clasificación y puntos obtenidos;  
* consecuencias ocurridas;  
* resultado final.

Con esa información, la IA genera un feedback breve explicando qué decisiones fueron buenas, cuáles implicaron mayor riesgo y qué podría haberse analizado de otra manera.

![][image15]

## **Pantallas vista alumno** {#pantallas-vista-alumno}

1. ### **Pantalla principal \- dashboard mis simulaciones** {#pantalla-principal---dashboard-mis-simulaciones}

Desde acá, el alumno puede consultar las simulaciones asignadas a su empresa, conocer su avance y acceder a la acción que corresponda.

La pantalla incluye filtros para **buscar por título y por estado**, además de cinco cards de resumen.

| Estado | Cuándo corresponde | Botón |
| :---- | :---- | :---- |
| Pendiente | La simulación fue asignada, pero la empresa todavía no comenzó a participar. | Comenzar |
| En curso | La empresa comenzó y todavía tiene eventos por resolver. | Continuar simulación |
| Requiere tu decisión | Es una simulación que está en curso y existe una decisión pendiente que el rol del alumno está habilitado para responder.  | Responder decisión |
| Finalizada | La empresa completó todos los eventos y ya tiene disponible su resultado final. | Ver resumen |

***IMPORTANTE:*** ‘Requiere tu decisión’ no es un estado diferente de la simulación en la base de datos, sino una condición que se muestra cuando hay una decisión pendiente para el rol del alumno. La simulación en ese caso sigue estando en curso. 

En las cards también se muestra el avance mediante el formato **X de N eventos**, donde X representa el evento actual y N la cantidad total de eventos definida una vez generada la simulación.

En una simulación pendiente aparece *Evento inicial – 1 de N eventos*. Si está en curso, se muestra el evento actual y su progreso. Si está finalizada, se indica que se completaron todos los eventos.

Al seleccionar **Comenzar**, **Continuar simulación** o **Responder decisión**, se abre la misma pantalla de conversación, cambiando la información y las acciones disponibles según el avance de la empresa y el rol del alumno.

Al seleccionar **Ver resumen**, se abre la pantalla de resultados de la simulación finalizada.

Para esta pantalla se utilizará **paginación**, mostrando aproximadamente seis simulaciones por página, como en el módulo Mis ejercicios.

2. ### **Pantalla simulación empresarial en curso** {#pantalla-simulación-empresarial-en-curso}

Es la pantalla donde los alumnos participan en la simulación. Se presenta como una conversación para que las situaciones se desarrollen de forma más dinámica, sin que parezca un ejercicio tradicional.

La pantalla se divide en tres sectores:

- **Panel izquierdo:** muestra los integrantes de la empresa con sus respectivos roles y el progreso de la simulación, indicando el evento actual sobre el total y su porcentaje de avance.  
- **Conversación central:** muestra los acontecimientos en orden cronológico. Los mensajes pueden provenir de Aba, un cliente, proveedor u otro emisor definido para el evento. Aba funciona como la voz del sistema, presentando situaciones e indicando cuándo corresponde tomar una decisión.  
- **Sector de decisiones:** cuando el evento requiere una respuesta, se muestran las alternativas disponibles. El alumno deberá seleccionar una de ellas y presionar **Enviar respuesta** para confirmar su elección.

#### *Funcionamiento de las decisiones* {#funcionamiento-de-las-decisiones}

Todos los integrantes pueden ingresar y leer la conversación completa, pero solamente los roles habilitados para el evento pueden responder.

Por ejemplo, si una situación corresponde al COO, ese alumno verá que es su turno y tendrá habilitadas las alternativas. Los demás podrán consultar la situación, pero no enviarán una respuesta.

Cuando un evento permita responder a varios roles, la primera respuesta válida que se registre será la decisión de la empresa. Una vez confirmada, las opciones dejan de estar disponibles para el resto.

Al registrar una decisión, el sistema guarda quién respondió, qué alternativa eligió y cuándo lo hizo. Luego continúa con el siguiente acontecimiento o con el camino que corresponda según la estructura generada previamente.

Las decisiones se muestran como **opciones cerradas**, no como un chat libre donde los alumnos escriben cualquier respuesta a la IA.

La conversación se recorre mediante **scroll vertical**, manteniendo los mensajes anteriores para que los alumnos puedan revisar qué ocurrió. No se utilizará paginación dentro de la simulación.

El progreso se actualiza conforme la empresa avanza por los eventos. Cuando termina el último, la simulación pasa a **Finalizada** y se habilita la consulta del resultado.

Esta parte es sólo visual para simular como si fuera un chat, no van a poder escribir nada. A lo sumo para que sea más realista, se puede hacer que cuando seleccione una opción, aparezca ahí escrito y luego lo envía, pero más que nada es visual 🙂

3. ### **Pantalla ver resumen de simulación finalizada** {#pantalla-ver-resumen-de-simulación-finalizada}

Cuando una empresa completa todos los eventos y el alumno selecciona **Ver resumen**, se abre esta pantalla con el resultado obtenido.

Su objetivo es mostrar cómo le fue al equipo, sin obligarlo a revisar nuevamente toda la conversación.

La pantalla presenta:

* **Título de la simulación y estado Finalizada.**  
* **Puntuación final:** resultado de la empresa expresado sobre 100 puntos.  
* **Eventos completados:** cantidad de eventos que resolvió sobre el total.  
* **Fecha límite y fecha de finalización.**  
* **Tema o flujo empresarial:** categoría sobre la que se desarrolló la simulación.  
* **Roles que intervinieron:** roles que participaron en las decisiones registradas.  
* **Devolución de Aba:** feedback final generado con IA sobre el desempeño general del equipo.

La puntuación se obtiene de las decisiones tomadas durante la simulación, utilizando las clasificaciones y valores que ya definimos en el documento. No se calcula nuevamente desde esta pantalla.

La **devolución final** se genera una vez que termina la simulación, considerando las decisiones del equipo, sus resultados y el desempeño general. Debe ser breve, clara y orientada al aprendizaje, señalando qué hicieron bien y qué podrían mejorar.

Este resultado será **único por empresa**, no individual por alumno, ya que todos los integrantes participaron en una misma simulación.

Desde esta pantalla estarán disponibles dos botones:

* **Volver a mis simulaciones:** regresa al dashboard principal.  
* **Ver conversación:** abre el historial completo de la simulación en modo lectura.

El puntaje y la devolución se guardan cuando finaliza la simulación, por lo que no deben volver a generarse cada vez que un alumno entra a consultar el resumen.

4. ### **Pantalla ver conversación de una simulación finalizada** {#pantalla-ver-conversación-de-una-simulación-finalizada}

Esta pantalla reutiliza el mismo diseño de conversación utilizado durante la simulación, pero en **modo solo lectura**.

Su finalidad es permitir que los alumnos vuelvan a consultar las situaciones que atravesó su empresa, las alternativas seleccionadas y cómo se fue desarrollando la historia.

Se mantiene la estructura general:

* **Panel izquierdo:** integrantes de la empresa y progreso completado al 100%.  
* **Conversación central:** historial completo de mensajes y acontecimientos, respetando el orden en que ocurrieron.  
* **Decisiones registradas:** se muestra qué alternativa seleccionó la empresa y quién realizó la respuesta.

En esta vista **no se pueden modificar decisiones ni volver a responder eventos**. Tampoco se generan nuevos acontecimientos.

El historial debe conservar únicamente los eventos y caminos que realmente atravesó la empresa, no todas las alternativas o bifurcaciones posibles que la IA había generado.

La conversación se consulta mediante **scroll vertical**, sin paginación, para mantener la continuidad de los acontecimientos.

Desde esta pantalla el alumno podrá regresar al resumen final o al listado de simulaciones.

## **Pantallas vista docente** {#pantallas-vista-docente}

1. ### **Pantalla principal mis simulaciones** {#pantalla-principal-mis-simulaciones}

Es el dashboard principal del docente. Muestra todas las simulaciones que creó y permite consultar su estado general.

La pantalla incluye filtros para **buscar por título, curso y estado**, además de cuatro cards de resumen:

* **Total de simulaciones:** cantidad de simulaciones creadas por el docente.  
* **Pendientes:** simulaciones asignadas a un curso en las que ninguna empresa comenzó a participar.  
* **En curso:** simulaciones donde al menos una empresa comenzó, pero todavía hay empresas que no finalizaron.  
* **Finalizadas:** simulaciones donde todas las empresas participantes completaron su recorrido.

Debajo aparecen las simulaciones en cards, mostrando el título, curso asignado, estado, fecha límite y un resumen de avance.

En las cards se muestra también el avance de las empresas, por ejemplo **5 de 10 empresas han comenzado**, y el puntaje promedio cuando existan resultados disponibles. El promedio se obtiene únicamente de las empresas que ya finalizaron.

**Acciones disponibles:**

* **Nueva simulación:** abre la pantalla de creación.  
* **Ver entregas:** abre el listado de empresas participantes de esa simulación, independientemente de su estado.

Para este listado se utilizará **paginación**, mostrando aproximadamente seis simulaciones por página, como en el dashboard de ejercicios del docente.

2. ### **Pantalla crear simulación** {#pantalla-crear-simulación}

Desde **Nueva simulación**, el docente configura los parámetros que utilizará el sistema para generar la simulación mediante IA.

La pantalla debe solicitar:

* **Curso:** curso al que se asignará. Las empresas pertenecientes a ese curso serán las participantes.  
* **Fecha límite:** plazo máximo de realización.  
* **Flujo empresarial:** categoría principal sobre la que se desarrollará la situación. Las opciones son las nueve categorías definidas anteriormente, como Ventas y pedidos, Producción y operaciones, Gestión financiera, Crisis empresarial, etc.  
* **Dificultad:** Básica, Intermedia o Avanzada.  
* **Duración:** Corta (4 a 6 eventos), Media (6 a 8\) o Larga (8 a 10).  
* **Eventos sorpresa:** opción para permitir o no acontecimientos inesperados durante la simulación.  
* **Usar datos de la empresa:** indica si la simulación debe utilizar información de los módulos de Abacontex, como productos, stock, pedidos o caja, para adaptar las situaciones a cada empresa.  
* ***NOTA:***  El título de la simulación será generado automáticamente por la IA a partir del flujo empresarial y la situación planteada. El docente no deberá ingresarlo antes de crear la simulación, pero podrá modificarlo una vez generada si lo considera necesario. 

La cantidad de eventos se muestra como un **rango orientativo**, ya que el número definitivo se conocerá después de generar la simulación. El sistema deberá contemplar los roles existentes para garantizar su participación.

Los roles no serán seleccionados por el docente. Se recuperarán automáticamente de los integrantes de cada empresa, como ya definimos en el documento.

Al confirmar la creación, el sistema utiliza los parámetros seleccionados para generar la estructura de la simulación: situaciones, eventos, alternativas, caminos posibles y criterios de evaluación.

A partir de esa estructura se asignará a las empresas del curso, adaptando la información cuando corresponda.

A diferencia de los ejercicios, en estas simulaciones lo único que va a poder modificar el docente es el título, el contenido generado por la IA no podrá ser modificado.

El docente podrá volver al listado desde **Cancelar** o confirmar mediante **Crear simulación**. Una vez creada y asignada, aparecerá en el dashboard del docente y en el módulo de los alumnos correspondientes.

3. ### **Pantalla entregas de la simulación** {#pantalla-entregas-de-la-simulación}

Al seleccionar una simulación desde el dashboard, el docente accede a esta pantalla, donde puede ver el avance de todas las empresas del curso.

- Si la simulación está finalizada, se muestra un resumen de:  
  - Título de la simulación  
  - Curso  
  - Fecha límite  
  - Fecha de finalización: se toma la fecha de la última empresa que haya entregado.  
  - Tema de la simulación  
  - Cant de eventos totales que se completaron en la simulación

  Luego, se muestra el listado de todas las empresas con su logo, empresa, integrantes, fecha y hora de finalización, barra de progreso, roles involucrados y el puntaje final. Además, tiene habilitado el botón de ver simulación que lo lleva a la conversación completa de la empresa y su feedback. 

- En el caso que la simulación esté en curso, en el resumen se muestra:  
  - Título  
  - Curso  
  - Fecha límite  
  - Fecha de finalización vacía  
  - Tema de la simulación  
  - Cant de empresas que ya han empezado la simulación

  En este caso tenemos el filtro de buscar por nombre de empresa y por estado porque pueden haber empresas que ya hayan terminado y otras que todavía están en progreso. 

  Al igual que el anterior se muestra el listado de empresas con su logo, nombre, cantidad de integrantes, última actividad, progreso de eventos, roles involucrados y una etiqueta para diferenciar las que todavía estan haciendo la simulación, de las que ya finalizaron. 

El botón **Ver simulación** permite acceder al recorrido específico de la empresa seleccionada.

* Si está finalizada, abre la conversación completa en modo lectura.  
* Si está en curso, podría permitir consultar las decisiones y acontecimientos registrados hasta ese momento.  
* Si está pendiente, todavía no existe un recorrido que consultar.

Para este listado conviene utilizar **paginación**, ya que el docente puede tener varios cursos con numerosas empresas participantes.

4. ### **Ver simulación de una empresa** {#ver-simulación-de-una-empresa}

Cuando el docente selecciona **Ver simulación** sobre una empresa, accede a la conversación correspondiente a ese equipo.

La pantalla reutiliza el diseño que ya hicimos para el alumno, con tres sectores principales:

* **Panel izquierdo:** muestra los integrantes de la empresa, sus roles y el progreso alcanzado.  
* **Conversación central:** presenta los acontecimientos, mensajes y decisiones tomadas durante la simulación.  
* **Acceso al resultado:** cuando la empresa terminó, aparece el botón **Ver feedback**, que lleva a la pantalla de resultados.

A diferencia del alumno, el docente **no puede responder eventos ni modificar las decisiones tomadas**. Esta pantalla será únicamente de consulta.

Las respuestas deben identificar qué alumno realizó cada decisión, qué rol tenía y qué alternativa seleccionó. Esto permite conocer cómo participó cada integrante dentro de la simulación.

En las simulaciones finalizadas se muestra todo el recorrido de la empresa, incluyendo solamente los eventos y caminos que realmente atravesó.

La conversación utiliza **scroll vertical**, sin paginación, para poder revisar todo el historial de manera continua.

5. ### **Ver feedback y resultado final**  {#ver-feedback-y-resultado-final}

Desde **Ver feedback**, el docente accede al resultado final de la empresa seleccionada.

Esta pantalla es prácticamente la misma que diseñamos para el alumno, pero con acceso desde el seguimiento docente.

Muestra:

* nombre de la simulación y empresa participante;  
* estado Finalizada;  
* cantidad de eventos completados;  
* fecha límite y fecha de finalización;  
* flujo empresarial;  
* roles que intervinieron;  
* puntuación final sobre 100;  
* devolución final generada con IA.

El resultado corresponde al desempeño de **la empresa como equipo**, por lo que todos sus integrantes comparten el mismo puntaje.

La devolución explica brevemente las fortalezas del equipo y los aspectos que podrían mejorar a partir de las decisiones registradas.

El docente consulta el mismo feedback que recibe la empresa. No se genera una devolución diferente ni se vuelve a llamar a la IA cada vez que se abre esta pantalla.

Desde acá podrá volver a la conversación de la empresa o al listado de empresas participantes.
