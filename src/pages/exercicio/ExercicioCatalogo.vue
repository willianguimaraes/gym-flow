<template>
    <div class="header-pages" style="padding:20px">
        <header class="app-header">
            <div class="logo">{{ title }}</div>
            <br />
        </header>
        <div style="padding: 0 24px;">
            <button class="add-button" @click="openModal(null)">
                + Novo
            </button>
        </div>
    </div>
    <div class="content-wrapper">
        <div style="margin-top: 50px;">
            <!-- SEARCH -->
            <div class="search-box">
                <input v-model="filtro" type="text" placeholder="Buscar exercício..." class="search-input"
                    @change="carregarDados" input-debounce="300" />
            </div>
            <!-- LIST -->
            <div class="exercise-list">
                <div v-for="(ex, idx) in exerciciosFiltrados" :key="idx" class="exercise-card">
                    <div class="col-9">
                        <div class="exercise-card-top">
                            <div class="exercise-icon">
                                🏋️
                            </div>
                            <div class="exercise-info">

                                <div class="exercise-name">
                                    {{ ex.name }}
                                </div>
                                <div class="exercise-muscle">
                                    {{ ex.musculoPrimario }}
                                </div>
                            </div>
                        </div>
                        <div class="exercise-description">
                            {{ ex.desc }}
                        </div>
                        <div class="exercise-tags">
                            <div class="exercise-tag">
                                {{ ex.tag }}
                            </div>
                            <div class="exercise-tag">
                                {{ ex.equipamento }}
                            </div>
                        </div>
                    </div>
                    <div class="col-3 exercise-actions">
                        <button class="exercise-btn edit" @click="openModal(ex)">
                            Editar
                        </button>
                        <button class="exercise-btn delete" @click="excluirExercicio(ex)">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL -->
        <transition name="fade">

            <div v-if="abrirModal" @click.self="abrirModal = false">
                <ModalCriarExercicioCatalogo :edicao="novoExercicio" @fechar-modal="fecharModal"
                    @salvar="salvarExercicio" />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import CatalogoService from 'src/services/CatalogoService';
import type { ExercicioCatalogo } from 'src/types/ExercicioCatalogo';
import { useNotify } from 'src/utils/NotificacaoUtils';
import ModalCriarExercicioCatalogo from 'src/components/modais/ModalCriarExercicioCatalogo.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar()
const notify = useNotify();
const title = 'Catálogo de exercícios';
const abrirModal = ref(false);

const filtro = ref('');

const exercicios = ref<ExercicioCatalogo[]>([]);

const novoExercicio = ref<ExercicioCatalogo>({
    id: null,
    name: '',
    desc: '',
    musculoPrimario: '',
    musculosSecund: [] as string[],
    equipamento: '',
    tag: ''
});

const exerciciosFiltrados = computed(() => {
    return exercicios.value.filter(ex =>
        ex.name.toLowerCase().includes(filtro.value.toLowerCase())
    );
});

onMounted(() => {
    carregarDados();
});

function carregarDados() {
    const params: Record<string, string> = {};
    if (filtro.value) {
        params.name = filtro.value;
    }
    CatalogoService.getAllCatalogo(params)
        .then(response => {
            exercicios.value = response.data.data ?? [];
        })
        .catch(error => {
            console.error('Erro ao carregar catálogo:', error);
            notify.error('Erro ao carregar catálogo');
        });
    limparFormulario();
}

function salvarExercicio(exercicio: ExercicioCatalogo) {
    abrirModal.value = false;
    console.log('Salvando exercício:', exercicio);
    if (exercicio.id) {
        CatalogoService.updateExercicio(exercicio.id, exercicio)
            .then(() => {
                notify.success('Exercício atualizado com sucesso');
            })
            .catch(error => {
                console.error('Erro ao atualizar exercício:', error);
                notify.error('Erro ao atualizar exercício');
            }).finally(() => {
                carregarDados();
            });
        return;
    }

    exercicios.value.push({
        id: null,
        ...exercicio
    });
    CatalogoService.createExercicio(exercicio)
        .then(() => {
            notify.success('Exercício criado com sucesso');
        })
        .catch(error => {
            console.error('Erro ao criar exercício:', error);
            notify.error('Erro ao criar exercício');
        }).finally(() => {
            carregarDados();
        });
}

function openModal(exercicio: ExercicioCatalogo | null) {
    if (exercicio) {
        novoExercicio.value = { ...exercicio };
    } else {
        limparFormulario();
    }
    abrirModal.value = true;
}

function fecharModal() {
    abrirModal.value = false;
    limparFormulario();
}

function limparFormulario() {
    novoExercicio.value = {
        id: null,
        name: '',
        desc: '',
        musculoPrimario: '',
        musculosSecund: [] as string[],
        equipamento: '',
        tag: ''
    };
}

function excluirExercicio(exercicio: ExercicioCatalogo) {

    $q.dialog({
        title: 'Deseja excluir este exercício?',
        message: 'Esta ação não pode ser desfeita.',
        cancel: true,
        persistent: true
    }).onOk(() => {
        exercicios.value = exercicios.value.filter(ex => ex.id !== exercicio.id);
        CatalogoService.deleteExercicio(exercicio.id!).then(() => {
            notify.success('Exercício excluído com sucesso');
        }).catch(error => {
            console.error('Erro ao excluir exercício:', error);
            notify.error('Erro ao excluir exercício');
        });
    })
}


</script>

<style scoped>
.exercise-page {
    padding: 20px;
    min-height: 100vh;
    background: #f5f5f5;
}

/* HEADER */

.exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.header-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #777;
    font-weight: 700;
}

.header-title {
    margin-top: 4px;
    font-size: 32px;
    font-weight: 900;
    color: #222;
}

.add-button {
    border: none;
    background: linear-gradient(135deg, #ff9800, #ff5722);
    color: white;
    padding: 14px 18px;
    border-radius: 18px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(255, 87, 34, 0.25);
}

/* SEARCH */

.search-box {
    margin-bottom: 20px;
}

.search-input {
    width: 100%;
    border: none;
    border-radius: 20px;
    background: white;
    padding: 16px;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* LIST */

.exercise-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.exercise-card {
    background: white;
    border-radius: 24px;
    padding: 18px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.exercise-card-top {
    display: flex;
    align-items: center;
    gap: 14px;
}

.exercise-icon {
    width: 54px;
    height: 54px;
    border-radius: 18px;
    background: #fff3e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.exercise-info {
    flex: 1;
}

.exercise-name {
    font-size: 16px;
    font-weight: 800;
    color: #222;
}

.exercise-muscle {
    margin-top: 4px;
    font-size: 13px;
    color: #777;
}

.exercise-description {
    margin-top: 16px;
    color: #666;
    font-size: 13px;
    line-height: 1.6;
}

.exercise-tags {
    margin-top: 16px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.exercise-tag {
    background: #f3f3f3;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #666;
}

.exercise-actions {
    display: flex;
    gap: 10px;
    margin-top: 18px;
}

.exercise-btn {
    flex: 1;
    border: none;
    border-radius: 14px;
    padding: 12px;
    font-weight: 800;
    cursor: pointer;
}

.exercise-btn.edit {
    background: #1976d2;
    color: white;
}

.exercise-btn.delete {
    background: #ef5350;
    color: white;
}

/* ANIMATION */

.fade-enter-active,
.fade-leave-active {
    transition: .25s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
