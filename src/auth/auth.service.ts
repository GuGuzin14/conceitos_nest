import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Pessoa } from "src/pessoas/entities/pessoa.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import type { ConfigType } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ){
        console.log(jwtConfiguration)
    }
    async login(LoginDto: LoginDto){
        let passwordIsValid = false;
        let throwError = true;

        const pessoa = await this.pessoaRepository.findOneBy({
            email: LoginDto.email,
        })

        if(pessoa){
            //checar senha
            passwordIsValid = await this.hashingService.compare(
                LoginDto.password,
                pessoa.passwordHash,
            )
        }

        if(passwordIsValid){
            throwError = false;
        }

        if(throwError){
            throw new UnauthorizedException ("Usuario ou senha inválidos");
        }

        // Gerar novo Token JWT e entregar para o usuario


        return {
            message: "Usuario Logado"
        };
    }
}