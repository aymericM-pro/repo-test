import bcrypt from 'bcrypt';
import { IHashService } from '@/modules/auth/domain/ports/hash.service.port';

export class BcryptHashAdapter implements IHashService {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
