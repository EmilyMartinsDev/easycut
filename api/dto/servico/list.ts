import { Servico } from "../../entities/Servico";

export interface IListInput {
    pagina: number;
    itensPorPagina: number;
    busca?: string;
}

export interface IListOutput {
    servicos: {
        id: string;
        descricao: string;
        valor: number;
    }[];
    total: number;
}