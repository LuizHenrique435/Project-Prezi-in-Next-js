// Uso: node scripts/download-assets.mjs
// Baixa logos e fotos dos sites do grupo para public/. Se alguma falhar, o app continua funcionando.
import { mkdir, writeFile } from 'node:fs/promises'

const T = 'https://www.tsmtools.com.br/images/'
const S = 'https://toolservices.com.br/images/'
const M = 'https://www.m3code.com.br/images/'

const FILES = [
  // logos (versão branca para o tema escuro, preta para o claro)
  [T + 'tsmtools/logo-tsmtools-white.png', 'logos/tsmtools.png'],
  [T + 'tsmtools/logo-tsmtools-black.png', 'logos/tsmtools-black.png'],
  [T + 'toolservices/logobranco.png', 'logos/toolservices.png'],
  [T + 'toolservices/logo.png', 'logos/toolservices-black.png'],
  [T + 'm3code/logom3bco.png', 'logos/m3code.png'],
  [T + 'm3code/logom3.png', 'logos/m3code-black.png'],
  // TSM Tools
  [T + 'tsmtools-about.jpg', 'img/tsm-about.jpg'],
  [T + 'tsmtools-about2.jpg', 'img/tsm-about2.jpg'],
  [T + 'tst-industria.jpg', 'img/tsm-ind1.jpg'],
  [T + 'tst-industria2.jpg', 'img/tsm-ind2.jpg'],
  [T + 'tst-industria3.jpg', 'img/tsm-ind3.jpg'],
  [T + 'tst-industria4.jpg', 'img/tsm-ind4.jpg'],
  [T + 'tst-industria5.jpg', 'img/tsm-ind5.jpg'],
  // Tool Services
  [S + 'resource/atoolservice.jpg', 'img/ts-hero.jpg'],
  [S + 'slider/slide1.jpg', 'img/ts-slide1.jpg'],
  [S + 'slider/slide2.jpg', 'img/ts-slide2.jpg'],
  [S + 'slider/slide3.jpg', 'img/ts-slide3.jpg'],
  [S + 'servicos/solucao1.jpg', 'img/ts-sol1.jpg'],
  [S + 'servicos/solucao2.jpg', 'img/ts-sol2.jpg'],
  [S + 'servicos/solucao3.jpg', 'img/ts-sol3.jpg'],
  [S + 'servicos/solucao4.jpg', 'img/ts-sol4.jpg'],
  // M3 Code
  [M + 'computador_m3code.png', 'img/m3-computer.png'],
  [M + 'pessoas.png', 'img/m3-people.png'],
  [M + 'pessoas2.png', 'img/m3-people2.png'],
  [M + 'blog/img-industria40.jpg', 'img/m3-ind40.jpg'],
  [M + 'blog/img-sistemalegado.jpg', 'img/m3-legacy.jpg'],
  [M + 'blog/img-microservicos.jpg', 'img/m3-micro.jpg'],
]

await mkdir('public/logos', { recursive: true })
await mkdir('public/img', { recursive: true })

for (const [url, out] of FILES) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    await writeFile('public/' + out, Buffer.from(await res.arrayBuffer()))
    console.log('ok    ', out)
  } catch (e) {
    console.log('FALHOU', out, '-', e.message)
  }
}
