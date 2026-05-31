<template>
    <div class="header-pages">
        <header class="app-header">
            <div class="logo">{{ title }}</div>
            <br/>
            <div class="header-sub">Semana 12</div>
        </header>
        <div class="week-pills-container">
            <WeekPills :treino-semana="treinoSemana" @update:selectedDay="selectoutroTreino($event)"/>
        </div>
    </div>
    <!-- DETAIL OVERLAY -->
    <div class="content-wrapper">
        <transition name="fade">
            <div v-if="activeWorkout" class="detail-overlay" @click.self="activeWorkout = null">
            <div class="detail-sheet">

                <!-- HERO -->
                <div class="detail-hero">
                    <div>
                        <div class="detail-label">{{ activeWorkout.category }} · {{ diaSemana }}</div>
                        <div class="detail-name">{{ activeWorkout.name }}</div>
                        <div class="muscle-chips">
                        <span v-for="m in activeWorkout.muscles" :key="m" class="muscle-chip">{{ m }}</span>
                        </div>
                        
                    </div>
                </div>

                <!-- STATS -->
                <div class="detail-stats">
                    <div class="stat-block">
                        <div class="stat-val">{{ activeWorkout.duration }}</div>
                        <div class="stat-key">minutos</div>
                    </div>
                    <div class="stat-block">
                        <div class="stat-val">{{ activeWorkout.exercises.length }}</div>
                        <div class="stat-key">exerc.</div>
                    </div>
                    <div class="stat-block center">
                        <Temporizador titulo="Treino" :status="statusTreino"/>
                    </div>
                </div>

                <!-- EXERCISES -->
                <div class="exercises-section">
                    <div class="exercises-title">Exercícios</div>
                        <div
                            v-for="(ex, idx) in activeWorkout.exercises"
                            :key="ex.id"
                            class="exercise-item"
                        >
                            <div>
                                <div class="ex-number" :style="{ background: activeWorkout.color + '22', color: activeWorkout.color }">
                                    {{ idx + 1 }}
                                </div>
                                <div class="ex-info col-md-9">
                                    <div class="ex-name">{{ ex.name }}</div>
                                    <div class="ex-desc">{{ ex.desc }}</div>
                                    <div class="ex-sets">
                                        <span class="set-badge highlight">
                                            {{ ex.sets }}x{{ ex.reps }}
                                        </span>
                                        <span  class="set-badge">
                                            ⏱ {{ ex.rest ? ex.rest : 60 }}s descanso
                                        </span>
                                        <q-btn class="set-badge" @click="cadastrarPeso(ex)">
                                            🏋️ {{ ex.weight ? ex.weight : 'N/A' }}
                                        </q-btn>
                                    </div>
                                </div>
                                <div class="col-md-3" v-if="inicioTreino">
                                    <div><Temporizador titulo="Exercício" :status="statusExercicio" :tempoAlvo="ex.rest"/></div>
                                    <div>
                                        <button v-if="!inicioTreino" class="btn-prd btn-success" @click="finalizarExercicio()">
                                        finalizar exercicio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- CTA -->
                    <button v-if="!inicioTreino" class="start-btn green" @click="iniciarTreino()">
                    ▶ Iniciar Treino
                    </button>
                    <div class="cta-group">
                        <button v-if="inicioTreino && !pausaTreino" class="start-btn orange" @click="pausarTreino()">
                        || Pausar Treino
                        </button>
                        <button v-if="inicioTreino && pausaTreino" class="start-btn orange" @click="retomarTreino()">
                        || Retomar Treino
                        </button>
                        <button v-if="inicioTreino" class="start-btn red" @click="finalizarTreino()">
                        || Finalizar Treino
                        </button>
                    </div>

                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import WeekPills from '../utils/WeekPils.vue';
import type { DiasTreino } from '../../types/DiasTreino.js';
import type { Treino } from '../../types/Treino.js';
import type { Exercicios } from '../../types/Exercicios.js';
import Temporizador from '../utils/TimerTemporizador.vue';
import TreinoService from '../../services/TreinoService.js';

const $q = useQuasar();
const title = ref('Visualizar Treino');
const diaSemana = ref('');
const inicioTreino = ref(false);
const pausaTreino = ref(false);
const statusTreino = ref<'idle' | 'running' | 'paused' | 'finished'>('idle');
const statusExercicio = ref<'idle' | 'running' | 'paused' | 'finished'>('idle');
const activeWorkout = ref<Treino | null>(null);
const treinoSemana = ref<DiasTreino[]>([]);

onMounted(() => {
  buscarTreino();
});

function buscarTreino() {
  console.log('Buscando treino...');
  TreinoService.getTodayWorkout()
    .then(response => {
      console.log('Treino recebido:', response.data);
      activeWorkout.value = response.data.data?.treino ?? null;
    })
    .catch(error => {
      console.error('Erro ao buscar treino:', error);
      $q.dialog({
        title: 'Erro',
        message: 'Não foi possível carregar o treino. Tente novamente mais tarde.',
        ok: 'Fechar'
      });
    });
}

function selectoutroTreino(day: DiasTreino) {
  
  TreinoService.getWorkoutByDay(day.abbr.toLowerCase())
    .then(response => {
      console.log('Treino do dia selecionado:', response.data);
      activeWorkout.value = response.data.data?.treino ?? null;
      diaSemana.value = day.abbr;
    })
    .catch(error => {
      console.error('Erro ao buscar treino do dia:', error);
      $q.dialog({
        title: 'Erro',
        message: 'Não foi possível carregar o treino do dia selecionado. Tente novamente mais tarde.',
        ok: 'Fechar'
      });
    });
}

function iniciarTreino() {
  inicioTreino.value = true;
  statusTreino.value = 'running';
}

function pausarTreino() {
  pausaTreino.value = true;
  statusTreino.value = 'paused';
}

function retomarTreino() {
  pausaTreino.value = false;
  statusTreino.value = 'running';
}

function finalizarTreino() {
  inicioTreino.value = false;
  pausaTreino.value = false;
  statusTreino.value = 'finished';
}


function finalizarExercicio() {
  console.log('Exercício finalizado');
}

function cadastrarPeso(exercicio: Exercicios) {
  $q.dialog({
    title: 'Cadastrar Peso',
    message: 'Digite o peso utilizado:',
    prompt: {
      model: exercicio.weight || '',
      type: 'number'
    },
    cancel: true,
    persistent: true
  }).onOk((valor: string) => {
    if (!valor) {
      console.log(`Peso não informado para o exercício ${exercicio.name}`);
      return;
    }
    exercicio.weight = valor + 'kg';
  });
}
</script>
<style scoped>
.detail-timer {
    float: right;
}

.content-wrapper {
    width: 100%;
    margin-top: 120px;
    z-index: 50;
    pointer-events: none;
    margin-bottom: 120px;
}

.content-wrapper :deep(.detail-overlay) {
    width: 100%;
    margin-top: 30px;
    background: rgba(0,0,0,0.55);
    display: flex;
    align-items: flex-end;
    pointer-events: auto;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
