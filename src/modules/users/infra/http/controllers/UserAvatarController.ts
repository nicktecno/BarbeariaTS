import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AtualizarAvatarUser from '@modules/users/services/AtualizarAvatarUser';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const atualizarAvatarUsuario = container.resolve(AtualizarAvatarUser);

    const usuario = await atualizarAvatarUsuario.execute({
      usuario_id: request.user.id, // user.id do hack da pasta @types que recebe o decoded do jwt
      avatarFilename: request.file.filename, // recebe do middleware do multer
    });

    return response.json(classToClass(usuario));
  }
}
