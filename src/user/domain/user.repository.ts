import type { UserEntity } from './user.entity';

type NewUser = Omit<UserEntity, 'id'>

export interface UserRepository {
  findUserById(id: string): Promise<UserEntity | null>;

  registerNewUser({
    name,
    email,
    description,
  }: NewUser): Promise<UserEntity | null>;

  listAllUsers(): Promise<UserEntity[] | null>;
}
