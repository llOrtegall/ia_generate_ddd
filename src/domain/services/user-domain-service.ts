import { Email } from '../entities/value-objects';
import { UserRepository } from '../repositories/user-repository';

export class UserDomainService {
  constructor(private userRepository: UserRepository) {}

  async isEmailUnique(email: Email): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser === null;
  }
}
