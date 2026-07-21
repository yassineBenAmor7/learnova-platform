import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId?: number;
}

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterData) {
    const existingUser = await this.usersService.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé par un autre compte');
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

    // Assign default role (LEARNER) if not provided
    let roleId = data.roleId;
    if (!roleId) {
      // Get LEARNER role dynamically
      const learnerRole = await this.prisma.client.role.findUnique({
        where: { name: 'LEARNER' },
      });
      if (!learnerRole) {
        throw new BadRequestException('Le rôle LEARNER est introuvable. Veuillez exécuter le seed.');
      }
      roleId = learnerRole.id;
    }

    const user = await this.usersService.create({
      ...data,
      password: hashedPassword,
      roleId,
    });

    // Remove password from response for security
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'User created',
      user: userWithoutPassword,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,

      email: user.email,

      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }
}
