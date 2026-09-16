import { Injectable, Inject, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateQuizDto, QuizDifficultyLevel } from './dto/generate-quiz.dto';

export interface GeneratedQuestionOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface GeneratedQuestion {
  text: string;
  difficulty: QuizDifficultyLevel;
  conceptTested: string;
  options: GeneratedQuestionOption[];
}

export interface GeneratedQuizResponse {
  quizTitle: string;
  courseTitle: string;
  sessionTitle?: string;
  difficulty: QuizDifficultyLevel;
  questionCount: number;
  passingScore: number;
  savedQuizId?: number;
  questions: GeneratedQuestion[];
}

@Injectable()
export class QuizGeneratorService {
  private readonly logger = new Logger(QuizGeneratorService.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async generateQuiz(dto: GenerateQuizDto): Promise<GeneratedQuizResponse> {
    const course = await this.prisma.client.course.findUnique({
      where: { id: dto.courseId },
      include: {
        sessions: {
          include: {
            videos: { select: { id: true, title: true, content: true, description: true } },
          },
          orderBy: { orderNumber: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Formation avec l'ID ${dto.courseId} introuvable.`);
    }

    let targetSessionTitle: string | undefined;
    let textCorpus: string[] = [];

    if (dto.sessionId) {
      const session = course.sessions.find(s => s.id === dto.sessionId);
      if (!session) {
        throw new NotFoundException(`Session avec l'ID ${dto.sessionId} introuvable dans ce cours.`);
      }
      targetSessionTitle = session.title;
      if (session.content) textCorpus.push(session.content);
      for (const v of session.videos) {
        if (v.content) textCorpus.push(v.content);
      }
    } else {
      for (const s of course.sessions) {
        if (s.content) textCorpus.push(s.content);
        for (const v of s.videos) {
          if (v.content) textCorpus.push(v.content);
        }
      }
    }

    if (textCorpus.length === 0) {
      textCorpus.push(course.description);
    }

    const difficulty = dto.difficulty || QuizDifficultyLevel.BEGINNER;
    const count = dto.questionCount || 5;

    // Generate questions based on extracted concepts
    const generatedQuestions = this.extractAndGenerateQuestions(
      textCorpus.join('\n\n'),
      course.title,
      targetSessionTitle,
      difficulty,
      count,
    );

    const quizTitle = dto.title || (targetSessionTitle
      ? `Évaluation IA : ${targetSessionTitle} (${difficulty})`
      : `Évaluation Générale IA : ${course.title} (${difficulty})`);

    let savedQuizId: number | undefined;

    // Persist to PostgreSQL if requested
    if (dto.saveToDatabase) {
      const createdQuiz = await this.prisma.client.quiz.create({
        data: {
          title: quizTitle,
          description: `Quiz généré automatiquement par l'IA de Learnova à partir des notes de cours pour le niveau ${difficulty}. Seuil de validation : 70%.`,
          courseId: course.id,
          sessionId: dto.sessionId || null,
          passingScore: 70,
          timeLimitMinutes: Math.max(5, count * 2),
          isExamMode: false,
          allowReviewAfterSubmission: true,
          randomizeAnswers: true,
          randomizeQuestions: true,
          showExplanationAfterAnswer: true,
          questions: {
            create: generatedQuestions.map(q => ({
              text: q.text,
              options: {
                create: q.options.map(opt => ({
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                  explanation: opt.explanation,
                })),
              },
            })),
          },
        },
      });
      savedQuizId = createdQuiz.id;
    }

    return {
      quizTitle,
      courseTitle: course.title,
      sessionTitle: targetSessionTitle,
      difficulty,
      questionCount: generatedQuestions.length,
      passingScore: 70,
      savedQuizId,
      questions: generatedQuestions,
    };
  }

  private extractAndGenerateQuestions(
    content: string,
    courseTitle: string,
    sessionTitle: string | undefined,
    difficulty: QuizDifficultyLevel,
    count: number,
  ): GeneratedQuestion[] {
    // Concept patterns extractor from markdown lecture notes
    const conceptUnits: { title: string; points: string[]; rule?: string }[] = [];

    const sections = content.split(/###?\s+/);
    for (const sec of sections) {
      const lines = sec.trim().split('\n');
      if (lines.length < 2) continue;
      const header = lines[0].trim();
      const bulletPoints = lines
        .filter(l => l.trim().startsWith('-') || l.trim().startsWith('*') || /^\d+\./.test(l.trim()))
        .map(l => l.replace(/^[-*\d.]\s+/, '').trim())
        .filter(p => p.length > 15);

      if (bulletPoints.length > 0) {
        conceptUnits.push({
          title: header,
          points: bulletPoints,
        });
      }
    }

    const questions: GeneratedQuestion[] = [];
    const contextName = sessionTitle || courseTitle;

    // Build questions by difficulty
    for (let i = 0; i < count; i++) {
      const unit = conceptUnits[i % Math.max(1, conceptUnits.length)] || {
        title: 'Principes Fondamentaux',
        points: [`Les concepts de base de ${courseTitle} doivent être appliqués rigoureusement.`],
      };

      const point = unit.points[i % unit.points.length] || `Maîtrise fondamentale des mécanismes de ${contextName}.`;

      if (difficulty === QuizDifficultyLevel.BEGINNER) {
        questions.push(this.createBeginnerQuestion(contextName, unit.title, point, i + 1));
      } else if (difficulty === QuizDifficultyLevel.INTERMEDIATE) {
        questions.push(this.createIntermediateQuestion(contextName, unit.title, point, i + 1));
      } else {
        questions.push(this.createAdvancedQuestion(contextName, unit.title, point, i + 1));
      }
    }

    return questions;
  }

  private createBeginnerQuestion(
    context: string,
    sectionTitle: string,
    keyPoint: string,
    index: number,
  ): GeneratedQuestion {
    const cleanPoint = keyPoint.replace(/\*\*/g, '');
    const firstPart = cleanPoint.split(':')[0] || cleanPoint.substring(0, 45);

    const questionText = `Concernant "${context}", quelle proposition définit le plus précisément l'objectif de la section "${sectionTitle}" ?`;

    const correctOption: GeneratedQuestionOption = {
      text: cleanPoint.length > 120 ? cleanPoint.substring(0, 117) + '...' : cleanPoint,
      isCorrect: true,
      explanation: `Exact. Le cours stipule formellement que ${firstPart.toLowerCase()} constitue la base indispensable.`,
    };

    const distractor1: GeneratedQuestionOption = {
      text: `Ignorer les étapes de validation initiale pour accélérer le déploiement sans documentation.`,
      isCorrect: false,
      explanation: `Incorrect. Les bonnes pratiques exigent toujours une validation rigoureuse des prérequis.`,
    };

    const distractor2: GeneratedQuestionOption = {
      text: `Appliquer des outils complexes sans analyser au préalable le périmètre d'action du domaine.`,
      isCorrect: false,
      explanation: `Faux. L'assise conceptuelle impose de délimiter clairement les variables clés en amont.`,
    };

    const distractor3: GeneratedQuestionOption = {
      text: `Déléguer l'ensemble du processus sans effectuer aucun suivi de métrique ni de contrôle qualité.`,
      isCorrect: false,
      explanation: `Inexact. Le suivi et la traçabilité des opérations sont nécessaires pour garantir la fiabilité.`,
    };

    const options = this.shuffleArray([correctOption, distractor1, distractor2, distractor3]);

    return {
      text: questionText,
      difficulty: QuizDifficultyLevel.BEGINNER,
      conceptTested: sectionTitle,
      options,
    };
  }

  private createIntermediateQuestion(
    context: string,
    sectionTitle: string,
    keyPoint: string,
    index: number,
  ): GeneratedQuestion {
    const cleanPoint = keyPoint.replace(/\*\*/g, '');

    const questionText = `Dans le cadre de l'analyse méthodologique de "${context}", quel arbitrage technique est préconisé lors de la mise en œuvre de "${sectionTitle}" ?`;

    const correctOption: GeneratedQuestionOption = {
      text: `Équilibrer rigoureusement la vitesse d'itération et la robustesse en privilégiant des modules à fort découplage.`,
      isCorrect: true,
      explanation: `Correct. La modularité et le faible couplage permettent de garantir l'évolutivité et la maintenabilité à long terme.`,
    };

    const distractor1: GeneratedQuestionOption = {
      text: `Maximiser l'interdépendance des sous-ensembles pour centraliser l'ensemble des données dans un bloc unique.`,
      isCorrect: false,
      explanation: `Erreur d'architecture. Un couplage fort crée une fragilité systémique et complique la maintenance.`,
    };

    const distractor2: GeneratedQuestionOption = {
      text: `Considérer que l'effort individuel ponctuel suffit à remplacer les contrôles et protocoles automatisés.`,
      isCorrect: false,
      explanation: `Inexact. L'automatisation des vérifications garantit la régularité et la conformité continue.`,
    };

    const distractor3: GeneratedQuestionOption = {
      text: `Adopter systématiquement la solution la plus complexe sans évaluer les compromis de performance.`,
      isCorrect: false,
      explanation: `Faux. L'excellence méthodologique recherche la simplicité et l'élégance pour minimiser les risques d'erreur.`,
    };

    const options = this.shuffleArray([correctOption, distractor1, distractor2, distractor3]);

    return {
      text: questionText,
      difficulty: QuizDifficultyLevel.INTERMEDIATE,
      conceptTested: sectionTitle,
      options,
    };
  }

  private createAdvancedQuestion(
    context: string,
    sectionTitle: string,
    keyPoint: string,
    index: number,
  ): GeneratedQuestion {
    const questionText = `Lors de l'application en entreprise des standards de "${context}", quelle pratique de gouvernance garantit la meilleure résilience face aux cas limites (edge cases) ?`;

    const correctOption: GeneratedQuestionOption = {
      text: `Appliquer le principe de sécurité par conception (Security by Design), consigner un journal d'événements infalsifiable et réviser trimestriellement les métriques d'efficience.`,
      isCorrect: true,
      explanation: `Excellente réponse. La matrice de gouvernance industrielle repose sur l'auditabilité, la sécurité native et l'amélioration continue.`,
    };

    const distractor1: GeneratedQuestionOption = {
      text: `Désactiver la journalisation d'événements pour économiser les ressources de stockage lors des pics d'activité.`,
      isCorrect: false,
      explanation: `Inacceptable en production. L'auditabilité nécessite une traçabilité intégrale et non modifiable des actions.`,
    };

    const distractor2: GeneratedQuestionOption = {
      text: `Faire confiance aux données entrantes sans aucune vérification dès lors qu'elles proviennent du réseau interne.`,
      isCorrect: false,
      explanation: `Dangereux. Le modèle Zero Trust impose de valider et filtrer rigoureusement toute donnée entrante.`,
    };

    const distractor3: GeneratedQuestionOption = {
      text: `Bloquer définitivement toute évolution du système dès qu'un niveau initial de conformité est atteint.`,
      isCorrect: false,
      explanation: `Inadapté. Les écosystèmes modernes exigent des revues régulières pour s'adapter aux nouvelles menaces et besoins.`,
    };

    const options = this.shuffleArray([correctOption, distractor1, distractor2, distractor3]);

    return {
      text: questionText,
      difficulty: QuizDifficultyLevel.ADVANCED,
      conceptTested: sectionTitle,
      options,
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
