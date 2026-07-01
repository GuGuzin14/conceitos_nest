import test, { beforeEach, describe, it } from "node:test";
import { PessoasService } from "./pessoas.service";
import { Repository } from "typeorm";
import { Pessoa } from "./entities/pessoa.entity";
import { HashingService } from "src/auth/hashing/hashing.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import {expect, jest} from '@jest/globals';
import { CreatePessoaDto } from "./dto/create-pessoa.dto";
import { ConflictException } from "@nestjs/common";

describe('PessoasService', ()=> {
    
    let pessoaService: PessoasService;
    let pessoaRepository: Repository<Pessoa>;
    let hashingService: HashingService;



    beforeEach(async ()=> {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PessoasService,
                {
                    provide: getRepositoryToken(Pessoa),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                    
                },
                {
                    provide: HashingService,
                    useValue: {
                        hash: jest.fn(),
                    },
                }

            ],
        }).compile();

    pessoaService = module.get(PessoasService);
    pessoaRepository= module.get<Repository<Pessoa>>(
        getRepositoryToken(Pessoa),
    );
    hashingService= module.get<HashingService>(HashingService);
    });


    //Caso - Teste
    it('Deve estar definido', ()=> {
        expect(pessoaService).toBeDefined();
    });

    describe('create', ()=> {
        it('Should create a new person', async ()=> {
        //Arange
        const createPessoaDto: CreatePessoaDto = {
            email: 'luiz@email.com',
            nome: 'Luiz',
            password: '123456',
        }

        const passwordHash = 'HASHDESENHA';
        const novaPessoa = { 
            id: 1, 
            nome: createPessoaDto.nome,
            email: createPessoaDto.email,
            passwordHash,
        }

        //Como o valor retornado por hashingService.hash é necessario, vamos simular esse valor.
        jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
        //Como a pessoa retornada por pessoaRepository.create é necessaria em pessoaRepository.save, vamos simular esse valor;
        jest.spyOn(pessoaRepository, 'create').mockReturnValue(novaPessoa as any);

        //Act
        const result = await pessoaService.create(createPessoaDto);

        // Assert
        //O metodo hashingService.hash foi chamado com o createPessoaDto.password? 
        expect(hashingService.hash).toHaveBeenCalledWith(createPessoaDto.password);
    
        //o metodo pessoaReporitory.create foi chamado com os dados da nova pessoa com o hash de senha gerado no hashingService.hash?
        expect(pessoaRepository.create).toHaveBeenCalledWith({
            nome: createPessoaDto.nome,
            passwordHash: 'HASHDESENHA',
            email: createPessoaDto.email
        
        });
        //o método pessoaRepository.save foi chamado com os dados da nova pessoa gerada por pessoaRepository.create?
        expect(pessoaRepository.save).toHaveBeenCalledWith(novaPessoa);
        //O resultado do metodo pessoaService.create retornou a nova pessoa criada?
        expect (result).toEqual(novaPessoa);
    });

        it('deve lançar ConflictException quando email ja existir'), async () => {  
        jest.spyOn(pessoaRepository, 'save').mockRejectedValue({
            code: '23505', //codigo de ConflictException
        });

        

        await expect (pessoaService.create({} as any)).rejects.toThrow(
            ConflictException,
        )
        }
    })
   

})