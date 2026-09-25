export interface RubroCuenta {
  idRubro: number;
  nombre: string;
  descripcion?: string | null;
}

export interface TipoCuentaConRubros {
  idTipoCuenta: number;
  nombre: string;
  abreviatura: string;
  descripcion?: string | null;
  rubros: RubroCuenta[];
}

export interface CuentaContable {
  idCuenta: number;
  codigo: string;
  nombre: string;
  descripcion: string;

  rubro: {
    idRubro: number;
    nombre: string;

    tipoCuenta: {
      idTipoCuenta: number;
      nombre: string;
      abreviatura: string;
    };
  };
}

export interface CuentasResponse {
  items: CuentaContable[];

  page: number;
  pageSize: number;

  totalItems: number;
  totalPages: number;
}

export interface CuentasQueryParams {
  search?: string;
  idTipoCuenta?: number;
  idRubro?: number;

  page?: number;
  pageSize?: number;
}

export interface RegistrarCuentaRequest {
  codigo: string;
  nombre: string;
  idRubro: number;
  descripcion: string;
}

export interface EditarCuentaRequest {
  nombre: string;
  descripcion: string;
}
