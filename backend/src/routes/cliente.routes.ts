import { Router } from 'express';
import * as clienteController from '../controllers/cliente.controller';

const router = Router();

router.get('/', clienteController.getAllClientes);
router.get('/:codigo', clienteController.getClienteByCodigo);
router.post('/', clienteController.createCliente);
router.put('/:codigo', clienteController.updateCliente);
router.delete('/:codigo', clienteController.deleteCliente);

export default router;
