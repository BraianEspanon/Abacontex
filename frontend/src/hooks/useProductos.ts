import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { obtenerProductos } from '../api/producto.api';

import type { ProductosQueryParams } from '../types/producto.types';

export function useProductos(params: ProductosQueryParams) {
  return useQuery({
    queryKey: ['productos', params],
    queryFn: () => obtenerProductos(params),
    placeholderData: keepPreviousData,
  });
}
