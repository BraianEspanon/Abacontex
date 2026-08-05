import { z } from 'zod';

const detallePedidoSchema = z.object({
  productoId: z.coerce
    .number()
    .int('El producto es inválido.')
    .positive('El producto es inválido.'),

  cantidad: z.coerce
    .number()
    .int('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser mayor a cero.')
    .max(1000, 'La cantidad no puede superar las 1.000 unidades.'),
});

export const crearPedidoSchema = z.object({
  body: z
    .object({
      clienteNombre: z.string().trim().min(1, 'El nombre del cliente es obligatorio.').max(100),

      clienteMail: z.string().trim().email('El correo electrónico no es válido.'),

      productos: z.array(detallePedidoSchema).min(1, 'Debe seleccionar al menos un producto.'),
    })
    .superRefine((data, ctx) => {
      const ids = data.productos.map((p) => p.productoId);

      if (new Set(ids).size !== ids.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['productos'],
          message: 'No se puede agregar un mismo producto más de una vez.',
        });
      }
    }),
});

export type CrearPedidoDTO = z.infer<typeof crearPedidoSchema>['body'];

export const obtenerDetallePedidoSchema = z.object({
  params: z.object({
    idPedido: z.coerce.number().int().positive(),
  }),
});

export type ObtenerDetallePedidoDTO = z.infer<typeof obtenerDetallePedidoSchema>['params'];
