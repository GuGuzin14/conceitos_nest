import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from '../recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from '../pessoas/pessoas.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi'
import appConfig from './app.config';
import { Type } from 'class-transformer';


@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.env', //Busca arquivo de variaveis de ambiente para usar
      load:[appConfig],
      validationSchema: Joi.object({
        DATABASE_TYPE:Joi.required(),
        DATABASE_HOST:Joi.required(),
        DATABASE_PORT:Joi.number().default(5432),
        DATABASE_USERNAME:Joi.required(),
        DATABASE_DATABASE:Joi.required(),
        DATABASE_PASSWORD:Joi.required(),
        DATABASE_AUTOLOADENTITIES:Joi.number().min(0).max(1).default(0),
        DATABASE_SYNCHRONIZE:Joi.number().min(0).max(1).default(0),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [],
      useFactory: async (configService: ConfigService) => {
        return {
        type: configService.get<'postgres'>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        database: configService.get<string>('database.database'),
        password: configService.get<string>('database.password'),
        autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
        synchronize: configService.get<boolean>('database.synchronize'),
        }
      }
    }),
    RecadosModule,
    PessoasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {
}
