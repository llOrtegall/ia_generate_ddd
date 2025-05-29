import { UserId, Email, Password } from './value-objects';

export interface UserProps {
  id?: UserId;
  name: string;
  email: Email;
  password: Password;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    const id = new UserId(crypto.randomUUID());
    return new User({
      ...props,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): UserId {
    return this.props.id!;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  updateName(newName: string): void {
    this.props.name = newName;
    this.props.updatedAt = new Date();
  }

  updatePassword(newPassword: Password): void {
    this.props.password = newPassword;
    this.props.updatedAt = new Date();
  }

  toPlainObject() {
    return {
      id: this.id.getValue(),
      name: this.name,
      email: this.email.getValue(),
      password: this.password.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
