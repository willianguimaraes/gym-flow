<template>
    <div class="modal-overlay">
        <div class="modal-sheet">
            <div class="modal-header">
                <div>
                    <div class="modal-label">
                        Novo exercício
                    </div>
                    <div class="modal-title">
                        Cadastro
                    </div>
                </div>
                <button class="close-btn" @click="fecharModal()">
                    ✕
                </button>
            </div>
            <!-- FORM -->
            <div class="form-group">
                <label>Nome</label>
                <input v-model="novoExercicio.name" class="form-input" type="text" />
            </div>
            <div class="form-group">
                <label>Grupo muscular</label>
                <select v-model="novoExercicio.musculoPrimario" class="form-input">
                    <option>Peito</option>
                    <option>Costas</option>
                    <option>Perna</option>
                    <option>Ombro</option>
                    <option>Bíceps</option>
                    <option>Tríceps</option>
                </select>
            </div>
            <div class="form-group">
                <label>Tipo</label>
                <select v-model="novoExercicio.tag" class="form-input">
                    <option>Composto</option>
                    <option>Isolado</option>
                    <option>Cardio</option>
                </select>
            </div>
            <div class="form-group">
                <label>Equipamento</label>
                <input v-model="novoExercicio.equipamento" class="form-input" type="text" />
            </div>
            <div class="form-group">
                <label>Descrição</label>
                <textarea v-model="novoExercicio.desc" rows="4" class="form-input textarea"></textarea>
            </div>
            <button class="save-button" @click="salvarExercicio">
                Salvar exercício
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ExercicioCatalogo } from 'src/types/ExercicioCatalogo';

const novoExercicio = ref<ExercicioCatalogo>({
    id: null,
    name: '',
    desc: '',
    musculoPrimario: '',
    musculosSecund: [] as string[],
    equipamento: '',
    tag: ''
});

interface Props {
    edicao: ExercicioCatalogo | null
}

const props = withDefaults(defineProps<Props>(), {
    edicao: null
})

onMounted(() => {
    limparFormulario();
    if (props.edicao) {
        novoExercicio.value = { ...props.edicao };
    }
});

const emit = defineEmits<{
    salvar: [valor: ExercicioCatalogo],
    fecharModal: []
}>();

function salvarExercicio() {
    emit('salvar', novoExercicio.value);
}

function fecharModal() {
    emit('fecharModal');
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
</script>
<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: flex-end;
    z-index: 999;
    overflow-y: auto;
}

.modal-sheet {
    width: 100%;
    background: white;
    border-radius: 28px 28px 0 0;
    padding: 24px;
    max-height: 92vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 26px;
}

.modal-label {
    font-size: 11px;
    text-transform: uppercase;
    color: #777;
    font-weight: 700;
}

.modal-title {
    margin-top: 4px;
    font-size: 30px;
    font-weight: 900;
    color: #222;
}

.close-btn {
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 14px;
    background: #f3f3f3;
    cursor: pointer;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 18px;
}

.form-group label {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 700;
    color: #555;
}

.form-input {
    border: none;
    border-radius: 16px;
    background: #f5f5f5;
    padding: 16px;
    font-size: 14px;
}

.textarea {
    resize: none;
}

.save-button {
    width: 100%;
    margin-top: 10px;
    border: none;
    border-radius: 18px;
    background: linear-gradient(135deg, #ff9800, #ff5722);
    color: white;
    padding: 16px;
    font-size: 15px;
    font-weight: 900;
    cursor: pointer;
}
</style>