import { useState } from 'react'
import { api } from '../services/api'
import { X, Users } from 'lucide-react'

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
      onSuccess()
      onClose()
    } catch (error) {
      alert("Erro ao cadastrar departamento")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Novo Departamento</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Departamento</label>
            <input
              required
              className="w-full border rounded-lg p-2"
              placeholder="Ex: Recursos Humanos"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Cadastrar Departamento
          </button>
        </form>
      </div>
    </div>
  )
}