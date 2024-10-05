// Variáveis
let primeiraCarta = null; 
let bloqueio = false; 
let paresEncontrados = 0; 
let nomeJogador = ''; 
let tempoRestante = 0; 
let cronometroInterval; 
let cartasFacil; 
let cartasDificil; 
let pontuacao = 0; 
let venceu = false;

function iniciarJogo() {

     // Resetar variaveis
     cartasDificil = 0;
     cartasFacil = 0;
     paresEncontrados = 0; 
     primeiraCarta = null; 
     bloqueio = false; 
     pontuacao = 0; 
             
    // Zerar o tempo
    if (cronometroInterval) {
        clearInterval(cronometroInterval);
    }
    venceu = false;
    document.getElementById('ranking-container').style.display = 'block';
    atualizarRanking();
    // Somente pedir o nome do jogador se ainda não tiver sido escolhido
    if (!nomeJogador) {
        nomeJogador = prompt("Digite seu nome:");
    }

    document.getElementById('nome-jogador').textContent = "Jogador: " + nomeJogador;

    document.getElementById('principal').style.display = 'none';

    //Armazena a dificuldade escolhida
    const dificuldade = document.getElementById('opcao').value;

    // Esconder todos os tabuleiros
    document.getElementById('game-facil').style.display = 'none';
    document.getElementById('game-dificil').style.display = 'none';

    // Resetar as cartas ao iniciar um novo jogo
    resetarCartas();

    if (dificuldade === '7p') {
        tempoRestante = 60;
        document.getElementById('cronometro').textContent = tempoRestante;

        // Inicia o cronômetro
        cronometroInterval = setInterval(atualizarCronometro, 1000);
        document.getElementById('game-facil').style.display = 'block';

        cartasFacil = document.querySelectorAll('.carta'); 

        cartasFacil.forEach(carta => {
            carta.addEventListener('click', handleCartaClick);
        });

    } else if (dificuldade === '14p') {
        tempoRestante = 120; 
        document.getElementById('cronometro-dificil').textContent = tempoRestante;

        // Inicia o cronômetro
        cronometroInterval = setInterval(atualizarCronometro, 1000);
        
        document.getElementById('game-dificil').style.display = 'block';

        cartasDificil = document.querySelectorAll('.carta-dificil');

        cartasDificil.forEach(carta => {
            carta.addEventListener('click', handleCartaClick);
        });

    } 
}

function resetarCartas() {
    // Reseta as cartas do modo fácil
    if (cartasFacil) {
        cartasFacil.forEach(carta => {
            carta.classList.remove('virada'); 
            carta.removeEventListener('click', handleCartaClick);
        });
    }

    // Reseta as cartas do modo difícil
    if (cartasDificil) {
        cartasDificil.forEach(carta => {
            carta.classList.remove('virada'); 
            carta.removeEventListener('click', handleCartaClick); 
        });
    }

    // Após todas serem resetadas, embaralha as cartas e habilita o clique
    setTimeout(() => {
        if (cartasFacil) {
            embaralharCartas(cartasFacil); 
            cartasFacil.forEach(carta => {
                carta.addEventListener('click', handleCartaClick); 
            });
        }

        if (cartasDificil) {
            embaralharCartas(cartasDificil); 
            cartasDificil.forEach(carta => {
                carta.addEventListener('click', handleCartaClick); 
            });
        }

        paresEncontrados = 0; 
        primeiraCarta = null; 
        bloqueio = false; 
        pontuacao = 0; 
    }, 500); 
}

// Esta função irá lidar com o clique nas cartas
function handleCartaClick() {
    virarCarta(this); 
}

// Função que vira a carta
function virarCarta(carta) {
    if (bloqueio || carta.classList.contains('virada')) return;

    carta.classList.add('virada'); 

    if (!primeiraCarta) {
        // Se não há carta selecionada, armazena a primeira
        primeiraCarta = carta;
    } else {
        // Se já existe uma carta selecionada
        bloqueio = true;
        const segundaCarta = carta;

        // Verifica se as cartas correspondem
        if (primeiraCarta.dataset.framework === segundaCarta.dataset.framework) {
            // Se as cartas correspondem, mantém viradas
            paresEncontrados++; 
            primeiraCarta = null; 
            bloqueio = false; 

            // Verifica se todos os pares foram encontrados
            if (paresEncontrados === totalPares()) {
                // Finaliza o jogo
                setTimeout(() => {
                    calcularPontuacao(); 
                    alert("Você ganhou! Pontuação: " + pontuacao);
                    atualizarRanking();
                    venceu = true;
                    if (confirm("Deseja jogar novamente?")) {
                        resetarCartas();
                        iniciarJogo(); // Reinicia o jogo
                    } else{
                        reiniciarJogo();
                    }
                }, 500);
            }
        } else {
            // Se não correspondem, vira de volta após um pequeno atraso
            setTimeout(() => {
                primeiraCarta.classList.remove('virada');
                segundaCarta.classList.remove('virada');
                primeiraCarta = null; // Reseta a primeira carta
                bloqueio = false; // Libera novos cliques
            }, 1000); 
        }
    }
}

// Função que calcula a pontuação
function calcularPontuacao() {
    if (document.getElementById('game-facil').style.display === 'block') {
        pontuacao = tempoRestante * 10; // 10 pontos por segundo
    } else if (document.getElementById('game-dificil').style.display === 'block') {
        pontuacao = tempoRestante * 15; // 15 pontos por segundo
    }
    salvarPontuacao();
}

// Função que embaralha as cartas
function embaralharCartas(cartas) {
    const cartasArray = Array.from(cartas); 
    const shuffledArray = []; 

    while (cartasArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * cartasArray.length); 
        shuffledArray.push(cartasArray[randomIndex]); 
        cartasArray.splice(randomIndex, 1); 
    }

    shuffledArray.forEach(carta => {
        carta.parentNode.appendChild(carta); 
    });
}

// Função que conta os pares
function totalPares() {
    return (cartasFacil ? cartasFacil.length : 0) / 2 + (cartasDificil ? cartasDificil.length : 0) / 2; 
}

// Função que atualiza o cronometro
function atualizarCronometro() {
    tempoRestante--;

    // Atualiza o cronômetro dependendo da dificuldade
    if (tempoRestante >= 0) {
        if (document.getElementById('game-facil').style.display === 'block') {
            document.getElementById('cronometro').textContent = tempoRestante;
        } else if (document.getElementById('game-dificil').style.display === 'block') {
            document.getElementById('cronometro-dificil').textContent = tempoRestante;
        }
    }
    
    if (tempoRestante === 0 && venceu === false) {
        clearInterval(cronometroInterval);
        finalizarJogo();
    } 
}

// Função para finalizar o jogo
function finalizarJogo() {
    clearInterval(cronometroInterval); 

    alert("Você perdeu! O tempo acabou.");
    
    if (confirm("Deseja jogar novamente?")) {
        resetarCartas();
        iniciarJogo(); 
    } else {
        alert("Obrigado por jogar!"); 
        reiniciarJogo(); 
    }
}

// Função para atualizar o Rank
function atualizarRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = ''; 

    ranking.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome}: ${item.pontuacao}`; 
        rankingList.appendChild(li); 
    });
}

// Função para salvarPontuação
function salvarPontuacao() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ nome: nomeJogador, pontuacao: pontuacao }); 

    // Mantém as 20 melhores pontuações
    ranking.sort((a, b) => b.pontuacao - a.pontuacao);
    localStorage.setItem('ranking', JSON.stringify(ranking.slice(0, 20))); 
}

// Função para reiniciar o Jogo
function reiniciarJogo() {

    if (document.getElementById('ranking-container')) {
        document.getElementById('ranking-container').style.display = 'none';
    }
    if (document.getElementById('game-facil')) {
        document.getElementById('game-facil').style.display = 'none';
    }
    if (document.getElementById('game-dificil')) {
        document.getElementById('game-dificil').style.display = 'none';
    }
    if (document.getElementById('game-pc')) {
        document.getElementById('game-pc').style.display = 'none';
    }


    // Mostra a tela inicial novamente
    if (document.getElementById('principal')) {
        document.getElementById('principal').style.display = 'flex';
    }
    tempoConcluido = true;
    nomeJogador = null;

    resetarCartas();
}
