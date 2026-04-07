import { IsEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

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
}
