import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixThumbnails() {
  console.log('🔄 Fixing invalid thumbnails...');

  try {
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { thumbnail: { contains: 'example.com' } },
          { thumbnail: { contains: 'localhost' } }
        ]
      }
    });

    console.log(`✅ Found ${courses.length} courses with invalid thumbnails\n`);

    // Define appropriate thumbnail URLs for each course type
    const thumbnailMap: { [key: string]: string } = {
      'Advanced Machine Learning & Deep Learning': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
      'Blockchain Development & Smart Contracts': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      'Quantum Computing Fundamentals': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      'Cybersecurity & Ethical Hacking': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      'Introduction to Digital Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'Project Management Professional (PMP) Preparation': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      'Web Development Full Stack': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
    };

    let updatedCount = 0;

    for (const course of courses) {
      let newThumbnail = thumbnailMap[course.title];
      
      // If no specific mapping, use a generic image based on domain
      if (!newThumbnail) {
        const domainThumbnails: { [key: string]: string } = {
          'IT_DATA': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          'MARKETING': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          'FINANCE_BUSINESS': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
          'MANAGEMENT': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
          'DESIGN_CREATIVE': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
          'LANGUAGE_COMMUNICATION': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
          'HEALTH_WELLNESS': 'https://images.unsplash.com/photo-1544367563-12123d8d5e80?auto=format&fit=crop&w=800&q=80',
          'PERSONAL_DEVELOPMENT': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
          'ACADEMIC_SCIENCES': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
          'MUSIC_ARTS': 'https://images.unsplash.com/photo-1511379938545-c1f69419868d?auto=format&fit=crop&w=800&q=80',
          'LIFESTYLE_HOBBIES': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
          'SALES_E_COMMERCE': 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=800&q=80',
          'HUMANITIES_SOCIAL': 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=800&q=80',
          'LAW_LEGAL': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
        };
        
        newThumbnail = domainThumbnails[course.domain] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
      }

      await prisma.course.update({
        where: { id: course.id },
        data: { thumbnail: newThumbnail }
      });

      console.log(`✅ Updated "${course.title}" with: ${newThumbnail}`);
      updatedCount++;
    }

    console.log(`\n🎉 Updated ${updatedCount} course thumbnails!`);

  } catch (error) {
    console.error('❌ Error fixing thumbnails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixThumbnails();
