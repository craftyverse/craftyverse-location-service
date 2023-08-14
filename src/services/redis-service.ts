import Redis from 'ioredis';

const redisConfig = {
  host: 'craftyverse-location-redis-cache',
  port: 6379,
  password: process.env.REDIS_PASSOWRD,
};

export const redisClient = new Redis(redisConfig);
