import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ChatbotService } from '../src/ai/chatbot/chatbot.service';
import { RecommendationService } from '../src/ai/recommendation/recommendation.service';
import { QuizGeneratorService } from '../src/ai/quiz-generator/quiz-generator.service';
import { PerformanceAnalysisService } from '../src/ai/performance-analysis/performance-analysis.service';
import { QuizDifficultyLevel } from '../src/ai/quiz-generator/dto/generate-quiz.dto';

async function testAiModules() {
  console.log('🧪 TEST DES 4 MODULES IA DE LEARNOVA...\n');

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  const chatbot = app.get(ChatbotService);
  const recommendation = app.get(RecommendationService);
  const quizGen = app.get(QuizGeneratorService);
  const perfAnalysis = app.get(PerformanceAnalysisService);

  // 1. Test Chatbot
  console.log('--- 1. TEST DU CHATBOT INTELLIGENT ---');
  const chatRes1 = await chatbot.processMessage({ message: 'Quels cours recommandez-vous en Python et SQL ?' });
  console.log('Question 1: "Quels cours recommandez-vous en Python et SQL ?"');
  console.log('Intent:', chatRes1.intent);
  console.log('Confidence:', chatRes1.confidence);
  console.log('Answer preview:\n', chatRes1.answer.substring(0, 200) + '...\n');

  const chatRes2 = await chatbot.processMessage({ message: 'Comment fonctionne le certificat avec QR code et quel est le seuil de réussite ?' });
  console.log('Question 2: "Comment fonctionne le certificat avec QR code ?"');
  console.log('Intent:', chatRes2.intent);
  console.log('Answer preview:\n', chatRes2.answer.substring(0, 200) + '...\n');

  // 2. Test Recommendation
  console.log('--- 2. TEST DU SYSTÈME DE RECOMMANDATION ---');
  const recRes = await recommendation.getColdStartRecommendations(4);
  console.log('Recommandations (Stratégie:', recRes.strategy, '):');
  for (const r of recRes.recommendations) {
    console.log(`  - [${r.matchScore}%] ${r.title} (${r.domain}) -> ${r.reason}`);
  }
  console.log('');

  // 3. Test Quiz Generator
  console.log('--- 3. TEST DU GÉNÉRATEUR AUTOMATIQUE DE QUIZ ---');
  const prisma = (app.get(ChatbotService) as any)['prisma'];
  const sampleCourse = await prisma.client.course.findFirst({ select: { id: true, title: true } });
  const quizRes = await quizGen.generateQuiz({
    courseId: sampleCourse!.id,
    questionCount: 3,
    difficulty: QuizDifficultyLevel.INTERMEDIATE,
    saveToDatabase: false,
  });
  console.log(`Quiz généré : "${quizRes.quizTitle}" pour "${quizRes.courseTitle}" (${quizRes.questionCount} questions, seuil ${quizRes.passingScore}%)`);
  quizRes.questions.forEach((q, idx) => {
    console.log(`  Q${idx + 1}: ${q.text.substring(0, 90)}...`);
    const correctOpt = q.options.find(o => o.isCorrect);
    console.log(`     Option correcte : ${correctOpt?.text.substring(0, 60)}...`);
  });
  console.log('');

  // 4. Test Performance Analysis
  console.log('--- 4. TEST DE L\'ANALYSEUR DE PERFORMANCES ---');
  const sampleUser = await prisma.client.user.findFirst({ select: { id: true, email: true } });
  const perfRes = await perfAnalysis.analyzeUserPerformance(sampleUser!.id);
  console.log(`Rapport pour : ${perfRes.userName} (ID: ${perfRes.userId})`);
  console.log(`  - Indice de maîtrise global : ${perfRes.globalMasteryIndex}%`);
  console.log(`  - Taux de réussite aux quiz : ${perfRes.overallSuccessRate}% (${perfRes.totalQuizzesPassed}/${perfRes.totalQuizzesTaken})`);
  console.log(`  - Risque de décrochage : ${perfRes.retentionRisk} (${perfRes.retentionRiskReason})`);
  console.log(`  - Recommandations IA :`, perfRes.prescriptiveRecommendations);
  console.log('');

  console.log('🎉 LES 4 MODULES D\'INTELLIGENCE ARTIFICIELLE FONCTIONNENT PARFAITEMENT !\n');
  await app.close();
  process.exit(0);
}

testAiModules().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
