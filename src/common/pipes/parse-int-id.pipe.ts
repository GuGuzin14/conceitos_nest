import { ArgumentMetadata, BadGatewayException, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIntIdPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        console.log('ParseIntPipe Executado')
        if(metadata.type !== 'param' || metadata.data !== 'id'){
            return value;
        }
        
        const parsedValue = Number(value);

        if(isNaN(parsedValue)){
            throw new BadRequestException(
                'ParseIntIdPipe espera um string numerica'
            );
        }
        if(parsedValue < 0){
            throw new BadRequestException(
                'ParseIntIdPipe espera um numero maior que zero'
            );
        }
        return parsedValue;
    }
}