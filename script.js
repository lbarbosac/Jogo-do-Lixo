// game.js

// Configurações básicas
const areaDeJogo = document.getElementById('gameArea');
const jogador = document.getElementById('jogador');
const pontosDisplay = document.getElementById('pontos');
const vidasDisplay = document.getElementById('vidas');

// Propriedades do jogador
const larguraJogador = 50; // Largura do jogador em px
const alturaJogador = 80;  // Altura do jogador em px
let movimentoX = 0;        // Movimento lateral
let puloAtivo = false;     // Verifica se está pulando
let velocidadePulo = 10;   // Velocidade do pulo
let gravidade = 1;         // Gravidade para o pulo
let noChao = true;         // Verifica se está no chão

// Configuração dos objetos
const objetosCaindo = [];
let pontuacao = 0;
let vidas = 3;
let jogoAtivo = true;
let intervaloCriacao;
let intervaloAtualizacao;
let velocidadeObjetos = 2;  // Velocidade inicial dos objetos

// Movimento do jogador com as teclas (setas ou A/D)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') movimentoX = -5;
    if (e.key === 'ArrowRight' || e.key === 'd') movimentoX = 5;

    if (e.key === ' ' && noChao) { // Pular
        puloAtivo = true;
        noChao = false;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') movimentoX = 0;
});

// Função para criar objetos caindo (chocolates e lixos)
function criarObjetoCaindo() {
    const tipoObjeto = Math.random() > 0.5 ? 'chocolate' : 'lixo';
    const objeto = document.createElement('div');
    objeto.classList.add('objeto', tipoObjeto);
    objeto.style.left = `${Math.random() * (areaDeJogo.offsetWidth - 30)}px`;
    areaDeJogo.appendChild(objeto);
    objetosCaindo.push(objeto);
}

// Função para mover os objetos caindo
function moverObjetosCaindo() {
    objetosCaindo.forEach((objeto, index) => {
        objeto.style.top = `${objeto.offsetTop + velocidadeObjetos}px`;

        // Remover objetos que saem da tela
        if (objeto.offsetTop > areaDeJogo.offsetHeight) {
            objeto.remove();
            objetosCaindo.splice(index, 1);
        }

        // Verificar colisão com o jogador
        if (colisao(jogador, objeto)) {
            if (objeto.classList.contains('chocolate')) {
                pontuacao += 10;
                atualizarPontuacao();
                objeto.remove();
                objetosCaindo.splice(index, 1);

                // Aumenta a dificuldade conforme a pontuação
                if (pontuacao % 50 === 0) {
                    velocidadeObjetos += 1;
                }
            } else if (objeto.classList.contains('lixo')) {
                vidas -= 1;
                atualizarVidas();
                objeto.remove();
                objetosCaindo.splice(index, 1);

                if (vidas <= 0) fimDeJogo();
            }
        }
    });
}

// Função para mover o jogador (incluindo pulo)
function moverJogador() {
    const novaPosicaoX = jogador.offsetLeft + movimentoX;

    // Limitar os movimentos dentro da área de jogo
    if (novaPosicaoX >= 0 && novaPosicaoX <= areaDeJogo.offsetWidth - larguraJogador) {
        jogador.style.left = `${novaPosicaoX}px`;
    }

    // Lógica de pulo
    if (puloAtivo) {
        jogador.style.bottom = `${jogador.offsetTop + velocidadePulo}px`;
        velocidadePulo -= gravidade; // A gravidade faz o jogador cair

        // Quando o jogador voltar ao chão, encerra o pulo
        if (jogador.offsetTop >= 520) { // 520px é o chão
            jogador.style.bottom = '20px';
            puloAtivo = false;
            noChao = true;
            velocidadePulo = 10;
        }
    }
}

// Função para detectar colisão
function colisao(jogador, objeto) {
    const jogadorRect = jogador.getBoundingClientRect();
    const objetoRect = objeto.getBoundingClientRect();

    return !(
        jogadorRect.right < objetoRect.left ||
        jogadorRect.left > objetoRect.right ||
        jogadorRect.bottom < objetoRect.top ||
        jogadorRect.top > objetoRect.bottom
    );
}

// Atualizar pontuação e vidas na tela
function atualizarPontuacao() {
    pontosDisplay.textContent = pontuacao;
}

function atualizarVidas() {
    vidasDisplay.textContent = vidas;
}

// Função para finalizar o jogo
function fimDeJogo() {
    clearInterval(intervaloCriacao);
    clearInterval(intervaloAtualizacao);
    jogoAtivo = false;
    alert(`Game Over! Sua pontuação foi: ${pontuacao}`);
}

// Atualizar o jogo constantemente
function atualizarJogo() {
    if (jogoAtivo) {
        moverJogador();
        moverObjetosCaindo();
    }
}

// Iniciar o jogo
function iniciarJogo() {
    intervaloCriacao = setInterval(criarObjetoCaindo, 1000);
    intervaloAtualizacao = setInterval(atualizarJogo, 20);
}

iniciarJogo();
