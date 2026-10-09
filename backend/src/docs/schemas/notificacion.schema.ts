/**
 * @openapi
 * components:
 *   schemas:
 *     NotificacionItem:
 *       type: object
 *       properties:
 *         idNotificacion:
 *           type: integer
 *           example: 10
 *           description: Identificador único de la notificación.
 *         ejercicioId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *           description: Identificador del ejercicio asociado si corresponde.
 *         titulo:
 *           type: string
 *           example: Nuevo Ejercicio Publicado
 *           description: Título de la notificación.
 *         mensaje:
 *           type: string
 *           example: 'El docente Juan Pérez ha publicado un nuevo ejercicio: Balance General'
 *           description: Detalle o mensaje de la notificación.
 *         leida:
 *           type: boolean
 *           example: false
 *           description: Indica si la notificación fue leída.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-08T20:30:00.000Z
 *           description: Fecha y hora de creación de la notificación.
 *
 *     ListadoNotificacionesResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NotificacionItem'
 *         page:
 *           type: integer
 *           example: 1
 *           description: Página actual consultada.
 *         pageSize:
 *           type: integer
 *           example: 10
 *           description: Cantidad de elementos por página.
 *         totalItems:
 *           type: integer
 *           example: 25
 *           description: Cantidad total de notificaciones según el filtro.
 *         totalPages:
 *           type: integer
 *           example: 3
 *           description: Total de páginas disponibles.
 *
 *     ContadorNotificacionesResponse:
 *       type: object
 *       properties:
 *         noLeidas:
 *           type: integer
 *           example: 4
 *           description: Cantidad total de notificaciones no leídas del usuario.
 *
 *     MarcarTodasLeidasResponse:
 *       type: object
 *       properties:
 *         actualizadas:
 *           type: integer
 *           example: 4
 *           description: Cantidad de notificaciones que fueron marcadas como leídas.
 */

