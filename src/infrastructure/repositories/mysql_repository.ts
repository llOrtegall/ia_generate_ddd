import { User } from '../../domain/entities/user';
import { Email, Password } from '../../domain/entities/value-objects';
import { UserRepository } from '../../domain/repositories/user-repository';
import { Database } from '../database/database';

export class SequelizeUserRepository implements UserRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async save(user: User): Promise<void> {
    const userData = user.toPlainObject();
    await this.db.User.create(userData);
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.db.User.findByPk(id);
    if (!userData) return null;

    return this.toDomainEntity(userData);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userData = await this.db.User.findOne({
      where: { email: email.getValue() }
    });
    if (!userData) return null;

    return this.toDomainEntity(userData);
  }

  async findAll(): Promise<User[]> {
    const usersData = await this.db.User.findAll();
    return usersData.map((userData: any): User => this.toDomainEntity(userData));
  }

  async delete(id: string): Promise<void> {
    await this.db.User.destroy({
      where: { id: id }
    });
  }

  private toDomainEntity(userData: any): User {
    return User.fromPersistence({
      id: userData.id,
      name: userData.name,
      email: new Email(userData.email),
      password: new Password(userData.password),
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }
}
