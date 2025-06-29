import axios from 'axios';
import { Servico } from '../types/Servico';


const api = axios.create({
  baseURL: 'http://localhost:3333',
});
interface ListarServicosParams {
  pagina: number;
  itensPorPagina: number;
  busca?: string;
}

interface ListarServicosResult {
  servicos: Servico[];
  total: number;
}

export const servicoService = {
  listar: async(params: ListarServicosParams): Promise<ListarServicosResult> =>{

    const response = await api.get(`/servico?${new URLSearchParams({
      pagina: params.pagina.toString(),
      itensPorPagina: params.itensPorPagina.toString(),
      ...(params.busca && { busca: params.busca })
    })}`);

    if (!response.data) {
      throw new Error('Erro ao buscar serviços');
    }

    return response.data
  },
  criar: async (dados: Omit<Servico, 'id'>): Promise<Servico> => {
    const res = await api.post('/servico', dados);
    return res.data;
  },
  buscarPorId: async (id: string): Promise<Servico> => {
    const res = await api.get(`/servico/${id}`);
    return res.data;
  },
  atualizar: async (id: string, dados: Omit<Servico, 'id'>): Promise<Servico> => {
    const res = await api.put(`/servico/${id}`, dados);
    return res.data;
  },
  deletar : async (id: string): Promise<void> =>{
    await api.delete(`/servico/${id}`);
  }

};
