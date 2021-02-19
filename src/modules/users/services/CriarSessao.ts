import { sign } from 'jsonwebtoken';
import autorizacaoConfig from '@config/autenticacao';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import Usuario from '../infra/typeorm/entities/User';

interface IPedido {
  email: string;
  password: string;
}

interface IResposta {
  usuario: Usuario; // usuario do tipo Usuario do model usuario
  token: string;
}

@injectable()
class AutenticacaoUser {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IPedido): Promise<IResposta> {
    const usuario = await this.usersRepository.findByEmail(email);

    if (!usuario) {
      throw new AppError('Email ou password errados', 401);
    }

    const passwordBateu = await this.hashProvider.compareHash(
      password,
      usuario.password
    ); // metodo bcrypt para comparar password normal com o criptografado do banco

    if (!passwordBateu) {
      throw new AppError('Email ou password errados', 401);
    }

    const { secret, expiresIn } = autorizacaoConfig.jwt;

    const token = sign({}, secret, {
      subject: usuario.id,
      expiresIn,
    });

    return { usuario, token };
  }
}

export default AutenticacaoUser;
