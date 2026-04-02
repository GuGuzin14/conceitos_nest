/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

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
  constructor(private readonly recadosService: RecadosService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: any) {
    //const { limit = 10, offset = 10 } = pagination;
    //return `Retorna todos os recados. limit=${limit}, Offset=${offset}`;
    return this.recadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() CreateRecadoDto: CreateRecadoDto) {
    return this.recadosService.create(CreateRecadoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateRecadoDto: UpdateRecadoDto) {
    return this.recadosService.update(id, UpdateRecadoDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    console.log(id, typeof id)
    return this.recadosService.remove(id)
  }
}
