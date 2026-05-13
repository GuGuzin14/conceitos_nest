import { RegexProtocol } from "./regex.protocol";

export class OnlyLowercaseLetters implements RegexProtocol {

    //Deixa apenas as letras minusculas
    execute(str: string): string {
        return str.replace(/[^a-z]/g, '');
    }
}