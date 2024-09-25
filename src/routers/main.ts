import { Router } from 'express';
import * as authRouterController from '../controllers/authRouter';

export const mainRouter = Router();

mainRouter.post('/auth', authRouterController.authRouter);

mainRouter.get('/', (req, res) => {
    res.send('API funcionando!');   
  });
