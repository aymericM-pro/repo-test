import { LOGGER } from "@/logger/logger.port";
import { PinoLogger } from "@/logger/pino.logger";
import { USER_REPOSITORY } from "@/modules/user/domain/ports/user.repository.port";
import { UserRepositoryAdapter } from "@/modules/user/infrastructure/persistence/user.repository.adapter";
import { GAME_REPOSITORY } from "@/modules/games/domain/ports/game.repository.port";
import { GameRepositoryAdapter } from "@/modules/games/infrastructure/persistence/game.repository.adapter";
import { HASH_SERVICE } from "@/modules/auth/domain/ports/hash.service.port";
import { BcryptHashAdapter } from "@/modules/auth/infrastructure/services/bcrypt.hash.adapter";
import { TOKEN_SERVICE } from "@/modules/auth/domain/ports/token.service.port";
import { JwtTokenAdapter } from "@/modules/auth/infrastructure/services/jwt.token.adapter";
import { PLAYER_REPOSITORY } from "@/modules/player/domain/ports/player.repository.port";
import { PlayerRepositoryAdapter } from "@/modules/player/infrastructure/persistence/player.repository.adapter";
import { EmailService } from "@/emails/email.service";
import { NodemailerProvider } from "@/emails/nodemailer.provider";
import { StorageService } from "@/storage/storage.service";
import { GcpStorageProvider } from "@/storage/providers/gcp/gcp-storage.provider";
import { loadGcpStorageConfig } from "@/storage/providers/gcp/gcp-storage.config";

export const logger = PinoLogger.create();

const registry = new Map<symbol, unknown>();

registry.set(LOGGER,           logger);
registry.set(USER_REPOSITORY, new UserRepositoryAdapter());
registry.set(GAME_REPOSITORY, new GameRepositoryAdapter());
registry.set(PLAYER_REPOSITORY, new PlayerRepositoryAdapter());
registry.set(HASH_SERVICE,    new BcryptHashAdapter());
registry.set(TOKEN_SERVICE,   new JwtTokenAdapter());

export const emailService   = new EmailService(new NodemailerProvider());
export const storageService = new StorageService(new GcpStorageProvider(loadGcpStorageConfig()));

export const container = {
  resolve: <T>(token: symbol): T => {
    const instance = registry.get(token);
    if (!instance) throw new Error(`No binding for token: ${token.toString()}`);
    return instance as T;
  },
};
