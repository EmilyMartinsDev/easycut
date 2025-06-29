// hooks/useServicos.ts
import { useState, useEffect } from 'react';
import { servicoService } from '../services/servico.service';


interface Servico {
  id: string;
  descricao: string;
  valor: number;
}

interface Paginacao {
  pagina: number;
  itensPorPagina: number;
  totalItens: number;
}

export function useServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [paginacao, setPaginacao] = useState<Paginacao>({
    pagina: 1,
    itensPorPagina: 10,
    totalItens: 0
  });
  const [termoBusca, setTermoBusca] = useState('');



  const carregarServicos = async () => {
    try {
      setCarregando(true);
      const resultado = await servicoService.listar({
        pagina: paginacao.pagina,
        itensPorPagina: paginacao.itensPorPagina,
        busca: termoBusca
      });
      
      setServicos(resultado.servicos);
      setPaginacao(prev => ({
        ...prev,
        totalItens: resultado.total
      }));
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar serviços');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, [paginacao.pagina, paginacao.itensPorPagina, termoBusca]);

  const mudarPagina = (novaPagina: number) => {
    setPaginacao(prev => ({
      ...prev,
      pagina: novaPagina
    }));
  };

  const mudarItensPorPagina = (novoValor: number) => {
    setPaginacao(prev => ({
      ...prev,
      itensPorPagina: novoValor,
      pagina: 1 // Reset para a primeira página
    }));
  };

  const criarServico = async (dados: Omit<Servico, 'id'>) => {
    const novo = await servicoService.criar(dados);
    await carregarServicos();
    return novo;
  };

  const atualizarServico = async (id: string, dados: Omit<Servico, 'id'>) => {
    const atualizado = await servicoService.atualizar(id, dados);
    await carregarServicos();
    return atualizado;
  };
  const buscarServicoPorId = async (id: string) => {
    return await servicoService.buscarPorId(id);
  };

  const deletarServico = async (id: string) => {
    await servicoService.deletar(id);
    await carregarServicos();
  };
  return {
    servicos,
    carregando,
    erro,
    paginacao,
    buscarServicoPorId,
    termoBusca,
    setTermoBusca,
    mudarPagina,
    criarServico,
    atualizarServico,
    mudarItensPorPagina,
    deletarServico,
    recarregar: carregarServicos
  };
}