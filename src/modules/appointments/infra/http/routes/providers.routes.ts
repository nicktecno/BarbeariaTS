import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import verificarAutenticacao from '@modules/users/infra/http/middlewares/VerificarAutenticacao';
import ProvidersController from '../controllers/ProvidersController';
import ProvidersMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();

const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProvidersMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(verificarAutenticacao);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:prestador_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      prestador_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.index
);
providersRouter.get(
  '/:prestador_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      prestador_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityController.index
);
providersRouter.get('/:id/day-availability', providersController.index);

export default providersRouter;
