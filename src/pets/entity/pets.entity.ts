import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('pets')
export class Pets {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;
}
