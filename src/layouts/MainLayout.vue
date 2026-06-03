<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="logo">GYM<span class="logo-dot">.</span>FLOW</div>
        </q-toolbar-title>

        <q-btn flat dense round icon="logout" aria-label="Sair" @click="realizarLogout">
          <q-tooltip>Sair</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" elevated @mouseleave="leftDrawerOpen = false" :width="300" :breakpoint="500"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
      <q-list>

        <AppMenuItem v-for="link in linksList" :key="link.title" v-bind="link" />

        <q-separator class="q-my-md" />

        <AppMenuItem title="Sair" caption="Sair do sistema" icon="logout" @click="realizarLogout" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="text-center">
      &copy; 2024 GYM.FLOW - All rights reserved.
      <div>v{{ version }}</div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AppMenuItem, { type AppMenuItemProps } from 'components/menu/AppMenuItem.vue';
import { useNotify } from '../utils/NotificacaoUtils';
import packageJson from '../../package.json'
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const notify = useNotify();
const version = packageJson.version;

const linksList: AppMenuItemProps[] = [
  {
    title: 'Visualizar Treino',
    caption: 'treino diario',
    icon: 'on_device_training',
    to: '/visualizarTreinos',
  },
  {
    title: 'Gerenciar Exercicios',
    caption: 'criar e editar exercicios',
    icon: 'fitness_center',
    to: '/gerenciarExercicios',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function realizarLogout() {
  $q.dialog({
    title: 'Confirmação',
    message: 'Tem certeza que deseja sair?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void logout();
  });
}
function logout() {
  authStore.clearToken();
  leftDrawerOpen.value = false;
  notify.success('Você foi desconectado!');
  void router.push('/login');
}
</script>
