'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useServicos } from '../../../../../hooks/useServicos';
import { FormField } from '../../../../../components/FormField';


export default function EditarServico() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();
  const { id } = useParams();
  const { atualizarServico, buscarServicoPorId } = useServicos();

  useEffect(() => {
    const carregar = async () => {
      try {
        const servico = await buscarServicoPorId(id as string);
        setDescricao(servico.descricao);
        setValor(servico.valor.toString());
      } catch (e) {
        setErro('Erro ao carregar serviço');
      }
    };
    carregar();
  }, [id]);

  const atualizar = async () => {
    try {
      if (!descricao || !valor) {
        setErro('Preencha todos os campos');
        return;
      }

      await atualizarServico(id as string, { descricao, valor: parseFloat(valor) });
      router.push('/');
    } catch (e) {
      setErro('Erro ao atualizar serviço');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <h1 className="text-2xl font-bold mb-6">Editar Serviço</h1>
      <FormField
        label="Descrição"
        name="descricao"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <FormField
        label="Valor (R$)"
        name="valor"
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
      <button
        onClick={atualizar}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
      >
        Atualizar
      </button>
    </div>
  );
}
