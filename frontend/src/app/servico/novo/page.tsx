'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServicos } from '../../../../hooks/useServicos';
import { FormField } from '../../../../components/FormField';


export default function NovoServico() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();
  const { criarServico } = useServicos();

  const salvar = async () => {
    try {
      if (!descricao || !valor) {
        setErro('Preencha todos os campos');
        return;
      }

      await criarServico({ descricao, valor: parseFloat(valor) });
      router.push('/');
    } catch (e) {
      setErro('Erro ao criar serviço');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <h1 className="text-2xl font-bold mb-6">Novo Serviço</h1>
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
        onClick={salvar}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
      >
        Salvar
      </button>
    </div>
  );
}