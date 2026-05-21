import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { RecadoEntity } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from '../pessoas/pessoas.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RecadosUtils } from './recados.utils';

  //Scope.DEFAULT -> É UM SINGLETON
  //Scope.REQUEST -> É UM SINGLETON, é instanciado a cada requisição
  //Scope.TRANSIENT -> É criada uma instancia do provider para cada classe que injetar este provider

@Injectable( { scope: Scope.REQUEST })
export class RecadosService {
  constructor(
    @InjectRepository(RecadoEntity)
    private readonly recadoRepository: Repository<RecadoEntity>,
    private readonly pessoasService: PessoasService,
    private readonly recadosUtils: RecadosUtils,
  ){}

 async findAll( paginationDto?: PaginationDto){
    const {limit = 10, offset = 0} = paginationDto || {};
    const recados = this.recadoRepository.find({
      take:limit, // Quantos registros serão exibidos por página
      skip:offset,// Quantos registros deves ser pulados
      // relations: ['de', 'para'],
      // order: {
      //   id: 'desc',
      // },
      // select:{
      //   de: {
      //     id: true,
      //     nome: true,
      //   },
      //   para: {
      //     id: true,
      //     nome: true,
      //   },
      // },
    });

    return recados;
  }

 async findOne(id: number){
  console.log(this.recadosUtils.inverteString('Luiz'))
    const recado = await this.recadoRepository.findOne({
      where: {
        id, 
      },
      relations: ['de', 'para'],
      order: {
        id: 'desc',
      },
      select:{
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
   if (recado) return recado;

   return this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto){
    const {deId, paraId} = createRecadoDto;
    // Encontrar a pessoa que esta criando o recado
    const de = await this.pessoasService.findOne(deId);
    // Encontrar a pessoa para quem o recado esta sendo enviado
    const para = await this.pessoasService.findOne(paraId);

    const novoRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };

    const recado = await this.recadoRepository.create(novoRecado)
    await this.recadoRepository.save(recado)

    return {
      ...recado,
      de: {
        id:recado.de.id
      },
      para: {
        id:recado.para.id
      }
    };
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto){
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
    });

    if (!recado) return this.throwNotFoundError();

    recado.texto = updateRecadoDto?.texto ?? recado.texto;
    recado.lido = updateRecadoDto?.lido !== undefined ? updateRecadoDto.lido : recado.lido;

    await this.recadoRepository.save(recado);
    return recado;
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
