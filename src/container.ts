import { SequelizeUserRepository } from '@infrastructure/repositories/mysql_repository';
import { UserDomainService } from '@domain/services/user-domain-service';
import { CreateUserUseCase } from '@application/use-cases/create-user-use-case';
import { GetUserUseCase } from '@application/use-cases/get-user-use-case';
import { GetAllUsersUseCase } from '@application/use-cases/get-all-users-use-case';
import { UserController } from '@interfaces/controllers/user-controller';
import { UserRoutes } from '@interfaces/routes/user-routes';

export class Container {
  private static instance: Container;
  
  private _userRepository!: SequelizeUserRepository;
  private _userDomainService!: UserDomainService;
  private _createUserUseCase!: CreateUserUseCase;
  private _getUserUseCase!: GetUserUseCase;
  private _getAllUsersUseCase!: GetAllUsersUseCase;
  private _userController!: UserController;
  private _userRoutes!: UserRoutes;

  private constructor() {
    this.initializeDependencies();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeDependencies(): void {
    // Infrastructure
    this._userRepository = new SequelizeUserRepository();

    // Domain Services
    this._userDomainService = new UserDomainService(this._userRepository);

    // Use Cases
    this._createUserUseCase = new CreateUserUseCase(this._userRepository, this._userDomainService);
    this._getUserUseCase = new GetUserUseCase(this._userRepository);
    this._getAllUsersUseCase = new GetAllUsersUseCase(this._userRepository);

    // Controllers
    this._userController = new UserController(
      this._createUserUseCase,
      this._getUserUseCase,
      this._getAllUsersUseCase
    );

    // Routes
    this._userRoutes = new UserRoutes(this._userController);
  }

  get userRoutes(): UserRoutes {
    return this._userRoutes;
  }
}
