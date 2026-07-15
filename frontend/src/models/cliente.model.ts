export interface Cliente {
  codigoCliente: number;
  nombreCliente: string;
  direccionCliente: string;
  telefonoCliente: string;
}

export interface ClienteDTO {
  nombreCliente: string;
  direccionCliente: string;
  telefonoCliente: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
