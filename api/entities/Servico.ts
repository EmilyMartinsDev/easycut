import { v4 } from "uuid";

export class Servico {
    private valor: number;
    private descricao: string;
    private id?: string;

    constructor(valor: number, descricao: string, id?: string) {
        this.valor = valor;
        this.descricao = descricao;
        this.id = id ?? v4();
        this.validate()
    }

    get Valor(): number {
        return this.valor;
    }
    get Descricao(): string {
        return this.descricao;
    }
    get Id(): string | undefined{
        return this.id;
    }

    update(valor:number, descricao: string): void {
        this.valor = valor;
        this.descricao = descricao;
        this.validate()
    }
    private validate() {
        if (this.valor <= 0) {
            throw new Error("Valor deve ser maior que zero");
        }
        if (this.descricao.length <= 0) {
            throw new Error("Descrição deve ser maior que zero");
        }
    }
}
