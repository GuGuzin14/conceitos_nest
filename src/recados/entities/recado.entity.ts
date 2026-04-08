import { Pessoa  } from "src/pessoas/entities/pessoa.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

 @Entity()
export class RecadoEntity{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'varchar', length: 255})
  texto!: string;

  //Muitos recados podem ser enviados por uma unica pessoa(emissor)
  @ManyToOne(() => Pessoa, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  // Especifica a coluna "de" que armazena o ID da pesoa que enviou o recado
  @JoinColumn({name: 'de'})
  de!: Pessoa;

  @ManyToOne(() => Pessoa, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({name: 'para'})
  para!: Pessoa;

  @Column({ type: 'boolean', default: false })
  lido!: boolean;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data!: Date; //CreateAt com a data de hoje

  @CreateDateColumn()
  createdAt?: Date; //CreatedAt com a data de hoje

  @UpdateDateColumn()
  updatedAt?: Date; //UpdatedAt com data de hoje
}