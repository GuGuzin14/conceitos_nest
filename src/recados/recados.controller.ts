import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import { RecadosService } from './recados.service';

@Controller('recados')
export class RecadosController {
    // constructor (private readonly recadosService: RecadosService) {}

    @Get()
    findAll(){
        return 'Mostrar todos os recados.';
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        console.log(id);
        return `Essa rota retorna UM recado ID: ${id}`;
    }

    @Post()
    create(@Body('Nova chave') body: any){
        return body;
    }
}
