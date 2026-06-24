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
  UseGuards,
  SetMetadata,
} from '@nestjs/common';

import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth.token.guard';
import { TokenPayloadParam } from 'src/auth/params/token.payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

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
  private readonly recadosService: RecadosService){}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosService.findAll(paginationDto)
    return recados;

  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }
  @Patch(':id')
  @UseGuards(AuthTokenGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRecadoDto: UpdateRecadoDto, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }
  
  @Delete(':id')
  @UseGuards(AuthTokenGuard)
  delete(@Param('id', ParseIntPipe) id: number, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.remove(id, tokenPayload)
  }
}
