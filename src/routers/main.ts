import { Router } from 'express';
import * as authRouterController from '../controllers/authRouter';
import * as employeesController from '../controllers/employeesRouter';


export const mainRouter = Router();

mainRouter.post('/auth', authRouterController.authRouter);

mainRouter.post('/employees', employeesController.createEmployee );

mainRouter.get('/employees', employeesController.getEmployees);

mainRouter.delete('/employees/:id', employeesController.deleteEmployee);

mainRouter.post('/criar-senha', employeesController.criarSenha);  // Rota para criação de senha


mainRouter.get('/', (req, res) => {
    res.send('API funcionando!');   
  });
