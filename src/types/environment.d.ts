export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_MONGODB_URI: string;
      JWT_KEY: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}
