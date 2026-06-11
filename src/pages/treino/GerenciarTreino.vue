<template>
    <q-page class="page-bg">

        <HeaderPage :title="'Módulo de Treinos'" :eyebrow="'Meus Treinos'" :button="'Novo Treino'"
            @acao-botao="abrirCadastro" />
        <div class="content-wrapper">
            <!-- BUSCA + FILTRO -->
            <div class="search-bar-wrapper">
                <div class="search-bar">
                    <q-icon name="search" size="20px" class="search-icon" />
                    <input v-model="busca" class="search-input" placeholder="Buscar treino..." />
                    <div class="filter-chips">
                        <button v-for="cat in categorias" :key="cat" class="filter-chip"
                            :class="{ active: filtroCategoria === cat }"
                            @click="filtroCategoria = filtroCategoria === cat ? '' : cat">{{ cat }}</button>
                    </div>
                </div>
            </div>

            <!-- LISTA DE TREINOS -->
            <div class="treinos-list">

                <div v-if="treinosFiltrados.length === 0" class="empty-state">
                    <div class="empty-icon">🏋️</div>
                    <div class="empty-title">Nenhum treino encontrado</div>
                    <div class="empty-sub">Crie seu primeiro treino para começar</div>
                </div>

                <div v-for="treino in treinosFiltrados" :key="treino.name" class="treino-card">
                    <!-- COLOR BAR -->
                    <div class="treino-color-bar" :style="{ background: treino.color }"></div>

                    <div class="treino-card-body">

                        <!-- TOP ROW -->
                        <div class="treino-top">
                            <div class="treino-top-left">
                                <span class="treino-category">{{ treino.category }}</span>
                                <h3 class="treino-name">{{ treino.name }}</h3>
                            </div>
                            <div class="treino-difficulty">
                                <div v-for="i in 5" :key="i" class="diff-dot"
                                    :style="i <= treino.difficulty ? { background: treino.color } : {}"></div>
                            </div>
                        </div>

                        <!-- MUSCLES -->
                        <div class="muscles-row">
                            <span v-for="m in treino.muscles" :key="m" class="muscle-chip">{{ m }}</span>
                        </div>

                        <!-- STATS -->
                        <div class="treino-stats">
                            <div class="stat-item">
                                <q-icon name="timer" size="14px" />
                                <span>{{ treino.duration }}min</span>
                            </div>
                            <div class="stat-item">
                                <q-icon name="local_fire_department" size="14px" />
                                <span>~{{ treino.kcal }} kcal</span>
                            </div>
                            <div class="stat-item">
                                <q-icon name="fitness_center" size="14px" />
                                <span>{{ treino.exercises.length }} exerc.</span>
                            </div>
                        </div>

                        <!-- EXERCISES PREVIEW -->
                        <div class="exercises-preview">
                            <div v-for="(ex, idx) in treino.exercises.slice(0, 3)" :key="idx" class="ex-preview-item">
                                <span class="ex-preview-num" :style="{ color: treino.color }">{{ idx + 1 }}</span>
                                <span class="ex-preview-name">{{ ex.exercicio?.name }}</span>
                                <span class="ex-preview-sets">{{ ex.sets }}×{{ ex.reps }}</span>
                            </div>
                            <div v-if="treino.exercises.length > 3" class="ex-preview-more">
                                +{{ treino.exercises.length - 3 }} exercícios
                            </div>
                        </div>

                        <!-- ACTIONS -->
                        <div class="treino-actions">
                            <button class="btn-action btn-ver" @click="verTreino(treino)">
                                <q-icon name="visibility" size="16px" />
                                Ver detalhes
                            </button>
                            <button class="btn-action btn-editar" @click="editarTreino(treino)">
                                <q-icon name="edit" size="16px" />
                                Editar
                            </button>
                            <button class="btn-action btn-excluir" @click="confirmarExclusao(treino)">
                                <q-icon name="delete" size="16px" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- DIALOG VER DETALHES -->
        <q-dialog v-model="dialogVer" position="bottom">
            <q-card class="dialog-card" v-if="treinoSelecionado">
                <div class="dialog-color-bar" :style="{ background: treinoSelecionado.color }"></div>
                <div class="dialog-header">
                    <div>
                        <div class="dialog-eyebrow">{{ treinoSelecionado.category }}</div>
                        <div class="dialog-title">{{ treinoSelecionado.name }}</div>
                        <p class="dialog-desc" v-if="treinoSelecionado.description">{{ treinoSelecionado.description }}
                        </p>
                    </div>
                    <button class="dialog-close" @click="dialogVer = false">✕</button>
                </div>

                <div class="dialog-stats-row">
                    <div class="dialog-stat">
                        <div class="dialog-stat-val">{{ treinoSelecionado.duration }}</div>
                        <div class="dialog-stat-key">minutos</div>
                    </div>
                    <div class="dialog-stat">
                        <div class="dialog-stat-val">{{ treinoSelecionado.kcal }}</div>
                        <div class="dialog-stat-key">kcal</div>
                    </div>
                    <div class="dialog-stat">
                        <div class="dialog-stat-val">{{ treinoSelecionado.exercises.length }}</div>
                        <div class="dialog-stat-key">exercícios</div>
                    </div>
                    <div class="dialog-stat">
                        <div class="dialog-stat-val">{{ treinoSelecionado.difficulty }}/5</div>
                        <div class="dialog-stat-key">dificuldade</div>
                    </div>
                </div>

                <div class="dialog-exercises">
                    <div class="dialog-section-title">EXERCÍCIOS</div>
                    <div v-for="(ex, idx) in treinoSelecionado.exercises" :key="idx" class="dialog-ex-item">
                        <div class="dialog-ex-num"
                            :style="{ background: treinoSelecionado.color + '22', color: treinoSelecionado.color }">
                            {{ idx + 1 }}
                        </div>
                        <div class="dialog-ex-info">
                            <div class="dialog-ex-name">{{ ex.exercicio?.name }}</div>
                            <div class="dialog-ex-meta">
                                <span>{{ ex.sets }}×{{ ex.reps }}</span>
                                <span>⏱ {{ ex.rest }}s</span>
                                <span v-if="ex.weight > 0">🏋️ {{ ex.weight }}kg</span>
                                <span v-else>🏋️ Corpo</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="btn-edit-full" @click="editarTreino(treinoSelecionado); dialogVer = false">
                    <q-icon name="edit" size="18px" />
                    Editar este treino
                </button>
            </q-card>
        </q-dialog>

        <!-- DIALOG CONFIRMAÇÃO EXCLUSÃO -->
        <q-dialog v-model="dialogExcluir">
            <q-card class="dialog-confirm">
                <div class="confirm-icon">⚠️</div>
                <div class="confirm-title">Excluir treino?</div>
                <div class="confirm-sub">
                    <strong>{{ treinoParaExcluir?.name }}</strong> será removido permanentemente.
                    Esta ação não pode ser desfeita.
                </div>
                <div class="confirm-actions">
                    <button class="btn-cancel" @click="dialogExcluir = false">Cancelar</button>
                    <button class="btn-confirm-delete" @click="excluirTreino">Excluir</button>
                </div>
            </q-card>
        </q-dialog>

    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Treino } from '../../types/Exercicios';
import HeaderPage from 'src/components/HeaderPage.vue';
import TreinoService from 'src/services/TreinoService';
const router = useRouter();

// ── MOCK ─────────────────────────────────────────────────────
const treinos = ref<Treino[]>([]);

// ── FILTROS ──────────────────────────────────────────────────
const busca = ref('');
const filtroCategoria = ref('');
const categorias = ['Musculação', 'Cardio', 'Funcional'];

const treinosFiltrados = computed(() => {
    return treinos.value.filter(t => {
        const matchBusca = t.name.toLowerCase().includes(busca.value.toLowerCase()) ||
            t.muscles.some(m => m.toLowerCase().includes(busca.value.toLowerCase()));
        const matchCat = !filtroCategoria.value || t.category === filtroCategoria.value;
        return matchBusca && matchCat;
    });
});

onMounted(() => {
    buscarTreinos();
})

// ── DIALOGS ──────────────────────────────────────────────────
const dialogVer = ref(false);
const dialogExcluir = ref(false);
const treinoSelecionado = ref<Treino | null>(null);
const treinoParaExcluir = ref<Treino | null>(null);


function buscarTreinos() {
    TreinoService.getTreinos()
        .then(response => {
            console.log('Treinos recebidos:', response.data?.data);
            treinos.value = response.data?.data || [];
        })
        .catch(error => {
            console.error('Erro ao buscar treinos:', error);
        });
}

function verTreino(treino: Treino) {
    treinoSelecionado.value = treino;
    dialogVer.value = true;
}

async function abrirCadastro() {
    console.log('TODO: navegar para CadastrarTreino');
    await router.push('/cadastrarTreino');
}

async function editarTreino(treino: Treino) {
    console.log('TODO: navegar para CadastrarTreino com id =', treino.id);
    await router.push(`/cadastrarTreino/${treino.id}`);
}

function confirmarExclusao(treino: Treino) {
    treinoParaExcluir.value = treino;
    dialogExcluir.value = true;
}

function excluirTreino() {
    if (!treinoParaExcluir.value) return;
    console.log('TODO: DELETE /api/treinos/', treinoParaExcluir.value.id);
    treinos.value = treinos.value.filter(t => t.id !== treinoParaExcluir.value!.id);
    dialogExcluir.value = false;
    treinoParaExcluir.value = null;
}
</script>

<style scoped>
.page-bg {
    background: #FAFAF9;
    min-height: 100vh;
}


/* SEARCH */
.search-bar-wrapper {
    padding: 16px 16px 8px;
}

.search-bar {
    background: #fff;
    border-radius: 14px;
    border: 1.5px solid rgba(0, 0, 0, 0.08);
    padding: 12px 16px;
}

.search-icon {
    color: #999;
    margin-right: 8px;
}

.search-input {
    background: transparent;
    border: none;
    outline: none;
    font-size: 14px;
    color: #1A1A1A;
    width: 100%;
    font-family: inherit;
    margin-bottom: 10px;
}

.search-input::placeholder {
    color: #bbb;
}

.filter-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.filter-chip {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 5px 12px;
    border-radius: 50px;
    border: 1.5px solid rgba(0, 0, 0, 0.12);
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.15s;
}

.filter-chip.active {
    background: #1A1A1A;
    border-color: #1A1A1A;
    color: #fff;
}

/* TREINOS LIST */
.treinos-list {
    padding: 8px 16px 100px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
}

.empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    color: #999;
    margin-bottom: 6px;
}

.empty-sub {
    font-size: 13px;
    color: #bbb;
}

/* TREINO CARD */
.treino-card {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: box-shadow 0.2s;
}

.treino-card:active {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
}

.treino-color-bar {
    height: 5px;
}

.treino-card-body {
    padding: 16px;
}

.treino-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
}

.treino-category {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #999;
    display: block;
    margin-bottom: 3px;
}

.treino-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 1px;
    color: #1A1A1A;
    margin: 0;
    line-height: 1;
}

.treino-difficulty {
    display: flex;
    gap: 4px;
    margin-top: 4px;
}

.diff-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.1);
}

.muscles-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.muscle-chip {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 50px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    color: #666;
}

.treino-stats {
    display: flex;
    gap: 14px;
    margin-bottom: 14px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #888;
}

/* EXERCISES PREVIEW */
.exercises-preview {
    background: #FAFAF9;
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 14px;
}

.ex-preview-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.ex-preview-item:last-child {
    border-bottom: none;
}

.ex-preview-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    width: 18px;
    flex-shrink: 0;
}

.ex-preview-name {
    flex: 1;
    font-size: 12px;
    font-weight: 500;
    color: #333;
}

.ex-preview-sets {
    font-size: 11px;
    font-weight: 700;
    color: #999;
}

.ex-preview-more {
    font-size: 11px;
    color: #bbb;
    text-align: center;
    padding-top: 6px;
    font-weight: 600;
}

/* ACTIONS */
.treino-actions {
    display: flex;
    gap: 8px;
}

.btn-action {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 9px 14px;
    border-radius: 10px;
    border: none;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
}

.btn-ver {
    flex: 1;
    background: #F5F5F4;
    color: #555;
    justify-content: center;
}

.btn-ver:active {
    background: #eee;
}

.btn-editar {
    flex: 1;
    background: #1A1A1A;
    color: #fff;
    justify-content: center;
}

.btn-editar:active {
    background: #333;
}

.btn-excluir {
    background: #FFF0F0;
    color: #E53935;
    padding: 9px 12px;
}

.btn-excluir:active {
    background: #FFCDD2;
}

/* DIALOG VER */
.dialog-card {
    width: 100%;
    max-width: 600px;
    border-radius: 20px 20px 0 0 !important;
    overflow: hidden;
    max-height: 88vh;
    overflow-y: auto;
}

.dialog-color-bar {
    height: 5px;
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 20px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.dialog-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 4px;
}

.dialog-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px;
    letter-spacing: 1px;
    color: #1A1A1A;
    line-height: 1;
    margin-bottom: 6px;
}

.dialog-desc {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin: 0;
}

.dialog-close {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1.5px solid rgba(0, 0, 0, 0.1);
    background: #f5f5f5;
    cursor: pointer;
    font-size: 14px;
    flex-shrink: 0;
}

.dialog-stats-row {
    display: flex;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.dialog-stat {
    flex: 1;
    padding: 14px 8px;
    text-align: center;
    border-right: 1px solid rgba(0, 0, 0, 0.07);
}

.dialog-stat:last-child {
    border-right: none;
}

.dialog-stat-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    color: #1A1A1A;
    line-height: 1;
}

.dialog-stat-key {
    font-size: 10px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
}

.dialog-exercises {
    padding: 16px 20px 0;
}

.dialog-section-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #bbb;
    margin-bottom: 12px;
}

.dialog-ex-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dialog-ex-item:last-child {
    border-bottom: none;
}

.dialog-ex-num {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    flex-shrink: 0;
}

.dialog-ex-name {
    font-size: 14px;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 3px;
}

.dialog-ex-meta {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: #888;
}

.btn-edit-full {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: calc(100% - 40px);
    margin: 16px 20px 20px;
    padding: 16px;
    background: #1A1A1A;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 1px;
    cursor: pointer;
}

/* DIALOG CONFIRM */
.dialog-confirm {
    width: 320px;
    border-radius: 20px !important;
    padding: 28px 24px 20px;
    text-align: center;
}

.confirm-icon {
    font-size: 40px;
    margin-bottom: 12px;
}

.confirm-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    color: #1A1A1A;
    margin-bottom: 8px;
}

.confirm-sub {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 20px;
}

.confirm-actions {
    display: flex;
    gap: 10px;
}

.btn-cancel {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid rgba(0, 0, 0, 0.12);
    background: transparent;
    font-size: 14px;
    font-weight: 700;
    color: #555;
    cursor: pointer;
}

.btn-confirm-delete {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: none;
    background: #E53935;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
}
</style>