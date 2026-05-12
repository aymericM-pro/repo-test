import { AppError } from "@/errors/app-error";

export enum GameErrorCode {
  NOT_FOUND = "GAME_NOT_FOUND",
  ALREADY_STARTED = "GAME_ALREADY_STARTED",
  ALREADY_FINISHED = "GAME_ALREADY_FINISHED",
  NOT_YOUR_TURN = "GAME_NOT_YOUR_TURN",
  INVALID_MOVE = "GAME_INVALID_MOVE",
  PLAYER_NOT_IN_GAME = "GAME_PLAYER_NOT_IN_GAME",
  DRAW_NO_OFFER = "GAME_DRAW_NO_OFFER",
  DRAW_ALREADY_OFFERED = "GAME_DRAW_ALREADY_OFFERED",
  CANNOT_JOIN_OWN = "GAME_CANNOT_JOIN_OWN",
}

const S: Record<GameErrorCode, number> = {
  [GameErrorCode.NOT_FOUND]: 404,
  [GameErrorCode.ALREADY_STARTED]: 409,
  [GameErrorCode.ALREADY_FINISHED]: 409,
  [GameErrorCode.NOT_YOUR_TURN]: 403,
  [GameErrorCode.INVALID_MOVE]: 422,
  [GameErrorCode.PLAYER_NOT_IN_GAME]: 403,
  [GameErrorCode.DRAW_NO_OFFER]: 409,
  [GameErrorCode.DRAW_ALREADY_OFFERED]: 409,
  [GameErrorCode.CANNOT_JOIN_OWN]: 409,
};

export const gameNotFound = (id: string) =>
  new AppError(
    GameErrorCode.NOT_FOUND,
    S[GameErrorCode.NOT_FOUND],
    `Game ${id} not found`,
  );

export const gameAlreadyStarted = () =>
  new AppError(
    GameErrorCode.ALREADY_STARTED,
    S[GameErrorCode.ALREADY_STARTED],
    "Game already started",
  );

export const gameAlreadyFinished = () =>
  new AppError(
    GameErrorCode.ALREADY_FINISHED,
    S[GameErrorCode.ALREADY_FINISHED],
    "Game already finished",
  );

export const gameNotYourTurn = () =>
  new AppError(
    GameErrorCode.NOT_YOUR_TURN,
    S[GameErrorCode.NOT_YOUR_TURN],
    "Not your turn",
  );

export const gameInvalidMove = (move: string) =>
  new AppError(
    GameErrorCode.INVALID_MOVE,
    S[GameErrorCode.INVALID_MOVE],
    `Invalid move: ${move}`,
  );

export const gamePlayerNotInGame = () =>
  new AppError(
    GameErrorCode.PLAYER_NOT_IN_GAME,
    S[GameErrorCode.PLAYER_NOT_IN_GAME],
    "You are not in this game",
  );

export const gameDrawNoOffer = () =>
  new AppError(
    GameErrorCode.DRAW_NO_OFFER,
    S[GameErrorCode.DRAW_NO_OFFER],
    "No pending draw offer",
  );

export const gameDrawAlreadyOffered = () =>
  new AppError(
    GameErrorCode.DRAW_ALREADY_OFFERED,
    S[GameErrorCode.DRAW_ALREADY_OFFERED],
    "A draw offer is already pending",
  );

export const gameCannotJoinOwn = () =>
  new AppError(
    GameErrorCode.CANNOT_JOIN_OWN,
    S[GameErrorCode.CANNOT_JOIN_OWN],
    "Cannot join your own game",
  );
