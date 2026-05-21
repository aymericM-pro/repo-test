-- Enums games
DO $$ BEGIN
  CREATE TYPE game_status    AS ENUM ('waiting', 'active', 'finished');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE game_result    AS ENUM ('white', 'black', 'draw');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE game_end_reason AS ENUM ('checkmate', 'resignation', 'timeout', 'draw_agreement', 'stalemate', 'abandoned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE time_control   AS ENUM ('bullet', 'blitz', 'rapid', 'classical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE board_color    AS ENUM ('white', 'black');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name  VARCHAR(100);

CREATE TABLE IF NOT EXISTS players (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)  NOT NULL UNIQUE,
    elo             INT          NOT NULL DEFAULT 1200,
    rating          VARCHAR(50)  NOT NULL DEFAULT 'beginner',
    bio             TEXT,
    country         VARCHAR(10),
    preferred_color VARCHAR(20),
    created_at      TIMESTAMP    NOT NULL DEFAULT now()
);

ALTER TABLE players ADD COLUMN IF NOT EXISTS bio             TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS country        VARCHAR(10);
ALTER TABLE players ADD COLUMN IF NOT EXISTS preferred_color VARCHAR(20);
ALTER TABLE players DROP COLUMN IF EXISTS first_name;
ALTER TABLE players DROP COLUMN IF EXISTS last_name;

CREATE TABLE IF NOT EXISTS games (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    white_id        UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    black_id        UUID            REFERENCES users(id) ON DELETE SET NULL,
    status          game_status     NOT NULL DEFAULT 'waiting',
    result          game_result,
    end_reason      game_end_reason,
    time_control    time_control    NOT NULL,
    time_limit      INT             NOT NULL,
    increment       INT             NOT NULL DEFAULT 0,
    white_time_left INT             NOT NULL,
    black_time_left INT             NOT NULL,
    moves           JSONB           NOT NULL DEFAULT '[]',
    current_turn    board_color     NOT NULL DEFAULT 'white',
    move_count      INT             NOT NULL DEFAULT 0,
    last_move_at    TIMESTAMP,
    started_at      TIMESTAMP,
    finished_at     TIMESTAMP,
    draw_offered_by UUID            REFERENCES users(id) ON DELETE SET NULL,
    player_id       UUID            REFERENCES players(id) ON DELETE SET NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT now()
);

ALTER TABLE games ADD COLUMN IF NOT EXISTS player_id UUID REFERENCES players(id) ON DELETE SET NULL;



