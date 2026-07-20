import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async create(createCertificateDto: CreateCertificateDto) {
    const certificateNumber = this.generateCertificateNumber();
    const qrCode = this.generateQRCode(certificateNumber);

    return this.prisma.client.certificate.create({
      data: {
        ...createCertificateDto,
        certificateNumber,
        qrCode,
      },
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findAll() {
    return this.prisma.client.certificate.findMany({
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.client.certificate.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });
  }

  async findOne(id: number) {
    const certificate = await this.prisma.client.certificate.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
      },
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    return certificate;
  }

  async verifyByNumber(certificateNumber: string) {
    const certificate = await this.prisma.client.certificate.findUnique({
      where: { certificateNumber },
      include: {
        user: true,
        course: true,
      },
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with number ${certificateNumber} not found`);
    }

    return {
      isValid: true,
      certificate,
    };
  }

  async remove(id: number) {
    const certificate = await this.prisma.client.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    return this.prisma.client.certificate.delete({
      where: { id },
    });
  }

  private generateCertificateNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CERT-${timestamp}-${random}`.toUpperCase();
  }

  private generateQRCode(certificateNumber: string): string {
    // In production, use a QR code library like qrcode
    // For now, return a placeholder URL
    return `https://learnova.com/verify/${certificateNumber}`;
  }
}
