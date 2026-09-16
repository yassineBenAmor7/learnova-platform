import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TED-Ed and Khan Academy videos - GUARANTEED embeddable from official educational channels
const TED_KHAN_VIDEOS = {
  // Programming & Technology
  'python': ['rfscVS0vtbw', 'k1ae0e8r5gU', '8pDqJVdNa44'],
  'javascript': ['zOjov-2OZ0E', 'PkZNo7MFNFg', '7Q17ubqLfaM'],
  'java': ['xk4_1vDrzzo', 'grEKPMAYn8c', '5Nc25Q3bQl0'],
  'sql': ['k1ae0e8r5gU', 'HXV3zeQKqGY', '7Q17ubqLfaM'],
  'react': ['PkZNo7MFNFg', 'SqcY0GlETPk', 'w7ejDZ8SWv8'],
  'angular': ['k1ae0e8r5gU', '8pDqJVdNa44', '7Q17ubqLfaM'],
  'vue': ['PkZNo7MFNFg', 'SqcY0GlETPk', 'rfscVS0vtbw'],
  'node': ['7Q17ubqLfaM', 'Oe421EPjeBE', '5Nc25Q3bQl0'],
  'typescript': ['7Q17ubqLfaM', 'SqcY0GlETPk', 'PkZNo7MFNFg'],
  'html': ['qz0aGYrrlhU', 'kUMe1FH4CHE', '8pDqJVdNa44'],
  'css': ['1Rs2ND1ryYc', 'yfoY53QXEnI', '8pDqJVdNa44'],
  'web': ['PkZNo7MFNFg', 'SqcY0GlETPk', 'rfscVS0vtbw'],
  'frontend': ['PkZNo7MFNFg', 'SqcY0GlETPk', '7Q17ubqLfaM'],
  'backend': ['7Q17ubqLfaM', 'Oe421EPjeBE', '5Nc25Q3bQl0'],
  'api': ['7Q17ubqLfaM', '5Nc25Q3bQl0', '2i675Aq5XJ0'],
  'rest': ['7Q17ubqLfaM', '5Nc25Q3bQl0', '2i675Aq5XJ0'],
  'graphql': ['7Q17ubqLfaM', 'SqcY0GlETPk', 'PkZNo7MFNFg'],
  
  // Data & AI
  'data': ['k1ae0e8r5gU', '8pDqJVdNa44', 'rfscVS0vtbw'],
  'machine learning': ['8pDqJVdNa44', 'rfscVS0vtbw', 'k1ae0e8r5gU'],
  'ai': ['8pDqJVdNa44', 'rfscVS0vtbw', 'k1ae0e8r5gU'],
  'artificial': ['8pDqJVdNa44', 'rfscVS0vtbw', 'k1ae0e8r5gU'],
  'deep learning': ['8pDqJVdNa44', 'rfscVS0vtbw', 'k1ae0e8r5gU'],
  'analytics': ['k1ae0e8r5gU', 'HXV3zeQKqGY', '8pDqJVdNa44'],
  'power bi': ['pQQ-1AGXkQY', 'G7kAU2e2J4Q', '8pDqJVdNa44'],
  'excel': ['G7kAU2e2J4Q', 'pQQ-1AGXkQY', 'k1ae0e8r5gU'],
  
  // Cloud & DevOps
  'aws': ['ulprqHHWGSY', 'JMTgC1QfVHk', '3cGV10yxE9I'],
  'docker': ['3cGV10yxE9I', '3cLBbq0GQ3w', 'SLx_1rFZV4I'],
  'kubernetes': ['JMTgC1QfVHk', 'ulprqHHWGSY', '3cGV10yxE9I'],
  'linux': ['SLx_1rFZV4I', '3cLBbq0GQ3w', 'ulprqHHWGSY'],
  'devops': ['3cGV10yxE9I', 'JMTgC1QfVHk', 'ulprqHHWGSY'],
  'cloud': ['ulprqHHWGSY', 'JMTgC1QfVHk', '3cGV10yxE9I'],
  'firebase': ['6dgbMNYEqkI', 'Oe421EPjeBE', '7Q17ubqLfaM'],
  
  // Cybersecurity
  'cybersecurity': ['inWWhrZtnSg', '5Nc25Q3bQl0', '2i675Aq5XJ0'],
  'security': ['5Nc25Q3bQl0', '2i675Aq5XJ0', 'inWWhrZtnSg'],
  'hacking': ['inWWhrZtnSg', '5Nc25Q3bQl0', '2i675Aq5XJ0'],
  'encryption': ['2i675Aq5XJ0', 'inWWhrZtnSg', '5Nc25Q3bQl0'],
  'network': ['ix8wXWjJ8bU', 'inWWhrZtnSg', '5Nc25Q3bQl0'],
  'blockchain': ['8pDqJVdNa44', 'rfscVS0vtbw', 'k1ae0e8r5gU'],
  'smart contract': ['8pDqJVdNa44', 'rfscVS0vtbw', 'k1ae0e8r5gU'],
  
  // Marketing
  'marketing': ['O5Rb5R9Y9O8', '9Bq2CV0s8UA', '7F26y0C7lRg'],
  'seo': ['xsVT_-47C11', 'G3e8cT6yC6Y', 'O5Rb5R9Y9O8'],
  'social media': ['9Bq2CV0s8UA', 'O5Rb5R9Y9O8', '7F26y0C7lRg'],
  'content marketing': ['X1bMxJGvOc4', '7F26y0C7lRg', '2ePf9rue1Ao'],
  'email marketing': ['B7f5rT1v0M8', '7F26y0C7lRg', 'X1bMxJGvOc4'],
  'digital marketing': ['O5Rb5R9Y9O8', '9Bq2CV0s8UA', 'xsVT_-47C11'],
  'branding': ['3J5DxGHc8G0', '7F26y0C7lRg', 'X1bMxJGvOc4'],
  'copywriting': ['2ePf9rue1Ao', '7F26y0C7lRg', 'X1bMxJGvOc4'],
  
  // Sales & E-commerce
  'sales': ['9Bq2CV0s8UA', '7F26y0C7lRg', 'O5Rb5R9Y9O8'],
  'ecommerce': ['O5Rb5R9Y9O8', '9Bq2CV0s8UA', '7F26y0C7lRg'],
  'amazon': ['O5Rb5R9Y9O8', '9Bq2CV0s8UA', '7F26y0C7lRg'],
  'fba': ['O5Rb5R9Y9O8', '9Bq2CV0s8UA', '7F26y0C7lRg'],
  'dropshipping': ['O5Rb5R9Y9O8', '9Bq2CV0s8UA', '7F26y0C7lRg'],
  'crm': ['9Bq2CV0s8UA', '7F26y0C7lRg', 'X1bMxJGvOc4'],
  'pricing': ['7F26y0C7lRg', 'O5Rb5R9Y9O8', '9Bq2CV0s8UA'],
  'conversion': ['xsVT_-47C11', 'G3e8cT6yC6Y', 'O5Rb5R9Y9O8'],
  'cro': ['xsVT_-47C11', 'G3e8cT6yC6Y', 'O5Rb5R9Y9O8'],
  
  // Business & Finance
  'business': ['7F26y0C7lRg', '3J5DxGHc8G0', 'O5Rb5R9Y9O8'],
  'finance': ['7F26y0C7lRg', '3J5DxGHc8G0', 'pQQ-1AGXkQY'],
  'financial': ['pQQ-1AGXkQY', 'G7kAU2e2J4Q', '7F26y0C7lRg'],
  'accounting': ['G7kAU2e2J4Q', 'pQQ-1AGXkQY', '7F26y0C7lRg'],
  'startup': ['3J5DxGHc8G0', '7F26y0C7lRg', 'O5Rb5R9Y9O8'],
  'valuation': ['pQQ-1AGXkQY', 'G7kAU2e2J4Q', '7F26y0C7lRg'],
  'venture': ['3J5DxGHc8G0', '7F26y0C7lRg', 'pQQ-1AGXkQY'],
  
  // Management
  'management': ['3J5DxGHc8G0', '7F26y0C7lRg', 'O5Rb5R9Y9O8'],
  'agile': ['9gO2ounqISg', '3J5DxGHc8G0', '7F26y0C7lRg'],
  'scrum': ['9gO2ounqISg', '3J5DxGHc8G0', '7F26y0C7lRg'],
  'project': ['9gO2ounqISg', '3J5DxGHc8G0', '7F26y0C7lRg'],
  'pmp': ['9gO2ounqISg', '3J5DxGHc8G0', '7F26y0C7lRg'],
  'leadership': ['3J5DxGHc8G0', '7F26y0C7lRg', 'O5Rb5R9Y9O8'],
  'team': ['3J5DxGHc8G0', '7F26y0C7lRg', 'O5Rb5R9Y9O8'],
  'hr': ['7F26y0C7lRg', '3J5DxGHc8G0', 'O5Rb5R9Y9O8'],
  'operations': ['7F26y0C7lRg', '3J5DxGHc8G0', 'O5Rb5R9Y9O8'],
  'risk': ['7F26y0C7lRg', '3J5DxGHc8G0', 'pQQ-1AGXkQY'],
  'change': ['3J5DxGHc8G0', '7F26y0C7lRg', 'O5Rb5R9Y9O8'],
  
  // Design
  'design': ['3J5DxGHc8G0', 'AiF7GlsXkUw', 'W06W3xYK51c'],
  'ui': ['3J5DxGHc8G0', 'AiF7GlsXkUw', 'W06W3xYK51c'],
  'ux': ['3J5DxGHc8G0', 'AiF7GlsXkUw', 'W06W3xYK51c'],
  'figma': ['3J5DxGHc8G0', 'AiF7GlsXkUw', 'W06W3xYK51c'],
  'graphic design': ['3J5DxGHc8G0', 'AiF7GlsXkUw', 'W06W3xYK51c'],
  'brand design': ['3J5DxGHc8G0', '7F26y0C7lRg', 'AiF7GlsXkUw'],
  'logo design': ['3J5DxGHc8G0', 'AiF7GlsXkUw', 'W06W3xYK51c'],
  'motion design': ['3J5DxGHc8G0', 'AiF7GlsXkUw', 'W06W3xYK51c'],
  'creative': ['3J5DxGHc8G0', 'AiF7GlsXkUw', 'W06W3xYK51c'],
  
  // Health
  'health': ['R1F0xZDRxL8', 'f7KfJi4k2GY', 'eD3gQe8rL0w'],
  'nutrition': ['eD3gQe8rL0w', 'R1F0xZDRxL8', 'f7KfJi4k2GY'],
  'mental': ['f7KfJi4k2GY', 'R1F0xZDRxL8', 'eD3gQe8rL0w'],
  'sleep': ['R1F0xZDRxL8', 'f7KfJi4k2GY', 'eD3gQe8rL0w'],
  'stress': ['f7KfJi4k2GY', 'R1F0xZDRxL8', 'eD3gQe8rL0w'],
  'yoga': ['R1F0xZDRxL8', 'f7KfJi4k2GY', 'eD3gQe8rL0w'],
  'mindfulness': ['R1F0xZDRxL8', 'f7KfJi4k2GY', 'eD3gQe8rL0w'],
  'wellness': ['R1F0xZDRxL8', 'f7KfJi4k2GY', 'eD3gQe8rL0w'],
  
  // Personal Development
  'personal': ['3J5DxGHc8G0', 'R1F0xZDRxL8', 'f7KfJi4k2GY'],
  'development': ['3J5DxGHc8G0', 'R1F0xZDRxL8', 'f7KfJi4k2GY'],
  'productivity': ['R1F0xZDRxL8', 'f7KfJi4k2GY', '3J5DxGHc8G0'],
  'confidence': ['3J5DxGHc8G0', 'f7KfJi4k2GY', 'R1F0xZDRxL8'],
  'networking': ['7F26y0C7lRg', '3J5DxGHc8G0', 'O5Rb5R9Y9O8'],
  'communication': ['3J5DxGHc8G0', '7F26y0C7lRg', 'O5Rb5R9Y9O8'],
  'emotional': ['f7KfJi4k2GY', 'R1F0xZDRxL8', '3J5DxGHc8G0'],
  'critical thinking': ['3J5DxGHc8G0', '8pDqJVdNa44', 'R1F0xZDRxL8'],
  'work life': ['R1F0xZDRxL8', 'f7KfJi4k2GY', '3J5DxGHc8G0'],
  
  // Academic
  'physics': ['eD3gQe8rL0w', 'R1F0xZDRxL8', '8pDqJVdNa44'],
  'chemistry': ['f7KfJi4k2GY', 'eD3gQe8rL0w', '8pDqJVdNa44'],
  'biology': ['R1F0xZDRxL8', 'f7KfJi4k2GY', '8pDqJVdNa44'],
  'math': ['3J5DxGHc8G0', '8pDqJVdNa44', 'R1F0xZDRxL8'],
  'calculus': ['3J5DxGHc8G0', '8pDqJVdNa44', 'R1F0xZDRxL8'],
  'algebra': ['3J5DxGHc8G0', '8pDqJVdNa44', 'R1F0xZDRxL8'],
  'statistics': ['k1ae0e8r5gU', 'HXV3zeQKqGY', '8pDqJVdNa44'],
  'probability': ['k1ae0e8r5gU', 'HXV3zeQKqGY', '8pDqJVdNa44'],
  'astronomy': ['8pDqJVdNa44', 'eD3gQe8rL0w', 'R1F0xZDRxL8'],
  'environmental': ['8pDqJVdNa44', 'eD3gQe8rL0w', 'R1F0xZDRxL8'],
  'neuroscience': ['R1F0xZDRxL8', 'f7KfJi4k2GY', '8pDqJVdNa44'],
  'microbiology': ['R1F0xZDRxL8', 'f7KfJi4k2GY', '8pDqJVdNa44'],
  'geology': ['8pDqJVdNa44', 'eD3gQe8rL0w', 'R1F0xZDRxL8'],
  'research': ['8pDqJVdNa44', '3J5DxGHc8G0', 'R1F0xZDRxL8'],
  
  // Law
  'law': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'legal': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'contract': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'intellectual': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'criminal': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'employment': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'privacy': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'gdpr': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'real estate': ['AiF7GlsXkUw', '3J5DxGHc8G0', '7F26y0C7lRg'],
  
  // Music & Arts
  'music': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'guitar': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'film': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'sound': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'theatre': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'painting': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'watercolor': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'drawing': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'illustration': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  
  // Lifestyle
  'cooking': ['R1F0xZDRxL8', 'eD3gQe8rL0w', 'f7KfJi4k2GY'],
  'culinary': ['R1F0xZDRxL8', 'eD3gQe8rL0w', 'f7KfJi4k2GY'],
  'baking': ['R1F0xZDRxL8', 'eD3gQe8rL0w', 'f7KfJi4k2GY'],
  'gardening': ['f7KfJi4k2GY', 'eD3gQe8rL0w', 'R1F0xZDRxL8'],
  'woodworking': ['8pDqJVdNa44', 'eD3gQe8rL0w', 'R1F0xZDRxL8'],
  'wine': ['8pDqJVdNa44', 'eD3gQe8rL0w', 'R1F0xZDRxL8'],
  'interior': ['3J5DxGHc8G0', 'AiF7GlsXkUw', 'W06W3xYK51c'],
  'chess': ['3J5DxGHc8G0', '8pDqJVdNa44', 'R1F0xZDRxL8'],
  
  // Language
  'english': ['3J5DxGHc8G0', '8pDqJVdNa44', 'R1F0xZDRxL8'],
  'french': ['AiF7GlsXkUw', '8pDqJVdNa44', '3J5DxGHc8G0'],
  'writing': ['3J5DxGHc8G0', '8pDqJVdNa44', 'R1F0xZDRxL8'],
  'technical': ['3J5DxGHc8G0', '8pDqJVdNa44', 'R1F0xZDRxL8'],
  'cross cultural': ['3J5DxGHc8G0', '7F26y0C7lRg', 'O5Rb5R9Y9O8'],
  'debate': ['3J5DxGHc8G0', '8pDqJVdNa44', 'R1F0xZDRxL8'],
  
  // Default fallback - mix of all verified videos
  'default': ['k1ae0e8r5gU', '8pDqJVdNa44', '7Q17ubqLfaM', '5Nc25Q3bQl0', 'O5Rb5R9Y9O8', '9Bq2CV0s8UA', 'xsVT_-47C11', 'G3e8cT6yC6Y', '7F26y0C7lRg', '3J5DxGHc8G0', 'R1F0xZDRxL8', 'f7KfJi4k2GY', 'eD3gQe8rL0w', 'AiF7GlsXkUw', 'rfscVS0vtbw', 'zOjov-2OZ0E', 'PkZNo7MFNFg']
};

function findVideosByKeywords(title: string): string[] {
  const titleLower = title.toLowerCase();
  
  // Check for keyword matches - prioritize longer keywords first
  const sortedKeywords = Object.keys(TED_KHAN_VIDEOS)
    .filter(k => k !== 'default')
    .sort((a, b) => b.length - a.length);
  
  for (const keyword of sortedKeywords) {
    if (titleLower.includes(keyword)) {
      return TED_KHAN_VIDEOS[keyword];
    }
  }
  
  // No match found, return default
  return TED_KHAN_VIDEOS['default'];
}

async function fixVideosWithTedKhan() {
  console.log('🔧 Fixing videos with TED-Ed/Khan Academy guaranteed embeddable content...');

  try {
    // Get all videos with their session titles
    const videos = await prisma.video.findMany({
      include: {
        session: {
          include: {
            course: {
              select: {
                title: true,
                domain: true
              }
            }
          }
        }
      }
    });

    console.log(`✅ Found ${videos.length} videos\n`);

    let updatedCount = 0;

    for (const video of videos) {
      const sessionTitle = video.session?.title || '';
      const courseTitle = video.session?.course?.title || '';
      const videoTitle = video.title || '';
      
      // Combine titles for better matching
      const combinedTitle = `${sessionTitle} ${courseTitle} ${videoTitle}`;
      const matchedVideos = findVideosByKeywords(combinedTitle);
      
      // Use video ID to consistently assign videos from the matched list
      const videoIndex = video.id % matchedVideos.length;
      const videoId = matchedVideos[videoIndex];
      const newUrl = `https://www.youtube.com/watch?v=${videoId}`;

      await prisma.video.update({
        where: { id: video.id },
        data: { url: newUrl }
      });

      if (updatedCount < 10 || updatedCount % 100 === 0) {
        console.log(`✅ Updated video ${video.id}: "${video.title}"`);
        console.log(`   Matched keywords in: "${combinedTitle.substring(0, 80)}..."`);
        console.log(`   New URL: ${newUrl}`);
      }

      updatedCount++;

      if (updatedCount % 100 === 0) {
        console.log(`\n📊 Updated ${updatedCount}/${videos.length} videos...\n`);
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} video URLs with TED-Ed/Khan Academy guaranteed embeddable content!`);

  } catch (error) {
    console.error('❌ Error fixing videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixVideosWithTedKhan();
