import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Pessoa } from "src/pessoas/entities/pessoa.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
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

        const accessToken = await this.jwtService.signAsync(
        {
            sub: pessoa?.id,
            email: pessoa?.email
        },
        {
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            secret: this.jwtConfiguration.secret,
            expiresIn: this.jwtConfiguration.jwtTtl,
        },
    
    );


        return {
            accessToken,
        };
    }
}