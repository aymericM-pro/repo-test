export interface ITokenService {
  sign(sub: string): string;
}

export const TOKEN_SERVICE = Symbol('ITokenService');
