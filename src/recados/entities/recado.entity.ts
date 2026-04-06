import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

 @Entity()
export class RecadoEntity{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'varchar', length: 255})
  texto!: string;

  @Column({type: 'varchar', length: 50})
  de!: string;

  @Column({type: 'varchar', length: 50})
  para!: string;

  @Column({ type: 'boolean', default: false })
  lido!: boolean;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data!: Date; //CreateAt com a data de hoje

  @CreateDateColumn()
  createdAt?: Date; //CreatedAt com a data de hoje

  @UpdateDateColumn()
  updatedAt?: Date; //UpdatedAt com data de hoje
}