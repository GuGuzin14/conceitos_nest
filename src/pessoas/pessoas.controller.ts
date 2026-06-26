import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth.token.guard';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token.payload.param';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import {Multer} from 'multer';


@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService){}
  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  findAll() {
    return this.pessoasService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoasService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update( // <--- Nome da Função
  @Param('id') id: string,
  @Body() updatePessoaDto: UpdatePessoaDto,
  @TokenPayloadParam() tokenPayload: TokenPayloadDto) 
  {
    return this.pessoasService.update(+id, updatePessoaDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.pessoasService.remove(+id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  async uploadPicture(@UploadedFile() file:Express.Multer.File, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {

      return this.pessoasService.uploadPicture(file, tokenPayload);
    }
  }



  

   // const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
      // const fileName = `${randomUUID()}.${fileExtension}`;
      // const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);
      
      // result.push(fileFullPath);

      // await fs.writeFile(fileFullPath, file.buffer);

