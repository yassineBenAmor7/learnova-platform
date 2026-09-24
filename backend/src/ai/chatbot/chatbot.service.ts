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
      answer: `I am the intelligent pedagogical assistant of **Learnova**.\n\n` +
        `I can help you to:\n` +
        `- **Explore our 108 courses** across 14 domains (Computer Science, Finance, Management, Design, etc.).\n` +
        `- **Understand technical concepts** covered in our video lessons and lecture notes.\n` +
        `- **Navigate the platform** (exam mode, certificates with QR code, points and badge system).\n\n` +
        `How can I assist you with your learning journey today?`,
      intent: 'general',
      confidence: 0.7,
      suggestions: [
        'Which courses are available in Artificial Intelligence?',
        'How can I get a verifiable certificate?',
        'What are the rules of the exam mode?',
        'Recommend a course for beginners',
      ],
      actions: [
        { label: 'Explore Catalog', url: '/courses', type: 'link' },
        { label: 'View Dashboard', url: '/dashboard', type: 'link' },
      ],
    };
  }

  private detectPlatformNavigation(query: string): ChatbotResponse | null {
    // Certificats & QR Code
    if (query.includes('certificat') || query.includes('certificate') || query.includes('qr code') || query.includes('attestation') || query.includes('diplome')) {
      return {
        answer: `On **Learnova**, obtaining an official certificate meets rigorous standards:\n\n` +
          `1. **Complete Curriculum**: You must complete all learning sessions of the course.\n` +
          `2. **Final Exam**: You must pass the 40-question final exam with a minimum score of **70%**.\n` +
          `3. **Authenticity & QR Code**: Every issued certificate features a unique identifier and a **scannable QR code** allowing instant public verification on the official online validation registry.`,
        intent: 'platform_navigation',
        confidence: 0.95,
        actions: [
          { label: 'My Certificates', url: '/certificates', type: 'certificate' },
          { label: 'Verify a Certificate', url: '/certificates/verify/demo', type: 'link' },
        ],
        suggestions: [
          'What are the rules of the exam mode?',
          'How many questions are in the final exam?',
          'How can I track my progress?',
        ],
      };
    }

    // Mode Examen
    if (query.includes('examen') || query.includes('exam') || query.includes('exam mode') || query.includes('chronometre') || query.includes('timer')) {
      return {
        answer: `Learnova's **Exam Mode** simulates the conditions of a professional certification assessment:\n\n` +
          `- **Strict Evaluation**: Each final exam contains **40 questions** covering the entire syllabus.\n` +
          `- **Built-in Timer**: The time limit is enforced automatically.\n` +
          `- **Passing Threshold**: The minimum score required to pass and claim your certificate is **70%**.\n` +
          `- **Detailed Performance Report**: At the end of the test, an analysis breakdown highlights your strengths and areas for improvement.`,
        intent: 'platform_navigation',
        confidence: 0.95,
        actions: [
          { label: 'Browse Courses', url: '/courses', type: 'link' },
        ],
        suggestions: [
          'How can I get a verifiable certificate?',
          'How does the gamification system work?',
        ],
      };
    }

    // Gamification, Streaks, Badges, Points
    if (query.includes('point') || query.includes('badge') || query.includes('streak') || query.includes('niveau') || query.includes('level') || query.includes('gamification')) {
      return {
        answer: `Learnova's **Gamification System** promotes continuous learning and consistency:\n\n` +
          `- **Experience Points (XP)**: Earned for each video watched, session completed, and quiz passed.\n` +
          `- **Daily Streaks**: Track consecutive active days to reinforce learning habits.\n` +
          `- **Achievement Badges**: 35 exclusive badges to unlock based on your milestones (e.g., *Bronze Scholar*, *Quiz Master*, *Fast Learner*).\n` +
          `- **Learner Levels**: Progress automatically from Beginner to Legend as you study.`,
        intent: 'platform_navigation',
        confidence: 0.95,
        actions: [
          { label: 'View Profile & Badges', url: '/profile', type: 'link' },
          { label: 'My Dashboard', url: '/dashboard', type: 'link' },
        ],
        suggestions: [
          'How to level up quickly?',
          'How are daily streaks calculated?',
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
              answer: `In session **"${activeSession.title}"** (Lecture: *${video.title}*) :\n\n${excerpt}\n\n` +
                `*This concept is covered in depth in this video's study guide.*`,
              intent: 'pedagogical_concept',
              confidence: 0.9,
              sources: [{
                courseTitle: course.title,
                sessionTitle: activeSession.title,
                videoTitle: video.title,
                courseId: course.id,
              }],
              actions: [
                { label: 'Open Lecture', url: `/courses/${course.id}/learn?session=${activeSession.id}&video=${video.id}`, type: 'course' },
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
        answer: `Here is what the course **"${bestMatch.session.course.title}"** explains regarding your question:\n\n` +
          `**Session: ${bestMatch.session.title}**\n` +
          `**Lecture: ${bestMatch.title}**\n\n` +
          `${excerpt}\n\n` +
          `You can view the full module and its interactive study notes directly on the platform.`,
        intent: 'pedagogical_concept',
        confidence: 0.88,
        sources: matchingVideos.map(v => ({
          courseTitle: v.session.course.title,
          sessionTitle: v.session.title,
          videoTitle: v.title,
          courseId: v.session.course.id,
        })),
        actions: [
          { label: `Go to "${bestMatch.session.course.title}"`, url: `/courses/${bestMatch.session.course.id}/learn`, type: 'course' },
        ],
        suggestions: [
          'What are the prerequisites for this course?',
          'How does the practice quiz work?',
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
        answer: `I found **${matchedCourses.length} course(s)** matching your query in the Learnova catalog:\n\n` +
          `${courseList}\n\n` +
          `Would you like to explore one of these courses or filter by skill level?`,
        intent: 'course_query',
        confidence: 0.9,
        actions: matchedCourses.map(c => ({
          label: c.title.length > 30 ? c.title.substring(0, 27) + '...' : c.title,
          url: `/courses/${c.id}`,
          type: 'course',
        })),
        suggestions: [
          'Show beginner-friendly courses',
          'How does certification work?',
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
