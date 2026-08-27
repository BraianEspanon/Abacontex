import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../ui/Button';
import SelectorProductoPedido from './SelectorProductoPedido';
import TablaProductosPedido from './TablaProductosPedido';

import type { CrearPedidoRequest, ProductoPedidoSeleccionado } from '../../types/pedido.types';
import type { ProductoListado } from '../../types/producto.types';

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

const MAX_NOMBRE_CLIENTE = 100;

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

    const nombreNormalizado = clienteNombre.trim();
    const mailNormalizado = clienteMail.trim();

    if (!nombreNormalizado) {
      nuevosErrores.clienteNombre = 'El nombre del cliente es obligatorio.';
    } else if (nombreNormalizado.length > MAX_NOMBRE_CLIENTE) {
      nuevosErrores.clienteNombre = `El nombre del cliente no puede superar los ${MAX_NOMBRE_CLIENTE} caracteres.`;
    }

    if (!mailNormalizado) {
      nuevosErrores.clienteMail = 'El correo electrónico es obligatorio.';
    } else if (!EMAIL_REGEX.test(mailNormalizado)) {
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
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* =====================================================
          DATOS DEL CLIENTE
      ====================================================== */}

      <section className="px-5 py-4">
        <h2 className="text-lg font-semibold text-[#496647]">Datos del cliente</h2>

        <div className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
          {/* Nombre */}
          <div>
            <label
              htmlFor="clienteNombre"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Nombre <span className="text-red-500">*</span>
            </label>

            <input
              id="clienteNombre"
              type="text"
              maxLength={MAX_NOMBRE_CLIENTE}
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
              className={[
                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                errores.clienteNombre
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#496647] focus:ring-2 focus:ring-[#496647]/20',
              ].join(' ')}
            />

            <div className="mt-1 flex items-start justify-between gap-3">
              <div>
                {errores.clienteNombre && (
                  <p className="text-xs text-red-600">{errores.clienteNombre}</p>
                )}
              </div>

              <span className="shrink-0 text-[11px] text-gray-400">
                {clienteNombre.length}/{MAX_NOMBRE_CLIENTE}
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="clienteMail" className="mb-1.5 block text-sm font-medium text-gray-700">
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
              className={[
                'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
                errores.clienteMail
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#496647] focus:ring-2 focus:ring-[#496647]/20',
              ].join(' ')}
            />

            {errores.clienteMail && (
              <p className="mt-1 text-xs text-red-600">{errores.clienteMail}</p>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTOS
      ====================================================== */}

      <section className="border-t border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-[#496647]">Productos del pedido</h2>

        <div className="mt-3">
          <SelectorProductoPedido
            productosSeleccionadosIds={productos.map((producto) => producto.id)}
            onAgregarProducto={agregarProducto}
          />
        </div>

        {errores.productos && <p className="mt-1.5 text-xs text-red-600">{errores.productos}</p>}

        {/* Tabla / estado vacío */}
        <div className="mt-4">
          <TablaProductosPedido
            productos={productos}
            onCambiarCantidad={cambiarCantidad}
            onEliminarProducto={eliminarProducto}
          />
        </div>

        {/* Resumen */}
        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-[280px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total de productos</span>

              <span className="font-medium text-gray-800">{productos.length}</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal estimado</span>

              <span className="font-semibold text-gray-900">{formatearMoneda(totalEstimado)}</span>
            </div>

            <div className="mt-2 border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estado inicial</span>

                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
                  Pendiente
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACCIONES
      ====================================================== */}

      <footer className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          label="Cancelar"
          variant="outline"
          onClick={onCancelar}
          disabled={enviando}
          className="!rounded-lg !px-5 !py-2 !text-sm"
        />

        <Button
          type="submit"
          label={enviando ? 'Registrando...' : 'Registrar pedido'}
          variant="solid"
          disabled={enviando}
          icon={<Pencil className="h-4 w-4" />}
          className="!rounded-lg !px-5 !py-2 !text-sm"
        />
      </footer>
    </form>
  );
}
