<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type StatusTimer =
  | 'idle'
  | 'running'
  | 'paused'
  | 'finished'

interface Props {
  titulo?: string
  status: StatusTimer
  tempoAlvo?: number
}

const props = withDefaults(defineProps<Props>(), {
  titulo: 'Timer',
  tempoAlvo: 0
})

const segundos = ref(0)

let intervalo: ReturnType<typeof setInterval> | null = null

function iniciar() {
  if (intervalo) {
    return
  }

  intervalo = setInterval(() => {
    console.log(props.titulo)
    if (props.titulo === 'Exercício' && props.tempoAlvo && segundos.value >= props.tempoAlvo) {
      emitSom();
      finalizar();
      return;
    }
    segundos.value++
  }, 1000)
}

function pausar() {
  if (intervalo) {
    clearInterval(intervalo)
    intervalo = null
  }
  segundos.value = 0
}

function finalizar() {
  pausar()
  segundos.value = 0
}

function emitSom() {
  const audio = new Audio('src/assets/beep.wav');
  audio.play().catch((erro) => {
    console.error(erro)
  })
}

watch(
  () => props.status,
  (novoStatus) => {
    switch (novoStatus) {
      case 'running':
        iniciar()
        break

      case 'paused':
        pausar()
        break

      case 'finished':
        finalizar()
        break
    }
  },
  {
    immediate: true
  }
)

const tempoFormatado = computed(() => {
  const horas = Math.floor(segundos.value / 3600)
  const minutos = Math.floor((segundos.value % 3600) / 60)
  const secs = segundos.value % 60

  return [horas, minutos, secs]
    .map((v) => String(v).padStart(2, '0'))
    .join(':')
})

const progresso = computed(() => {
  if (!props.tempoAlvo) {
    return 0
  }

  return Math.min(segundos.value / props.tempoAlvo, 1)
})


onBeforeUnmount(() => {
  pausar()
})
</script>

<template>
  <q-card class="timer-card text-blue">
    <q-card-section class="text-center zero-padding">

      <div class="text-h4 text-weight-bold q-mt-sm">
        {{ tempoFormatado }}
      </div>

      <q-linear-progress v-if="tempoAlvo > 0" class="q-mt-md" rounded size="10px" :value="progresso" />

      <q-card-actions align="center" v-if="tempoAlvo > 0">
        <q-btn dense round color="positive" icon="play_arrow" @click="iniciar" />
        <q-btn dense round color="negative" text-color="black" icon="stop" @click="pausar" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.timer-card {
  border-radius: 16px;
  box-shadow: none !important;
}

.zero-padding {
  padding: 0 !important;
}
</style>