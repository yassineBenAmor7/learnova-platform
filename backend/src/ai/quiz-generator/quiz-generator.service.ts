import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
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

interface ConceptTopic {
  title: string;
  category: string;
  details?: string;
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
            quizzes: {
              include: {
                questions: {
                  include: {
                    options: true,
                  },
                },
              },
            },
          },
          orderBy: { orderNumber: 'asc' },
        },
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Formation avec l'ID ${dto.courseId} introuvable.`);
    }

    let targetSessionTitle: string | undefined;
    let targetSession: (typeof course.sessions)[0] | undefined;

    if (dto.sessionId) {
      targetSession = course.sessions.find(s => s.id === dto.sessionId);
      if (!targetSession) {
        throw new NotFoundException(`Session avec l'ID ${dto.sessionId} introuvable dans ce cours.`);
      }
      targetSessionTitle = targetSession.title;
    }

    const difficulty = dto.difficulty || QuizDifficultyLevel.BEGINNER;
    const count = Math.min(20, Math.max(1, dto.questionCount || 5));

    const quizTitle = dto.title || (targetSessionTitle
      ? `Évaluation IA : ${targetSessionTitle} (${difficulty})`
      : `Évaluation Générale IA : ${course.title} (${difficulty})`);

    // Case 1: Saving pre-generated validated questions directly
    if (dto.saveToDatabase && dto.questions && Array.isArray(dto.questions) && dto.questions.length > 0) {
      const createdQuiz = await this.prisma.client.quiz.create({
        data: {
          title: quizTitle,
          description: `Quiz généré et validé via l'IA de Learnova pour le niveau ${difficulty}. Seuil de validation : 70%.`,
          courseId: course.id,
          sessionId: dto.sessionId || null,
          passingScore: 70,
          timeLimitMinutes: Math.max(5, dto.questions.length * 2),
          isExamMode: false,
          allowReviewAfterSubmission: true,
          randomizeAnswers: true,
          randomizeQuestions: true,
          showExplanationAfterAnswer: true,
          questions: {
            create: dto.questions.map((q: any) => ({
              text: q.text,
              options: {
                create: (q.options || []).map((opt: any) => ({
                  text: typeof opt === 'object' ? (opt.text || '') : String(opt || ''),
                  isCorrect: typeof opt === 'object' ? Boolean(opt.isCorrect) : false,
                  explanation: typeof opt === 'object' ? (opt.explanation || null) : null,
                })),
              },
            })),
          },
        },
      });

      return {
        quizTitle,
        courseTitle: course.title,
        sessionTitle: targetSessionTitle,
        difficulty,
        questionCount: dto.questions.length,
        passingScore: 70,
        savedQuizId: createdQuiz.id,
        questions: dto.questions,
      };
    }

    // Case 2: Generate brand new, non-redundant, diverse questions
    const generatedQuestions = this.extractAndGenerateQuestions(
      course,
      targetSession,
      difficulty,
      count,
    );

    let savedQuizId: number | undefined;

    // Persist to PostgreSQL if save was requested without explicit questions array
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
    course: any,
    targetSession: any | undefined,
    difficulty: QuizDifficultyLevel,
    count: number,
  ): GeneratedQuestion[] {
    const contextName = targetSession ? targetSession.title : course.title;
    const questions: GeneratedQuestion[] = [];
    const seenPrompts = new Set<string>();

    const normalize = (str: string) => str.trim().toLowerCase().replace(/[^\w\s]/g, '');

    // 1. Gather all existing high-quality questions from the course/session in database
    const existingDbQuestions: GeneratedQuestion[] = [];
    const candidateQuizzes = targetSession
      ? (targetSession.quizzes || [])
      : [
          ...(course.quizzes || []),
          ...course.sessions.flatMap((s: any) => s.quizzes || []),
        ];

    for (const qz of candidateQuizzes) {
      for (const q of qz.questions || []) {
        if (q.options && q.options.length >= 4 && q.options.some((o: any) => o.isCorrect)) {
          const correctOpt = q.options.find((o: any) => o.isCorrect);
          const distractors = q.options.filter((o: any) => !o.isCorrect);
          if (correctOpt && distractors.length >= 3) {
            existingDbQuestions.push({
              text: q.text,
              difficulty,
              conceptTested: targetSession?.title || course.title,
              options: this.shuffleArray([
                {
                  text: correctOpt.text,
                  isCorrect: true,
                  explanation: correctOpt.explanation || `Réponse exacte selon les normes du cours ${course.title}.`,
                },
                ...distractors.slice(0, 3).map((d: any) => ({
                  text: d.text,
                  isCorrect: false,
                  explanation: d.explanation || `Option incorrecte selon le référentiel pédagogique.`,
                })),
              ]),
            });
          }
        }
      }
    }

    // 2. Extract rich topics and concepts from sessions, videos, and lecture notes
    const topics: ConceptTopic[] = [];
    const relevantSessions = targetSession ? [targetSession] : course.sessions;

    for (const session of relevantSessions) {
      const cleanSessionTitle = this.cleanTitle(session.title);
      if (cleanSessionTitle.length > 3) {
        topics.push({
          title: cleanSessionTitle,
          category: 'Session',
          details: session.description || undefined,
        });
      }

      for (const video of session.videos || []) {
        const cleanVideoTitle = this.cleanTitle(video.title);
        if (cleanVideoTitle.length > 3 && cleanVideoTitle !== cleanSessionTitle) {
          topics.push({
            title: cleanVideoTitle,
            category: 'Leçon',
            details: video.description || undefined,
          });
        }

        // Extract markdown headers and key points from video content
        if (video.content) {
          const lines = video.content.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('#') || trimmed.startsWith('##') || trimmed.startsWith('###')) {
              const headerText = trimmed.replace(/^#+\s*/, '').trim();
              if (headerText.length > 5 && headerText.length < 80) {
                topics.push({
                  title: headerText,
                  category: 'Section Clé',
                });
              }
            } else if (trimmed.includes(':') && (trimmed.startsWith('-') || trimmed.startsWith('*'))) {
              const [key, val] = trimmed.replace(/^[-*]\s*/, '').split(':');
              if (key && val && key.trim().length > 4 && key.trim().length < 60) {
                topics.push({
                  title: key.trim().replace(/\*\*/g, ''),
                  category: 'Concept Fondamental',
                  details: val.trim().replace(/\*\*/g, ''),
                });
              }
            }
          }
        }
      }
    }

    // Fallback topics if course notes are minimal
    if (topics.length === 0) {
      topics.push(
        { title: `${course.title} - Architecture & Fondations`, category: 'Architecture' },
        { title: `${course.title} - Flux de données & Transformation`, category: 'Traitement' },
        { title: `${course.title} - Modélisation & Règles Métier`, category: 'Modélisation' },
        { title: `${course.title} - Optimisation des Performances`, category: 'Optimisation' },
        { title: `${course.title} - Sécurité & Gouvernance`, category: 'Sécurité' },
        { title: `${course.title} - Intégration & Bonnes Pratiques`, category: 'Bonnes Pratiques' },
      );
    }

    // Shuffle both pools to ensure different questions on every regeneration
    const shuffledDbQuestions = this.shuffleArray(existingDbQuestions);
    const shuffledTopics = this.shuffleArray(topics);

    // If we have DB questions, we can draw a balanced portion from them
    const maxDbQuestions = Math.min(Math.floor(count / 2), shuffledDbQuestions.length);
    for (let i = 0; i < maxDbQuestions; i++) {
      const candidate = shuffledDbQuestions[i];
      const norm = normalize(candidate.text);
      if (!seenPrompts.has(norm)) {
        seenPrompts.add(norm);
        questions.push(candidate);
      }
    }

    // Procedurally synthesize distinct questions across the unique topics
    let topicIndex = 0;
    let attemptCount = 0;
    const maxAttempts = count * 6;

    while (questions.length < count && attemptCount < maxAttempts) {
      attemptCount++;
      const currentTopic = shuffledTopics[topicIndex % shuffledTopics.length];
      topicIndex++;

      const questionArchetype = (questions.length + attemptCount) % 6;
      let generated: GeneratedQuestion;

      if (difficulty === QuizDifficultyLevel.BEGINNER) {
        generated = this.generateBeginnerArchetype(contextName, currentTopic, questionArchetype);
      } else if (difficulty === QuizDifficultyLevel.INTERMEDIATE) {
        generated = this.generateIntermediateArchetype(contextName, currentTopic, questionArchetype);
      } else {
        generated = this.generateAdvancedArchetype(contextName, currentTopic, questionArchetype);
      }

      const norm = normalize(generated.text);
      if (!seenPrompts.has(norm)) {
        seenPrompts.add(norm);
        questions.push(generated);
      }
    }

    return questions.slice(0, count);
  }

  // --- BEGINNER QUESTION ARCHETYPES (Foundational Knowledge & Definitions) ---
  private generateBeginnerArchetype(
    context: string,
    topic: ConceptTopic,
    archetype: number,
  ): GeneratedQuestion {
    const name = topic.title;
    let prompt = '';
    let correctText = '';
    let correctExp = '';
    let distractor1 = '';
    let exp1 = '';
    let distractor2 = '';
    let exp2 = '';
    let distractor3 = '';
    let exp3 = '';

    switch (archetype % 6) {
      case 0:
        prompt = `Concernant "${context}", quel est l'objectif fondamental visé par "${name}" ?`;
        correctText = topic.details
          ? `Comprendre et maîtriser les principes de base : ${topic.details.substring(0, 110)}.`
          : `Acquérir la maîtrise méthodologique et conceptuelle de "${name}" pour poser des bases fiables.`;
        correctExp = `Exact. La maîtrise de "${name}" constitue un socle d'apprentissage indispensable.`;
        distractor1 = `Ignorer délibérément les prérequis pour accélérer l'exécution sans structure.`;
        exp1 = `Faux. L'apprentissage rigoureux exige l'assimilation progressive des prérequis.`;
        distractor2 = `Remplacer l'ensemble des modules d'analyse par une approche intuitive sans validation.`;
        exp2 = `Incorrect. Une méthodologie structurée est requise pour assurer la cohérence.`;
        distractor3 = `Limiter l'apprentissage à la mémorisation de termes sans en comprendre le fonctionnement.`;
        exp3 = `Inexact. La compétence repose sur la compréhension des mécanismes et non sur la seule mémorisation.`;
        break;

      case 1:
        prompt = `Dans le programme "${context}", quelle proposition caractérise le plus précisément "${name}" ?`;
        correctText = `Un composant clé structurant qui permet d'organiser et de clarifier le flux de travail.`;
        correctExp = `Correct. "${name}" joue un rôle de cadrage essentiel dans ce parcours.`;
        distractor1 = `Une procédure obsolète conservée uniquement à des fins d'archive sans utilité pratique.`;
        exp1 = `Faux. Ce module fait partie intégrante du programme d'apprentissage actuel.`;
        distractor2 = `Un outil externe facultatif n'ayant aucun lien avec les évaluations certifiantes.`;
        exp2 = `Inexact. Les compétences associées sont évaluées pour l'obtention de la certification.`;
        distractor3 = `Un mécanisme secondaire remplaçant automatiquement l'intervention humaine sans paramétrage.`;
        exp3 = `Incorrect. La maîtrise des fondamentaux exige un paramétrage conscient et rigoureux.`;
        break;

      case 2:
        prompt = `Quelle étape initiale est indispensable lors de la prise en main de "${name}" ?`;
        correctText = `Identifier les éléments clés et configurer l'environnement selon les recommandations du cours.`;
        correctExp = `Excellente réponse. La préparation de l'environnement est le prérequis de toute manipulation réussie.`;
        distractor1 = `Lancer l'exécution sans vérifier les sources ni les paramètres d'initialisation.`;
        exp1 = `Dangereux. Cela conduit systématiquement à des erreurs de configuration.`;
        distractor2 = `Désactiver l'ensemble des contrôles de sécurité et d'intégrité pour simplifier le test.`;
        exp2 = `Erreur critique. Les protocoles de contrôle doivent être maintenus actifs.`;
        distractor3 = `Supprimer les dépendances requises pour réduire artificiellement la taille du projet.`;
        exp3 = `Faux. La suppression des dépendances compromet le fonctionnement de l'ensemble.`;
        break;

      case 3:
        prompt = `Pourquoi est-il crucial pour un apprenant de valider ses connaissances sur "${name}" ?`;
        correctText = `Car ces notions fondamentales conditionnent la réussite des sessions avancées et de l'examen certifiant.`;
        correctExp = `Parfaitement exact. L'assimilation de ces concepts conditionne les compétences avancées futures.`;
        distractor1 = `Parce que ce module est totalement indépendant du reste de la formation.`;
        exp1 = `Faux. Le cursus Learnova est progressif et interconnecté.`;
        distractor2 = `Pour obtenir automatiquement un score parfait sans passer les autres épreuves.`;
        exp2 = `Incorrect. La validation requiert de compléter l'intégralité du programme avec 70% de réussite.`;
        distractor3 = `Pour éliminer le besoin de consulter la documentation technique.`;
        exp3 = `Inexact. La consultation de la documentation reste une bonne pratique permanente.`;
        break;

      case 4:
        prompt = `Parmi les propositions suivantes, quelle est la règle d'or énoncée dans "${name}" ?`;
        correctText = `Adopter une démarche méthodique, documenter les choix et respecter les conventions établies.`;
        correctExp = `Très bien. La rigueur documentaire et le respect des conventions garantissent la qualité.`;
        distractor1 = `Éviter toute normalisation afin de préserver une liberté totale sans standard.`;
        exp1 = `Faux. Les standards garantissent la lisibilité et l'interopérabilité des travaux.`;
        distractor2 = `Confier l'intégralité des vérifications au hasard sans protocoles de relecture.`;
        exp2 = `Inacceptable. La qualité repose sur des vérifications systématiques.`;
        distractor3 = `Modifier les paramètres critiques en cours d'exécution sans enregistrer de version stable.`;
        exp3 = `Incorrect. La traçabilité et le versioning sont indispensables.`;
        break;

      default:
        prompt = `Dans le cadre de "${context}", quelle est la finalité principale abordée dans "${name}" ?`;
        correctText = `Structurer les connaissances de base pour résoudre des problématiques concrètes et progresser avec assurance.`;
        correctExp = `Exact. Cette section consolide l'aptitude pratique de l'apprenant.`;
        distractor1 = `Complexifier inutilement le processus d'apprentissage par des exercices purement abstraits.`;
        exp1 = `Faux. L'approche pédagogique de Learnova est orientée vers la pratique métier.`;
        distractor2 = `Isoler l'étudiant de la communauté sans possibilité d'échange ou de révision.`;
        exp2 = `Inexact. La révision pédagogique et l'accompagnement font partie de l'expérience.`;
        distractor3 = `Empêcher toute utilisation des outils modernes pour privilégier des méthodes manuelles lentes.`;
        exp3 = `Incorrect. La formation enseigne l'utilisation des outils et standards contemporains.`;
        break;
    }

    return {
      text: prompt,
      difficulty: QuizDifficultyLevel.BEGINNER,
      conceptTested: name,
      options: this.shuffleArray([
        { text: correctText, isCorrect: true, explanation: correctExp },
        { text: distractor1, isCorrect: false, explanation: exp1 },
        { text: distractor2, isCorrect: false, explanation: exp2 },
        { text: distractor3, isCorrect: false, explanation: exp3 },
      ]),
    };
  }

  // --- INTERMEDIATE QUESTION ARCHETYPES (Application, Method & Trade-offs) ---
  private generateIntermediateArchetype(
    context: string,
    topic: ConceptTopic,
    archetype: number,
  ): GeneratedQuestion {
    const name = topic.title;
    let prompt = '';
    let correctText = '';
    let correctExp = '';
    let distractor1 = '';
    let exp1 = '';
    let distractor2 = '';
    let exp2 = '';
    let distractor3 = '';
    let exp3 = '';

    switch (archetype % 6) {
      case 0:
        prompt = `Dans le cadre de l'application technique de "${context}", quelle démarche méthodologique garantit l'efficacité optimale de "${name}" ?`;
        correctText = `Équilibrer rigoureusement la modularité et la performance en appliquant des règles de découplage propres.`;
        correctExp = `Correct. Le découplage des composants garantit la réutilisabilité et la maintenabilité à long terme.`;
        distractor1 = `Fusionner l'intégralité des données et de la logique dans un bloc unique monolithique.`;
        exp1 = `Erreur d'architecture. La centralisation excessive génère une dette technique majeure.`;
        distractor2 = `Ignorer les temps de réponse initiaux en supposant que l'infrastructure compensera toujours.`;
        exp2 = `Incorrect. L'optimisation algorithmique et structurelle doit être pensée dès la conception.`;
        distractor3 = `Multiplier les dépendances circulaires entre modules pour forcer la synchronisation.`;
        exp3 = `Faux. Les dépendances circulaires provoquent des blocages et des comportements imprévisibles.`;
        break;

      case 1:
        prompt = `Face à une anomalie ou un résultat incohérent dans "${name}", quel arbitrage de diagnostic est préconisé ?`;
        correctText = `Isoler les entrées, vérifier les transformations intermédiaires et valider la cohérence des schémas étape par étape.`;
        correctExp = `Excellente méthode. L'isolation des composants permet d'identifier précisément l'origine du défaut.`;
        distractor1 = `Réinitialiser l'ensemble de la base sans analyser les logs ni les traces d'erreur.`;
        exp1 = `Inapproprié. Cela détruit les preuves indispensables à la compréhension du problème.`;
        distractor2 = `Forcer manuellement les sorties pour masquer l'anomalie sans corriger la cause sous-jacente.`;
        exp2 = `Dangereux. Masquer une anomalie fragilise l'ensemble du système en aval.`;
        distractor3 = `Désactiver systématiquement les alertes et les métriques de contrôle de qualité.`;
        exp3 = `Inacceptable. Les alertes sont essentielles pour prévenir les régressions futures.`;
        break;

      case 2:
        prompt = `Quel compromis (trade-off) technique doit être analysé lors de la configuration de "${name}" ?`;
        correctText = `Le ratio entre la consommation de ressources (mémoire/calcul) et la réactivité requise par les utilisateurs.`;
        correctExp = `Exact. Tout dimensionnement technique implique de concilier coût en ressources et expérience utilisateur.`;
        distractor1 = `Le choix entre respecter les exigences légales ou supprimer toute sécurité pour gagner 1% de vitesse.`;
        exp1 = `Inacceptable. La conformité réglementaire et la sécurité ne sont jamais négociables.`;
        distractor2 = `Remplacer les tests unitaires automatisés par des suppositions théoriques pour gagner du temps.`;
        exp2 = `Faux. La couverture de tests est indispensable à la robustesse opérationnelle.`;
        distractor3 = `Privilégier la complexité maximale pour décourager les modifications des collègues.`;
        exp3 = `Anti-pattern. La simplicité et la clarté du code sont les marques de l'excellence professionnelle.`;
        break;

      case 3:
        prompt = `Comment structurer la gestion des flux de données dans "${name}" pour prévenir les goulets d'étranglement ?`;
        correctText = `Mettre en œuvre des pipelines asynchrones ou par lots (batching) avec contrôle de flux (backpressure).`;
        correctExp = `Parfait. La gestion du rythme de traitement évite la saturation de la mémoire et des files d'attente.`;
        distractor1 = `Effectuer des requêtes synchrones bloquantes en continu sur la source de production principale.`;
        exp1 = `Mauvaise pratique. Cela induit des blocages et des ralentissements critiques en production.`;
        distractor2 = `Désactiver la mise en cache (caching) pour forcer le recalcul systématique de chaque élément.`;
        exp2 = `Inadapté. Le cache judicieux est indispensable pour soulager les ressources de calcul.`;
        distractor3 = `Stocker l'ensemble des données volatiles dans des fichiers temporaires sans indexation.`;
        exp3 = `Inapproprié. Les structures indexées et managées sont requises pour des temps d'accès prévisibles.`;
        break;

      case 4:
        prompt = `Quelle bonne pratique de validation assure la pérennité des résultats produits par "${name}" ?`;
        correctText = `Définir des jeux de tests de régression automatisés et comparer les sorties avec des valeurs étalons certifiées.`;
        correctExp = `Très bien. Les tests de non-régression automatisés garantissent la stabilité des livrables.`;
        distractor1 = `Se fier exclusivement à l'absence de réclamation immédiate des utilisateurs finaux.`;
        exp1 = `Insuffisant. Une validation proactive évite la propagation d'erreurs silencieuses.`;
        distractor2 = `Modifier les critères de validation au fur et à mesure pour toujours obtenir 100% de réussite.`;
        exp2 = `Invalide. Les critères d'acceptation doivent être stricts, documentés et immuables.`;
        distractor3 = `Supprimer l'historique des versions pour ne conserver que la dernière exécution sans traçabilité.`;
        exp3 = `Faux. L'auditabilité nécessite un historique complet et versionné.`;
        break;

      default:
        prompt = `Dans le cadre de l'optimisation continue de "${context}", quelle initiative renforce la valeur de "${name}" ?`;
        correctText = `Automatiser les tâches récurrentes, standardiser les conventions de nommage et réviser les métriques d'efficience.`;
        correctExp = `Exact. L'industrialisation des processus garantit régularité, qualité et gain de temps.`;
        distractor1 = `Multiplier les interventions manuelles ad hoc à chaque cycle de production.`;
        exp1 = `Inadapté. Les tâches manuelles répétitives sont sources majeures d'erreurs humaines.`;
        distractor2 = `Utiliser des formats de données propriétaires et fermés pour empêcher toute interopérabilité.`;
        exp2 = `Erreur. L'interopérabilité et les formats standards sont essentiels pour l'évolutivité.`;
        distractor3 = `Déléguer la gouvernance technique à des tiers non habilités sans convention de service (SLA).`;
        exp3 = `Incorrect. La gouvernance doit rester maîtrisée et encadrée par des contrats de niveau de service.`;
        break;
    }

    return {
      text: prompt,
      difficulty: QuizDifficultyLevel.INTERMEDIATE,
      conceptTested: name,
      options: this.shuffleArray([
        { text: correctText, isCorrect: true, explanation: correctExp },
        { text: distractor1, isCorrect: false, explanation: exp1 },
        { text: distractor2, isCorrect: false, explanation: exp2 },
        { text: distractor3, isCorrect: false, explanation: exp3 },
      ]),
    };
  }

  // --- ADVANCED QUESTION ARCHETYPES (Enterprise Governance, Resilience & Edge Cases) ---
  private generateAdvancedArchetype(
    context: string,
    topic: ConceptTopic,
    archetype: number,
  ): GeneratedQuestion {
    const name = topic.title;
    let prompt = '';
    let correctText = '';
    let correctExp = '';
    let distractor1 = '';
    let exp1 = '';
    let distractor2 = '';
    let exp2 = '';
    let distractor3 = '';
    let exp3 = '';

    switch (archetype % 6) {
      case 0:
        prompt = `Lors du déploiement en entreprise des standards de "${context}", quelle pratique de gouvernance garantit la meilleure résilience face aux cas limites (edge cases) dans "${name}" ?`;
        correctText = `Appliquer le principe de sécurité par conception (Security by Design), consigner un journal d'audit infalsifiable et réviser périodiquement les métriques d'efficience.`;
        correctExp = `Excellente réponse. La matrice de gouvernance industrielle repose sur l'auditabilité, la sécurité native et l'amélioration continue.`;
        distractor1 = `Désactiver la journalisation d'événements pour économiser les ressources de stockage lors des pics d'activité.`;
        exp1 = `Inacceptable en production. L'auditabilité nécessite une traçabilité intégrale et non modifiable des actions.`;
        distractor2 = `Faire confiance aux données entrantes sans aucune vérification dès lors qu'elles proviennent du réseau interne.`;
        exp2 = `Dangereux. Le modèle Zero Trust impose de valider et filtrer rigoureusement tout flux entrant.`;
        distractor3 = `Bloquer définitivement toute évolution du système dès qu'un niveau initial de conformité est atteint.`;
        exp3 = `Inadapté. Les écosystèmes modernes exigent des revues régulières pour s'adapter aux nouvelles menaces et besoins.`;
        break;

      case 1:
        prompt = `Dans une architecture à haute disponibilité liée à "${name}", comment prévenir les pannes en cascade lors d'une dégradation de service ?`;
        correctText = `Implémenter des disjoncteurs (circuit breakers), des mécanismes de délestage (load shedding) et des politiques de repli (graceful degradation).`;
        correctExp = `Très bien. Les circuit breakers isolent les pannes locales et empêchent l'effondrement global de la chaîne de valeur.`;
        distractor1 = `Augmenter indéfiniment les délais d'attente (timeouts) et les tentatives de réessai simultanées sans temporisation.`;
        exp1 = `Critique. Cela amplifie l'engorgement et provoque l'effet falaise (thundering herd problem).`;
        distractor2 = `Détruire et recréer à chaud l'intégralité du cluster à chaque erreur mineure constatée.`;
        exp2 = `Catastrophique. Cela interrompt le service pour l'ensemble des utilisateurs légitimes.`;
        distractor3 = `Router tout le trafic en échec vers une file d'attente unique non monitorée en mémoire vive.`;
        exp3 = `Inapproprié. Une file mémoire non monitorée entraîne une saturation inévitable (OOM Crash).`;
        break;

      case 2:
        prompt = `Concernant la sécurité avancée et la conformité des flux dans "${name}", quel protocole est impératif en milieu financier ou stratégique ?`;
        correctText = `Chiffrement de bout en bout (at-rest & in-transit), authentification mutuelle (mTLS) et contrôle d'accès basé sur les rôles à granularité fine (RBAC/ABAC).`;
        correctExp = `Parfait. L'approche multicouche protège les actifs critiques même en cas de brèche sur un sous-système.`;
        distractor1 = `Partager un compte administrateur racine commun avec des clés d'accès statiques non renouvelées.`;
        exp1 = `Violation de sécurité majeure. L'imputabilité exige des identifiants individuels éphémères.`;
        distractor2 = `Désactiver le chiffrement interne sous prétexte que le périmètre réseau physique est sous surveillance.`;
        exp2 = `Contraire aux standards Zero Trust. La défense en profondeur exige le chiffrement de tout canal.`;
        distractor3 = `Autoriser la lecture publique des schémas de données pour simplifier l'intégration des partenaires.`;
        exp3 = `Dangereux. L'exposition non contrôlée des métadonnées facilite la reconnaissance offensive.`;
        break;

      case 3:
        prompt = `Face à un volume massif de données hétérogènes dans "${name}", quelle stratégie de modélisation assure des temps de réponse prévisibles ?`;
        correctText = `Partitionner judicieusement les entités, précalculer les agrégations clés et maintenir des index sélectifs alignés sur les profils de requêtes.`;
        correctExp = `Excellente maîtrise. Le partitionnement et l'indexation adaptée évitent les scans intégraux coûteux.`;
        distractor1 = `Exécuter des jointures cartésiennes systématiques sans clause de filtrage temporel ou dimensionnel.`;
        exp1 = `Désastreux pour les performances. Cela génère des explosions combinatoires de données.`;
        distractor2 = `Interdire le partitionnement pour forcer l'ensemble des données dans une seule table sans segment.`;
        exp2 = `Inadapté à l'échelle industrielle. Les tables monolithiques dégradent rapidement la scalabilité.`;
        distractor3 = `Effectuer des tris dynamiques globaux en temps réel sur des colonnes non indexées de type texte libre.`;
        exp3 = `Inopérant sous forte charge. Les tris textuels sans index consomment une mémoire prohibitive.`;
        break;

      case 4:
        prompt = `Quel anti-pattern critique d'architecture doit être formellement proscrit lors de l'intégration poussée de "${name}" ?`;
        correctText = `Le couplage fort par base de données partagée (Shared Database Anti-Pattern) sans contrat d'API documenté ni versionné.`;
        correctExp = `Exact. Les bases partagées sans abstraction brisent l'indépendance des déploiements et figent les schémas.`;
        distractor1 = `L'adoption de contrats d'API stricts avec validation sémantique des payloads.`;
        exp1 = `Faux. C'est au contraire une excellente pratique favorisant le découplage et la robustesse.`;
        distractor2 = `La mise en place de revues de code systématiques et de tests d'intégration continus.`;
        exp2 = `Inexact. L'intégration continue est un pilier de l'ingénierie logicielle moderne.`;
        distractor3 = `La surveillance continue de la latence au 99e percentile (p99 latency) par télémétrie.`;
        exp3 = `Faux. Le monitoring du p99 est crucial pour détecter les dégradations subies par les utilisateurs extrêmes.`;
        break;

      default:
        prompt = `Dans le cadre de l'auditabilité et de la conformité réglementaire de "${name}", quelle exigence est non négociable ?`;
        correctText = `Maintenir une traçabilité immuable des mutations d'état avec horodatage cryptographique et droit de regard supervisé.`;
        correctExp = `Très bien. La preuve d'intégrité temporelle et l'immuabilité sont les clés de voûte des audits réglementaires.`;
        distractor1 = `Permettre la réécriture manuelle des journaux pour corriger les historiques en cas d'erreur de saisie.`;
        exp1 = `Illégal en audit. Les journaux d'audit ne doivent en aucun cas pouvoir être altérés ou modifiés.`;
        distractor2 = `Détruire les logs après 24 heures pour éviter toute responsabilité en cas de litige judiciaire.`;
        exp2 = `Non conforme. Les normes (RGPD, ISO 27001, SOX) imposent des durées de rétention légales strictes.`;
        distractor3 = `Consigner les mots de passe et secrets d'authentification en clair dans les journaux de debug.`;
        exp3 = `Faille critique. Les secrets ne doivent jamais transiter ni être persistés dans les logs d'application.`;
        break;
    }

    return {
      text: prompt,
      difficulty: QuizDifficultyLevel.ADVANCED,
      conceptTested: name,
      options: this.shuffleArray([
        { text: correctText, isCorrect: true, explanation: correctExp },
        { text: distractor1, isCorrect: false, explanation: exp1 },
        { text: distractor2, isCorrect: false, explanation: exp2 },
        { text: distractor3, isCorrect: false, explanation: exp3 },
      ]),
    };
  }

  private cleanTitle(title: string): string {
    return (title || '')
      .replace(/^Session\s+\d+:\s*/i, '')
      .replace(/^Leçon\s+\d+:\s*/i, '')
      .replace(/^Vidéo\s+\d+:\s*/i, '')
      .replace(/^Chapitre\s+\d+:\s*/i, '')
      .replace(/^Module\s+\d+:\s*/i, '')
      .replace(/^Introduction to\s+/i, '')
      .replace(/^Introduction à\s+/i, '')
      .trim();
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
