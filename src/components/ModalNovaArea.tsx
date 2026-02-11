import { useState } from 'react'
import { api } from '../services/api'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export function ModalNovaArea({ onClose, onSuccess }: Props) {
  const [nome, setNome] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/areas', { nome })

      toast.success(`Departamento "${nome}" cadastrado!`)

      onSuccess()
      onClose()
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao cadastrar departamento"
      toast.error(msg)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-8 w-full max-w-md shadow-2xl border border-transparent dark:border-slate-800 animate-in fade-in zoom-in duration-200">

        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
            Novo Departamento
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Nome do Departamento
            </label>
            <input
              required
              autoFocus
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-slate-100 placeholder:text-gray-300 dark:placeholder:text-slate-700 transition-all"
              placeholder="Ex: Recursos Humanos"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            Cadastrar Departamento
          </button>
        </form>
      </div>
    </div>
  )
}