import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth.token.guard';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token.payload.param';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import {Multer} from 'multer';
import * as path from 'path';
import * as fs from 'fs/promises';
import { randomUUID } from 'crypto';


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
  @UseInterceptors(FilesInterceptor('file'))
  @Post('upload-picture')
  async uploadPicture(@UploadedFiles( 
    new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({maxSize: 10 * (1024 * 1024)}),
      new FileTypeValidator({fileType: 'image/png'})
    ],
  })) files:Array<Express.Multer.File>, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    const result: string[] = []
    files.forEach(async file => {

      if(file.size < 1024){
        throw new BadRequestException('Arquivo muito pequeno');
      }

      const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
      const fileName = `${randomUUID()}.${fileExtension}`;
      const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);
      
      result.push(fileFullPath);

      await fs.writeFile(fileFullPath, file.buffer);
    })

    return result;

  //   const mimetype = file.mimetype;
  //   const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
  //   const fileName = `${tokenPayload.sub}.${fileExtension}`
  //   const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName)
  //   console.log(fileName);
  //   console.log(fileFullPath);

  //   await fs.writeFile(fileFullPath, file.buffer)

  //   return {

  //     "fieldname": file.fieldname,
  //     "originalname": file.originalname,
  //     "mimetype": file.mimetype,
  //     "buffer": {},
  //     "size": file.size,
  // }
}
}
