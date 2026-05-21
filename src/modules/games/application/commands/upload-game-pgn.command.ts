import { IRequest } from "@/mediator/interfaces";

export class UploadGamePgnCommand implements IRequest<string> {
  declare readonly _responseType: string;
  constructor(
    public readonly gameId:           string,
    public readonly userId:           string,
    public readonly originalFilename: string,
    public readonly buffer:           Buffer,
  ) {}
}
