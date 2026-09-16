import { getPrismaClient, closePrismaClient } from '../src/prisma/prisma-client.factory';

const prisma = getPrismaClient();

function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${random}`.toUpperCase();
}

function generateQRCode(certificateNumber: string): string {
  // Simple QR code placeholder - in production you'd use a real QR library
  return `https://learnova.com/verify/${certificateNumber}`;
}

async function generateCertificateForUser() {
  const userId = 3; // User ID from logs
  const courseId = 201; // Course ID from logs

  console.log('=== CERTIFICATE GENERATION SCRIPT ===');
  console.log('User ID:', userId);
  console.log('Course ID:', courseId);

  try {
    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: { userId, courseId },
    });

    if (existingCertificate) {
      console.log('Certificate already exists:', existingCertificate);
      return;
    }

    // Check if user passed the final exam
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { quizzes: true },
    });

    if (!course) {
      console.error('Course not found');
      return;
    }

    const examQuiz = course.quizzes.find((q) => q.isExamMode);
    
    if (!examQuiz) {
      console.error('No exam quiz found for this course');
      return;
    }

    const examPassed = await prisma.quizAttempt.findFirst({
      where: { userId, quizId: examQuiz.id, passed: true },
    });

    if (!examPassed) {
      console.error('User has not passed the final exam yet');
      return;
    }

    console.log('User passed the final exam:', examPassed);

    // Generate certificate directly
    const certificateNumber = generateCertificateNumber();
    const qrCode = generateQRCode(certificateNumber);

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateNumber,
        qrCode,
      },
      include: {
        user: true,
        course: true,
      },
    });

    console.log('✅ Certificate generated successfully:', certificate);
  } catch (error) {
    console.error('❌ Error generating certificate:', error);
  } finally {
    await closePrismaClient();
  }
}

generateCertificateForUser();
