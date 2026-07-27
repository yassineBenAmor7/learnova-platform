/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.client.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.client.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(data: any) {
    return this.prisma.client.user.create({
      data,
    });
  }

  async update(id: number, data: any) {
    const { currentPassword, newPassword, ...updateData } = data;

    if (updateData.email) {
      const existingUser = await this.prisma.client.user.findUnique({
        where: { email: updateData.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Cet email est déjà utilisé par un autre compte');
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        throw new BadRequestException('Le mot de passe actuel est requis pour changer de mot de passe');
      }

      const user = await this.prisma.client.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new BadRequestException('Utilisateur introuvable');
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Le mot de passe actuel est incorrect');
      }

      const BCRYPT_SALT_ROUNDS = 10;
      updateData.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    }

    const updatedUser = await this.prisma.client.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
