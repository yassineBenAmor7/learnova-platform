import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificatesService.create(createCertificateDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyCertificates(@CurrentUser() user: { id: number }) {
    return this.certificatesService.findByUser(user.id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.certificatesService.findByUser(+userId);
  }

  // Public endpoint for QR code verification
  @Get('verify/:certificateNumber')
  verifyByNumber(@Param('certificateNumber') certificateNumber: string) {
    return this.certificatesService.verifyByNumber(certificateNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.certificatesService.remove(+id);
  }
}
