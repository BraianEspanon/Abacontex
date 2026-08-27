import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { obtenerProductos } from '../api/producto.api';

import type { ProductosQueryParams } from '../types/producto.types';

export function useProductos(params: ProductosQueryParams) {
  return useQuery({
    queryKey: ['productos', params],

    queryFn: () => obtenerProductos(params),

    placeholderData: keepPreviousData,

    retry: (failureCount, error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status && status >= 400 && status < 500) {
          return false;
        }
      }

      return failureCount < 2;
    },
  });
}
