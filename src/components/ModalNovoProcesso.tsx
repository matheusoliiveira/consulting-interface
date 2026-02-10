import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { X, Wrench, Users, FileText } from 'lucide-react'
import type { Processo } from '../types'

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
    api.get('/processos', { params: { areaId } }).then(res => setProcessosExistentes(res.data))
  }, [areaId])

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
      } else {
        await api.post('/processos', dados)
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Erro na API:", error.response?.data || error.message)
      alert(error.response?.data?.message || "Erro ao salvar processo")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {processoParaEditar ? 'Editar Processo' : 'Cadastrar Processo'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={tipo}
                onChange={e => setTipo(e.target.value as any)}
              >
                <option value="manual">Manual</option>
                <option value="sistemico">Sistêmico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pai (Hierarquia)</label>
              <select
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={paiId}
                onChange={e => setPaiId(e.target.value)}
              >
                <option value="">Nenhum (Nível Raiz)</option>
                {processosExistentes
                  .filter(p => p.id !== processoParaEditar?.id)
                  .map(p => <option key={p.id} value={p.id}>{p.nome}</option>)
                }
              </select>
            </div>
          </div>

          <hr className="my-4" />

          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <Wrench size={14} /> Ferramentas
              </label>
              <input
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Ex: Trello, Excel"
                value={ferramentas}
                onChange={e => setFerramentas(e.target.value)}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <Users size={14} /> Responsáveis
              </label>
              <input
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Ex: João, TI"
                value={responsaveis}
                onChange={e => setResponsaveis(e.target.value)}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <FileText size={14} /> Link Documentação
              </label>
              <input
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="https://..."
                value={documentacao}
                onChange={e => setDocumentacao(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all mt-4"
          >
            {processoParaEditar ? 'Salvar Alterações' : 'Criar Processo'}
          </button>
        </form>
      </div>
    </div>
  )
}