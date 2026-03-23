import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosService {
  testeRecados(): string {
    return 'Esse recado foi mostrado';
  }

  helloWorld(): string {
    return 'Hello World!!!';
  }
}
