<template>
    <div class="header-pages">
        <header class="app-header">
            <div class="logo">{{ title }}</div>
            <br />
            <div class="header-sub">Semana 1</div>
        </header>
        <div class="week-pills-container">
            <WeekPills :treino-semana="treinoSemana" @update:selectedDay="selectoutroTreino($event)" />
        </div>
    </div>
    <!-- DETAIL OVERLAY -->
    <div class="content-wrapper">
        <transition name="fade">
            <div v-if="activeWorkout" class="detail-overlay" @click.self="activeWorkout = null"
                style="margin-top: 30px;">
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
                            <Temporizador titulo="Treino" :status="statusTreino" />
                        </div>
                    </div>

                    <!-- EXERCISES -->
                    <div class="exercises-section">
                        <div class="section-top">
                            <div class="exercises-title"> Exercícios </div>
                            <div class="exercise-progress"> {{ exerciciosConcluidos.length }}/{{
                                activeWorkout.exercises.length }} </div>
                        </div>
                        <div v-for="(ex, idx) in activeWorkout.exercises" :key="ex.id" class="exercise-card"
                            :class="{ active: exercicioAtual === idx, completed: exerciciosConcluidos.includes(idx) }">

                            <!-- HEADER -->
                            <div class="exercise-header" @click="toggleExercicio(idx)">
                                <div class="exercise-left">
                                    <div class="exercise-index"
                                        :style="{ background: exercicioAtual === idx ? activeWorkout.color : exerciciosConcluidos.includes(idx) ? '#4CAF50' : '#ECECEC', color: inicioTreino && exercicioAtual === idx ? '#fff' : '#666' }">
                                        <span v-if="exerciciosConcluidos.includes(idx)">✓</span>
                                        <span v-else>{{ idx + 1 }}</span>
                                    </div>
                                    <div class="exercise-main-info">
                                        <div class="exercise-name"> {{ ex.exercicio?.name }} </div>
                                        <div class="exercise-meta">
                                            {{ ex.sets }}x{{ ex.reps }} • {{ ex.weight || 'Sem carga' }}
                                        </div>
                                    </div>
                                </div>
                                <div class="exercise-status"
                                    v-if="inicioTreino && exercicioAtual === idx && !exerciciosConcluidos.includes(idx)">
                                    EM ANDAMENTO
                                </div>
                                <div class="exercise-status completed-text"
                                    v-if="inicioTreino && exerciciosConcluidos.includes(idx)"> CONCLUÍDO </div>
                            </div> <!-- BODY SOMENTE EXERCÍCIO ATIVO -->
                            <transition name="fade">
                                <div v-if="exercicioAtual === idx" class="exercise-body">
                                    <div class="exercise-description"> {{ ex.exercicio?.desc }} </div>
                                    <div class="exercise-tags">
                                        <div class="exercise-tag"> ⏱ {{ ex.rest || 60 }}s descanso </div>
                                        <q-btn :disabled="!inicioTreino" flat class="exercise-tag"
                                            @click="cadastrarPeso(ex)"> 🏋️ {{ ex.weight ||
                                                'Adicionar carga' }} </q-btn>
                                    </div>
                                    <div class="exercise-timer" v-if="inicioTreino">
                                        <Temporizador titulo="Exercício" :status="statusExercicio"
                                            :tempoAlvo="ex.rest" />
                                    </div>
                                    <div class="exercise-actions" v-if="inicioTreino">
                                        <button class="exercise-btn finish" @click="finalizarExercicio(idx)"> ✓
                                            Finalizar
                                        </button>
                                    </div>
                                </div>
                            </transition>
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
            <div v-else>
                <div class="no-workout">
                    <div class="no-workout-emoji">😴</div>
                    <div class="no-workout-text">Nenhum treino agendado para hoje.</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import WeekPills from '../utils/WeekPils.vue';
import type { PlanoTreinoDia, Treino, TreinoExercicio } from '../../types/Exercicios.js';
import Temporizador from '../utils/TimerTemporizador.vue';
import PlanosService from 'src/services/PlanosService.js';
import { useNotify } from 'src/utils/NotificacaoUtils';

const notify = useNotify();
const $q = useQuasar();
const title = ref('Visualizar Treino');
const diaSemana = ref('');
const inicioTreino = ref(false);
const pausaTreino = ref(false);
const statusTreino = ref<'idle' | 'running' | 'paused' | 'finished'>('idle');
const statusExercicio = ref<'idle' | 'running' | 'paused' | 'finished'>('idle');
const activeWorkout = ref<Treino | null>(null);
const treinoSemana = ref<PlanoTreinoDia[]>([]);
const exercicioAtual = ref<number | null>(0);
const exerciciosConcluidos = ref<number[]>([]);

onMounted(() => {
    buscarTreino();
});

function buscarTreino() {
    console.log('Buscando treino...');
    PlanosService.getPlanoHoje()
        .then(response => {
            console.log('Plano do dia recebido:', response.data.data?.dia?.treino);
            activeWorkout.value = response.data.data?.dia?.treino ?? null;
        })
        .catch(error => {
            console.error('Erro ao buscar plano do dia:', error);
            notify.error('Não foi possível carregar o treino do dia selecionado.');
        });
}

function selectoutroTreino(day: PlanoTreinoDia) {
    console.log('Dia selecionado:', day);
    PlanosService.getPlanoDoDia(day.diaSemana)
        .then(response => {
            console.log('Treino do dia selecionado recebido:', response.data.data?.dia?.treino);
            activeWorkout.value = response.data.data?.dia?.treino ?? null;
        })
        .catch(error => {
            console.error('Erro ao buscar plano do dia:', error);
            notify.error('Não foi possível carregar o treino do dia selecionado.');
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

function cadastrarPeso(exercicio: TreinoExercicio) {
    $q.dialog({
        title: 'Cadastrar Peso',
        message: 'Digite o peso utilizado:',
        prompt: {
            model: exercicio.weight ? exercicio.weight.toString() : '',
            type: 'number'
        },
        cancel: true,
        persistent: true
    }).onOk((valor: string) => {
        if (!valor) {
            console.log(`Peso não informado para o exercício ${exercicio.exercicio?.name}`);
            return;
        }
        exercicio.weight = parseFloat(valor);
    });
}

function toggleExercicio(idx: number) {
    exercicioAtual.value =
        exercicioAtual.value === idx
            ? null
            : idx;
}

function finalizarExercicio(idx: number) {

    if (!exerciciosConcluidos.value.includes(idx)) {
        exerciciosConcluidos.value.push(idx);
    }

    const proximo = idx + 1;

    if (proximo < activeWorkout.value!.exercises.length) {
        exercicioAtual.value = proximo;
    } else {
        exercicioAtual.value = null;
    }
}
</script>
<style scoped>
.detail-timer {
    float: right;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.exercises-section {
    margin-top: 22px;
}

.section-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
}

.exercises-title {
    font-size: 24px;
    font-weight: 800;
    color: #222;
}

.exercise-progress {
    font-size: 13px;
    font-weight: 700;
    color: #777;
    background: #f3f3f3;
    padding: 6px 12px;
    border-radius: 999px;
}

.exercise-card {
    background: #fff;
    border-radius: 22px;
    padding: 18px;
    margin-bottom: 14px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
    transition: .25s ease;

    &.active {
        border: 2px solid #e95e1e;
        box-shadow: 0 6px 22px rgba(0, 0, 0, 0.08);
    }

    &.completed {
        opacity: .72;
    }
}

.exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.exercise-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.exercise-index {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 14px;
}

.exercise-main-info {
    display: flex;
    flex-direction: column;
}

.exercise-name {
    font-size: 16px;
    font-weight: 800;
    color: #222;
}

.exercise-meta {
    margin-top: 4px;
    font-size: 13px;
    color: #777;
}

.exercise-status {
    font-size: 11px;
    font-weight: 800;
    color: #ff9800;
}

.completed-text {
    color: #4CAF50;
}

.exercise-body {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid #efefef;
}

.exercise-description {
    font-size: 13px;
    line-height: 1.6;
    color: #666;
}

.exercise-tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 16px;
}

.exercise-tag {
    background: #f4f4f4 !important;
    color: #666 !important;
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 700;
    min-height: unset !important;
}

.exercise-timer {
    margin-top: 22px;
    display: flex;
    justify-content: center;
}

.exercise-actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 14px;
}

.exercise-btn {
    border: none;
    border-radius: 16px;
    font-weight: 800;
    cursor: pointer;
    transition: .2s;
}

.exercise-btn:active {
    transform: scale(.96);
}

.exercise-btn.play,
.exercise-btn.pause {
    width: 56px;
    height: 56px;
    font-size: 18px;
}

.exercise-btn.play {
    background: #4CAF50;
    color: white;
}

.exercise-btn.pause {
    background: #FFC107;
    color: #222;
}

.exercise-btn.finish {
    padding: 0 24px;
    background: #ff5722;
    color: white;
    font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
    transition: all .25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

.no-workout {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 60px;
}

.no-workout-emoji {
    font-size: 90px;
}

.no-workout-text {
    font-size: 26px;
    color: #777;
}
</style>
