import { getPrismaClient, closePrismaClient } from '../src/prisma/prisma-client.factory';

const prisma = getPrismaClient();

const THUMBNAIL_UPDATES: Record<number, { title: string; thumbnail: string }> = {
  // Missing or example.com thumbnails
  106: {
    title: 'Blockchain Development & Smart Contracts',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80', // Blockchain, crypto nodes & networks
  },
  107: {
    title: 'Quantum Computing Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80', // Quantum physics / laser lab
  },
  108: {
    title: 'Cybersecurity & Ethical Hacking',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', // Cybersecurity terminal / code matrix
  },
  109: {
    title: 'Introduction to Digital Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=800&q=80', // Digital marketing campaign & laptop
  },
  110: {
    title: 'Project Management Professional (PMP) Preparation',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', // Project planning & charts
  },
  111: {
    title: 'Web Development Full Stack',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', // Full stack developer workstation
  },
  112: {
    title: 'Network Security & Penetration Testing Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', // Server rack & network infrastructure
  },
  113: {
    title: 'Web Application Security & OWASP Top 10',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', // Web application security lock & shield
  },

  // Incoherent shared thumbnails that need specific replacements
  73: {
    title: 'Chess Strategy & Tactical Thinking',
    thumbnail: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80', // Chess board & pieces
  },
  62: {
    title: 'Watercolor Painting Techniques',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80', // Watercolor palette & paint
  },
  63: {
    title: 'Theatre Acting & Stage Performance',
    thumbnail: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80', // Theatre stage spotlights
  },
  85: {
    title: 'Astronomy & Astrophysics Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80', // Telescope & starry galaxy nebula
  },
  70: {
    title: 'Woodworking & DIY Craftsmanship',
    thumbnail: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80', // Woodworking chisels & timber
  },
  72: {
    title: 'Interior Design for Small Spaces',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', // Modern minimal interior design
  },
  96: {
    title: 'Sales Analytics & Forecasting with Excel',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', // Analytics data dashboard & spreadsheet
  },
};

async function fixCourseThumbnails() {
  console.log('🚀 Updating course thumbnails in database...');

  let updatedCount = 0;
  for (const [courseIdStr, data] of Object.entries(THUMBNAIL_UPDATES)) {
    const courseId = parseInt(courseIdStr, 10);
    const existing = await prisma.course.findUnique({ where: { id: courseId } });
    if (!existing) {
      console.log(`⚠️ Course with ID ${courseId} not found, skipping.`);
      continue;
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { thumbnail: data.thumbnail },
    });
    console.log(`✅ Updated course ${courseId} ("${existing.title}") with new thumbnail: ${data.thumbnail}`);
    updatedCount++;
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} course thumbnails!`);
}

fixCourseThumbnails()
  .catch((err) => {
    console.error('❌ Error updating thumbnails:', err);
    process.exit(1);
  })
  .finally(() => closePrismaClient());
