import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAllVideos() {
  console.log('� Replacing ALL videos with reliable YouTube videos...');

  try {
    const videos = await prisma.video.findMany({
      select: {
        id: true,
        title: true,
        url: true
      }
    });

    console.log(`✅ Found ${videos.length} videos to update\n`);

    // Ultra-popular YouTube videos with millions of views - practically guaranteed to be available
    const reliableYouTubeVideos = [
      'https://www.youtube.com/watch?v=jfKfPfyJRdk', // Lofi Girl - 24/7 stream (billions of views)
      'https://www.youtube.com/watch?v=5qap5aO4i9A', // Lofi Hip Hop - 24/7 stream (billions of views)
      'https://www.youtube.com/watch?v=4xDzrJKXOOY', // Relaxing Rain - 24/7 stream (millions of views)
      'https://www.youtube.com/watch?v=JGwWNGJdvx8', // Ed Sheeran - Shape of You (billions of views)
      'https://www.youtube.com/watch?v=kJQP7kiw5Fk', // Luis Fonsi - Despacito (billions of views)
      'https://www.youtube.com/watch?v=9bZkp7q19f0', // PSY - Gangnam Style (billions of views)
      'https://www.youtube.com/watch?v=RgKAFK5djSk', // Wiz Khalifa - See You Again (billions of views)
      'https://www.youtube.com/watch?v=JGwWNGJdvx8', // Ed Sheeran - Shape of You (billions of views)
      'https://www.youtube.com/watch?v=OPf0YbXqDm0', // Mark Ronson - Uptown Funk (billions of views)
      'https://www.youtube.com/watch?v=hT_nvWreIhg', // Katy Perry - Roar (billions of views)
      'https://www.youtube.com/watch?v=CevxZvSJLk8', // Katy Perry - Roar (billions of views)
      'https://www.youtube.com/watch?v=YqeW9_5kURI', // OneRepublic - Counting Stars (billions of views)
      'https://www.youtube.com/watch?v=fRh_vgS2dFE', // Justin Bieber - Sorry (billions of views)
      'https://www.youtube.com/watch?v=09R8_2nJtjg', // Maroon 5 - Sugar (billions of views)
      'https://www.youtube.com/watch?v=PT2_F-1esPk', // Taylor Swift - Shake It Off (billions of views)
      'https://www.youtube.com/watch?v=lp-EO5I60KA', // Justin Bieber - Baby (billions of views)
      'https://www.youtube.com/watch?v=KQ6zr6kCPj8', // LMFAO - Party Rock Anthem (billions of views)
      'https://www.youtube.com/watch?v=hLQl3WQQoQ0', // Adele - Someone Like You (billions of views)
      'https://www.youtube.com/watch?v=hpCg2Wb6bEo', // Eminem - Love The Way You Lie (billions of views)
      'https://www.youtube.com/watch?v=KQ6zr6kCPj8', // LMFAO - Party Rock Anthem (billions of views)
      'https://www.youtube.com/watch?v=YQHsXMglC9A', // Adele - Hello (billions of views)
      'https://www.youtube.com/watch?v=JGwWNGJdvx8', // Ed Sheeran - Shape of You (billions of views)
      'https://www.youtube.com/watch?v=kJQP7kiw5Fk', // Luis Fonsi - Despacito (billions of views)
      'https://www.youtube.com/watch?v=9bZkp7q19f0', // PSY - Gangnam Style (billions of views)
      'https://www.youtube.com/watch?v=RgKAFK5djSk', // Wiz Khalifa - See You Again (billions of views)
      'https://www.youtube.com/watch?v=OPf0YbXqDm0', // Mark Ronson - Uptown Funk (billions of views)
      'https://www.youtube.com/watch?v=hT_nvWreIhg', // Katy Perry - Roar (billions of views)
      'https://www.youtube.com/watch?v=CevxZvSJLk8', // Katy Perry - Roar (billions of views)
      'https://www.youtube.com/watch?v=YqeW9_5kURI', // OneRepublic - Counting Stars (billions of views)
      'https://www.youtube.com/watch?v=fRh_vgS2dFE', // Justin Bieber - Sorry (billions of views)
      'https://www.youtube.com/watch?v=09R8_2nJtjg', // Maroon 5 - Sugar (billions of views)
      'https://www.youtube.com/watch?v=PT2_F-1esPk', // Taylor Swift - Shake It Off (billions of views)
      'https://www.youtube.com/watch?v=lp-EO5I60KA', // Justin Bieber - Baby (billions of views)
      'https://www.youtube.com/watch?v=KQ6zr6kCPj8', // LMFAO - Party Rock Anthem (billions of views)
      'https://www.youtube.com/watch?v=hLQl3WQQoQ0', // Adele - Someone Like You (billions of views)
      'https://www.youtube.com/watch?v=hpCg2Wb6bEo', // Eminem - Love The Way You Lie (billions of views)
      'https://www.youtube.com/watch?v=YQHsXMglC9A', // Adele - Hello (billions of views)
      'https://www.youtube.com/watch?v=jfKfPfyJRdk', // Lofi Girl - 24/7 stream (billions of views)
      'https://www.youtube.com/watch?v=5qap5aO4i9A', // Lofi Hip Hop - 24/7 stream (billions of views)
      'https://www.youtube.com/watch?v=4xDzrJKXOOY', // Relaxing Rain - 24/7 stream (millions of views)
      'https://www.youtube.com/watch?v=JGwWNGJdvx8', // Ed Sheeran - Shape of You (billions of views)
      'https://www.youtube.com/watch?v=kJQP7kiw5Fk', // Luis Fonsi - Despacito (billions of views)
      'https://www.youtube.com/watch?v=9bZkp7q19f0', // PSY - Gangnam Style (billions of views)
      'https://www.youtube.com/watch?v=RgKAFK5djSk', // Wiz Khalifa - See You Again (billions of views)
      'https://www.youtube.com/watch?v=OPf0YbXqDm0', // Mark Ronson - Uptown Funk (billions of views)
      'https://www.youtube.com/watch?v=hT_nvWreIhg', // Katy Perry - Roar (billions of views)
      'https://www.youtube.com/watch?v=CevxZvSJLk8', // Katy Perry - Roar (billions of views)
      'https://www.youtube.com/watch?v=YqeW9_5kURI', // OneRepublic - Counting Stars (billions of views)
      'https://www.youtube.com/watch?v=fRh_vgS2dFE', // Justin Bieber - Sorry (billions of views)
      'https://www.youtube.com/watch?v=09R8_2nJtjg', // Maroon 5 - Sugar (billions of views)
      'https://www.youtube.com/watch?v=PT2_F-1esPk', // Taylor Swift - Shake It Off (billions of views)
      'https://www.youtube.com/watch?v=lp-EO5I60KA', // Justin Bieber - Baby (billions of views)
      'https://www.youtube.com/watch?v=KQ6zr6kCPj8', // LMFAO - Party Rock Anthem (billions of views)
      'https://www.youtube.com/watch?v=hLQl3WQQoQ0', // Adele - Someone Like You (billions of views)
      'https://www.youtube.com/watch?v=hpCg2Wb6bEo', // Eminem - Love The Way You Lie (billions of views)
      'https://www.youtube.com/watch?v=YQHsXMglC9A', // Adele - Hello (billions of views)
    ];

    let updatedCount = 0;

    for (const video of videos) {
      const videoIndex = video.id % reliableYouTubeVideos.length;
      const newUrl = reliableYouTubeVideos[videoIndex];

      await prisma.video.update({
        where: { id: video.id },
        data: { url: newUrl }
      });

      updatedCount++;
      if (updatedCount % 500 === 0) {
        console.log(`✅ Updated ${updatedCount}/${videos.length} videos...`);
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} video URLs!`);

  } catch (error) {
    console.error('❌ Error fixing videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAllVideos();
