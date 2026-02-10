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
    <div className="flex flex-col gap-6 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Departamentos</p>
            <p className="text-2xl font-bold text-gray-900">{areas.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Processos Mapeados</p>
            <p className="text-2xl font-bold text-gray-900">{processosGerais.length}</p>
          </div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg flex items-center gap-4 text-white">
          <div className="bg-white/20 p-3 rounded-xl">
            <Cpu size={24} />
          </div>
          <div>
            <p className="text-sm text-white/80 font-medium">Nível de Automação</p>
            <p className="text-2xl font-bold">{nivelAutomacao}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm h-80 flex flex-col items-center">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Natureza dos Processos</h3>
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}