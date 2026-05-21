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

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ length: 10, nullable: true })
  country?: string;

  @Column({ length: 20, nullable: true })
  preferredColor?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
