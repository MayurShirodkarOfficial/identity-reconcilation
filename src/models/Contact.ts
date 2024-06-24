import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phoneNumber!: string | null;

  @Column({ type: 'varchar', length: 320, nullable: true })
  email!: string | null;

  @Column({ type: 'int', nullable: true })
  linkedId!: number | null;

  @Column({
    type: 'enum',
    enum: ['primary', 'secondary'],
    default: 'primary',
  })
  linkPrecedence!: 'primary' | 'secondary';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
