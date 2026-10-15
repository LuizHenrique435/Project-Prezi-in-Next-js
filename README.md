# Prezi Grupo Tool Services

Apresentação interativa do **Grupo Tool Services** (M3 Code, TSM Tools e Tool Services), inspirada no Prezi: uma tela infinita onde a câmera "voa" de um slide para outro e aproxima telas aninhadas dentro de telas maiores. Pensada para rodar em tela de toque (modo quiosque) e também no computador.

## Recursos

- **Canvas com zoom e voo de câmera:** cada tela é um slide 1920x1080; telas filhas ficam dentro do slide do pai e aparecem quando a câmera se aproxima.
- **Sequência única de navegação:** setas do teclado, roda do mouse e botões ‹ › percorrem todas as telas na mesma ordem. Ao clicar em algo específico, o próximo passo continua a partir dali.
- **Tema claro e escuro** e **idioma PT-BR / EN**, com transição animada. A escolha fica salva no navegador.
- **Modo quiosque:** após 90 segundos sem toque, volta sozinho para o início.
- **Tela "Mapa":** visão geral de todas as telas, com os logos das empresas ao fundo.
- **O que fazemos:** cada empresa tem uma tela com seus serviços e a lista de clientes e parceiros.
- **QR Codes** para os sites e redes sociais de cada empresa.
- Fundo técnico com fresas, réguas, cotas, HD, processador e circuitos.

## Tecnologias

- [Next.js](https://nextjs.org/) (App Router) com React e TypeScript
- [next-intl](https://next-intl.dev/) para os idiomas
- [qrcode.react](https://github.com/zpao/qrcode.react) para os QR Codes
- Fontes Barlow Condensed e IBM Plex Sans (via `next/font`)
- CSS puro em `globals.css`

## Como rodar

Requisitos: Node.js e npm instalados.

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>. Para gerar a versão de produção:

```bash
npm run build
npm run start
```

## Como navegar

| Ação                                    | Resultado                                              |
| --------------------------------------- | ------------------------------------------------------ |
| `→` `↓` `Page Down`                     | Próxima tela da sequência                              |
| `←` `↑` `Page Up`                       | Tela anterior                                          |
| `Home` / `End`                          | Primeira / última tela                                 |
| Roda do mouse                           | Muda de tela (uma por rolagem)                         |
| `Ctrl` + roda, ou pinça no trackpad     | Zoom livre                                             |
| Botões ‹ › da barra                     | Anterior / próxima (voltam ao início ao passar do fim) |
| Botões da barra (Início, Quem somos...) | Vai direto à seção                                     |
| Toque ou clique em um card              | Entra naquela tela                                     |
| Arrastar                                | Move a câmera                                          |

Ordem da sequência: Início → Quem somos → (cada empresa e seus 4 módulos) → O que fazemos → (detalhe de cada empresa) → Redes sociais → Visão geral.

## Estrutura do projeto

```
messages/
  pt-BR.json, en.json          textos principais
  extra.pt-BR.json, extra.en.json   textos das telas "O que fazemos" e do fechamento
public/
  img/                          fotos das telas
  logos/                        logos (versão branca e preta de cada empresa)
src/
  app/
    layout.tsx                  fontes e estrutura da página
    page.tsx                    renderiza o canvas
    globals.css                 todo o visual (temas, slides, barra)
  components/
    PreziCanvas.tsx             câmera, voo, teclado, roda, toque, fundo e barra
    Slides.tsx                  o conteúdo de cada tipo de tela
    Providers.tsx               tema, idioma e mensagens
  data/
    content.ts                  cores, imagens, parceiros, árvore de telas e sequência
```

## Como editar o conteúdo

**Textos:** edite `messages/pt-BR.json` e `messages/en.json` (e os `extra.*.json` para as telas "O que fazemos" e o fechamento). Mantenha as mesmas chaves nos dois idiomas.

**Clientes e parceiros:** edite `PARTNERS` em `src/data/content.ts`. Cada empresa tem sua lista de nomes.

**Fotos:** coloque os arquivos em `public/img` e ajuste os caminhos em `COMPANY` (em `content.ts`). Cada módulo usa uma foto; se ela não carregar, aparece a foto principal da empresa e, na falta desta, o logo. Use imagens grandes (de preferência 1200 px de largura ou mais) para manter a nitidez.

Arquivos esperados em `public/img`:

| Empresa       | Arquivos                                                                              |
| ------------- | ------------------------------------------------------------------------------------- |
| Recepção      | `welcome.jpg`                                                                         |
| M3 Code       | `m3-computer.png`, `m3-people2.png`, `m3-ind40.jpg`, `m3-people.png`, `m3-legacy.jpg` |
| TSM Tools     | `tsm-about.jpg`, `tsm-ind2.jpg`, `tsm-ind3.jpg`, `tsm-ind4.jpg`, `tsm-ind5.jpg`       |
| Tool Services | `ts-hero.jpg`, `ts-sol1.jpg`, `ts-sol2.jpg`, `ts-sol3.jpg`, `ts-sol4.jpg`             |

**Redes sociais:** preencha `socials` de cada empresa em `content.ts` (TSM Tools e Tool Services ainda estão vazios).

**Frases do fechamento:** chaves `closing.*` em `messages/extra.*.json`.

**Nova tela:** adicione um item em `NODES` (em `content.ts`), crie o componente em `Slides.tsx`, inclua o `id` em `PATH` na posição desejada e acrescente os textos nos arquivos de mensagens.

## Ajustes úteis

- Tempo do modo quiosque: constante `IDLE_MS` em `PreziCanvas.tsx`.
- Posição dos logos no Mapa: lista `BG_LOGOS` em `PreziCanvas.tsx`.
- Desenhos do fundo: componente `Doodles` em `PreziCanvas.tsx`; cor na variável `--doodle` do CSS.

## Observações

- O Git no Windows avisa que "LF será trocado por CRLF". É só quebra de linha e não causa problema. Para silenciar, crie um `.gitattributes` com `* text=auto`.
- Ao trocar o tema, o projeto usa a View Transitions API. Em navegadores sem suporte, a troca acontece sem animação.

## Autor

Luiz Henrique.
