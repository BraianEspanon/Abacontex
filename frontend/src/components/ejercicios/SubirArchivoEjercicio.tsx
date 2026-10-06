import { FileText, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface SubirArchivoEjercicioProps {
  archivo: File | null;
  onArchivoChange: (archivo: File | null) => void;
  disabled?: boolean;
}

const MAX_SIZE = 10 * 1024 * 1024;

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export default function SubirArchivoEjercicio({
  archivo,
  onArchivoChange,
  disabled = false,
}: SubirArchivoEjercicioProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [arrastrando, setArrastrando] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const validarArchivo = (nuevoArchivo: File) => {
    if (!TIPOS_PERMITIDOS.includes(nuevoArchivo.type)) {
      setError('El archivo debe ser JPG, PNG, WEBP o PDF.');
      return;
    }

    if (nuevoArchivo.size > MAX_SIZE) {
      setError('El archivo no puede superar los 10 MB.');
      return;
    }

    setError(null);
    onArchivoChange(nuevoArchivo);
  };

  const seleccionarArchivo = (files: FileList | null) => {
    const nuevoArchivo = files?.[0];

    if (!nuevoArchivo) {
      return;
    }

    validarArchivo(nuevoArchivo);
  };

  return (
    <div className="space-y-3">
      <div
        onDragEnter={(event) => {
          event.preventDefault();

          if (!disabled) {
            setArrastrando(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(event) => {
          event.preventDefault();
          setArrastrando(false);

          if (!disabled) {
            seleccionarArchivo(event.dataTransfer.files);
          }
        }}
        onClick={() => {
          if (!disabled && !archivo) {
            inputRef.current?.click();
          }
        }}
        className={[
          'relative overflow-hidden rounded-2xl border-2 border-dashed px-6 py-8 text-center',
          'transition-all duration-300 ease-out',
          archivo
            ? 'border-abacontex-primary-three/40 bg-abacontex-light'
            : 'cursor-pointer border-gray-300 bg-white',
          arrastrando
            ? 'scale-[1.01] border-abacontex-primary-three bg-abacontex-primary-three/5 shadow-lg'
            : '',
          !archivo && !arrastrando
            ? 'hover:-translate-y-0.5 hover:border-abacontex-primary-three hover:shadow-md'
            : '',
          disabled ? 'cursor-not-allowed opacity-60' : '',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          disabled={disabled}
          onChange={(event) => {
            seleccionarArchivo(event.target.files);

            event.target.value = '';
          }}
          className="hidden"
        />

        {!archivo ? (
          <div className="flex flex-col items-center">
            <div
              className={[
                'flex size-14 items-center justify-center rounded-full',
                'bg-abacontex-primary-three/10 text-abacontex-primary-three',
                'transition-all duration-300',
                arrastrando ? 'scale-110 bg-abacontex-primary-three text-white' : '',
              ].join(' ')}
            >
              <UploadCloud className="size-7" />
            </div>

            <p className="mt-4 text-sm font-semibold text-abacontex-black-text">
              Arrastrá tu archivo acá
            </p>

            <p className="mt-1 text-sm text-abacontex-gray-text">o hacé clic para seleccionarlo</p>

            <p className="mt-3 text-xs text-abacontex-gray-text">
              JPG, PNG, WEBP o PDF · Máximo 10 MB
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-left">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-abacontex-primary-three/10 text-abacontex-primary-three">
              <FileText className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-abacontex-black-text">
                {archivo.name}
              </p>

              <p className="mt-1 text-xs text-abacontex-gray-text">
                {formatearTamanio(archivo.size)}
              </p>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                setError(null);
                onArchivoChange(null);
              }}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-abacontex-gray-text transition hover:bg-white hover:text-red-500 disabled:cursor-not-allowed"
              aria-label="Eliminar archivo"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

function formatearTamanio(bytes: number) {
  const mb = bytes / (1024 * 1024);

  return `${mb.toFixed(2)} MB`;
}
