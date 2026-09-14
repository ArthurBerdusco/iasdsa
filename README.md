# Boletim IASD Santo Amaro

Boletim informativo semanal da Igreja Adventista do Sétimo Dia de Santo Amaro — Next.js (App Router) + Neon Postgres + Vercel Blob + NextAuth.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Neon Postgres** — banco de dados serverless
- **Vercel Blob** — armazenamento de imagens, artes e vídeos
- **NextAuth v5** — autenticação do admin (credenciais + Google, opcional)
- **Tailwind CSS v4** — estilização via tokens de tema (CSS variables)
- **Framer Motion / Swiper** — animações e carrosséis

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha com suas credenciais reais
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Banco de dados

Este projeto não tinha um schema versionado — agora existe em `db/schema.sql`
(idempotente, pode rodar em qualquer ambiente):

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Para um banco de produção já existente, rode apenas a migração incremental
com as tabelas novas (arquivo histórico de boletins + configurações do site):

```bash
psql "$DATABASE_URL" -f db/migrations/001_boletins_e_configuracoes_site.sql
```

## Estrutura do projeto

```
src/app/
  components/
    ui/              -> Kit de UI público (Container, Button, Badge, Card, SectionHeader)
    admin/ui/         -> Kit de UI do admin (AdminPageHeader, AdminCard, ToggleSwitch, EmptyState)
  lib/db/            -> Camada de acesso a dados (uma função por entidade, sem ORM)
  api/               -> Rotas de API (App Router route handlers)
  admin/             -> Telas do backoffice (protegidas por middleware + NextAuth)
  boletins/          -> Páginas públicas do arquivo histórico de boletins
db/
  schema.sql         -> Schema completo do banco
  migrations/        -> Migrações incrementais
```

## Registro semanal (boletins anteriores)

A home (`/`) sempre reflete os dados **atuais** de cultos, anúncios e mensagem
pastoral — são tabelas que o admin sobrescreve a cada semana. Antes de
sobrescrever, o conteúdo pode (e deve) ser arquivado:

- **Manualmente**: painel `/admin/boletins` → botão "Arquivar semana atual".
- **Automaticamente**: um Vercel Cron (`vercel.json`) chama
  `/api/boletins/auto-archive` toda segunda-feira de madrugada, arquivando a
  semana que acabou de terminar. Esse endpoint é protegido pela variável de
  ambiente `CRON_SECRET`.

O conteúdo arquivado fica salvo como um snapshot (JSON) em
`boletins_semanais` e pode ser consultado publicamente em `/boletins`
(lista) e `/boletins/[semana]` (detalhe de uma semana específica).

## Vídeo institucional

Configurável em `/admin/hero`: upload do vídeo (mp4) e de uma imagem de capa
(poster), ambos salvos no Vercel Blob. Enquanto nenhum vídeo for cadastrado,
a home exibe um gradiente com o título/subtítulo configurados, sem quebrar o
layout.

## Variáveis de ambiente

Veja `.env.example` para a lista completa e comentada. Resumo:

| Variável | Uso |
|---|---|
| `DATABASE_URL` | Conexão com o Neon Postgres |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | NextAuth |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Login social (opcional) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (upload de arquivos) |
| `YOUTUBE_API_KEY` / `YOUTUBE_CHANNEL_ID` | Sincronização das últimas lives |
| `CRON_SECRET` | Protege o endpoint de arquivamento automático |

## Deploy

Projeto pronto para deploy direto na [Vercel](https://vercel.com/new). Configure
todas as variáveis de ambiente acima no painel do projeto antes do primeiro deploy.
