import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecadoEntity } from './entities/recado.entity';
import { PessoasModule } from '../pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';
import { ONLY_LOWERCASE_LETTERS_REGEX, REMOVE_SPACES_REGEX, SERVER_NAME } from 'src/recados/recados.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';
import { RegexFactory } from 'src/common/regex/regex.factory';
import { resolve } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecadoEntity]),
    forwardRef(() => PessoasModule)
  ],
  controllers: [  
    RecadosController
  ],
  providers: [RecadosService, RegexFactory,
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
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useClass: OnlyLowercaseLettersRegex
    },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex
    },
    {
      provide: REMOVE_SPACES_REGEX, //token
      useFactory: async (regexFactory: RegexFactory) => {
        // Espera alguma coisa acontecer
        console.log('ESPERANDO: Vou aguardar a promise ser resolvida')
        await new Promise(resolve => setTimeout(resolve, 3000))
        console.log('PRONTO: Vou aguardar a promise ser resolvida')
       //Meu codigo/lógica
       return regexFactory.create('RemoveSpacesRegex')
    },// Factory
    inject: [RegexFactory], // Injetando na factory na ordem
  },
  ],
  exports: [RecadosUtils, SERVER_NAME],
})
export class RecadosModule {}
