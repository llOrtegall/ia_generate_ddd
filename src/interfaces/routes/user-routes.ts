import { Router } from 'express';
import { UserController } from '../controllers/user-controller';

export class UserRoutes {
  private router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', (req, res) => this.userController.createUser(req, res));
    this.router.get('/:id', (req, res) => this.userController.getUser(req, res));
    this.router.get('/', (req, res) => this.userController.getAllUsers(req, res));
  }

  getRouter(): Router {
    return this.router;
  }
}
