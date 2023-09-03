import { createClient } from 'redis';
import { REDIS_PASSWORD, REDIS_URL, REDIS_USERNAME } from '$env/static/private';

export const redis = createClient({
    url: REDIS_URL,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD
});

redis.connect();