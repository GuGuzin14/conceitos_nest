import { BadRequestException, CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, tap, throwError } from "rxjs";

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  async intercept(
        context: ExecutionContext, 
        next: CallHandler<any>,
    ){
        console.log('ErrorHandlingInterceptor Executado ANTES');

        return next.handle().pipe(
            catchError(error => {
                console.log(error.name);
                console.log(error.message);
                return throwError(() => {
                    if (error.name === 'NotFoundException'){
                        return new BadRequestException(error.message);
                    }

                    return new BadRequestException('Ocorreu um erro desconhecido');
                });
            })
        )

    }
}