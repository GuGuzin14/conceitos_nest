import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadoEntity } from './entities/recado.entity';
import { PessoasModule } from '../pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecadoEntity]),
    forwardRef(() => PessoasModule)
  ],
  controllers: [  
    RecadosController
  ],
  providers: [RecadosService, 
    {
      provide: RecadosUtils, // token
      useValue: new RecadosUtilsMock()// Valor a ser usado
      //  useClass: RecadosUtils,
    }
  ],
  exports: [RecadosUtils],
})
export class RecadosModule {}
