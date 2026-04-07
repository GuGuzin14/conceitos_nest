import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PessoasService {

  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    const dadosPessoas = {
      nome: createPessoaDto.nome,
      passwordHash: createPessoaDto.password,
      email: createPessoaDto.email,
    };
    
    try {
      const novaPessoa = this.pessoaRepository.create(dadosPessoas);
      await this.pessoaRepository.save(novaPessoa);
      return novaPessoa;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '23505') {
        throw new ConflictException('E-mail já esta cadastrado');
      }
      throw error;
    }
  }

  async findAll() {
    return this.pessoaRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} pessoa`;
  }

  update(id: number, updatePessoaDto: UpdatePessoaDto) {
    return `This action updates a #${id} pessoa`;
  }

  async remove(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });
    if(!pessoa){
      throw new NotFoundException('Pessoa não encontrada');
    }

    return this.pessoaRepository.remove(pessoa);
  }
}
