import { useMemo, useState } from 'react';

import SelectorProductoPedido from './SelectorProductoPedido';
import TablaProductosPedido from './TablaProductosPedido';

import type { ProductoListado } from '../../types/producto.types';
import type { CrearPedidoRequest, ProductoPedidoSeleccionado } from '../../types/pedido.types';

interface RegistrarPedidoFormProps {
  enviando: boolean;
  onCancelar: () => void;
  onRegistrar: (payload: CrearPedidoRequest) => void;
}

interface ErroresFormulario {
  clienteNombre?: string;
  clienteMail?: string;
  productos?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(valor);
};

export default function RegistrarPedidoForm({
  enviando,
  onCancelar,
  onRegistrar,
}: RegistrarPedidoFormProps) {
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteMail, setClienteMail] = useState('');
  const [productos, setProductos] = useState<ProductoPedidoSeleccionado[]>([]);
  const [errores, setErrores] = useState<ErroresFormulario>({});

  const totalEstimado = useMemo(
    () =>
      productos.reduce((total, producto) => total + producto.precioVenta * producto.cantidad, 0),
    [productos]
  );

  const agregarProducto = (producto: ProductoListado) => {
    if (productos.some((item) => item.id === producto.id)) {
      return;
    }

    setProductos((actuales) => [
      ...actuales,
      {
        id: producto.id,
        nombre: producto.nombre,
        fotoUrl: producto.fotoUrl,
        precioVenta: producto.precioVenta,
        stock: producto.stock,
        cantidad: 1,
      },
    ]);

    setErrores((actuales) => ({
      ...actuales,
      productos: undefined,
    }));
  };

  const cambiarCantidad = (productoId: number, cantidad: number) => {
    setProductos((actuales) =>
      actuales.map((producto) =>
        producto.id === productoId
          ? {
              ...producto,
              cantidad,
            }
          : producto
      )
    );
  };

  const eliminarProducto = (productoId: number) => {
    setProductos((actuales) => actuales.filter((producto) => producto.id !== productoId));
  };

  const validar = () => {
    const nuevosErrores: ErroresFormulario = {};

    if (!clienteNombre.trim()) {
      nuevosErrores.clienteNombre = 'El nombre del cliente es obligatorio.';
    }

    if (!clienteMail.trim()) {
      nuevosErrores.clienteMail = 'El correo electrónico es obligatorio.';
    } else if (!EMAIL_REGEX.test(clienteMail.trim())) {
      nuevosErrores.clienteMail = 'Ingresá un correo electrónico válido.';
    }

    if (productos.length === 0) {
      nuevosErrores.productos = 'Debés agregar al menos un producto al pedido.';
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validar()) {
      return;
    }

    onRegistrar({
      clienteNombre: clienteNombre.trim(),
      clienteMail: clienteMail.trim(),
      productos: productos.map((producto) => ({
        productoId: producto.id,
        cantidad: producto.cantidad,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <section className="p-6">
        <h2 className="text-lg font-semibold text-[#496647]">Datos del cliente</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="clienteNombre" className="mb-2 block text-sm font-medium text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>

            <input
              id="clienteNombre"
              type="text"
              maxLength={100}
              value={clienteNombre}
              onChange={(event) => {
                setClienteNombre(event.target.value);

                if (errores.clienteNombre) {
                  setErrores((actuales) => ({
                    ...actuales,
                    clienteNombre: undefined,
                  }));
                }
              }}
              placeholder="Ej.: María López"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#496647] focus:ring-2 focus:ring-[#496647]/20"
            />

            {errores.clienteNombre && (
              <p className="mt-1.5 text-xs text-red-600">{errores.clienteNombre}</p>
            )}
          </div>

          <div>
            <label htmlFor="clienteMail" className="mb-2 block text-sm font-medium text-gray-700">
              Correo electrónico <span className="text-red-500">*</span>
            </label>

            <input
              id="clienteMail"
              type="email"
              value={clienteMail}
              onChange={(event) => {
                setClienteMail(event.target.value);

                if (errores.clienteMail) {
                  setErrores((actuales) => ({
                    ...actuales,
                    clienteMail: undefined,
                  }));
                }
              }}
              placeholder="Ej.: marialopez@gmail.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#496647] focus:ring-2 focus:ring-[#496647]/20"
            />

            {errores.clienteMail && (
              <p className="mt-1.5 text-xs text-red-600">{errores.clienteMail}</p>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-[#496647]">Productos del pedido</h2>

        <div className="mt-5">
          <SelectorProductoPedido
            productosSeleccionadosIds={productos.map((producto) => producto.id)}
            onAgregarProducto={agregarProducto}
          />
        </div>

        {errores.productos && <p className="mt-2 text-xs text-red-600">{errores.productos}</p>}

        <div className="mt-6">
          <TablaProductosPedido
            productos={productos}
            onCambiarCantidad={cambiarCantidad}
            onEliminarProducto={eliminarProducto}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total de productos</span>
              <span>{productos.length}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total estimado</span>

              <span className="text-lg font-semibold text-gray-900">
                {formatearMoneda(totalEstimado)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Estado inicial</span>

              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                Pendiente
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onCancelar}
          disabled={enviando}
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={enviando}
          className="rounded-xl bg-[#496647] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d573c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? 'Registrando...' : 'Registrar pedido'}
        </button>
      </footer>
    </form>
  );
}
