import type { Processo } from '../types'
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Trash2,
  Edit3,
  Cpu,
  User,
  Wrench,
  Users,
  ExternalLink,
  ClipboardX
} from 'lucide-react'
import { useState } from 'react'
import { api } from '../services/api'

interface Props {
  processos: Processo[]
  onUpdate: () => void
  onEdit: (processo: Processo) => void
  isRoot?: boolean
}

export function ProcessTree({ processos, onUpdate, onEdit, isRoot = false }: Props) {
  const [abertos, setAbertos] = useState<number[]>([])
  const [detalhesId, setDetalhesId] = useState<number | null>(null)

  const toggle = (id: number) => {
    setAbertos(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const handleDeletar = async (id: number) => {
    if (window.confirm("Atenção: Remover este processo excluirá todos os sub-processos vinculados. Deseja continuar?")) {
      try {
        await api.delete(`/processos/${id}`)
        onUpdate()
      } catch (error: any) {
        alert(error.response?.data?.message || "Erro ao remover processo.")
      }
    }
  }

  const formatarLink = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  }

  if (isRoot && (!processos || processos.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-2xl">
        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
          <ClipboardX size={20} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-400 font-medium italic">Nenhum processo cadastrado neste departamento</p>
      </div>
    )
  }

  if (!processos || processos.length === 0) return null;

  return (
    <div className="space-y-1">
      {processos.map(proc => {
        const temSubProcessos = proc.sub_processos && proc.sub_processos.length > 0;

        return (
          <div key={proc.id} className="relative">
            <div
              className={`flex items-center justify-between p-2.5 hover:bg-white hover:shadow-md rounded-xl cursor-pointer group transition-all duration-200 border border-transparent ${detalhesId === proc.id ? 'bg-white border-blue-100 shadow-sm' : ''}`}
              onClick={() => {
                toggle(proc.id)
                setDetalhesId(detalhesId === proc.id ? null : proc.id)
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 flex justify-center">
                  {temSubProcessos ? (
                    abertos.includes(proc.id) ?
                      <ChevronDown size={16} className="text-gray-400" /> :
                      <ChevronRight size={16} className="text-gray-400" />
                  ) : (
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  )}
                </div>

                <div className={`p-1.5 rounded-lg ${proc.tipo === 'sistemico' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                  {proc.tipo === 'sistemico' ? <Cpu size={16} strokeWidth={2.5} /> : <User size={16} strokeWidth={2.5} />}
                </div>

                <div className="flex flex-col">
                  <span className={`text-sm font-semibold ${detalhesId === proc.id ? 'text-blue-600' : 'text-gray-700'}`}>
                    {proc.nome}
                  </span>
                  {temSubProcessos && (
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      {proc.sub_processos?.length} Sub-processos
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(proc); }}
                  className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeletar(proc.id); }}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {detalhesId === proc.id && (
              <div className="ml-10 mt-2 mb-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="flex items-center gap-1 text-gray-400 uppercase font-extrabold tracking-widest text-[10px]">
                      <Wrench size={12} /> Ferramentas
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {proc.ferramentas && proc.ferramentas.length > 0 ?
                        proc.ferramentas.map((f, i) => (
                          <span key={i} className="bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">{f}</span>
                        )) : <span className="text-gray-300 italic">Nenhuma</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="flex items-center gap-1 text-gray-400 uppercase font-extrabold tracking-widest text-[10px]">
                      <Users size={12} /> Responsáveis
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {proc.responsaveis && proc.responsaveis.length > 0 ?
                        proc.responsaveis.map((r, i) => (
                          <span key={i} className="bg-blue-600 text-white px-2 py-1 rounded-md">{r}</span>
                        )) : <span className="text-gray-300 italic">Não definido</span>}
                    </div>
                  </div>
                </div>

                {proc.documentacao && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <a
                      href={formatarLink(proc.documentacao)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-100 text-[11px] text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={12} /> VER DOCUMENTAÇÃO
                    </a>
                  </div>
                )}
              </div>
            )}

            {abertos.includes(proc.id) && proc.sub_processos && (
              <div className="border-l-2 border-dashed border-gray-200 ml-5 pl-2 mt-1">
                <ProcessTree
                  processos={proc.sub_processos}
                  onUpdate={onUpdate}
                  onEdit={onEdit}
                  isRoot={false}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  )
}