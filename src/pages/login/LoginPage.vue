<template>
  <div class="login-page">

    <div class="login-overlay" />

    <q-card class="login-card">

      <q-card-section class="text-center">
        <div class="text-h3 text-weight-light text-white">
          GYM<span class="text-orange">.</span>FLOW
        </div>

        <div class="text-subtitle2 text-grey-5 q-mt-sm">
          Controle seus treinos de forma inteligente
        </div>
      </q-card-section>

      <q-separator dark class="q-my-md" />

      <q-tabs
        v-model="tab"
        dense
        align="justify"
        active-color="orange"
        indicator-color="orange"
        class="text-grey-5"
      >
        <q-tab name="login" label="Login" />
        <q-tab name="cadastro" label="Cadastro" />
      </q-tabs>

      <q-tab-panels
        v-model="tab"
        animated
        class="bg-transparent"
      >

        <!-- LOGIN -->
        <q-tab-panel name="login">

          <q-form
            class="column q-gutter-md"
            @submit.prevent="realizarLogin"
          >

            <q-input
              v-model="login.usuario"
              dark
              outlined
              label="Usuário"
              color="orange"
              lazy-rules
              :rules="[ val => !!val || 'Informe o usuário' ]"
            >
              <template #prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <q-input
              v-model="login.senha"
              dark
              outlined
              :type="mostrarSenha ? 'text' : 'password'"
              label="Senha"
              color="orange"
              lazy-rules
              :rules="[ val => !!val || 'Informe a senha' ]"
            >
              <template #prepend>
                <q-icon name="lock" />
              </template>

              <template #append>
                <q-icon
                  :name="mostrarSenha ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="mostrarSenha = !mostrarSenha"
                />
              </template>
            </q-input>

            <q-btn
              unelevated
              color="orange"
              text-color="black"
              label="Entrar"
              type="submit"
              class="full-width login-btn"
              :loading="loadingLogin"
            />

          </q-form>

        </q-tab-panel>

        <!-- CADASTRO -->
        <q-tab-panel name="cadastro">

          <q-form
            class="column q-gutter-md"
            @submit.prevent="realizarCadastro"
          >

            <q-input
              v-model="register.nome"
              dark
              outlined
              label="Nome"
              color="orange"
              lazy-rules
              :rules="[ val => !!val || 'Preencha o nome' ]"
            />

            <q-input
              v-model="register.usuario"
              dark
              outlined
              label="Usuário"
              color="orange"
              lazy-rules
              :rules="[ val => !!val || 'Preencha o usuário' ]"
            />

            <q-input
              v-model="register.email"
              dark
              outlined
              type="email"
              label="E-mail"
              color="orange"
              lazy-rules
              :rules="[ val => !!val || 'Preencha o e-mail' ]"
            />

            <q-input
              v-model="register.senha"
              dark
              outlined
              :type="mostrarSenhaCadastro ? 'text' : 'password'"
              label="Senha"
              color="orange"
              lazy-rules
              :rules="[ val => !!val || 'Preencha a senha' ]"
            >
              <template #append>
                <q-icon
                  :name="mostrarSenhaCadastro ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="mostrarSenhaCadastro = !mostrarSenhaCadastro"
                />
              </template>
            </q-input>

            <div class="row q-col-gutter-sm">

              <div class="col">
                <q-input
                  v-model.number="register.peso"
                  dark
                  outlined
                  type="number"
                  label="Peso"
                  color="orange"
                  lazy-rules
                  :rules="[ val => !!val || 'Preencha o peso' ]"
                />
              </div>

              <div class="col">
                <q-input
                  v-model.number="register.altura"
                  dark
                  outlined
                  type="number"
                  label="Altura"
                  color="orange"
                  lazy-rules
                  :rules="[ val => !!val || 'Preencha a altura' ]"
                />
              </div>

            </div>

            <q-input
              v-model="register.celular"
              dark
              outlined
              label="Celular"
              color="orange"
              mask="(##) #####-####"
              lazy-rules
              :rules="[ val => val?.replace(/\D/g, '').length >= 11 || 'Número de celular inválido' ]"
            />

            <q-btn
              unelevated
              color="orange"
              text-color="black"
              label="Criar conta"
              type="submit"
              class="full-width login-btn"
              :loading="loadingCadastro"
            />

          </q-form>

        </q-tab-panel>

      </q-tab-panels>

    </q-card>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LoginService } from '../../services/LoginService'
import { useAuthStore } from '../../stores/auth'
import type { LoginDTO, RegisterDTO } from '../../types/Usuario'
import { useNotify } from '../../utils/NotificacaoUtils';

const router = useRouter()
let authStore: ReturnType<typeof useAuthStore> | null = null
const notify = useNotify()
const tab = ref('login')
const loadingLogin = ref(false)
const loadingCadastro = ref(false)

const mostrarSenha = ref(false)
const mostrarSenhaCadastro = ref(false)

const login: LoginDTO = reactive({
  usuario: '',
  senha: ''
})

const register: RegisterDTO = reactive({
  nome: '',
  usuario: '',
  email: '',
  senha: '',
  celular: '',
  altura: 0,
  peso: 0
})

onMounted(() => {
  authStore = useAuthStore()
})
async function realizarLogin() {
  try {
    loadingLogin.value = true

    // Validações básicas
    if (!login.usuario || login.usuario.trim() === '') {
      notify.error('Informe o usuário')
      return
    }

    if (!login.senha || login.senha.trim() === '') {
      notify.error('Informe a senha')
      return
    }

    if (login.senha.length < 6) {
      notify.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    const response = await new LoginService().login(login)
    
    if (response.data?.data?.token) {
      // Salva o token no auth store
      authStore?.setToken(response.data.data.token)
      
      // Limpa os campos
      login.usuario = ''
      login.senha = ''
      
      notify.success('Login realizado com sucesso!')
      
      // Redireciona para home usando router
      await router.push('/')
    } else {
      notify.error('Erro ao realizar login! Token não recebido.')
    }
    
  } catch (error: unknown) {
    console.error('Erro ao realizar login:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro ao realizar login! Por favor, verifique suas credenciais.'
    notify.error(errorMessage)
  } finally {
    loadingLogin.value = false
  }
}

async function realizarCadastro() {
  try {
    loadingCadastro.value = true

    // Validações básicas
    if (!register.nome || register.nome.trim() === '') {
      notify.error('Preencha o nome')
      return
    }

    if (!register.usuario || register.usuario.trim() === '') {
      notify.error('Preencha o usuário')
      return
    }

    if (register.usuario.length < 3) {
      notify.error('O usuário deve ter no mínimo 3 caracteres')
      return
    }

    if (!register.email || register.email.trim() === '') {
      notify.error('Preencha o e-mail')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(register.email)) {
      notify.error('E-mail inválido')
      return
    }

    if (!register.senha || register.senha.trim() === '') {
      notify.error('Preencha a senha')
      return
    }

    if (register.senha.length < 6) {
      notify.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    if (!register.peso || register.peso <= 0) {
      notify.error('Informe um peso válido')
      return
    }

    if (!register.altura || register.altura <= 0) {
      notify.error('Informe uma altura válida')
      return
    }

    if (register.celular) {
      const telefoneLimpo = register.celular.replace(/\D/g, '')
      if (telefoneLimpo.length !== 11) {
        notify.error('Número de celular inválido (deve ter 11 dígitos)')
        return
      }
    }

    await new LoginService().register(register)

    // Limpa os campos
    register.nome = ''
    register.usuario = ''
    register.email = ''
    register.senha = ''
    register.peso = 0
    register.altura = 0
    register.celular = ''

    notify.success('Cadastro realizado com sucesso! Faça login para continuar.')
    tab.value = 'login'

  } catch (error: unknown) {
    console.error('Erro ao realizar cadastro:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro ao realizar cadastro! Por favor, verifique os dados e tente novamente.'
    notify.error(errorMessage)
  } finally {
    loadingCadastro.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background:
    linear-gradient(
      135deg,
      #0f0f10 0%,
      #1a1b1f 100%
    );

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.login-overlay {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at top right,
      rgba(255, 115, 0, 0.12),
      transparent 35%
    );
}

.login-card {
  width: 100%;
  max-width: 480px;

  background: rgba(20, 20, 22, 0.96);

  border-radius: 24px;

  backdrop-filter: blur(12px);

  border: 1px solid rgba(255,255,255,0.06);

  box-shadow:
    0 10px 40px rgba(0,0,0,0.45);

  z-index: 2;
}

.login-btn {
  height: 52px;

  border-radius: 14px;

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 1px;
}
</style>
