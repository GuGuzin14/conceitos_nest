import { Injectable, NotFoundException } from '@nestjs/common';
import { RecadoEntity } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

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

  create(CreateRecadoDto: CreateRecadoDto){
    this.lastId++;

    const id = this.lastId;
    const novoRecado = {
      id,
      ...CreateRecadoDto,
      lido: false,
      data: new Date(),
    };
    this.recados.push(novoRecado);

    return novoRecado;
  }

  update(id: string, UpdateRecadoDto: UpdateRecadoDto){
    const recadoExistenteIndex = this.recados.findIndex(
      item => item.id === +id,
    );
    if (recadoExistenteIndex < 0){
      return this.throwNotFoundError();
    }
      const recadoExistente = this.recados[recadoExistenteIndex];

      this.recados[recadoExistenteIndex] = {
        ...recadoExistente,
        ...UpdateRecadoDto,
    }
    return this.recados[recadoExistenteIndex];
  }

  remove(id: number){
    const recadoExistenteIndex = this.recados.findIndex(
      item => item.id === id,
    );

    if (recadoExistenteIndex < 0){
      return this.throwNotFoundError();
    }

    const recado = this.recados[recadoExistenteIndex]

    this.recados.splice(recadoExistenteIndex, 1);

    return recado;
  }

  throwNotFoundError(){
    throw new NotFoundException("Recado não encontrado");
  }
}
