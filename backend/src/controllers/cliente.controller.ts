import { Request, Response } from 'express';
import * as clienteRepository from '../persistence/cliente.repository';
import { Cliente, ClienteDTO, ApiResponse, CreateClienteDTO } from '../models/cliente.model';

type ValidationErrors = string[];

type RouteParams = { codigo: string };

const parseCodigo = (raw: string | string[]): number => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return parseInt(value, 10);
};

const validateCliente = (data: ClienteDTO, isUpdate = false): ValidationErrors => {
  const errors: ValidationErrors = [];

  if (!isUpdate || data.nombreCliente !== undefined) {
    if (!data.nombreCliente || data.nombreCliente.trim().length === 0) {
      errors.push('El nombre del cliente es requerido');
    } else if (data.nombreCliente.length > 100) {
      errors.push('El nombre del cliente no puede exceder 100 caracteres');
    }
  }

  if (!isUpdate || data.direccionCliente !== undefined) {
    if (!data.direccionCliente || data.direccionCliente.trim().length === 0) {
      errors.push('La dirección del cliente es requerida');
    } else if (data.direccionCliente.length > 200) {
      errors.push('La dirección del cliente no puede exceder 200 caracteres');
    }
  }

  if (!isUpdate || data.telefonoCliente !== undefined) {
    if (!data.telefonoCliente || data.telefonoCliente.trim().length === 0) {
      errors.push('El teléfono del cliente es requerido');
    } else if (data.telefonoCliente.length < 7 || data.telefonoCliente.length > 20) {
      errors.push('El teléfono debe tener entre 7 y 20 caracteres');
    } else if (!/^[0-9+\-\s()]+$/.test(data.telefonoCliente)) {
      errors.push('El teléfono solo puede contener números, espacios, guiones, paréntesis y el signo +');
    }
  }

  return errors;
};

export const getAllClientes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const clientes = await clienteRepository.findAll();
    const response: ApiResponse<Cliente[]> = {
      success: true,
      data: clientes,
    };
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener los clientes';
    const response: ApiResponse<never> = {
      success: false,
      error: message,
    };
    res.status(500).json(response);
  }
};

export const getClienteByCodigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const codigo = parseCodigo(req.params.codigo);
    if (isNaN(codigo)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'El código del cliente debe ser un número válido',
      };
      res.status(400).json(response);
      return;
    }

    const cliente = await clienteRepository.findByCodigo(codigo);
    if (!cliente) {
      const response: ApiResponse<never> = {
        success: false,
        error: `No se encontró el cliente con código ${codigo}`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Cliente> = {
      success: true,
      data: cliente,
    };
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener el cliente';
    const response: ApiResponse<never> = {
      success: false,
      error: message,
    };
    res.status(500).json(response);
  }
};

export const createCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombreCliente, direccionCliente, telefonoCliente } = req.body;
    const clienteData: ClienteDTO = { nombreCliente, direccionCliente, telefonoCliente };

    const validationErrors = validateCliente(clienteData);
    if (validationErrors.length > 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: validationErrors.join(', '),
      };
      res.status(400).json(response);
      return;
    }

    const newCliente: CreateClienteDTO = {
      nombreCliente: nombreCliente.trim(),
      direccionCliente: direccionCliente.trim(),
      telefonoCliente: telefonoCliente.trim(),
    };

    const cliente = await clienteRepository.create(newCliente);
    const response: ApiResponse<Cliente> = {
      success: true,
      data: cliente,
      message: 'Cliente creado exitosamente',
    };
    res.status(201).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear el cliente';
    const response: ApiResponse<never> = {
      success: false,
      error: message,
    };
    res.status(500).json(response);
  }
};

export const updateCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const codigo = parseCodigo(req.params.codigo);
    if (isNaN(codigo)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'El código del cliente debe ser un número válido',
      };
      res.status(400).json(response);
      return;
    }

    const existingCliente = await clienteRepository.findByCodigo(codigo);
    if (!existingCliente) {
      const response: ApiResponse<never> = {
        success: false,
        error: `No se encontró el cliente con código ${codigo}`,
      };
      res.status(404).json(response);
      return;
    }

    const { nombreCliente, direccionCliente, telefonoCliente } = req.body;
    const clienteData: ClienteDTO = { nombreCliente, direccionCliente, telefonoCliente };

    const validationErrors = validateCliente(clienteData, true);
    if (validationErrors.length > 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: validationErrors.join(', '),
      };
      res.status(400).json(response);
      return;
    }

    const updateData: Partial<CreateClienteDTO> = {};
    if (nombreCliente !== undefined) {
      updateData.nombreCliente = nombreCliente.trim();
    }
    if (direccionCliente !== undefined) {
      updateData.direccionCliente = direccionCliente.trim();
    }
    if (telefonoCliente !== undefined) {
      updateData.telefonoCliente = telefonoCliente.trim();
    }

    const cliente = await clienteRepository.update(codigo, updateData);
    if (!cliente) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Error al actualizar el cliente',
      };
      res.status(500).json(response);
      return;
    }

    const response: ApiResponse<Cliente> = {
      success: true,
      data: cliente,
      message: 'Cliente actualizado exitosamente',
    };
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el cliente';
    const response: ApiResponse<never> = {
      success: false,
      error: message,
    };
    res.status(500).json(response);
  }
};

export const deleteCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const codigo = parseCodigo(req.params.codigo);
    if (isNaN(codigo)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'El código del cliente debe ser un número válido',
      };
      res.status(400).json(response);
      return;
    }

    const existingCliente = await clienteRepository.findByCodigo(codigo);
    if (!existingCliente) {
      const response: ApiResponse<never> = {
        success: false,
        error: `No se encontró el cliente con código ${codigo}`,
      };
      res.status(404).json(response);
      return;
    }

    const deleted = await clienteRepository.remove(codigo);
    if (!deleted) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Error al eliminar el cliente',
      };
      res.status(500).json(response);
      return;
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Cliente eliminado exitosamente',
    };
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el cliente';
    const response: ApiResponse<never> = {
      success: false,
      error: message,
    };
    res.status(500).json(response);
  }
};
