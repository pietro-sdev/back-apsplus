import { Router } from 'express';
import * as authRouterController from '../controllers/authRouter';
import * as employeesController from '../controllers/employeesRouter';
import * as patientsController from '../controllers/patientsRouter';

export const mainRouter = Router();

mainRouter.post('/auth', authRouterController.authRouter);

// Rotas para employees
mainRouter.post('/employees', employeesController.createEmployee);
mainRouter.get('/employees', employeesController.getEmployees);
mainRouter.delete('/employees/:id', employeesController.deleteEmployee);
mainRouter.get('/download/employees', employeesController.downloadEmployeesCSV);

// Rotas para patients
mainRouter.post('/patients', patientsController.createPatient);
mainRouter.get('/patients', patientsController.getPatients);
mainRouter.delete('/patients/:id', patientsController.deletePatient);
mainRouter.get('/download/patients', patientsController.downloadPatientsCSV);

mainRouter.get('/', (req, res) => {
  res.send('API funcionando!');
});
