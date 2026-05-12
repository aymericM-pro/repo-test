export class UserEntity {
  constructor(
    public readonly id:        string,
    public readonly email:     string,
    public username:           string,
    public passwordHash:       string,
    public readonly createdAt: Date,
  ) {}

  static create(params: {
    id:           string;
    email:        string;
    username:     string;
    passwordHash: string;
  }): UserEntity {
    return new UserEntity(
      params.id,
      params.email,
      params.username,
      params.passwordHash,
      new Date(),
    );
  }
}
