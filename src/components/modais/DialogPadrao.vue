<template>
    <div class="q-pa-md">
        <q-btn :label="props.lblBtn" :class="props.classbtn || 'btn-prd btn-info'" @click="prompt" />
    </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()

const emit = defineEmits<{
  confirmar: [valor: string]
}>()

interface Props {
    lblBtn: string,
    classbtn: string,
    titulo?: string,
    typeCamp: 'text' | 'number' | 'password',
    message: string,
    validation?: (value: string) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  titulo: 'Timer',
  typeCamp: 'text'
})

function prompt() {
  $q.dialog({
    title: props.titulo,
    message: props.message,
    prompt: {
      model: '',
      isValid: val => props.validation ? props.validation(val) : true, // << here is the magic
      type: props.typeCamp // optional
    },
    cancel: true,
    persistent: true
  }).onOk((data) => {
    emit('confirmar', data)
  })
}
</script>