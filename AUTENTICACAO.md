# 🔐 Guia de Autenticação - Gym Work

## Resumo da Implementação

Implementei um sistema completo de autenticação com:
- ✅ **Token JWT** armazenado em localStorage
- ✅ **Pinia Store** para gerenciar estado de autenticação
- ✅ **Router Guards** para proteger rotas
- ✅ **Validações** aprimoradas no login e cadastro
- ✅ **Logout** com limpeza de dados
- ✅ **Interceptor Axios** que adiciona token automaticamente

---

## 📁 Arquivos Criados

### Stores
- **`src/stores/auth.ts`** - Pinia store para gerenciar autenticação

### Boot
- **`src/boot/pinia.ts`** - Inicializa Pinia no app

### Router
- **`src/router/guards.ts`** - Guards de proteção de rotas
- **`src/router/types.d.ts`** - Tipos para meta de rotas

### Services
- **`src/services/AuthStorageService.ts`** - Gerencia localStorage de token

### Types
- **`src/types/LoginResponse.ts`** - Interface de resposta de login

---

## 📋 Alterações em Arquivos Existentes

### 1. **LoginPage.vue**
- ✅ Adiciona validações robustas (email, senha mínima, etc)
- ✅ Salva token via `authStore.setToken()`
- ✅ Usa `router.push()` em vez de `window.location.href`
- ✅ Mensagens de erro detalhadas

### 2. **MainLayout.vue**
- ✅ Botão "Logout" na toolbar
- ✅ Item "Sair" no menu lateral
- ✅ Função `realizarLogout()` que limpa token

### 3. **router/index.ts**
- ✅ Integra router guards

### 4. **router/routes.ts**
- ✅ Marca rotas com `meta: { requiresAuth: true/false }`
- ✅ Rota `/` agora requer autenticação

### 5. **services/LoginService.ts**
- ✅ Tipo de retorno agora inclui `LoginResponse`

### 6. **services/service.ts** (já estava)
- ✅ Interceptor que adiciona `Authorization: Bearer {token}`
- ✅ Detecta 401 e redireciona para login

---

## 🚀 Como Usar

### Login
```typescript
// Automático! O LoginPage.vue já faz tudo:
// 1. Valida campos
// 2. Faz requisição POST /api/auth/login
// 3. Recebe token na resposta
// 4. Salva via authStore.setToken()
// 5. Redireciona para home
```

### Verificar Status de Login
```typescript
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Usa diretamente em templates:
// v-if="authStore.isLoggedIn"

// Ou em script:
if (authStore.isLoggedIn) {
  console.log('Usuário logado!')
  console.log('Token:', authStore.token)
}
</script>
```

### Logout
```typescript
// No MainLayout, já está implementado!
// Clique no botão "Sair" ou use:

function logout() {
  authStore.clearToken()
  router.push('/login')
}
```

### Proteger uma Nova Rota
```typescript
// Em src/router/routes.ts:

{
  path: '/meu-treino',
  component: () => import('pages/MeuTreino.vue'),
  meta: { requiresAuth: true }  // 👈 Adicione isto!
}
```

### Acessar Token em Componentes
```typescript
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// O token é adicionado automaticamente em todas as requisições!
// Mas se precisar manualmente:
const token = authStore.token
</script>
```

---

## 🔄 Fluxo de Autenticação

```
┌─────────────────────────────────────────┐
│  1. Usuário acessa /login               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  2. Preenche usuário e senha            │
│     (Validações verificam campos)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  3. POST /api/auth/login                │
│     Interceptor adiciona headers        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  4. Servidor retorna: { token, user }   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  5. authStore.setToken(token)           │
│     Salva em localStorage               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  6. router.push('/')                    │
│     Redireciona para home               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  7. Guard valida rota protegida ✅      │
│     Página renderiza                    │
└─────────────────────────────────────────┘
```

---

## 🛡️ Proteção de Rotas

### O que Acontece Em Cada Cenário:

| Cenário | Resultado |
|---------|-----------|
| **Logado + Acessa `/`** | ✅ Rota protegida liberada |
| **Não logado + Acessa `/`** | ❌ Redireciona para `/login` |
| **Logado + Acessa `/login`** | ⏩ Redireciona para `/` |
| **Não logado + Acessa `/login`** | ✅ Exibe login |
| **Token inválido (401)** | ❌ Limpa token e redireciona para `/login` |

---

## 📱 Estrutura de Dados

### Token no localStorage
```javascript
localStorage.getItem('token')
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Response de Login (esperado do servidor)
```typescript
{
  data: {
    token: "jwt_token_aqui",
    user: {
      id: 1,
      usuario: "willian",
      email: "willian@example.com"
    }
  }
}
```

---

## ⚠️ Importante: Configuração do Servidor

Seu servidor (`gym-flow-api`) deve retornar o token assim:

```typescript
// POST /api/auth/login
res.json({
  data: {
    token: "seu_jwt_token",
    user: { id, usuario, email }
  }
})

// POST /api/auth/register
res.json({
  data: null
})
```

---

## 🔧 Troubleshooting

### "Token não está sendo enviado nas requisições"
- Verifique se está salvo: `localStorage.getItem('token')`
- O interceptor em `service.ts` adiciona automaticamente
- Certifique-se de usar a classe `Service` base

### "Guard não está redirecionando"
- Certifique-se de ter `meta: { requiresAuth: true }` na rota
- Verifique console para erros
- Limpe localStorage e tente novamente

### "Não consegue fazer login"
- Verifique se servidor retorna `{ data: { token: "..." } }`
- Verifique resposta no Network tab do DevTools
- Certifique-se que endpoint é `/api/auth/login`

---

## ✨ Próximos Passos (Opcional)

1. **Refresh Token**: Implementar token de refresh para renovar sessão
2. **Perfis/Roles**: Adicionar autorização por tipo de usuário
3. **Check Auth on Mount**: Validar token ao carregar app
4. **Loading State**: Mostrar loading enquanto valida autenticação

---

**Tudo pronto para usar! 🎉**
