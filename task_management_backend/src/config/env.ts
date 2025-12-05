import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.string().default('info'),
  VOICE_PARSING_PROVIDER: z.string().default('regex'),
  OPENAI_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = {
  NODE_ENV: parsed.data.NODE_ENV,
  PORT: Number(parsed.data.PORT),
  DATABASE_URL: parsed.data.DATABASE_URL,
  LOG_LEVEL: parsed.data.LOG_LEVEL,
  VOICE_PARSING_PROVIDER: parsed.data.VOICE_PARSING_PROVIDER,
  OPENAI_API_KEY: parsed.data.OPENAI_API_KEY,
  CORS_ORIGIN: parsed.data.CORS_ORIGIN,
};
