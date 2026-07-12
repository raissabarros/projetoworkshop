# Design System — Loja de Adesivos & Galeria de Arte

## 1. Conceito e Estilo

Um sistema editorial-colagem: papel, memória e afeto materializados em interface. A direção combina o calor de um álbum de recortes analógico com a clareza de um produto digital moderno — ideal tanto para uma vitrine de adesivos colecionáveis quanto para uma galeria que conta histórias de arte e artistas.

**Palavras-chave:** editorial · vintage-afetivo · colagem · artesanal-refinado · nostálgico · quente

---

## 2. Sistema de Cores

### Cores Primitivas

| Token | Hex | Uso |
|---|---|---|
| `red-700` | `#B5222A` | Vermelho principal (blocos de destaque) |
| `red-800` | `#8F1A21` | Vermelho escuro (hover/profundidade) |
| `cream-50` | `#F7F3EC` | Fundo base |
| `cream-100` | `#EFE8DC` | Fundo secundário / cartões |
| `blush-200` | `#E8C7C9` | Rosa empoeirado (bordas, tags) |
| `kraft-400` | `#C9A876` | Kraft/papel pardo (fita, textura) |
| `ink-900` | `#231F1C` | Texto principal / preto quente |
| `sepia-600` | `#6E5B47` | Texto secundário / legendas |
| `mustard-400` | `#D9A441` | Acento floral 1 |
| `coral-400` | `#E07856` | Acento floral 2 |
| `sage-500` | `#6E7F5C` | Acento floral 3 |

### Cores Semânticas

| Papel | Token | Uso |
|---|---|---|
| Primary | `red-700` | CTAs principais, headers de seção, preço em destaque |
| Secondary | `blush-200` | Fundos de cartão, bordas de "polaroid", badges |
| Accent | `mustard-400` / `coral-400` | Selos, tags de "novo", ilustrações decorativas |
| Neutral base | `cream-50` / `ink-900` | Fundo e texto padrão |
| Success | `sage-500` | Confirmações, "em estoque" |
| Warning | `mustard-400` (variação escura `#B8862C`) | Estoque baixo, avisos |
| Error | `red-800` | Erros de formulário, indisponibilidade |

---

## 3. Tipografia

- **Estilo geral:** contraste entre uma serifa/display condensada em caixa alta (headlines) e uma sans-serif humanista limpa (corpo de texto), pontuado por uma manuscrita/script fina em vermelho para anotações e legendas afetivas.
- **Hierarquia:**
  - H1 — Display serifado, caixa alta, tracking levemente aberto (títulos de coleção, nome da loja/galeria)
  - H2 — Mesma família do H1, peso menor, usado em títulos de seção
  - H3 — Sans-serif medium, usada em nomes de produto/obra
  - Body — Sans-serif regular, alta legibilidade, linhas curtas (colunas estreitas)
  - Caption/Script — Manuscrita fina em vermelho para notas, datas, "curadoria" e microcopy afetivo
- **Distribuição de peso:** predominância de regular/medium no corpo; bold reservado a H1/H2 e preços.
- **Espaçamento:** títulos com tracking aberto e line-height compacto; corpo com line-height confortável (1.5–1.6) e respiro generoso entre parágrafos.

---

## 4. Espaçamento e Layout

- **Escala:** `4 / 8 / 16 / 24 / 32 / 48 / 64`
- **Densidade:** balanceada a espaçosa — blocos de conteúdo respiram, mas elementos de colagem (adesivos, polaroids) podem se sobrepor intencionalmente dentro de uma mesma seção.
- **Grid:** 12 colunas em desktop, margens generosas (64–96px); mobile em coluna única com margem de 16–24px.
- **Ritmo:** alternância de blocos de cor cheia (vermelho) com blocos neutros (cream), marcando transições de seção como "páginas" de um álbum.

---

## 5. Formas e Linguagem de UI

- **Border radius:** sutil a moderado — cartões de produto/obra com cantos levemente arredondados (8–12px); nenhuma pílula, exceto em badges/tags.
- **Traço/Stroke:** fino e definido em bordas de cartão (1px), mais grosso em molduras decorativas tipo "polaroid" (8–12px de borda sólida em `cream-50` ou `blush-200`).
- **Componentes:** estilo camadas/colagem — cartões levemente rotacionados, sobrepostos com "fita" e "clipes" como elementos decorativos opcionais; base geral é flat com profundidade dada por sombra suave, não por gradientes pesados.

---

## 6. Detalhes Visuais

- **Sombras:** suaves e curtas, simulando papel empilhado (não elevação de UI moderna pesada).
- **Bordas:** definidas nos "cartões-polaroid" (produto/obra), invisíveis no restante do layout.
- **Decorações:** textura de papel rasgado entre seções, fita adesiva (washi tape) como marcador visual, ilustrações botânicas e selos como acentos de curadoria — usar com moderação para não competir com o produto/obra.

---

## 7. Contraste e Acessibilidade

- **Nível de contraste:** alto entre `ink-900`/`cream-50` e `cream-50`/`red-700` para textos críticos (preço, CTA, títulos).
- **Legibilidade:** texto script/manuscrito restrito a legendas curtas e decorativas — nunca para informação essencial (preço, disponibilidade, nome do artista).
- **Hierarquia por cor:** vermelho reservado para ação e destaque; tons pastéis (blush, mustard, sage) para categorização e humor visual, nunca para texto de corpo longo.

---

## Aplicação sugerida

- **Loja de adesivos:** cada cartela como um "cartão-polaroid" com borda `blush-200`, selo `mustard-400` para "novo/limitado", preço em `red-700`.
- **Galeria de pinturas:** cada obra em moldura neutra `cream-100`, ficha do artista com script vermelho para citações, badge `sage-500` para período/movimento artístico.
