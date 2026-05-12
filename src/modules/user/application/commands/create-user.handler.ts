import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { Handler } from "@/mediator/handler.decorator";
import { IHandler } from "@/mediator/interfaces";
import { CreateUserCommand } from "@/modules/user/application/commands/create-user.command";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "@/modules/user/domain/ports/user.repository.port";
import { UserEntity } from "@/modules/user/domain/user.entity";
import { UserMapper } from "@/modules/user/application/mappers/user.mapper";
import { UserResponseDto } from "@/modules/user/application/dtos/user.response.dto";
import { userAlreadyExists } from "@/modules/user/domain/user.errors";
import { container } from "@/container";
import { emailService } from "@/container";

@Handler(CreateUserCommand)
export class CreateUserHandler implements IHandler<
  CreateUserCommand,
  UserResponseDto
> {
  private readonly repo: IUserRepository;

  constructor(repo?: IUserRepository) {
    this.repo = repo ?? container.resolve(USER_REPOSITORY);
  }

  async handle(cmd: CreateUserCommand): Promise<UserResponseDto> {
    const existing = await this.repo.findByEmail(cmd.email);

    if (existing) {
      throw userAlreadyExists(cmd.email);
    }

    const user = UserEntity.create({
      id: randomUUID(),
      email: cmd.email,
      username: cmd.username,
      passwordHash: await bcrypt.hash(cmd.password, 10),
    });

    const saved = await this.repo.save(user);

    emailService.send("user.welcome", {
      to: saved.email,
      username: saved.username,
    });

    return UserMapper.toResponse(saved);
  }
}
