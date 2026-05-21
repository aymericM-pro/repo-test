import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncGameEntity1779046287529 implements MigrationInterface {
    name = 'SyncGameEntity1779046287529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "games_white_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "games_black_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "games_draw_offered_by_fkey"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "player_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TYPE "public"."game_status" RENAME TO "game_status_old"`);
        await queryRunner.query(`CREATE TYPE "public"."games_status_enum" AS ENUM('waiting', 'active', 'finished')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "status" TYPE "public"."games_status_enum" USING "status"::"text"::"public"."games_status_enum"`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "status" SET DEFAULT 'waiting'`);
        await queryRunner.query(`DROP TYPE "public"."game_status_old"`);
        await queryRunner.query(`ALTER TYPE "public"."game_result" RENAME TO "game_result_old"`);
        await queryRunner.query(`CREATE TYPE "public"."games_result_enum" AS ENUM('white', 'black', 'draw')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "result" TYPE "public"."games_result_enum" USING "result"::"text"::"public"."games_result_enum"`);
        await queryRunner.query(`DROP TYPE "public"."game_result_old"`);
        await queryRunner.query(`ALTER TYPE "public"."game_end_reason" RENAME TO "game_end_reason_old"`);
        await queryRunner.query(`CREATE TYPE "public"."games_end_reason_enum" AS ENUM('checkmate', 'resignation', 'timeout', 'draw_agreement', 'stalemate', 'abandoned')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "end_reason" TYPE "public"."games_end_reason_enum" USING "end_reason"::"text"::"public"."games_end_reason_enum"`);
        await queryRunner.query(`DROP TYPE "public"."game_end_reason_old"`);
        await queryRunner.query(`ALTER TYPE "public"."time_control" RENAME TO "time_control_old"`);
        await queryRunner.query(`CREATE TYPE "public"."games_time_control_enum" AS ENUM('bullet', 'blitz', 'rapid', 'classical')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "time_control" TYPE "public"."games_time_control_enum" USING "time_control"::"text"::"public"."games_time_control_enum"`);
        await queryRunner.query(`DROP TYPE "public"."time_control_old"`);
        await queryRunner.query(`ALTER TYPE "public"."board_color" RENAME TO "board_color_old"`);
        await queryRunner.query(`CREATE TYPE "public"."games_current_turn_enum" AS ENUM('white', 'black')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "current_turn" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "current_turn" TYPE "public"."games_current_turn_enum" USING "current_turn"::"text"::"public"."games_current_turn_enum"`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "current_turn" SET DEFAULT 'white'`);
        await queryRunner.query(`DROP TYPE "public"."board_color_old"`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "elo" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "rating" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "rating" SET DEFAULT 'beginner'`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "elo" SET DEFAULT '1200'`);
        await queryRunner.query(`ALTER TABLE "players" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`CREATE TYPE "public"."board_color_old" AS ENUM('white', 'black')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "current_turn" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "current_turn" TYPE "public"."board_color_old" USING "current_turn"::"text"::"public"."board_color_old"`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "current_turn" SET DEFAULT 'white'`);
        await queryRunner.query(`DROP TYPE "public"."games_current_turn_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."board_color_old" RENAME TO "board_color"`);
        await queryRunner.query(`CREATE TYPE "public"."time_control_old" AS ENUM('bullet', 'blitz', 'rapid', 'classical')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "time_control" TYPE "public"."time_control_old" USING "time_control"::"text"::"public"."time_control_old"`);
        await queryRunner.query(`DROP TYPE "public"."games_time_control_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."time_control_old" RENAME TO "time_control"`);
        await queryRunner.query(`CREATE TYPE "public"."game_end_reason_old" AS ENUM('checkmate', 'resignation', 'timeout', 'draw_agreement', 'stalemate', 'abandoned')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "end_reason" TYPE "public"."game_end_reason_old" USING "end_reason"::"text"::"public"."game_end_reason_old"`);
        await queryRunner.query(`DROP TYPE "public"."games_end_reason_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."game_end_reason_old" RENAME TO "game_end_reason"`);
        await queryRunner.query(`CREATE TYPE "public"."game_result_old" AS ENUM('white', 'black', 'draw')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "result" TYPE "public"."game_result_old" USING "result"::"text"::"public"."game_result_old"`);
        await queryRunner.query(`DROP TYPE "public"."games_result_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."game_result_old" RENAME TO "game_result"`);
        await queryRunner.query(`CREATE TYPE "public"."game_status_old" AS ENUM('waiting', 'active', 'finished')`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "status" TYPE "public"."game_status_old" USING "status"::"text"::"public"."game_status_old"`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "status" SET DEFAULT 'waiting'`);
        await queryRunner.query(`DROP TYPE "public"."games_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."game_status_old" RENAME TO "game_status"`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "player_id"`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "games_draw_offered_by_fkey" FOREIGN KEY ("draw_offered_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "games_black_id_fkey" FOREIGN KEY ("black_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "games_white_id_fkey" FOREIGN KEY ("white_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
