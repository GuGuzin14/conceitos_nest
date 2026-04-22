import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext, 
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        //Checar token JWT
        
        if(!token || token != '123456'){
            throw new UnauthorizedException('Usuario não logado');
        }

        console.log('Seu token: ', token)
        return next.handle();
    }
}