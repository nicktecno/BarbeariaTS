import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';
import UserAvatarController from '../controllers/UserAvatarController';

import UsersController from '../controllers/UsersController';

import VerificarAutenticacao from '../middlewares/VerificarAutenticacao';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const upload = multer(uploadConfig.multer);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      nome: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
    },
  }),
  usersController.create
);

usersRouter.patch(
  '/avatar',
  VerificarAutenticacao,
  upload.single('avatar'),
  userAvatarController.update
);

export default usersRouter;
