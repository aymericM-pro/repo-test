import jwt from 'jsonwebtoken';
import { ITokenService } from '@/modules/auth/domain/ports/token.service.port';

export class JwtTokenAdapter implements ITokenService {
  private readonly secret = process.env.JWT_SECRET ?? 'secret';

  sign(sub: string): string {
    return jwt.sign({ sub }, this.secret, { expiresIn: '7d' });
  }
}
