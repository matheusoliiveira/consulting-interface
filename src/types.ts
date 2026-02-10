export interface Area {
  id: number;
  nome: string;
  descricao: string;
}

export interface Processo {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'manual' | 'sistemico';
  ferramentas?: string[];
  responsaveis?: string[];
  area: Area;
  sub_processos?: Processo[];
}