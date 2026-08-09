import clienteApi from './clienteApi';

import type {
  ActualizarProductoPayload,
  CrearProductoPayload,
  Producto,
  ProductosQueryParams,
  ProductosResponse,
} from '../types/producto.types';

export async function obtenerProductos(
  params: ProductosQueryParams = {}
): Promise<ProductosResponse> {
  const { data } = await clienteApi.get('/productos', {
    params,
  });

  return data;
}

export async function obtenerProductoPorId(productoId: number): Promise<Producto> {
  const { data } = await clienteApi.get(`/productos/${productoId}`);

  return data;
}

export async function crearProducto(producto: CrearProductoPayload): Promise<Producto> {
  const formData = new FormData();

  formData.append('nombre', producto.nombre);
  formData.append('descripcion', producto.descripcion);
  formData.append('precioUnitario', String(producto.precioUnitario));
  formData.append('stockInicial', String(producto.stockInicial));
  formData.append('margenGanancia', String(producto.margenGanancia));

  if (producto.foto) {
    formData.append('foto', producto.foto);
  }

  const { data } = await clienteApi.post('/productos', formData);

  return data;
}

export async function actualizarProducto(
  productoId: number,
  producto: ActualizarProductoPayload
): Promise<Producto> {
  const formData = new FormData();

  formData.append('nombre', producto.nombre);
  formData.append('descripcion', producto.descripcion);
  formData.append('precioUnitario', String(producto.precioUnitario));
  formData.append('margenGanancia', String(producto.margenGanancia));

  if (producto.foto) {
    formData.append('foto', producto.foto);
  }

  if (producto.eliminarFoto !== undefined) {
    formData.append('eliminarFoto', String(producto.eliminarFoto));
  }

  const { data } = await clienteApi.patch(`/productos/${productoId}`, formData);

  return data;
}

export async function eliminarProducto(productoId: number): Promise<void> {
  await clienteApi.delete(`/productos/${productoId}`);
}
