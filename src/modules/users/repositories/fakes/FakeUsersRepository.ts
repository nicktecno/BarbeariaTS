import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';
import { v4 } from 'uuid';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import Usuario from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: Usuario[] = [];

  public async findByID(id: string): Promise<Usuario | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<Usuario | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<Usuario[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }
    return users;
  }

  public async create(userData: ICreateUsersDTO): Promise<Usuario> {
    const user = new Usuario();

    Object.assign(user, { id: v4() }, userData);
    this.users.push(user);

    return user;
  }

  public async save(user: Usuario): Promise<Usuario> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
