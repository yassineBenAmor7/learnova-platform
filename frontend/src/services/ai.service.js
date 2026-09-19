import { api } from './api';

export const aiService = {
  // 5.1 Chatbot Intelligent
  askChatbot: async (message, courseId = null, sessionId = null) => {
    const payload = { message };
    if (courseId) payload.courseId = courseId;
    if (sessionId) payload.sessionId = sessionId;
    const response = await api.post('/ai/chatbot/query', payload);
    return response?.data ?? response;
  },

  // 5.2 Système de Recommandation Hybride
  getRecommendations: async (userId = null, limit = 6) => {
    const query = new URLSearchParams();
    if (limit) query.append('limit', limit);
    if (userId) query.append('userId', userId);
    const qs = query.toString();
    const endpoint = `/ai/recommendations${qs ? '?' + qs : ''}`;
    const response = await api.get(endpoint);
    return response?.data ?? response;
  },

  // 5.3 Générateur Automatique de Quiz
  generateQuiz: async ({
    courseId,
    sessionId = null,
    questionCount = 5,
    difficulty = 'BEGINNER',
    saveToDatabase = false,
    title = null,
    questions = null,
  }) => {
    const payload = {
      courseId,
      questionCount,
      difficulty,
      saveToDatabase,
    };
    if (sessionId) payload.sessionId = sessionId;
    if (title) payload.title = title;
    if (questions) payload.questions = questions;
    const response = await api.post('/ai/quiz-generator/generate', payload);
    return response?.data ?? response;
  },

  // 5.4 Analyse Diagnostique & Prédictive de Performance
  getUserPerformanceAnalysis: async (userId = null) => {
    const endpoint = userId ? `/ai/performance-analysis/user/${userId}` : '/ai/performance-analysis/me';
    const response = await api.get(endpoint);
    return response?.data ?? response;
  },
};

export default aiService;
