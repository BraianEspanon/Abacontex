14. # **Generación de ejercicios contables con IA** {#generación-de-ejercicios-contables-con-ia}

Para la generación de ejercicios contables se decidió utilizar un enfoque de **prompt dinámico basado en reglas estructuradas**, evitando depender exclusivamente de instrucciones libres ingresadas por el docente.

El objetivo es que los ejercicios generados mantengan una estructura similar a los utilizados actualmente en clase, respetando tanto los contenidos trabajados como la forma habitual de presentar los enunciados.

## **Parámetros de generación** {#parámetros-de-generación}

La configuración del ejercicio se realizará a partir de parámetros seleccionados por el docente, entre ellos:

- curso;
- tipo de ejercicio;
- dificultad;
- contenidos adicionales disponibles para determinados tipos;
- libros o actividades que deberá resolver el alumno;
- contexto adicional opcional.

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

- Básico: aproximadamente 4 operaciones o consignas.
- Intermedio: aproximadamente 6 operaciones o consignas.
- Avanzado: aproximadamente 10 operaciones o consignas.

A mayor dificultad podrán incorporarse operaciones relacionadas entre sí, cálculos auxiliares, cancelaciones parciales, distintas formas de pago y una mayor combinación de conceptos.

## **Diferencias según el curso** {#diferencias-según-el-curso}

El curso formará parte de los parámetros utilizados para construir el ejercicio.

Esto permitirá adaptar determinadas características del enunciado a la forma en que se trabajan los contenidos en cada año. Por ejemplo, actualmente en 5.º año se utilizan principalmente empresas constituidas como S.R.L., mientras que en 6.º año se utilizan S.A.

También podrán definirse diferencias en denominaciones de cuentas u otras reglas contables específicas, una vez validadas con los ejercicios y resoluciones docentes correspondientes.

No se restringirán de manera rígida determinados tipos de ejercicio a un único curso, ya que algunos contenidos, como la Hoja de Trabajo, pueden utilizarse en ambos años.

## **Libros y actividades a resolver** {#libros-y-actividades-a-resolver}

La selección de los libros será independiente del nivel de dificultad.

El docente podrá indicar qué debe confeccionar el alumno:

- Libro Diario;
- Libro Mayor;
- Libro IVA Compras;
- Libro IVA Ventas;
- Hoja de Trabajo.

El Libro Diario estará seleccionado por defecto, mientras que los demás podrán agregarse según el contenido que se encuentre trabajando.

## **Estructura interna de generación** {#estructura-interna-de-generación}

Cada tipo de ejercicio contará con una configuración interna que defina:

- estructura general del enunciado;
- elementos obligatorios;
- operaciones permitidas;
- conceptos opcionales;
- reglas según dificultad;
- reglas según curso;
- formato de presentación.

Estas configuraciones podrán almacenarse como estructuras JSON u objetos de configuración dentro del backend.

El JSON no será enviado necesariamente de manera completa al modelo de IA. Su función será permitir que el sistema determine previamente qué reglas aplicar y construya únicamente las instrucciones necesarias para cada generación.

De esta forma se busca reducir el consumo de tokens y evitar prompts extensos con información que no corresponde al ejercicio solicitado.

## **Generación mediante prompt dinámico** {#generación-mediante-prompt-dinámico}

A partir de la configuración seleccionada, el backend construirá un único prompt dinámico.

La estructura conceptual será:

`reglas generales + reglas del tipo de ejercicio + reglas del curso + dificultad + libros seleccionados + contexto opcional`

De esta manera no será necesario mantener un prompt completamente independiente para cada combinación posible.

La IA será utilizada principalmente para:

- redactar el enunciado;
- generar nombres ficticios;
- variar montos y fechas;
- seleccionar combinaciones coherentes de operaciones;
- variar formas de pago y cobro;
- mantener consistencia entre operaciones relacionadas.

La lógica pedagógica principal permanecerá definida por el sistema.

## **Formato de los enunciados** {#formato-de-los-enunciados}

Uno de los requisitos principales es que los ejercicios generados respeten el formato utilizado actualmente por los docentes.

Por este motivo, cada tipo de ejercicio contará con reglas específicas de estructura y redacción.

Por ejemplo, en los ejercicios de operaciones comerciales se deberá:

- presentar inicialmente una empresa ficticia;
- indicar el tipo societario y condición frente al IVA cuando corresponda;
- organizar las operaciones cronológicamente;
- numerar cada situación;
- comenzar cada operación con una fecha;
- identificar los comprobantes correspondientes;
- utilizar formas de pago y cobro variadas;
- permitir que determinadas operaciones hagan referencia a situaciones anteriores;
- evitar redactar las operaciones como preguntas independientes o explicaciones extensas.

En los ejercicios de ajustes, la estructura deberá contemplar información contable inicial y posteriormente una sección de información complementaria o actividades de ajuste.

En los ejercicios de costos y producción, el enunciado deberá respetar una estructura más extensa, incluyendo la descripción de la empresa, datos de producción, materia prima, mano de obra, gastos indirectos, cálculo de costos y operaciones de venta.

El objetivo no es que la IA genere únicamente un ejercicio contablemente válido, sino que produzca un enunciado con una estructura y estilo similares a los utilizados actualmente en el aula.

## **Uso de ejemplos reales** {#uso-de-ejemplos-reales}

Los ejercicios reales utilizados por los docentes servirán como referencia para definir las reglas de cada tipo de ejercicio.

No se prevé enviar un ejercicio completo como ejemplo en cada llamada a la IA, ya que esto aumentaría el consumo de tokens y podría provocar que el modelo replique excesivamente la estructura o contenido del ejemplo.

En cambio, se analizarán los ejercicios existentes para extraer patrones reutilizables, tales como:

- orden de presentación;
- cantidad y tipo de operaciones;
- formato de fechas;
- utilización de comprobantes;
- formas de pago;
- relaciones entre operaciones;
- terminología utilizada;
- estructura de las consignas.

Estas reglas serán incorporadas a la configuración interna del generador.

## **Optimización del consumo de tokens** {#optimización-del-consumo-de-tokens}

Con el objetivo de reducir el consumo de las APIs de Inteligencia Artificial, se priorizará:

- utilizar parámetros estructurados en lugar de instrucciones largas escritas por el docente;
- enviar únicamente las reglas correspondientes al tipo de ejercicio seleccionado;
- evitar incluir ejemplos completos en cada generación;
- mantener el contexto adicional con una extensión limitada;
- generar respuestas estructuradas y acotadas;
- delegar al backend las decisiones que no requieren razonamiento del modelo.

De esta manera, la IA actúa principalmente como motor de generación y variación del contenido, mientras que las reglas pedagógicas y contables se mantienen controladas por Abacontex.

## **Manejo de la generación de ejercicios \- Resumen** {#manejo-de-la-generación-de-ejercicios---resumen}

Como dije, la idea general es que el sistema tenga definidas ciertas reglas propias y utilicemos la IA principalmente para generar contenido, interpretar resultados y redactar devoluciones.

1. ### **Datos seleccionados por el docente** {#datos-seleccionados-por-el-docente}

   Desde el front, el docente seleccionará la configuración del ejercicio que desea generar. Por ejemplo:

   Esto representa únicamente lo que el docente eligió en la pantalla. Así vamos a enviar al back, los datos seleccionados.

2. ### **Configuración interna del sistema** {#configuración-interna-del-sistema}

   Además de los datos que selecciona el docente, vamos a tener una configuración interna con las reglas de generación. Podemos tener una única configuración central que contenga las reglas de todos los tipos de ejercicios, cursos y dificultades.

   La intención de esta configuración es dejar definidas las reglas que no deberían quedar libradas al azar de la IA.

   Por ejemplo:

- en 5.º utilizar S.R.L.;
- en 6.º utilizar S.A.;
- un ejercicio intermedio debe tener aproximadamente 6 operaciones;
- un ejercicio de ajustes debe incluir un balance inicial;
- un ejercicio de compras y ventas debe presentar las operaciones de forma cronológica;
- determinados tipos deben utilizar comprobantes originales y duplicados.

  Por ejemplo:

![][image7]![][image8]

3. ### **Cómo se genera el prompt** {#cómo-se-genera-el-prompt}

   Cuando el docente presiona generar ejercicio, el back combina: lo seleccionado por el docente \+ las reglas del curso \+ las reglas de dificultad \+ las reglas del tipo de ejercicio

   No es necesario enviar toda la configuración a la IA. El sistema toma únicamente las reglas necesarias. Por ejemplo, para: _5°to año, comprar y ventas básicas, intermedio, IVA: si, Intereses: Si, Descuentos: No_; se podría armar internamente un prompt similar a:

   Con este mecanismo se busca que la IA no tenga que decidir por sí sola cómo debe estructurarse el ejercicio.

## **Pantallas** {#pantallas}

### **Módulo ejercicios \- Docente** {#módulo-ejercicios---docente}

El módulo **Ejercicios** permite que el docente cree, gestione y resuelva ejercicios contables para sus alumnos. Este módulo se conecta con **Correcciones**, pero se mantiene separado porque tienen objetivos distintos.

- En **Ejercicios**, el docente crea y administra consignas.
- En **Correcciones**, el docente revisa entregas, ve pendientes y analiza errores.

#### _Estados de los ejercicios_ {#estados-de-los-ejercicios}

Los ejercicios pueden tener los siguientes estados:

| Estado        | Significado                                                                            | Acción principal     |
| ------------- | -------------------------------------------------------------------------------------- | -------------------- |
| Borrador      | El ejercicio fue creado pero todavía no se envió.                                      | Continuar edición    |
| Enviado       | El ejercicio ya fue enviado a los alumnos y tiene su resolución                        | Ver detalle          |
| Sin resolver  | El ejercicio fue creado/enviado, pero el docente todavía no cargó su resolución modelo | Continuar resolución |
| Completado    | Todos los alumnos entregaron el ejercicio                                              | Ver detalle          |
| En corrección | Se inicia el proceso de corrección                                                     | Ver detalle          |

La acción principal de cada card cambia según el estado del ejercicio. No todos los ejercicios tienen que mostrar siempre “Ver detalle”, porque en algunos casos conviene llevar al docente directo a la acción pendiente.

![][image9]

1. **Pantalla ‘Mis ejercicios’**

La pantalla **Mis ejercicios** es la pantalla principal del módulo. Sirve como tablero para que el docente vea todos los ejercicios que creó.

Se muestran cards con información resumida:

- título del ejercicio;
- curso asignado;
- estado;
- fecha límite;
- cantidad de entregas;
- acción principal según estado.

También se muestran filtros para buscar ejercicios por:

- título;
- curso;
- estado.

Además, se muestran tarjetas resumen con cantidades generales, por ejemplo:

- total de ejercicios;
- enviados;
- sin resolver;
- en corrección.

En esta pantalla conviene usar paginación, porque el docente puede llegar a tener muchos ejercicios creados. Como las cards ocupan bastante espacio, no conviene hacer un scroll infinito muy largo.

La pantalla puede mostrar, por ejemplo, 6 ejercicios por página.

2. ### **Pantalla nuevo ejercicio** {#pantalla-nuevo-ejercicio}

Esta pantalla permite crear un ejercicio desde dos caminos posibles:

1. Digitalizar ejercicio
2. Crear con IA

Ambos caminos llegan al mismo objetivo: generar una consigna, elegir las plantillas necesarias y decidir si se envía o se guarda como borrador.

#### _2.1 Nuevo ejercicio \- Digitalizar ejercicio_ {#2.1-nuevo-ejercicio---digitalizar-ejercicio}

Este flujo se usa cuando el docente ya tiene un ejercicio armado en papel, foto o PDF.

El docente debe:

- subir una imagen o archivo del enunciado;
- completar los datos generales del ejercicio;
- seleccionar las plantillas que los alumnos deberán usar;
- elegir si resuelve ahora o más tarde;
- guardar como borrador o enviar a los alumnos.

Los datos principales son:

- título del ejercicio;
- curso;
- fecha límite;
- indicaciones opcionales;
- archivo o imagen del enunciado;
- plantillas habilitadas.

Las plantillas las elige el docente porque eso define qué herramientas tendrán disponibles los alumnos para resolver. Por ejemplo:

- Libro Diario;
- Libro Mayor;
- Libro IVA;
- Hoja de Trabajo;

La decisión tomada es que **el alumno no elige libremente las plantillas**, sino que se le habilitan las que el docente seleccionó al crear el ejercicio.

Cuando suba la foto, la idea es implementar un modelo OCR para que traduzca esa imagen o PDF a un texto. En el resumen del ejercicio, saldrá lo que se tradujo digamos y tiene la opción de editar, en caso que haya algo mal y el docente quiera cambiarlo antes de enviarlo a los alumnos.

En este punto, también puede decidir si resolverlo en el momento o luego.

#### _2.2 Nuevo ejercicio \- Crear con IA_ {#2.2-nuevo-ejercicio---crear-con-ia}

Este flujo se usa cuando el docente quiere que la IA genere una consigna contable.

El docente completa parámetros como

- curso;
- tipo de ejercicio: se define qué clase de ejercicio se quiere generar.
- contenidos adicionales: son opciones seleccionables que van aparecer cuando se seleccione el tema “**Compras y ventas básicas”.** Pudiendo incluir operaciones de estos tipos en el enunciado progresivamente. Es opcional, se puede elegir de 0 a todas.
- dificultad;
- fecha límite;
- contexto adicional opcional;
- plantillas a habilitar

La IA genera una vista previa del ejercicio. El docente puede revisar el resultado antes de enviarlo o guardarlo.

Después de generar el ejercicio, el flujo sigue igual que en digitalización.

3. ### **Resolución del docente: resolver ahora o continuar con resolución** {#resolución-del-docente:-resolver-ahora-o-continuar-con-resolución}

La pantalla de **Resolución del docente** es la misma tanto para:

- Resolver ahora;
- Continuar resolución;
- Ver o completar una resolución ya empezada.

La diferencia está en los datos cargados:

- si entra por **Resolver ahora** cuando crea el ejercicio, las plantillas aparecen vacías;
- si entra por **Continuar resolución**, se muestra lo que el docente ya había guardado;
- si la resolución está completa, se puede visualizar o editar si corresponde.

Esta pantalla muestra:

- datos generales del ejercicio;
- fecha límite;
- botón para ver el enunciado completo (se abre en un modal);
- plantillas seleccionadas;
- progreso de resolución;
- tabs con las plantillas habilitadas.

Las acciones principales son:

- Guardar borrador
- Marcar como resuelto
- Volver a Mis ejercicios / Detalle

La pantalla debería usar **scroll vertical**, porque algunas plantillas son largas. No conviene paginar dentro de la resolución, ya que el docente necesita recorrer el ejercicio completo y guardar avances.

#### _3.1. Plantilla libro diario_ {#3.1.-plantilla-libro-diario}

La plantilla de **Libro Diario** permite que el docente cargue la resolución modelo de los asientos contables del ejercicio.

A diferencia del Libro Diario de la empresa, donde se carga un asiento puntual asociado a una operación, acá el docente puede necesitar cargar **varios asientos del mismo ejercicio**.

Por eso, la mejor forma es mostrar cada asiento como un bloque separado.

Cada bloque tiene:

- número de asiento;
- fecha;
- concepto;
- líneas contables;
- cuenta;
- tipo de movimiento;
- folio;
- debe;
- haber;
- total del asiento;
- estado balanceado o desbalanceado.

La cuenta se elige desde un combo cargado con el Plan de Cuentas. El tipo de movimiento se elige desde otro combo como el que ya usamos que tiene A+, A-, etc.

El docente puede:

- agregar líneas al asiento;
- eliminar líneas;
- agregar un nuevo asiento;
- guardar borrador;
- marcar la plantilla como terminada.

El sistema debe validar que cada asiento esté balanceado:

Total Debe \= Total Haber

Como puede haber varios asientos, esta pantalla debe manejarse con **scroll vertical**, no con paginación.

Al final de los asientos, se debe visualizar el total del debe y del haber completo, el cual se va actualizando a medida que se van registrando los asientos, esto debe hacer automáticamente para que el profe vea cuál es el resultado final del asiento.

#### _3.2. Plantilla hoja de trabajo_ {#3.2.-plantilla-hoja-de-trabajo}

La plantilla de **Hoja de Trabajo** se usa para ordenar las cuentas y completar los saldos correspondientes.

La pantalla funciona como una planilla. Se muestran columnas para:

- cuentas: A CHEQUEAR SI SE COMPLETA DEL COMBO DE CUENTAS.
- saldos sin ajustar;
- ajustes;
- saldos ajustados;
- Estado Patrimonial;
- Estado de Resultados.

Al final se agrega una sección llamada **Resultado del ejercicio**, debajo de las últimas 4 columnas:

Activo | P \+ PN | Negativo | Positivo

Estas celdas quedan vacías para que el docente/alumno complete el resultado final del ejercicio.

Ejemplo:

Lo que hacen los chicos es, del estado patrimonial hacen la diferencia de las columnas de activo y de P+PN. O sea, en este caso 434.108 \- 127.757 \= 3036.351. Como en este caso el activo es mayo, se pone ese resultado abajo de esa columna; por ende, si el pasivo hubiera sido el mayor, se pone bajo esa otra columna la diferencia.  
Y se hace exactamente lo mismo para los estados de resultado, en este caso el monto de positivo es mayor, así que la diferencia se pone ahí.

La hoja de trabajo puede ser bastante ancha, así que acá conviene permitir **scroll horizontal dentro de la tabla** y scroll vertical para recorrer las filas. No usar paginación, porque la lógica de la hoja se entiende mejor viéndola como una planilla completa.

#### _3.3. Plantilla Libro IVA_ {#3.3.-plantilla-libro-iva}

La plantilla de **Libro IVA** permite cargar los comprobantes de compras y ventas.

Se divide en dos secciones:

- Libro IVA Compra
- Libro IVA Venta

En cada una se cargan datos como:

- fecha;
- número de comprobante;
- proveedor o comprador;
- importe neto gravado;
- IVA facturado;
- importe total facturado.

El sistema debe calcular automáticamente los totales y la diferencia entre:

**IVA Crédito Fiscal \- IVA Débito Fiscal**

También debe calcular automáticamente el saldo de IVA.

Pero el docente/alumno debe seleccionar el resultado correspondiente:

- A favor del contribuyente
- IVA saldo a pagar

La idea es que el sistema ayude con el cálculo, pero que el alumno tenga que interpretar qué significa ese saldo.

Esta pantalla puede usar scroll vertical si hay muchos comprobantes. No hace falta paginación, porque cada libro debe verse como una planilla continua.

#### _3.4. Plantilla Libro Mayor_ {#3.4.-plantilla-libro-mayor}

La plantilla de **Libro Mayor** permite mayorizar las cuentas utilizadas en el ejercicio.

Cada cuenta se muestra como una card independiente con lo que se conoce formato T del libro mayor. Dentro de cada card se cargan los movimientos de esa cuenta:

- fecha;
- contra cuenta;
- debe;
- haber;

El total del debe, haber y saldo se calculan automáticamente. El saldo es la diferencia entre ambos.

Luego, el docente/alumno debe seleccionar si el saldo final es:

- Deudor
- Acreedor

Esto es importante porque no alcanza con que el sistema calcule el número: el alumno también tiene que interpretar el tipo de saldo.

Al presionar **Agregar cuenta**, se agrega una nueva card vacía. Esa card debe mostrar un combo para seleccionar una cuenta desde el Plan de Cuentas.

Una vez seleccionada la cuenta, se habilita la carga de movimientos para mayorizarla.

Esta pantalla conviene manejarla con **scroll vertical**, porque se pueden agregar varias cuentas. No usar paginación dentro del ejercicio, ya que el docente necesita ver la resolución completa de forma continua.

4. ### **Pantalla ver detalle del ejercicio** {#pantalla-ver-detalle-del-ejercicio}

La pantalla Ver detalle del ejercicio será la vista central para consultar la información de un ejercicio ya creado. Debe ser una pantalla única para todos los estados, por lo que no se crearán pantallas distintas para ejercicios enviados, resueltos o en corrección.

Desde Mis ejercicios, cuando el docente seleccione un ejercicio, accederá al detalle del mismo. Esta pantalla permitirá ver la consigna, el resumen general del ejercicio, las plantillas habilitadas, el avance de entregas, el estado de la resolución docente y las acciones disponibles según corresponda.

La pantalla debe mostrar:

- título del ejercicio;
- enunciado;
- curso;
- fecha de creación;
- fecha límite;
- estado;
- plantillas habilitadas;
- progreso de entregas;
- cantidad corregida;
- cantidad pendiente de corrección;
- cantidad sin entregar;
- total de alumnos;
- estado de la resolución docente.

Desde esta pantalla se puede acceder a distintas acciones según corresponda:

- editar datos permitidos
- continuar resolución
- ver resolución
- editar resolución
- ir a correcciones

El detalle debe incluir una sección de **Información general** para que el docente pueda entender rápidamente cómo fue configurada la actividad sin tener que volver a la pantalla de creación.

Esta sección cambia levemente según el origen del ejercicio.

#### _Caso 1: Ejercicio creado con IA_ {#caso-1:-ejercicio-creado-con-ia}

Cuando el ejercicio fue generado con IA, el resumen debe mostrar los parámetros que el docente seleccionó al momento de generarlo.

Datos a mostrar:

- tipo de ejercicio;
- dificultad;
- contenidos adicionales seleccionados;
- contexto adicional, si fue cargado;
- curso;
- fecha de creación;
- fecha límite;
- plantillas habilitadas;
- estado.

El contexto adicional se muestra solo si el docente lo completó. Este campo sirve para indicar preferencias o aclaraciones, como el rubro de la empresa, una situación particular o alguna condición específica.

#### _Caso 2: Ejercicio digitalizado_ {#caso-2:-ejercicio-digitalizado}

Datos a mostrar:

- texto digitalizado/revisado;
- curso;
- fecha de creación;
- fecha límite;
- plantillas habilitadas;
- estado.

En este caso no corresponde mostrar dificultad ni contenidos adicionales de IA, porque el ejercicio no fue generado desde parámetros, sino a partir de un enunciado existente.

La pantalla debe permitir ver el enunciado que quedó cargado luego de la digitalización. Si el texto fue obtenido mediante OCR, el docente debe poder revisarlo antes de enviarlo y corregirlo si fuera necesario.

#### _Flujo de botones en ver detalle según estado del ejercicio_ {#flujo-de-botones-en-ver-detalle-según-estado-del-ejercicio}

- **Borrador:** el ejercicio todavía no fue enviado a los alumnos. Desde el detalle se puede **continuar la edición** o **enviarlo a los alumnos.** Si ponemos continuar la edición lleva a la pantalla de creación del ejercicio con los datos pre-cargados.
- **Enviado:** el ejercicio ya fue publicado para los alumnos. Desde el detalle se puede **ir a correcciones**, aunque todavía no hayan entregado todos.
- **Sin resolver:** el docente todavía no cargó o completó su resolución modelo. Desde el detalle se puede **continuar la resolución** y te lleva a la parte de plantillas.
- **Completado:** todos los alumnos ya entregaron, pero todavía no se corrigió. Desde el ver detalle se puede **ir a correcciones**.
- **En corrección:** ya comenzó el proceso de corrección de las entregas. Desde el ver detalle se puede **ir a correcciones**.

La acción principal que se muestra en la pantalla cambia según el estado, para evitar opciones que no correspondan en cada momento del flujo.

#### _Resolución docente_ {#resolución-docente}

El detalle debe incluir una sección de **Resolución docente**, ya que esta resolución funciona como solución modelo del ejercicio.

La resolución docente **no es visible para los alumnos**. Se utiliza internamente para que el sistema pueda comparar la entrega del alumno contra la resolución esperada y asistir al docente durante la corrección.

La sección puede tener distintos estados:

- **Si todavía no tiene resolución docente:** Mostrar:

  Resolución docente: Pendiente

  **_Este ejercicio aún no tiene resolución cargada_**.

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

- Libro Diario;
- Libro Mayor;
- Libro IVA Compra;
- Libro IVA Venta;
- Hoja de Trabajo.

Cuando se guarden cambios en la resolución docente, esa nueva versión será la referencia que utilizará el sistema para las próximas correcciones o comparaciones.

#### _Progreso de entregas_ {#progreso-de-entregas}

La pantalla debe mostrar el avance de las entregas de los alumnos.

Datos a mostrar:

- cantidad total de alumnos;
- cantidad de entregas corregidas;
- cantidad de entregas pendientes de corrección;
- cantidad de alumnos sin entregar;
- porcentaje o barra de progreso de entregas.

Esta información permite que el docente vea rápidamente el estado general del ejercicio sin entrar todavía al módulo Correcciones.

#### _Acciones disponibles_ {#acciones-disponibles-1}

Desde la pantalla de detalle se muestran las acciones según el estado del ejercicio.

Acciones posibles:

- **Editar ejercicio:** permite modificar solo los datos permitidos según el estado.
- **Continuar resolución / Cargar resolución:** aparece si la resolución docente todavía está pendiente.
- **Ver resolución:** aparece si ya existe resolución docente cargada.
- **Editar resolución:** aparece si ya existe resolución docente cargada y el docente necesita ajustarla.
- **Ir a correcciones:** permite revisar las entregas de los alumnos.

#### _Edición del ejercicio_ {#edición-del-ejercicio}

La edición del ejercicio depende de su estado:

- **Antes de enviar:** Si el ejercicio está en estado borrador, el docente puede editar toda la información del mismo, ya que todavía no fue enviado a los alumnos.
- **Después de enviar:** Una vez enviado, no se debería permitir editar el contenido principal del ejercicio, porque los alumnos podrían haber empezado a resolverlo. Sólo se permitirán cambios menores como:
  - fecha límite
  - resolución docente

  No se debería editar:

- enunciado
- plantillas habilitadas
- tipo de ejercicio
- curso, salvo que no haya entregas todavía.

Si el ejercicio fue generado con IA, tampoco se deberían modificar los parámetros principales usados para generarlo, como tipo de ejercicio, dificultad o contenidos adicionales. En caso de necesitar cambiar eso, corresponde crear un nuevo ejercicio directamente.

15. # **Corrección automática de ejercicios** {#corrección-automática-de-ejercicios}

Para la corrección se propone aplicar el mismo criterio: no utilizar IA para todo aquello que el sistema pueda comparar directamente. El docente cargará previamente su resolución correcta y el alumno posteriormente realizará su propia resolución.

En lugar de enviar ambas resoluciones completas a la IA para que las compare, el sistema realizará primero una corrección automática.

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

   ![][image10]

   El sistema puede detectar directamente:

   El mismo criterio puede aplicarse posteriormente a cada uno de los libros disponibles a realizar.

Cada uno deberá tener una estructura de datos que permita comparar la resolución docente contra la del alumno.

2. **Uso de la IA para interpretar los errores:** Una vez que el sistema identificó las diferencias, la IA puede recibir solamente un resumen de errores. Por ejemplo:

   ![][image11]

   La IA podría devolver algo como:

   ![][image12]

   El docente podrá revisar rápidamente esta sugerencia, realizar una observación adicional y finalmente enviar la corrección al alumno. La IA no reemplaza la decisión docente, sino que funciona como una ayuda para reducir el tiempo de revisión.

## **Casos donde no sería necesario utilizar IA** {#casos-donde-no-sería-necesario-utilizar-ia}

Se propone evitar llamadas innecesarias. Por ejemplo:

- **Resolución completamente correcta:** El sistema detecta que la respuesta coincide con la resolución docente. Por ende, podemos mostrar simplemente un mensaje de que está todo bien el ejercicio, y no llamamos a la IA.

- **Error simple:** Por ejemplo, cuando tenemos un solo asiento desbalanceado con una deferencia entre el debe y el haber de \$5000, podemos simplemente mostrar ese mensaje y no es necesario que la IA genere un feedback más elaborado.

En resumen, estaría bueno mandar la resolución a la IA para que genere un feedback cuando hay varios errores y que pueden estar relacionados o no, para que haga una interpretación más pedagógica y resumida.

## **Registro de errores frecuentes** {#registro-de-errores-frecuentes}

Cada error detectado deberá guardarse de forma estructurada. Por ejemplo:

Esto permite posteriormente contabilizar los errores sin tener que volver a analizar todas las resoluciones.

Por ejemplo, para un curso de 30 alumnos podemos tener:

_11 alumnos: confusión entre IVA Débito y Crédito Fiscal._  
_8 alumnos: selección incorrecta de cuentas._  
_6 alumnos: errores en cálculo de intereses._  
_4 alumnos: asientos desbalanceados._

Estos datos pueden mostrarse directamente como métricas al docente. Luego, si se desea generar una interpretación pedagógica general, se puede realizar una única llamada a la IA con ese resumen:

![][image13]

### **Flujo general de corrección** {#flujo-general-de-corrección}

![][image14]

## **Módulo correcciones \- docente** {#módulo-correcciones---docente}

Permite que el docente revise las entregas de los alumnos, corrija los ejercicios resueltos y consulte patrones de errores frecuentes para reforzar contenidos en clase. Se divide en dos submenúes:

- Ejercicios a corregir: Sirve para ver qué ejercicios tienen entregas, cuáles faltan corregir y continuar con la corrección.
- Análisis de errores: Sirve para ver qué errores se repiten en las entregas y qué conceptos conviene reforzar.

### **Submenú \- Ejercicios a corregir** {#submenú---ejercicios-a-corregir}

Esta pantalla será la vista principal del módulo Correcciones. La pantalla muestra:

- cards resumen por estado;
- filtros por estado, curso y búsqueda;
- listado de ejercicios en cards horizontales;
- acción principal según el estado del ejercicio;
- acción secundaria para ver el detalle del ejercicio.

En este módulo, el estado del ejercicio no representa si el ejercicio fue creado, enviado o resuelto por el docente. Acá representa el avance de corrección de las entregas recibidas. Los estados son:

| Estado        | Cuándo aplica                                                                                    |
| :------------ | :----------------------------------------------------------------------------------------------- |
| Sin entregas  | El ejercicio fue enviado, pero ningún alumno entregó todavía.                                    |
| Pendiente     | Hay entregas de alumnos, pero el docente todavía no corrigió ninguna.                            |
| En corrección | El docente ya corrigió al menos una entrega pero todavía quedan entregas recibidas sin corregir. |
| Corregido     | Todas las entregas recibidas ya fueron corregidas.                                               |

Aclaración importante: **Corregido no significa necesariamente que todos los alumnos entregaron**. Significa que todas las entregas recibidas hasta ese momento ya fueron corregidas.

Cada ejercicio se muestra como una card horizontal, porque en Correcciones se necesita mostrar más información que en “Mis ejercicios”.

La card debe mostrar:

- nombre del ejercicio;
- curso;
- fecha límite;
- estado de corrección;
- cantidad de entregas recibidas sobre total de alumnos;
- cantidad corregida;
- cantidad pendiente de corrección;
- cantidad sin entregar;
- botón secundario para ver detalle;
- botón principal según estado.

Cada card debe tener como máximo dos botones visibles:

- **Ver detalle:** Este botón lleva a la pantalla detalle del ejercicio dentro del módulo ejercicios.
- **Acción principal según estado:** El nombre del botón depende del estado del ejercicio pero siempre lleva a la misma pantalla.

| Estado del ejercicio | Botón principal      | A dónde lleva          |
| :------------------- | :------------------- | :--------------------- |
| **Sin entregas**     | Ver detalle          | Detalle del ejercicio  |
| **Pendiente**        | Corregir entregas    | Entregas del ejercicio |
| **En corrección**    | Continuar corrección | Entregas del ejercicio |
| **Corregido**        | Ver correcciones     | Entregas del ejercicio |

#### _Pantalla entregas del ejercicio_ {#pantalla-entregas-del-ejercicio}

Esta pantalla muestra todas las entregas de un ejercicio puntual. La pantalla debe mostrar:

- resumen del ejercicio;
- curso;
- fecha límite;
- cantidad total de alumnos;
- cantidad de entregas recibidas;
- cantidad corregida;
- cantidad pendiente de corrección;
- cantidad sin entregar;
- filtros por estado de entrega;
- listado de alumnos.

En este caso, el estado corresponde a cada alumno:

- Sin entregar: El alumno todavía no cargó ninguna resolución. En este caso el botón de corregir debería estar deshabilitado hasta que cargue algo el alumno.
- Pendiente de corrección: El alumno entregó, pero el docente todavía no corrigió. El botón debe llamarse “Corregir ejercicio”.
- En corrección: Puede pasar que el ejercicio tiene varias plantillas por lo que si el profe corrigió solo alguna de ellas y no todas, debe quedar en este estado la entrega del alumno. En ese caso el botón debe llamarse “Continuar corrección”
- Corregida: El docente ya revisó y cerró la corrección.

En esta pantalla conviene usar **paginación**, porque puede haber muchos alumnos. Por ejemplo, mostrar 10 o 15 alumnos por página.

#### _Pantalla “Corrección del ejercicio”_ {#pantalla-“corrección-del-ejercicio”}

Esta pantalla se usa para corregir la entrega de un alumno específico. El foco principal debe estar en la **resolución del alumno**, no en mostrar la resolución docente al lado todo el tiempo. Esto es importante porque algunas plantillas pueden ser largas o anchas, como Hoja de Trabajo, y comparar todo en paralelo puede hacer que la pantalla sea incómoda.

La resolución docente se puede consultar desde un botón, pero no debe ocupar espacio fijo en la pantalla principal.

La pantalla debe mostrar:

- datos del alumno;
- nombre del ejercicio;
- fecha de entrega;
- estado de la corrección;
- plantillas entregadas;
- botón para ver resolución docente;
- cards de resumen de la cantidad de líneas correctas que hizo el alumno, cantidad de diferencias detectadas y si hay asientos incompletos.
- tabs por plantilla;
- resolución del alumno;
- errores marcados;
- retroalimentación para el alumno;
- estado final de corrección. Esto es porque como ya dije, si tiene más de una plantilla, el profe puede elegir corregir algunas ahora y dejar las otras para después. Entonces tiene que marcar cuando termina de corregir una plantilla. **Si no están marcadas como resueltas todas las plantillas, no se debe habilitar el botón de enviar corrección.**
- botones para guardar o enviar corrección.

El botón de **ver resolución docente** debe abrir en otra pestaña la resolución modelo cargada por el docente. No se crea una pantalla nueva para esto. Se reutilizan las pantallas de resolución docente que ya hicimos en el módulo de ejercicios.

Para las resoluciones de los alumnos: en caso de ser libro diario y mayor, podemos poner scroll vertical. Para el libro IVA, si ocupa mucho se puede agregar vertical y horizontal, y lo mismo para la hoja de trabajo que suele ser bastante ancha.

El sistema debe marcar solo la celda, línea o campo donde se detectó el error, no todo el asiento completo salvo que el error afecte al asiento entero.

Ejemplos:

- si la cuenta está mal, se marca solo la celda de **Cuenta**;
- si el tipo de movimiento está mal, se marca solo la celda de **Tipo**;
- si el importe está mal, se marca solo la celda de **Debe** o **Haber**;
- si falta una cuenta, se marca el asiento como incompleto o se agrega una línea a revisar;
- si hay una línea de más, se marca esa línea como sobrante.

Cuando el docente hace clic en una celda o línea marcada con error, se abre un modal con el detalle, el cual va a mostrar:

- Asiento y línea donde se produjo el error
- **Campo con error\*** que puede ser tipo de cuenta, cuenta incorrecta, importe incorrecto, etc.
- Valor ingresado por el alumno
- Valor esperado según la resolución docente
- Comentario corto del docente que es opcional
- Botón para guardar el comentario.

Debajo la plantilla corregida debe haber un bloque de retroalimentación para el alumno, el cual funciona de dos maneras como ya mencioné antes:

- Si la entrega tiene cero errores o sólo un error simple, no hace falta usar IA. El docente puede escribir manualmente una observación breve.
- Si el sistema detecta varios errores o errores que parecen relacionados, se puede generar una sugerencia de retroalimentación con IA. La IA no corrige la entrega desde cero. La IA solo toma los errores ya detectados por el sistema y redacta un resumen pedagógico breve para ayudar al docente.

### **Campo con error** {#campo-con-error}

Esto va a estar relacionado con lo que se puede comparar de cada plantilla:

- **Libro diario:**
  - Cuenta incorrecta: Selecciona una que no era
  - Tipo de cuenta incorrecta: Por ejemplo, era A+ y eligió A-.
  - Importe incorrecto
  - Debe/Haber invertido
  - Cuenta omitida / Asiento incompleto
  - Cuenta adicional
- **Libro mayor:**
  - Cuenta a mayorizar omitida
  - Importe incorrecto
  - Debe/Haber invertido
  - Saldo final incorrecto
  - Tipo de saldo incorrecto (deudor / acreedor)
- **Libro IVA**
  - Comprobante o renglón digamos omitido
  - Comprobante o renglón de más
  - Fecha incorrecta (no es grave)
  - Algún monto incorrecto
  - Clasificación final del saldo incorrecto
- **Hoja de trabajo**
  - Cuenta incorrecta u omitida
  - Importe incorrecto (en cualquiera de todas las columnas)
  - Resultado del ejercicio incorrecto o incompleto

### **Submenú \- Análisis de errores** {#submenú---análisis-de-errores}

Este submenú funciona como una vista general para que el docente detecte patrones. No sirve para corregir alumno por alumno. La pantalla reúne información que el sistema obtiene al comparar las resoluciones de los alumnos con las resoluciones modelo del docente. A partir de esos datos, la IA podrá generar un breve resumen pedagógico con las principales dificultades encontradas y sugerencias de contenidos a reforzar.

#### _Filtros por curso_ {#filtros-por-curso}

En la parte superior se muestran botones para seleccionar el curso, por ejemplo 5.º III y 6.º III. Al seleccionar un curso, se actualiza toda la información de la pantalla: cards, errores frecuentes, patrones detectados, alumnos afectados, distribución por plantilla y resumen general. Cada curso se analiza por separado, sin mezclar sus resultados

#### _Cards a mostrar_ {#cards-a-mostrar}

| Card                      | Qué muestra                                                                        |
| :------------------------ | :--------------------------------------------------------------------------------- |
| Entregas analizadas       | Cantidad de entregas del curso que ya fueron comparadas con la resolución docente. |
| Error más frecuente       | Tipo de error que más se repite entre las entregas analizadas.                     |
| Alumnos afectados         | Cant. de alumnos distintos que presentaron al menos un error                       |
| Plantilla con más errores | Plantilla que concentra la mayor cant. de errores detectados.                      |

Estos valores se calculan a partir de las correcciones registradas y se actualizan cuando existen nuevos resultados de comparación.

#### _Errores frecuentes_ {#errores-frecuentes}

Esta sección muestra un gráfico de barras horizontales con los errores que más se repiten en las entregas del curso. Cada barra muestra el porcentaje de entregas analizadas en las que se detectó ese tipo de error. Cálculo: (Entregas donde aparece el error / total de entregas analizadas ) x 100\. Si una entrega presenta varias veces el mismo tipo de error, para este porcentaje se cuenta como una sola entrega afectada por ese error.

Los porcentajes no tienen que sumar 100%, porque una misma entrega puede presentar distintos tipos de errores.

#### _Patrones detectados_ {#patrones-detectados}

Debajo del gráfico se muestra una tabla que permite conocer en qué medida se repite cada tipo de error.

La tabla contiene:

- Error: tipo de error detectado.
- Ejercicios donde aparece: cantidad de ejercicios diferentes en los que se presentó.
- Alumnos afectados: cantidad de alumnos distintos que cometieron ese error.

Por ejemplo, si la confusión entre IVA Débito Fiscal e IVA Crédito Fiscal aparece en tres entregas de un mismo alumno, ese alumno se cuenta una sola vez en la columna Alumnos afectados.

Esta información se obtiene agrupando los errores que el sistema ya detectó durante las comparaciones. No requiere consultar a la IA.

#### _Resumen general y cosas a reforzar_ {#resumen-general-y-cosas-a-reforzar}

Esta sección muestra un resumen pedagógico generado con IA, a partir de los errores detectados en las entregas del curso.

La idea es que la IA no se limite a repetir las cantidades, sino que pueda relacionar distintos errores e identificar posibles dificultades de aprendizaje.

Por ejemplo, si varios alumnos registran IVA Crédito Fiscal en operaciones de venta, omiten discriminar IVA o calculan mal sus importes, la IA puede identificar que existen dificultades en el tratamiento contable del IVA en operaciones comerciales.

La sección se divide en dos partes:

Resumen general: un texto breve que explica cuáles son las principales dificultades observadas y cómo se relacionan entre sí.

Cosas a reforzar: una lista corta de contenidos que sería conveniente volver a trabajar en clase.

La IA utilizará como base los errores registrados por el sistema. No realizará nuevamente la corrección de los ejercicios ni determinará por sí sola cuáles son las respuestas correctas.

Para evitar un consumo innecesario de tokens, el resumen generado podrá guardarse y reutilizarse cuando el docente vuelva a ingresar. Se actualizará cuando existan nuevos resultados relevantes de corrección o cuando se decida solicitar una nueva generación.

Si todavía no existen suficientes errores analizados para identificar dificultades comunes, se mostrará un mensaje indicando que aún no hay información suficiente para generar el resumen.

#### _Alumnos afectados_ {#alumnos-afectados}

Esta sección muestra los alumnos del curso que acumulan más errores en las entregas analizadas.

Se presenta una tabla con:

- nombre del alumno;
- cantidad total de errores detectados;
- cantidad de ejercicios diferentes en los que presentó errores.

La finalidad es ayudar al docente a identificar alumnos que podrían necesitar mayor acompañamiento. La información se obtiene de los errores guardados en cada corrección y se ordena de mayor a menor cantidad de errores. No requiere intervención de IA.

#### _Distribución de errores por plantilla_ {#distribución-de-errores-por-plantilla}

Al final de la pantalla se muestran cuatro cards, una por cada grupo de plantillas:

- Libro Diario.
- Libro Mayor.
- Hoja de Trabajo.
- IVA (Compras y Ventas).

Cada card muestra la cantidad de errores detectados en esa plantilla y qué porcentaje representa sobre el total de errores del curso.

Para este análisis, los errores de Libro IVA Compras e IVA Ventas se agrupan dentro de la categoría IVA.

16. # **Mis ejercicios | Correcciones \- Vista alumno** {#mis-ejercicios-|-correcciones---vista-alumno}

## **Pantalla ‘Mis ejercicios’** {#pantalla-‘mis-ejercicios’}

Es el dashboard principal. Se presentan los filtros:

- Se puede buscar por nombre del ejercicio
- Se puede filtrar por docente
- Se puede filtrar por estado

Se muestran 5 cards de resúmen que están relacionadas con los estados en los que se puede encontrar el ejercicio.

| Estado      | Qué representa                                                                                                                                                                                            | Botón asociado                                                                                                                                                                              |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pendiente   | El alumno aún no resolvió el ejercicio.                                                                                                                                                                   | Resolver \- Lleva primero a una pantalla intermedia que es el detalle del ejercicio en donde se muestra el enunciado, las plantillas a completar y un botón para comenzar a resolver.       |
| En progreso | El alumno empezó a resolver alguna de las plantillas habilitadas.                                                                                                                                         | Continuar resolución \- Te lleva directamente a la plantilla en la que se haya quedado la última vez o a esa parte.                                                                         |
| Entregado   | El alumno envió su resolución.                                                                                                                                                                            | Ver entrega \- Te lleva a la pantalla intermedia de ver detalle en donde se le activa una card que dice corrección del docente\* (agrego abajo del cuadro).                                 |
| Corregido   | El profesor ya le hizo la devolución.                                                                                                                                                                     | Ver detalle \-Te lleva a la misma pantalla intermedia que la anterior pero cambia el mensaje (agrego abajo) Ver corrección \- Te lleva directo a la pantalla de corrección del ejercicio xd |
| Vencido     | Se pasó la venta de fecha límite y el alumno no entregó nada. En este caso, le dejamos que igual envie su resolución aunque este vencido pero obvio al profe se le avisa que se entregó fuera de término. | Resolver                                                                                                                                                                                    |

- En el caso que el ejercicio esté en estado entregado, pueden pasar dos cosas del lado del profe:
  - Si el profe todavía no empezó a corregir el ejercicio, en la card de corrección del docente se muestra “Tu ejercicio fue entregado correctamente. Todavía está pendiente de corrección” con la fecha de entrega y un botón por si quiere ver su resolución en modo lectura, **una vez enviado, ya no puede corregir nada.**
  - Si el profe ya empezó a corregir ese ejercicio, el mensaje ahí va a cambiar a: “Tu docente está revisando tu entrega. Te avisaremos cuando la corrección esté disponible.” pero **no** cambia el estado del ejercicio.
- El botón de entregar ejercicio no va a estar habilitado hasta que el alumno no haya completado todas las plantillas disponibles.

## **Pantallas para las plantillas** {#pantallas-para-las-plantillas}

- Libro diario: El alumno carga todo manual y el sistema no debe validar nada. Lo único que hará será calcular el total del asiento, es decir hacer el cálculo automático de la suma del debe y el haber, y el total final digamos cuando agrega todos los asientos.
- Hoja de trabajo: El sistema lo único que va a cargar calcular automático son las sumas de las columnas, todo el resto (incluyendo lo que son las celdas de resultado del ejercicio) las escriben los chicos.
- Libro IVA: Idem. Se calculan los totales automáticos y el saldo. Ellos escriben todo el resto y deben elegir el resultado del combo.
- Libro mayor: También se calcula automático únicamente los saldos del debe, haber y el final que es la diferencia entre ambos. Lo otro que se carga automático es el tipo de cuenta (activo, pasivo,etc) para mostrarlo nomas en el front.

## **Pantalla corrección del ejercicio** {#pantalla-corrección-del-ejercicio}

Funciona muy parecido a la del profe. Se le va a mostrar al alumno su resolución con los errores marcados en rojo igual que el profe. Al costado les aparece un resumen con:

- Lo que se equivocaron, el campo de error que había llamado antes o tipo de error como quieran llamarle.
- El comentario del profe para ese error específico si es que lo dejó.

Cuando hagan clic en alguno de los errores, se le abre el mismo modal de detalle como al profe con el nro de asiento, la línea, el tipo de error, lo que ellos pusieron y el valor esperado, con el comentario del profe si hubiera.

Además, les aparece la card con el feedback que les haya mandado el profe.

### **IMPORTANTE:** {#importante:}

Dejo el diseño en manos de quien sea que haga esa pantalla dea. Por ejemplo, para el libro diario yo puse en el figma que los comentarios estén alado de la resolución porque el libro es más angosto. Pero seguro que para la hoja de trabajo por ejemplo, que es más ancha, ese resumen de errores va a tener que estar abajo. Lo que mejor quede y sea práctico.

## **Notificaciones de ejercicios — Alumno** {#notificaciones-de-ejercicios-—-alumno}

El alumno recibirá notificaciones en la **campanita de la plataforma** cuando ocurra alguno de los siguientes eventos:

- **Nuevo ejercicio asignado:** cuando el docente envíe un ejercicio al curso. La notificación mostrará el título del ejercicio y permitirá acceder directamente a su detalle.
- **Fecha límite próxima:** cuando se acerque la fecha de entrega de un ejercicio que el alumno todavía no haya entregado. Se propone enviar el aviso **24 horas antes del vencimiento**, tanto si está pendiente como en progreso.
- **Ejercicio corregido:** cuando el docente finalice y envíe la corrección. La notificación permitirá acceder directamente a **Ver corrección**, donde el alumno podrá consultar los errores señalados, los comentarios del docente y la retroalimentación final.

**Consideraciones:**

- Las notificaciones aparecerán en la campanita, indicando la cantidad de notificaciones sin leer.
- Al seleccionar una notificación, el alumno será redirigido a la pantalla correspondiente.
- Las notificaciones podrán marcarse como leídas.
- No se enviarán recordatorios de vencimiento para ejercicios que ya fueron entregados.
- No se notificará al alumno cuando el docente simplemente comience a corregir, sino cuando la corrección esté finalizada y disponible para consultar.
