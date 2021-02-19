import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AutenticacaoUser from '@modules/users/services/CriarSessao';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const autenticacaoUser = container.resolve(AutenticacaoUser);

    const { usuario, token } = await autenticacaoUser.execute({
      email,
      password,
    });

    return response.json({ usuario: classToClass(usuario), token });
  }
}
