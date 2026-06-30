import test, { beforeEach, describe, it } from "node:test";
import { expect } from '@jest/globals';

describe('PessoasService 1111', ()=> {
    beforeEach(async ()=> {
        console.log('Isso será executado antes de cada test');
    });


    //Caso - Teste
    it('Should test anything if user can create profile', ()=> {});
   // Configurar
   const numero1 = 1
   const numero2 = 2
   // Fazer alguma ação

   const result = numero1 + numero2;
   // Conferir se essa ação foi a esperada - Assert
   expect(result).toBe(3);

})