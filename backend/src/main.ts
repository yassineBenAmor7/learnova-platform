import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function killPortProcess(port: number) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
      const lines = stdout.trim().split('\n');
      const pids = new Set<number>();

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parseInt(parts[parts.length - 1]);
          if (!isNaN(pid) && pid > 0) {
            pids.add(pid);
          }
        }
      }

      for (const pid of pids) {
        try {
          await execAsync(`taskkill /F /PID ${pid}`);
          console.log(`Killed process ${pid} on port ${port}`);
        } catch (error) {
          console.log(`Failed to kill process ${pid}: ${error}`);
        }
      }

      // Wait for port to be released
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      await execAsync(`lsof -ti:${port} | xargs kill -9`);
      console.log(`Killed process on port ${port}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.log(`No process found on port ${port} or error killing process`);
  }
}

async function bootstrap() {
  const port = parseInt(process.env.PORT || '3000', 10);

  await killPortProcess(port);

  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(port);

  console.log(
    `🚀 Learnova API running on: http://localhost:${port}`
  );

}

bootstrap();