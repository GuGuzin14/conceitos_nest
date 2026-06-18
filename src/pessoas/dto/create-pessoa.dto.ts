import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePessoaDto {

    @IsEmail()
    email!: string; //E-mail será o usuario

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password!: string; // Será convertida em Hash

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    nome!: string;
}
