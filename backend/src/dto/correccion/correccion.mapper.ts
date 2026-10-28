import {
  EstadoCorreccionAlumno,
  EstadoCorreccionEjercicio,
  NOMBRES_ERRORES_LEGIBLES,
  NOMBRES_PLANTILLAS_LEGIBLES,
} from '../../constants/correccion.constants';
import {
  DatosAnalisisErroresCursoEntity,
  DetalleEjercicioEntregasEntity,
  DiagnosticoCursoEntity,
  EjercicioTableroCorreccionEntity,
  EntregaEspacioTrabajoEntity,
} from '../../repositories/correccion.repository';
import {
  AlumnoMasAfectadoCursoDTO,
  AnalisisErroresCursoResponseDTO,
  CabeceraEjercicioEntregasDTO,
  DiagnosticoIaControlDTO,
  DiagnosticoIaCursoDTO,
  DistribucionPlantillaCursoDTO,
  ErrorFrecuenteCursoDTO,
  EspacioTrabajoCorreccionResponseDTO,
  FiltrosEntregasEjercicioDTO,
  ItemAlumnoEntregaDTO,
  ItemTableroCorreccionDTO,
  KpisAnalisisErroresCursoDTO,
  ListadoEjerciciosACorregirResponseDTO,
  ListadoEntregasEjercicioResponseDTO,
  PatronDetectadoCursoDTO,
  PlantillaEspacioTrabajoDTO,
  ResumenTableroCorreccionesDTO,
} from './correccion.dto';
import { ResultadoComparacionEntrega } from '../../utils/comparadores-plantillas';

export function toItemTableroCorreccion(
  ejercicio: EjercicioTableroCorreccionEntity
): ItemTableroCorreccionDTO {
  const totalAlumnos = ejercicio.curso._count.alumnos;
  const totalEntregasRecibidas = ejercicio.entregas.length;
  const cantidadSinEntregar = Math.max(0, totalAlumnos - totalEntregasRecibidas);

  const entregasCorregidas = ejercicio.entregas.filter(
    (e) => e.correccion !== null && e.correccion.fechaCorreccion !== null
  ).length;

  const entregasEnCorreccion = ejercicio.entregas.filter(
    (e) => e.correccion !== null && e.correccion.fechaCorreccion === null
  ).length;

  const entregasPendientes = Math.max(
    0,
    totalEntregasRecibidas - entregasCorregidas - entregasEnCorreccion
  );

  let estado: EstadoCorreccionEjercicio = 'PENDIENTE';
  if (totalEntregasRecibidas === 0) {
    estado = 'SIN_ENTREGAS';
  } else if (entregasCorregidas === totalEntregasRecibidas) {
    estado = 'CORREGIDO';
  } else if (entregasEnCorreccion > 0 || entregasCorregidas > 0) {
    estado = 'EN_CORRECCION';
  }

  return {
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    curso: {
      idCurso: ejercicio.curso.idCurso,
      nombreCurso: ejercicio.curso.nombreCurso,
      totalAlumnos,
    },
    estado,
    totalEntregasRecibidas,
    cantidadSinEntregar,
    entregasCorregidas,
    entregasEnCorreccion,
    entregasPendientes,
    tieneResolucionDocente: ejercicio.resolucion?.estado === 'RESUELTO',
    createdAt: ejercicio.createdAt.toISOString(),
  };
}

export function toListadoEjerciciosACorregirResponse(
  itemsPaginados: ItemTableroCorreccionDTO[],
  page: number,
  pageSize: number,
  totalItems: number,
  resumen: ResumenTableroCorreccionesDTO
): ListadoEjerciciosACorregirResponseDTO {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return {
    items: itemsPaginados,
    page,
    pageSize,
    totalItems,
    totalPages,
    resumen,
  };
}

export function formatearNombresPlantillas(tipos: string[]): string[] {
  return tipos.map((t) => NOMBRES_PLANTILLAS_LEGIBLES[t] ?? t);
}

export function toItemAlumnoEntrega(
  alumno: DetalleEjercicioEntregasEntity['curso']['alumnos'][number],
  entrega: DetalleEjercicioEntregasEntity['entregas'][number] | undefined,
  fechaLimite: Date,
  totalPlantillas: number
): ItemAlumnoEntregaDTO {
  const nombre = alumno.usuario.nombre;
  const apellido = alumno.usuario.apellido;
  const fotoPerfilUrl = alumno.usuario.fotoPerfilUrl;

  if (!entrega || entrega.fechaEntrega === null) {
    return {
      idAlumno: alumno.id,
      nombre,
      apellido,
      email: alumno.usuario.email,
      fotoPerfilUrl,
      idEntrega: null,
      fechaEntrega: null,
      fueraDeTermino: false,
      estado: 'SIN_ENTREGAR',
      totalPlantillas,
      plantillasResueltas: 0,
      plantillasCorregidas: 0,
      tieneRetroalimentacion: false,
    };
  }

  const plantillasResueltas = entrega.resoluciones.filter((r) => r.estado === 'COMPLETADA').length;

  const plantillasCompletadas =
    entrega.correccion?.plantillas.filter((p) => p.estado === 'COMPLETADA').length ?? 0;

  const tieneRetro = Boolean(entrega.correccion?.retroalimentacion);
  const esCorregida = Boolean(entrega.correccion && entrega.correccion.fechaCorreccion !== null);

  let estado: EstadoCorreccionAlumno = 'PENDIENTE';
  if (esCorregida) {
    estado = 'CORREGIDA';
  } else if (entrega.correccion !== null && (plantillasCompletadas > 0 || tieneRetro)) {
    estado = 'EN_CORRECCION';
  }

  return {
    idAlumno: alumno.id,
    nombre,
    apellido,
    email: alumno.usuario.email,
    fotoPerfilUrl,
    idEntrega: entrega.idEntrega,
    fechaEntrega: entrega.fechaEntrega.toISOString(),
    fueraDeTermino: entrega.fechaEntrega > fechaLimite,
    estado,
    totalPlantillas,
    plantillasResueltas,
    plantillasCorregidas: plantillasCompletadas,
    tieneRetroalimentacion: tieneRetro,
  };
}

export function toListadoEntregasEjercicioResponse(
  itemsPaginados: ItemAlumnoEntregaDTO[],
  page: number,
  pageSize: number,
  totalItems: number,
  ejercicio: CabeceraEjercicioEntregasDTO,
  filtros: FiltrosEntregasEjercicioDTO
): ListadoEntregasEjercicioResponseDTO {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return {
    items: itemsPaginados,
    page,
    pageSize,
    totalItems,
    totalPages,
    ejercicio,
    filtros,
  };
}

export function toEspacioTrabajoCorreccionResponse(
  entrega: EntregaEspacioTrabajoEntity,
  comparacion: ResultadoComparacionEntrega
): EspacioTrabajoCorreccionResponseDTO {
  const plantillasResueltas = entrega.resoluciones.filter((r) => r.estado === 'COMPLETADA').length;

  const totalErrores = comparacion.kpis.totalErrores;
  const puedeSugerirIa = totalErrores >= 3;

  let motivoDeshabilitadoIa: string | null = null;
  if (!puedeSugerirIa) {
    const tieneAlgunaResolucionDocente = entrega.ejercicio.plantillas.some((ep) => {
      const resDoc = entrega.ejercicio.resolucion?.plantillas.find(
        (p) => p.ejercicioPlantillaId === ep.idEjercicioPlantilla
      );
      return resDoc?.contenido !== null && resDoc?.contenido !== undefined;
    });

    if (!tieneAlgunaResolucionDocente) {
      motivoDeshabilitadoIa = 'El ejercicio no cuenta con resolución modelo docente cargada.';
    } else if (totalErrores === 0) {
      motivoDeshabilitadoIa = 'El ejercicio no presenta errores contables detectados.';
    } else {
      motivoDeshabilitadoIa =
        'Se requieren al menos 3 errores detectados para habilitar la sugerencia pedagógica con IA.';
    }
  }

  const plantillas: PlantillaEspacioTrabajoDTO[] = entrega.ejercicio.plantillas.map((ep) => {
    const revision = entrega.correccion?.plantillas.find(
      (p) => p.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );
    const resolucionAlumno = entrega.resoluciones.find(
      (r) => r.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );
    const resolucionDocente = entrega.ejercicio.resolucion?.plantillas.find(
      (p) => p.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );

    return {
      idEjercicioPlantilla: ep.idEjercicioPlantilla,
      tipo: ep.tipo,
      nombre: NOMBRES_PLANTILLAS_LEGIBLES[ep.tipo] ?? ep.tipo,
      estadoRevision: revision?.estado === 'COMPLETADA' ? 'CORREGIDA' : 'PENDIENTE',
      estadoAlumno: resolucionAlumno?.estado ?? 'PENDIENTE',
      contenidoAlumno: resolucionAlumno?.contenido ?? null,
      contenidoDocente: resolucionDocente?.contenido ?? null,
      errores: comparacion.erroresPorPlantilla.get(ep.idEjercicioPlantilla) ?? [],
    };
  });

  return {
    alumno: {
      idAlumno: entrega.alumno.id,
      nombre: entrega.alumno.usuario.nombre,
      apellido: entrega.alumno.usuario.apellido,
      email: entrega.alumno.usuario.email,
      fotoPerfilUrl: entrega.alumno.usuario.fotoPerfilUrl,
      curso: {
        idCurso: entrega.alumno.curso.idCurso,
        nombreCurso: entrega.alumno.curso.nombreCurso,
      },
    },
    entrega: {
      idEntrega: entrega.idEntrega,
      fechaEntrega: entrega.fechaEntrega ? entrega.fechaEntrega.toISOString() : null,
      fueraDeTermino: entrega.fechaEntrega
        ? entrega.fechaEntrega > entrega.ejercicio.fechaLimite
        : false,
    },
    ejercicio: {
      idEjercicio: entrega.ejercicio.idEjercicio,
      titulo: entrega.ejercicio.titulo,
      enunciado: entrega.ejercicio.enunciado,
      indicaciones: entrega.ejercicio.indicaciones,
      fechaLimite: entrega.ejercicio.fechaLimite.toISOString(),
      totalPlantillas: entrega.ejercicio.plantillas.length,
      plantillasResueltas,
      tieneResolucionDocente: entrega.ejercicio.resolucion?.estado === 'RESUELTO',
    },
    kpis: comparacion.kpis,
    controlIa: {
      puedeSugerirIa,
      motivoDeshabilitadoIa,
    },
    retroalimentacionBorrador: entrega.correccion?.retroalimentacion ?? null,
    plantillas,
  };
}

export interface MetricasTendenciaCurso {
  totalErrores: number;
  errorPrincipal: string;
  plantillaPrincipal: string;
  distribucionPorcentajes: Record<string, number>;
}

export function hayCambioDeTendencia(
  snapshot: DiagnosticoCursoEntity,
  actual: MetricasTendenciaCurso
): boolean {
  // Regla 0 (Significancia Estadística): Al menos >= 10 errores nuevos desde el último snapshot
  const erroresNuevos = actual.totalErrores - snapshot.totalErroresEnSnapshot;
  if (erroresNuevos < 10) {
    return false;
  }

  // Regla 1 (Cambio de Error Líder)
  if (actual.errorPrincipal !== snapshot.errorPrincipalEnSnapshot) {
    return true;
  }

  // Regla 4 (Cambio de Plantilla Crítica)
  if (actual.plantillaPrincipal !== snapshot.plantillaPrincipalEnSnapshot) {
    return true;
  }

  const snapshotDistribucion = (snapshot.distribucionEnSnapshot as Record<string, number>) ?? {};

  // Reglas 2 y 3 sobre la distribución porcentual de errores
  for (const [tipoError, pctActual] of Object.entries(actual.distribucionPorcentajes)) {
    const pctSnapshot = snapshotDistribucion[tipoError] ?? 0;

    // Regla 2 (Nuevo Error Emergente: representaba < 5% y ahora supera el 15%)
    if (pctSnapshot < 5 && pctActual > 15) {
      return true;
    }

    // Regla 3 (Variación Porcentual Drástica: variación >= 15 puntos porcentuales)
    if (Math.abs(pctActual - pctSnapshot) >= 15) {
      return true;
    }
  }

  return false;
}

export function toAnalisisErroresCursoResponse(
  curso: {
    idCurso: number;
    nombreCurso: string;
    año: number;
  },
  datos: DatosAnalisisErroresCursoEntity
): AnalisisErroresCursoResponseDTO {
  const totalErrores = datos.errores.length;
  const totalEntregasAnalizadas = datos.totalEntregasAnalizadas;

  const erroresPorTipo = new Map<
    string,
    {
      totalErrores: number;
      entregas: Set<number>;
      ejercicios: Set<number>;
      alumnos: Set<string>;
    }
  >();

  const erroresPorAlumno = new Map<
    string,
    {
      nombre: string;
      apellido: string;
      totalErrores: number;
      ejercicios: Set<number>;
    }
  >();

  const plantillasCount: Record<'LIBRO_DIARIO' | 'LIBRO_MAYOR' | 'HOJA_TRABAJO' | 'IVA', number> = {
    LIBRO_DIARIO: 0,
    LIBRO_MAYOR: 0,
    HOJA_TRABAJO: 0,
    IVA: 0,
  };

  for (const err of datos.errores) {
    const tipo = err.tipoError;
    const entregaId = err.correccion.entrega.idEntrega;
    const ejercicioId = err.correccion.entrega.ejercicioId;
    const alumnoId = err.correccion.entrega.alumnoId;
    const alumno = err.correccion.entrega.alumno;

    // Agrupación por tipo de error
    let entradaTipo = erroresPorTipo.get(tipo);
    if (!entradaTipo) {
      entradaTipo = {
        totalErrores: 0,
        entregas: new Set(),
        ejercicios: new Set(),
        alumnos: new Set(),
      };
      erroresPorTipo.set(tipo, entradaTipo);
    }
    entradaTipo.totalErrores++;
    entradaTipo.entregas.add(entregaId);
    entradaTipo.ejercicios.add(ejercicioId);
    entradaTipo.alumnos.add(alumnoId);

    // Agrupación por alumno
    let entradaAlumno = erroresPorAlumno.get(alumnoId);
    if (!entradaAlumno) {
      entradaAlumno = {
        nombre: alumno.usuario.nombre,
        apellido: alumno.usuario.apellido,
        totalErrores: 0,
        ejercicios: new Set(),
      };
      erroresPorAlumno.set(alumnoId, entradaAlumno);
    }
    entradaAlumno.totalErrores++;
    entradaAlumno.ejercicios.add(ejercicioId);

    // Agrupación por plantilla
    const tipoPlantilla = err.ejercicioPlantilla.tipo;
    if (tipoPlantilla === 'LIBRO_DIARIO') {
      plantillasCount.LIBRO_DIARIO++;
    } else if (tipoPlantilla === 'LIBRO_MAYOR') {
      plantillasCount.LIBRO_MAYOR++;
    } else if (tipoPlantilla === 'HOJA_TRABAJO') {
      plantillasCount.HOJA_TRABAJO++;
    } else if (tipoPlantilla === 'LIBRO_IVA') {
      plantillasCount.IVA++;
    }
  }

  // 1. Errores frecuentes (Gráfico de barras)
  const erroresFrecuentes: ErrorFrecuenteCursoDTO[] = Array.from(erroresPorTipo.entries())
    .map(([tipo, data]) => {
      const porcentaje =
        totalEntregasAnalizadas > 0
          ? Number(((data.entregas.size / totalEntregasAnalizadas) * 100).toFixed(1))
          : 0;
      return {
        tipoError: tipo,
        label: NOMBRES_ERRORES_LEGIBLES[tipo] ?? tipo,
        porcentaje,
        cantidadEntregasAfectadas: data.entregas.size,
      };
    })
    .sort(
      (a, b) =>
        b.porcentaje - a.porcentaje || b.cantidadEntregasAfectadas - a.cantidadEntregasAfectadas
    );

  // 2. Patrones detectados (Tabla)
  const patronesDetectados: PatronDetectadoCursoDTO[] = Array.from(erroresPorTipo.entries())
    .map(([tipo, data]) => ({
      tipoError: tipo,
      label: NOMBRES_ERRORES_LEGIBLES[tipo] ?? tipo,
      ejerciciosAfectados: data.ejercicios.size,
      alumnosAfectados: data.alumnos.size,
    }))
    .sort(
      (a, b) =>
        b.alumnosAfectados - a.alumnosAfectados || b.ejerciciosAfectados - a.ejerciciosAfectados
    );

  // 3. Alumnos más afectados (Ranking)
  const alumnosMasAfectados: AlumnoMasAfectadoCursoDTO[] = Array.from(erroresPorAlumno.entries())
    .map(([idAlumno, data]) => ({
      idAlumno,
      nombre: data.nombre,
      apellido: data.apellido,
      totalErrores: data.totalErrores,
      ejerciciosConErrores: data.ejercicios.size,
    }))
    .sort((a, b) => b.totalErrores - a.totalErrores);

  // 4. Distribución por plantillas
  const categorias: Array<{
    categoria: 'LIBRO_DIARIO' | 'LIBRO_MAYOR' | 'HOJA_TRABAJO' | 'IVA';
    label: string;
  }> = [
    { categoria: 'LIBRO_DIARIO', label: 'Libro Diario' },
    { categoria: 'LIBRO_MAYOR', label: 'Libro Mayor' },
    { categoria: 'HOJA_TRABAJO', label: 'Hoja de Trabajo' },
    { categoria: 'IVA', label: 'IVA' },
  ];

  const distribucionPlantillas: DistribucionPlantillaCursoDTO[] = categorias.map((cat) => {
    const cantidadErrores = plantillasCount[cat.categoria];
    const porcentaje =
      totalErrores > 0 ? Number(((cantidadErrores / totalErrores) * 100).toFixed(1)) : 0;
    return {
      categoria: cat.categoria,
      label: cat.label,
      cantidadErrores,
      porcentaje,
    };
  });

  // 5. KPIs
  const plantillaLider = [...distribucionPlantillas].sort(
    (a, b) => b.cantidadErrores - a.cantidadErrores
  )[0];
  const plantillaConMasErrores =
    plantillaLider && plantillaLider.cantidadErrores > 0 ? plantillaLider.label : 'Ninguna';

  const primerErrorFrecuente = erroresFrecuentes[0];
  const errorMasFrecuente =
    primerErrorFrecuente && primerErrorFrecuente.cantidadEntregasAfectadas > 0
      ? primerErrorFrecuente.label
      : 'Ninguno';

  const kpis: KpisAnalisisErroresCursoDTO = {
    entregasAnalizadas: totalEntregasAnalizadas,
    errorMasFrecuente,
    alumnosAfectados: erroresPorAlumno.size,
    plantillaConMasErrores,
  };

  // 6. Distribución de porcentajes por tipo de error para el snapshot de IA
  const distribucionPorcentajes: Record<string, number> = {};
  for (const [tipo, data] of erroresPorTipo.entries()) {
    distribucionPorcentajes[tipo] =
      totalErrores > 0 ? Number(((data.totalErrores / totalErrores) * 100).toFixed(1)) : 0;
  }

  const errorPrincipal = primerErrorFrecuente ? primerErrorFrecuente.tipoError : 'NINGUNO';
  const plantillaPrincipal =
    plantillaLider && plantillaLider.cantidadErrores > 0 ? plantillaLider.categoria : 'NINGUNA';

  // 7. Evaluación de Diagnóstico IA y Control del botón
  let diagnosticoIa: DiagnosticoIaCursoDTO | null = null;
  let controlIa: DiagnosticoIaControlDTO;

  if (datos.diagnosticoPrevio) {
    const hayCambio = hayCambioDeTendencia(datos.diagnosticoPrevio, {
      totalErrores,
      errorPrincipal,
      plantillaPrincipal,
      distribucionPorcentajes,
    });

    const motivoDeshabilitado = hayCambio
      ? null
      : 'El diagnóstico actual se encuentra vigente. No se detectaron cambios en la tendencia de errores del curso.';

    diagnosticoIa = {
      resumen: datos.diagnosticoPrevio.resumenGeneral,
      cosasAReforzar: Array.isArray(datos.diagnosticoPrevio.cosasAReforzar)
        ? (datos.diagnosticoPrevio.cosasAReforzar as string[])
        : [],
      fechaGeneracion: datos.diagnosticoPrevio.updatedAt.toISOString(),
      puedeGenerar: hayCambio,
      motivoDeshabilitado,
    };

    controlIa = {
      puedeGenerar: hayCambio,
      motivoDeshabilitado,
    };
  } else {
    // Si todavía no hay diagnóstico previo generado
    if (totalErrores < 10) {
      controlIa = {
        puedeGenerar: false,
        motivoDeshabilitado:
          'Aún no hay suficiente información analizada para generar el resumen (se requieren al menos 10 errores analizados).',
      };
    } else {
      controlIa = {
        puedeGenerar: true,
        motivoDeshabilitado: null,
      };
    }
  }

  return {
    curso,
    kpis,
    erroresFrecuentes,
    patronesDetectados,
    alumnosMasAfectados,
    distribucionPlantillas,
    diagnosticoIa,
    controlIa,
  };
}
