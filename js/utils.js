function colisaoRetangular({ retangulo1, retangulo2 }) {
  return (
    retangulo1.ataque.posicao.x + retangulo1.ataque.width >= retangulo2.posicao.x && retangulo1.ataque.posicao.x <= retangulo2.posicao.x + retangulo2.width && retangulo1.ataque.posicao.y + retangulo1.ataque.height >= retangulo2.posicao.y && retangulo1.ataque.posicao.y <= retangulo2.posicao.y + retangulo2.height
  )
}

function determineVencedor({ jogador1, jogador2, cronometroId }) {
  clearTimeout(cronometroId)
  document.querySelector('#displayResultado').style.display = 'flex'
  document.querySelector('.recomecar').style.display = 'flex'
  if (jogador1.vida === jogador2.vida) {
    document.querySelector('#displayResultado').innerHTML = 'Empate!'
  } else if (jogador1.vida > jogador2.vida) {
    document.querySelector('#displayResultado').innerHTML = 'Vitória do Jogador 1'
  } else if (jogador1.vida < jogador2.vida) {
    document.querySelector('#displayResultado').innerHTML = 'Vitória do Jogador 2'
  }
}

function reiniciar(){
  return document.location.reload()
}   

let cronometro = 60
let cronometroId

function tempoCronometro() {
  if (cronometro > 0) {
    cronometroId = setTimeout(tempoCronometro, 1000)
    cronometro--
    document.querySelector('#cronometro').innerHTML = cronometro
  }

  if (cronometro === 0) {
    determineVencedor({ jogador1, jogador2, cronometro })
  }
}