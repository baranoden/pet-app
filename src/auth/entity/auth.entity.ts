import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'varchar', length: 255, default: 5 })
  points: number;
}
