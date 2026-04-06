import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RecadoEntity } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(RecadoEntity)
    private readonly recadoRepository: Repository<RecadoEntity>
  ){}
 async findAll(){
    const recados = this.recadoRepository.find();

    return recados;
  }

 async findOne(id: number){
  //  const recado = this.recados.find(item=> item.id === +id)
    const recado = await this.recadoRepository.findOne({
      where: {
        id, 
      },
    });
   if (recado) return recado;

   return this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto){
    const novoRecado = {
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    };

    const recado = await this.recadoRepository.create(novoRecado)
    return this.recadoRepository.save(recado)
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto){
  const partialUpdateRecadoDto = {
    lido: updateRecadoDto?.lido,
    texto: updateRecadoDto?.texto,
  }

   const recado = await this.recadoRepository.preload({
    id,
    ...updateRecadoDto
   });

   if (!recado) {
    return this.throwNotFoundError();
   }

   return this.recadoRepository.save(recado);
  }

 async remove(id: number){
    const recado = await this.recadoRepository.findOneBy({
      id,
    })

    if (!recado) return recado

    return this.recadoRepository.remove(recado)
  }

  throwNotFoundError(): never {
    throw new NotFoundException("Recado não encontrado");
  }
}
