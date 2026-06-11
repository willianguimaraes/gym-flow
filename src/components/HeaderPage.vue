<template>
    <!-- HEADER -->
    <div class="page-header">
        <div class="header-content">
            <div>
                <div class="page-eyebrow">{{ eyebrow }}</div>
                <h1 class="page-title">{{ title }}</h1>
            </div>
            <q-btn class="btn-novo" unelevated @click="acaoBotao">
                <q-icon name="add" size="18px" class="q-mr-xs" />
                {{ button }}
            </q-btn>
        </div>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['acao-botao']);

function acaoBotao() {
    emit('acao-botao');
}

interface HeaderPageProps {
    title: string;
    eyebrow: string;
    button: string;
}

withDefaults(defineProps<HeaderPageProps>(), {
    title: '',
    eyebrow: '',
    button: 'Novo',
});
</script>
<style scoped>
/* HEADER */
.page-header {
    background: #1A1A1A;
    padding: 24px 20px 20px;
}

.header-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
}

.page-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 4px;
}

.page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px;
    letter-spacing: 1px;
    color: #fff;
    margin: 0;
    line-height: 1;
}

.btn-novo {
    background: #E85D04 !important;
    color: #fff !important;
    border-radius: 50px !important;
    font-weight: 700;
    font-size: 13px;
    padding: 10px 18px !important;
    white-space: nowrap;
    flex-shrink: 0;
}
</style>
