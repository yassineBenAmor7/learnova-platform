export interface AppConfig {
  port: number;
  environment: string;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string[];
  };
  uploads: {
    destination: string;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:yassine123@localhost:5432/learnova-platform',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'learnova-secret-key-2026-secure-jwt-token',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000').split(','),
  },
  uploads: {
    destination: process.env.UPLOADS_DEST || './uploads',
  },
});
