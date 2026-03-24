import { Injectable, NotFoundException } from '@nestjs/common';
import { RecadoEntity } from './entities/recado.entity';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: RecadoEntity[]=[
  {
    id: 1,
    texto: 'Recado de Teste',
    de:'Joana',
    para: 'João',
    lido: false,
    data: new Date(),

  }
]
  findAll(){
    return this.recados;
  }

  findOne(id: string){
   const recado = this.recados.find(item=> item.id === +id)

   if (recado) return recado;

   return this.throwNotFoundError();
  }

  create(body: any){
    this.lastId++;

    const id = this.lastId;
    const novoRecado = {
      id,
      ...body,
    };
    this.recados.push(novoRecado);

    return novoRecado;
  }

  update(id: string, body: any){

    const recadoExistenteIndex = this.recados.findIndex(
      item => item.id === +id,
    );
    if (recadoExistenteIndex < 0){
      return this.throwNotFoundError();
    }
      const recadoExistente = this.recados[recadoExistenteIndex];

      this.recados[recadoExistenteIndex] = {
        ...recadoExistente,
        ...body,
    }
    return this.recados[recadoExistenteIndex];
  }

  remove(id: string){
    const recadoExistenteIndex = this.recados.findIndex(
      item => item.id === +id,
    );

    if (recadoExistenteIndex < 0){
      return this.throwNotFoundError();
    }

    const recado = this.recados[recadoExistenteIndex]

    this.recados.splice(recadoExistenteIndex);

    return recado;
  }

  throwNotFoundError(){
    throw new NotFoundException("Recado não encontrado");
  }
}
