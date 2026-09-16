import { Controller, Post, Body, Req } from '@nestjs/common';
import { ChatbotService, ChatbotResponse } from './chatbot.service';
import { ChatQueryDto } from './dto/chat-query.dto';

@Controller('ai/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('query')
  async handleQuery(
    @Body() dto: ChatQueryDto,
    @Req() req: any,
  ): Promise<ChatbotResponse> {
    const userId = req.user?.id || undefined;
    return this.chatbotService.processMessage(dto, userId);
  }
}
