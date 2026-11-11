import { ROLES_POR_FLUJO } from '../../constants/simulacion.constants';
import type {
  EstructuraSimulacionGeneradaIA,
  GenerarSimulacionParams,
} from './simulacion-ia.types';

export function crearMockEstructuraSimulacion(
  params: GenerarSimulacionParams
): EstructuraSimulacionGeneradaIA {
  const rolesFlujo = ROLES_POR_FLUJO[params.flujo] ?? ['COO', 'CEO', 'CFO'];
  const rol1 = rolesFlujo[0] || 'COO';
  const rol2 = rolesFlujo[1] || 'CEO';

  return {
    titulo: `Desafío en ${params.flujo}: Gestión y toma de decisiones`,
    contextoInicial: `La empresa {{empresa}} enfrenta una situación de alta exigencia vinculada a la comercialización y entrega de {{producto}}.`,
    eventoInicialId: 'E1',
    eventos: [
      {
        id: 'E1',
        tipo: 'DECISION',
        emisor: 'CLIENTE',
        esSorpresa: false,
        mensaje:
          'Hola, necesitamos encargar un pedido urgente de {{cantidad:1.2}} unidades de {{producto}} para entregar en {{plazo:0.5}} días. ¿Tienen disponibilidad y cuál sería el presupuesto para esta entrega?',
        rolesHabilitados: [rol1, rol2],
        opciones: [
          {
            id: 'E1-O1',
            texto:
              'Aceptar de inmediato el pedido completo a precio de lista por un total de $ {{monto:1.2}} para entregar en {{plazo:0.5}} días.',
            clasificacion: 'ADECUADA',
            siguienteEventoId: 'E2',
            cambiosSimulados: { stock: '-{{cantidad:1.2}}', caja: '{{monto:1.2}}' },
          },
          {
            id: 'E1-O2',
            texto:
              'Ofrecer entregar {{cantidad}} unidades en {{plazo:0.5}} días por $ {{monto}} y el saldo restante en {{plazo}} días.',
            clasificacion: 'MUY_ADECUADA',
            siguienteEventoId: 'E3',
            cambiosSimulados: { stock: '-{{cantidad}}', caja: '{{monto}}' },
          },
        ],
      },
      {
        id: 'E2',
        tipo: 'INFORMATIVO',
        emisor: 'PRODUCCION',
        esSorpresa: false,
        mensaje:
          'Al comprometer la entrega sin revisar, Operaciones advierte que el stock actual queda en límite crítico.',
        siguienteEventoId: 'E4',
      },
      {
        id: 'E3',
        tipo: 'INFORMATIVO',
        emisor: 'ABA',
        esSorpresa: false,
        mensaje:
          'El cliente acepta la entrega inicial de {{cantidad}} unidades y valora la transparencia en la comunicación.',
        siguienteEventoId: 'E4',
      },
      {
        id: 'E4',
        tipo: 'DECISION',
        emisor: 'PRODUCCION',
        esSorpresa: false,
        mensaje:
          'Para asegurar la entrega en {{plazo}} días sin descuidar otros compromisos, Operaciones solicita definir el esquema de fabricación.',
        rolesHabilitados: [rol1, rolesFlujo[3] || 'CEO'],
        opciones: [
          {
            id: 'E4-O1',
            texto: 'Autorizar un turno especial de horas extra para el personal de planta.',
            clasificacion: 'ADECUADA',
            siguienteEventoId: 'E5',
            cambiosSimulados: { caja: '-{{monto:0.08}}' },
          },
          {
            id: 'E4-O2',
            texto:
              'Tercerizar el acabado secundario con un taller certificado para aliviar la capacidad interna.',
            clasificacion: 'MUY_ADECUADA',
            siguienteEventoId: 'E5',
            cambiosSimulados: { caja: '-{{monto:0.10}}' },
          },
        ],
      },
      {
        id: 'E5',
        tipo: 'DECISION',
        emisor: 'FINANZAS',
        esSorpresa: params.eventosSorpresa,
        mensaje:
          'Para cerrar la operación con el proveedor de insumos, surge un costo imprevisto de $ {{monto:0.15}}. ¿Cómo procedemos?',
        rolesHabilitados: [rolesFlujo[2] || 'CFO', rolesFlujo[3] || 'CEO'],
        opciones: [
          {
            id: 'E5-O1',
            texto: 'Negociar plazos de pago escalonados para resguardar la liquidez.',
            clasificacion: 'MUY_ADECUADA',
            siguienteEventoId: 'E6',
          },
          {
            id: 'E5-O2',
            texto: 'Asumir el costo con fondos propios de caja inmediata.',
            clasificacion: 'ADECUADA',
            siguienteEventoId: 'E6',
            cambiosSimulados: { caja: '-{{monto:0.15}}' },
          },
        ],
      },
      {
        id: 'E6',
        tipo: 'DECISION',
        emisor: 'CLIENTE',
        esSorpresa: false,
        mensaje:
          'El cliente valora la seriedad de la propuesta y ofrece firmar un acuerdo comercial preferencial para las compras del próximo trimestre a cambio de un descuento por volumen.',
        rolesHabilitados: [rolesFlujo[3] || 'CEO', rol2, rolesFlujo[4] || 'CMO'],
        opciones: [
          {
            id: 'E6-O1',
            texto:
              'Aceptar el acuerdo preferencial exigiendo un volumen de compra mínimo mensual garantizado.',
            clasificacion: 'MUY_ADECUADA',
            siguienteEventoId: 'E7',
          },
          {
            id: 'E6-O2',
            texto:
              'Mantener operaciones spot sin atarse a condiciones preferenciales para preservar los márgenes.',
            clasificacion: 'ADECUADA',
            siguienteEventoId: 'E7',
          },
        ],
      },
      {
        id: 'E7',
        tipo: 'FINAL',
        emisor: 'ABA',
        esSorpresa: false,
        mensaje:
          'La simulación ha concluido. El equipo ha completado todas las etapas y el resultado fue consolidado.',
      },
    ],
  };
}
