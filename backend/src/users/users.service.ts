import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from './user.entity';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';

const BCRYPT_ROUNDS = 10;

const seedUsers: User[] = [
  {
    id: 'admin-seed-001',
    name: 'פנחס שינפלד',
    email: 'p28497@gmail.com',
    passwordHash: bcrypt.hashSync('123456', BCRYPT_ROUNDS),
    role: 'admin',
  },
  {
    id: 'user-seed-001',
    name: 'Jane Doe',
    email: 'jane@example.com',
    passwordHash: bcrypt.hashSync('Password1!', BCRYPT_ROUNDS),
    role: 'user',
  },
];

@Injectable()
export class UsersService {
  private users: User[] = [...seedUsers];

  findAll(): Omit<User, 'passwordHash'>[] {
    return this.users.map(({ passwordHash: _, ...safe }) => safe);
  }

  findById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  async create(
    name: string,
    email: string,
    password: string,
    role: UserRole = 'user',
  ): Promise<Omit<User, 'passwordHash'>> {
    if (this.findByEmail(email)) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user: User = { id: uuidv4(), name, email, passwordHash, role };
    this.users.push(user);
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async updateSelf(
    id: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email && this.findByEmail(dto.email)) {
      throw new ConflictException('Email already in use');
    }

    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async adminUpdate(
    id: string,
    dto: AdminUpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email && this.findByEmail(dto.email)) {
      throw new ConflictException('Email already in use');
    }

    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    if (dto.role) user.role = dto.role;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
