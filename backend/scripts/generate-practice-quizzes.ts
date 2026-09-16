import { getPrismaClient, closePrismaClient } from '../src/prisma/prisma-client.factory';

const prisma = getPrismaClient();

// Helper function to generate questions based on session content
function generateQuestionsForSession(session: any) {
  const questions: any[] = [];
  
  // Extract key concepts from session title and description
  const titleWords = session.title.split(' ').filter((w: string) => w.length > 4);
  const description = session.description || '';
  const content = session.content || '';
  
  // Generate questions based on session content
  const concepts = [
    ...titleWords,
    ...description.split(' ').filter((w: string) => w.length > 5),
    ...content.split(' ').filter((w: string) => w.length > 5)
  ].slice(0, 5); // Take first 5 meaningful words as concepts
  
  // Generate questions based on session content (up to 2 questions)
  for (let i = 0; i < Math.min(2, concepts.length); i++) {
    const concept = concepts[i] || session.title;
    
    questions.push({
      text: `What is the main concept of ${concept} in this session?`,
      options: [
        { text: `Understanding ${concept} fundamentals`, isCorrect: 1, explanation: `${concept} is a key concept covered in this session.` },
        { text: `Advanced ${concept} techniques`, isCorrect: 0, explanation: 'This is covered in later sessions.' },
        { text: `${concept} history`, isCorrect: 0, explanation: 'This is not the focus of this session.' },
        { text: `${concept} alternatives`, isCorrect: 0, explanation: 'This is covered in supplementary materials.' }
      ]
    });
  }
  
  // Add questions based on videos if available (up to 1 question)
  if (session.videos && session.videos.length > 0 && questions.length < 3) {
    const video = session.videos[0]; // Use first video
    questions.push({
      text: `What is covered in the video "${video.title}"?`,
      options: [
        { text: `Key concepts of ${video.title}`, isCorrect: 1, explanation: 'The video covers the main concepts.' },
        { text: `Advanced techniques`, isCorrect: 0, explanation: 'This is covered in later videos.' },
        { text: `Historical context`, isCorrect: 0, explanation: 'Not covered in this video.' },
        { text: `Practical examples`, isCorrect: 0, explanation: 'This is covered in the reading materials.' }
      ]
    });
  }
  
  return questions.slice(0, 3); // Return exactly 3 questions
}

async function generatePracticeQuizzes() {
  console.log('🚀 Starting practice quiz generation...\n');
  
  try {
    // Get all sessions
    const sessions = await prisma.session.findMany({
      include: {
        quizzes: true,
        videos: true,
        course: true,
      },
    });
    
    console.log(`📚 Found ${sessions.length} sessions in the database\n`);
    
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const session of sessions) {
      try {
        // Check if session already has a practice quiz
        const existingQuiz = session.quizzes.find((q: any) => !q.isExamMode);
        
        if (existingQuiz) {
          console.log(`⏭️  Skipping session "${session.title}" (ID: ${session.id}) - already has a practice quiz`);
          skippedCount++;
          continue;
        }
        
        // Generate questions based on session content
        const questions = generateQuestionsForSession(session);
        
        // Create the practice quiz
        const quiz = await prisma.quiz.create({
          data: {
            title: `Practice Quiz: ${session.title}`,
            description: `Practice quiz for session: ${session.title}. Test your understanding of the key concepts covered.`,
            courseId: session.courseId,
            sessionId: session.id,
            isExamMode: false,
            passingScore: 70,
            timeLimitMinutes: 15,
            maxAttempts: 3,
            randomizeQuestions: true,
            randomizeAnswers: true,
            allowReviewAfterSubmission: true,
            showExplanationAfterAnswer: true,
            questions: {
              create: questions.map(q => ({
                text: q.text,
                options: {
                  create: q.options.map((o: any) => ({
                    text: o.text,
                    isCorrect: o.isCorrect === 1,
                    explanation: o.explanation || null,
                  })),
                },
              })),
            },
          },
        });
        
        console.log(`✅ Created practice quiz for session "${session.title}" (ID: ${session.id}) - Quiz ID: ${quiz.id}`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Error creating quiz for session "${session.title}" (ID: ${session.id}):`, error);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Generation Summary:');
    console.log(`✅ Created: ${createdCount} practice quizzes`);
    console.log(`⏭️  Skipped: ${skippedCount} sessions (already have quizzes)`);
    console.log(`❌ Errors: ${errorCount} sessions`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Fatal error during quiz generation:', error);
    throw error;
  } finally {
    await closePrismaClient();
  }
}

// Run the script
generatePracticeQuizzes()
  .then(() => {
    console.log('\n✨ Practice quiz generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Practice quiz generation failed:', error);
    process.exit(1);
  });
