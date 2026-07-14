# Variáveis de ambiente

Guia de configuração segura para desenvolvimento e deploy do **site adesivos**.

## Arquivos

| Arquivo | Commitar no Git? | Função |
|---------|------------------|--------|
| `.env.example` | ✅ Sim | Template sem segredos — referência para o time |
| `.env` | ❌ **Nunca** | Valores reais da sua máquina (já está no `.gitignore`) |

## Variáveis

### Supabase (front-end)

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` | URL da API do projeto (ex.: `https://xxxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Chave **publishable** ou **anon** — segura no browser com RLS ativo |

> ⚠️ **Nunca** use `service_role` no front-end. Ela ignora Row Level Security.

### App

| Variável | Descrição |
|----------|-----------|
| `VITE_APP_ENV` | `development`, `staging` ou `production` |

## Setup local

1. Copie o template:
   ```powershell
   copy .env.example .env
   ```
2. Preencha com os valores do [Supabase Dashboard](https://supabase.com/dashboard) → **Project Settings → API**.
3. Reinicie o servidor de dev após alterar o `.env`:
   ```powershell
   pnpm run dev
   ```

## Uso no código (Vite + React)

Variáveis expostas ao client **devem** ter prefixo `VITE_`:

```ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

Tipos em `src/vite-env.d.ts`.

## Produção (Vercel / GitHub Actions)

Configure as mesmas variáveis no painel do provedor — **não** commite o `.env`:

- **Vercel:** Project → Settings → Environment Variables
- **GitHub Actions:** Repository → Settings → Secrets and variables → Actions

Use `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em **Production**, **Preview** e **Development**.

## Segurança

1. `.env` está no `.gitignore` — verifique com `git status` antes de cada commit.
2. Se uma chave vazar (chat, commit acidental, screenshot), **rotacione** em Supabase → API → regenerate key.
3. Ative **Row Level Security (RLS)** em todas as tabelas públicas.
4. Tokens de MCP, GitHub PAT e service role ficam **fora** deste repositório.

## Google OAuth (admin)

Login do painel `/admin` usa **Google via Supabase Auth**. O OAuth do Google é gratuito.

### 1. Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**.
2. Crie um projeto (ou use um existente).
3. **Create Credentials → OAuth client ID → Web application**.
4. **Authorized redirect URIs** (obrigatório):
   ```
   https://mixnbxudvtwspsfthimg.supabase.co/auth/v1/callback
   ```
5. Copie **Client ID** e **Client Secret**.

### 2. Supabase Dashboard

1. **Authentication → Providers → Google** → ativar e colar Client ID + Secret.
2. **Authentication → URL Configuration**:
   - **Site URL:** `http://localhost:5173` (dev) ou URL da Vercel (prod)
   - **Redirect URLs:** inclua `http://localhost:5173/**` e `https://seu-dominio.vercel.app/**`

### 3. Conta admin

O e-mail `raissabarros@alu.ufc.br` recebe role `admin` automaticamente no primeiro login (trigger `handle_new_user`).

## Checklist antes do primeiro push

- [ ] `.env` **não** aparece em `git status`
- [ ] `.env.example` está commitado
- [ ] Variáveis configuradas na Vercel (se for deploy)
- [ ] RLS revisado no Supabase (`get_advisors` via MCP ou Dashboard)
