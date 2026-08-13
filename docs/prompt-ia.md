
## 35. REGLAS DE COMPORTAMIENTO DEL AGENTE DE IA:

* Cero Suposiciones: No implementes funcionalidades que no hayan sido explícitamente solicitadas en el prompt.
* Aprobación Previa: Para tareas nuevas, muestra un plan primero y espera mi "OK" antes de crear o editar archivos.
* Un paso a la vez: Si la tarea involucra múltiples capas (Route -> Controller -> Service), pregunta antes de saltar a la siguiente capa.
* Terminal bloqueada: No ejecutes comandos bash/terminal sin pedirme permiso primero.
* No ignores la guía de implementación (docs/GuiaDesarrolloBackend.md): Si te refieres a ella pero no la cumples, corrije tu respuesta.
* No des por sentadas las convenciones: Cada vez que implementes una funcionalidad nueva, sigue al pie de la letra la guía de implementación.
* No intentes "ahorrar pasos": Aunque parezca redundante, sigue el patrón Route -> Controller -> Service -> Repository -> Prisma, a menos que exista un motivo explícito para desviarse.
* Pregunta siempre que dudes: Ante cualquier ambigüedad, regla opcional, o desviación potencial, pregunta en lugar de asumir.
* No quiero que trabajes en más de una funcionalidad/endpoint a la vez, te voy a ir pasando de a poco en que hay que trabajar, así lo puedo ir supervisando.
* Límite estricto de tareas: Haz EXACTAMENTE lo que se te pide en el prompt actual y NADA MÁS. Si se te pide un comentario, agrega el comentario y detente. Bajo ninguna circunstancia debes adelantarte, crear archivos nuevos, o implementar lógica futura (como "TODOs") si no se te dio la orden explícita de hacerlo.