import { Injectable }  from '@nestjs/common'

@Injectable()
export class RecadosUtils {
    inverteString(str: string){
        console.log("Não é Mock")
        return str.split('').reverse().join()
    }
}

@Injectable()
export class RecadosUtilsMock {
    inverteString(){
        console.log("Passei no Mock")
        return 'Bla Bla Bla';
    }
}