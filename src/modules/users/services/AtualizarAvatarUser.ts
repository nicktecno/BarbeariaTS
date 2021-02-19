import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import Usuario from '../infra/typeorm/entities/User';

interface IRequest {
  usuario_id: string;
  avatarFilename: string;
}

@injectable()
class AtualizarAvatarUser {
  constructor(
    @inject('UsersRepository')
    private repositorioUsuarios: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({
    usuario_id,
    avatarFilename,
  }: IRequest): Promise<Usuario> {
    const usuario = await this.repositorioUsuarios.findByID(usuario_id);

    if (!usuario) {
      throw new AppError(
        'Apenas usuarios autenticados podem mudar o avatar',
        401
      );
    }
    if (usuario.avatar) {
      // Deletar avatar anterior
      await this.storageProvider.deleteFile(usuario.avatar);
    }
    const filename = await this.storageProvider.saveFile(avatarFilename);

    usuario.avatar = filename;
    await this.repositorioUsuarios.save(usuario);

    return usuario;
  }
}

export default AtualizarAvatarUser;
