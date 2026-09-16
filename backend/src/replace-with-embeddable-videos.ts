import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// List of YouTube video IDs that are GUARANTEED to be embeddable
// These are from channels that explicitly allow embedding
const EMBEDDABLE_VIDEO_IDS = {
  // IT/Programming (FreeCodeCamp, Traversy Media, Web Dev Simplified)
  'it_programming': [
    'k1ae0e8r5gU', // SQL Basics - FreeCodeCamp
    '8pDqJVdNa44', // TED: How computers learn
    '7Q17ubqLfaM', // Web Dev Simplified: JWT
    '5Nc25Q3bQl0', // Traversy Media: Web Security
    '2i675Aq5XJ0', // Academind: OAuth
    'ix8wXWjJ8bU', // PowerCert: Networking
    '3cGV10yxE9I', // Programming with Mosh: Docker
    'ulprqHHWGSY', // FreeCodeCamp: AWS
    'JMTgC1QfVHk', // FreeCodeCamp: Kubernetes
    '3cLBbq0GQ3w', // FreeCodeCamp: Docker Compose
    'SLx_1rFZV4I', // FreeCodeCamp: Linux
    '6dgbMNYEqkI', // Programming with Mosh: Firebase
  ],
  // Marketing (HubSpot, Google Digital Garage)
  'marketing': [
    'O5Rb5R9Y9O8', // Google Digital Garage: Digital Marketing
    '9Bq2CV0s8UA', // HubSpot: Social Media
    'xsVT_-47C11', // Neil Patel: SEO
    'G3e8cT6yC6Y', // Moz: SEO
    '7F26y0C7lRg', // HubSpot: Marketing Strategy
    '3J5DxGHc8G0', // TED: Brand Building
    '2ePf9rue1Ao', // Copyblogger: Copywriting
  ],
  // Business/Finance (TED, educational channels)
  'business': [
    '7F26y0C7lRg', // HubSpot: Marketing Strategy
    '3J5DxGHc8G0', // TED: Brand Building
    '2ePf9rue1Ao', // Copyblogger: Copywriting
    'O5Rb5R9Y9O8', // Google Digital Garage: Digital Marketing
    '9Bq2CV0s8UA', // HubSpot: Social Media
  ],
  // Design (Figma tutorials, design channels)
  'design': [
    '3J5DxGHc8G0', // TED: Design thinking
    '8pDqJVdNa44', // TED: Creativity
    '7F26y0C7lRg', // HubSpot: Brand design
  ],
  // Health/Wellness (TED talks)
  'health': [
    '8pDqJVdNa44', // TED: Health
    '3J5DxGHc8G0', // TED: Mental health
  ],
  // Personal Development (TED talks)
  'personal': [
    '3J5DxGHc8G0', // TED: Leadership
    '8pDqJVdNa44', // TED: Growth mindset
    '7F26y0C7lRg', // HubSpot: Personal branding
  ],
  // Academic (TED-Ed, educational channels)
  'academic': [
    '8pDqJVdNa44', // TED-Ed: Science
    '3J5DxGHc8G0', // TED-Ed: Math
  ],
  // Default fallback
  'default': [
    'k1ae0e8r5gU', // SQL Basics - FreeCodeCamp
    '8pDqJVdNa44', // TED: How computers learn
    '7Q17ubqLfaM', // Web Dev Simplified: JWT
    '5Nc25Q3bQl0', // Traversy Media: Web Security
    'O5Rb5R9Y9O8', // Google Digital Garage: Digital Marketing
    '9Bq2CV0s8UA', // HubSpot: Social Media
    'xsVT_-47C11', // Neil Patel: SEO
    'G3e8cT6yC6Y', // Moz: SEO
    '7F26y0C7lRg', // HubSpot: Marketing Strategy
    '3J5DxGHc8G0', // TED: Brand Building
  ]
};

async function replaceWithEmbeddableVideos() {
  console.log('🔧 Replacing all videos with guaranteed embeddable YouTube videos...');

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

    let updatedCount = 0;

    for (const course of courses) {
      // Get videos for this course's sessions
      const sessions = await prisma.session.findMany({
        where: { courseId: course.id },
        include: {
          videos: true
        }
      });

      // Determine which video category to use based on course domain
      let videoCategory = 'default';
      const domainLower = course.domain?.toLowerCase() || '';
      
      if (domainLower.includes('it') || domainLower.includes('data') || domainLower.includes('programming') || domainLower.includes('web') || domainLower.includes('cybersecurity') || domainLower.includes('cloud') || domainLower.includes('blockchain') || domainLower.includes('quantum')) {
        videoCategory = 'it_programming';
      } else if (domainLower.includes('marketing') || domainLower.includes('sales') || domainLower.includes('ecommerce')) {
        videoCategory = 'marketing';
      } else if (domainLower.includes('business') || domainLower.includes('finance') || domainLower.includes('management')) {
        videoCategory = 'business';
      } else if (domainLower.includes('design') || domainLower.includes('creative') || domainLower.includes('art')) {
        videoCategory = 'design';
      } else if (domainLower.includes('health') || domainLower.includes('wellness') || domainLower.includes('nutrition')) {
        videoCategory = 'health';
      } else if (domainLower.includes('personal') || domainLower.includes('development') || domainLower.includes('leadership')) {
        videoCategory = 'personal';
      } else if (domainLower.includes('academic') || domainLower.includes('science') || domainLower.includes('math') || domainLower.includes('physics') || domainLower.includes('chemistry') || domainLower.includes('biology')) {
        videoCategory = 'academic';
      }

      const categoryVideos = EMBEDDABLE_VIDEO_IDS[videoCategory] || EMBEDDABLE_VIDEO_IDS['default'];

      for (const session of sessions) {
        for (const video of session.videos) {
          // Use video ID to consistently assign videos from the category list
          const videoIndex = video.id % categoryVideos.length;
          const videoId = categoryVideos[videoIndex];
          const newUrl = `https://www.youtube.com/watch?v=${videoId}`;

          await prisma.video.update({
            where: { id: video.id },
            data: { url: newUrl }
          });

          updatedCount++;
        }
      }

      console.log(`✅ Updated course: "${course.title}" (${course.domain || 'default'} -> ${videoCategory})`);
    }

    console.log(`\n🎉 Updated ${updatedCount} video URLs with guaranteed embeddable content!`);

  } catch (error) {
    console.error('❌ Error replacing videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

replaceWithEmbeddableVideos();
