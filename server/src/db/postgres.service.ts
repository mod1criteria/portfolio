import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class PostgresService
  extends DatabaseService
  implements OnModuleInit, OnModuleDestroy
{
  onModuleInit() {
    // TODO: PostgreSQL 초기화 로직 작성
  }

  onModuleDestroy() {
    // TODO: PostgreSQL 종료 로직 작성
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(sql: string, _params: any[] = []): Promise<void> {
    // TODO: PostgreSQL 명령 실행 로직 작성
    return Promise.reject(new Error('Not implemented'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get<T>(sql: string, _params: any[] = []): Promise<T | undefined> {
    // TODO: PostgreSQL 조회 로직 작성
    return Promise.reject(new Error('Not implemented'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  all<T>(sql: string, _params: any[] = []): Promise<T[]> {
    // TODO: PostgreSQL 여러 행 조회 로직 작성
    return Promise.reject(new Error('Not implemented'));
  }
}
