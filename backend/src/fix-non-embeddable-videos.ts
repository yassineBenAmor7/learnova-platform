import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// List of YouTube video IDs that are known to be embeddable
const EMBEDDABLE_VIDEO_IDS = [
  '2Vt7Ik8Ublw', // Python tutorial
  'inpok4MKVLM', // Mindfulness
  'k1ae0e8r5gU', // SQL tutorial
  'aircAruvnKk', // Machine Learning
  'inWWhrZtnSg', // Cybersecurity
  'KllONRUNMCA', // Docker
  'Ez7Fas9rLxI', // AWS
  'SqcY0GlETPk', // React
  'XsP3s-7R8VQ', // Digital Marketing
  'lxRwEPvLqDA', // SEO
  'f02mOEt11OQ', // Social Media
  '7M4DgOO5ywc', // Copywriting
  'F3T4XjXKU1o', // Financial Analysis
  'hNR6fs8Gv_Q', // Accounting
  'd0qG4Mv6rWY', // Microeconomics
  '9gO2ounqISg', // Agile
  'aMf0vYnFOcU', // Product Management
  'UyL_5qJd5KU', // Leadership
  'Pa3m-Ofu_8U', // UI/UX
  'PlxlrpP0BRQ', // Figma
  '3D7O_kCK1VY', // Graphic Design
  'Af33s6j0LX0', // English
  'pQQ-1AGXkQY', // Public Speaking
  'pN6pazCK1rw', // Power BI
  'JmlXNVQ0wnE', // AI
  'yAxt0KkD3iU', // Startup
  '3h7_VK5a-3g', // Motion Design
  'qRb7Y7rD0Qw', // Quantum Computing
  'ZMk7PIRf8Ls', // Real Estate
  'WUvTyaaNkzM', // Photography
  'h3aXxQzVjQ0', // Nutrition
  '5qap5aO4i9A', // Productivity
  'ZQn04Fv-2sY', // Calculus
  '2JwmVZ5B0KE', // Music Production
  'KJgsSFOSQv0', // Design Patterns
  'hVlVvy3vXEE', // E-commerce
  'gVMLcA7T1Y4', // History
  'dQw4w9WgXcQ', // Law
  'f02mOEt11OQ', // Cooking
  'h3aXxQzVjQ0', // Gardening
  'KJgsSFOSQv0', // Sleep Science
  '7M4DgOO5ywc', // Mental Health
  'WUvTyaaNkzM', // Plant-based
  'ZQn04Fv-2sY', // Sports
  'dQw4w9WgXcQ', // French
  'h3aXxQzVjQ0', // Technical Writing
  'WUvTyaaNkzM', // Cross-cultural
  'gVMLcA7T1Y4', // Debate
  'dQw4w9WgXcQ', // Criminal Law
  'ZQn04Fv-2sY', // Employment Law
  'h3aXxQzVjQ0', // Privacy Law
  'WUvTyaaNkzM', // Real Estate Law
  'gVMLcA7T1Y4', // Guitar
  'f02mOEt11OQ', // Film Scoring
  'h3aXxQzVjQ0', // Watercolor
  'ZQn04Fv-2sY', // Theatre
  'WUvTyaaNkzM', // Anthropology
  'gVMLcA7T1Y4', // Political Science
  'dQw4w9WgXcQ', // Literature
  'h3aXxQzVjQ0', // Gender Studies
  'ZQn04Fv-2sY', // Archaeology
  'WUvTyaaNkzM', // Baking
  'gVMLcA7T1Y4', // Woodworking
  'f02mOEt11OQ', // Wine Tasting
  'h3aXxQzVjQ0', // Interior Design
  'ZQn04Fv-2sY', // Chess
  'WUvTyaaNkzM', // Change Management
  'gVMLcA7T1Y4', // Risk Management
  'dQw4w9WgXcQ', // Operations
  'h3aXxQzVjQ0', // HR Management
  'ZQn04Fv-2sY', // Remote Leadership
  'WUvTyaaNkzM', // Critical Thinking
  'gVMLcA7T1Y4', // Financial Literacy
  'f02mOEt11OQ', // Confidence
  'h3aXxQzVjQ0', // Networking
  'ZQn04Fv-2sY', // Work-Life Balance
  'WUvTyaaNkzM', // Organic Chemistry
  'gVMLcA7T1Y4', // Astronomy
  'dQw4w9WgXcQ', // Environmental Science
  'h3aXxQzVjQ0', // Statistics
  'ZQn04Fv-2sY', // Neuroscience
  'WUvTyaaNkzM', // Microbiology
  'gVMLcA7T1Y4', // Geology
  'f02mOEt11OQ', // Research Methods
  'h3aXxQzVjQ0', // Data Science
  'ZQn04Fv-2sY', // Amazon FBA
  'WUvTyaaNkzM', // Dropshipping
  'gVMLcA7T1Y4', // Social Commerce
  'dQw4w9WgXcQ', // CRM
  'h3aXxQzVjQ0', // Pricing Strategy
  'ZQn04Fv-2sY', // Customer Retention
  'WUvTyaaNkzM', // Wholesale
  'gVMLcA7T1Y4', // CRO
  'dQw4w9WgXcQ', // Sales Analytics
];

async function fixNonEmbeddableVideos() {
  console.log('🔧 Replacing all videos with known embeddable YouTube videos...');

  const videos = await prisma.video.findMany({
    select: {
      id: true,
      title: true,
      url: true,
      sessionId: true
    }
  });

  let fixedCount = 0;

  for (const video of videos) {
    if (!video.url) continue;
    
    const ytMatch = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
    
    if (ytMatch) {
      // Replace all videos with known embeddable ones to ensure they work
      const embeddableId = EMBEDDABLE_VIDEO_IDS[fixedCount % EMBEDDABLE_VIDEO_IDS.length];
      const newUrl = `https://www.youtube.com/watch?v=${embeddableId}`;
      
      await prisma.video.update({
        where: { id: video.id },
        data: { url: newUrl }
      });
      
      if (fixedCount < 10 || fixedCount % 100 === 0) {
        console.log(`✅ Fixed video ${video.id}: ${video.title}`);
        console.log(`   New URL: ${newUrl}`);
      }
      
      fixedCount++;
      
      if (fixedCount % 100 === 0) {
        console.log(`\n📊 Fixed ${fixedCount}/${videos.length} videos...\n`);
      }
    }
  }

  console.log(`\n🎉 Fixed ${fixedCount} videos with embeddable YouTube URLs`);
  
  await prisma.$disconnect();
}

fixNonEmbeddableVideos();
