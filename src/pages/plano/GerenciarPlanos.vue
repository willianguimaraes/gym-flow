<template>
  <q-page class="page-bg">

    <!-- HEADER -->
    <div class="page-header">
      <div class="header-content">
        <div>
          <div class="page-eyebrow">Módulo de Treinos</div>
          <h1 class="page-title">Planos de Treino</h1>
        </div>
        <q-btn class="btn-novo" unelevated @click="router.push('/cadastrarPlano')">
          <q-icon name="add" size="18px" class="q-mr-xs" />
          Novo Plano
        </q-btn>
      </div>
    </div>

    <!-- PLANO ATIVO -->
    <div class="section-wrapper" v-if="planoAtivo">
      <div class="section-label">PLANO ATIVO</div>
      <div class="plano-ativo-card">
        <div class="ativo-header">
          <div>
            <div class="ativo-badge">● Ativo agora</div>
            <div class="ativo-nome">{{ planoAtivo.nome }}</div>
            <div class="ativo-desc" v-if="planoAtivo.descricao">{{ planoAtivo.descricao }}</div>
          </div>
          <button class="btn-icon-edit" @click="router.push(`/cadastrarPlano/${planoAtivo.id}`)">
            <q-icon name="edit" size="18px" />
          </button>
        </div>

        <div class="ativo-info-row">
          <div class="ativo-info-item">
            <q-icon name="calendar_today" size="14px" />
            <span>Desde {{ formatarData(planoAtivo.inicioEm) }}</span>
          </div>
          <div class="ativo-info-item" v-if="planoAtivo.fimEm">
            <q-icon name="event" size="14px" />
            <span>Até {{ formatarData(planoAtivo.fimEm) }}</span>
          </div>
        </div>

        <!-- SEMANA DO PLANO ATIVO -->
        <div class="semana-grid">
          <div v-for="dia in planoAtivo.dias" :key="dia.diaSemana" class="semana-dia"
            :class="{ rest: dia.isRest, hoje: diaHoje === dia.diaSemana }">
            <div class="semana-dia-abbr">{{ abbrDia(dia.diaSemana) }}</div>
            <div class="semana-dia-treino" v-if="!dia.isRest && dia.treino">
              <div class="semana-dia-dot" :style="{ background: dia.treino.color }"></div>
              <span>{{ dia.treino.name }}</span>
            </div>
            <div class="semana-dia-rest" v-else>
              <q-icon name="hotel" size="12px" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HISTÓRICO -->
    <div class="section-wrapper">
      <div class="section-label">HISTÓRICO DE PLANOS</div>

      <div v-if="historico.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-title">Nenhum plano anterior</div>
        <div class="empty-sub">Crie seu primeiro plano de treino</div>
      </div>

      <div v-for="(plano, idx) in historico" :key="idx" class="plano-card">
        <div class="plano-card-header">
          <div class="plano-card-left">
            <div class="plano-card-nome">{{ plano.nome }}</div>
            <div class="plano-card-periodo">
              {{ formatarData(plano.inicioEm) }}
              <span> → {{ verificaData(plano) }}</span>
            </div>
          </div>
          <div class="plano-status-badge" :class="plano.ativo ? 'ativo' : 'encerrado'">
            {{ plano.ativo ? 'Ativo' : 'Encerrado' }}
          </div>
        </div>

        <!-- MINI SEMANA -->
        <div class="mini-semana">
          <div v-for="dia in plano.dias" :key="dia.diaSemana" class="mini-dia" :class="{ rest: dia.isRest }"
            :title="dia.isRest ? 'Descanso' : dia.treino?.name">
            <div class="mini-dia-abbr">{{ abbrDia(dia.diaSemana) }}</div>
            <div class="mini-dia-bar"
              :style="{ background: dia.isRest ? '#e5e5e5' : (dia.treino?.color || '#e5e5e5') }"></div>
          </div>
        </div>

        <div class="plano-card-actions">
          <button class="btn-action btn-ver" @click="verPlano(plano)">
            <q-icon name="visibility" size="14px" />
            Ver detalhes
          </button>
          <button v-if="!plano.ativo" class="btn-action btn-editar" @click="router.push(`/cadastrarPlano/${plano.id}`)">
            <q-icon name="edit" size="14px" />
            Editar
          </button>
          <button v-if="!plano.ativo" class="btn-action btn-excluir" @click="confirmarExclusao(plano)">
            <q-icon name="delete" size="14px" />
          </button>
        </div>
      </div>
    </div>

    <!-- DIALOG VER DETALHES -->
    <q-dialog v-model="dialogVer" position="bottom">
      <q-card class="dialog-card" v-if="planoSelecionado">
        <div class="dialog-header">
          <div>
            <div class="dialog-eyebrow">Plano de Treino</div>
            <div class="dialog-title">{{ planoSelecionado.nome }}</div>
            <div class="dialog-periodo">
              {{ formatarData(planoSelecionado.inicioEm) }}
              <span v-if="planoSelecionado.fimEm"> → {{ formatarData(planoSelecionado.fimEm) }}</span>
            </div>
          </div>
          <button class="dialog-close" @click="dialogVer = false">✕</button>
        </div>

        <div class="dialog-dias">
          <div v-for="dia in planoSelecionado.dias" :key="dia.diaSemana" class="dialog-dia-item"
            :class="{ rest: dia.isRest }">
            <div class="dialog-dia-label">{{ nomeDia(dia.diaSemana) }}</div>
            <div class="dialog-dia-treino" v-if="!dia.isRest && dia.treino">
              <div class="dialog-dia-dot" :style="{ background: dia.treino.color }"></div>
              <div>
                <div class="dialog-dia-nome">{{ dia.treino.name }}</div>
                <div class="dialog-dia-meta">
                  {{ dia.treino.duration }}min · {{ dia.treino.exercises?.length || 0 }} exerc.
                </div>
              </div>
            </div>
            <div class="dialog-dia-rest" v-else>
              <q-icon name="hotel" size="16px" color="grey-4" />
              <span>Descanso</span>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- DIALOG EXCLUIR -->
    <q-dialog v-model="dialogExcluir">
      <q-card class="dialog-confirm">
        <div class="confirm-icon">⚠️</div>
        <div class="confirm-title">Excluir plano?</div>
        <div class="confirm-sub">
          <strong>{{ planoParaExcluir?.nome }}</strong> será removido permanentemente.
        </div>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="dialogExcluir = false">Cancelar</button>
          <button class="btn-confirm-delete" @click="excluirPlano">Excluir</button>
        </div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import PlanosService from 'src/services/PlanosService';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotify } from 'src/utils/NotificacaoUtils';
import type { PlanoTreino } from 'src/types/Exercicios';

const notify = useNotify();
const router = useRouter();
const diaHoje = new Date().getDay();

const planos = ref<PlanoTreino[]>([]);

const planoAtivo = computed(() => planos.value.find(p => p.ativo) ?? null);
const historico = computed(() => [...planos.value].sort(
  (a, b) => new Date(b.inicioEm).getTime() - new Date(a.inicioEm).getTime()
));

// ── HELPERS ──────────────────────────────────────────────────
const abbrsDia = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const nomesDia = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const abbrDia = (d: number) => abbrsDia[d];
const nomeDia = (d: number) => nomesDia[d];

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── DIALOGS ──────────────────────────────────────────────────
const dialogVer = ref(false);
const dialogExcluir = ref(false);
const planoSelecionado = ref<PlanoTreino | null>(null);
const planoParaExcluir = ref<PlanoTreino | null>(null);

function verPlano(plano: PlanoTreino) {
  planoSelecionado.value = plano;
  dialogVer.value = true;
}

function confirmarExclusao(plano: PlanoTreino) {
  planoParaExcluir.value = plano;
  dialogExcluir.value = true;
}

function excluirPlano() {
  if (!planoParaExcluir.value) return;
  console.log('TODO: DELETE /api/planos/', planoParaExcluir.value.id);
  planos.value = planos.value.filter(p => p.id !== planoParaExcluir.value!.id);
  dialogExcluir.value = false;
}

function buscarPlanos() {
  PlanosService.getPlanos().then(response => {
    planos.value = response.data.data || []
    console.log(planos.value)
  }).catch(error => {
    console.error('Erro ao buscar Planos', error);
    notify.error('Erro ao buscar Planos.')
  })
}

function verificaData(plano: PlanoTreino): string {
  const hoje = new Date();
  const dataInicio = new Date(plano.inicioEm);
  const dataFim = plano.fimEm ? new Date(plano.fimEm) : null;
  console.log(dataInicio)
  if (dataFim && dataFim < hoje) return 'Encerrado';
  if (dataInicio > hoje) return 'Início em breve';
  return 'Em andamento';
}

onMounted(() => {
  buscarPlanos();
});
</script>

<style scoped>
.page-bg {
  background: #F5F5F4;
  min-height: 100vh;
}

.page-header {
  background: #1A1A1A;
  padding: 24px 16px 20px;
}

.header-content {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.page-eyebrow {
  font-size: 10px;
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

.section-wrapper {
  padding: 16px 16px 0;
}

.section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #bbb;
  margin-bottom: 10px;
}

/* PLANO ATIVO */
.plano-ativo-card {
  background: #1A1A1A;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 8px;
}

.ativo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.ativo-badge {
  font-size: 11px;
  font-weight: 700;
  color: #4CAF50;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.ativo-nome {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 26px;
  letter-spacing: 1px;
  color: #fff;
  line-height: 1;
}

.ativo-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 4px;
}

.btn-icon-edit {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.ativo-info-row {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
}

.ativo-info-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

/* SEMANA GRID */
.semana-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.semana-dia {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 8px 4px;
  text-align: center;
}

.semana-dia.hoje {
  background: rgba(232, 93, 4, 0.25);
  border: 1px solid rgba(232, 93, 4, 0.4);
}

.semana-dia.rest {
  opacity: 0.4;
}

.semana-dia-abbr {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  margin-bottom: 5px;
}

.semana-dia-treino {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.semana-dia-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.semana-dia-treino span {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.semana-dia-rest {
  color: rgba(255, 255, 255, 0.2);
}

/* PLANO CARD */
.plano-card {
  background: #fff;
  border-radius: 14px;
  border: 1.5px solid rgba(0, 0, 0, 0.07);
  padding: 14px;
  margin-bottom: 10px;
}

.plano-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.plano-card-nome {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  letter-spacing: 0.5px;
  color: #1A1A1A;
  line-height: 1;
}

.plano-card-periodo {
  font-size: 11px;
  color: #999;
  margin-top: 3px;
}

.plano-status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 50px;
  flex-shrink: 0;
}

.plano-status-badge.ativo {
  background: #E8F5E9;
  color: #388E3C;
}

.plano-status-badge.encerrado {
  background: #F5F5F5;
  color: #9E9E9E;
}

/* MINI SEMANA */
.mini-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: 12px;
}

.mini-dia {
  text-align: center;
}

.mini-dia-abbr {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #bbb;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.mini-dia-bar {
  height: 4px;
  border-radius: 2px;
}

.plano-card-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 8px;
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

.btn-editar {
  flex: 1;
  background: #1A1A1A;
  color: #fff;
  justify-content: center;
}

.btn-excluir {
  background: #FFF0F0;
  color: #E53935;
  padding: 8px 10px;
}

/* EMPTY */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.empty-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  color: #aaa;
  margin-bottom: 4px;
}

.empty-sub {
  font-size: 12px;
  color: #bbb;
}

/* DIALOG VER */
.dialog-card {
  width: 100%;
  max-width: 600px;
  border-radius: 20px 20px 0 0 !important;
  max-height: 85vh;
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 18px 16px;
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
  font-size: 32px;
  letter-spacing: 1px;
  color: #1A1A1A;
  line-height: 1;
  margin-bottom: 4px;
}

.dialog-periodo {
  font-size: 12px;
  color: #999;
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

.dialog-dias {
  padding: 12px 18px 20px;
}

.dialog-dia-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  gap: 14px;
}

.dialog-dia-item:last-child {
  border-bottom: none;
}

.dialog-dia-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #bbb;
  width: 32px;
  flex-shrink: 0;
}

.dialog-dia-treino {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.dialog-dia-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dialog-dia-nome {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
}

.dialog-dia-meta {
  font-size: 11px;
  color: #999;
  margin-top: 1px;
}

.dialog-dia-rest {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #bbb;
  flex: 1;
}

/* CONFIRM */
.dialog-confirm {
  width: 300px;
  border-radius: 20px !important;
  padding: 24px 20px 18px;
  text-align: center;
}

.confirm-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.confirm-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.confirm-sub {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 18px;
}

.confirm-actions {
  display: flex;
  gap: 8px;
}

.btn-cancel {
  flex: 1;
  padding: 11px;
  border-radius: 10px;
  border: 1.5px solid rgba(0, 0, 0, 0.12);
  background: transparent;
  font-size: 13px;
  font-weight: 700;
  color: #555;
  cursor: pointer;
}

.btn-confirm-delete {
  flex: 1;
  padding: 11px;
  border-radius: 10px;
  border: none;
  background: #E53935;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
</style>