import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeCertificate() {
  // List all certificates to identify which one to remove
  const certificates = await prisma.certificate.findMany({
    include: {
      user: true,
      course: true,
    },
  });

  console.log('=== All Certificates ===');
  certificates.forEach((cert) => {
    console.log(`ID: ${cert.id}`);
    console.log(`User: ${cert.user.firstName} ${cert.user.lastName}`);
    console.log(`Course: ${cert.course.title}`);
    console.log(`Certificate #: ${cert.certificateNumber}`);
    console.log(`Issued At: ${cert.issuedAt}`);
    console.log('---');
  });

  // Remove certificate with specific ID (you can change this ID)
  const certificateIdToRemove = 1; // Change this to the ID you want to remove
  
  try {
    await prisma.certificate.delete({
      where: { id: certificateIdToRemove },
    });
    console.log(`Certificate with ID ${certificateIdToRemove} has been removed successfully.`);
  } catch (error) {
    console.error(`Failed to remove certificate with ID ${certificateIdToRemove}:`, error);
  }
}

removeCertificate()
  .then(() => {
    console.log('Script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
