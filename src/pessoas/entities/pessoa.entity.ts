import { IsEmail } from "class-validator";
import { RecadoEntity } from "src/recados/entities/recado.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export class Pessoa {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column({length: 255})
    passwordHash!: string

    @Column({length: 100})
    nome!: string;

    @CreateDateColumn()
    createdAt?: Date | undefined;

    @UpdateDateColumn()
    updatedAt?: Date | undefined;

    // Uma pessoa pode ter enviado muitos recados (como: de)
    // Esses recados são relacionados ao campo "de" na entidade recado
    @OneToMany(() => RecadoEntity, recado => recado.de)
    recadosEnviados!: RecadoEntity[];

    // Uma pessoa pode ter recebido muitos recados (como: para)
    // Esses recados são relacionados ao campo "para" na entidade recado
    @OneToMany(() => RecadoEntity, recado => recado.para )
    recadosRecebidos!: RecadoEntity[];
}
