<template>
  <div class="week-strip">
    <div v-for="(day, idx) in diasSemana" :key="idx" class="day-pill"
      :class="{ active: selectedDay === idx, rest: day.isRest }" @click="selectedDay = idx">
      <span class="day-abbr">{{ day.abbr }}</span>
      <span class="day-num">{{ day.num }}</span>
      <span class="day-dot"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import type { PlanoTreinoDia } from '../../types/Exercicios';

export default {
  name: 'WeekPills',
  setup() {
    const title = 'Visualizar Treino';
    const diasSemana = ref<PlanoTreinoDia[]>([]);
    const today = new Date();
    const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
    return {
      title,
      diasSemana,
      selectedDay: ref(todayIdx)
    };
  },
  props: {
    treinoSemana: {
      type: Array as () => PlanoTreinoDia[],
      required: true
    }
  },
  watch: {
    treinoSemana: {
      handler(newVal) {
        this.diasSemana = newVal;
      },
      immediate: true
    },
    selectedDay: {
      handler(newVal) {
        this.diasSemana.filter((_, idx) => idx === newVal).forEach(day => {
          this.$emit('update:selectedDay', day);
        });
      }
    }
  },
  mounted() {
    this.fetchDiasSemana();
  },
  methods: {
    fetchDiasSemana() {
      const hoje = new Date()

      const diaSemana = hoje.getDay()
      const diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana

      const segunda = new Date(hoje)
      segunda.setDate(hoje.getDate() + diffSegunda)

      const nomes = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

      nomes.forEach((nome, index) => {
        const data = new Date(segunda)
        data.setDate(segunda.getDate() + index)
        this.diasSemana.push({
          id: 0,
          planoId: 0,
          abbr: nome,
          num: data.getDate(),
          diaSemana: index,
          isRest: false,
          treinoId: null,
          treino: null
        });
      });
    }
  },
}
</script>
<style scoped>
.week-strip {
  background: var(--ink);
  padding: 0 24px 20px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.week-strip::-webkit-scrollbar {
  display: none;
}

.day-pill {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.07);
  border: 1.5px solid transparent;
  min-width: 56px;
}

.day-pill:hover {
  background: rgba(255, 255, 255, 0.13);
}

.day-pill.active {
  background: var(--brand);
  border-color: var(--brand);
}

.day-pill.rest {
  opacity: 0.5;
}

.day-abbr {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.day-pill.active .day-abbr {
  color: rgba(255, 255, 255, 0.8);
}

.day-num {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.day-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--brand);
}

.day-pill.active .day-dot {
  background: rgba(255, 255, 255, 0.6);
}

.day-pill.rest .day-dot {
  background: rgba(255, 255, 255, 0.2);
}
</style>