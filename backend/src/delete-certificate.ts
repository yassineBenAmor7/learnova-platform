import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteCertificate() {
  console.log('🔄 Deleting Agile Project Management & Scrum Framework certificate...');

  try {
    // Find the certificate by number
    const certificate = await prisma.certificate.findFirst({
      where: { 
        certificateNumber: 'CERT-1787751421779-3-22'
      }
    });

    if (!certificate) {
      console.error('❌ Certificate not found with number: CERT-1787751421779-3-22');
      return;
    }

    console.log(`✅ Found certificate: ${certificate.certificateNumber}`);
    console.log(`   User ID: ${certificate.userId}`);
    console.log(`   Course ID: ${certificate.courseId}`);
    console.log(`   Issued At: ${certificate.issuedAt}`);

    // Delete the certificate
    await prisma.certificate.delete({
      where: { id: certificate.id }
    });

    console.log('✅ Certificate deleted successfully!');
    console.log(`Certificate Number: ${certificate.certificateNumber}`);

    console.log('🎉 Certificate deletion completed!');
  } catch (error) {
    console.error('❌ Error deleting certificate:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteCertificate();
