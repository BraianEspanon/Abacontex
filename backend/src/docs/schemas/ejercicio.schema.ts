/**
 * @openapi
 * components:
 *   schemas:
 *     DigitalizarEjercicioRequest:
 *       type: object
 *       required:
 *         - archivo
 *       properties:
 *         archivo:
 *           type: string
 *           format: binary
 *           description: Documento escaneado, foto o PDF del enunciado contable. Formatos permitidos JPG, PNG, WEBP o PDF. Tamaño máximo 10 MB (configurable).
 *
 *     DigitalizarEjercicioResponse:
 *       type: object
 *       required:
 *         - enunciadoTexto
 *       properties:
 *         enunciadoTexto:
 *           type: string
 *           example: "### Distribuidora Norte S.R.L.\n\n1. 02/05 - **Factura Original N° 0001-00004523** por compra de mercaderías por $ 150.000,00 abonando en efectivo."
 *           description: Texto transcripto del enunciado estructurado en formato Markdown (GFM).
 */
