import { aiService } from './ai.service';

export const chatbotService = {
  sendMessage: (message, courseId = null, sessionId = null) => {
    return aiService.askChatbot(message, courseId, sessionId);
  },
};

export default chatbotService;
