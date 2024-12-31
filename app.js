// Importação das dependências do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAkJae6gGTeYkjsFeUpPxmLDuvEAEoay-w",
  authDomain: "jogo-da-velha-17ea3.firebaseapp.com",
  databaseURL: "https://jogo-da-velha-17ea3-default-rtdb.firebaseio.com",
  projectId: "jogo-da-velha-17ea3",
  storageBucket: "jogo-da-velha-17ea3.firebasestorage.app",
  messagingSenderId: "890129790192",
  appId: "1:890129790192:web:4ee41bf6ba3c8d48e8fe35",
  measurementId: "G-N65SGQDMEB"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Variáveis do Jogo
let currentPlayer = 'X';
let board = Array(16).fill(null);
let gameRef = ref(database, 'game');

// Inicializando o tabuleiro
function createBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.textContent = cell;
    cellElement.onclick = () => makeMove(index);
    boardElement.appendChild(cellElement);
  });
}

// Função para fazer um movimento
function makeMove(index) {
  if (board[index] || !gameRef) return; // Se a célula já tiver algo ou se o jogo não foi inicializado

  board[index] = currentPlayer;
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  set(gameRef, { board });

  checkWinner();
  createBoard();
}

// Função para verificar se há um vencedor
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

// Atualizar o estado do jogo com Firebase
onValue(gameRef, (snapshot) => {
  const gameData = snapshot.val();
  if (gameData) {
    board = gameData.board || board;
    currentPlayer = gameData.currentPlayer || 'X';
    createBoard();
  }
});

// Inicializar o jogo
function initGame() {
  set(gameRef, {
    board: Array(16).fill(null),
    currentPlayer: 'X'
  });
}

initGame();
