// Cliente (Navegador) -> Servidor -> Middleware (Request, Response)
// -> NestJS (Guards, Interceptor, Pipes, Filters)

import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class OutroMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        console.log('OutroMiddleware: Olá')
        const authorization = req.headers?.authorization;

        if (authorization){
            req['user'] = {
                nome: 'Luiz',
                sobrenome: 'Otávio'
            }
        }

         res.setHeader('CABECALHO', 'Do Middleware')


        // TERMINANDO A CADEIA DE CHAMADAS
        // return res.status(404).send({
        //     message: 'Não encontrado'
        // })

        next()
        console.log('OutroMiddleware: Tchau')
        
    }
}