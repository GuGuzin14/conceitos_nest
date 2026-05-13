import { RegexProtocol } from "./regex.protocol";

//Remove os espaços do texto
export class RemoveSpacesRegex implements RegexProtocol {
    execute(str: string): string {
        return str.replace(/\s+/g, '');
    }
}