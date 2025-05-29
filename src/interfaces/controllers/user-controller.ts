import { Request, Response } from 'express';
import { CreateUserUseCase } from '@application/use-cases/create-user-use-case';
import { GetUserUseCase } from '@application/use-cases/get-user-use-case';
import { GetAllUsersUseCase } from '@application/use-cases/get-all-users-use-case';
import { CreateUserDtoSchema, UpdateUserDtoSchema } from '@application/dtos/user-dtos';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = CreateUserDtoSchema.parse(req.body);
      const user = await this.createUserUseCase.execute(validatedData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.execute();
      res.json(users);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}
