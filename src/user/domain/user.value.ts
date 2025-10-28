import type { UserEntity } from './user.entity';
import { v4 as uuid } from 'uuid';

export class UserValue implements UserEntity {
  id: string;
  name: string;
  email: string;
  description: string;

  constructor({
    name,
    email,
    description,
  }: { name: string; email: string; description: string | undefined}) {
    this.id = uuid();
    this.name = name;
    this.email = email;
    this.description = description ?? 'default';
  }
}
