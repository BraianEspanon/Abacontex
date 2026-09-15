import { BadRequestError } from '../errors/bad-request-error';
import { DigitalizarEjercicioResponseDTO } from '../dto/ejercicio/ejercicio.dto';
import { ocrService } from '../integrations/ocr/ocr.service';

export async function digitalizarEjercicio(
  file?: Express.Multer.File
): Promise<DigitalizarEjercicioResponseDTO> {
  // 1. Validar presencia del archivo adjunto
  if (!file || !file.buffer) {
    throw new BadRequestError('Debe adjuntar un archivo de imagen o PDF para digitalizar.');
  }

  // 2. Validar que el archivo contenga datos
  if (file.size === 0) {
    throw new BadRequestError('El archivo adjunto se encuentra vacío.');
  }

  // 3. Coordinar la digitalización con el proveedor de OCR
  const resultado = await ocrService.extraerTexto(file.buffer, file.mimetype);

  // 4. Retornar el DTO con el enunciado en Markdown
  return {
    enunciadoTexto: resultado.enunciadoTexto,
  };
}
