import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixThumbnailsWithRealImages() {
  console.log('🔄 Fixing thumbnails with real professional images...');

  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        domain: true
      }
    });

    // Professional image URLs from Unsplash (free, high-quality, relevant)
    const domainImages: Record<string, string[]> = {
      'IT_DATA': [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      ],
      'ACADEMIC_SCIENCES': [
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop',
      ],
      'MARKETING': [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=600&fit=crop',
      ],
      'MANAGEMENT': [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
      ],
      'DESIGN': [
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?w=800&h=600&fit=crop',
      ],
      'MUSIC': [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      ],
      'HEALTH': [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544367563-12123d896889?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=600&fit=crop',
      ],
      'PHOTOGRAPHY': [
        'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
      ],
    };

    let updatedCount = 0;

    for (const course of courses) {
      const domainKey = course.domain as string;
      const availableImages = domainImages[domainKey] || domainImages['IT_DATA'];
      
      // Select image based on course ID to ensure consistency
      const imageIndex = course.id % availableImages.length;
      const newThumbnail = availableImages[imageIndex];

      await prisma.course.update({
        where: { id: course.id },
        data: { thumbnail: newThumbnail }
      });

      console.log(`✅ Updated "${course.title}"`);
      console.log(`   Domain: ${domainKey}`);
      console.log(`   New: ${newThumbnail}`);
      updatedCount++;
    }

    console.log(`\n🎉 Updated ${updatedCount} course thumbnails with real professional images!`);

  } catch (error) {
    console.error('❌ Error fixing thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixThumbnailsWithRealImages();
