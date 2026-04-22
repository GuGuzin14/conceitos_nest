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
  UsePipes,
  UseInterceptors,
  Req,
} from '@nestjs/common';

import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TimingConnectionInterceptor } from 'src/common/interceptor/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from 'src/common/interceptor/error-handling.interceptor';
import { SimpleCacheInterceptor } from 'src/common/interceptor/simple-cache.interceptor';
import { ChangeDataInterceptor } from 'src/common/interceptor/change-data.interceptor';
import { AuthTokenInterceptor } from 'src/common/interceptor/auth-token.interceptor';

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
@UseInterceptors(AuthTokenInterceptor)
@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto, @Req() req: Request) {
    console.log('RecadosController', req['user'])
    const recados = await this.recadosService.findAll(paginationDto)
    return recados;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
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
