import { DataSource } from 'typeorm';
import { UserOrmEntity } from '@/modules/user/infrastructure/persistence/user.orm-entity';
import { GameOrmEntity } from '@/modules/games/infrastructure/persistence/game.orm-entity';

export const AppDataSource = new DataSource({
  type:        'postgres',
  host:        process.env.DB_HOST     ?? 'localhost',
  port:        Number(process.env.DB_PORT ?? 5432),
  username:    process.env.DB_USER     ?? 'todo_user',
  password:    process.env.DB_PASSWORD ?? 'todo_pass',
  database:    process.env.DB_NAME     ?? 'todo_db',
  synchronize: false,
  logging:     process.env.NODE_ENV === 'development',
  entities:    [UserOrmEntity, GameOrmEntity],
});

export async function connectDatabase(retries = 5, delay = 3000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await AppDataSource.initialize();
      console.log('[db] connected');
      return;
    } catch (err) {
      console.error(`[db] connection failed (attempt ${attempt}/${retries})`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
