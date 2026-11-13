import {
  ClasificacionOpcionSimulacion,
  DificultadSimulacion,
  DuracionSimulacion,
  EstadoParticipacionSimulacion,
  EstadoSimulacion,
  TipoEventoSimulacion,
} from '@prisma/client';

export {
  ClasificacionOpcionSimulacion,
  DificultadSimulacion,
  DuracionSimulacion,
  EstadoParticipacionSimulacion,
  EstadoSimulacion,
  TipoEventoSimulacion,
};

export const FLUJOS_EMPRESARIALES = [
  'Venta y gestión de pedidos',
  'Compras y abastecimiento',
  'Producción y operaciones',
  'Gestión financiera',
  'Contabilidad y cierre',
  'Marketing y comunicación',
  'Reclamos y postventa',
  'Crisis empresarial',
  'Crecimiento y expansión',
] as const;

export type FlujoEmpresarial = (typeof FLUJOS_EMPRESARIALES)[number];

export const DIFICULTADES_SIMULACION = [
  DificultadSimulacion.BASICA,
  DificultadSimulacion.INTERMEDIA,
  DificultadSimulacion.AVANZADA,
] as const;

export const DURACIONES_SIMULACION = [
  DuracionSimulacion.CORTA,
  DuracionSimulacion.MEDIA,
  DuracionSimulacion.LARGA,
] as const;

export const ESTADOS_SIMULACION = [EstadoSimulacion.BORRADOR, EstadoSimulacion.PUBLICADA] as const;

export const ESTADOS_PARTICIPACION_SIMULACION = [
  EstadoParticipacionSimulacion.PENDIENTE,
  EstadoParticipacionSimulacion.EN_CURSO,
  EstadoParticipacionSimulacion.FINALIZADA,
] as const;

export const ESTADOS_DASHBOARD_SIMULACION = [
  'TODOS',
  'PENDIENTE',
  'EN_CURSO',
  'FINALIZADA',
] as const;

export type EstadoDashboardSimulacion = (typeof ESTADOS_DASHBOARD_SIMULACION)[number];

export const OPCIONES_FILTRO_ESTADO_DOCENTE_SIMULACION = [
  { clave: 'TODOS', label: 'Todos' },
  { clave: 'PENDIENTE', label: 'Pendientes' },
  { clave: 'EN_CURSO', label: 'En curso' },
  { clave: 'FINALIZADA', label: 'Finalizadas' },
] as const;

export const FILTROS_ESTADO_ALUMNO_SIMULACION = [
  'TODAS',
  'PENDIENTE',
  'EN_CURSO',
  'FINALIZADA',
  'REQUIERE_MI_DECISION',
] as const;

export type FiltroEstadoAlumnoSimulacion = (typeof FILTROS_ESTADO_ALUMNO_SIMULACION)[number];

export const OPCIONES_FILTRO_ESTADO_ALUMNO_SIMULACION = [
  { clave: 'TODAS', label: 'Todas' },
  { clave: 'PENDIENTE', label: 'Pendientes' },
  { clave: 'EN_CURSO', label: 'En curso' },
  { clave: 'FINALIZADA', label: 'Finalizadas' },
  { clave: 'REQUIERE_MI_DECISION', label: 'Requieren mi decisión' },
] as const;

export const FILTROS_ESTADO_ENTREGA_SIMULACION = [
  'TODOS',
  EstadoParticipacionSimulacion.PENDIENTE,
  EstadoParticipacionSimulacion.EN_CURSO,
  EstadoParticipacionSimulacion.FINALIZADA,
] as const;

export type FiltroEstadoEntregaSimulacion = (typeof FILTROS_ESTADO_ENTREGA_SIMULACION)[number];

export const TIPOS_EVENTO_SIMULACION = [
  TipoEventoSimulacion.DECISION,
  TipoEventoSimulacion.INFORMATIVO,
  TipoEventoSimulacion.FINAL,
] as const;

export const CLASIFICACIONES_OPCION = [
  ClasificacionOpcionSimulacion.MUY_ADECUADA,
  ClasificacionOpcionSimulacion.ADECUADA,
  ClasificacionOpcionSimulacion.POCO_ADECUADA,
  ClasificacionOpcionSimulacion.INADECUADA,
] as const;

export const PUNTOS_POR_CLASIFICACION: Record<ClasificacionOpcionSimulacion, number> = {
  [ClasificacionOpcionSimulacion.MUY_ADECUADA]: 3,
  [ClasificacionOpcionSimulacion.ADECUADA]: 2,
  [ClasificacionOpcionSimulacion.POCO_ADECUADA]: 1,
  [ClasificacionOpcionSimulacion.INADECUADA]: 0,
};

export const CLASIFICACION_POR_PUNTOS: Record<number, ClasificacionOpcionSimulacion> = {
  3: ClasificacionOpcionSimulacion.MUY_ADECUADA,
  2: ClasificacionOpcionSimulacion.ADECUADA,
  1: ClasificacionOpcionSimulacion.POCO_ADECUADA,
  0: ClasificacionOpcionSimulacion.INADECUADA,
};

export const TIPOS_EVENTO_SORPRESA = [
  'Cambio de cliente',
  'Cambio del cliente',
  'Problema con proveedor',
  'Faltante o diferencia de stock',
  'Costo inesperado',
  'Problema operativo o tecnológico',
  'Problema de calidad',
  'Reclamo o situación con el cliente',
  'Oportunidad inesperada',
] as const;

export type TipoEventoSorpresa = (typeof TIPOS_EVENTO_SORPRESA)[number];

export const EMISORES_EVENTO = ['ABA', 'CLIENTE', 'PROVEEDOR', 'PRODUCCION', 'FINANZAS'] as const;

export type EmisorEvento = (typeof EMISORES_EVENTO)[number] | string;

// Cantidad de decisiones requeridas según duración (alineado con los 4-6, 6-8 y 8-10 eventos totales del doc)
export const RANGO_EVENTOS_DURACION: Record<DuracionSimulacion, { min: number; max: number }> = {
  [DuracionSimulacion.CORTA]: { min: 4, max: 6 },
  [DuracionSimulacion.MEDIA]: { min: 6, max: 7 },
  [DuracionSimulacion.LARGA]: { min: 7, max: 9 },
};

export const ROLES_POR_FLUJO: Record<FlujoEmpresarial, readonly string[]> = {
  'Venta y gestión de pedidos': ['CCO', 'COO', 'CFO', 'CEO', 'CMO'],
  'Compras y abastecimiento': ['COO', 'CFO', 'CEO', 'CIO', 'CCO'],
  'Producción y operaciones': ['COO', 'CFO', 'CEO', 'CTO', 'CIO'],
  'Gestión financiera': ['CFO', 'CEO', 'COO', 'CIO'],
  'Contabilidad y cierre': ['CFO', 'CIO', 'CEO'],
  'Marketing y comunicación': ['CMO', 'CCO', 'CFO', 'CEO'],
  'Reclamos y postventa': ['CCO', 'COO', 'CFO', 'CEO', 'CMO'],
  'Crisis empresarial': ['CEO', 'COO', 'CFO', 'CTO', 'CCO', 'CIO', 'CMO'],
  'Crecimiento y expansión': ['CEO', 'CFO', 'COO', 'CMO', 'CTO', 'CIO', 'CCO'],
};

export const NOMBRES_ROLES_EMPRESA: Record<string, string> = {
  CEO: 'Director Ejecutivo (Estrategia y Dirección General)',
  COO: 'Director de Operaciones (Producción, Stock y Logística)',
  CFO: 'Director Financiero (Caja, Costos y Finanzas)',
  CCO: 'Director de Comunicación (Relación con Clientes, Proveedores y Reclamos)',
  CMO: 'Director de Marketing (Comercial, Promociones y Difusión)',
  CTO: 'Director de Tecnología (Herramientas Técnicas y Automatización)',
  CIO: 'Director de Información (Datos, Reportes e Indicadores)',
};

export const DESCRIPCION_ROLES_EMPRESA: Record<string, string> = {
  CEO: 'Decisiones estratégicas, prioridades, aprobación de excepciones, riesgos importantes, crecimiento y conflictos entre áreas.',
  COO: 'Producción, stock, logística, proveedores, capacidad operativa, entregas y cumplimiento de plazos.',
  CFO: 'Caja, costos, presupuesto, pagos, rentabilidad, financiamiento e inversiones.',
  CTO: 'Tecnología utilizada por la empresa, automatización, infraestructura y resolución de problemas tecnológicos.',
  CCO: 'Comunicación interna y externa, relación comunicacional con clientes y proveedores, reclamos, mensajes institucionales y coordinación de respuestas.',
  CIO: 'Información utilizada para la toma de decisiones, reportes, indicadores, disponibilidad y consistencia de datos.',
  CMO: 'Marketing, campañas, promociones, posicionamiento, generación de demanda y lanzamiento de productos.',
};

export const TEMAS_POR_FLUJO: Record<
  FlujoEmpresarial,
  { temas: string[]; rolesOrientativos: string[] }
> = {
  'Venta y gestión de pedidos': {
    temas: [
      'pedidos nuevos',
      'pedidos urgentes',
      'aumento o reducción de cantidades',
      'negociación de precios',
      'descuentos',
      'condiciones especiales',
      'falta de stock',
      'cambios en la fecha de entrega',
      'pedidos de clientes importantes',
      'cancelaciones',
      'ventas con baja rentabilidad',
      'necesidad de confirmar capacidad antes de aceptar',
    ],
    rolesOrientativos: ['CCO', 'COO', 'CFO', 'CEO', 'CMO'],
  },
  'Compras y abastecimiento': {
    temas: [
      'necesidades de nuevos insumos',
      'selección entre proveedores',
      'diferencias de precio',
      'diferencias de plazo',
      'entregas parciales',
      'incumplimiento del proveedor',
      'aumento inesperado de costos',
      'compra urgente',
      'necesidad de negociar condiciones',
      'compra excesiva o insuficiente',
      'proveedores alternativos',
    ],
    rolesOrientativos: ['COO', 'CFO', 'CEO', 'CIO', 'CCO'],
  },
  'Producción y operaciones': {
    temas: [
      'planificación de producción',
      'falta de materia prima',
      'capacidad insuficiente',
      'aumento inesperado del pedido',
      'retrasos',
      'productos defectuosos',
      'necesidad de rehacer producción',
      'problemas de calidad',
      'necesidad de tercerizar',
      'prioridades entre distintos pedidos',
      'demoras logísticas',
      'utilización ineficiente de recursos',
    ],
    rolesOrientativos: ['COO', 'CFO', 'CEO', 'CTO', 'CIO'],
  },
  'Gestión financiera': {
    temas: [
      'falta de liquidez',
      'necesidad de financiamiento',
      'inversiones',
      'pagos importantes',
      'análisis de rentabilidad',
      'costos inesperados',
      'comparación entre alternativas de financiamiento',
      'priorización de gastos',
      'reducción de márgenes',
      'necesidad de mantener reservas',
      'evaluación de una compra importante',
    ],
    rolesOrientativos: ['CFO', 'CEO', 'COO', 'CIO'],
  },
  'Contabilidad y cierre': {
    temas: [
      'diferencias entre registros',
      'facturas pendientes',
      'conciliaciones',
      'errores de registración',
      'documentación faltante',
      'gastos no registrados',
      'ingresos pendientes de imputar',
      'necesidad de revisar movimientos',
      'diferencias entre información contable y operativa',
      'cierre de período',
    ],
    rolesOrientativos: ['CFO', 'CIO', 'CEO'],
  },
  'Marketing y comunicación': {
    temas: [
      'lanzamiento de producto',
      'campaña promocional',
      'caída de ventas',
      'oportunidad de difusión',
      'comunicación con clientes',
      'cambios de imagen',
      'promociones',
      'publicidad',
      'comunicación frente a un problema',
      'estrategia frente a comentarios negativos',
      'necesidad de aumentar demanda',
    ],
    rolesOrientativos: ['CMO', 'CCO', 'CFO', 'CEO'],
  },
  'Reclamos y postventa': {
    temas: [
      'producto defectuoso',
      'entrega incorrecta',
      'demora',
      'devolución',
      'pedido incompleto',
      'solicitud de compensación',
      'cambio de producto',
      'nota de crédito',
      'cliente importante insatisfecho',
      'reclamo público',
    ],
    rolesOrientativos: ['CCO', 'COO', 'CFO', 'CEO', 'CMO'],
  },
  'Crisis empresarial': {
    temas: [
      'proveedor que incumple',
      'caída de un sistema',
      'problema grave de producción',
      'faltante crítico de stock',
      'error en un pedido importante',
      'problema de calidad',
      'pérdida de información',
      'demora logística',
      'cliente clave que amenaza con cancelar',
      'gasto inesperado importante',
    ],
    rolesOrientativos: ['CEO', 'COO', 'CFO', 'CTO', 'CCO', 'CIO', 'CMO'],
  },
  'Crecimiento y expansión': {
    temas: [
      'aumento fuerte de demanda',
      'lanzamiento de nuevos productos',
      'necesidad de aumentar capacidad',
      'contratación de nuevos recursos',
      'inversión',
      'ingreso a nuevos mercados',
      'apertura de nuevos canales',
      'incorporación de tecnología',
      'nuevos proveedores',
      'análisis de rentabilidad de una expansión',
    ],
    rolesOrientativos: ['CEO', 'CFO', 'COO', 'CMO', 'CTO', 'CIO', 'CCO'],
  },
};

export interface OpcionFlujoEmpresarial {
  id: FlujoEmpresarial;
  label: string;
}

export interface OpcionDificultadSimulacion {
  id: DificultadSimulacion;
  label: string;
}

export interface OpcionDuracionSimulacion {
  id: DuracionSimulacion;
  label: string;
  subtitulo: string;
}

export interface OpcionTipoEventoSorpresa {
  id: TipoEventoSorpresa;
  label: string;
}

export const OPCIONES_DIFICULTADES_SIMULACION: readonly OpcionDificultadSimulacion[] = [
  { id: DificultadSimulacion.BASICA, label: 'Básico' },
  { id: DificultadSimulacion.INTERMEDIA, label: 'Intermedio' },
  { id: DificultadSimulacion.AVANZADA, label: 'Avanzado' },
] as const;

export const OPCIONES_DURACIONES_SIMULACION: readonly OpcionDuracionSimulacion[] = [
  {
    id: DuracionSimulacion.CORTA,
    label: 'Corta',
    subtitulo: '4 a 6 eventos',
  },
  {
    id: DuracionSimulacion.MEDIA,
    label: 'Media',
    subtitulo: '6 a 8 eventos',
  },
  {
    id: DuracionSimulacion.LARGA,
    label: 'Larga',
    subtitulo: '8 a 10 eventos',
  },
] as const;

export const OPCIONES_TIPOS_EVENTO_SORPRESA: readonly OpcionTipoEventoSorpresa[] = [
  { id: 'Cambio de cliente', label: 'Cambio de cliente' },
  { id: 'Problema con proveedor', label: 'Problema con proveedor' },
  { id: 'Faltante o diferencia de stock', label: 'Faltante o diferencia de stock' },
  { id: 'Costo inesperado', label: 'Costo inesperado' },
  { id: 'Problema operativo o tecnológico', label: 'Problema operativo o tecnológico' },
  { id: 'Problema de calidad', label: 'Problema de calidad' },
  { id: 'Reclamo o situación con el cliente', label: 'Reclamo o situación con el cliente' },
  { id: 'Oportunidad inesperada', label: 'Oportunidad inesperada' },
] as const;

export const OPCIONES_FLUJOS_EMPRESARIALES: readonly OpcionFlujoEmpresarial[] = [
  { id: 'Venta y gestión de pedidos', label: 'Venta y gestión de pedidos' },
  { id: 'Compras y abastecimiento', label: 'Compras y abastecimiento' },
  { id: 'Producción y operaciones', label: 'Producción y operaciones' },
  { id: 'Gestión financiera', label: 'Gestión financiera' },
  { id: 'Contabilidad y cierre', label: 'Contabilidad y cierre' },
  { id: 'Marketing y comunicación', label: 'Marketing y comunicación' },
  { id: 'Reclamos y postventa', label: 'Reclamos y postventa' },
  { id: 'Crisis empresarial', label: 'Crisis empresarial' },
  { id: 'Crecimiento y expansión', label: 'Crecimiento y expansión' },
] as const;
