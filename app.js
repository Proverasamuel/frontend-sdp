// Importar módulos necessários do Firebase v11.1.0
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getDatabase, ref, set, update, onValue } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAkJae6gGTeYkjsFeUpPxmLDuvEAEoay-w",
  authDomain: "jogo-da-velha-17ea3.firebaseapp.com",
  databaseURL: "https://jogo-da-velha-17ea3-default-rtdb.firebaseio.com",
  projectId: "jogo-da-velha-17ea3",
  storageBucket: "jogo-da-velha-17ea3.appspot.com",
  messagingSenderId: "890129790192",
  appId: "1:890129790192:web:4ee41bf6ba3c8d48e8fe35",
  measurementId: "G-N65SGQDMEB"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Variáveis do Jogo
let playerId = Math.random().toString(36).substr(2, 9); // Identificador único do jogador
let currentPlayer = null; // Papel do jogador atual (X ou O)
let playerTurn = null; // Jogador que deve jogar
let board = Array(16).fill(null); // Tabuleiro 4x4
const gameRef = ref(database, 'game'); // Referência ao jogo no banco de dados

// Inicializar o jogo no Firebase
function initGame() {
  set(gameRef, {
    board: Array(16).fill(null),
    currentPlayer: 'X',
    players: { playerX: null, playerO: null },
    status: 'waiting' // Status inicial do jogo
  }).catch(error => console.error("Erro ao inicializar o jogo:", error));
}

// Atribuir papel ao jogador (X ou O)


// Atribuir papel ao jogador (X ou O)
function assignPlayerRole(playerId) {
  const playersRef = ref(database, 'game/players');
  onValue(playersRef, (snapshot) => {
    const players = snapshot.val() || {};
    
    // Atribuindo X se playerX não existir
    if (!players.playerX) {
      set(ref(database, 'game/players/playerX'), playerId);
      currentPlayer = 'X';
      document.getElementById('message').textContent = "Você é o jogador X. Aguardando outro jogador...";
    } 
    // Atribuindo O se playerO não existir
    else if (!players.playerO) {
      set(ref(database, 'game/players/playerO'), playerId);
      currentPlayer = 'O';
      document.getElementById('message').textContent = "Você é o jogador O. Jogo começando!";
      
      // Atualizar status para "playing" quando o segundo jogador se conectar
      update(gameRef, { status: 'playing' });
    } 
    // Se ambos os jogadores já estiverem no jogo, não faz nada
    else {
      document.getElementById('message').textContent = "O jogo já está cheio!";
    }
  });
}



// Sincronizar o estado do jogo com o Firebase
// Sincronizar o estado do jogo com o Firebase
// Sincronizar o estado do jogo com o Firebase
// Sincronizar o estado do jogo com o Firebase
onValue(gameRef, (snapshot) => {
  const gameData = snapshot.val();
  if (gameData) {
    board = Array.isArray(gameData.board) ? gameData.board : Array(16).fill(null);
    playerTurn = gameData.currentPlayer || 'X'; // Atualiza o turno do jogador a partir do Firebase
    const status = gameData.status;
    
    if (status === 'waiting') {
      const players = gameData.players || {};
      const message = (players.playerX && players.playerO)
        ? "Jogo começando! Aguardando o segundo jogador..."
        : "Aguardando outro jogador...";
      document.getElementById('message').textContent = message;
    } else if (status === 'playing') {
      createBoard();
      const message = playerTurn === currentPlayer
        ? "Sua vez!"
        : `Aguarde, é a vez do jogador ${playerTurn}`;
      document.getElementById('message').textContent = message;
    }
  }
  console.log("Player Turn:", playerTurn);
console.log("Current Player:", currentPlayer);
console.log("Game Data:", gameData);

});




// Criar o tabuleiro
// Criar o tabuleiro
function createBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  if (Array.isArray(board)) { // Verificar se board é um array
    board.forEach((cell, index) => {
      const cellElement = document.createElement('div');
      cellElement.textContent = cell || '';
      cellElement.onclick = () => makeMove(index);
      boardElement.appendChild(cellElement);
    });
  }
}


// Fazer uma jogada
// Fazer uma jogada
function makeMove(index) {
  if (board[index] || currentPlayer !== playerTurn) {
    document.getElementById('message').textContent = "Não é sua vez!";
    return;
  }
  
  // Atualiza o tabuleiro com a jogada
  board[index] = currentPlayer;

  // Alterna o jogador (de X para O e vice-versa)
  const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';

  // Atualiza o banco de dados com a nova jogada e o turno do próximo jogador
  update(gameRef, { board, currentPlayer: nextPlayer });

  // Verificar se há um vencedor após a jogada
  checkWinner();
}


// Verificar vencedor ou empate
function checkWinner() {
  const winPatterns = [
    [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // Linhas horizontais
    [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // Colunas verticais
    [0, 5, 10, 15], [3, 6, 9, 12] // Diagonais
  ];

  for (const pattern of winPatterns) {
    const [a, b, c, d] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
      document.getElementById('message').textContent = `${board[a]} venceu!`;
      return;
    }
  }

  if (board.every(cell => cell !== null)) {
    document.getElementById('message').textContent = 'Empate!';
  }
}

// Inicializar o jogo ao carregar a página
initGame();
assignPlayerRole(playerId);
