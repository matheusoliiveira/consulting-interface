import type { Processo } from '../types'
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit3,
  Cpu,
  User,
  Wrench,
  Users,
  ExternalLink,
  ClipboardX,
  Layers
} from 'lucide-react'
import { useState } from 'react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

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
        toast.success("Processo removido com sucesso!")
        onUpdate()
      } catch (error: any) {
        const mensagemErro = error.response?.data?.message || "Erro ao remover processo."
        toast.error(mensagemErro)
      }
    }
  }

  const formatarLink = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  }

  if (isRoot && (!processos || processos.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50/50 dark:bg-slate-900/50 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl transition-colors">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3">
          <ClipboardX size={20} className="text-gray-400 dark:text-slate-500" />
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500 font-medium italic">Nenhum processo cadastrado neste departamento</p>
      </div>
    )
  }

  if (!processos || processos.length === 0) return null;

  return (
    <div className="space-y-1">
      {processos.map(proc => {
        const temSubProcessos = proc.sub_processos && proc.sub_processos.length > 0;
        const renderIcon = () => {
          if (temSubProcessos) return <Layers size={16} strokeWidth={2.5} />;
          if (proc.tipo === 'sistemico') return <Cpu size={16} strokeWidth={2.5} />;
          return <User size={16} strokeWidth={2.5} />;
        };

        return (
          <div key={proc.id} className="relative">
            <div
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer group transition-all duration-200 border border-transparent 
                ${detalhesId === proc.id
                  ? 'bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900 shadow-sm'
                  : 'hover:bg-white dark:hover:bg-slate-800/50 hover:shadow-md'
                }`}
              onClick={() => {
                toggle(proc.id)
                setDetalhesId(detalhesId === proc.id ? null : proc.id)
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 flex justify-center">
                  {temSubProcessos ? (
                    abertos.includes(proc.id) ?
                      <ChevronDown size={16} className="text-gray-400 dark:text-slate-500" /> :
                      <ChevronRight size={16} className="text-gray-400 dark:text-slate-500" />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full" />
                  )}
                </div>

                <div className={`p-1.5 rounded-lg transition-colors ${temSubProcessos ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                  proc.tipo === 'sistemico' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}>
                  {renderIcon()}
                </div>

                <div className="flex flex-col">
                  <span className={`text-sm font-semibold transition-colors ${detalhesId === proc.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-200'}`}>
                    {proc.nome}
                  </span>
                  {temSubProcessos && (
                    <span className="text-[10px] text-indigo-400 dark:text-indigo-500 uppercase font-bold tracking-tight">
                      {proc.sub_processos?.length} Sub-processos
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(proc); }}
                  className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeletar(proc.id); }}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-500 dark:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {detalhesId === proc.id && (
              <div className="ml-10 mt-2 mb-4 p-5 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-2xl animate-in slide-in-from-top-2 duration-200 transition-colors">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3">
                    <span className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500 uppercase font-black tracking-widest text-[9px]">
                      <Wrench size={12} className="text-blue-500/70" /> Ferramentas
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proc.ferramentas && proc.ferramentas.length > 0 ?
                        proc.ferramentas.map((f, i) => (
                          <span key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 py-1 rounded-md text-gray-600 dark:text-slate-300 shadow-sm">{f}</span>
                        )) : <span className="text-gray-300 dark:text-slate-700 italic">Nenhuma informada</span>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500 uppercase font-black tracking-widest text-[9px]">
                      <Users size={12} className="text-indigo-500/70" /> Responsáveis
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proc.responsaveis && proc.responsaveis.length > 0 ?
                        proc.responsaveis.map((r, i) => (
                          <span key={i} className="bg-indigo-600 dark:bg-indigo-500 text-white px-2.5 py-1 rounded-md shadow-sm font-medium">{r}</span>
                        )) : <span className="text-gray-300 dark:text-slate-700 italic">Não definidos</span>}
                    </div>
                  </div>
                </div>

                {(proc as any).documentacao && (
                  <div className="mt-5 pt-4 border-t border-gray-200 dark:border-slate-800">
                    <a
                      href={formatarLink((proc as any).documentacao)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-blue-100 dark:border-slate-700 text-[10px] text-blue-600 dark:text-blue-400 font-black tracking-wider hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all shadow-sm active:scale-95"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={12} /> VER DOCUMENTAÇÃO
                    </a>
                  </div>
                )}
              </div>
            )}

            {abertos.includes(proc.id) && proc.sub_processos && (
              <div className="border-l-2 border-dashed border-gray-200 dark:border-slate-800 ml-5 pl-2 mt-1">
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