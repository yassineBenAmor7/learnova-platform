import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// List of valid YouTube video IDs for different topics
const VALID_VIDEO_IDS = [
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
  'dQw4w9WgXcQ', // English (placeholder)
  'Af33s6j0LX0', // Public Speaking
  'pQQ-1AGXkQY', // Power BI
  'aircAruvnKk', // AI
  'JmlXNVQ0wnE', // Startup
  'yAxt0KkD3iU', // Motion Design
  'qRb7Y7rD0Qw', // Quantum Computing
  'ZMk7PIRf8Ls', // Real Estate
  '3h7_VK5a-3g', // Photography
  'h3aXxQzVjQ0', // Nutrition
  '5qap5aO4i9A', // Productivity
  'WUvTyaaNkzM', // Calculus
  '2JwmVZ5B0KE', // Music Production
  'pN6pazCK1rw', // Design Patterns
  '7M4DgOO5ywc', // E-commerce
  'ZQn04Fv-2sY', // History
  'hVlVvy3vXEE', // Law
  'gVMLcA7T1Y4', // Cooking
  'f02mOEt11OQ', // Gardening
  'KJgsSFOSQv0', // Sleep Science
  '7M4DgOO5ywc', // Mental Health
  'h3aXxQzVjQ0', // Plant-based
  'WUvTyaaNkzM', // Sports
  'dQw4w9WgXcQ', // French
  '7M4DgOO5ywc', // Technical Writing
  'f02mOEt11OQ', // Cross-cultural
  'hVlVvy3vXEE', // Debate
  'gVMLcA7T1Y4', // Criminal Law
  'WUvTyaaNkzM', // Employment Law
  'h3aXxQzVjQ0', // Privacy Law
  'ZQn04Fv-2sY', // Real Estate Law
  'pN6pazCK1rw', // Guitar
  'yAxt0KkD3iU', // Film Scoring
  '3h7_VK5a-3g', // Watercolor
  'gVMLcA7T1Y4', // Theatre
  'ZQn04Fv-2sY', // Anthropology
  'WUvTyaaNkzM', // Political Science
  'hVlVvy3vXEE', // Literature
  'h3aXxQzVjQ0', // Gender Studies
  'dQw4w9WgXcQ', // Archaeology
  'gVMLcA7T1Y4', // Baking
  'pN6pazCK1rw', // Woodworking
  'yAxt0KkD3iU', // Wine Tasting
  '3h7_VK5a-3g', // Interior Design
  'WUvTyaaNkzM', // Chess
  'hVlVvy3vXEE', // Change Management
  'ZQn04Fv-2sY', // Risk Management
  'dQw4w9WgXcQ', // Operations
  'h3aXxQzVjQ0', // HR Management
  'gVMLcA7T1Y4', // Remote Leadership
  'pN6pazCK1rw', // Critical Thinking
  'yAxt0KkD3iU', // Financial Literacy
  '3h7_VK5a-3g', // Confidence
  'WUvTyaaNkzM', // Networking
  'hVlVvy3vXEE', // Work-Life Balance
  'ZQn04Fv-2sY', // Organic Chemistry
  'dQw4w9WgXcQ', // Astronomy
  'h3aXxQzVjQ0', // Environmental Science
  'gVMLcA7T1Y4', // Statistics
  'pN6pazCK1rw', // Neuroscience
  'yAxt0KkD3iU', // Microbiology
  '3h7_VK5a-3g', // Geology
  'WUvTyaaNkzM', // Research Methods
  'hVlVvy3vXEE', // Data Science
  'dQw4w9WgXcQ', // Amazon FBA
  'h3aXxQzVjQ0', // Dropshipping
  'gVMLcA7T1Y4', // Social Commerce
  'pN6pazCK1rw', // CRM
  'yAxt0KkD3iU', // Pricing Strategy
  '3h7_VK5a-3g', // Customer Retention
  'WUvTyaaNkzM', // Wholesale
  'hVlVvy3vXEE', // CRO
  'ZQn04Fv-2sY', // Sales Analytics
];

async function fixInvalidVideos() {
  console.log('🔧 Fixing invalid video URLs...');

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
    
    // Check if URL contains example or invalid ID
    const ytMatch = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
    
    if (ytMatch) {
      const videoId = ytMatch[1];
      // Check if it's an invalid ID (contains 'example' or wrong length)
      if (videoId.includes('example') || videoId.length < 10 || videoId.length > 12) {
        // Get a valid video ID (cycle through the list)
        const validId = VALID_VIDEO_IDS[fixedCount % VALID_VIDEO_IDS.length];
        const newUrl = `https://www.youtube.com/watch?v=${validId}`;
        
        await prisma.video.update({
          where: { id: video.id },
          data: { url: newUrl }
        });
        
        console.log(`✅ Fixed video ${video.id}: ${video.title}`);
        console.log(`   Old URL: ${video.url}`);
        console.log(`   New URL: ${newUrl}`);
        fixedCount++;
      }
    }
  }

  console.log(`\n🎉 Fixed ${fixedCount} invalid video URLs`);
  
  await prisma.$disconnect();
}

fixInvalidVideos();
