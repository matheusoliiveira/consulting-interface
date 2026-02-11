import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { X, Wrench, Users, FileText } from 'lucide-react'
import type { Processo } from '../types'
import toast from 'react-hot-toast'

interface Props {
  areaId: number
  processoParaEditar?: Processo | null
  onClose: () => void
  onSuccess: () => void
}

export function ModalNovoProcesso({ areaId, processoParaEditar, onClose, onSuccess }: Props) {
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'manual' | 'sistemico'>('manual')
  const [paiId, setPaiId] = useState<string>('')
  const [ferramentas, setFerramentas] = useState('')
  const [responsaveis, setResponsaveis] = useState('')
  const [documentacao, setDocumentacao] = useState('')
  const [processosExistentes, setProcessosExistentes] = useState<Processo[]>([])

  useEffect(() => {
    if (processoParaEditar) {
      setNome(processoParaEditar.nome)
      setTipo(processoParaEditar.tipo)
      setPaiId(processoParaEditar.pai?.id?.toString() || '')
      setFerramentas(processoParaEditar.ferramentas?.join(', ') || '')
      setResponsaveis(processoParaEditar.responsaveis?.join(', ') || '')
      setDocumentacao(processoParaEditar.documentacao || '')
    }
  }, [processoParaEditar])

  useEffect(() => {
    setProcessosExistentes([])
    api.get('/processos', { params: { areaId } })
      .then(res => {
        const filtradosPorArea = res.data.filter((p: any) => {
          const idDaAreaNoProcesso = p.area?.id || p.areaId;
          return Number(idDaAreaNoProcesso) === Number(areaId);
        });
        setProcessosExistentes(filtradosPorArea);
      })
      .catch(err => {
        console.error("Erro ao carregar processos da área:", err);
      });
  }, [areaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dados = {
      nome,
      tipo,
      areaId: Number(areaId),
      paiId: paiId === "" ? null : Number(paiId),
      ferramentas: ferramentas.split(',').map(i => i.trim()).filter(i => i !== ''),
      responsaveis: responsaveis.split(',').map(i => i.trim()).filter(i => i !== ''),
      documentacao
    }

    try {
      if (processoParaEditar) {
        await api.put(`/processos/${processoParaEditar.id}`, dados)
        toast.success("Processo atualizado!")
      } else {
        await api.post('/processos', dados)
        toast.success("Processo criado com sucesso!")
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao salvar processo"
      toast.error(msg)
    }
  }

  const inputClass = "w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-slate-100 placeholder:text-gray-300 dark:placeholder:text-slate-700 transition-all text-sm";
  const labelClass = "block text-xs font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-transparent dark:border-slate-800 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">

        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
            {processoParaEditar ? 'Editar Processo' : 'Cadastrar Processo'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className={labelClass}>Nome do Processo</label>
              <input
                required
                className={inputClass}
                placeholder="Ex: Triagem de Currículos"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Tipo</label>
              <select
                className={inputClass}
                value={tipo}
                onChange={e => setTipo(e.target.value as any)}
              >
                <option value="manual">Manual</option>
                <option value="sistemico">Sistêmico</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Pai (Hierarquia)</label>
              <select
                className={inputClass}
                value={paiId}
                onChange={e => setPaiId(e.target.value)}
              >
                <option value="">Nenhum (Nível Raiz)</option>
                {processosExistentes
                  .filter(p => p.id !== processoParaEditar?.id)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))
                }
              </select>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 italic">* Apenas processos deste departamento</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-slate-800 w-full" />

          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                <Wrench size={14} className="text-blue-500" /> Ferramentas
              </label>
              <input
                className={inputClass}
                placeholder="Ex: Trello, Excel (separados por vírgula)"
                value={ferramentas}
                onChange={e => setFerramentas(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Users size={14} className="text-indigo-500" /> Responsáveis
              </label>
              <input
                className={inputClass}
                placeholder="Ex: João, Marketing (separados por vírgula)"
                value={responsaveis}
                onChange={e => setResponsaveis(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>
                <FileText size={14} className="text-amber-500" /> Link Documentação
              </label>
              <input
                className={inputClass}
                placeholder="https://..."
                value={documentacao}
                onChange={e => setDocumentacao(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all mt-4"
          >
            {processoParaEditar ? 'Salvar Alterações' : 'Criar Processo'}
          </button>
        </form>
      </div>
    </div>
  )
}