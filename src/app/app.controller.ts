import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import type { ConfigType } from '@nestjs/config';
import globalConfig from 'src/global-config/global.config';

@Controller('home') // /home
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject(globalConfig.KEY)
    private readonly globalConfiguration: ConfigType<typeof globalConfig>,
  ) {}

  //Método da solicitação -> Ler (Read) -> CRUD
  // /home/hello
  @Get('hello')
  getHello(): string {
    const retorno = 'Retorno';
    return retorno;
  }

  // @Get('exemplo')
  exemplo() {
    return this.appService.solucionaExemplo();
  }
}
