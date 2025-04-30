import 'dotenv/config';
import { z } from 'zod';

import { ApiError } from '@/common/domain/errors/apiError';

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.coerce.number().default(3333),
    API_URL: z.string().default('http://localhost:3333'),
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
