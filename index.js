const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravidade = 0.7

const background = new Fundo({
  posicao: {
    x: 0,
    y: 0
  },
  imagemSrc: './img/background.png'
})

const loja = new Fundo({
  posicao: {
    x: 600,
    y: 128
  },
  imagemSrc: './img/shop.png',
  escala: 2.75,
  framesMax: 6
})

const jogador1 = new Lutador({
  posicao: {
    x: 250,
    y: 330
  },
  velocidade: {
    x: 0,
    y: 0
  },
  deslocamento: {
    x: 0,
    y: 0
  },
  imagemSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  escala: 2.5,
  deslocamento: {
    x: 215,
    y: 157
  },
  condicoes: {
    parado: {
      imagemSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    correndo: {
      imagemSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    pulando: {
      imagemSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    queda: {
      imagemSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    golpe1: {
      imagemSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    acertoGolpe: {
      imagemSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    morte: {
      imagemSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  ataque: {
    deslocamento: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const jogador2 = new Lutador({
  posicao: {
    x: 700,
    y: 330
  },
  velocidade: {
    x: 0,
    y: 0
  },
  cor: 'blue',
  deslocamento: {
    x: -50,
    y: 0
  },
  imagemSrc: './img/kenji/Idle.png',
  framesMax: 4,
  escala: 2.5,
  deslocamento: {
    x: 215,
    y: 167
  },
  condicoes: {
    parado: {
      imagemSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    correndo: {
      imagemSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    pulando: {
      imagemSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    queda: {
      imagemSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    golpe1: {
      imagemSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    acertoGolpe: {
      imagemSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    morte: {
      imagemSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },
  ataque: {
    deslocamento: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

console.log(jogador1)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

tempoCronometro()

function animacao() {
  window.requestAnimationFrame(animacao)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.movimento()
  loja.movimento()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  jogador1.movimento()
  jogador2.movimento()

  jogador1.velocidade.x = 0
  jogador2.velocidade.x = 0

  if (keys.a.pressed && jogador1.lastKey === 'a') {
    jogador1.velocidade.x = -5
    jogador1.trocaCondicao('correndo')
  } else if (keys.d.pressed && jogador1.lastKey === 'd') {
    jogador1.velocidade.x = 5
    jogador1.trocaCondicao('correndo')
  } else {
    jogador1.trocaCondicao('parado')
  }

  if (jogador1.velocidade.y < 0) {
    jogador1.trocaCondicao('pulando')
  } else if (jogador1.velocidade.y > 0) {
    jogador1.trocaCondicao('queda')
  }

  if (keys.ArrowLeft.pressed && jogador2.lastKey === 'ArrowLeft') {
    jogador2.velocidade.x = -5
    jogador2.trocaCondicao('correndo')
  } else if (keys.ArrowRight.pressed && jogador2.lastKey === 'ArrowRight') {
    jogador2.velocidade.x = 5
    jogador2.trocaCondicao('correndo')
  } else {
    jogador2.trocaCondicao('parado')
  }

  if (jogador2.velocidade.y < 0) {
    jogador2.trocaCondicao('pulando')
  } else if (jogador2.velocidade.y > 0) {
    jogador2.trocaCondicao('queda')
  }

  if (colisaoRetangular({ retangulo1: jogador1, retangulo2: jogador2 }) && jogador1.atacando && jogador1.framesAtual === 4) {
    jogador2.acertoGolpe()
    jogador2.posicao.x = jogador2.posicao.x + 40
    jogador2.posicao.y = jogador2.posicao.y - 50
    jogador1.atacando = false

    gsap.to('#jogador2Vida', {
      width: jogador2.vida + '%'
    })
  }

  if (jogador1.atacando && jogador1.framesAtual === 4) {
    jogador1.atacando = false
  }

  if (colisaoRetangular({ retangulo1: jogador2, retangulo2: jogador1 }) && jogador2.atacando && jogador2.framesAtual === 2) {
    jogador1.acertoGolpe()
    jogador1.posicao.x = jogador1.posicao.x - 40
    jogador1.posicao.y = jogador1.posicao.y - 50
    jogador2.atacando = false

    gsap.to('#jogador1Vida', {
      width: jogador1.vida + '%'
    })
  }

  if (jogador2.atacando && jogador2.framesAtual === 2) {
    jogador2.atacando = false
  }

  if (jogador2.vida <= 0 || jogador1.vida <= 0) {
    determineVencedor({ jogador1, jogador2, cronometroId })
  }
}

animacao()

window.addEventListener('keydown', (event) => {
  if (!jogador1.morto) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        jogador1.lastKey = 'd'
      break

      case 'a':
        keys.a.pressed = true
        jogador1.lastKey = 'a'
      break

      case 'w':
        if(jogador1.velocidade.y == 0) {
		        jogador1.velocidade.y = -16.5
        }
      break

      case ' ':
        jogador1.golpe()
      break
    }
  }

  if (!jogador2.morto) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        jogador2.lastKey = 'ArrowRight'
      break

      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        jogador2.lastKey = 'ArrowLeft'
        break

      case 'ArrowUp':
        if(jogador2.velocidade.y == 0) {
          jogador2.velocidade.y = -16.5
        }
      break

      case 'ArrowDown':
        jogador2.golpe()
      break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
    break

    case 'a':
      keys.a.pressed = false
    break
  }

  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
    break

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
    break
  }
})