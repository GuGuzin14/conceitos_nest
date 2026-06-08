import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from '../recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from '../pessoas/pessoas.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from './app.config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: async (appConfiguration: ConfigType<typeof appConfig>) => {
        return {
        type: appConfiguration.database.type,
        host: appConfiguration.database.host,
        port: appConfiguration.database.port,
        username: appConfiguration.database.username,
        database:appConfiguration.database.database,
        password: appConfiguration.database.password,
        autoLoadEntities: appConfiguration.database.autoLoadEntities,
        synchronize: appConfiguration.database.synchronize,
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
