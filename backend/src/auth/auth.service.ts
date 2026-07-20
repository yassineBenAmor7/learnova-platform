import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';

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

    private jwtService: JwtService,
  ) {}

  async register(data: RegisterData) {
    const existingUser = await this.usersService.findByEmail(data.email);

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

    const user = await this.usersService.create({
      ...data,

      password: hashedPassword,
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

    return {
      access_token: token,
    };
  }
}
