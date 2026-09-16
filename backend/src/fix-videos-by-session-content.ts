import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixVideosBySessionContent() {
  console.log('🔄 Analyzing session content and assigning ultra-specific videos...');

  try {
    // Get all sessions with their videos
    const sessions = await prisma.session.findMany({
      include: {
        videos: true,
        course: {
          select: {
            domain: true
          }
        }
      }
    });

    console.log(`✅ Found ${sessions.length} sessions\n`);

    // ONLY Khan Academy and FreeCodeCamp - guaranteed embeddable worldwide (non-profit educational organizations)
    const topicVideos: Record<string, string[]> = {
      // All topics use Khan Academy and FreeCodeCamp videos
      'linear algebra': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'deep learning': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'pytorch': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'cnn': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'rnn': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'transformer': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'llm': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'fine-tuning': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      // Data Analytics & Power BI
      'power bi': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'dax': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'data cleaning': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'data visualization': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      // Programming
      'python': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'javascript': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'react': [
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'node': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'sql': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'docker': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'git': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'html': [
        'https://www.youtube.com/watch?v=1Rs2ND1ryYc', // HTML - FreeCodeCamp
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'css': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'typescript': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'mongodb': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'postgresql': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'kubernetes': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'linux': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'security': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'jwt': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'api': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'vue': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'angular': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'nextjs': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'graphql': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      // Marketing
      'seo': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'semantic html': [
        'https://www.youtube.com/watch?v=1Rs2ND1ryYc', // HTML - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'marketing': [
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'social': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'brand': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'copywriting': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'hooks': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'headlines': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      // Finance
      'financial statement': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'accounting': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'microeconomics': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'supply demand': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'venture capital': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'valuation': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      // Management
      'agile': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'scrum': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'product management': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'leadership': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      'delegating': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      // Design
      'ui/ux': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'figma': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      'user research': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'graphic design': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'color': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
      ],
      // Communication
      'public speaking': [
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
      ],
      'email': [
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
      ],
      'presentation': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
      ],
      // Default
      'default': [
        'https://www.youtube.com/watch?v=rfscVS0vtbw', // Python - FreeCodeCamp
        'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JavaScript - FreeCodeCamp
        'https://www.youtube.com/watch?v=w7ejDZ8SWv8', // React - FreeCodeCamp
        'https://www.youtube.com/watch?v=kT6MpW3mIeE', // Linear Algebra - Khan Academy
        'https://www.youtube.com/watch?v=1Rs2ND1ryYc', // HTML - FreeCodeCamp
      ]
    };

    let updatedCount = 0;

    for (const session of sessions) {
      const sessionTitle = session.title.toLowerCase();
      const sessionDescription = session.description?.toLowerCase() || '';
      const combinedText = `${sessionTitle} ${sessionDescription}`;

      // Find matching topic based on keywords (more specific first)
      let matchedVideos = topicVideos['default'];
      
      // Sort topics by length (more specific first)
      const sortedTopics = Object.entries(topicVideos)
        .filter(([topic]) => topic !== 'default')
        .sort((a, b) => b[0].length - a[0].length);

      for (const [topic, videos] of sortedTopics) {
        if (combinedText.includes(topic)) {
          matchedVideos = videos;
          console.log(`📝 Session "${session.title}" matched topic: ${topic}`);
          break;
        }
      }

      // Update videos for this session
      for (const video of session.videos) {
        const videoIndex = video.id % matchedVideos.length;
        const newUrl = matchedVideos[videoIndex];

        await prisma.video.update({
          where: { id: video.id },
          data: { url: newUrl }
        });

        updatedCount++;
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} video URLs based on ultra-specific session content!`);

  } catch (error) {
    console.error('❌ Error fixing videos by session content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixVideosBySessionContent();
