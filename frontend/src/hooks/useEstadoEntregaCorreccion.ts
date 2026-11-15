import { useQuery } from '@tanstack/react-query';

import clienteApi from '../api/clienteApi';

type EstadoEntrega = 'SIN_ENTREGAR' | 'PENDIENTE' | 'EN_CORRECCION' | 'CORREGIDA';

interface AlumnoEntrega {
  idEntrega: number | null;
  estado: EstadoEntrega;
}

interface ListadoEntregas {
  items: AlumnoEntrega[];
  totalPages: number;
}

async function buscarEstadoEntrega(ejercicioId: number, entregaId: number): Promise<EstadoEntrega> {
  let pagina = 1;

  while (true) {
    const { data } = await clienteApi.get<ListadoEntregas>(
      `/correcciones/ejercicios/${ejercicioId}/entregas`,
      {
        params: {
          page: pagina,
          pageSize: 50,
          estado: 'TODAS',
        },
      }
    );

    const entrega = data.items.find((item) => item.idEntrega === entregaId);

    if (entrega) {
      return entrega.estado;
    }

    if (pagina >= data.totalPages) {
      throw new Error('No se encontró la entrega en el listado del ejercicio.');
    }

    pagina++;
  }
}

export function useEstadoEntregaCorreccion(ejercicioId: number | undefined, entregaId: number) {
  return useQuery({
    queryKey: ['correcciones', 'estado-entrega', ejercicioId, entregaId],
    queryFn: () => buscarEstadoEntrega(ejercicioId!, entregaId),
    enabled: Number.isInteger(ejercicioId) && Number.isInteger(entregaId) && entregaId > 0,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
