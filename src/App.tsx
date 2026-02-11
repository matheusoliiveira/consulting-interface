import { useEffect, useState } from 'react'
import { api } from './services/api'
import type { Area, Processo } from './types'
import { LayoutDashboard, Users, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { ProcessTree } from './components/ProcessTree'
import { ModalNovoProcesso } from './components/ModalNovoProcesso'
import { ModalNovaArea } from './components/ModalNovaArea'
import { DashboardStats } from './components/DashboardStats'
import toast, { Toaster } from 'react-hot-toast'

function App() {
  const [areas, setAreas] = useState<Area[]>([])
  const [areaSelecionada, setAreaSelecionada] = useState<number | null>(null)
  const [processos, setProcessos] = useState<Processo[]>([])
  const [todosOsProcessos, setTodosOsProcessos] = useState<Processo[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [modalAreaAberto, setModalAreaAberto] = useState(false)
  const [processoParaEditar, setProcessoParaEditar] = useState<Processo | null>(null)

  const [isDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const carregarAreas = () => {
    api.get('/areas').then(response => setAreas(response.data))
  }

  const carregarProcessos = () => {
    if (areaSelecionada) {
      api.get('/processos/arvore', { params: { areaId: areaSelecionada } }).then(response => {
        setProcessos(response.data)
      })
    }
  }

  const carregarDashboardGlobal = () => {
    api.get('/processos').then(response => setTodosOsProcessos(response.data))
  }

  const handleEditProcesso = (processo: Processo) => {
    setProcessoParaEditar(processo)
    setModalAberto(true)
  }

  const handleExcluirArea = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o departamento "${nome}"?`)) {
      try {
        await api.delete(`/areas/${id}`)
        toast.success(`Departamento "${nome}" removido!`)
        carregarAreas()
        carregarDashboardGlobal()
        if (areaSelecionada === id) setAreaSelecionada(null)
      } catch (error: any) {
        const msg = error.response?.data?.message || "Erro ao excluir departamento."
        toast.error(msg)
      }
    }
  }

  useEffect(() => {
    carregarAreas();
    carregarDashboardGlobal();
  }, [])

  useEffect(() => { carregarProcessos() }, [areaSelecionada])

  return (
    <div className="min-h-screen flex font-sans transition-colors duration-300 bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-slate-100">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: isDark ? { background: '#1e293b', color: '#fff', border: '1px solid #334155' } : { background: '#333', color: '#fff' },
        }}
      />

      {/* Sidebar */}
      <aside className="w-72 flex flex-col shadow-sm transition-colors duration-300 bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-slate-800">
        <div onClick={() => setAreaSelecionada(null)} className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold text-xl cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors group">
          <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
            <LayoutDashboard size={20} />
          </div>
          <span>StageFlow</span>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center justify-between px-3 mb-4 group/title">
            <h3 onClick={() => setAreaSelecionada(null)} className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1.5">
              Departamentos
            </h3>
            <button onClick={() => setModalAreaAberto(true)} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md transition-colors">
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>

          <div className="space-y-1">
            {areas.map(area => (
              <button key={area.id} onClick={() => setAreaSelecionada(area.id)} className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${areaSelecionada === area.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}>
                <div className="flex items-center gap-2">
                  <Users size={18} className={areaSelecionada === area.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} />
                  {area.nome}
                </div>
                {areaSelecionada === area.id && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </nav>


      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="relative h-16 flex items-center px-8 transition-colors duration-300 bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-slate-800">

          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
            {areaSelecionada
              ? `Processos / ${areas.find(a => a.id === areaSelecionada)?.nome}`
              : 'Visão Geral: Departamentos'}
          </h2>

          <button
            onClick={() => areaSelecionada ? setModalAberto(true) : setModalAreaAberto(true)}
            className="absolute left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95"
          >
            {areaSelecionada ? '+ Novo Processo' : '+ Novo Departamento'}
          </button>

        </header>


        <section className="p-8 overflow-y-auto h-full transition-colors duration-300 bg-gray-50 dark:bg-[#0f172a]">
          {!areaSelecionada ? (
            <div className="max-w-6xl mx-auto">
              <DashboardStats areas={areas} processosGerais={todosOsProcessos} />

              <div className="flex items-center gap-2 mb-6 text-gray-400 dark:text-slate-500">
                <Users size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Navegação por Área</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areas.map(area => (
                  <div key={area.id} onClick={() => setAreaSelecionada(area.id)} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={(e) => { e.stopPropagation(); handleExcluirArea(area.id, area.nome); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Users size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg">{area.nome}</h3>
                    <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Clique para ver os processos</p>
                  </div>
                ))}
                <button onClick={() => setModalAreaAberto(true)} className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all">
                  <Plus size={24} className="mb-2" />
                  <span className="text-sm font-semibold">Novo Departamento</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
              <ProcessTree
                processos={processos}
                onUpdate={() => { carregarProcessos(); carregarDashboardGlobal(); }}
                onEdit={handleEditProcesso}
                isRoot={true}
              />
            </div>
          )}
        </section>
      </main>

      {/* Modais */}
      {modalAberto && areaSelecionada && (
        <ModalNovoProcesso areaId={areaSelecionada} processoParaEditar={processoParaEditar} onClose={() => { setModalAberto(false); setProcessoParaEditar(null); }} onSuccess={() => { carregarProcessos(); carregarDashboardGlobal(); }} />
      )}
      {modalAreaAberto && <ModalNovaArea onClose={() => setModalAreaAberto(false)} onSuccess={carregarAreas} />}
    </div>
  )
}

export default App