import { useQuery } from '@tanstack/react-query';

import { obtenerGraficoFinanciero } from '../api/finanzas.api';

import type { PeriodoGraficoFinanciero } from '../types/finanzas.types';

export function useGraficoFinanciero(periodo: PeriodoGraficoFinanciero) {
  return useQuery({
    queryKey: ['finanzas', 'grafico', periodo],
    queryFn: () => obtenerGraficoFinanciero(periodo),
  });
}
