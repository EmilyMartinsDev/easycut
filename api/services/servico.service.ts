import { ICreateInput, ICreateOutput } from "../dto/servico/create";
import { IDeleteInput } from "../dto/servico/delete";
import { IListInput, IListOutput } from "../dto/servico/list";
import { IUpdateInput, IUpdateOutput } from "../dto/servico/update";
import { Servico } from "../entities/Servico";
import { IServicoRepo } from "../repositories/servico.repo";



export class ServicoService {
    private repo: IServicoRepo
    constructor(repo: IServicoRepo) {
        this.repo = repo
    }
    async create(input: ICreateInput): Promise<ICreateOutput> {
        const servico = new Servico(input.valor, input.descricao)

        const serviceIsAlready = await this.repo.findByDescription(input.descricao)

        if(serviceIsAlready){
            throw new Error('Servico já existe')
        }

        const output = await this.repo.create(servico)
        return {
            id: output.Id as string,
            descricao: output.Descricao,
            valor: output.Valor
        }
    }

    async findAll(params: IListInput): Promise<IListOutput> {
        const { servicos, total } = await this.repo.listarComPaginacao({
            pagina: params.pagina,
            itensPorPagina: params.itensPorPagina,
            busca: params.busca
        });

        return {
            servicos: servicos.map((servico:Servico) => ({
                id: servico.Id as string,
                descricao: servico.Descricao,
                valor: servico.Valor
            })),
            total
        };
    }
    async delete(input:IDeleteInput): Promise<Servico>{
        const servico = await this.repo.delete(input.id)
        return servico
    }
    async update(input: IUpdateInput): Promise<IUpdateOutput>{
        const servico = new Servico(input.valor, input.descricao, input.id)
        const output = await this.repo.update(servico)
        return {
            id: output.Id as string,
            descricao: output.Descricao,
            valor: output.Valor
        }
    }

    async getById(id:string){
        const output = await this.repo.getById(id)
        return output
    }

}

