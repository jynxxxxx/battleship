import { Ship, Player } from "./classes";

function initialize() {
  return new Promise((resolve) => {
    const player1 = new Player("Player");

    const playerCarrier = new Ship("Carrier", 5);
    const playerBattleship = new Ship("Battleship", 4);
    const playerCruiser = new Ship("Cruiser", 3);
    const playerSubmarine = new Ship("Submarine", 3);
    const playerDestroyer = new Ship("Destroyer", 2);

    const playerGameboard = player1.gameboard;
    player1.ships = [
      playerCarrier,
      playerBattleship,
      playerCruiser,
      playerSubmarine,
      playerDestroyer,
    ];

    const playerShips = player1.ships;

    const compCarrier = new Ship("Carrier", 5);
    const compBattleship = new Ship("Battleship", 4);
    const compCruiser = new Ship("Cruiser", 3);
    const compSubmarine = new Ship("Submarine", 3);
    const compDestroyer = new Ship("Destroyer", 2);

    const computer = new Player("Computer");
    computer.ships = [
      compCarrier,
      compBattleship,
      compCruiser,
      compSubmarine,
      compDestroyer,
    ];


    computer.gameboard.randomShipPlacement(computer.ships);

    let isVertical = true;

    const toggleDirection = document.querySelector(".direction");

    toggleDirection.addEventListener("click", () => {
      isVertical = !isVertical;

      if (!isVertical) {
        toggleDirection.textContent = "Horizontal";
      } else {
        toggleDirection.textContent = "Vertical";
      }
    });

    const cells = document.querySelectorAll(".cell");

    // Attach the event listeners to each cell
    cells.forEach((cell) => {
      cell.addEventListener('mouseover', hoverEvent);
      cell.addEventListener('mouseleave', leaveEvent);
      cell.addEventListener('click', shipEvent);
    });

    let currentShipIndex = 0;

    // Add event listeners to cells for ship placement
    function shipEvent() {
      const cell = this;
      const startX = cell.getAttribute("data-xcoord");
      const startY = cell.getAttribute("data-ycoord");
      const name = cell.getAttribute("data-player");
      const currentShip = playerShips[currentShipIndex];
      const text = document.querySelector(".text");

      // Check if the ship can be placed at the clicked cell
      if (
        playerGameboard.placementValid(
          currentShip,
          startX,
          startY,
          isVertical,
        ) &&
        name === "Player"
      ) {
        // Place the ship on the gameboard
        playerGameboard.placeShip(currentShip, startX, startY, isVertical);

        // Move to the next ship
        currentShipIndex++;

        console.log(currentShipIndex)
        console.log(playerShips.length)
        // Check if all ships have been placed
        if (currentShipIndex === playerShips.length) {
          console.log("All player ships have been placed.");

          cells.forEach(function (cell) {
            cell.removeEventListener("click", shipEvent);
            cell.removeEventListener("mouseover", hoverEvent);
            cell.removeEventListener("mouseleave", leaveEvent);
            leaveEvent()
          });

          text.textContent = `All Ships Have Been Placed!  Make the first attack`;

          resolve({ player1, computer, done: true });
        }

        text.textContent = `Place your ${playerShips[currentShipIndex].name}`;
      }
    }

    function hoverEvent() {
      const startX = this.getAttribute("data-xcoord");
      const startY = this.getAttribute("data-ycoord");
      const name = this.getAttribute('data-player');
      const shipSize = playerShips[currentShipIndex].size;

      if (name === 'Player') {
        if (playerGameboard.placementValid(playerShips[currentShipIndex], startX, startY, isVertical)) {
          for (let i = 0; i < shipSize; i++) {
            let x, y;

            if (isVertical) {
              x = startX;
              y = String.fromCharCode(startY.charCodeAt(0) + i);
            } else {
              console.log('horizontal')
              x = parseInt(startX) + i;
              y = startY;
            }

            const cell = document.querySelector(`.cell[data-xcoord='${x}'][data-ycoord='${y}'][data-player='Player']`);

            if (i === 0 && isVertical) {
              cell.classList.add('hover1V');
            }
            else if (i === 0 && !isVertical) {
              cell.classList.add('hover1H');
            }
            else if (i === shipSize - 1 && isVertical) {
              cell.classList.add('hoverEndV');
            }
            else if (i === shipSize - 1 && !isVertical) {
              cell.classList.add('hoverEndH');
            }
            else if (isVertical) {
              cell.classList.add('hoverV');
            } else {
              cell.classList.add('hoverH')
            }

          }
        } else {
          for (let i = 0; i < shipSize; i++) {
            let x, y;

            if (isVertical) {
              x = startX;
              y = String.fromCharCode(startY.charCodeAt(0) + i);
            } else {
              x = parseInt(startX) + i;
              y = startY;
            }

            const cell = document.querySelector(`.cell[data-xcoord='${x}'][data-ycoord='${y}'][data-player='Player']`);

            if (i === 0 && isVertical) {
              cell.classList.add('invalid1V');
            }
            else if (i === 0 && !isVertical) {
              cell.classList.add('invalid1H');
            }
            else if (isVertical) {
              cell.classList.add('invalidV');
            } else {
              cell.classList.add('invalidH')
            }
          }
        }
      }
    }


    function leaveEvent() {
      console.log("Leave event triggered.");

      cells.forEach((cell) => {
        cell.classList.remove('hoverV');
        cell.classList.remove('hoverH');
        cell.classList.remove('hover1V');
        cell.classList.remove('hover1H');
        cell.classList.remove('hoverEndV');
        cell.classList.remove('hoverEndH');
        cell.classList.remove('invalidV');
        cell.classList.remove('invalidH');
        cell.classList.remove('invalid1V');
        cell.classList.remove('invalid1H');
      });
    }

    const getPlayerNameButton = document.querySelector(".start");

    getPlayerNameButton.addEventListener("click", () => {
      const playerName = document.getElementById("name").value;

      const playerLabel = document.querySelector(".player");
      playerLabel.textContent = playerName;
      player1.name = playerName;

      ClearPopUp();
    });
    return { player1, computer };
  });
}

function ClearPopUp() {
  const overlay = document.querySelector(".overlay");
  const formcontainer = document.querySelector(".formcontainer");

  overlay.style.display = "none";
  formcontainer.innerHTML = "";
}

export { initialize, ClearPopUp };
