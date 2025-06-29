// src/controllers/servico.controller.ts
import { Request, Response } from 'express';
import { ServicoService } from "../services/servico.service";
import { Servico } from '../entities/Servico';
// src/interfaces/servico.interface.ts

export interface IServicoCreateRequest {
    valor: number;
    descricao: string;
}

export interface IServicoUpdateRequest extends IServicoCreateRequest {
    id: string;
}

export interface IServicoResponse {
    id: string;
    valor: number;
    descricao: string;
    // Adicione outros campos se necessário
}

export interface IServicoListResponse {
    servicos: IServicoResponse[];
    total: number;
}

export class ServicoController {
    constructor(private readonly servicoService: ServicoService) { }

    async create(req: Request, res: Response): Promise<any> {
        try {
            const { valor, descricao }: IServicoCreateRequest = req.body;
            
            const servico = await this.servicoService.create({ valor, descricao });
            
            return res.status(201).json({
                id: servico.id,
                valor: servico.valor,
                descricao: servico.descricao
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Erro ao criar serviço',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    async getById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            
            const servico = await this.servicoService.getById(id);
            
            if (!servico) {
                return res.status(404).json({ message: 'Serviço não encontrado' });
            }
            
            return res.status(200).json({
                id: servico.Id,
                valor: servico.Valor,
                descricao: servico.Descricao
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Erro ao buscar serviço',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

  async getAll(req: Request, res: Response): Promise<any>{
        try {
            const pagina = parseInt(req.query.pagina as string) || 1;
            const itensPorPagina = parseInt(req.query.itensPorPagina as string) || 10;
            const busca = req.query.busca as string || '';
            
            const resultado = await this.servicoService.findAll({
                pagina,
                itensPorPagina,
                busca
            });
            
            return res.status(200).json({
                servicos: resultado.servicos,
                total: resultado.total
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Erro ao listar serviços',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    async update(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { valor, descricao }: IServicoUpdateRequest = req.body;
            
            const servico = await this.servicoService.update({descricao, id, valor});
            
            if (!servico) {
                return res.status(404).json({ message: 'Serviço não encontrado' });
            }
            
            return res.status(200).json({
                id: servico.id,
                valor: servico.valor,
                descricao: servico.descricao
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Erro ao atualizar serviço',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            
            const result = await this.servicoService.delete({id});
            
            if (!result) {
                return res.status(404).json({ message: 'Serviço não encontrado' });
            }
            
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ 
                message: 'Erro ao deletar serviço',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }
}