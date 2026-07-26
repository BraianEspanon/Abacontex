import clienteApi from './clienteApi';

import type {
  ActualizarProductoPayload,
  CrearProductoPayload,
  Producto,
  ProductosQueryParams,
  ProductosResponse,
} from '../types/producto.types';

export async function obtenerProductos(
  params: ProductosQueryParams = {},
): Promise<ProductosResponse> {
  const { data } = await clienteApi.get<ProductosResponse>('/productos', {
    params,
  });

  return data;
}

export async function obtenerProductoPorId(
  productoId: number,
): Promise<Producto> {
  const { data } = await clienteApi.get<Producto>(
    `/productos/${productoId}`,
  );

  return data;
}

export async function crearProducto(
  producto: CrearProductoPayload,
): Promise<Producto> {
  const { data } = await clienteApi.post<Producto>(
    '/productos',
    producto,
  );

  return data;
}

export async function actualizarProducto(
  productoId: number,
  producto: ActualizarProductoPayload,
): Promise<Producto> {
  const { data } = await clienteApi.patch<Producto>(
    `/productos/${productoId}`,
    producto,
  );

  return data;
}

export async function eliminarProducto(
  productoId: number,
): Promise<void> {
  await clienteApi.delete(`/productos/${productoId}`);
}