// Cliente (Navegador) -> Servidor -> Middleware (Request, Response)
// -> NestJS (Guards, Interceptor, Pipes, Filters)

import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class SimpleMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        console.log('SimpleMiddleware: Olá')
        const initialTime = Date.now()
        const authorization = req.headers?.authorization;

        if (authorization){
            req['user'] = {
                nome: 'Luiz',
                sobrenome: 'Otávio',
                role: 'admin',
            }
        }

        // Possibilidade de enviar Exceptions
        // if(authorization){
        //    throw new BadRequestException("Erro");
        // }

         res.setHeader('CABECALHO', 'Do Middleware');


        // TERMINANDO A CADEIA DE CHAMADAS
        // return res.status(404).send({
        //     message: 'Não encontrado'
        // })

        next()

        console.log('SimpleMiddleware: Tchau');

        res.on('finish', () => {
            const finalTime = Date.now();
            const timeElapsed = finalTime - initialTime;
            console.log(`SimpleMiddleware finish: ${timeElapsed}ms`)
        })
        
    }
}