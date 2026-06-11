<template>
    <q-page class="page-bg">

        <!-- HEADER -->
        <div class="page-header">
            <div class="header-content">
                <button class="btn-back" @click="router.back()">
                    <q-icon name="arrow_back" size="20px" />
                </button>
                <div>
                    <div class="page-eyebrow">{{ isEdicao ? 'Editar' : 'Novo' }} Plano</div>
                    <h1 class="page-title">{{ form?.nome || 'Plano de Treino' }}</h1>
                </div>
                <button class="btn-salvar" :disabled="!formValido || salvando" @click="salvar">
                    {{ salvando ? '...' : 'Salvar' }}
                </button>
            </div>

            <!-- STEPS -->
            <div class="steps-row">
                <div v-for="(step, idx) in steps" :key="idx" class="step-item"
                    :class="{ active: stepAtual === idx, done: stepAtual > idx }" @click="stepAtual = idx">
                    <div class="step-dot">
                        <q-icon v-if="stepAtual > idx" name="check" size="12px" />
                        <span v-else>{{ idx + 1 }}</span>
                    </div>
                    <span class="step-label">{{ step }}</span>
                </div>
            </div>
        </div>

        <!-- STEP 1: INFORMAÇÕES -->
        <div v-if="stepAtual === 0" class="form-body">
            <div class="section-card">
                <div class="section-title">Informações do plano</div>

                <div class="field-group">
                    <label class="field-label">Nome do plano *</label>
                    <input v-model="form.nome" class="field-input" placeholder="Ex: Hipertrofia - Fase 1"
                        maxlength="60" />
                </div>

                <div class="field-group">
                    <label class="field-label">Descrição</label>
                    <textarea v-model="form.descricao" class="field-textarea"
                        placeholder="Objetivo, fase, observações..." rows="2"></textarea>
                </div>

                <div class="field-group">
                    <label class="field-label">Data de início *</label>
                    <input v-model="form.inicioEm" type="date" class="field-input" />
                    <div class="field-hint">
                        <q-icon name="info_outline" size="13px" />
                        O plano será ativado automaticamente nessa data, substituindo o plano atual.
                    </div>
                </div>
            </div>

            <button class="btn-next" @click="stepAtual = 1" :disabled="!step1Valido">
                Montar a semana
                <q-icon name="arrow_forward" size="18px" />
            </button>
        </div>

        <!-- STEP 2: MONTAR SEMANA -->
        <div v-if="stepAtual === 1" class="form-body">
            <div class="section-card">
                <div class="section-title">Distribuição semanal</div>
                <div class="section-sub">Toque em cada dia para associar um treino</div>

                <div class="dias-list">
                    <div v-for="dia in form?.dias" :key="dia.diaSemana" class="dia-item" :class="{ rest: dia.isRest }"
                        @click="!dia.isRest && abrirSeletorTreino(dia)">
                        <div class="dia-item-left">
                            <div class="dia-abbr">{{ abbrsDia[dia.diaSemana] }}</div>
                            <div class="dia-nome">{{ nomesDia[dia.diaSemana] }}</div>
                        </div>

                        <div class="dia-item-center">
                            <div v-if="dia.isRest" class="dia-rest-badge">
                                <q-icon name="hotel" size="14px" />
                                Descanso
                            </div>
                            <div v-else-if="dia.treino" class="dia-treino-badge"
                                :style="{ borderColor: dia.treino.color }">
                                <div class="dia-treino-dot" :style="{ background: dia.treino.color }"></div>
                                <span :style="{ color: dia.treino.color }">{{ dia.treino.name }}</span>
                            </div>
                            <div v-else class="dia-vazio">
                                <q-icon name="add" size="14px" />
                                Selecionar treino
                            </div>
                        </div>

                        <div class="dia-item-right">
                            <q-toggle v-model="dia.isRest" color="grey-6" size="sm" @click.stop
                                @update:model-value="(val: boolean) => { if (val) dia.treino = null; }" />
                            <span class="dia-rest-label">Folga</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="step-actions">
                <button class="btn-back-step" @click="stepAtual = 0">
                    <q-icon name="arrow_back" size="16px" />
                    Voltar
                </button>
                <button class="btn-next" @click="stepAtual = 2" :disabled="!step2Valido">
                    Revisar
                    <q-icon name="arrow_forward" size="18px" />
                </button>
            </div>
        </div>

        <!-- STEP 3: REVISÃO -->
        <div v-if="stepAtual === 2" class="form-body">
            <div class="section-card">
                <div class="section-title">Revisão do plano</div>

                <div class="review-item">
                    <div class="review-label">Nome</div>
                    <div class="review-value">{{ form?.nome }}</div>
                </div>
                <div class="review-item" v-if="form?.descricao">
                    <div class="review-label">Descrição</div>
                    <div class="review-value">{{ form.descricao }}</div>
                </div>
                <div class="review-item">
                    <div class="review-label">Início em</div>
                    <div class="review-value">{{ formatarData(form?.inicioEm || '') }}</div>
                </div>
            </div>

            <div class="section-card">
                <div class="section-title">Distribuição semanal</div>
                <div v-for="dia in form?.dias" :key="dia.diaSemana" class="review-dia">
                    <div class="review-dia-nome">{{ nomesDia[dia.diaSemana] }}</div>
                    <div v-if="dia.isRest" class="review-dia-rest">Descanso</div>
                    <div v-else-if="dia.treino" class="review-dia-treino">
                        <div class="review-dia-dot" :style="{ background: dia.treino.color }"></div>
                        {{ dia.treino.name }}
                    </div>
                    <div v-else class="review-dia-vazio">— Sem treino</div>
                </div>
            </div>

            <div class="step-actions">
                <button class="btn-back-step" @click="stepAtual = 1">
                    <q-icon name="arrow_back" size="16px" />
                    Voltar
                </button>
                <button class="btn-salvar-final" :disabled="salvando" @click="salvar">
                    <q-icon name="check" size="18px" />
                    {{ salvando ? 'Salvando...' : (isEdicao ? 'Atualizar Plano' : 'Criar Plano') }}
                </button>
            </div>
        </div>

        <!-- DIALOG SELECIONAR TREINO -->
        <q-dialog v-model="dialogSeletor" position="bottom">
            <q-card class="seletor-sheet">
                <div class="seletor-header">
                    <div>
                        <div class="seletor-eyebrow">{{ diaSelecionado ? nomesDia[diaSelecionado.diaSemana] : '' }}
                        </div>
                        <div class="seletor-title">Selecionar Treino</div>
                    </div>
                    <button class="dialog-close" @click="dialogSeletor = false">✕</button>
                </div>

                <div class="seletor-list">
                    <div v-for="(treino, idx) in treinos" :key="idx" class="seletor-item"
                        :class="{ selecionado: diaSelecionado?.treino?.id === treino.id }"
                        @click="selecionarTreino(treino)">
                        <div class="seletor-color" :style="{ background: treino.color }"></div>
                        <div class="seletor-info">
                            <div class="seletor-nome">{{ treino.name }}</div>
                            <div class="seletor-meta">
                                {{ treino.duration }}min
                                <span v-if="treino.exercises?.length"> · {{ treino.exercises.length }} exerc.</span>
                            </div>
                        </div>
                        <q-icon v-if="diaSelecionado?.treino?.id === treino.id" name="check_circle" size="22px"
                            color="positive" />
                        <q-icon v-else name="radio_button_unchecked" size="22px" color="grey-4" />
                    </div>
                </div>

                <div class="seletor-footer">
                    <button class="btn-limpar" @click="limparDia" v-if="diaSelecionado?.treino">
                        <q-icon name="close" size="14px" />
                        Remover treino do dia
                    </button>
                </div>
            </q-card>
        </q-dialog>

    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { PlanoTreinoDia, Treino, PlanoTreino } from 'src/types/Exercicios'
import TreinoService from 'src/services/TreinoService';
import { useNotify } from 'src/utils/NotificacaoUtils';
import PlanosService from 'src/services/PlanosService';

const notify = useNotify();
const router = useRouter();
const route = useRoute();

const isEdicao = computed(() => !!route.params.id);
const idPlano = Number(route.params.id)
const salvando = ref(false);
const stepAtual = ref(0);
const steps = ['Informações', 'Semana', 'Revisão'];
const converterData = (iso?: string): string => {
    if (!iso) return new Date().toISOString().split('T')[0] ?? '';
    return new Date(iso).toISOString().split('T')[0] ?? '';
};
const form = ref<PlanoTreino>(limparForm());

const step1Valido = computed(() => form.value?.nome.trim() && form.value?.inicioEm);
const step2Valido = computed(() =>
    form.value?.dias.some(d => !d.isRest && d.treino)
);
const formValido = computed(() => step1Valido.value && step2Valido.value);

const abbrsDia = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const nomesDia = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

function formatarData(iso: string) {
    if (iso) {
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return ''
}

// ── TREINOS MOCK ─────────────────────────────────────────────
const treinos = ref<Treino[]>([]);

// ── SELETOR DE TREINO ────────────────────────────────────────
const dialogSeletor = ref(false);
const diaSelecionado = ref<PlanoTreinoDia | null>(null);

function abrirSeletorTreino(dia: PlanoTreinoDia) {
    diaSelecionado.value = dia;
    dialogSeletor.value = true;
}

function selecionarTreino(treino: Treino) {
    if (!treino.id) {
        notify.error('Treino com erro, ajustar o treino na tela de treinos ou escolha outro treino.')
        return;
    }
    if (!diaSelecionado.value) return;
    diaSelecionado.value.treino = treino;
    diaSelecionado.value.treinoId = treino.id;
    dialogSeletor.value = false;
}

function limparDia() {
    if (!diaSelecionado.value) return;
    diaSelecionado.value.treino = null;
    diaSelecionado.value.treinoId = null;
    dialogSeletor.value = false;
}

// ── SALVAR ───────────────────────────────────────────────────
async function salvar() {
    if (!formValido.value) return;
    salvando.value = true;
    const payload = montarPayload(form.value)

    if (isEdicao.value) {
        await PlanosService.updatePlano(idPlano, payload)
            .then(() => {
                notify.success('Plano salvo com sucesso!');
                router.back();
            })
            .catch(error => {
                console.error('Erro ao salvar plano.', error);
                notify.error('Erro ao salvar plano ' + form.value.nome)
            });
    } else {
        await PlanosService.createPlano(payload)
            .then(() => {
                notify.success('Plano salvo com sucesso!');
                router.back();
            })
            .catch(error => {
                console.error('Erro ao criar novo plano.', error);
                notify.error('Erro ao criar novo plano ' + form.value.nome)
            });
    }
}

function buscaTreinos() {
    TreinoService.getTreinos().then(response => {
        treinos.value = response.data.data ?? []
    }).catch(error => {
        console.error('Erro ao buscar treinos', error)
        notify.error('Erro ao buscar treinos')
    })
}
function buscaPlanoEdicao() {
    PlanosService.gerPlanoById(idPlano).then(response => {
        const plano = response.data.data || limparForm();
        form.value = plano
        form.value.inicioEm = converterData(plano.inicioEm);
    }).catch(error => {
        console.error('Erro ao buscar plano', error)
        notify.error('Erro ao buscar plano ' + idPlano)
    })
}



function limparForm() {
    return {
        id: isEdicao.value ? idPlano : null,
        usuarioId: 0,
        nome: '',
        descricao: '',
        inicioEm: new Date().toISOString().split('T')[0] ?? '',
        dias: [
            { diaSemana: 0, isRest: true, treino: null },
            { diaSemana: 1, isRest: false, treino: null },
            { diaSemana: 2, isRest: false, treino: null },
            { diaSemana: 3, isRest: false, treino: null },
            { diaSemana: 4, isRest: false, treino: null },
            { diaSemana: 5, isRest: false, treino: null },
            { diaSemana: 6, isRest: true, treino: null },
        ] as PlanoTreinoDia[],
    } as PlanoTreino;
}

function montarPayload(plano: PlanoTreino) {
    const diasTreino = [] as PlanoTreinoDia[];
    plano.dias.forEach(item => {
        diasTreino.push({
            diaSemana: item.diaSemana || 0,
            isRest: item.isRest,
            treinoId: item?.treino?.id || null
        } as PlanoTreinoDia)
    })

    return {
        id: isEdicao.value ? idPlano : null,
        usuarioId: plano.id || 0,
        nome: plano.nome || '',
        descricao: plano.descricao || '',
        inicioEm: plano.inicioEm || new Date().toISOString().split('T')[0],
        dias: diasTreino,
    } as PlanoTreino;
}

onMounted(() => {
    buscaTreinos();
    if (isEdicao.value) {
        buscaPlanoEdicao()
    }
});
</script>

<style scoped>
.page-bg {
    background: #F5F5F4;
    min-height: 100vh;
}

.page-header {
    background: #1A1A1A;
    padding: 20px 16px 0;
    position: sticky;
    top: 0;
    z-index: 10;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
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
    font-size: 24px;
    letter-spacing: 1px;
    color: #fff;
    margin: 0;
    line-height: 1;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    flex-shrink: 0;
}

.btn-salvar:disabled {
    opacity: 0.4;
    cursor: default;
}

/* STEPS */
.steps-row {
    display: flex;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.step-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px 4px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
}

.step-item.active {
    border-bottom-color: #E85D04;
}

.step-item.done {
    border-bottom-color: #4CAF50;
}

.step-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    transition: all 0.2s;
}

.step-item.active .step-dot {
    background: #E85D04;
    color: #fff;
}

.step-item.done .step-dot {
    background: #4CAF50;
    color: #fff;
}

.step-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
    transition: color 0.2s;
}

.step-item.active .step-label {
    color: rgba(255, 255, 255, 0.8);
}

.step-item.done .step-label {
    color: rgba(255, 255, 255, 0.5);
}

/* FORM BODY */
.form-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 100px;
}

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
    margin-bottom: 4px;
}

.section-sub {
    font-size: 12px;
    color: #bbb;
    margin-bottom: 14px;
}

/* FIELDS */
.field-group {
    margin-bottom: 14px;
}

.field-group:last-child {
    margin-bottom: 0;
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
.field-textarea:focus {
    border-color: #E85D04;
    background: #fff;
}

.field-textarea {
    resize: none;
}

.field-hint {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    font-size: 11px;
    color: #aaa;
    margin-top: 6px;
    line-height: 1.4;
}

/* DIAS */
.dias-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.dia-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #FAFAF9;
    border-radius: 12px;
    padding: 12px;
    border: 1.5px solid rgba(0, 0, 0, 0.07);
    cursor: pointer;
    transition: all 0.15s;
}

.dia-item:active {
    background: #f0f0f0;
}

.dia-item.rest {
    opacity: 0.6;
}

.dia-item-left {
    flex-shrink: 0;
}

.dia-abbr {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    color: #1A1A1A;
    line-height: 1;
}

.dia-nome {
    font-size: 9px;
    color: #bbb;
    font-weight: 600;
    text-transform: uppercase;
}

.dia-item-center {
    flex: 1;
}

.dia-rest-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #bbb;
    font-weight: 600;
}

.dia-treino-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 50px;
    border: 1.5px solid;
    background: transparent;
}

.dia-treino-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.dia-treino-badge span {
    font-size: 12px;
    font-weight: 700;
}

.dia-vazio {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #ccc;
    font-weight: 600;
}

.dia-item-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
}

.dia-rest-label {
    font-size: 8px;
    color: #bbb;
    font-weight: 700;
    text-transform: uppercase;
}

/* REVIEW */
.review-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.review-item:last-child {
    border-bottom: none;
}

.review-label {
    font-size: 11px;
    font-weight: 700;
    color: #bbb;
    text-transform: uppercase;
}

.review-value {
    font-size: 14px;
    color: #1A1A1A;
    font-weight: 500;
    text-align: right;
    max-width: 60%;
}

.review-dia {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.review-dia:last-child {
    border-bottom: none;
}

.review-dia-nome {
    font-size: 13px;
    font-weight: 600;
    color: #555;
}

.review-dia-rest {
    font-size: 12px;
    color: #bbb;
}

.review-dia-treino {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #1A1A1A;
}

.review-dia-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.review-dia-vazio {
    font-size: 12px;
    color: #ddd;
}

/* BUTTONS */
.btn-next {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: none;
    background: #1A1A1A;
    color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 1px;
    cursor: pointer;
}

.btn-next:disabled {
    opacity: 0.4;
    cursor: default;
}

.step-actions {
    display: flex;
    gap: 10px;
}

.btn-back-step {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 16px 20px;
    border-radius: 14px;
    border: 1.5px solid rgba(0, 0, 0, 0.12);
    background: transparent;
    font-size: 14px;
    font-weight: 700;
    color: #555;
    cursor: pointer;
}

.btn-salvar-final {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    border-radius: 14px;
    border: none;
    background: #E85D04;
    color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 1px;
    cursor: pointer;
}

.btn-salvar-final:disabled {
    opacity: 0.5;
    cursor: default;
}

/* SELETOR */
.seletor-sheet {
    width: 100%;
    max-width: 600px;
    border-radius: 20px 20px 0 0 !important;
    max-height: 75vh;
    display: flex;
    flex-direction: column;
}

.seletor-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 18px 18px 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    flex-shrink: 0;
}

.seletor-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 3px;
}

.seletor-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
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
    flex-shrink: 0;
}

.seletor-list {
    overflow-y: auto;
    flex: 1;
}

.seletor-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: background 0.15s;
}

.seletor-item:active {
    background: #f5f5f5;
}

.seletor-item.selecionado {
    background: #F1F8F5;
}

.seletor-color {
    width: 5px;
    height: 44px;
    border-radius: 3px;
    flex-shrink: 0;
}

.seletor-info {
    flex: 1;
}

.seletor-nome {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: #1A1A1A;
    line-height: 1;
}

.seletor-meta {
    font-size: 11px;
    color: #999;
    margin-top: 2px;
}

.seletor-footer {
    padding: 12px 18px;
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    flex-shrink: 0;
}

.btn-limpar {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #E53935;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
}
</style>