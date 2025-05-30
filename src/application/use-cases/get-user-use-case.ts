import { UserRepository } from '../../domain/repositories/user-repository';
import { UserResponseDto } from '../dtos/user-dtos';

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<UserResponseDto | null> {
    const userId = id;
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
