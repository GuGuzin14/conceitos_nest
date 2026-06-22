import { ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Pessoa } from "src/pessoas/entities/pessoa.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

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

        if(!pessoa){ //Criado para pessoa não ser um Null
            throw new Error('Pessoa não encontrada')
        }

        return this.createTokens(pessoa);

    }

    private async createTokens(pessoa: Pessoa){

        const accessTokenPromise = await this.signJwtAsync<Partial<Pessoa>>(pessoa!.id, this.jwtConfiguration.jwtTtl,{email: pessoa?.email});

        const refreshTokenPromise = await this.signJwtAsync(pessoa!.id, this.jwtConfiguration.jwtRefreshTtl,);

        const [accessToken, refreshToken] = await Promise.all([
            accessTokenPromise,
            refreshTokenPromise
        ])
        return {
            accessToken,
            refreshToken,
        };
    }

    private async signJwtAsync<T>(sub: number, expiresIn: number, payload?:T) {
        return await this.jwtService.signAsync(
            {
                sub, 
                ...payload,
                
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn,
            }

        );
    }

   async refreshTokens(refreshTokenDto: RefreshTokenDto){
        try {
            const {sub} = await this.jwtService.verifyAsync(
                refreshTokenDto.refreshToken,
                this.jwtConfiguration
            )
            const pessoa = await this.pessoaRepository.findOneBy({
                id: sub
            })

            if(!pessoa){
                throw new Error('Pessoa não encontrada.')
            }

            return this.createTokens(pessoa)

        } catch(error: any){
            throw new UnauthorizedException(error.message)
        }
    }
}