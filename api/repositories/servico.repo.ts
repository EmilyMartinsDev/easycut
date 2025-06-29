import { PrismaClient } from "@prisma/client";
import { Servico } from "../entities/Servico";

export interface IServicoRepo {
    create(servico: Servico): Promise<Servico>;
    update(servico: Servico): Promise<Servico>;
    delete(id: string): Promise<Servico>;
    getAll(): Promise<Servico[]>;
    findByDescription(descricao: string): Promise<Servico | null>;
    getById(id: string): Promise<Servico>;
    listarComPaginacao(params: {
        pagina: number;
        itensPorPagina: number;
        busca?: string;
    }): Promise<{ servicos: Servico[]; total: number }>;
}

export class ServicoRepo implements IServicoRepo {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getById(id: string): Promise<Servico> {
        const servico = await this.prisma.servico.findUnique({ 
            where: { id } 
        });
        
        if (!servico) {
            throw new Error('Serviço não encontrado');
        }
        
        return this.toEntity(servico);
    }

    async create(servico: Servico): Promise<Servico> {
        const created = await this.prisma.servico.create({
            data: {
                id: servico.Id as string,
                descricao: servico.Descricao,
                valor: servico.Valor,
            }
        });
        return this.toEntity(created);
    }

    async update(servico: Servico): Promise<Servico> {
        const updated = await this.prisma.servico.update({
            where: { id: servico.Id },
            data: {
                descricao: servico.Descricao,
                valor: servico.Valor,
            }
        });
        return this.toEntity(updated);
    }

    async delete(id: string): Promise<Servico> {
        const deleted = await this.prisma.servico.delete({
            where: { id }
        });
        return this.toEntity(deleted);
    }

    async getAll(): Promise<Servico[]> {
        const servicos = await this.prisma.servico.findMany({
            orderBy: { descricao: 'asc' }
        });
        return servicos.map(this.toEntity);
    }

async findByDescription(descricao: string): Promise<Servico | null> {
    const servico = await this.prisma.servico.findFirst({
        where: {
            OR: [
                { descricao: { equals: descricao } },
                { descricao: { equals: descricao.toLowerCase() } },
                { descricao: { equals: descricao.toUpperCase() } }
            ]
        }
    });
    return servico ? this.toEntity(servico) : null;
}
async listarComPaginacao(params: {
    pagina: number;
    itensPorPagina: number;
    busca?: string;
}): Promise<{ servicos: Servico[]; total: number }> {
    const { pagina, itensPorPagina, busca } = params;
    
    // Corrigindo a busca case-insensitive
    const where = busca ? {
        OR: [
            {
                descricao: {
                    contains: busca
                }
            },
            {
                descricao: {
                    contains: busca.toLowerCase()
                }
            },
            {
                descricao: {
                    contains: busca.toUpperCase()
                }
            }
        ]
    } : {};

    const [servicos, total] = await Promise.all([
        this.prisma.servico.findMany({
            where,
            skip: (pagina - 1) * itensPorPagina,
            take: itensPorPagina,
            orderBy: { descricao: 'asc' }
        }),
        this.prisma.servico.count({ where })
    ]);

    return {
        servicos: servicos.map(this.toEntity),
        total
    };
}

    private toEntity(prismaServico: { id: string; valor: number; descricao: string }): Servico {
        return new Servico(
            prismaServico.valor,
            prismaServico.descricao,
            prismaServico.id
        );
    }
}