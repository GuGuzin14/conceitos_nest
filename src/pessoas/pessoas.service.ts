import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import path from 'path';
import * as fs from 'fs/promises';

@Injectable({scope: Scope.TRANSIENT})
export class PessoasService {
  private count = 0;
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {

    const passwordHash = await this.hashingService.hash(createPessoaDto.password, )

    const dadosPessoas = {
      nome: createPessoaDto.nome,
      passwordHash,
      email: createPessoaDto.email,
      // routePolicies: createPessoaDto.routePolicies
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

  async update(id: number, updatePessoaDto: UpdatePessoaDto, tokenPayload: TokenPayloadDto) {
    const dadosPessoa = {
      nome: updatePessoaDto?.nome,
    };

      if (updatePessoaDto?.password){
        const passwordHash = await this.hashingService.hash(updatePessoaDto.password,)

        dadosPessoa['passwordHash'] = passwordHash;
      }
      

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa,
  });

  if(!pessoa){
    throw new NotFoundException('Pessoa não encontrada');
  }

  if(pessoa.id !== tokenPayload.sub){
    throw new ForbiddenException('Você não é essa pessoa')
  }

  return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const pessoa = await this.pessoaRepository.findOne({
  where: { id },
});
    if(pessoa?.id !== tokenPayload.sub){
    throw new ForbiddenException('Você não é essa pessoa')
  }

    return this.pessoaRepository.remove(pessoa);
  }

  async uploadPicture(file:Express.Multer.File, tokenPayload: TokenPayloadDto){
       if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
          throw new BadRequestException('Formato inválido. Use JPEG ou PNG.');
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new BadRequestException('Arquivo muito grande. Máx 10 MB.');
        }

        if(file.size < 1024){
          throw new BadRequestException ('Arquivo muito pequeno');
        }

        const pessoa = await this.findOne(tokenPayload.sub)

        const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
        const fileName = `${tokenPayload.sub}.${fileExtension}`
        const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName)

        await fs.writeFile(fileFullPath, file.buffer)
        
        pessoa.picture = fileName;
        
        await this.pessoaRepository.save(pessoa)

        return pessoa;
  }
}
