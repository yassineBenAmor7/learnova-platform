import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatQueryDto } from './dto/chat-query.dto';

export interface ChatAction {
  label: string;
  url: string;
  type: 'link' | 'course' | 'exam' | 'certificate';
}

export interface ChatbotResponse {
  answer: string;
  intent: 'course_query' | 'pedagogical_concept' | 'platform_navigation' | 'recommendation' | 'general';
  confidence: number;
  sources?: { courseTitle: string; sessionTitle?: string; videoTitle?: string; courseId: number }[];
  actions?: ChatAction[];
  suggestions?: string[];
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async processMessage(dto: ChatQueryDto, userId?: number): Promise<ChatbotResponse> {
    const rawMessage = dto.message.trim();
    const lowerMessage = rawMessage.toLowerCase();

    // 1. Check Platform Navigation / Rules Intents
    const platformAnswer = this.detectPlatformNavigation(lowerMessage);
    if (platformAnswer) {
      return platformAnswer;
    }

    // 2. Check Contextual Query if user is currently inside a Course or Session
    if (dto.courseId) {
      const courseAnswer = await this.handleCourseContextualQuery(dto.courseId, dto.sessionId, lowerMessage, rawMessage);
      if (courseAnswer) {
        return courseAnswer;
      }
    }

    // 3. Check for specific Pedagogical Concept Search across Video Lecture Notes (RAG)
    const pedagogicalAnswer = await this.searchPedagogicalNotes(rawMessage, lowerMessage);
    if (pedagogicalAnswer) {
      return pedagogicalAnswer;
    }

    // 4. Check Course Catalog & Domain Search
    const catalogAnswer = await this.searchCourseCatalog(rawMessage, lowerMessage);
    if (catalogAnswer) {
      return catalogAnswer;
    }

    // 5. Default Intelligent Fallback with Suggested Actions
    return {
      answer: `Je suis l'assistant pédagogique intelligent de **Learnova**.\n\n` +
        `Je peux vous aider à :\n` +
        `- **Explorer nos 108 formations** dans 14 domaines (Informatique, Finance, Management, Design, etc.).\n` +
        `- **Comprendre un concept** technique abordé dans nos leçons et notes de cours.\n` +
        `- **Vous orienter sur la plateforme** (mode examen, certificats avec QR code, système de points et badges).\n\n` +
        `Comment puis-je vous accompagner dans votre parcours aujourd'hui ?`,
      intent: 'general',
      confidence: 0.7,
      suggestions: [
        'Quels cours sont disponibles en Intelligence Artificielle ?',
        'Comment obtenir un certificat vérifiable ?',
        'Quelles sont les règles du mode examen ?',
        'Conseille-moi une formation pour débuter',
      ],
      actions: [
        { label: 'Explorer le Catalogue', url: '/courses', type: 'link' },
        { label: 'Voir mon Tableau de Bord', url: '/dashboard', type: 'link' },
      ],
    };
  }

  private detectPlatformNavigation(query: string): ChatbotResponse | null {
    // Certificats & QR Code
    if (query.includes('certificat') || query.includes('qr code') || query.includes('attestation') || query.includes('diplome')) {
      return {
        answer: `Sur **Learnova**, l'obtention d'un certificat répond à des exigences rigoureuses :\n\n` +
          `1. **Parcours complet** : Vous devez compléter l'ensemble des sessions pédagogiques du cours.\n` +
          `2. **Examen Final** : Vous devez réussir l'examen final de 40 questions avec un score minimal de **70%**.\n` +
          `3. **Authenticité & Code QR** : Chaque certificat délivré comporte un identifiant unique ainsi qu'un **code QR scannable** permettant une vérification publique instantanée sur la page officielle de validation en ligne.`,
        intent: 'platform_navigation',
        confidence: 0.95,
        actions: [
          { label: 'Mes Certificats', url: '/certificates', type: 'certificate' },
          { label: 'Vérifier un Certificat', url: '/certificates/verify/demo', type: 'link' },
        ],
        suggestions: [
          'Quelles sont les règles du mode examen ?',
          'Combien de questions comporte l\'examen final ?',
          'Comment suivre ma progression ?',
        ],
      };
    }

    // Mode Examen
    if (query.includes('examen') || query.includes('exam mode') || query.includes('chronometre') || query.includes('timer')) {
      return {
        answer: `Le **Mode Examen** de Learnova simule les conditions d'une évaluation professionnelle certifiante :\n\n` +
          `- **Évaluation stricte** : Chaque examen final comporte **40 questions** réparties sur l'ensemble du programme.\n` +
          `- **Chronomètre intégré** : Le temps est décompté automatiquement.\n` +
          `- **Seuil d'exigence** : Le score minimal requis pour valider et décrocher le certificat est de **70%**.\n` +
          `- **Correction détaillée** : À la fin de l'épreuve, un rapport d'analyse vous présente vos points forts et axes d'amélioration.`,
        intent: 'platform_navigation',
        confidence: 0.95,
        actions: [
          { label: 'Accéder aux Formations', url: '/courses', type: 'link' },
        ],
        suggestions: [
          'Comment obtenir un certificat vérifiable ?',
          'Comment fonctionne la gamification ?',
        ],
      };
    }

    // Gamification, Streaks, Badges, Points
    if (query.includes('point') || query.includes('badge') || query.includes('streak') || query.includes('niveau') || query.includes('gamification')) {
      return {
        answer: `Le système de **Gamification** de Learnova encourage la régularité et l'engagement continu :\n\n` +
          `- **Points d'expérience (XP)** : Gagnés à chaque vidéo visionnée, session validée et quiz réussi.\n` +
          `- **Séries quotidiennes (Streaks)** : Suivi des jours consécutifs d'apprentissage pour renforcer votre persévérance.\n` +
          `- **Badges d'accomplissement** : 35 badges exclusifs à débloquer selon vos jalons (ex: *Bronze Scholar*, *Quiz Master*, *Fast Learner*).\n` +
          `- **Niveaux d'apprentissage** : Évolution automatique de Débutant à Légende au fil de votre investissement.`,
        intent: 'platform_navigation',
        confidence: 0.95,
        actions: [
          { label: 'Consulter mon Profil & Badges', url: '/profile', type: 'link' },
          { label: 'Mon Dashboard', url: '/dashboard', type: 'link' },
        ],
        suggestions: [
          'Comment augmenter mon niveau rapidement ?',
          'Comment sont calculées les séries (streaks) ?',
        ],
      };
    }

    return null;
  }

  private async handleCourseContextualQuery(
    courseId: number,
    sessionId: number | undefined,
    lowerMessage: string,
    rawMessage: string,
  ): Promise<ChatbotResponse | null> {
    const course = await this.prisma.client.course.findUnique({
      where: { id: courseId },
      include: {
        sessions: {
          include: {
            videos: { select: { id: true, title: true, content: true, description: true } },
            quizzes: { select: { id: true, title: true, passingScore: true } },
          },
          orderBy: { orderNumber: 'asc' },
        },
      },
    });

    if (!course) return null;

    // Specific question about the current session's videos/notes
    if (sessionId) {
      const activeSession = course.sessions.find(s => s.id === sessionId);
      if (activeSession) {
        for (const video of activeSession.videos) {
          if (video.content && this.calculateOverlap(lowerMessage, video.content.toLowerCase()) > 0.15) {
            const excerpt = this.extractRelevantExcerpt(video.content, lowerMessage);
            return {
              answer: `Dans le cadre de la session **"${activeSession.title}"** (Leçon : *${video.title}*) :\n\n${excerpt}\n\n` +
                `*Ce concept est directement approfondi dans le guide d'étude de cette vidéo.*`,
              intent: 'pedagogical_concept',
              confidence: 0.9,
              sources: [{
                courseTitle: course.title,
                sessionTitle: activeSession.title,
                videoTitle: video.title,
                courseId: course.id,
              }],
              actions: [
                { label: 'Ouvrir la Leçon', url: `/courses/${course.id}/learn?session=${activeSession.id}&video=${video.id}`, type: 'course' },
              ],
            };
          }
        }
      }
    }

    return null;
  }

  private async searchPedagogicalNotes(rawMessage: string, lowerMessage: string): Promise<ChatbotResponse | null> {
    const keywords = this.extractSignificantKeywords(lowerMessage);
    if (keywords.length === 0) return null;

    // Search videos whose content contains significant keywords
    const matchingVideos = await this.prisma.client.video.findMany({
      where: {
        AND: keywords.slice(0, 3).map(kw => ({
          OR: [
            { content: { contains: kw, mode: 'insensitive' } },
            { title: { contains: kw, mode: 'insensitive' } },
            { description: { contains: kw, mode: 'insensitive' } },
          ],
        })),
      },
      include: {
        session: {
          include: {
            course: { select: { id: true, title: true, domain: true, level: true } },
          },
        },
      },
      take: 3,
    });

    if (matchingVideos.length > 0) {
      const bestMatch = matchingVideos[0];
      const excerpt = bestMatch.content ? this.extractRelevantExcerpt(bestMatch.content, lowerMessage) : bestMatch.description;

      return {
        answer: `Voici ce qu'enseigne le cours **"${bestMatch.session.course.title}"** à propos de votre question :\n\n` +
          `**Session : ${bestMatch.session.title}**\n` +
          `**Leçon : ${bestMatch.title}**\n\n` +
          `${excerpt}\n\n` +
          `Vous pouvez consulter l'intégralité du module et de ses notes de cours interactives sur la plateforme.`,
        intent: 'pedagogical_concept',
        confidence: 0.88,
        sources: matchingVideos.map(v => ({
          courseTitle: v.session.course.title,
          sessionTitle: v.session.title,
          videoTitle: v.title,
          courseId: v.session.course.id,
        })),
        actions: [
          { label: `Accéder à "${bestMatch.session.course.title}"`, url: `/courses/${bestMatch.session.course.id}/learn`, type: 'course' },
        ],
        suggestions: [
          'Quels sont les prérequis pour ce cours ?',
          'Comment se déroule le quiz associé ?',
        ],
      };
    }

    return null;
  }

  private async searchCourseCatalog(rawMessage: string, lowerMessage: string): Promise<ChatbotResponse | null> {
    const keywords = this.extractSignificantKeywords(lowerMessage);
    if (keywords.length === 0) return null;

    const matchedCourses = await this.prisma.client.course.findMany({
      where: {
        OR: keywords.map(kw => ({
          OR: [
            { title: { contains: kw, mode: 'insensitive' } },
            { description: { contains: kw, mode: 'insensitive' } },
            { domain: { contains: kw, mode: 'insensitive' } },
          ],
        })),
      },
      select: {
        id: true,
        title: true,
        description: true,
        domain: true,
        level: true,
        price: true,
        isPaid: true,
      },
      take: 4,
    });

    if (matchedCourses.length > 0) {
      const courseList = matchedCourses
        .map(c => `- **[${c.title}](/courses/${c.id})** (${c.level}, ${c.domain.replace('_', ' ')}) : ${c.description.substring(0, 110)}...`)
        .join('\n');

      return {
        answer: `J'ai trouvé **${matchedCourses.length} formation(s)** correspondant à votre recherche sur le catalogue Learnova :\n\n` +
          `${courseList}\n\n` +
          `Souhaitez-vous explorer l'un de ces cours ou adapter les critères selon votre niveau ?`,
        intent: 'course_query',
        confidence: 0.9,
        actions: matchedCourses.map(c => ({
          label: c.title.length > 30 ? c.title.substring(0, 27) + '...' : c.title,
          url: `/courses/${c.id}`,
          type: 'course',
        })),
        suggestions: [
          'Afficher les cours pour Débutant',
          'Comment se déroule la certification ?',
        ],
      };
    }

    return null;
  }

  private extractSignificantKeywords(text: string): string[] {
    const stopWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'ce', 'cet', 'cette', 'ces',
      'de', 'du', 'au', 'aux', 'en', 'dans', 'sur', 'sous', 'avec', 'par',
      'pour', 'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car', 'que', 'qui',
      'quoi', 'comment', 'pourquoi', 'quand', 'est', 'sont', 'suis', 'es',
      'avoir', 'faire', 'cours', 'formation', 'apprendre', 'plateforme',
      'bonjour', 'salut', 'merci', 'svp', 'aide', 'peux', 'tu', 'je', 'nous',
      'vous', 'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for',
    ]);

    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9àâäéèêëîïôöùûüç\s_-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  }

  private calculateOverlap(query: string, text: string): number {
    const qTokens = this.extractSignificantKeywords(query);
    if (qTokens.length === 0) return 0;
    const matches = qTokens.filter(t => text.includes(t)).length;
    return matches / qTokens.length;
  }

  private extractRelevantExcerpt(content: string, query: string): string {
    const tokens = this.extractSignificantKeywords(query);
    const paragraphs = content.split(/\n\n+/);

    // Find the paragraph with highest keyword match
    let bestPara = paragraphs[0] || '';
    let maxMatch = -1;

    for (const p of paragraphs) {
      const lower = p.toLowerCase();
      const count = tokens.filter(t => lower.includes(t)).length;
      if (count > maxMatch) {
        maxMatch = count;
        bestPara = p;
      }
    }

    // Clean markdown headings from excerpt
    const cleaned = bestPara.replace(/^###?\s+/gm, '').trim();
    return cleaned.length > 350 ? cleaned.substring(0, 347) + '...' : cleaned;
  }
}
