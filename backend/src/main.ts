import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import open from 'open';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);

  console.log(
    `🚀 Learnova API running on: http://localhost:3000`
  );

  // Automatically open the frontend URL in the default browser
  await open(process.env.FRONTEND_URL || 'http://localhost:5173');
}

bootstrap();