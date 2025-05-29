import { User } from '../../domain/entities/user';
import { Email, Password } from '../../domain/entities/value-objects';
import { UserRepository } from '../../domain/repositories/user-repository';
import { UserDomainService } from '../../domain/services/user-domain-service';
import { CreateUserDto, UserResponseDto } from '../dtos/user-dtos';

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userDomainService: UserDomainService
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const email = new Email(dto.email);
    
    const isEmailUnique = await this.userDomainService.isEmailUnique(email);
    if (!isEmailUnique) {
      throw new Error('Email already exists');
    }

    const password = new Password(dto.password);
    const user = User.create({
      name: dto.name,
      email,
      password,
    });

    await this.userRepository.save(user);

    return this.toResponseDto(user);
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id.getValue(),
      name: user.name,
      email: user.email.getValue(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
