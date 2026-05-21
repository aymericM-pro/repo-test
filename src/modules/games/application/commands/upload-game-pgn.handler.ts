import { Handler } from "@/mediator/handler.decorator";
import { IHandler } from "@/mediator/interfaces";
import { UploadGamePgnCommand } from "./upload-game-pgn.command";
import { IGameRepository, GAME_REPOSITORY } from "@/modules/games/domain/ports/game.repository.port";
import { gameNotFound, gamePlayerNotInGame } from "@/modules/games/domain/game.errors";
import { StorageService } from "@/storage/storage.service";
import { container, storageService } from "@/container";

@Handler(UploadGamePgnCommand)
export class UploadGamePgnHandler implements IHandler<UploadGamePgnCommand, string> {
  private readonly repo: IGameRepository;
  private readonly storage: StorageService;

  constructor(repo?: IGameRepository, storage?: StorageService) {
    this.repo    = repo    ?? container.resolve(GAME_REPOSITORY);
    this.storage = storage ?? storageService;
  }

  async handle(cmd: UploadGamePgnCommand): Promise<string> {
    const game = await this.repo.findById(cmd.gameId);
    if (!game) throw gameNotFound(cmd.gameId);

    if (game.whiteId !== cmd.userId && game.blackId !== cmd.userId) {
      throw gamePlayerNotInGame();
    }

    const result = await this.storage.upload(
      cmd.originalFilename,
      cmd.buffer,
      { allowedExtensions: ["pgn"], maxSizeBytes: 5 * 1024 * 1024 },
      { folder: `games/${cmd.gameId}` },
    );

    return this.storage.getSignedUrl(result.path);
  }
}
