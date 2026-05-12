import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('players')
export class PlayerOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ type: 'int' })
  elo!: number;

  @Column({ length: 50 })
  rating!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
