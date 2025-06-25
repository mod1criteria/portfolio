import { Module, Provider } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SQLiteService } from './sqlite.service';
import { PostgresService } from './postgres.service';

const databaseProvider: Provider = {
  provide: DatabaseService,
  useClass:
    process.env.DB_TYPE === 'postgres' ? PostgresService : SQLiteService,
};

@Module({
  providers: [SQLiteService, PostgresService, databaseProvider],
  exports: [DatabaseService],
})
export class DatabaseModule {}
