class Fundo {
  constructor({ posicao, imagemSrc, escala = 1, framesMax = 1, deslocamento = { x: 0, y: 0 } }) {
    this.posicao = posicao
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imagemSrc
    this.escala = escala
    this.framesMax = framesMax
    this.framesAtual = 0
    this.framesPassados = 0
    this.framesHold = 10
    this.deslocamento = deslocamento
  }

  skin() {
    c.drawImage(
      this.image,
      this.framesAtual * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.posicao.x - this.deslocamento.x,
      this.posicao.y - this.deslocamento.y,
      (this.image.width / this.framesMax) * this.escala,
      this.image.height * this.escala
    )
  }

  animacaoFrames() {
    this.framesPassados++

    if (this.framesPassados % this.framesHold === 0) {
      if (this.framesAtual < this.framesMax - 1) {
        this.framesAtual++
      } else {
        this.framesAtual = 0
      }
    }
  }

  movimento() {
    this.skin()
    this.animacaoFrames()
  }
}

class Lutador extends Fundo {
  constructor({ posicao, velocidade, cor, imagemSrc, escala = 1, framesMax = 1, deslocamento = { x: 0, y: 0 }, condicoes, ataque = { deslocamento: {}, width: undefined, height: undefined } }) {
    super({
      posicao,
      imagemSrc,
      escala,
      framesMax,
      deslocamento
    })

    this.velocidade = velocidade
    this.width = 50
    this.height = 150
    this.lastKey
    this.ataque = {
      posicao: {
        x: this.posicao.x,
        y: this.posicao.y
      },
      deslocamento: ataque.deslocamento,
      width: ataque.width,
      height: ataque.height
    }
    this.cor = cor
    this.atacando
    this.vida = 100
    this.framesAtual = 0
    this.framesPassados = 0
    this.framesHold = 8
    this.condicoes = condicoes
    this.morto = false

    for (const condicao in this.condicoes) {
      condicoes[condicao].image = new Image()
      condicoes[condicao].image.src = condicoes[condicao].imagemSrc
    }
  }

  movimento() {
    this.skin()
    if (!this.morto) this.animacaoFrames()

    this.ataque.posicao.x = this.posicao.x + this.ataque.deslocamento.x
    this.ataque.posicao.y = this.posicao.y + this.ataque.deslocamento.y

    this.posicao.x += this.velocidade.x
    this.posicao.y += this.velocidade.y

    if (this.posicao.y + this.height + this.velocidade.y >= canvas.height - 96) {
      this.velocidade.y = 0
      this.posicao.y = 330
    } else this.velocidade.y += gravidade

    if (this.posicao.x >= canvas.width + 25) {
      this.posicao.x = -25
    } else if (this.posicao.x <= -25) {
      this.posicao.x = 999
    }
  }

  golpe() {
    this.trocaCondicao('golpe1')
    this.atacando = true
  }

  acertoGolpe() {
    this.vida -= 10

    if (this.vida <= 0) {
      this.trocaCondicao('morte')
    } else this.trocaCondicao('acertoGolpe')
  }

  trocaCondicao(condicao) {
    if (this.image === this.condicoes.morte.image) {
      if (this.framesAtual === this.condicoes.morte.framesMax - 1)
        this.morto = true
      return
    }

    if (
      this.image === this.condicoes.golpe1.image &&
      this.framesAtual < this.condicoes.golpe1.framesMax - 1
    )
    return

    if (
      this.image === this.condicoes.acertoGolpe.image &&
      this.framesAtual < this.condicoes.acertoGolpe.framesMax - 1
    )
    return

    switch (condicao) {
      case 'parado':
        if (this.image !== this.condicoes.parado.image) {
          this.image = this.condicoes.parado.image
          this.framesMax = this.condicoes.parado.framesMax
          this.framesAtual = 0
        }
        break
      case 'correndo':
        if (this.image !== this.condicoes.correndo.image) {
          this.image = this.condicoes.correndo.image
          this.framesMax = this.condicoes.correndo.framesMax
          this.framesAtual = 0
        }
        break
      case 'pulando':
        if (this.image !== this.condicoes.pulando.image) {
          this.image = this.condicoes.pulando.image
          this.framesMax = this.condicoes.pulando.framesMax
          this.framesAtual = 0
        }
        break

      case 'queda':
        if (this.image !== this.condicoes.queda.image) {
          this.image = this.condicoes.queda.image
          this.framesMax = this.condicoes.queda.framesMax
          this.framesAtual = 0
        }
        break

      case 'golpe1':
        if (this.image !== this.condicoes.golpe1.image) {
          this.image = this.condicoes.golpe1.image
          this.framesMax = this.condicoes.golpe1.framesMax
          this.framesAtual = 0
        }
        break

      case 'acertoGolpe':
        if (this.image !== this.condicoes.acertoGolpe.image) {
          this.image = this.condicoes.acertoGolpe.image
          this.framesMax = this.condicoes.acertoGolpe.framesMax
          this.framesAtual = 0
        }
        break

      case 'morte':
        if (this.image !== this.condicoes.morte.image) {
          this.image = this.condicoes.morte.image
          this.framesMax = this.condicoes.morte.framesMax
          this.framesAtual = 0
        }
        break
    }
  }
}