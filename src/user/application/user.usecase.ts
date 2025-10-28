import type { UserRepository } from '../domain/user.repository';
import { UserValue } from '../domain/user.value';

export class UserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  public async registerUser(name: string, email: string, description: string) {
    const userValue = new UserValue({ name, email, description }); 
    const userCreated = await this.userRepo.registerNewUser(userValue);
    return userCreated
  }
}
