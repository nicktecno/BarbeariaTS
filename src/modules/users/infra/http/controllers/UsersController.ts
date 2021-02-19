import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CriarUsuarios from '@modules/users/services/CriarUsuarios';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { nome, email, password } = request.body;

    const criarUsuario = container.resolve(CriarUsuarios);

    const usuario = await criarUsuario.execute({
      nome,
      email,
      password,
    });

    return response.json(classToClass(usuario));
  }
}
