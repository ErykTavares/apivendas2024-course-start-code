import 'dotenv/config';
import { z } from 'zod';

import { ApiError } from '@/common/domain/errors/apiError';

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.coerce.number().default(3333),
    API_URL: z.string().default('http://localhost:3333'),
    DB_TYPE: z.literal('postgres').default('postgres'),
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.coerce.number().default(5432),
    DB_SCHEMA: z.string().default('public'),
    DB_NAME: z.string().default('postgres'),
    DB_USER: z.string().default('postgres'),
    DB_PASS: z.string().default('postgres'),
});

const envValidate = envSchema.safeParse(process.env);

if (!envValidate.success) {
    console.error(
        '❌ Invalid environment variables:',
        envValidate.error.format(),
    );
    throw new ApiError('Invalid environment variables');
}

export const env = envValidate.data;
