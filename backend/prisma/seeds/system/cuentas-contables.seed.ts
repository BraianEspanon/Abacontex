import type { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

interface CuentaContableSeedData {
  codigo: string;
  nombre: string;
  tipoCuenta: string;
  rubro: string;
  descripcion: string;
}

export const cuentasContablesSeed: Seed = {
  name: 'Cuentas contables',

  async run(prisma: PrismaClient) {
    const cuentas: CuentaContableSeedData[] = [
      // =========================================================
      // ACTIVO
      // =========================================================

      // Disponibilidades
      {
        codigo: '1.1.1.1',
        nombre: 'Fondo Fijo',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion:
          'Dinero en efectivo que la empresa separa para pagar gastos pequeños y habituales.',
      },
      {
        codigo: '1.1.1.2',
        nombre: 'Caja',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion:
          'Dinero en efectivo que la empresa tiene disponible para cobrar o realizar pagos.',
      },
      {
        codigo: '1.1.1.3',
        nombre: 'Valores a Depositar',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion:
          'Cheques u otros valores recibidos que la empresa todavía no depositó en el banco.',
      },
      {
        codigo: '1.1.1.4',
        nombre: 'Bancos',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion: 'Dinero que la empresa tiene disponible en sus cuentas bancarias.',
      },
      {
        codigo: '1.1.1.5',
        nombre: 'Moneda Extranjera',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion: 'Dinero que la empresa posee en una moneda distinta del peso argentino.',
      },
      {
        codigo: '1.1.1.9',
        nombre: 'Previsión por diferencia de cotización moneda extranjera',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion:
          'Se utiliza para reflejar una posible pérdida de valor de la moneda extranjera por cambios en su cotización.',
      },

      // Inversiones
      {
        codigo: '1.1.2.1',
        nombre: 'Depósitos a plazo fijo',
        tipoCuenta: 'ACTIVO',
        rubro: 'Inversiones',
        descripcion: 'Dinero colocado en un plazo fijo para obtener intereses.',
      },
      {
        codigo: '1.1.2.2',
        nombre: 'Valores mobiliarios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Inversiones',
        descripcion:
          'Inversiones en títulos, acciones u otros valores que pueden generar una ganancia.',
      },
      {
        codigo: '1.1.2.9',
        nombre: 'Previsión para Diferencia de Cotización Valores Mobiliarios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Inversiones',
        descripcion:
          'Se utiliza para reflejar una posible pérdida de valor de las inversiones por cambios en su cotización.',
      },

      // Créditos
      {
        codigo: '1.1.3.1',
        nombre: 'Deudores por Ventas o servicios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Importes que los clientes todavía le deben a la empresa por ventas o servicios realizados a crédito.',
      },
      {
        codigo: '1.1.3.2',
        nombre: 'Documentos a Cobrar',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Importes que la empresa tiene derecho a cobrar y que están respaldados por un documento, como un pagaré.',
      },
      {
        codigo: '1.1.3.3',
        nombre: 'Deudores Prendarios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Importes que le deben a la empresa y cuyo pago está garantizado con un bien en prenda.',
      },
      {
        codigo: '1.1.3.4',
        nombre: 'Deudores Morosos',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion: 'Deudas de clientes que ya vencieron y todavía no fueron pagadas.',
      },
      {
        codigo: '1.1.3.5',
        nombre: 'Deudores con Gestión Judicial',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion: 'Deudas vencidas cuyo cobro ya se está reclamando por vía judicial.',
      },
      {
        codigo: '1.1.3.7',
        nombre: 'Intereses Positivos a Devengar',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Intereses que la empresa cobrará, pero que todavía no puede reconocer como ganancia porque aún no pasó el tiempo correspondiente.',
      },
      {
        codigo: '1.1.3.8',
        nombre: 'Previsión para Descuentos',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Estimación de descuentos que podrían otorgarse y reducir el importe que finalmente se cobrará.',
      },
      {
        codigo: '1.1.3.9',
        nombre: 'Previsión para Incobrables',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion: 'Estimación de deudas de clientes que podrían no llegar a cobrarse.',
      },

      // Otros Créditos
      {
        codigo: '1.1.4.1',
        nombre: 'Deudores Varios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Otros Créditos',
        descripcion:
          'Importes que otras personas o entidades le deben a la empresa por motivos distintos de las ventas habituales.',
      },
      {
        codigo: '1.1.4.2',
        nombre: 'Socios Art.33 Ley 19550',
        tipoCuenta: 'ACTIVO',
        rubro: 'Otros Créditos',
        descripcion:
          'Importes que la empresa tiene a cobrar relacionados con socios o empresas vinculadas.',
      },
      {
        codigo: '1.1.4.3',
        nombre: 'IVA Crédito Fiscal',
        tipoCuenta: 'ACTIVO',
        rubro: 'Otros Créditos',
        descripcion:
          'IVA pagado en las compras que luego puede descontarse del IVA generado por las ventas.',
      },
      {
        codigo: '1.1.4.4',
        nombre: 'Anticipo a Proveedores',
        tipoCuenta: 'ACTIVO',
        rubro: 'Otros Créditos',
        descripcion:
          'Dinero pagado a un proveedor antes de recibir los bienes o servicios comprados.',
      },
      {
        codigo: '1.1.4.5',
        nombre: 'Depósitos de garantía',
        tipoCuenta: 'ACTIVO',
        rubro: 'Otros Créditos',
        descripcion:
          'Dinero entregado como garantía que la empresa podrá recuperar cuando se cumplan las condiciones acordadas.',
      },
      {
        codigo: '1.1.4.6',
        nombre: 'Gastos Adelantados',
        tipoCuenta: 'ACTIVO',
        rubro: 'Otros Créditos',
        descripcion:
          'Pagos realizados por adelantado por bienes o servicios que se utilizarán más adelante.',
      },

      // Bienes de Cambio
      {
        codigo: '1.1.5.1',
        nombre: 'Mercaderías',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion: 'Bienes que la empresa compra para venderlos sin transformarlos.',
      },
      {
        codigo: '1.1.5.2',
        nombre: 'Productos Elaborados',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion: 'Productos que la empresa ya terminó de fabricar y están listos para vender.',
      },
      {
        codigo: '1.1.5.3',
        nombre: 'Materia Prima',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion: 'Material principal que se transforma para fabricar un producto.',
      },
      {
        codigo: '1.1.5.4',
        nombre: 'Productos en Proceso',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion: 'Productos que comenzaron a fabricarse pero todavía no están terminados.',
      },
      {
        codigo: '1.1.5.5',
        nombre: 'Materiales',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion: 'Elementos utilizados durante la producción para elaborar los productos.',
      },
      {
        codigo: '1.1.5.6',
        nombre: 'Haciendas',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion:
          'Animales que forman parte de la actividad de la empresa y se destinan a la venta o producción.',
      },
      {
        codigo: '1.1.5.9',
        nombre: 'Previsión para Desvalorización de Bienes de Cambio',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion:
          'Estimación de la pérdida de valor que podrían sufrir las mercaderías, materias primas u otros bienes de cambio.',
      },

      // Créditos a largo plazo
      {
        codigo: '1.2.1.1',
        nombre: 'Deudores por Ventas o Servicios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Importes que los clientes le deben a la empresa y que se espera cobrar a largo plazo.',
      },
      {
        codigo: '1.2.1.2',
        nombre: 'Deudores Prendarios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Importes que le deben a la empresa y cuyo pago está garantizado con un bien en prenda.',
      },
      {
        codigo: '1.2.1.3',
        nombre: 'Deudores Hipotecarios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Importes que le deben a la empresa y cuyo pago está garantizado con una hipoteca.',
      },
      {
        codigo: '1.2.1.4',
        nombre: 'Documentos a cobrar',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion: 'Importes documentados que la empresa tiene derecho a cobrar a largo plazo.',
      },
      {
        codigo: '1.2.1.7',
        nombre: 'Intereses positivos a devengar',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Intereses que se cobrarán a largo plazo pero que todavía no corresponde reconocer como ganancia.',
      },
      {
        codigo: '1.2.1.8',
        nombre: 'Previsión para descuentos',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion:
          'Estimación de descuentos que podrían reducir el valor de los créditos a largo plazo.',
      },
      {
        codigo: '1.2.1.9',
        nombre: 'Previsión para incobrables',
        tipoCuenta: 'ACTIVO',
        rubro: 'Créditos',
        descripcion: 'Estimación de créditos a largo plazo que podrían no llegar a cobrarse.',
      },

      // Otros Créditos a largo plazo
      {
        codigo: '1.2.2.1',
        nombre: 'Depósitos en Garantía',
        tipoCuenta: 'ACTIVO',
        rubro: 'Otros Créditos',
        descripcion: 'Dinero entregado como garantía que se espera recuperar a largo plazo.',
      },
      {
        codigo: '1.2.2.2',
        nombre: 'Socios Art.33 Ley 19550',
        tipoCuenta: 'ACTIVO',
        rubro: 'Otros Créditos',
        descripcion:
          'Importes relacionados con socios o empresas vinculadas que se espera cobrar a largo plazo.',
      },

      // Bienes de Cambio a largo plazo
      {
        codigo: '1.2.3.1',
        nombre: 'Mercaderías',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion:
          'Mercaderías que la empresa espera vender en un plazo mayor al considerado corriente.',
      },
      {
        codigo: '1.2.3.2',
        nombre: 'Productos elaborados',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion:
          'Productos terminados que la empresa espera vender en un plazo mayor al considerado corriente.',
      },
      {
        codigo: '1.2.3.3',
        nombre: 'Materias Primas',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion:
          'Materias primas que la empresa espera utilizar en procesos productivos de largo plazo.',
      },
      {
        codigo: '1.2.3.4',
        nombre: 'Materiales',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Cambio',
        descripcion:
          'Materiales que la empresa espera utilizar en procesos productivos de largo plazo.',
      },

      // Inversiones a largo plazo
      {
        codigo: '1.2.4.1',
        nombre: 'Depósitos a Plazos Fijo',
        tipoCuenta: 'ACTIVO',
        rubro: 'Inversiones',
        descripcion: 'Dinero colocado en un plazo fijo cuyo vencimiento es a largo plazo.',
      },
      {
        codigo: '1.2.4.2',
        nombre: 'Valores Mobiliarios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Inversiones',
        descripcion:
          'Inversiones en títulos, acciones u otros valores que la empresa piensa mantener a largo plazo.',
      },
      {
        codigo: '1.2.4.3',
        nombre: 'Inmuebles',
        tipoCuenta: 'ACTIVO',
        rubro: 'Inversiones',
        descripcion:
          'Propiedades que la empresa mantiene como inversión y no para usarlas en su actividad habitual.',
      },
      {
        codigo: '1.2.4.4',
        nombre: 'Terrenos',
        tipoCuenta: 'ACTIVO',
        rubro: 'Inversiones',
        descripcion:
          'Terrenos que la empresa posee como inversión y no para utilizarlos directamente en su actividad habitual.',
      },

      // Bienes de Uso
      {
        codigo: '1.2.5.1',
        nombre: 'Muebles y Útiles',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Uso',
        descripcion:
          'Muebles y elementos de uso duradero que la empresa utiliza en sus actividades.',
      },
      {
        codigo: '1.2.5.2',
        nombre: 'Instalaciones',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Uso',
        descripcion:
          'Elementos instalados en los espacios de la empresa para poder desarrollar sus actividades.',
      },
      {
        codigo: '1.2.5.3',
        nombre: 'Maquinarias',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Uso',
        descripcion:
          'Máquinas que la empresa utiliza para producir bienes o realizar sus operaciones.',
      },
      {
        codigo: '1.2.5.4',
        nombre: 'Equipos',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Uso',
        descripcion: 'Equipos de uso duradero que la empresa utiliza para trabajar.',
      },
      {
        codigo: '1.2.5.5',
        nombre: 'Terrenos',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Uso',
        descripcion:
          'Terrenos propiedad de la empresa que se utilizan para desarrollar su actividad.',
      },
      {
        codigo: '1.2.5.6',
        nombre: 'Edificios',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Uso',
        descripcion:
          'Construcciones propiedad de la empresa utilizadas para desarrollar sus actividades.',
      },
      {
        codigo: '1.2.5.7',
        nombre: 'Rodados',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Uso',
        descripcion: 'Vehículos que la empresa utiliza para transporte, reparto u otras tareas.',
      },
      {
        codigo: '1.2.5.8',
        nombre: 'Herramientas',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Uso',
        descripcion:
          'Herramientas de uso duradero que se utilizan en la producción o en otras tareas de la empresa.',
      },
      {
        codigo: '1.2.5.9',
        nombre: 'Amortizaciones Acumuladas Bienes de Uso',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes de Uso',
        descripcion:
          'Muestra cuánto valor fueron perdiendo los bienes de uso por el paso del tiempo, el uso o la obsolescencia.',
      },

      // Bienes Inmateriales
      {
        codigo: '1.2.6.1',
        nombre: 'Marcas',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes Inmateriales',
        descripcion:
          'Valor de las marcas que pertenecen a la empresa y pueden generar beneficios futuros.',
      },
      {
        codigo: '1.2.6.2',
        nombre: 'Patentes',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes Inmateriales',
        descripcion:
          'Derechos que posee la empresa sobre inventos o desarrollos protegidos legalmente.',
      },
      {
        codigo: '1.2.6.3',
        nombre: 'Llaves de Negocio',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes Inmateriales',
        descripcion:
          'Valor adicional de un negocio relacionado con su clientela, ubicación, prestigio u otras ventajas.',
      },
      {
        codigo: '1.2.6.4',
        nombre: 'Derechos de Autor',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes Inmateriales',
        descripcion:
          'Derechos que posee la empresa sobre obras o contenidos protegidos legalmente.',
      },
      {
        codigo: '1.2.6.9',
        nombre: 'Amortizaciones Acumuladas Bienes Inmateriales',
        tipoCuenta: 'ACTIVO',
        rubro: 'Bienes Inmateriales',
        descripcion:
          'Muestra cuánto valor fueron perdiendo los bienes inmateriales a medida que pasa el tiempo.',
      },

      // Cargos Diferidos
      {
        codigo: '1.3.1',
        nombre: 'Gastos de Organización',
        tipoCuenta: 'ACTIVO',
        rubro: 'Cargos Diferidos',
        descripcion:
          'Gastos relacionados con la creación, organización o puesta en marcha de la empresa.',
      },
      {
        codigo: '1.3.2',
        nombre: 'Gastos de Publicidad',
        tipoCuenta: 'ACTIVO',
        rubro: 'Cargos Diferidos',
        descripcion:
          'Gastos de publicidad que, según este plan de cuentas, se reconocen a lo largo de más de un período.',
      },
      {
        codigo: '1.3.9',
        nombre: 'Amortizaciones Acumuladas',
        tipoCuenta: 'ACTIVO',
        rubro: 'Cargos Diferidos',
        descripcion: 'Muestra la parte de los cargos diferidos que ya fue reconocida como gasto.',
      },

      // =========================================================
      // PASIVO
      // =========================================================

      // Deudas Comerciales
      {
        codigo: '2.1.1.1.1',
        nombre: 'Proveedores',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Comerciales',
        descripcion:
          'Importes que la empresa todavía debe pagar por compras de bienes o servicios realizadas a crédito.',
      },
      {
        codigo: '2.1.1.1.2',
        nombre: 'Obligaciones a Pagar',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Comerciales',
        descripcion: 'Deudas de la empresa respaldadas por un documento, como un pagaré.',
      },

      // Deudas Bancarias
      {
        codigo: '2.1.1.2.1',
        nombre: 'Adelantos en Cuenta Corriente',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Bancarias',
        descripcion:
          'Dinero utilizado de una cuenta corriente bancaria cuando no había fondos suficientes disponibles.',
      },
      {
        codigo: '2.1.1.2.2',
        nombre: 'Préstamos',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Bancarias',
        descripcion: 'Dinero recibido de un banco u otra entidad que la empresa debe devolver.',
      },

      // Deudas Financieras
      {
        codigo: '2.1.1.3.1',
        nombre: 'Acreedores Prendarios',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Financieras',
        descripcion: 'Deudas de la empresa cuyo pago está garantizado con un bien en prenda.',
      },
      {
        codigo: '2.1.1.3.2',
        nombre: 'Acreedores Hipotecarios',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Financieras',
        descripcion: 'Deudas de la empresa cuyo pago está garantizado con una hipoteca.',
      },

      // Otras Deudas
      {
        codigo: '2.1.2.1',
        nombre: 'Gastos Pendientes de Pago',
        tipoCuenta: 'PASIVO',
        rubro: 'Otras Deudas',
        descripcion: 'Gastos que ya se produjeron pero que la empresa todavía no pagó.',
      },
      {
        codigo: '2.1.2.2',
        nombre: 'Sueldos a Pagar',
        tipoCuenta: 'PASIVO',
        rubro: 'Otras Deudas',
        descripcion: 'Sueldos que ya corresponden a los empleados pero todavía no fueron pagados.',
      },
      {
        codigo: '2.1.2.3',
        nombre: 'Cargas sociales y Fiscales a Pagar',
        tipoCuenta: 'PASIVO',
        rubro: 'Otras Deudas',
        descripcion: 'Importes de cargas sociales e impuestos que la empresa todavía debe pagar.',
      },
      {
        codigo: '2.1.2.4',
        nombre: 'Dividendos Pendientes de Pago',
        tipoCuenta: 'PASIVO',
        rubro: 'Otras Deudas',
        descripcion: 'Ganancias distribuidas a socios o accionistas que todavía no fueron pagadas.',
      },

      // Otros Compromisos Devengados
      {
        codigo: '2.1.3.1',
        nombre: 'Intereses Devengados',
        tipoCuenta: 'PASIVO',
        rubro: 'Otros Compromisos Devengados',
        descripcion: 'Intereses que ya se generaron y que la empresa todavía debe pagar.',
      },
      {
        codigo: '2.1.3.2',
        nombre: 'Cargas Sociales y Fiscales Devengadas',
        tipoCuenta: 'PASIVO',
        rubro: 'Otros Compromisos Devengados',
        descripcion:
          'Cargas sociales e impuestos que ya se generaron aunque todavía no hayan sido pagados.',
      },
      {
        codigo: '2.1.3.9',
        nombre: 'Intereses Negativos no Devengados',
        tipoCuenta: 'PASIVO',
        rubro: 'Otros Compromisos Devengados',
        descripcion:
          'Intereses incluidos en una deuda que todavía no corresponde registrar como gasto porque aún no pasó el tiempo necesario.',
      },

      // Pasivo a largo plazo
      {
        codigo: '2.2.1.1.1',
        nombre: 'Proveedores',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Comerciales',
        descripcion: 'Importes adeudados a proveedores que la empresa deberá pagar a largo plazo.',
      },
      {
        codigo: '2.2.1.1.2',
        nombre: 'Obligaciones a Pagar',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Comerciales',
        descripcion:
          'Deudas documentadas, como pagarés, que la empresa deberá pagar a largo plazo.',
      },
      {
        codigo: '2.2.1.2.1',
        nombre: 'Préstamos',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Bancarias',
        descripcion: 'Dinero recibido en préstamo que la empresa deberá devolver a largo plazo.',
      },
      {
        codigo: '2.2.1.3.1',
        nombre: 'Acreedores Prendarios',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Financieras',
        descripcion: 'Deudas de largo plazo cuyo pago está garantizado con un bien en prenda.',
      },
      {
        codigo: '2.2.1.3.2',
        nombre: 'Acreedores Hipotecarios',
        tipoCuenta: 'PASIVO',
        rubro: 'Deudas Financieras',
        descripcion: 'Deudas de largo plazo cuyo pago está garantizado con una hipoteca.',
      },
      {
        codigo: '2.2.2.1',
        nombre: 'Gastos Prendarios de Pago',
        tipoCuenta: 'PASIVO',
        rubro: 'Otras Deudas',
        descripcion:
          'Cuenta incluida en el plan entregado por la docente para registrar este tipo de obligación. Conviene confirmar su denominación exacta.',
      },

      // Previsiones
      {
        codigo: '2.2.3.1',
        nombre: 'Previsión para Indemnización por despidos',
        tipoCuenta: 'PASIVO',
        rubro: 'Previsiones',
        descripcion:
          'Estimación de posibles pagos futuros que la empresa podría tener que realizar por indemnizaciones.',
      },
      {
        codigo: '2.2.3.2',
        nombre: 'Previsión para Accidentes',
        tipoCuenta: 'PASIVO',
        rubro: 'Previsiones',
        descripcion: 'Estimación de posibles obligaciones futuras relacionadas con accidentes.',
      },

      // Ganancias a Realizar
      {
        codigo: '2.3.1',
        nombre: 'Ingresos Percibidos por Adelantado',
        tipoCuenta: 'PASIVO',
        rubro: 'Ganancias a Realizar',
        descripcion:
          'Dinero cobrado antes de entregar el bien o prestar el servicio correspondiente.',
      },
      {
        codigo: '2.3.2',
        nombre: 'Otros Ingresos Percibidos por Adelantado',
        tipoCuenta: 'PASIVO',
        rubro: 'Ganancias a Realizar',
        descripcion:
          'Dinero cobrado por adelantado por conceptos distintos de la actividad principal.',
      },

      // =========================================================
      // PATRIMONIO NETO
      // =========================================================

      {
        codigo: '3.1',
        nombre: 'Capital o Capital Social',
        tipoCuenta: 'PATRIMONIO_NETO',
        rubro: 'Capital o Capital Social',
        descripcion:
          'Aportes realizados por los dueños, socios o accionistas para formar el patrimonio de la empresa.',
      },
      {
        codigo: '3.2.1',
        nombre: 'Reserva Legal',
        tipoCuenta: 'PATRIMONIO_NETO',
        rubro: 'Reservas',
        descripcion: 'Parte de las ganancias que la empresa debe guardar por obligación legal.',
      },
      {
        codigo: '3.2.2',
        nombre: 'Reserva Estatutaria',
        tipoCuenta: 'PATRIMONIO_NETO',
        rubro: 'Reservas',
        descripcion:
          'Parte de las ganancias que se reserva porque así lo establece el estatuto de la sociedad.',
      },
      {
        codigo: '3.2.3',
        nombre: 'Reserva Facultativa',
        tipoCuenta: 'PATRIMONIO_NETO',
        rubro: 'Reservas',
        descripcion:
          'Parte de las ganancias que la empresa decide guardar voluntariamente para un fin determinado.',
      },
      {
        codigo: '3.3.1',
        nombre: 'Resultados Acumulados de Ejercicios Anteriores',
        tipoCuenta: 'PATRIMONIO_NETO',
        rubro: 'Resultados Acumulados',
        descripcion:
          'Ganancias o pérdidas de años anteriores que todavía permanecen dentro del patrimonio de la empresa.',
      },
      {
        codigo: '3.3.2',
        nombre: 'Resultados del ejercicio',
        tipoCuenta: 'PATRIMONIO_NETO',
        rubro: 'Resultados Acumulados',
        descripcion: 'Ganancia o pérdida obtenida por la empresa durante el ejercicio actual.',
      },

      // =========================================================
      // RESULTADO POSITIVO
      // =========================================================

      {
        codigo: '4.1',
        nombre: 'Ventas y Servicios',
        tipoCuenta: 'RESULTADO_POSITIVO',
        rubro: 'Ventas y Servicios',
        descripcion:
          'Ingresos obtenidos por las ventas o servicios que forman parte de la actividad habitual de la empresa.',
      },
      {
        codigo: '4.2.1',
        nombre: 'Utilidad Venta de Bienes de Uso',
        tipoCuenta: 'RESULTADO_POSITIVO',
        rubro: 'Otros Ingresos',
        descripcion:
          'Ganancia obtenida al vender un bien de uso por un importe mayor a su valor contable.',
      },
      {
        codigo: '4.3.1',
        nombre: 'Donaciones',
        tipoCuenta: 'RESULTADO_POSITIVO',
        rubro: 'Ganancias',
        descripcion:
          'Bienes o dinero que la empresa recibe como donación y que representan una ganancia.',
      },

      // =========================================================
      // RESULTADO NEGATIVO
      // =========================================================

      {
        codigo: '5.1',
        nombre: 'Costos de Ventas y Servicios',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Costos de Ventas y Servicios',
        descripcion: 'Costo de los bienes que se vendieron o de los servicios que se prestaron.',
      },

      // Gastos de Comercialización
      {
        codigo: '5.2.1',
        nombre: 'Sueldos y Jornales',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Comercialización',
        descripcion: 'Sueldos del personal relacionado con las tareas de venta y comercialización.',
      },
      {
        codigo: '5.2.2',
        nombre: 'Cargas Sociales y Fiscales',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Comercialización',
        descripcion:
          'Cargas sociales e impuestos relacionados con el personal o las tareas de comercialización.',
      },
      {
        codigo: '5.2.3',
        nombre: 'Fletes',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Comercialización',
        descripcion:
          'Gastos de transporte relacionados con la entrega o distribución de productos.',
      },
      {
        codigo: '5.2.4',
        nombre: 'Seguros',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Comercialización',
        descripcion:
          'Gastos por seguros relacionados con las actividades de venta y comercialización.',
      },

      // Gastos de Administración
      {
        codigo: '5.3.1',
        nombre: 'Sueldos Administrativos',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Administración',
        descripcion: 'Sueldos del personal que realiza tareas administrativas.',
      },
      {
        codigo: '5.3.2',
        nombre: 'Cargas Sociales y Fiscales',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Administración',
        descripcion:
          'Cargas sociales e impuestos relacionados con el personal o las tareas administrativas.',
      },
      {
        codigo: '5.3.3',
        nombre: 'Seguros',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Administración',
        descripcion: 'Gastos por seguros relacionados con las actividades administrativas.',
      },
      {
        codigo: '5.3.4',
        nombre: 'Honorarios',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Administración',
        descripcion:
          'Importes pagados por servicios de profesionales, como contadores, abogados u otros asesores.',
      },
      {
        codigo: '5.3.5',
        nombre: 'Papelería y Útiles',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Administración',
        descripcion:
          'Gastos en hojas, carpetas, lapiceras y otros elementos utilizados en tareas administrativas.',
      },
      {
        codigo: '5.3.6',
        nombre: 'Movilidad y Viáticos',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Administración',
        descripcion:
          'Gastos de viajes, traslados, comidas u otros gastos necesarios cuando una persona se moviliza por trabajo.',
      },

      // Gastos de Financiación
      {
        codigo: '5.4.1',
        nombre: 'Intereses',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Financiación',
        descripcion: 'Costo que la empresa paga por utilizar dinero prestado.',
      },
      {
        codigo: '5.4.2',
        nombre: 'Comisiones Diversas',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Financiación',
        descripcion:
          'Importes pagados en concepto de comisiones por operaciones bancarias o financieras.',
      },
      {
        codigo: '5.4.3',
        nombre: 'Otros Gastos Financieros',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Financiación',
        descripcion:
          'Otros gastos relacionados con préstamos, bancos o financiamiento que no corresponden a intereses ni comisiones.',
      },
      {
        codigo: '5.4.4',
        nombre: 'Amortizaciones Bienes de uso',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Financiación',
        descripcion:
          'Parte de la pérdida de valor de los bienes de uso que se reconoce como gasto en el período.',
      },
      {
        codigo: '5.4.5',
        nombre: 'Amortizaciones Bienes Inmateriales',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Financiación',
        descripcion:
          'Parte de la pérdida de valor de los bienes inmateriales que se reconoce como gasto en el período.',
      },
      {
        codigo: '5.4.6',
        nombre: 'Amortizaciones Cargos diferidos',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Gastos de Financiación',
        descripcion:
          'Parte de los cargos diferidos que corresponde reconocer como gasto en el período.',
      },

      // Pérdidas
      {
        codigo: '5.6.1',
        nombre: 'Donaciones',
        tipoCuenta: 'RESULTADO_NEGATIVO',
        rubro: 'Pérdidas',
        descripcion:
          'Bienes o dinero que la empresa entrega como donación y que representan una pérdida.',
      },
    ];

    for (const cuenta of cuentas) {
      const rubro = await prisma.rubroCuentaContable.findFirst({
        where: {
          nombre: cuenta.rubro,
          tipoCuenta: {
            nombre: cuenta.tipoCuenta,
          },
        },
        select: {
          idRubro: true,
        },
      });

      if (!rubro) {
        throw new Error(
          `No existe el rubro "${cuenta.rubro}" para el tipo "${cuenta.tipoCuenta}".`
        );
      }

      await prisma.cuentaContable.upsert({
        where: {
          codigo: cuenta.codigo,
        },
        update: {
          nombre: cuenta.nombre,
          descripcion: cuenta.descripcion,
          idRubro: rubro.idRubro,
          activo: true,
        },
        create: {
          codigo: cuenta.codigo,
          nombre: cuenta.nombre,
          descripcion: cuenta.descripcion,
          idRubro: rubro.idRubro,
          activo: true,
        },
      });
    }
  },
};
