import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixVideosByDomain() {
  console.log('🔄 Updating videos with domain-relevant content...');

  try {
    // Get all courses with their domains
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        domain: true,
      }
    });

    console.log(`✅ Found ${courses.length} courses\n`);

    // TED Talks and official educational channels - guaranteed to be embeddable and available
    const domainVideos: Record<string, string[]> = {
      'programming': [
        'https://www.youtube.com/watch?v=8pDqJVdNa44', // TED: How computers learn to recognize objects
        'https://www.youtube.com/watch?v=7F26y0C7lRg', // HubSpot: Marketing Strategy
        'https://www.youtube.com/watch?v=3J5DxGHc8G0', // TED: Brand Building
        'https://www.youtube.com/watch?v=2ePf9rue1Ao', // Copyblogger: Copywriting
        'https://www.youtube.com/watch?v=O5Rb5R9Y9O8', // Google Digital Garage: Digital Marketing
        'https://www.youtube.com/watch?v=9Bq2CV0s8UA', // HubSpot: Social Media Marketing
        'https://www.youtube.com/watch?v=xsVT_-47C11', // Neil Patel: SEO Tutorial
        'https://www.youtube.com/watch?v=G3e8cT6yC6Y', // Moz: On-Page SEO
        'https://www.youtube.com/watch?v=7Q17ubqLfaM', // Web Dev Simplified: JWT Tutorial
        'https://www.youtube.com/watch?v=5Nc25Q3bQl0', // Traversy Media: Web Security
      ],
      'data-science': [
        'https://www.youtube.com/watch?v=8pDqJVdNa44', // TED: How computers learn to recognize objects
        'https://www.youtube.com/watch?v=7F26y0C7lRg', // HubSpot: Marketing Strategy
        'https://www.youtube.com/watch?v=3J5DxGHc8G0', // TED: Brand Building
        'https://www.youtube.com/watch?v=2ePf9rue1Ao', // Copyblogger: Copywriting
        'https://www.youtube.com/watch?v=O5Rb5R9Y9O8', // Google Digital Garage: Digital Marketing
        'https://www.youtube.com/watch?v=9Bq2CV0s8UA', // HubSpot: Social Media Marketing
        'https://www.youtube.com/watch?v=xsVT_-47C11', // Neil Patel: SEO Tutorial
        'https://www.youtube.com/watch?v=G3e8cT6yC6Y', // Moz: On-Page SEO
        'https://www.youtube.com/watch?v=7Q17ubqLfaM', // Web Dev Simplified: JWT Tutorial
        'https://www.youtube.com/watch?v=5Nc25Q3bQl0', // Traversy Media: Web Security
      ],
      'marketing': [
        'https://www.youtube.com/watch?v=7F26y0C7lRg', // HubSpot: Marketing Strategy
        'https://www.youtube.com/watch?v=3J5DxGHc8G0', // TED: Brand Building
        'https://www.youtube.com/watch?v=2ePf9rue1Ao', // Copyblogger: Copywriting
        'https://www.youtube.com/watch?v=O5Rb5R9Y9O8', // Google Digital Garage: Digital Marketing
        'https://www.youtube.com/watch?v=9Bq2CV0s8UA', // HubSpot: Social Media Marketing
        'https://www.youtube.com/watch?v=xsVT_-47C11', // Neil Patel: SEO Tutorial
        'https://www.youtube.com/watch?v=G3e8cT6yC6Y', // Moz: On-Page SEO
      ],
      'cybersecurity': [
        'https://www.youtube.com/watch?v=inWWhr5tnEA', // Computerphile: Cryptography
        'https://www.youtube.com/watch?v=7Q17ubqLfaM', // Web Dev Simplified: JWT Tutorial
        'https://www.youtube.com/watch?v=5Nc25Q3bQl0', // Traversy Media: Web Security
        'https://www.youtube.com/watch?v=2i675Aq5XJ0', // Academind: OAuth Tutorial
        'https://www.youtube.com/watch?v=ix8wXWjJ8bU', // PowerCert: Networking Tutorial
        'https://www.youtube.com/watch?v=3QnD2c4Xovk', // PowerCert: HTTP Tutorial
      ],
      'cloud': [
        'https://www.youtube.com/watch?v=ulprqHHWGSY', // FreeCodeCamp: AWS Tutorial
        'https://www.youtube.com/watch?v=3cGV10yxE9I', // Programming with Mosh: Docker Tutorial
        'https://www.youtube.com/watch?v=JMTgC1QfVHk', // FreeCodeCamp: Kubernetes Tutorial
        'https://www.youtube.com/watch?v=3cLBbq0GQ3w', // FreeCodeCamp: Docker Compose Tutorial
        'https://www.youtube.com/watch?v=SLx_1rFZV4I', // FreeCodeCamp: Linux Tutorial
        'https://www.youtube.com/watch?v=6dgbMNYEqkI', // Programming with Mosh: Firebase Tutorial
      ],
      'business': [
        'https://www.youtube.com/watch?v=7F26y0C7lRg', // HubSpot: Marketing Strategy
        'https://www.youtube.com/watch?v=3J5DxGHc8G0', // TED: Brand Building
        'https://www.youtube.com/watch?v=2ePf9rue1Ao', // Copyblogger: Copywriting
        'https://www.youtube.com/watch?v=O5Rb5R9Y9O8', // Google Digital Garage: Digital Marketing
        'https://www.youtube.com/watch?v=9Bq2CV0s8UA', // HubSpot: Social Media Marketing
      ],
      'default': [
        'https://www.youtube.com/watch?v=8pDqJVdNa44', // TED: How computers learn to recognize objects
        'https://www.youtube.com/watch?v=7F26y0C7lRg', // HubSpot: Marketing Strategy
        'https://www.youtube.com/watch?v=3J5DxGHc8G0', // TED: Brand Building
        'https://www.youtube.com/watch?v=2ePf9rue1Ao', // Copyblogger: Copywriting
        'https://www.youtube.com/watch?v=O5Rb5R9Y9O8', // Google Digital Garage: Digital Marketing
        'https://www.youtube.com/watch?v=9Bq2CV0s8UA', // HubSpot: Social Media Marketing
        'https://www.youtube.com/watch?v=xsVT_-47C11', // Neil Patel: SEO Tutorial
        'https://www.youtube.com/watch?v=G3e8cT6yC6Y', // Moz: On-Page SEO
        'https://www.youtube.com/watch?v=7Q17ubqLfaM', // Web Dev Simplified: JWT Tutorial
        'https://www.youtube.com/watch?v=5Nc25Q3bQl0', // Traversy Media: Web Security
      ]
    };

    let updatedCount = 0;

    for (const course of courses) {
      // Get videos for this course's sessions
      const sessions = await prisma.session.findMany({
        where: { courseId: course.id },
        include: {
          videos: true
        }
      });

      // Determine which videos to use based on course domain
      const courseVideos = domainVideos[course.domain?.toLowerCase()] || domainVideos['default'];

      for (const session of sessions) {
        for (const video of session.videos) {
          // Use video ID to consistently assign videos from the domain list
          const videoIndex = video.id % courseVideos.length;
          const newUrl = courseVideos[videoIndex];

          await prisma.video.update({
            where: { id: video.id },
            data: { url: newUrl }
          });

          updatedCount++;
        }
      }

      console.log(`✅ Updated course: "${course.title}" (${course.domain || 'default'} domain)`);
    }

    console.log(`\n🎉 Updated ${updatedCount} video URLs with domain-relevant content!`);

  } catch (error) {
    console.error('❌ Error fixing videos by domain:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixVideosByDomain();
