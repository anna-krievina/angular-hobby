const PROXY_CONFIG = [
  {
    context: [
      "/TicTacToe/api/GetMove",
      "/TicTacToe/api/CalculateGameOver",
      "/Calculator/api/Calculate",
      "/Calculator/api/NegateResult"
    ],
    target: "https://localhost:7036",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
