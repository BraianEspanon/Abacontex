import {
  DESCRIPCION_ROLES_EMPRESA,
  EMISORES_EVENTO,
  NOMBRES_ROLES_EMPRESA,
  RANGO_EVENTOS_DURACION,
  ROLES_POR_FLUJO,
  TEMAS_POR_FLUJO,
} from '../../constants/simulacion.constants';
import { GenerarFeedbackFinalParams, GenerarSimulacionParams } from './simulacion-ia.types';

export function construirPromptGeneracionSimulacion(params: GenerarSimulacionParams): {
  systemInstruction: string;
  userPrompt: string;
} {
  const { flujo, dificultad, duracion, eventosSorpresa, tipoEventoSorpresa } = params;
  const rango = RANGO_EVENTOS_DURACION[duracion] ?? { min: 6, max: 8 };
  const rolesFlujo = ROLES_POR_FLUJO[flujo] ?? ['COO', 'CEO', 'CFO'];
  const rolesDetalle = rolesFlujo
    .map((sigla) => {
      const nombre = NOMBRES_ROLES_EMPRESA[sigla] ?? sigla;
      const desc = DESCRIPCION_ROLES_EMPRESA[sigla] ? `: ${DESCRIPCION_ROLES_EMPRESA[sigla]}` : '';
      return `- ${sigla} (${nombre})${desc}`;
    })
    .join('\n');

  const temasSugeridos = TEMAS_POR_FLUJO[flujo]?.temas?.join(', ') ?? '';
  const emisoresStr = EMISORES_EVENTO.join(', ');

  const instruccionesDificultad = {
    BASICA: `8. CALIBRACIÓN DE DIFICULTAD (BÁSICA):
- Situaciones directas con consecuencias claras y pocas variables en juego simultáneo.
- Las opciones correctas son evidentes si se analiza la información básica (stock, caja, plazos).
- Debe incluir opciones de 1 o 0 puntos representando descuidos directos (ej: confirmar sin verificar stock, ignorar plazos mínimos de producción).`,
    INTERMEDIA: `8. CALIBRACIÓN DE DIFICULTAD (INTERMEDIA):
- Combina intereses de distintas áreas (ej: comercial vs. operaciones o compras vs. finanzas).
- Las decisiones generan consecuencias que se sienten en etapas posteriores de la simulación.
- Distribución de puntajes balanceada: incluye decisiones con trade-offs legítimos (3 vs 2) y decisiones con opciones poco adecuadas (1 pto) debido a parches o soluciones apresuradas.`,
    AVANZADA: `8. CALIBRACIÓN DE DIFICULTAD (AVANZADA - MATICES, DILEMAS REALES Y TRAMPAS SELECTIVAS):
- PROHIBIDO GENERAR OPCIONES MÁGICAS O SIN COSTO: Ninguna alternativa debe ser una "solución perfecta" donde todo sale bien gratis. Todas las opciones deben exigir un sacrificio real.
- CERO SPOILERS EN EL TEXTO: Prohibido usar frases delatoras ("comprometiendo la capacidad al máximo", "asumiendo el riesgo de...", "sacrificando..."). Redactar únicamente la acción ejecutiva neutra.
- DILEMAS CON GRISES Y MATICES: La dificultad avanzada evalúa dilemas estratégicos donde las opciones plantean trade-offs legítimos con ventajas y costos diferentes (ej: 3 vs 2 o 2 vs 1), asegurando siempre que cada opción tenga un puntaje diferente para que cada voto compute una diferencia evaluativa.
- TRAMPAS QUIRÚRGICAS (1 Y 0 PUNTOS): Incluir opciones de 1 o 0 puntos de forma selectiva en 2 o 3 momentos clave de la simulación (ej: ante la tentación de un pedido desmedido o una crisis de liquidez) para penalizar a quienes elijan atajos fáciles. El resto de las decisiones deben mantener el debate en los matices gerenciales de 2 y 3 puntos.`,
  }[dificultad];

  const systemInstruction = `Sos el generador pedagógico de simulaciones empresariales de Abacontex.
Diseñá una simulación empresarial realista en formato de conversación (estilo chat) en JSON estricto sin markdown.

REGLAS DE DIÁLOGO Y PLACEHOLDERS DINÁMICOS (CRÍTICO):
Redactá los mensajes de clientes, proveedores y áreas de forma totalmente natural y creíble, usando cantidades, dinero y plazos exactos en días mediante estos placeholders:
- {{empresa}}: Nombre de la empresa participante.
- {{producto}}: Producto comercializado o fabricado.
- {{cantidad}}: Stock disponible actual en el ERP de la empresa (100% de su inventario físico).
- {{cantidad:PROPORCION}}: Proporción de dicho stock (ej: {{cantidad:0.5}} para la mitad del stock, {{cantidad:1.0}} para consumir todo el stock disponible, {{cantidad:1.5}} para un pedido desmedido que supera el stock en un 50% y exige fabricar de urgencia o desdoblar entregas).
- {{monto}}: Valuación monetaria total del stock disponible a precio de lista (stock * precio).
- {{monto:PROPORCION}}: Proporción monetaria del lote (ej: {{monto:0.1}} para un costo o gasto operativo del 10%, {{monto:1.15}} para cobrar con recargo comercial, o {{monto:0.5}} para un anticipo del 50%).
- {{plazo}}: Plazo estándar de producción en días según el historial de la empresa en el ERP (ej: 6).
- {{plazo:PROPORCION}}: Plazo proporcional en días (ej: {{plazo:0.5}} para la mitad del plazo habitual por entrega urgente, {{plazo:1.5}} o {{plazo:2}} para pedir más días o plazo escalonado).

NATURALIDAD Y ESTILO CONVERSACIONAL (MUY IMPORTANTE):
- NUNCA uses corchetes ni etiquetas como "[Cliente Clave]", "[Nombre]" o "[Cliente]". Los actores hablan de forma directa y humana (ej: "Hola, les escribimos porque necesitamos un pedido urgente...", "Buenos días, desde planta les avisamos que...").
- PROHIBIDO EXPLICAR LA MATEMÁTICA O PROPORCIONES EN EL DIÁLOGO: Ningún cliente ni proveedor explica la fórmula que usó. JAMÁS redactes frases como "que es la mitad de nuestro plazo estándar", "que representa el 120%" o "según el cálculo del 15%".
- REALISMO COMERCIAL EN SOLICITUDES DE CLIENTES: En solicitudes comerciales, el CLIENTE solicita cantidades y plazos de entrega, pidiendo factibilidad y cotización (ej: "Necesitamos un pedido urgente de {{cantidad:1.2}} unidades de {{producto}} para entregar dentro de {{plazo:0.5}} días. ¿Tienen disponibilidad y qué cotización pueden ofrecernos?"). Los clientes NO definen ni imponen el monto total en su primer mensaje. La cotización monetaria ($ {{monto:1.2}}, sobreprecios o descuentos) la define la empresa participante en sus opciones de decisión.
- En cambio, cuando el emisor es PROVEEDOR o áreas internas (FINANZAS, PRODUCCION), ellos sí informan costos o presupuestos (ej: "El flete especial costará $ {{monto:0.05}}").

Ejemplo de redacción:
Mensaje cliente: "Hola, necesitamos encargar un pedido urgente de {{cantidad:1.2}} unidades de {{producto}} para entregar dentro de {{plazo:0.5}} días. ¿Tienen disponibilidad en planta y cuál sería la cotización para asumir esta entrega?"
Opción A: "Aceptar el pedido completo a precio estándar de lista por un total de $ {{monto:1.2}} para entregar en {{plazo:0.5}} días." (stock: "-{{cantidad:1.2}}", caja: "{{monto:1.2}}")
Opción B: "Aceptar el plazo urgente de {{plazo:0.5}} días aplicando un recargo por prioridad comercial del 15% ($ {{monto:1.38}})." (stock: "-{{cantidad:1.2}}", caja: "{{monto:1.38}}")
Opción C: "Ofrecer entrega inmediata de {{cantidad}} unidades por $ {{monto}} y el saldo de {{cantidad:0.2}} unidades en plazo regular de {{plazo}} días." (stock: "-{{cantidad}}", caja: "{{monto}}")

ESTRUCTURA Y REGLAS PEDAGÓGICAS:
1. Cantidad de DECISIONES requeridas: Diseñar entre ${rango.min} y ${rango.max} eventos de tipo "DECISION" a lo largo de la simulación. Los mensajes informativos (INFORMATIVO) y el mensaje de cierre (FINAL) son adicionales de contexto y NO cuentan dentro de esta cuota de decisiones. En duraciones LARGAS, mantené los mensajes y opciones sintéticos (1 a 2 oraciones) para asegurar el cierre estructural perfecto del JSON sin cortes.
2. Emisores válidos: Usar únicamente actores directos: ${emisoresStr}. Sin nombres de fantasía ni personajes ficticios.
3. COBERTURA OBLIGATORIA DE TODOS LOS ROLES EN CADA CAMINO (CRÍTICO):
- Todos los roles propios de este flujo (${rolesFlujo.join(', ')}) DEBEN tener garantizada al menos una decisión en CUALQUIER camino posible que elija la empresa desde el inicio hasta el final.
- PROHIBIDO AISLAR A UN ROL EN UNA RAMA NO ELEGIDA: Está terminantemente prohibido que un rol figure únicamente dentro de una rama lateral (ejemplo: si ponés al CFO únicamente en E2, y los alumnos eligen E1-O2 que va a E3, el alumno CFO jamás tomaría una decisión en toda la partida).
- Para evitar esto:
  * Asegurá la participación de cada rol ubicándolo en las decisiones del tronco común (por donde pasan todos los caminos, como E1, las reconvergencias como E4 o la decisión previa al cierre), O BIEN
  * Si un rol interviene dentro de una rama (E2), asegurate de que también tenga una decisión asignada en la rama alternativa paralela (E3) o en el siguiente hito común.
- En el campo "roles" colocá únicamente las siglas oficiales habilitadas (ej: ["COO", "CCO"]).
4. Eventos sorpresa: ${
    eventosSorpresa
      ? `Incluir 1 o 2 eventos sorpresa indicando "esSorpresa": true${tipoEventoSorpresa ? ` del tipo "${tipoEventoSorpresa}"` : ''}. Para los demás eventos normales, OMITIR el campo "esSorpresa" (no emitir "esSorpresa": false).`
      : 'No incluir eventos sorpresa (omitir el campo "esSorpresa").'
  }
5. Evaluación numérica de conveniencia ("pts"): Cada opción debe plantear un trade-off real y llevar su calificación numérica en el campo "pts" según esta escala pedagógica:
   - 3: Muy adecuada (solución óptima, equilibrada o altamente favorable para la empresa)
   - 2: Adecuada (solución razonable y viable, con trade-offs o costos aceptables)
   - 1: Poco adecuada (solución subóptima con alto riesgo operativo, financiero o reputacional)
   - 0: Inadecuada (solución perjudicial, negligente o que ignora las restricciones del problema)
   - PUNTAJES ESTRICTAMENTE DISTINTOS POR DECISIÓN (CERO EMPATES EN UN MISMO EVENTO):
     * Cada opción dentro de una misma decisión DEBE tener una calificación diferente en "pts".
     * PROHIBIDO REPETIR EL MISMO PUNTAJE EN EL MISMO EVENTO: NUNCA generes dos opciones de 2 puntos ni dos de 3 puntos en una misma decisión. Cada opción que el alumno elija debe producir una calificación distinta.
     * En decisiones de 2 opciones: una debe ser superior a la otra (ejemplos válidos: 3 vs 2, 2 vs 1, o 3 vs 1).
     * En decisiones de 3 opciones: graduar estrictamente en 3 niveles distintos (ejemplo: 3 pts, 2 pts y 1 pto; o 3, 2, 0).
     * TRAMPAS QUIRÚRGICAS (1 o 0 PUNTOS): Incluir opciones de 1 o 0 puntos de forma selectiva en 2 o 3 decisiones de la simulación (ej: ante la tentación de un pedido desmedido o una crisis de liquidez), para castigar a quienes busquen atajos fáciles.
   - CERO SPOILERS DE CONSECUENCIAS O RIESGOS EN EL TEXTO: Las opciones son propuestas de acción ejecutiva y describen ÚNICAMENTE la medida concreta (qué se hace, montos, plazos).
     * TERMINANTEMENTE PROHIBIDO redactar advertencias morales o coletillas explicativas como: "asumiendo el riesgo de...", "comprometiendo la capacidad al máximo", "asumiendo el riesgo de perder la cuenta", "sacrificando el alcance", "con riesgo de...".
     * Las opciones deben sonar como propuestas gerenciales legítimas y profesionales (ej: "Aprobar el pedido total de {{cantidad:1.2}} unidades a precio preferencial de $ {{monto:1.2}} con entrega en {{plazo:0.5}} días", o "Mantener el esquema regular de turnos y reprogramar la entrega a {{plazo:1.5}} días"). El riesgo y las debilidades deben ser deducidos por los alumnos mediante el análisis de los números y el debate entre roles, NUNCA masticados en el texto.
   Cada opción debe indicar también "sig": ID del siguiente evento al que conduce.
6. Impacto en variables: En opciones que alteren stock o caja, podés indicar deltas en el campo "impacto" (ej: "impacto": {"stock": "-{{cantidad}}", "caja": "{{monto}}"} o {"stock": "-{{cantidad:0.5}}"}). Si una opción no genera cambios, OMITIR el campo "impacto" (no poner objetos vacíos {}).
7. BIFURCACIONES Y RECONVERGENCIAS (ESTRICTAMENTE OBLIGATORIO - MÍNIMO 2 CICLOS DE BIFURCACIÓN):
- PROHIBIDO EL TREN TOTALMENTE LINEAL: Está TERMINANTEMENTE PROHIBIDO que más de 2 eventos consecutivos apunten secuencialmente al siguiente (ej: E4->E5->E6->E7->E8->E9 es inaceptable, aplana la simulación y elimina la sensación de impacto de las decisiones).
- MÍNIMO DOS CICLOS DE BIFURCACIÓN Y RECONVERGENCIA OBLIGATORIOS:
  * Ciclo 1 (Inicio): La decisión inicial E1 DEBE bifurcar hacia dos eventos distintos según la opción elegida (ej: E1-O1 lleva a E2 y E1-O2 lleva a E3). Luego E2 y E3 reconvergen en un hito común (ej: E4).
  * Ciclo 2 (Intermedio): Un evento posterior a la primera reconvergencia (por ejemplo E4 o E5) DEBE volver a bifurcar obligatoriamente hacia dos caminos operativos o estratégicos distintos (ej: E5-O1 lleva a E6 y E5-O2 lleva a E7). Luego ambas ramas reconvergen más adelante (ej: en E8) antes del evento final.
- COHERENCIA CAUSA-EFECTO OBLIGATORIA: Cada evento destino DEBE ser una consecuencia directa y lógica de la opción seleccionada. Si una opción rechazó invertir o postergó plazos, el evento siguiente JAMÁS puede asumir lo contrario.
- RECONVERGENCIA CONTROLADA: Los caminos divergentes siempre deben volver a encontrarse en eventos comunes para mantener el grafo ordenado y permitir que todos los caminos completen la simulación con una extensión equivalente.
${instruccionesDificultad}

FORMATO JSON:
{
  "titulo": "string",
  "contextoInicial": "situación de partida usando los placeholders...",
  "eventoInicialId": "E1",
  "eventos": [
    {
      "id": "E1",
      "tipo": "DECISION",
      "emisor": "CLIENTE",
      "mensaje": "Hola, necesitamos encargar un pedido urgente de {{cantidad:1.2}} unidades de {{producto}} para entregar en {{plazo:0.5}} días. ¿Tienen disponibilidad y qué presupuesto pueden ofrecernos?",
      "roles": ["COO", "CEO"],
      "opciones": [
        {
          "id": "E1-O1",
          "texto": "Aceptar el pedido completo a precio de lista por un total de $ {{monto:1.2}} para entregar en {{plazo:0.5}} días.",
          "pts": 2,
          "sig": "E2",
          "impacto": { "stock": "-{{cantidad:1.2}}", "caja": "{{monto:1.2}}" }
        },
        {
          "id": "E1-O2",
          "texto": "Ofrecer entregar {{cantidad}} unidades en {{plazo:0.5}} días por $ {{monto}} y el saldo en {{plazo}} días.",
          "pts": 3,
          "sig": "E3",
          "impacto": { "stock": "-{{cantidad}}", "caja": "{{monto}}" }
        }
      ]
    },
    {
      "id": "E2",
      "tipo": "DECISION",
      "emisor": "PRODUCCION",
      "mensaje": "Al comprometer la entrega urgente del 100%, Planta solicita horas extra por $ {{monto:0.1}} para llegar a tiempo. ¿Cómo procedemos?",
      "roles": ["COO", "CFO"],
      "opciones": [
        {
          "id": "E2-O1",
          "texto": "Aprobar las horas extra para garantizar la entrega.",
          "pts": 3,
          "sig": "E4",
          "impacto": { "caja": "-{{monto:0.1}}" }
        },
        {
          "id": "E2-O2",
          "texto": "Rechazar horas extra y exigir redistribución de turnos regulares.",
          "pts": 1,
          "sig": "E4"
        }
      ]
    },
    {
      "id": "E3",
      "tipo": "DECISION",
      "emisor": "CLIENTE",
      "mensaje": "El cliente acepta la entrega parcial pero solicita una bonificación de $ {{monto:0.05}} por el desdoblamiento del pedido. ¿Aceptamos?",
      "roles": ["CCO", "CEO"],
      "opciones": [
        {
          "id": "E3-O1",
          "texto": "Conceder la bonificación para preservar el vínculo comercial.",
          "pts": 2,
          "sig": "E4",
          "impacto": { "caja": "-{{monto:0.05}}" }
        },
        {
          "id": "E3-O2",
          "texto": "Mantener precio firme ofreciendo garantía extendida sin costo.",
          "pts": 3,
          "sig": "E4"
        }
      ]
    },
    {
      "id": "E4",
      "tipo": "DECISION",
      "emisor": "FINANZAS",
      "mensaje": "Llega el cierre del ciclo y surge una tensión de liquidez operativa por $ {{monto:0.15}}. ¿Qué alternativa elegimos?",
      "esSorpresa": true,
      "roles": ["CFO", "CEO"],
      "opciones": [
        {
          "id": "E4-O1",
          "texto": "Negociar prórroga de pago con proveedores clave.",
          "pts": 3,
          "sig": "E5"
        },
        {
          "id": "E4-O2",
          "texto": "Utilizar descubierto bancario de corto plazo asumiendo intereses.",
          "pts": 2,
          "sig": "E5",
          "impacto": { "caja": "-{{monto:0.03}}" }
        }
      ]
    },
    {
      "id": "E5",
      "tipo": "FINAL",
      "emisor": "ABA",
      "mensaje": "Conclusión de la simulación..."
    }
  ]
}`;

  const userPrompt = `Generá la simulación para el curso con estos parámetros:
- Flujo empresarial: ${flujo}
${temasSugeridos ? `- Temas pedagógicos sugeridos para este flujo: ${temasSugeridos}` : ''}
- Dificultad: ${dificultad} (${dificultad === 'BASICA' ? 'situación directa, pocas variables' : dificultad === 'INTERMEDIA' ? 'combina áreas, consecuencias diferidas' : 'incertidumbre y trade-offs complejos sin soluciones mágicas ni textos que delaten la respuesta'})
${dificultad === 'AVANZADA' ? 'IMPORTANTE PARA AVANZADA: No generes opciones obviamente buenas o malas; redactá ambas alternativas de manera ejecutiva y neutral planteando sacrificios y dilemas reales entre áreas (sin spoilers morales).' : ''}
- Duración: ${duracion} (generar entre ${rango.min} y ${rango.max} eventos de tipo DECISION, sin contar mensajes informativos ni de cierre. Todos los roles deben tener al menos una decisión asignada en cualquier camino posible)
- Roles a involucrar en este flujo (usar la sigla oficial en "rolesHabilitados"):
${rolesDetalle}

Recordá que el grafo NO debe ser una lista lineal simple: usá bifurcaciones reales (donde las opciones de E1 y de alguna otra decisión clave conduzcan a eventos diferentes según lo elegido) con reconvergencias controladas hacia hitos comunes posteriores.
Asegurate de que NINGÚN rol quede atrapado en una rama no elegida: en cualquier camino que recorra la empresa, todos los roles listados deben tener al menos una decisión asignada.
Recordá usar libremente proporciones dinámicas como {{cantidad}}, {{cantidad:0.8}}, {{cantidad:1.2}}, {{monto}}, {{monto:0.15}}, {{plazo}}, {{plazo:1.5}} para que la situación sea 100% verosímil y los plazos estén expresados en días concretos.
Devolvé ÚNICAMENTE el objeto JSON válido que cumpla con la estructura especificada, sin texto adicional ni bloques de markdown.`;

  return { systemInstruction, userPrompt };
}

export function construirPromptFeedbackSimulacion(params: GenerarFeedbackFinalParams): {
  systemInstruction: string;
  userPrompt: string;
} {
  const {
    tituloSimulacion,
    flujo,
    empresaNombre,
    puntajeFinal,
    puntosObtenidos,
    puntosMaximosPosibles,
    desglose,
    decisiones,
    variablesFinales,
  } = params;

  const systemInstruction = `Sos Aba, el tutor inteligente y pedagógico de la plataforma de simulación empresarial Abacontex.
Tu misión es generar una devolución formativa, constructiva y orientada al aprendizaje para un equipo de estudiantes que acaba de finalizar una simulación.

REGLAS PEDAGÓGICAS:
- El tono debe ser profesional, cercano, motivador y analítico.
- Resaltá los aciertos en la toma de decisiones y el trabajo en equipo de las diferentes áreas.
- Si el equipo obtuvo puntuación perfecta (100% o la totalidad de puntos posibles), felicitalos con entusiasmo y destaca su impecable visión gerencial sin inventar errores inexistentes.
- Si hubo errores o decisiones subóptimas (poco adecuadas o inadecuadas), señalá con claridad las decisiones que implicaron riesgos innecesarios o costos evitables, explicando qué otro enfoque hubiera sido más conveniente.
- No uses clichés vacíos: hacé referencia directa a las decisiones y acontecimientos que atravesó el equipo.
- Devolvé ÚNICAMENTE un JSON válido con esta estructura estricta, sin bloques de markdown:
{
  "resumenGeneral": "Síntesis clara de 2 o 3 oraciones sobre el desempeño global de la empresa y su resultado.",
  "fortalezas": [
    "Fortaleza 1 con referencia a una decisión acertada...",
    "Fortaleza 2..."
  ],
  "aspectosAMejorar": [
    "Aspecto a mejorar o riesgo detectado 1...",
    "Aspecto 2..."
  ],
  "conclusion": "Mensaje de cierre integrador que sintetice la principal lección aprendida y motive al equipo."
}`;

  const detalleDecisiones = decisiones
    .map(
      (d) =>
        `- Evento #${d.orden} (${d.eventoTitulo}): Rol "${d.rol}" (${d.alumnoNombre}) eligió: "${d.opcionElegida}". Clasificación: ${d.clasificacion} (${d.puntos} pts).`
    )
    .join('\n');

  const variablesStr = variablesFinales
    ? `\n- Variables de cierre del ERP: ${JSON.stringify(variablesFinales)}`
    : '';

  const resumenPuntos =
    puntosObtenidos !== undefined && puntosMaximosPosibles !== undefined
      ? ` (${puntosObtenidos} de ${puntosMaximosPosibles} puntos posibles del recorrido)`
      : '';

  const resumenDesglose = desglose
    ? `\n- Balance de decisiones: ${desglose.muyAdecuadas} muy adecuadas, ${desglose.adecuadas} adecuadas, ${desglose.pocoAdecuadas} poco adecuadas, ${desglose.inadecuadas} inadecuadas`
    : '';

  const userPrompt = `Generá la devolución pedagógica final para la empresa con estos datos:
- Empresa: ${empresaNombre}
- Simulación: ${tituloSimulacion}
- Flujo empresarial: ${flujo}
- Puntuación final obtenida: ${puntajeFinal} sobre 100 puntos${resumenPuntos}${resumenDesglose}${variablesStr}

Historial cronológico de decisiones tomadas por el equipo:
${detalleDecisiones}

Devolvé ÚNICAMENTE el objeto JSON válido.`;

  return { systemInstruction, userPrompt };
}
