import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapping des nouvelles URLs YouTube pour chaque vidéo du cours Power BI
const videoUrlUpdates = [
  // Session 1: Introduction
  { title: "What is Data Analytics?", newUrl: "https://www.youtube.com/watch?v=OmW9YvxSl1E" },
  { title: "Power BI Overview", newUrl: "https://www.youtube.com/watch?v=ULF3daSw_bo" },
  { title: "Data vs Information", newUrl: "https://www.youtube.com/watch?v=c7LrqSxjJQQ" },
  
  // Session 2: Preparing Data
  { title: "Introduction to Power Query", newUrl: "https://www.youtube.com/watch?v=0aeZX1l4JT4" },
  { title: "Data Transformation Basics", newUrl: "https://www.youtube.com/watch?v=x7mzOYEn0XA" },
  { title: "Merging and Appending Data", newUrl: "https://www.youtube.com/watch?v=i-YPX5Md3JI" },
  
  // Session 3: Data Cleaning
  { title: "Identifying Data Quality Issues", newUrl: "https://www.youtube.com/watch?v=A_qrHMpiLaY" },
  { title: "Handling Missing Values", newUrl: "https://www.youtube.com/watch?v=8q28u6WZccA" },
  
  // Session 4: Data Modeling
  { title: "Understanding Data Models", newUrl: "https://www.youtube.com/watch?v=KAdHFEmIZxE" },
  { title: "Star Schema Design", newUrl: "https://www.youtube.com/watch?v=uwe8C7K8fXY" },
  { title: "Creating Relationships", newUrl: "https://www.youtube.com/watch?v=OmW9YvxSl1E" },
  
  // Session 5: DAX
  { title: "Introduction to DAX", newUrl: "https://www.youtube.com/watch?v=ULF3daSw_bo" },
  { title: "CALCULATE Function", newUrl: "https://www.youtube.com/watch?v=c7LrqSxjJQQ" },
  { title: "Common DAX Functions", newUrl: "https://www.youtube.com/watch?v=KAdHFEmIZxE" },
  
  // Session 6: Visualization
  { title: "Choosing the Right Visualization", newUrl: "https://www.youtube.com/watch?v=uwe8C7K8fXY" },
  { title: "Creating Reports", newUrl: "https://www.youtube.com/watch?v=OmW9YvxSl1E" },
  
  // Session 7: Dashboards
  { title: "Building Dashboards", newUrl: "https://www.youtube.com/watch?v=ULF3daSw_bo" },
  { title: "KPIs and Business Insights", newUrl: "https://www.youtube.com/watch?v=c7LrqSxjJQQ" },
  
  // Session 8: Power BI Service
  { title: "Publishing to Power BI Service", newUrl: "https://www.youtube.com/watch?v=KAdHFEmIZxE" },
  { title: "Sharing and Collaboration", newUrl: "https://www.youtube.com/watch?v=uwe8C7K8fXY" },
];

async function updatePowerBIVideoUrls() {
  console.log('Starting update of Power BI video URLs...');
  
  try {
    // Find the Power BI course
    const course = await prisma.course.findFirst({
      where: { title: "Data Analytics & Power BI" },
    });

    if (!course) {
      console.log('❌ Power BI course not found');
      return;
    }

    console.log(`✅ Found Power BI course with ID: ${course.id}`);

    // Get all sessions for this course
    const sessions = await prisma.session.findMany({
      where: { courseId: course.id },
      orderBy: { orderNumber: 'asc' },
    });

    console.log(`Found ${sessions.length} sessions`);

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const update of videoUrlUpdates) {
      // Find the video by title
      const video = await prisma.video.findFirst({
        where: {
          title: update.title,
          session: {
            courseId: course.id,
          },
        },
      });

      if (video) {
        await prisma.video.update({
          where: { id: video.id },
          data: { url: update.newUrl },
        });
        console.log(`✅ Updated: "${update.title}" -> ${update.newUrl}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Not found: "${update.title}"`);
        notFoundCount++;
      }
    }

    console.log('\n=== Update Summary ===');
    console.log(`Total videos to update: ${videoUrlUpdates.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Not found: ${notFoundCount}`);
    console.log('✅ Video URL update completed successfully!');

  } catch (error) {
    console.error('❌ Error during update:', error);
    throw error;
  }
}

updatePowerBIVideoUrls()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
