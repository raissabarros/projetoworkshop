# Especificação de Componentes — Figma

Baseado no `design-system.md` já definido. Todas as medidas em px, grid de 8pt.

---

## 1. Header

**Estrutura:** altura 88px (desktop) / 64px (mobile), fundo `cream-50`, borda inferior 1px `ink-900` a 10% opacidade.

| Elemento | Especificação |
|---|---|
| Logo/Nome | H2 serifado caixa-alta, `ink-900`, 24px, tracking +2% |
| Navegação | Sans-serif medium 14px, `ink-900`, espaçamento entre itens 32px |
| Item ativo | sublinhado manuscrito fino em `red-700` (2px, offset 4px) |
| CTA (carrinho/idioma) | ícone 20px + label 12px, `red-700` |
| Padding lateral | 64px desktop / 16px mobile |

**Variante "hero":** fundo cheio `red-700`, texto `cream-50`, altura livre (min 480px), usada na página inicial da loja e da galeria — reproduz o bloco de cor cheia de abertura.

**Auto Layout:** horizontal, space-between, padding 24/64, altura fixa, itens alinhados ao centro.

---

## 2. Card de Adesivo (Loja)

**Container:** 280×360px, fundo `cream-100`, radius 12px, sombra `0 4px 12px rgba(35,31,28,0.08)`, rotação opcional -2° a +2° (variante "colagem").

| Camada | Especificação |
|---|---|
| Moldura-polaroid | borda sólida 10px `cream-50`, borda inferior 32px (área de legenda) |
| Imagem do adesivo | 240×240px, centralizada, radius 4px |
| Selo (badge) | canto superior direito, pill 12px radius, fundo `mustard-400`, texto `ink-900` 11px bold, ex. "NOVO" / "LIMITADO" |
| Nome da cartela | H3 sans-serif medium 16px, `ink-900`, 1 linha, truncar com ellipsis |
| Legenda script | manuscrita 12px `red-700`, ex. "feito à mão" — opcional, só decorativo |
| Preço | sans-serif bold 18px, `red-700` |
| Estado hover | leve rotação para 0°, sombra aumenta para `0 8px 20px rgba(35,31,28,0.12)` |
| Estado "esgotado" | overlay `ink-900` 40% + tag `red-800` "ESGOTADO" |

**Auto Layout:** vertical, padding 16px, gap 8px, hug contents na altura da legenda.

**Variantes do componente:** `default`, `hover`, `novo`, `esgotado`.

---

## 3. Card de Obra / Artista (Galeria)

**Container:** 320×440px, fundo `cream-50`, borda 1px `sepia-600` a 15%, radius 8px (mais sóbrio que o card de adesivo — sem rotação).

| Camada | Especificação |
|---|---|
| Imagem da obra | 320×280px, topo, sem radius no topo (full bleed), radius 8px só nas quinas superiores |
| Badge de período/movimento | pill, fundo `sage-500`, texto `cream-50` 10px uppercase, ex. "RENASCENTISTA" |
| Nome da obra | H3 serifado 18px, `ink-900` |
| Artista | sans-serif regular 14px, `sepia-600` |
| Citação/curadoria | script 13px `red-700`, itálico, até 2 linhas, aspas sutis |
| Ano | sans-serif 12px, `sepia-600`, alinhado à direita |

**Auto Layout:** vertical, padding 20px (exceto imagem, full bleed), gap 6px.

**Variante "ficha expandida":** adiciona bloco de biografia do artista (sans-serif 14px, `ink-900`, line-height 1.6, max-width 480px) + foto redonda do artista 64px com borda `blush-200` 4px.

---

## 4. Componentes de apoio

### Botão primário
- Fundo `red-700`, texto `cream-50` 14px bold uppercase, padding 12/24, radius 8px.
- Hover: fundo `red-800`.
- Disabled: fundo `ink-900` 20%, texto `ink-900` 40%.

### Botão secundário (outline)
- Borda 1.5px `red-700`, texto `red-700`, fundo transparente.
- Hover: fundo `blush-200` 20%.

### Tag/Badge
- Pill, padding 4/12, radius 999px, fonte 11px uppercase bold.
- Cores por contexto: `mustard-400` (novo), `sage-500` (categoria), `red-800` (erro/esgotado).

### Divisor "papel rasgado"
- SVG de borda irregular, altura 48–64px, usado entre seções de cor cheia (`red-700`) e neutra (`cream-50`) — não é um componente interativo, é um asset de seção.

### Nota/legenda com fita
- Card pequeno 160×120px, fundo `cream-100`, rotação -3° a +3°, "fita" decorativa (retângulo `kraft-400` 60% opacidade, 40×16px) no topo centralizado, sobrepondo a borda.

---

## 5. Organização sugerida no Figma

```
📁 Design System
 ├── 🎨 Tokens (Color Styles + Text Styles)
 ├── 🧩 Components
 │    ├── Header / Hero
 │    ├── Card / Adesivo
 │    ├── Card / Obra-Artista
 │    ├── Button / Primary, Secondary
 │    ├── Badge / Tag
 │    └── Decor / Divisor, Nota-fita
 └── 📄 Pages
      ├── Loja — Home
      ├── Loja — Produto
      ├── Galeria — Home
      └── Galeria — Obra
```

Crie primeiro os **Color Styles** e **Text Styles** a partir do `design-system.md`, depois monte os componentes acima como Main Components com as variantes indicadas — assim qualquer ajuste de token se propaga automaticamente.
