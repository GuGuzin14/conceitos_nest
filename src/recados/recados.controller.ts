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
} from '@nestjs/common';

import { RecadosService } from './recados.service';

//CRUD
// Create -> POST -> Criar Recado
// Read -> GET -> Ler todos os recados
// Read -> GET -> Ler apenas um recado
// Update -> PATCH / PUT -> Atualizar um Recado
// Delete -> DELETE -> Apagar um recado

// Patch é utilizado para atualizar dados de um recurso.
// PUT é utilizado para atualizar o recurso inteiro.
@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: any) {
    //const { limit = 10, offset = 10 } = pagination;
    //return `Retorna todos os recados. limit=${limit}, Offset=${offset}`;
    return this.recadosService.helloWorld();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return `Essa rota retorna UM recado ID: ${id}`;
  }

  @Post()
  create(@Body('Nova chave') body: string) {
    return body;
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return {
      id,
      ...body,
    };
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return `Essa rota foi deletada: ${id}`;
  }
}
