import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacionEjerciciosProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function PaginacionEjercicios({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginacionEjerciciosProps) {
  const desde = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;

  const hasta = Math.min(page * pageSize, totalItems);

  const paginas = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 border border-gray-200 bg-white px-4 py-2 font-sans sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-abacontex-gray-text">
        Mostrando {desde} a {hasta} ejercicios de {totalItems}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md text-abacontex-gray-text transition hover:bg-abacontex-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        {paginas.map((numero) => (
          <button
            key={numero}
            type="button"
            onClick={() => onPageChange(numero)}
            className={`flex size-8 cursor-pointer items-center justify-center rounded-md text-sm font-medium transition ${
              numero === page
                ? 'bg-abacontex-primary text-white'
                : 'text-abacontex-black-text hover:bg-abacontex-light'
            }`}
          >
            {numero}
          </button>
        ))}

        <button
          type="button"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md text-abacontex-gray-text transition hover:bg-abacontex-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
