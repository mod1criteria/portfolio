export abstract class DatabaseService {
  abstract onModuleInit(): void | Promise<void>;
  abstract onModuleDestroy(): void | Promise<void>;
  abstract run(sql: string, params?: any[]): Promise<void>;
  abstract get<T>(sql: string, params?: any[]): Promise<T | undefined>;
  abstract all<T>(sql: string, params?: any[]): Promise<T[]>;
}
