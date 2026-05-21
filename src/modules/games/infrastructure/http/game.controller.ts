import multer from "multer";
import { mediator } from "@/mediator/mediator";
import { Controller, Get, Post, UseMiddleware, RouteMiddleware } from "@/decorators/http.decorators";
import { CurrentUser, Param, UploadedFile } from "@/decorators/param.decorators";
import { authenticate } from "@/middlewares/auth.middleware";
import { ValidatedBody } from "@/decorators/validated-body.decorator";
import { uploadRateLimit } from "@/storage/middlewares/upload-rate-limit.middleware";
import { UploadGamePgnCommand } from "@/modules/games/application/commands/upload-game-pgn.command";
import { CreateGameCommand } from "@/modules/games/application/commands/create-game.command";
import { SimulateGameCommand } from "@/modules/games/application/commands/simulate-game.command";
import { ResignGameCommand } from "@/modules/games/application/commands/resign-game.command";
import { OfferDrawCommand } from "@/modules/games/application/commands/offer-draw.command";
import { RespondDrawCommand } from "@/modules/games/application/commands/respond-draw.command";
import { GetGameQuery } from "@/modules/games/application/queries/get-game.query";
import { GetUserGamesQuery } from "@/modules/games/application/queries/get-user-games.query";
import { GetGameReportQuery } from "@/modules/games/application/queries/get-game-report.query";
import { CreateGameRequestDto, PlayMoveRequestDto } from "@/modules/games/application/dtos/game.request.dto";
import { PlayMoveCommand } from "@/modules/games/application/commands/play-move.command";
import { GameResponseDto } from "@/modules/games/application/dtos/game.response.dto";
import { pdfService } from "@/pdf/pdf.service";

type FileResponse = { __type: "file"; buffer: Buffer; filename: string; contentType: string };

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

@UseMiddleware(authenticate)
@Controller("/api/games")
export class GameController {
  @Get("/")
  async getAll(@CurrentUser() userId: string): Promise<GameResponseDto[]> {
    return mediator.send(new GetUserGamesQuery(userId));
  }

  @Get("/:id/report")
  async getReport(@Param("id") id: string): Promise<FileResponse> {
    const payload = await mediator.send(new GetGameReportQuery(id));
    const { buffer, filename } = await pdfService.generate("game.report", payload);
    return { __type: "file", buffer, filename, contentType: "application/pdf" };
  }

  @Get("/:id")
  async getById(
    @Param("id") id: string,
    @CurrentUser() userId: string,
  ): Promise<GameResponseDto> {
    return mediator.send(new GetGameQuery(id, userId));
  }

  @Post("/:id/resign")
  async resign(
    @Param("id") id: string,
    @CurrentUser() userId: string,
  ): Promise<GameResponseDto> {
    return mediator.send(new ResignGameCommand(id, userId));
  }

  @Post("/:id/draw")
  async offerDraw(
    @Param("id") id: string,
    @CurrentUser() userId: string,
  ): Promise<GameResponseDto> {
    return mediator.send(new OfferDrawCommand(id, userId));
  }

  @Post("/:id/draw/accept")
  async acceptDraw(
    @Param("id") id: string,
    @CurrentUser() userId: string,
  ): Promise<GameResponseDto> {
    return mediator.send(new RespondDrawCommand(id, userId, true));
  }

  @Post("/:id/draw/decline")
  async declineDraw(
    @Param("id") id: string,
    @CurrentUser() userId: string,
  ): Promise<GameResponseDto> {
    return mediator.send(new RespondDrawCommand(id, userId, false));
  }

  @Post("/:id/moves")
  async playMove(
    @Param("id") id: string,
    @ValidatedBody(PlayMoveRequestDto) dto: PlayMoveRequestDto,
  ): Promise<GameResponseDto> {
    return mediator.send(new PlayMoveCommand(
      id, dto.san, dto.from, dto.to, dto.isCheck, dto.isCheckmate, dto.timeLeft, dto.promotion,
    ));
  }

  @Post("/:id/simulate")
  async simulate(
    @Param("id") id: string,
    @CurrentUser() userId: string,
  ): Promise<GameResponseDto> {
    return mediator.send(new SimulateGameCommand(id, userId));
  }

  @Post("/")
  async create(
      @ValidatedBody(CreateGameRequestDto) dto: CreateGameRequestDto,
      @CurrentUser() userId: string,
  ): Promise<GameResponseDto> {
    return mediator.send(
        new CreateGameCommand(
            userId,
            dto.timeControl,
            dto.timeLimit,
            dto.increment,
            dto.playerId ?? null,
            dto.opponent ?? null,
        ),
    );
  }

  @Post("/:id/pgn")
  @RouteMiddleware(uploadRateLimit, upload.single("file"))
  async uploadPgn(
    @Param("id") id: string,
    @CurrentUser() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file) throw new Error("No file provided");
    const url = await mediator.send(
      new UploadGamePgnCommand(id, userId, file.originalname, file.buffer),
    );
    return { url };
  }
}
