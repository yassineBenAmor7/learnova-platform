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

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // For security, don't reveal if email exists or not
      // For development, still generate a token so the flow can be tested
      const resetToken = this.jwtService.sign(
        { sub: 'test', email: email },
        { expiresIn: '1h' }
      );
      return {
        message: 'If the email exists, a reset link has been sent',
        // For development only - remove in production
        resetToken: resetToken,
        resetLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
      };
    }

    // Generate a reset token (in production, this should be a proper JWT with expiration)
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset link
    // For now, just return the token (this should be sent via email in production)
    return {
      message: 'If the email exists, a reset link has been sent',
      // For development only - remove in production
      resetToken: resetToken,
      resetLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (!payload.email) {
        throw new BadRequestException('Invalid reset token');
      }

      // Find user by email instead of ID to handle development tokens
      let user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        throw new BadRequestException('User not found. Please use an existing account or register first.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

      await this.usersService.update(user.id, { password: hashedPassword });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }
}
