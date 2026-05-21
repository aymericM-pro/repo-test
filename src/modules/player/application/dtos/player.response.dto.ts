export class PlayerResponseDto {
  id!:              string;
  username!:        string;
  elo!:             number;
  rating!:          string;
  createdAt!:       Date;
  bio?:             string;
  country?:         string;
  preferredColor?:  string;
}
