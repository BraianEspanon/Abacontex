import type { Prisma } from '@prisma/client';
import type {
  EstructuraSimulacionGeneradaIA,
  EventoGeneradoIA,
} from '../integrations/simulacion-ia/simulacion-ia.types';
import type { EmpresaSimulacionEntity } from '../repositories/simulacion.repository';

export interface EstructuraInstanciadaEmpresaResult {
  estructuraAdaptada: EstructuraSimulacionGeneradaIA;
  variablesIniciales: Prisma.InputJsonValue;
}

/**
 * Calcula el plazo base de fabricación a partir de la cantidad base,
 * utilizando una fórmula acotada con límite inferior y superior:
 *
 * Fórmula: 2 días fijos de alistamiento (setup) + 1 día por cada 15 unidades fabricadas.
 * Límites:
 * - Límite inferior: 3 días (evita plazos instantáneos inverosímiles)
 * - Límite superior: 10 días (evita plazos excesivos que excedan el horizonte temporal de la simulación)
 *
 * Ejemplos:
 * - 15 unidades -> 3 días (piso)
 * - 50 unidades (lote estándar MTO / contingencia) -> 5 días
 * - 60 unidades -> 6 días
 * - 90 unidades -> 8 días
 * - 120+ unidades -> 10 días (techo)
 */
export function calcularPlazoProduccion(cantidad: number): number {
  return Math.max(3, Math.min(10, Math.round(2 + cantidad / 15)));
}

export function calcularPlazoProduccionPromedio(cantidad = 50): number {
  return calcularPlazoProduccion(cantidad);
}

export function adaptarTituloSimulacion(
  titulo: string,
  nombreEmpresa?: string,
  productoOVariables?: unknown,
  usarDatosEmpresa = true
): string {
  let producto = 'Artículos de producción';

  if (typeof productoOVariables === 'string') {
    producto =
      usarDatosEmpresa && productoOVariables ? productoOVariables : 'Artículos de producción';
  } else if (productoOVariables && typeof productoOVariables === 'object') {
    const vars = productoOVariables as Record<string, unknown>;
    if (typeof vars.producto === 'string' && usarDatosEmpresa) {
      producto = vars.producto;
    }
  }

  const emp = nombreEmpresa || '';

  return (titulo || '').split('{{producto}}').join(producto).split('{{empresa}}').join(emp);
}

export interface ProgresoSimulacionResult {
  eventosCompletados: number;
  eventoActualNumero: number;
  porcentajeProgreso: number;
}

export function calcularProgresoSimulacion(
  estado: string,
  eventosTotales: number,
  cantidadDecisiones: number
): ProgresoSimulacionResult {
  let eventosCompletados: number;
  let eventoActualNumero: number;

  if (estado === 'FINALIZADA') {
    eventosCompletados = eventosTotales;
    eventoActualNumero = eventosTotales;
  } else if (estado === 'EN_CURSO') {
    eventosCompletados = cantidadDecisiones;
    eventoActualNumero = Math.min(eventosTotales, cantidadDecisiones + 1);
  } else {
    // PENDIENTE
    eventosCompletados = 0;
    eventoActualNumero = 1;
  }

  const porcentajeProgreso =
    eventosTotales > 0 ? Math.min(100, Math.round((eventosCompletados / eventosTotales) * 100)) : 0;

  return {
    eventosCompletados,
    eventoActualNumero,
    porcentajeProgreso,
  };
}

export function puedeRolResponderEvento(
  rolesHabilitados: unknown,
  rolAlumno: string | null
): boolean {
  if (!Array.isArray(rolesHabilitados)) return false;
  if (rolesHabilitados.includes('TODOS')) return true;
  if (rolAlumno !== null && rolesHabilitados.includes(rolAlumno)) return true;
  return false;
}

export function resolverUltimaActividadSimulacion(
  decisiones?: { fechaDecision: Date }[],
  fechaFinalizacion?: Date | null,
  fechaInicio?: Date | null
): string | null {
  return (
    decisiones?.[0]?.fechaDecision?.toISOString() ??
    fechaFinalizacion?.toISOString() ??
    fechaInicio?.toISOString() ??
    null
  );
}

function evaluarValorDinamico(
  tipo: 'cantidad' | 'monto' | 'plazo',
  factorStr: string | undefined,
  cantidadBase: number,
  montoBase: number,
  plazoBase: number
): number {
  const factor = factorStr ? parseFloat(factorStr) : 1;
  const base = tipo === 'monto' ? montoBase : tipo === 'plazo' ? plazoBase : cantidadBase;
  const min = tipo === 'monto' ? 100 : 1;
  return Math.max(min, Math.round(base * factor));
}

function reemplazarTextoDinamico(
  texto: string | undefined | null,
  cantidadBase: number,
  montoBase: number,
  plazoBase: number,
  nombreEmpresa: string,
  nombreProducto: string
): string {
  if (!texto || typeof texto !== 'string') return '';
  let res = texto
    .split('{{empresa}}')
    .join(nombreEmpresa)
    .split('{{producto}}')
    .join(nombreProducto);

  // Reemplazar {{cantidad}} y {{cantidad:X}}
  res = res.replace(/\{\{cantidad(?::([\d.]+))?\}\}/g, (_, factor) => {
    return evaluarValorDinamico('cantidad', factor, cantidadBase, montoBase, plazoBase).toString();
  });

  // Reemplazar {{monto}} y {{monto:X}}
  res = res.replace(/\{\{monto(?::([\d.]+))?\}\}/g, (_, factor) => {
    return evaluarValorDinamico('monto', factor, cantidadBase, montoBase, plazoBase).toLocaleString(
      'es-AR'
    );
  });

  // Reemplazar {{plazo}} y {{plazo:X}}
  res = res.replace(/\{\{plazo(?::([\d.]+))?\}\}/g, (_, factor) => {
    return evaluarValorDinamico('plazo', factor, cantidadBase, montoBase, plazoBase).toString();
  });

  return res;
}

function instanciarCambiosSimulados(
  cambios: Record<string, unknown> | undefined,
  cantidadBase: number,
  montoBase: number,
  plazoBase: number
): Prisma.InputJsonValue | undefined {
  if (!cambios) return undefined;

  const resultado: Record<string, unknown> = {};

  for (const [clave, valor] of Object.entries(cambios)) {
    if (typeof valor === 'string') {
      const match = valor.trim().match(/^(-?)\{\{(cantidad|monto|plazo)(?::([\d.]+))?\}\}$/);
      if (match) {
        const signo = match[1] === '-' ? -1 : 1;
        const tipo = match[2] as 'cantidad' | 'monto' | 'plazo';
        const factor = match[3];
        resultado[clave] =
          signo * evaluarValorDinamico(tipo, factor, cantidadBase, montoBase, plazoBase);
        continue;
      }
    }
    resultado[clave] = valor;
  }

  return resultado as Prisma.InputJsonValue;
}

export function garantizarCoberturaRolesEnTodosLosCaminos(
  eventos: EventoGeneradoIA[],
  eventoInicialId: string,
  rolesValidos: string[]
): EventoGeneradoIA[] {
  if (!rolesValidos || rolesValidos.length === 0 || !eventos || eventos.length === 0) {
    return eventos;
  }

  // Clonar eventos para mutar de forma segura
  const eventosClonados: EventoGeneradoIA[] = eventos.map((ev) => ({
    ...ev,
    rolesHabilitados: ev.rolesHabilitados ? [...ev.rolesHabilitados] : [],
  }));

  const eventosMap = new Map<string, EventoGeneradoIA>();
  for (const ev of eventosClonados) {
    eventosMap.set(ev.id, ev);
  }

  // Obtener todos los caminos posibles desde el inicio hasta el final
  const caminos: string[][] = [];

  function dfs(actualId: string, caminoActual: string[], visitados: Set<string>) {
    if (visitados.has(actualId)) {
      caminos.push(caminoActual);
      return;
    }
    const ev = eventosMap.get(actualId);
    if (!ev || ev.tipo === 'FINAL') {
      caminos.push([...caminoActual, actualId]);
      return;
    }

    visitados.add(actualId);
    const destinos = new Set<string>();

    if (ev.opciones && ev.opciones.length > 0) {
      for (const op of ev.opciones) {
        if (op.siguienteEventoId && eventosMap.has(op.siguienteEventoId)) {
          destinos.add(op.siguienteEventoId);
        }
      }
    } else if (ev.siguienteEventoId && eventosMap.has(ev.siguienteEventoId)) {
      destinos.add(ev.siguienteEventoId);
    }

    if (destinos.size === 0) {
      caminos.push([...caminoActual, actualId]);
    } else {
      for (const dest of destinos) {
        dfs(dest, [...caminoActual, actualId], new Set(visitados));
      }
    }
  }

  dfs(eventoInicialId, [], new Set());

  // Mapeo de afinidad entre roles y emisores
  const afinidadRolEmisor: Record<string, string[]> = {
    COO: ['PRODUCCION', 'OPERACIONES'],
    CFO: ['FINANZAS', 'CONTABILIDAD'],
    CCO: ['CLIENTE', 'PROVEEDOR', 'COMUNICACION'],
    CMO: ['CLIENTE', 'MARKETING'],
    CTO: ['TECNOLOGIA', 'SISTEMAS'],
    CIO: ['INFORMACION', 'SISTEMAS'],
    CEO: ['ABA', 'CLIENTE', 'PROVEEDOR', 'FINANZAS', 'PRODUCCION'],
  };

  // Para cada camino, verificar que todos los roles válidos tengan al menos una decisión
  for (const camino of caminos) {
    const eventosDecisionEnCamino = camino
      .map((id) => eventosMap.get(id))
      .filter((ev): ev is EventoGeneradoIA => ev !== undefined && ev.tipo === 'DECISION');

    if (eventosDecisionEnCamino.length === 0) continue;

    const rolesEnCamino = new Set<string>();
    for (const ev of eventosDecisionEnCamino) {
      for (const r of ev.rolesHabilitados ?? []) {
        rolesEnCamino.add(r);
      }
    }

    for (const rol of rolesValidos) {
      if (!rolesEnCamino.has(rol)) {
        // El rol está ausente en este camino: buscar el mejor evento de decisión para agregarlo
        const emisoresAfines = afinidadRolEmisor[rol] ?? [];
        const eventoAfin = eventosDecisionEnCamino.find((ev) =>
          emisoresAfines.includes(ev.emisor.toUpperCase())
        );

        const eventoDestino =
          eventoAfin ??
          eventosDecisionEnCamino[eventosDecisionEnCamino.length - 1] ??
          eventosDecisionEnCamino[0];

        if (eventoDestino) {
          if (!eventoDestino.rolesHabilitados) {
            eventoDestino.rolesHabilitados = [];
          }
          if (!eventoDestino.rolesHabilitados.includes(rol)) {
            eventoDestino.rolesHabilitados.push(rol);
            rolesEnCamino.add(rol);
          }
        }
      }
    }
  }

  return eventosClonados;
}

export function instanciarEstructuraParaEmpresa(
  estructuraBase: EstructuraSimulacionGeneradaIA,
  empresa: EmpresaSimulacionEntity,
  usarDatosEmpresa: boolean,
  _dificultad?: string
): EstructuraInstanciadaEmpresaResult {
  // 1. Obtener producto y datos base de la empresa
  // Selección aleatoria entre los productos activos de la empresa
  const productosActivos = (empresa.productos ?? []).filter((p) => p.activo !== false);
  const prodReal =
    productosActivos.length > 0
      ? productosActivos[Math.floor(Math.random() * productosActivos.length)]
      : empresa.productos[0];

  const nombreProducto = usarDatosEmpresa && prodReal ? prodReal.nombre : 'Artículos de producción';
  const stockReal = usarDatosEmpresa && prodReal && prodReal.stock > 0 ? prodReal.stock : 0;
  const precioBase =
    usarDatosEmpresa && prodReal && Number(prodReal.precioVenta) > 0
      ? Number(prodReal.precioVenta)
      : 1500;

  // 2. Determinar Escala Operativa y Plazo Base con fórmula acotada
  // Si la empresa tiene stock físico (> 0), usamos ese stock como base.
  // Si produce por encargo (stock == 0) o no usa datos, usamos lote estándar de 50.
  const cantidadBase = stockReal > 0 ? stockReal : 50;
  const plazoBase = calcularPlazoProduccion(cantidadBase);
  const montoBase = cantidadBase * precioBase;

  // 3. Roles presentes en la empresa
  const rolesEmpresa = empresa.alumnos
    .filter((a) => a.rolEmpresa)
    .map((a) => a.rolEmpresa!.nombreRol);
  const rolesValidos = rolesEmpresa.length > 0 ? rolesEmpresa : ['CEO'];

  // 4. Adaptar eventos, textos y roles habilitados
  const eventosAdaptados: EventoGeneradoIA[] = estructuraBase.eventos.map((ev) => {
    const rolesFiltrados = ev.rolesHabilitados
      ? ev.rolesHabilitados.filter((r) => rolesValidos.includes(r))
      : [];
    const rolesFinales = rolesFiltrados.length > 0 ? rolesFiltrados : [rolesValidos[0]!];

    const evAdaptado: EventoGeneradoIA = {
      ...ev,
      mensaje: reemplazarTextoDinamico(
        ev.mensaje,
        cantidadBase,
        montoBase,
        plazoBase,
        empresa.nombre,
        nombreProducto
      ),
      rolesHabilitados: rolesFinales,
    };

    if (ev.opciones && Array.isArray(ev.opciones)) {
      evAdaptado.opciones = ev.opciones
        .filter((op) => typeof op === 'object' && op !== null && typeof op.texto === 'string')
        .map((op) => {
          const opcionAdaptada = {
            ...op,
            texto: reemplazarTextoDinamico(
              op.texto,
              cantidadBase,
              montoBase,
              plazoBase,
              empresa.nombre,
              nombreProducto
            ),
          };

          const cambios = instanciarCambiosSimulados(
            op.cambiosSimulados,
            cantidadBase,
            montoBase,
            plazoBase
          );
          if (cambios !== undefined) {
            opcionAdaptada.cambiosSimulados = cambios as Record<string, unknown>;
          }

          return opcionAdaptada;
        });
    }

    if (ev.siguienteEventoId) {
      evAdaptado.siguienteEventoId = ev.siguienteEventoId;
    }

    return evAdaptado;
  });

  const eventosConCoberturaGarantizada = garantizarCoberturaRolesEnTodosLosCaminos(
    eventosAdaptados,
    estructuraBase.eventoInicialId,
    rolesValidos
  );

  return {
    estructuraAdaptada: {
      ...estructuraBase,
      titulo: reemplazarTextoDinamico(
        estructuraBase.titulo,
        cantidadBase,
        montoBase,
        plazoBase,
        empresa.nombre,
        nombreProducto
      ),
      contextoInicial: reemplazarTextoDinamico(
        estructuraBase.contextoInicial,
        cantidadBase,
        montoBase,
        plazoBase,
        empresa.nombre,
        nombreProducto
      ),
      eventos: eventosConCoberturaGarantizada,
    },
    variablesIniciales: {
      producto: nombreProducto,
      stockInicial: stockReal > 0 ? stockReal : 50,
      stockDisponible: stockReal > 0 ? stockReal : 50,
      precioVenta: precioBase,
      caja: 50000,
      cantidadBase,
      montoBase,
      plazoBase,
    },
  };
}
