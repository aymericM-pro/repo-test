import "reflect-metadata";
import { Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { PARAMS_KEY, ParamDefinition } from "@/decorators/param.decorators";

const VALIDATED_BODY_KEY = Symbol("validated_body");

export function ValidatedBody(DtoClass: new () => any) {
  return (target: object, methodKey: string | symbol, paramIndex: number) => {
    const params: ParamDefinition[] =
      Reflect.getMetadata(PARAMS_KEY, target, methodKey) ?? [];
    params.push({ index: paramIndex, type: "body" });
    Reflect.defineMetadata(PARAMS_KEY, params, target, methodKey);
    Reflect.defineMetadata(
      VALIDATED_BODY_KEY,
      { index: paramIndex, DtoClass },
      target,
      methodKey,
    );
  };
}

export function getValidatedBody(target: object, methodKey: string | symbol) {
  return Reflect.getMetadata(VALIDATED_BODY_KEY, target, methodKey);
}

export async function resolveValidatedBody(
  DtoClass: new () => any,
  body: unknown,
  res: Response,
): Promise<any | null> {
  const dto = plainToInstance(DtoClass, body);
  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
    res.status(400).json({ errors: messages });
    return null;
  }

  return dto;
}
