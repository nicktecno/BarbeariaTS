import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import verificarAutenticacao from '@modules/users/infra/http/middlewares/VerificarAutenticacao';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentController';

const agendamentosRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

agendamentosRouter.use(verificarAutenticacao);

agendamentosRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      prestador_id: Joi.string().uuid().required(),
      data: Joi.date(),
    },
  }),
  appointmentsController.create
);
agendamentosRouter.get('/me', providerAppointmentsController.index);

export default agendamentosRouter;
