import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function regenerateCertificate() {
  console.log('🔄 Regenerating certificate for Agile course...');

  try {
    // Find the user Yassine Ben Amor
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'benamoryassine519@gmail.com' },
          { firstName: 'Yassine', lastName: 'Ben Amor' }
        ]
      }
    });

    if (!user) {
      console.error('❌ User Yassine Ben Amor not found. Please check the name or email.');
      console.log('Available users:');
      const allUsers = await prisma.user.findMany({ select: { id: true, firstName: true, lastName: true, email: true } });
      console.log(allUsers);
      return;
    }

    console.log(`✅ Found user: ${user.firstName} ${user.lastName} (${user.email})`);

    // Find the Agile course
    const course = await prisma.course.findFirst({
      where: { title: { contains: 'Agile' } }
    });

    if (!course) {
      console.error('❌ Agile course not found.');
      return;
    }

    console.log(`✅ Found course: ${course.title}`);

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: { userId: user.id, courseId: course.id }
    });

    if (existingCertificate) {
      console.log('⚠️ Certificate already exists. Deleting it first...');
      await prisma.certificate.delete({ where: { id: existingCertificate.id } });
    }

    // Generate certificate number
    const certificateNumber = `CERT-${Date.now()}-${user.id}-${course.id}`;
    
    // Generate QR code (placeholder URL)
    const qrCode = `https://learnova.com/verify/${certificateNumber}`;

    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        userId: user.id,
        courseId: course.id,
        certificateNumber,
        issuedAt: new Date(),
        qrCode
      }
    });

    console.log('✅ Certificate created successfully!');
    console.log(`Certificate Number: ${certificateNumber}`);
    console.log(`Issued At: ${certificate.issuedAt}`);
    console.log(`QR Code: ${qrCode}`);

    console.log('🎉 Certificate regeneration completed!');
  } catch (error) {
    console.error('❌ Error regenerating certificate:', error);
  } finally {
    await prisma.$disconnect();
  }
}

regenerateCertificate();
