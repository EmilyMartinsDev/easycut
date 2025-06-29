'use client';
import Link from 'next/link';
import { useServicos } from '../../hooks/useServicos';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { SearchInput } from '../../components/SearchInput';
import { Pagination } from '../../components/Pagination';
import { GenericTable } from '../../components/GenericTable';
import { TableRow } from '../../components/TableRow';
import { TableCell } from '../../components/TableCell';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export default function Home() {
  const {
    servicos,
    carregando,
    erro,
    paginacao,
    termoBusca,
    setTermoBusca,
    mudarPagina,
    mudarItensPorPagina,
    recarregar,
    deletarServico
  } = useServicos();

  const [debouncedBusca] = useDebounce(termoBusca, 500);
  const totalPaginas = Math.ceil(paginacao.totalItens / paginacao.itensPorPagina);

  const [confirmDialog, setConfirmDialog] = useState<{ id: string; descricao: string } | null>(null);

  useEffect(() => {
    recarregar();
  }, [debouncedBusca]);

  const handleDelete = async (id: string) => {
    await deletarServico(id);
    setConfirmDialog(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gerenciamento de Serviços</h1>
              <p className="text-gray-600 mt-1">Gerencie todos os serviços oferecidos</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <SearchInput
                value={termoBusca}
                onChange={setTermoBusca}
                placeholder="Buscar serviços..."
                className="min-w-[250px]"
              />

              <Link
                href="/servico/novo"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                <FiPlus className="text-lg" />
                <span>Novo Serviço</span>
              </Link>
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <p>{erro}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {carregando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {servicos?.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {termoBusca ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {termoBusca ? 'Tente ajustar sua busca' : 'Comece cadastrando seu primeiro serviço'}
                  </p>
                  {!termoBusca && (
                    <div className="mt-6">
                      <Link
                        href="/servico/novo"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                        Cadastrar Serviço
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <GenericTable headers={['Serviço', 'Valor', 'Ações']}>
                    {servicos.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">{s.descricao.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{s.descricao}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900 font-medium">
                            {s.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Link
                            href={`/servico/editar/${s.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FiEdit2 className="-ml-0.5 mr-1.5 h-4 w-4" />
                            Editar
                          </Link>
                          <button
                            onClick={() => setConfirmDialog({ id: s.id, descricao: s.descricao })}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
                          >
                            <FiTrash2 className="-ml-0.5 mr-1.5 h-4 w-4" />
                            Deletar
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </GenericTable>

                  <Pagination
                    currentPage={paginacao.pagina}
                    totalPages={totalPaginas}
                    itemsPerPage={paginacao.itensPorPagina}
                    totalItems={paginacao.totalItens}
                    onPageChange={mudarPagina}
                    onItemsPerPageChange={mudarItensPorPagina}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {confirmDialog && (
        <ConfirmDialog
          title="Confirmar exclusão"
          message={`Tem certeza que deseja excluir o serviço "${confirmDialog.descricao}"?`}
          onConfirm={() => handleDelete(confirmDialog.id)}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
