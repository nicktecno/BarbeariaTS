import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import Usuario from '../infra/typeorm/entities/User';

interface Pedido {
  nome: string;
  email: string;
  password: string;
}

@injectable()
class CriarUsuario {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ nome, email, password }: Pedido): Promise<Usuario> {
    const ChecarUsuarioExistente = await this.UsersRepository.findByEmail(
      email
    ); // busca o email dentro do email do BD porem esta escrito email por causa do short hand
    if (ChecarUsuarioExistente) {
      throw new AppError('Este email já está sendo usado');
    }

    const criptoPassword = await this.hashProvider.generateHash(password);

    const usuario = await this.UsersRepository.create({
      nome,
      email,
      password: criptoPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return usuario;
  }
}

export default CriarUsuario;
