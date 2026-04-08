import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';

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
    const pessoas = await this.pessoaRepository.find({
      order: {
      id: 'desc',
  }});
  return pessoas;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });

    if(!pessoa){
      throw new NotFoundException('Pessoa não encontrada');
    }
    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const dadosPessoa = {
      nome: updatePessoaDto?.nome,
      passwordHash: updatePessoaDto?.password,
    };

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa,
  });

  if(!pessoa){
    throw new NotFoundException('Pessoa não encontrada');
  }

  return this.pessoaRepository.save(pessoa);
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
