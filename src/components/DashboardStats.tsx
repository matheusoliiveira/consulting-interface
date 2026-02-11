import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Activity, Cpu } from 'lucide-react';
import type { Area, Processo } from '../types';

interface DashboardProps {
  areas: Area[];
  processosGerais: Processo[];
}

export function DashboardStats({ areas, processosGerais }: DashboardProps) {
  const manuais = processosGerais.filter(p => p.tipo === 'manual').length;
  const sistemicos = processosGerais.filter(p => p.tipo === 'sistemico').length;


  const data = [
    { name: 'Manuais', value: manuais, color: '#F59E0B' },
    { name: 'Sistêmicos', value: sistemicos, color: '#3B82F6' },
  ];

  const nivelAutomacao = processosGerais.length > 0
    ? ((sistemicos / processosGerais.length) * 100).toFixed(0)
    : "0";

  return (
    <div className="flex flex-col gap-6 mb-10 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card: Departamentos */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-gray-200 dark:border-[#1e293b] shadow-soft dark:shadow-dark-soft flex items-center gap-4 transition-all hover:scale-[1.02]">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Departamentos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{areas.length}</p>
          </div>
        </div>

        {/* Card: Processos Mapeados */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-gray-200 dark:border-[#1e293b] shadow-soft dark:shadow-dark-soft flex items-center gap-4 transition-all hover:scale-[1.02]">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl text-amber-600 dark:text-amber-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Processos Mapeados</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{processosGerais.length}</p>
          </div>
        </div>

        {/* Card: Nível de Automação (Destaque) */}
        <div className="bg-brand-primary dark:bg-indigo-600 p-6 rounded-2xl shadow-lg dark:shadow-indigo-900/20 flex items-center gap-4 text-white transition-all hover:scale-[1.02] relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Cpu size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-white/80 font-medium">Nível de Automação</p>
            <p className="text-2xl font-bold">{nivelAutomacao}%</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Pizza */}
      <div className="bg-white dark:bg-[#0f172a] p-8 rounded-2xl border border-gray-200 dark:border-[#1e293b] shadow-soft dark:shadow-dark-soft h-80 flex flex-col items-center transition-colors duration-300">
        <h3 className="text-xs font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">
          Natureza dos Processos
        </h3>
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={10}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '16px',
                  border: '1px solid #1e293b',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                  color: '#f8fafc'
                }}
                itemStyle={{ color: '#f8fafc' }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider ml-2">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}