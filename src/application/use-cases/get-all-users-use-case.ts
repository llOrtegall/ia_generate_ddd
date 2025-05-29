import { UserRepository } from '../../domain/repositories/user-repository';
import { UserResponseDto } from '../dtos/user-dtos';

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    
    return users.map(user => ({
      id: user.id.getValue(),
      name: user.name,
      email: user.email.getValue(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
