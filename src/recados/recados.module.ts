import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadoEntity } from './entities/recado.entity';
import { PessoasModule } from '../pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';
import { ONLY_LOWERCASE_LETTERS, REMOVE_SPACES_REGEX, SERVER_NAME } from 'src/recados/recados.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowercaseLetters } from 'src/common/regex/only-lowercase-letters.regex';

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
    },
    {
      provide: SERVER_NAME,
      useValue: 'My name is Nestjs'
    },
    {
      provide: ONLY_LOWERCASE_LETTERS,
      useClass: OnlyLowercaseLetters
    },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex
    }
  ],
  exports: [RecadosUtils, SERVER_NAME],
})
export class RecadosModule {}
