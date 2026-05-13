/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';

import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ReqDataParam } from '../common/params/req-data-param.decorator';
import { RecadosUtils } from './recados.utils';
import { ONLY_LOWERCASE_LETTERS, REMOVE_SPACES_REGEX, SERVER_NAME } from 'src/recados/recados.constant';
import type { RegexProtocol } from 'src/common/regex/regex.protocol';


//CRUD
// Create -> POST -> Criar Recado
// Read -> GET -> Ler todos os recados
// Read -> GET -> Ler apenas um recado
// Update -> PATCH / PUT -> Atualizar um Recado
// Delete -> DELETE -> Apagar um recado

// Patch é utilizado para atualizar dados de um recurso.
// PUT é utilizado para atualizar o recurso inteiro.

// DTO - Data Transfer Object -> Objeto de transferencia de dados
// DTO -> Objeto simples -> Validar dados / transformar dados
@Controller('recados')
export class RecadosController {
  constructor(
  private readonly recadosService: RecadosService,
  private readonly recadosUtils: RecadosUtils,
  @Inject(SERVER_NAME)
  private readonly serverName: string,
  @Inject(REMOVE_SPACES_REGEX)
  private readonly removeSpacesRegex: RegexProtocol,
  @Inject(ONLY_LOWERCASE_LETTERS)
  private readonly onlyLowercaseLetters: RegexProtocol

) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto,@ReqDataParam('method') method) {
    console.log(this.removeSpacesRegex.execute(this.serverName));
    console.log(this.onlyLowercaseLetters.execute(this.serverName));
    console.log(this.serverName);
    const recados = await this.recadosService.findAll(paginationDto)
    return recados;

  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    console.log(this.recadosUtils.inverteString('Luiz'))
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRecadoDto: UpdateRecadoDto) {
    return this.recadosService.update(id, updateRecadoDto);
  }
  
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.recadosService.remove(id)
  }
}
