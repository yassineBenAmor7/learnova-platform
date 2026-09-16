import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function replaceAllThumbnails() {
  console.log('🔄 Replacing all thumbnails with simpler, more reliable URLs...');

  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        domain: true,
        thumbnail: true
      }
    });

    console.log(`✅ Found ${courses.length} courses\n`);

    // Define reliable thumbnail URLs by domain (using simpler Unsplash URLs)
    const domainThumbnails: { [key: string]: string[] } = {
      'IT_DATA': [
        'https://images.unsplash.com/photo-1518770660439-4636190af475',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb'
      ],
      'MARKETING': [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        'https://images.unsplash.com/photo-1542744094-3a31f103e35f',
        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
        'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a'
      ],
      'FINANCE_BUSINESS': [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44',
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3'
      ],
      'MANAGEMENT': [
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12',
        'https://images.unsplash.com/photo-1552664730-d307ca884978',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
      ],
      'DESIGN_CREATIVE': [
        'https://images.unsplash.com/photo-1561070791-2526d30994b5',
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb',
        'https://images.unsplash.com/photo-1545989253-02cc26577f88'
      ],
      'LANGUAGE_COMMUNICATION': [
        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655'
      ],
      'HEALTH_WELLNESS': [
        'https://images.unsplash.com/photo-1544367563-12123d8d5e80',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
        'https://images.unsplash.com/photo-1544367563-12123d8d5e80'
      ],
      'PERSONAL_DEVELOPMENT': [
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773'
      ],
      'ACADEMIC_SCIENCES': [
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
      ],
      'MUSIC_ARTS': [
        'https://images.unsplash.com/photo-1511379938545-c1f69419868d',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4'
      ],
      'LIFESTYLE_HOBBIES': [
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac'
      ],
      'SALES_E_COMMERCE': [
        'https://images.unsplash.com/photo-1556745757-8d76bdb6984b',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
        'https://images.unsplash.com/photo-1556745753-b2904692b3cd'
      ],
      'HUMANITIES_SOCIAL': [
        'https://images.unsplash.com/photo-1447069387593-a5de0862481e',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
        'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d'
      ],
      'LAW_LEGAL': [
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
        'https://images.unsplash.com/photo-1555664424-778a1e5e1b48',
        'https://images.unsplash.com/photo-1505664194779-8beaceb93744'
      ]
    };

    let updatedCount = 0;

    for (const course of courses) {
      const domainImages = domainThumbnails[course.domain] || domainThumbnails['IT_DATA'];
      const randomIndex = Math.floor(Math.random() * domainImages.length);
      const newThumbnail = domainImages[randomIndex];

      await prisma.course.update({
        where: { id: course.id },
        data: { thumbnail: newThumbnail }
      });

      console.log(`✅ Updated "${course.title}"`);
      updatedCount++;
    }

    console.log(`\n🎉 Updated ${updatedCount} course thumbnails with simpler URLs!`);

  } catch (error) {
    console.error('❌ Error replacing thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

replaceAllThumbnails();
