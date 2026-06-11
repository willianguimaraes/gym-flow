import type { ExercicioCatalogo } from './ExercicioCatalogo';

export interface TreinoExercicio {
  id?:          number | null;
  treinoId?:    number | null;
  exercicioId: number;
  exercicio?:  ExercicioCatalogo;
  ordem:       number;
  sets:        number;
  reps:        number;
  rest:        number;
  weight:      number;
  finalizado?: boolean;
  observacao?: string;
}

export interface Treino {
  id?:          number | null;
  usuarioId:    number;
  name:         string;
  category:     string;
  color:        string;
  duration:     number;
  kcal:         number;
  difficulty:   number;
  description?: string;
  muscles:      string[];
  exercises:    TreinoExercicio[];
  createdAt?:   string;
}

export interface PlanoTreinoDia {
  id?:       number | null;
  planoId?:  number | null;
  abbr:      string;
  num:       number;
  diaSemana: number;
  isRest:    boolean;
  treinoId?: number | null;
  treino?:   Treino | null;
}

export interface PlanoTreino {
  id?:        number | null;
  usuarioId:  number;
  nome:       string;
  descricao?: string;
  inicioEm:   string;
  fimEm?:     string | null;
  ativo:      boolean;
  dias:       PlanoTreinoDia[];
  createdAt?: string;
}

export interface TreinoDoDia {
  plano: PlanoTreino;
  dia:   PlanoTreinoDia | null;
}