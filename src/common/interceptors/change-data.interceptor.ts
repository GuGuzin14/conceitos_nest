import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map } from "rxjs";

@Injectable()
//Interceptor de cache de exemplo, não é o melhor metodo para se fazer o cache do projeto.
export class ChangeDataInterceptor implements NestInterceptor {
    private readonly cache = new Map();
  async intercept(
        context: ExecutionContext, 
        next: CallHandler<any>,
    ){
    
        return next.handle().pipe(
            map(data => {
              if(Array.isArray(data)){
                return {
                    data,
                    count: data.length,
               }
           }
           return data;
        }
    )
        );
    }   
}