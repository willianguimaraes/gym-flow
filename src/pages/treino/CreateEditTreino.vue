<template>
    <q-page class="page-bg">

        <!-- HEADER -->
        <div class="page-header">
            <div class="header-content">
                <button class="btn-back" @click="router.back()">
                    <q-icon name="arrow_back" size="20px" />
                </button>
                <div>
                    <div class="page-eyebrow">{{ isEdicao ? 'Editar' : 'Novo' }} Treino</div>
                    <h1 class="page-title">{{ isEdicao ? form.name || 'Editar' : 'Criar Treino' }}</h1>
                </div>
                <button class="btn-salvar" :disabled="!formValido" @click="salvar">
                    {{ salvando ? '...' : 'Salvar' }}
                </button>
            </div>
        </div>

        <div class="form-body">

            <!-- SECAO: INFORMAÇÕES GERAIS -->
            <div class="section-card">
                <div class="section-title">Informações gerais</div>

                <div class="field-group">
                    <label class="field-label">Nome do treino *</label>
                    <input v-model="form.name" class="field-input" placeholder="Ex: Peito - Hipertrofia"
                        maxlength="50" />
                </div>

                <div class="field-row">
                    <div class="field-group flex-1">
                        <label class="field-label">Categoria *</label>
                        <div class="select-wrapper">
                            <select v-model="form.category" class="field-select">
                                <option value="">Selecione...</option>
                                <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
                            </select>
                            <q-icon name="expand_more" class="select-arrow" size="18px" />
                        </div>
                    </div>
                    <div class="field-group flex-1">
                        <label class="field-label">Dificuldade *</label>
                        <div class="difficulty-picker">
                            <button v-for="i in 5" :key="i" class="diff-btn" :class="{ active: form.difficulty >= i }"
                                :style="form.difficulty >= i ? { background: form.color, borderColor: form.color } : {}"
                                @click="form.difficulty = i">{{ i }}</button>
                        </div>
                    </div>
                </div>

                <div class="field-row">
                    <div class="field-group flex-1">
                        <label class="field-label">Duração (min) *</label>
                        <input v-model.number="form.duration" type="number" class="field-input" placeholder="55"
                            min="1" />
                    </div>
                    <div class="field-group flex-1">
                        <label class="field-label">Kcal estimado</label>
                        <input v-model.number="form.kcal" type="number" class="field-input" placeholder="420" min="0" />
                    </div>
                </div>

                <div class="field-group">
                    <label class="field-label">Descrição</label>
                    <textarea v-model="form.description" class="field-textarea"
                        placeholder="Descreva o objetivo do treino..." rows="2"></textarea>
                </div>

                <!-- COR -->
                <div class="field-group">
                    <label class="field-label">Cor do treino *</label>
                    <div class="color-picker">
                        <button v-for="cor in cores" :key="cor" class="color-dot" :style="{ background: cor }"
                            :class="{ selected: form.color === cor }" @click="form.color = cor">
                            <q-icon v-if="form.color === cor" name="check" size="14px" color="white" />
                        </button>
                    </div>
                </div>

                <!-- MÚSCULOS -->
                <div class="field-group">
                    <label class="field-label">Músculos trabalhados *</label>
                    <div class="muscles-grid">
                        <button v-for="m in musculosDisponiveis" :key="m" class="muscle-toggle"
                            :class="{ active: form.muscles.includes(m) }"
                            :style="form.muscles.includes(m) ? { borderColor: form.color, color: form.color, background: form.color + '15' } : {}"
                            @click="toggleMusculo(m)">{{ m }}</button>
                    </div>
                </div>
            </div>

            <!-- SECAO: EXERCÍCIOS -->
            <div class="section-card">
                <div class="section-header-row">
                    <div class="section-title">Exercícios</div>
                    <button class="btn-add-ex" @click="abrirCatalogo" :style="{ background: form.color }">
                        <q-icon name="add" size="16px" />
                        Adicionar
                    </button>
                </div>

                <!-- LISTA DE EXERCÍCIOS DO TREINO -->
                <div v-if="form.exercises.length === 0" class="ex-empty">
                    <q-icon name="fitness_center" size="32px" color="grey-4" />
                    <p>Nenhum exercício adicionado</p>
                    <span>Toque em "Adicionar" para buscar no catálogo</span>
                </div>

                <draggable v-else v-model="form.exercises" item-key="tempId" handle=".drag-handle" @end="reordenar">
                    <template #item="{ element: ex, index: idx }">
                        <div class="ex-item">
                            <div class="ex-item-top">
                                <div class="drag-handle">
                                    <q-icon name="drag_indicator" size="20px" color="grey-4" />
                                </div>
                                <div class="ex-item-num" :style="{ background: form.color + '22', color: form.color }">
                                    {{ idx + 1 }}
                                </div>
                                <div class="ex-item-info">
                                    <div class="ex-item-name">{{ ex.exercicio.name || '' }}</div>
                                    <div class="ex-item-muscle">{{ ex.exercicio.musculoPrimario || '' }}</div>
                                </div>
                                <button class="ex-remove" @click="removerExercicio(idx)">
                                    <q-icon name="close" size="16px" />
                                </button>
                            </div>

                            <!-- CONFIG DA SÉRIE -->
                            <div class="ex-config">
                                <div class="ex-config-field">
                                    <label>Séries</label>
                                    <input v-model.number="ex.sets" type="number" min="1" max="20" />
                                </div>
                                <div class="ex-config-field">
                                    <label>Reps</label>
                                    <input v-model.number="ex.reps" type="number" min="1" max="100" />
                                </div>
                                <div class="ex-config-field">
                                    <label>Desc. (s)</label>
                                    <input v-model.number="ex.rest" type="number" min="0" max="600" />
                                </div>
                                <div class="ex-config-field">
                                    <label>Peso (kg)</label>
                                    <input v-model.number="ex.weight" type="number" min="0" step="0.5"
                                        placeholder="0=Corpo" />
                                </div>
                            </div>

                            <!-- OBSERVAÇÃO -->
                            <div class="ex-obs-row">
                                <button class="ex-obs-toggle" @click="ex.showObs = !ex.showObs">
                                    <q-icon :name="ex.showObs ? 'expand_less' : 'expand_more'" size="14px" />
                                    {{ ex.observacao ? 'Ver observação' : 'Adicionar observação' }}
                                </button>
                            </div>
                            <div v-if="ex.showObs" class="ex-obs-field">
                                <textarea v-model="ex.observacao"
                                    placeholder="Ex: manter cotovelos a 45°, contrair no topo..." rows="2"></textarea>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>

        </div>

        <!-- DIALOG CATÁLOGO -->
        <q-dialog v-model="dialogCatalogo" position="bottom">
            <q-card class="catalogo-sheet">
                <div class="catalogo-header">
                    <div class="catalogo-title">Catálogo de Exercícios</div>
                    <button class="dialog-close" @click="dialogCatalogo = false">✕</button>
                </div>

                <!-- BUSCA NO CATÁLOGO -->
                <div class="catalogo-search">
                    <q-icon name="search" size="18px" color="grey-5" />
                    <input v-model="buscaCatalogo" class="catalogo-search-input" placeholder="Buscar exercício..."
                        autofocus />
                </div>

                <!-- FILTRO POR MÚSCULO -->
                <div class="catalogo-filters">
                    <button class="cat-filter-chip" :class="{ active: filtroMusculo === '' }"
                        @click="filtroMusculo = ''">Todos</button>
                    <button v-for="m in musculosDisponiveis" :key="m" class="cat-filter-chip"
                        :class="{ active: filtroMusculo === m }" @click="filtroMusculo = m">{{ m }}</button>
                </div>

                <!-- LISTA DO CATÁLOGO -->
                <div class="catalogo-list">
                    <div v-if="catalogo.length === 0" class="catalogo-empty">
                        Nenhum exercício encontrado
                    </div>
                    <div v-for="ex in catalogo" :key="ex.name" class="catalogo-item"
                        :class="{ 'ja-adicionado': jaAdicionado(ex.name) }"
                        @click="!jaAdicionado(ex.name) && adicionarExercicio(ex)">
                        <div class="catalogo-item-icon" :style="{ background: form.color + '22' }">
                            <q-icon name="fitness_center" size="18px" :style="{ color: form.color }" />
                        </div>
                        <div class="catalogo-item-info">
                            <div class="catalogo-item-name">{{ ex.name }}</div>
                            <div class="catalogo-item-meta">
                                <span>{{ ex.musculoPrimario }}</span>
                                <span>·</span>
                                <span>{{ ex.equipamento }}</span>
                            </div>
                        </div>
                        <div class="catalogo-item-action">
                            <q-icon v-if="jaAdicionado(ex.name)" name="check_circle" size="20px" color="positive" />
                            <q-icon v-else name="add_circle_outline" size="20px" :style="{ color: form.color }" />
                        </div>
                    </div>
                </div>
            </q-card>
        </q-dialog>

    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import draggable from 'vuedraggable';
import type { ExercicioCatalogo } from '../../types/ExercicioCatalogo';
import type { Treino } from '../../types/Exercicios';
import CatalogoService from 'src/services/CatalogoService';
import { useNotify } from 'src/utils/NotificacaoUtils';
import TreinoService from 'src/services/TreinoService';

const notify = useNotify();
const router = useRouter();
const route = useRoute();

const isEdicao = computed(() => !!route.params.id);
const salvando = ref(false);



// ── FORM ─────────────────────────────────────────────────────
const form = ref<Treino>({
    id: null,
    usuarioId: 0,
    name: '',
    category: '',
    color: '',
    duration: 0,
    kcal: 0,
    difficulty: 1,
    description: '',
    muscles: [],
    exercises: []
});

const formValido = computed(() =>
    form.value.name.trim() &&
    form.value.category &&
    form.value.color &&
    form.value.duration > 0 &&
    form.value.muscles.length > 0 &&
    form.value.exercises.length > 0
);

// ── OPÇÕES ───────────────────────────────────────────────────
const categorias = ['Musculação', 'Cardio', 'Funcional', 'Mobilidade'];
const cores = [
    '#E85D04', '#1D9E75', '#7F77DD', '#D4537E',
    '#BA7517', '#3B6D11', '#0077B6', '#6D4C41',
];
const musculosDisponiveis = [
    'Peitoral', 'Latíssimo', 'Trapézio', 'Rombóides',
    'Deltóide', 'Bíceps', 'Tríceps', 'Braquial',
    'Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha',
    'Core', 'Lombares',
];

// ── MÚSCULOS ─────────────────────────────────────────────────
function toggleMusculo(m: string) {
    const idx = form.value.muscles.indexOf(m);
    if (idx >= 0) form.value.muscles.splice(idx, 1);
    else form.value.muscles.push(m);
}

// ── CATÁLOGO ─────────────────────────────────────────────────
const dialogCatalogo = ref(false);
const buscaCatalogo = ref('');
const filtroMusculo = ref('');
const catalogo = ref<ExercicioCatalogo[]>([]);

function jaAdicionado(exercicioName: string) {
    return form.value.exercises.some(e => exercicioName.includes(e?.exercicio?.name || ''));
}

function abrirCatalogo() {
    buscaCatalogo.value = '';
    filtroMusculo.value = '';
    dialogCatalogo.value = true;
}

function buscarExerciciosCatalogo() {
    const params: Record<string, string> = {};
    if (buscaCatalogo.value && buscaCatalogo.value !== '') {
        params.nome = buscaCatalogo.value
    }
    if (filtroMusculo.value && filtroMusculo.value !== '') {
        params.musculo = filtroMusculo.value
    }
    CatalogoService.getAllCatalogo(params).then(response => {
        catalogo.value = response.data.data || []
    }).catch(error => {
        console.error('Erro ao obter catalogo de exercicios', error);
        notify.error('Erro ao obter catalogo de exercicios');
    })
}

function adicionarExercicio(ex: ExercicioCatalogo) {
    form.value.exercises.push({
        id: null,
        treinoId: form.value.id || null,
        exercicioId: ex.id || 0,
        exercicio: ex,
        ordem: form.value.exercises.length + 1,
        sets: 3,
        reps: 12,
        rest: 60,
        weight: 0,
        observacao: ''
    });
    // Adiciona músculo automaticamente se ainda não estiver
    if (!form.value.muscles.includes(ex.musculoPrimario)) {
        form.value.muscles.push(ex.musculoPrimario);
    }
}

function removerExercicio(idx: number) {
    form.value.exercises.splice(idx, 1);
    reordenar();
}

function reordenar() {
    form.value.exercises.forEach((ex, i) => { ex.ordem = i + 1; });
}

// ── SALVAR ───────────────────────────────────────────────────
async function salvar() {
    if (!formValido.value) return;
    salvando.value = true;

    if (isEdicao.value) {
        console.log('TODO: PATCH /api/treinos/', route.params.id, form.value);
        await TreinoService.updateTreino(Number(route.params.id), form.value)
    } else {
        console.log('TODO: POST /api/treinos', form.value);
        await TreinoService.createTreino(form.value);
    }
    salvando.value = false;
    router.back();
}

function buscarExercicioEdicao(id: number) {
    TreinoService.getById(id).then(response => {
        const treino = response.data.data || null
        if (treino) {
            form.value = treino
        } else {
            notify.error('Erro ao buscar treino.')
        }

    }).catch(error => {
        console.error('Erro ao obter treino para edição', error);
        notify.error('Erro ao obter treino para edição');
    })
}

// ── CARREGAR DADOS (edição) ───────────────────────────────────
onMounted(() => {
    buscarExerciciosCatalogo();

    if (isEdicao.value) {
        console.log('TODO: GET /api/treinos/', route.params.id);
        buscarExercicioEdicao(Number(route.params.id));
    }
});
</script>

<style scoped>
.page-bg {
    background: #F5F5F4;
    min-height: 100vh;
}

/* HEADER */
.page-header {
    background: #1A1A1A;
    padding: 20px 16px;
    position: sticky;
    top: 0;
    z-index: 10;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-back {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
}

.page-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
}

.page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 1px;
    color: #fff;
    margin: 0;
    line-height: 1;
}

.btn-salvar {
    margin-left: auto;
    background: #E85D04;
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
    flex-shrink: 0;
}

.btn-salvar:disabled {
    opacity: 0.4;
    cursor: default;
}

/* BODY */
.form-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 100px;
}

/* SECTION CARD */
.section-card {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid rgba(0, 0, 0, 0.07);
    padding: 18px 16px;
}

.section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 1px;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 16px;
}

.section-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.btn-add-ex {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 14px;
    border-radius: 50px;
    border: none;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
}

/* FIELDS */
.field-group {
    margin-bottom: 14px;
}

.field-group:last-child {
    margin-bottom: 0;
}

.field-row {
    display: flex;
    gap: 10px;
}

.flex-1 {
    flex: 1;
    min-width: 0;
}

.field-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 6px;
}

.field-input,
.field-select,
.field-textarea {
    width: 100%;
    padding: 11px 13px;
    border: 1.5px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    color: #1A1A1A;
    background: #FAFAF9;
    outline: none;
    transition: border-color 0.15s;
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
    border-color: #E85D04;
    background: #fff;
}

.field-textarea {
    resize: none;
}

.select-wrapper {
    position: relative;
}

.field-select {
    appearance: none;
    padding-right: 32px;
    cursor: pointer;
}

.select-arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    pointer-events: none;
}

/* DIFFICULTY */
.difficulty-picker {
    display: flex;
    gap: 6px;
}

.diff-btn {
    flex: 1;
    height: 36px;
    border-radius: 8px;
    border: 1.5px solid rgba(0, 0, 0, 0.12);
    background: transparent;
    font-size: 13px;
    font-weight: 700;
    color: #bbb;
    cursor: pointer;
    transition: all 0.15s;
}

.diff-btn.active {
    color: #fff;
}

/* COLOR PICKER */
.color-picker {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.color-dot {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s;
}

.color-dot.selected {
    transform: scale(1.15);
    border-color: rgba(0, 0, 0, 0.2);
}

/* MUSCLES */
.muscles-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.muscle-toggle {
    padding: 6px 12px;
    border-radius: 50px;
    border: 1.5px solid rgba(0, 0, 0, 0.12);
    background: transparent;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: all 0.15s;
}

/* EXERCISE EMPTY */
.ex-empty {
    text-align: center;
    padding: 30px 20px;
    color: #bbb;
}

.ex-empty p {
    font-size: 14px;
    font-weight: 600;
    margin: 8px 0 4px;
    color: #aaa;
}

.ex-empty span {
    font-size: 12px;
}

/* EXERCISE ITEM */
.ex-item {
    background: #FAFAF9;
    border-radius: 12px;
    border: 1.5px solid rgba(0, 0, 0, 0.07);
    margin-bottom: 10px;
    overflow: hidden;
}

.ex-item:last-child {
    margin-bottom: 0;
}

.ex-item-top {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 12px 10px;
}

.drag-handle {
    cursor: grab;
    flex-shrink: 0;
}

.drag-handle:active {
    cursor: grabbing;
}

.ex-item-num {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 15px;
    flex-shrink: 0;
}

.ex-item-info {
    flex: 1;
    min-width: 0;
}

.ex-item-name {
    font-size: 13px;
    font-weight: 600;
    color: #1A1A1A;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ex-item-muscle {
    font-size: 11px;
    color: #999;
    margin-top: 1px;
}

.ex-remove {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #FFEBEE;
    color: #E53935;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
}

/* EX CONFIG */
.ex-config {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(0, 0, 0, 0.06);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.ex-config-field {
    background: #fff;
    padding: 8px 10px;
    text-align: center;
}

.ex-config-field label {
    display: block;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #bbb;
    margin-bottom: 4px;
}

.ex-config-field input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 15px;
    font-weight: 700;
    color: #1A1A1A;
    text-align: center;
    background: transparent;
    font-family: inherit;
}

/* OBS */
.ex-obs-row {
    padding: 6px 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.ex-obs-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #aaa;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
}

.ex-obs-field {
    padding: 0 12px 10px;
}

.ex-obs-field textarea {
    width: 100%;
    border: 1.5px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 12px;
    font-family: inherit;
    color: #333;
    background: #fff;
    outline: none;
    resize: none;
}

/* CATÁLOGO SHEET */
.catalogo-sheet {
    width: 100%;
    max-width: 600px;
    border-radius: 20px 20px 0 0 !important;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
}

.catalogo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 18px 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    flex-shrink: 0;
}

.catalogo-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 1px;
    color: #1A1A1A;
}

.dialog-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid rgba(0, 0, 0, 0.1);
    background: #f5f5f5;
    cursor: pointer;
    font-size: 13px;
}

.catalogo-search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    flex-shrink: 0;
}

.catalogo-search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    font-family: inherit;
    color: #1A1A1A;
    background: transparent;
}

.catalogo-filters {
    display: flex;
    gap: 6px;
    padding: 10px 14px;
    overflow-x: auto;
    scrollbar-width: none;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.catalogo-filters::-webkit-scrollbar {
    display: none;
}

.cat-filter-chip {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 50px;
    border: 1.5px solid rgba(0, 0, 0, 0.12);
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}

.cat-filter-chip.active {
    background: #1A1A1A;
    border-color: #1A1A1A;
    color: #fff;
}

.catalogo-list {
    overflow-y: auto;
    flex: 1;
}

.catalogo-empty {
    text-align: center;
    padding: 30px;
    color: #bbb;
    font-size: 13px;
}

.catalogo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: background 0.15s;
}

.catalogo-item:active {
    background: #f5f5f5;
}

.catalogo-item.ja-adicionado {
    opacity: 0.5;
    cursor: default;
}

.catalogo-item-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.catalogo-item-info {
    flex: 1;
}

.catalogo-item-name {
    font-size: 14px;
    font-weight: 600;
    color: #1A1A1A;
}

.catalogo-item-meta {
    font-size: 11px;
    color: #999;
    margin-top: 2px;
    display: flex;
    gap: 4px;
}

.catalogo-item-action {
    flex-shrink: 0;
}
</style>