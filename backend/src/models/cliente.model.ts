export interface Cliente {
  codigoCliente: number;
  nombreCliente: string;
  direccionCliente: string;
  telefonoCliente: string;
}

export interface ClienteDTO {
  codigoCliente?: number;
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

export type CreateClienteDTO = Omit<Cliente, 'codigoCliente'>;

export type UpdateClienteDTO = Partial<Omit<Cliente, 'codigoCliente'>>;
