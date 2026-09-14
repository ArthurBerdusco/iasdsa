# Melhorias implementadas — Boletim IASD Santo Amaro

Este documento resume tudo o que foi feito nesta rodada, o porquê de cada
decisão, e o que fica como próximo passo recomendado.

## 1. Correções de bugs e segurança (achados durante a análise)

| Problema | Onde | O que foi feito |
|---|---|---|
| **Upload de fotos quebrado em produção** | `api/fotos/route.ts` | O código usava `fs.writeFile` para salvar em `public/images/fotos`. Isso funciona em `next dev`, mas o filesystem da Vercel é **somente leitura** em produção — o upload de fotos simplesmente não funcionava depois do deploy. Migrado para Vercel Blob, no mesmo padrão já usado em `anuncios.ts`/`cultos.ts` (`src/app/lib/db/fotos.ts`). |
| **Chave de API exposta no código-fonte** | `lib/db/ultimos-cultos.ts` | A `YOUTUBE_API_KEY` e o `CHANNEL_ID` estavam hardcoded no repositório (visíveis a qualquer pessoa com acesso ao código/GitHub). Movidos para variáveis de ambiente (`YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`). **Recomendo revogar essa chave antiga no Google Cloud Console e gerar uma nova**, já que ela ficou exposta. |
| **Banco de dados sem schema versionado** | — | Não existia nenhum arquivo SQL no projeto. Criado `db/schema.sql` (schema completo e idempotente) e `db/migrations/001_...sql` (migração incremental para o banco já existente). |

## 2. Padronização de UI/UX

O projeto já tinha uma boa base (sistema de tema via CSS variables editável
no admin), mas nem todo componente o seguia — por exemplo, `NavBar` e
`Footer` usavam cores fixas do Tailwind (`bg-white`, `text-gray-900`,
`bg-gray-800`) em vez dos tokens do tema, então trocar as cores no editor de
identidade visual não afetava esses dois componentes.

**Criado um kit de UI compartilhado:**
- `components/ui/Container.tsx`, `Button.tsx`, `Badge.tsx`, `Card.tsx`, `SectionHeader.tsx`
- `components/admin/ui/AdminPageHeader.tsx`, `AdminCard.tsx`, `ToggleSwitch.tsx`, `EmptyState.tsx`

**Refatorados para usar o kit + tokens do tema:**
- `NavBar.tsx` — agora usa `var(--color-*)`, adiciona o link "Boletins Anteriores"
- `Footer.tsx` — idem, redes sociais e links rápidos organizados
- `admin/configuracoes/page.tsx` — antes era uma tela cinza genérica, destoante do resto do backoffice (que já tinha um visual mais elaborado); agora segue o mesmo padrão visual das outras telas do admin

**Referências de UI/UX consideradas:** páginas de igrejas com boa experiência
digital costumam seguir um padrão comum — hero em vídeo/imagem de impacto no
topo, hierarquia visual clara por seção, CTAs diretos (ex: "Ver programação",
"Pedido de oração"), tipografia consistente e paleta de marca aplicada de
ponta a ponta (não só na home, mas em toda página interna). Foi esse padrão
que guiou as decisões de padronização acima.

> Escopo desta rodada: dado o tamanho do projeto, priorizei os componentes
> mais visíveis e mais inconsistentes (navbar, footer, hero, tela de
> configurações). As demais telas do admin (cultos, anúncios, oradores,
> fotos, usuários, identidade visual) já usam um visual mais cuidado (sidebar
> escura, cards) e podem ser migradas para o mesmo `AdminCard`/`AdminPageHeader`
> gradualmente — a estrutura já está pronta para isso.

## 3. Hero de vídeo institucional

Novo componente `HeroVideoInstitucional.tsx`, exibido no topo da home, logo
abaixo da navbar:

- Vídeo em autoplay, mudo, em loop (`autoPlay muted loop playsInline`) —
  segue a prática padrão de navegadores, que bloqueiam autoplay com som.
- Botão de som no canto inferior direito, para quem quiser ativar o áudio.
- Título e subtítulo configuráveis, sobrepostos ao vídeo.
- **Enquanto nenhum vídeo for cadastrado**, mostra um gradiente elegante (ou
  a imagem de poster, se houver) — a home nunca fica "quebrada" por falta de
  vídeo.
- Configurável em `/admin/hero`: upload do vídeo e do poster (ambos vão para
  o Vercel Blob), edição do título/subtítulo.

**Para você adicionar o vídeo:** acesse `/admin/hero` já logado como admin e
faça o upload — não precisa de deploy nem de mexer em código.

## 4. Registro histórico dos boletins (a peça central pedida)

A ideia: a home sempre mostra a semana **atual**; o histórico fica arquivado
e consultável à parte.

**Como funciona:**
1. `cultos`, `anuncios` e `mensagem_pastoral` continuam sendo tabelas "vivas"
   — o admin atualiza normalmente a cada semana, exatamente como já fazia.
2. Antes de sobrescrever com a semana seguinte, o conteúdo atual pode ser
   **arquivado**: isso tira uma "foto" (snapshot em JSON) de tudo e salva
   permanentemente na tabela `boletins_semanais`, identificada pela semana
   ISO (ex: `2026-W37`).
3. Esse arquivamento acontece de duas formas:
   - **Automaticamente**: um Vercel Cron roda toda segunda-feira de
     madrugada (`vercel.json` → `/api/boletins/auto-archive`), arquivando a
     semana que acabou de terminar.
   - **Manualmente**: botão "Arquivar semana atual" em `/admin/boletins`,
     para quando quiser garantir o registro antes de atualizar os dados.
4. O público consulta o histórico em:
   - `/boletins` — lista de todas as semanas arquivadas (cards com datas,
     total de cultos/anúncios daquela semana)
   - `/boletins/2026-W37` — o boletim completo daquela semana, reaproveitando
     os mesmos componentes visuais da home (`HeroSection`, `MensagemPastoral`,
     `AnunciosSection`), com um aviso deixando claro que é um registro
     histórico.
5. O admin gerencia tudo em `/admin/boletins`: ver o histórico, arquivar
   agora, remover um registro.

**Por que snapshot em JSON, e não linkar as linhas originais?** Porque
`cultos`/`anuncios` são sobrescritos toda semana — se o boletim antigo
apenas referenciasse essas linhas, o "registro histórico" mudaria junto
quando o admin atualizasse os dados atuais. O snapshot congela o conteúdo
exatamente como estava, para sempre.

## 5. Arquivos novos (resumo rápido)

```
db/schema.sql
db/migrations/001_boletins_e_configuracoes_site.sql
.env.example

src/types/boletim.ts
src/types/siteSettings.ts

src/app/lib/db/boletins.ts
src/app/lib/db/site-settings.ts
src/app/lib/db/fotos.ts                  (reescrito — bug de produção)

src/app/components/ui/*                  (kit de UI público)
src/app/components/admin/ui/*            (kit de UI do admin)
src/app/components/HeroVideoInstitucional.tsx

src/app/api/boletins/route.ts
src/app/api/boletins/[semana]/route.ts
src/app/api/boletins/auto-archive/route.ts
src/app/api/site-settings/route.ts

src/app/boletins/page.tsx
src/app/boletins/[semana]/page.tsx
src/app/admin/boletins/page.tsx
src/app/admin/hero/page.tsx
```

## 6. Checklist para colocar no ar

1. **Rodar a migração no banco de produção:**
   ```bash
   psql "$DATABASE_URL" -f db/migrations/001_boletins_e_configuracoes_site.sql
   ```
2. **Revogar a chave antiga do YouTube** e gerar uma nova no Google Cloud Console.
3. **Configurar as variáveis de ambiente na Vercel** (veja `.env.example`):
   `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`, `CRON_SECRET` (novas), além das que já existiam.
4. **Fazer o deploy.** O Vercel Cron em `vercel.json` é ativado automaticamente
   (crons exigem plano Pro da Vercel — no plano Hobby, o cron roda no máximo
   1x por dia, o que ainda cobre o caso de uso semanal).
5. **Acessar `/admin/hero`** e subir o vídeo institucional quando estiver pronto.
6. **Testar o fluxo de arquivamento**: `/admin/boletins` → "Arquivar semana atual"
   → conferir se aparece em `/boletins`.

## 7. Roadmap sugerido (não implementado nesta rodada)

- Aplicar `AdminCard`/`AdminPageHeader` também nas telas de cultos, anúncios,
  oradores, fotos e usuários, para 100% de consistência no backoffice.
- Tornar a seção "Programação de Cultos" (hoje com dados fixos no componente)
  editável via banco/admin, como já acontece com cultos e anúncios.
- Adicionar paginação em `/boletins` quando o histórico crescer bastante.
- Testes automatizados (unitários para `lib/db/boletins.ts`, e2e para o fluxo
  de arquivamento).

---

*Nota técnica: o build foi validado com `tsc --noEmit` (0 erros) e com
`next build`, que chegou a compilar toda a aplicação — a única falha
observada foi o download das fontes do Google Fonts, bloqueado pela rede
restrita deste ambiente de desenvolvimento, e não deve ocorrer no ambiente
de build da Vercel.*
