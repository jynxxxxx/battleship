function gameplay(player1, computer) {
  let currentPlayer = player1;
  let gameOver = false;

  function switchPlayer() {
    currentPlayer = currentPlayer === player1 ? computer : player1;
  }

  function checkGameOver() {
    if (player1.ships.every((ship) => ship.isSunk())) {
      gameOver = true;
      const text = document.querySelector(".text");
      text.textContent = `${computer.name} wins! Game over.`;
    }
    if (computer.ships.every((ship) => ship.isSunk())) {
      gameOver = true;
      console.log("Game over for computer");
      const text = document.querySelector(".text");
      text.textContent = `${player1.name} wins! Game over.`;
    }
  }

  // Add event listeners to cells for player's attacks
  const cells = document.querySelectorAll(".compBoard .cell");
  const text = document.querySelector(".text");

  cells.forEach(function (cell) {
    cell.addEventListener(
      "click",
      () => {
        if (currentPlayer === player1 && !gameOver) {
          const x = cell.getAttribute("data-xcoord");
          const y = cell.getAttribute("data-ycoord");
          text.textContent = `You attacked ${y}${x}`;
          setTimeout(() => {
            computer.attackEnemy(x, y); // Player attacks the computer
            console.log("playerdone");

            checkGameOver();
            switchPlayer();
          }, 500);

          setTimeout(() => {
            // After the player's turn, it's the computer's turn
            if (!gameOver) {
              const computerAttack = computer.computerAttack(); // Implement computer's attack logic
              const computerAttackX = computerAttack.x;
              const computerAttackY = computerAttack.y;
              text.textContent = `The Enemy attacked ${computerAttackY}${computerAttackX}`;
              setTimeout(() => {
                player1.receiveAttack(
                  computerAttackX,
                  computerAttackY,
                  computer,
                ); // Computer attacks the player
                console.log("compdone");

                checkGameOver();
                switchPlayer();
              }, 700);
            }
          }, 1500);
          cell.removeEventListener("click", this);
        }
      },
      { once: true },
    );
  });
}

export { gameplay };
