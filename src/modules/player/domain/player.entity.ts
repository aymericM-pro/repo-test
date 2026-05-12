export class PlayerEntity {
  constructor(
    public readonly id:        string,
    public          username:  string,
    public          elo:       number,
    public          rating:    string,
    public readonly createdAt: Date,
  ) {}

  static create(params: {
    id:       string;
    username: string;
    elo:      number;
    rating:   string;
  }): PlayerEntity {
    return new PlayerEntity(params.id, params.username, params.elo, params.rating, new Date());
  }
}
