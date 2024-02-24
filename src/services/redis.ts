import Redis from "ioredis";
import "dotenv/config";

export class RedisService {
  private static redisClient: Redis;

  static createRedisClient(): Redis {
    if (!RedisService.redisClient) {
      RedisService.redisClient = new Redis({
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
        password: process.env.REDIS_PASSWORD!,
      });
    }
    return RedisService.redisClient;
  }

  static async set(key: string, value: string): Promise<string> {
    const redisClient = RedisService.createRedisClient();
    return redisClient.set(key, value);
  }

  static async get(key: string): Promise<string | null> {
    const redisClient = RedisService.createRedisClient();
    return redisClient.get(key);
  }

  static async delete(key: string): Promise<number | null> {
    const redisClient = RedisService.createRedisClient();
    return redisClient.del(key);
  }
}

// export const redisClient = (() => {
//   let client: Redis;

//   type clientConfig = {
//     host: string;
//     port: number;
//     password: string;
//   };

//   const getClient = (config?: clientConfig) => {
//     if (!client) {
//       client = new Redis({
//         host: config?.host ? config.host : "craftyverse-location-redis-cache",
//         port: config?.port ? config.port : 6379,
//         password: config?.password
//           ? config.password
//           : process.env.REDIS_PASSWORD,
//       });
//     }

//     return client;
//   };

//   const set = (key: string, value: any) => {
//     const client = getClient();
//     client.set(key, JSON.stringify(value));
//   };

//   const get = async (key: string) => {
//     const client = getClient();
//     const value = await client.get(key);
//     return value;
//   };

//   const ping = async () => {
//     const client = getClient();
//     try {
//       const result = await client.ping();
//       if (result === "PONG") {
//         console.log("Connected to Redis");
//       } else {
//         console.log("Failed to connect to Redis");
//       }
//     } catch (err) {
//       console.log("Failed to connect to Redis");
//     }
//   };

//   const quit = async () => {
//     const client = getClient();
//     return await client.quit();
//   };

//   const remove = (key: string) => {
//     const client = getClient();
//     return client.del(key);
//   };

//   return {
//     getClient,
//     get,
//     set,
//     ping,
//     quit,
//     remove,
//   };
// })();
