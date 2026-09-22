14. # **Generación de ejercicios contables con IA** {#generación-de-ejercicios-contables-con-ia}

Para la generación de ejercicios contables se decidió utilizar un enfoque de **prompt dinámico basado en reglas estructuradas**, evitando depender exclusivamente de instrucciones libres ingresadas por el docente.

El objetivo es que los ejercicios generados mantengan una estructura similar a los utilizados actualmente en clase, respetando tanto los contenidos trabajados como la forma habitual de presentar los enunciados.

## **Parámetros de generación** {#parámetros-de-generación}

La configuración del ejercicio se realizará a partir de parámetros seleccionados por el docente, entre ellos:

* curso;  
* tipo de ejercicio;  
* dificultad;  
* contenidos adicionales disponibles para determinados tipos;  
* libros o actividades que deberá resolver el alumno;  
* contexto adicional opcional.

El **contexto libre** no será utilizado para definir las reglas contables principales del ejercicio, sino para incorporar preferencias particulares, como el rubro de la empresa, características del caso o restricciones específicas.

## **Tipos de ejercicio** {#tipos-de-ejercicio}

Se definieron inicialmente cuatro tipos de ejercicios basados en los formatos utilizados actualmente por los docentes:

1. **Compras y ventas básicas:** orientado a las primeras actividades de registración. Incluye operaciones identificadas mediante comprobantes originales y duplicados, pudiendo incorporar progresivamente IVA, intereses y descuentos.  
2. **Operaciones comerciales integradas:** secuencia cronológica más completa de operaciones de una empresa, combinando compras, ventas, cobros, pagos, bancos, cuentas corrientes, cheques, pagarés, IVA, intereses, descuentos y otras situaciones relacionadas.  
3. **Ajustes y Hoja de Trabajo:** ejercicios que parten de información contable previa y requieren registrar situaciones de ajuste, tales como arqueos de caja, amortizaciones, diferencias de inventario y tratamiento de deudores.  
4. **Costos y proceso productivo:** casos integrales relacionados con empresas productivas, contemplando materia prima, mano de obra, gastos indirectos de fabricación, prorrateos, cálculo del costo, producción y venta de productos terminados.

## **Dificultad** {#dificultad}

La dificultad no se utilizará únicamente para modificar la cantidad de operaciones, sino también su nivel de integración y dependencia.

Como referencia inicial:

* Básico: aproximadamente 4 operaciones o consignas.  
* Intermedio: aproximadamente 6 operaciones o consignas.  
* Avanzado: aproximadamente 10 operaciones o consignas.

A mayor dificultad podrán incorporarse operaciones relacionadas entre sí, cálculos auxiliares, cancelaciones parciales, distintas formas de pago y una mayor combinación de conceptos.

## **Diferencias según el curso** {#diferencias-según-el-curso}

El curso formará parte de los parámetros utilizados para construir el ejercicio.

Esto permitirá adaptar determinadas características del enunciado a la forma en que se trabajan los contenidos en cada año. Por ejemplo, actualmente en 5.º año se utilizan principalmente empresas constituidas como S.R.L., mientras que en 6.º año se utilizan S.A.

También podrán definirse diferencias en denominaciones de cuentas u otras reglas contables específicas, una vez validadas con los ejercicios y resoluciones docentes correspondientes.

No se restringirán de manera rígida determinados tipos de ejercicio a un único curso, ya que algunos contenidos, como la Hoja de Trabajo, pueden utilizarse en ambos años.

## **Libros y actividades a resolver** {#libros-y-actividades-a-resolver}

La selección de los libros será independiente del nivel de dificultad.

El docente podrá indicar qué debe confeccionar el alumno:

* Libro Diario;  
* Libro Mayor;  
* Libro IVA Compras;  
* Libro IVA Ventas;  
* Hoja de Trabajo.

El Libro Diario estará seleccionado por defecto, mientras que los demás podrán agregarse según el contenido que se encuentre trabajando.

## **Estructura interna de generación** {#estructura-interna-de-generación}

Cada tipo de ejercicio contará con una configuración interna que defina:

* estructura general del enunciado;  
* elementos obligatorios;  
* operaciones permitidas;  
* conceptos opcionales;  
* reglas según dificultad;  
* reglas según curso;  
* formato de presentación.

Estas configuraciones podrán almacenarse como estructuras JSON u objetos de configuración dentro del backend.

El JSON no será enviado necesariamente de manera completa al modelo de IA. Su función será permitir que el sistema determine previamente qué reglas aplicar y construya únicamente las instrucciones necesarias para cada generación.

De esta forma se busca reducir el consumo de tokens y evitar prompts extensos con información que no corresponde al ejercicio solicitado.

## **Generación mediante prompt dinámico** {#generación-mediante-prompt-dinámico}

A partir de la configuración seleccionada, el backend construirá un único prompt dinámico.

La estructura conceptual será:

`reglas generales + reglas del tipo de ejercicio + reglas del curso + dificultad + libros seleccionados + contexto opcional`

De esta manera no será necesario mantener un prompt completamente independiente para cada combinación posible.

La IA será utilizada principalmente para:

* redactar el enunciado;  
* generar nombres ficticios;  
* variar montos y fechas;  
* seleccionar combinaciones coherentes de operaciones;  
* variar formas de pago y cobro;  
* mantener consistencia entre operaciones relacionadas.

La lógica pedagógica principal permanecerá definida por el sistema.

## **Formato de los enunciados** {#formato-de-los-enunciados}

Uno de los requisitos principales es que los ejercicios generados respeten el formato utilizado actualmente por los docentes.

Por este motivo, cada tipo de ejercicio contará con reglas específicas de estructura y redacción.

Por ejemplo, en los ejercicios de operaciones comerciales se deberá:

* presentar inicialmente una empresa ficticia;  
* indicar el tipo societario y condición frente al IVA cuando corresponda;  
* organizar las operaciones cronológicamente;  
* numerar cada situación;  
* comenzar cada operación con una fecha;  
* identificar los comprobantes correspondientes;  
* utilizar formas de pago y cobro variadas;  
* permitir que determinadas operaciones hagan referencia a situaciones anteriores;  
* evitar redactar las operaciones como preguntas independientes o explicaciones extensas.

En los ejercicios de ajustes, la estructura deberá contemplar información contable inicial y posteriormente una sección de información complementaria o actividades de ajuste.

En los ejercicios de costos y producción, el enunciado deberá respetar una estructura más extensa, incluyendo la descripción de la empresa, datos de producción, materia prima, mano de obra, gastos indirectos, cálculo de costos y operaciones de venta.

El objetivo no es que la IA genere únicamente un ejercicio contablemente válido, sino que produzca un enunciado con una estructura y estilo similares a los utilizados actualmente en el aula.

## **Uso de ejemplos reales** {#uso-de-ejemplos-reales}

Los ejercicios reales utilizados por los docentes servirán como referencia para definir las reglas de cada tipo de ejercicio.

No se prevé enviar un ejercicio completo como ejemplo en cada llamada a la IA, ya que esto aumentaría el consumo de tokens y podría provocar que el modelo replique excesivamente la estructura o contenido del ejemplo.

En cambio, se analizarán los ejercicios existentes para extraer patrones reutilizables, tales como:

* orden de presentación;  
* cantidad y tipo de operaciones;  
* formato de fechas;  
* utilización de comprobantes;  
* formas de pago;  
* relaciones entre operaciones;  
* terminología utilizada;  
* estructura de las consignas.

Estas reglas serán incorporadas a la configuración interna del generador.

## **Optimización del consumo de tokens** {#optimización-del-consumo-de-tokens}

Con el objetivo de reducir el consumo de las APIs de Inteligencia Artificial, se priorizará:

* utilizar parámetros estructurados en lugar de instrucciones largas escritas por el docente;  
* enviar únicamente las reglas correspondientes al tipo de ejercicio seleccionado;  
* evitar incluir ejemplos completos en cada generación;  
* mantener el contexto adicional con una extensión limitada;  
* generar respuestas estructuradas y acotadas;  
* delegar al backend las decisiones que no requieren razonamiento del modelo.

De esta manera, la IA actúa principalmente como motor de generación y variación del contenido, mientras que las reglas pedagógicas y contables se mantienen controladas por Abacontex.

## **Manejo de la generación de ejercicios \- Resumen** {#manejo-de-la-generación-de-ejercicios---resumen}

Como dije, la idea general es que el sistema tenga definidas ciertas reglas propias y utilicemos la IA principalmente para generar contenido, interpretar resultados y redactar devoluciones.&nbsp;

1. ### **Datos seleccionados por el docente** {#datos-seleccionados-por-el-docente}

   Desde el front, el docente seleccionará la configuración del ejercicio que desea generar. Por ejemplo:&nbsp;

   Esto representa únicamente lo que el docente eligió en la pantalla. Así vamos a enviar al back, los datos seleccionados.&nbsp;

   &nbsp;

   &nbsp;

   &nbsp;

   &nbsp;

   &nbsp;

   &nbsp;

2. ### **Configuración interna del sistema** {#configuración-interna-del-sistema}

   Además de los datos que selecciona el docente, vamos a tener una configuración interna con las reglas de generación. Podemos tener una única configuración central que contenga las reglas de todos los tipos de ejercicios, cursos y dificultades.&nbsp;

   La intención de esta configuración es dejar definidas las reglas que no deberían quedar libradas al azar de la IA.

   Por ejemplo:

* en 5.º utilizar S.R.L.;  
* en 6.º utilizar S.A.;  
* un ejercicio intermedio debe tener aproximadamente 6 operaciones;  
* un ejercicio de ajustes debe incluir un balance inicial;  
* un ejercicio de compras y ventas debe presentar las operaciones de forma cronológica;  
* determinados tipos deben utilizar comprobantes originales y duplicados.

	Por ejemplo:

![][image7]![][image8]

3. ### **Cómo se genera el prompt** {#cómo-se-genera-el-prompt}

   Cuando el docente presiona generar ejercicio, el back combina: lo seleccionado por el docente \+ las reglas del curso \+ las reglas de dificultad \+ las reglas del tipo de ejercicio

   No es necesario enviar toda la configuración a la IA. El sistema toma únicamente las reglas necesarias. Por ejemplo, para: *5°to año, comprar y ventas básicas, intermedio, IVA: si, Intereses: Si, Descuentos: No*; se podría armar internamente un prompt similar a:

   Con este mecanismo se busca que la IA no tenga que decidir por sí sola cómo debe estructurarse el ejercicio.&nbsp;

   &nbsp;

## **Pantallas** {#pantallas}

### **Módulo ejercicios \- Docente** {#módulo-ejercicios---docente}

El módulo **Ejercicios** permite que el docente cree, gestione y resuelva ejercicios contables para sus alumnos. Este módulo se conecta con **Correcciones**, pero se mantiene separado porque tienen objetivos distintos.

* En **Ejercicios**, el docente crea y administra consignas.  
* En **Correcciones**, el docente revisa entregas, ve pendientes y analiza errores.

#### *Estados de los ejercicios* {#estados-de-los-ejercicios}

Los ejercicios pueden tener los siguientes estados:

| Estado | Significado | Acción principal |
| ----- | ----- | ----- |
| Borrador | El ejercicio fue creado pero todavía no se envió. | Continuar edición |
| Enviado | El ejercicio ya fue enviado a los alumnos | Ver detalle |
| Sin resolver | El ejercicio fue creado/enviado, pero el docente todavía no cargó su resolución modelo | Continuar resolución |
| Resuelto&nbsp; | El docente ya cargó la resolución modelo | Ver detalle |
| En corrección&nbsp; | Ya hay entregas para corregir o se inició el proceso de corrección | Ver detalle |

La acción principal de cada card cambia según el estado del ejercicio. No todos los ejercicios tienen que mostrar siempre “Ver detalle”, porque en algunos casos conviene llevar al docente directo a la acción pendiente.&nbsp;

1. **Pantalla ‘Mis ejercicios’**

La pantalla **Mis ejercicios** es la pantalla principal del módulo. Sirve como tablero para que el docente vea todos los ejercicios que creó.

Se muestran cards con información resumida:

* título del ejercicio;  
* curso asignado;  
* estado;  
* fecha límite;  
* cantidad de entregas;  
* acción principal según estado.

También se muestran filtros para buscar ejercicios por:

* título;  
* curso;  
* estado.

Además, se muestran tarjetas resumen con cantidades generales, por ejemplo:

* total de ejercicios;  
* enviados;  
* sin resolver;  
* en corrección.

En esta pantalla conviene usar paginación, porque el docente puede llegar a tener muchos ejercicios creados. Como las cards ocupan bastante espacio, no conviene hacer un scroll infinito muy largo.

La pantalla puede mostrar, por ejemplo, 6 ejercicios por página.

2. ### **Pantalla nuevo ejercicio**&nbsp; {#pantalla-nuevo-ejercicio}

Esta pantalla permite crear un ejercicio desde dos caminos posibles:

1. Digitalizar ejercicio  
2. Crear con IA

Ambos caminos llegan al mismo objetivo: generar una consigna, elegir las plantillas necesarias y decidir si se envía o se guarda como borrador.

#### *2.1 Nuevo ejercicio \- Digitalizar ejercicio* {#2.1-nuevo-ejercicio---digitalizar-ejercicio}

Este flujo se usa cuando el docente ya tiene un ejercicio armado en papel, foto o PDF.

El docente debe:

* subir una imagen o archivo del enunciado;  
* completar los datos generales del ejercicio;  
* seleccionar las plantillas que los alumnos deberán usar;  
* elegir si resuelve ahora o más tarde;  
* guardar como borrador o enviar a los alumnos.

Los datos principales son:

* título del ejercicio;  
* curso;  
* fecha límite;  
* indicaciones opcionales;  
* archivo o imagen del enunciado;  
* plantillas habilitadas.

Las plantillas las elige el docente porque eso define qué herramientas tendrán disponibles los alumnos para resolver. Por ejemplo:

* Libro Diario;  
* Libro Mayor;  
* Libro IVA;  
* Hoja de Trabajo;

La decisión tomada es que **el alumno no elige libremente las plantillas**, sino que se le habilitan las que el docente seleccionó al crear el ejercicio.

Cuando suba la foto, la idea es implementar un modelo OCR para que traduzca esa imagen o PDF a un texto. En el resumen del ejercicio, saldrá lo que se tradujo digamos y tiene la opción de editar, en caso que haya algo mal y el docente quiera cambiarlo antes de enviarlo a los alumnos.&nbsp;

En este punto, también puede decidir si resolverlo en el momento o luego.&nbsp;

#### *2.2 Nuevo ejercicio \- Crear con IA* {#2.2-nuevo-ejercicio---crear-con-ia}

Este flujo se usa cuando el docente quiere que la IA genere una consigna contable.&nbsp;

El docente completa parámetros como&nbsp;

* curso;  
* tipo de ejercicio: se define qué clase de ejercicio se quiere generar.&nbsp;  
* contenidos adicionales: son opciones seleccionables que van aparecer cuando se seleccione el tema “**Compras y ventas básicas”.** Pudiendo incluir operaciones de estos tipos en el enunciado progresivamente. Es opcional, se puede elegir de 0 a todas.&nbsp;  
* dificultad;  
* fecha límite;  
* contexto adicional opcional;  
* plantillas a habilitar

La IA genera una vista previa del ejercicio. El docente puede revisar el resultado antes de enviarlo o guardarlo.

Después de generar el ejercicio, el flujo sigue igual que en digitalización.

3. ### **Resolución del docente: resolver ahora o continuar con resolución** {#resolución-del-docente:-resolver-ahora-o-continuar-con-resolución}

La pantalla de **Resolución del docente** es la misma tanto para:

* Resolver ahora;  
* Continuar resolución;  
* Ver o completar una resolución ya empezada.

La diferencia está en los datos cargados:

* si entra por **Resolver ahora** cuando crea el ejercicio, las plantillas aparecen vacías;  
* si entra por **Continuar resolución**, se muestra lo que el docente ya había guardado;  
* si la resolución está completa, se puede visualizar o editar si corresponde.

Esta pantalla muestra:

* datos generales del ejercicio;  
* fecha límite;  
* botón para ver el enunciado completo (se abre en un modal);  
* plantillas seleccionadas;  
* progreso de resolución;  
* tabs con las plantillas habilitadas.

Las acciones principales son:

* Guardar borrador  
* Marcar como resuelto  
* Volver a Mis ejercicios / Detalle

La pantalla debería usar **scroll vertical**, porque algunas plantillas son largas. No conviene paginar dentro de la resolución, ya que el docente necesita recorrer el ejercicio completo y guardar avances.

#### *3.1. Plantilla libro diario* {#3.1.-plantilla-libro-diario}

La plantilla de **Libro Diario** permite que el docente cargue la resolución modelo de los asientos contables del ejercicio.

A diferencia del Libro Diario de la empresa, donde se carga un asiento puntual asociado a una operación, acá el docente puede necesitar cargar **varios asientos del mismo ejercicio**.

Por eso, la mejor forma es mostrar cada asiento como un bloque separado.

Cada bloque tiene:

* número de asiento;  
* fecha;  
* concepto;  
* líneas contables;  
* cuenta;  
* tipo de movimiento;  
* folio;  
* debe;  
* haber;  
* total del asiento;  
* estado balanceado o desbalanceado.

La cuenta se elige desde un combo cargado con el Plan de Cuentas. El tipo de movimiento se elige desde otro combo como el que ya usamos que tiene A+, A-, etc.

El docente puede:

* agregar líneas al asiento;  
* eliminar líneas;  
* agregar un nuevo asiento;  
* guardar borrador;  
* marcar la plantilla como terminada.

El sistema debe validar que cada asiento esté balanceado:

Total Debe \= Total Haber

Como puede haber varios asientos, esta pantalla debe manejarse con **scroll vertical**, no con paginación.

Al final de los asientos, se debe visualizar el total del debe y del haber completo, el cual se va actualizando a medida que se van registrando los asientos, esto debe hacer automáticamente para que el profe vea cuál es el resultado final del asiento.&nbsp;

#### *3.2. Plantilla hoja de trabajo* {#3.2.-plantilla-hoja-de-trabajo}

La plantilla de **Hoja de Trabajo** se usa para ordenar las cuentas y completar los saldos correspondientes.

La pantalla funciona como una planilla. Se muestran columnas para:

* cuentas: A CHEQUEAR SI SE COMPLETA DEL COMBO DE CUENTAS.  
* saldos sin ajustar;  
* ajustes;  
* saldos ajustados;  
* Estado Patrimonial;  
* Estado de Resultados.

Al final se agrega una sección llamada **Resultado del ejercicio**, con las últimas cuatro columnas:

Activo | P \+ PN | Negativo | Positivo

Estas celdas quedan vacías para que el docente/alumno complete el resultado final del ejercicio.

La hoja de trabajo puede ser bastante ancha, así que acá conviene permitir **scroll horizontal dentro de la tabla** y scroll vertical para recorrer las filas. No usar paginación, porque la lógica de la hoja se entiende mejor viéndola como una planilla completa.

#### *3.3. Plantilla Libro IVA* {#3.3.-plantilla-libro-iva}

La plantilla de **Libro IVA** permite cargar los comprobantes de compras y ventas.

Se divide en dos secciones:

* Libro IVA Compra  
* Libro IVA Venta

En cada una se cargan datos como:

* fecha;  
* número de comprobante;  
* proveedor o comprador;  
* importe neto gravado;  
* IVA facturado;  
* importe total facturado.

El sistema debe calcular automáticamente los totales y la diferencia entre:

**IVA Crédito Fiscal \- IVA Débito Fiscal**

También debe calcular automáticamente el saldo de IVA.

Pero el docente/alumno debe seleccionar el resultado correspondiente:

* A favor del contribuyente  
* IVA saldo a pagar

La idea es que el sistema ayude con el cálculo, pero que el alumno tenga que interpretar qué significa ese saldo.

Esta pantalla puede usar scroll vertical si hay muchos comprobantes. No hace falta paginación, porque cada libro debe verse como una planilla continua.

#### *3.4. Plantilla Libro Mayor* {#3.4.-plantilla-libro-mayor}

La plantilla de **Libro Mayor** permite mayorizar las cuentas utilizadas en el ejercicio.

Cada cuenta se muestra como una card independiente. Dentro de cada card se cargan los movimientos de esa cuenta:

* fecha;  
* detalle o concepto;  
* debe;  
* haber;  
* saldo.

El saldo se calcula automáticamente al terminar de cargar los movimientos de la cuenta.

Luego, el docente/alumno debe seleccionar si el saldo final es:

* Deudor  
* Acreedor

Esto es importante porque no alcanza con que el sistema calcule el número: el alumno también tiene que interpretar el tipo de saldo.

Al presionar **Agregar cuenta**, se agrega una nueva card vacía. Esa card debe mostrar un combo para seleccionar una cuenta desde el Plan de Cuentas.

Una vez seleccionada la cuenta, se habilita la carga de movimientos para mayorizarla.

Esta pantalla conviene manejarla con **scroll vertical**, porque se pueden agregar varias cuentas. No usar paginación dentro del ejercicio, ya que el docente necesita ver la resolución completa de forma continua.

4. ### **Pantalla ver detalle del ejercicio** {#pantalla-ver-detalle-del-ejercicio}

La pantalla **Ver detalle del ejercicio** será la vista central para consultar la información de un ejercicio ya creado. Debe ser una pantalla única para todos los estados, por lo que no se crearán pantallas distintas para ejercicios enviados, resueltos o en corrección.

Desde **Mis ejercicios**, cuando el docente seleccione un ejercicio, accederá al detalle del mismo. Esta pantalla permitirá ver la consigna, el resumen general del ejercicio, las plantillas habilitadas, el avance de entregas, el estado de la resolución docente y las acciones disponibles según corresponda.

La pantalla debe mostrar:

* título del ejercicio;  
* enunciado;  
* curso;  
* origen del ejercicio;  
* fecha de creación;  
* fecha límite;  
* estado;  
* plantillas habilitadas;  
* progreso de entregas;  
* cantidad corregida;  
* cantidad pendiente de corrección;  
* cantidad sin entregar;  
* total de alumnos;  
* estado de la resolución docente.

Desde esta pantalla se puede acceder a distintas acciones según corresponda:

* editar datos permitidos  
* continuar resolución  
* ver resolución  
* editar resolución  
* ir a correcciones

El detalle debe incluir una sección de **Resumen del ejercicio** para que el docente pueda entender rápidamente cómo fue configurada la actividad sin tener que volver a la pantalla de creación.

Esta sección cambia levemente según el origen del ejercicio.

#### *Caso 1: Ejercicio creado con IA*

Cuando el ejercicio fue generado con IA, el resumen debe mostrar los parámetros que el docente seleccionó al momento de generarlo.

Datos a mostrar:

* tipo de ejercicio;  
* dificultad;  
* contenidos adicionales seleccionados;  
* contexto adicional, si fue cargado;  
* curso;  
* fecha de creación;  
* fecha límite;  
* plantillas habilitadas;  
* estado.

El contexto adicional se muestra solo si el docente lo completó. Este campo sirve para indicar preferencias o aclaraciones, como el rubro de la empresa, una situación particular o alguna condición específica.

#### *Caso 2: Ejercicio digitalizado*

Cuando el ejercicio fue digitalizado, el resumen debe mostrar que el origen corresponde a una imagen o archivo cargado por el docente.

Datos a mostrar:

* texto digitalizado/revisado;  
* curso;  
* fecha de creación;  
* fecha límite;  
* plantillas habilitadas;  
* estado.

En este caso no corresponde mostrar dificultad ni contenidos adicionales de IA, porque el ejercicio no fue generado desde parámetros, sino a partir de un enunciado existente.

La pantalla debe permitir ver el enunciado que quedó cargado luego de la digitalización. Si el texto fue obtenido mediante OCR, el docente debe poder revisarlo antes de enviarlo y corregirlo si fuera necesario.

#### *Resolución docente*

El detalle debe incluir una sección de **Resolución docente**, ya que esta resolución funciona como solución modelo del ejercicio.

La resolución docente **no es visible para los alumnos**. Se utiliza internamente para que el sistema pueda comparar la entrega del alumno contra la resolución esperada y asistir al docente durante la corrección.

La sección puede tener distintos estados:

- **Si todavía no tiene resolución docente:** Mostrar:

  Resolución docente: Pendiente

  ***Este ejercicio aún no tiene resolución cargada***.

  Botón disponible: Resolver ahora

- **Si ya tiene resolución docente cargada** Mostrar:

  Resolución docente: Cargada

  Última actualización: fecha y hora

  Botones disponibles:

- Ver resolución  
- Editar resolución

La opción **Ver resolución** reutiliza la pantalla de resolución del ejercicio en modo consulta, mostrando las plantillas ya completadas.

La opción **Editar resolución** permite modificar la solución modelo. Esto puede hacerse aunque el ejercicio ya haya sido enviado, porque los alumnos no ven esa resolución. Al guardar cambios, la nueva resolución pasa a ser la referencia para próximas correcciones.

La resolución docente se maneja aparte de la edición del enunciado.

Aunque el ejercicio ya haya sido enviado, el docente puede editar su resolución modelo, porque los alumnos no ven esa resolución. Por eso, desde el detalle del ejercicio, cuando exista una resolución cargada, se podrá acceder a **Editar resolución**.

El docente podrá modificar la solución modelo en las plantillas habilitadas, por ejemplo:

* Libro Diario;  
* Libro Mayor;  
* Libro IVA Compra;  
* Libro IVA Venta;  
* Hoja de Trabajo.

Cuando se guarden cambios en la resolución docente, esa nueva versión será la referencia que utilizará el sistema para las próximas correcciones o comparaciones.

#### *Progreso de entregas*

La pantalla debe mostrar el avance de las entregas de los alumnos.

Datos a mostrar:

* cantidad total de alumnos;  
* cantidad de entregas corregidas;  
* cantidad de entregas pendientes de corrección;  
* cantidad de alumnos sin entregar;  
* porcentaje o barra de progreso de entregas.

Esta información permite que el docente vea rápidamente el estado general del ejercicio sin entrar todavía al módulo Correcciones.

#### *Acciones disponibles*

Desde la pantalla de detalle se muestran las acciones según el estado del ejercicio.

Acciones posibles:

* **Editar ejercicio:** permite modificar solo los datos permitidos según el estado.  
* **Continuar resolución / Cargar resolución:** aparece si la resolución docente todavía está pendiente.  
* **Ver resolución:** aparece si ya existe resolución docente cargada.  
* **Editar resolución:** aparece si ya existe resolución docente cargada y el docente necesita ajustarla.  
* **Ir a correcciones:** permite revisar las entregas de los alumnos.  
* **Duplicar ejercicio:** permite crear una copia del ejercicio, útil cuando se necesita cambiar el contenido principal sin modificar el original.

#### *Edición del ejercicio*

La edición del ejercicio depende de su estado:

- **Antes de enviar:** Si el ejercicio está en estado borrador, el docente puede editar toda la información del mismo, ya que todavía no fue enviado a los alumnos.&nbsp;  
- **Después de enviar:** Una vez enviado, no se debería permitir editar el contenido principal del ejercicio, porque los alumnos podrían haber empezado a resolverlo. Sólo se permitirán cambios menores como:  
  - fecha límite  
  - indicaciones o aclaraciones adicionales  
  - resolución docente

  No se debería editar:

- enunciado  
- plantillas habilitadas  
- tipo de ejercicio  
- curso, salvo que no haya entregas todavía.

Si el ejercicio fue generado con IA, tampoco se deberían modificar los parámetros principales usados para generarlo, como tipo de ejercicio, dificultad o contenidos adicionales. En caso de necesitar cambiar eso, corresponde crear un nuevo ejercicio o duplicar el existente.&nbsp;&nbsp;

15. # **Corrección automática de ejercicios** {#corrección-automática-de-ejercicios}

Para la corrección se propone aplicar el mismo criterio: no utilizar IA para todo aquello que el sistema pueda comparar directamente. El docente cargará previamente su resolución correcta y el alumno posteriormente realizará su propia resolución.&nbsp;

En lugar de enviar ambas resoluciones completas a la IA para que las compare, el sistema realizará primero una corrección automática.&nbsp;

1. **Comparación realizada por el sistema:** Por ejemplo, para el libro diario se pueden comparar datos como:  
   1. Cantidad de asientos  
   2. Cuentas utilizadas  
   3. Importes  
   4. Debe y Haber  
   5. Si el asiento se encuentra balanceado  
   6. Cuentas faltantes  
   7. Cuentas agregadas de más  
   8. Diferencias entre importes  
   9. Fechas  
   10. Totales

	![][image9]

	El sistema puede detectar directamente:

	El mismo criterio puede aplicarse posteriormente a cada uno de los libros disponibles a realizar. 

Cada uno deberá tener una estructura de datos que permita comparar la resolución docente contra la del alumno.&nbsp;

&nbsp;

&nbsp;

&nbsp;

2. **Uso de la IA para interpretar los errores:** Una vez que el sistema identificó las diferencias, la IA puede recibir solamente un resumen de errores. Por ejemplo:&nbsp;

   ![][image10]

   La IA podría devolver algo como:

   ![][image11]

   El docente podrá revisar rápidamente esta sugerencia, realizar una observación adicional y finalmente enviar la corrección al alumno. La IA no reemplaza la decisión docente, sino que funciona como una ayuda para reducir el tiempo de revisión.&nbsp;

## **Casos donde no sería necesario utilizar IA** {#casos-donde-no-sería-necesario-utilizar-ia}

Se propone evitar llamadas innecesarias. Por ejemplo:&nbsp;

* **Resolución completamente correcta:** El sistema detecta que la respuesta coincide con la resolución docente. Por ende, podemos mostrar simplemente un mensaje de que está todo bien el ejercicio, y no llamamos a la IA.&nbsp;

* **Error simple:** Por ejemplo, cuando tenemos un solo asiento desbalanceado con una deferencia entre el debe y el haber de $5000, podemos simplemente mostrar ese mensaje y no es necesario que la IA genere un feedback más elaborado.&nbsp;

En resumen, estaría bueno mandar la resolución a la IA para que genere un feedback cuando hay varios errores y que pueden estar relacionados o no, para que haga una interpretación más pedagógica y resumida.&nbsp;

## **Registro de errores frecuentes** {#registro-de-errores-frecuentes}

Cada error detectado deberá guardarse de forma estructurada. Por ejemplo:&nbsp;

Esto permite posteriormente contabilizar los errores sin tener que volver a analizar todas las resoluciones.&nbsp;

Por ejemplo, para un curso de 30 alumnos podemos tener:&nbsp;

*11 alumnos: confusión entre IVA Débito y Crédito Fiscal.*

*8 alumnos: selección incorrecta de cuentas.*

*6 alumnos: errores en cálculo de intereses.*

*4 alumnos: asientos desbalanceados.*

Estos datos pueden mostrarse directamente como métricas al docente. Luego, si se desea generar una interpretación pedagógica general, se puede realizar una única llamada a la IA con ese resumen:

![][image12]

### **Flujo general de corrección** {#flujo-general-de-corrección}

![][image13]
