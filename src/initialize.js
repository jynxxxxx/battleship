import { Ship, Player } from './classes'

function initialize () {
  return new Promise((resolve) => {
    const player1 = new Player('Player')

    const playerCarrier = new Ship('Carrier', 5)
    const playerBattleship = new Ship('Battleship', 4)
    const playerCruiser = new Ship('Cruiser', 3)
    const playerSubmarine = new Ship('Submarine', 3)
    const playerDestroyer = new Ship('Destroyer', 2)

    const playerGameboard = player1.gameboard
    player1.ships = [playerCarrier, playerBattleship, playerCruiser, playerSubmarine, playerDestroyer]
    // player1.ships = [playerDestroyer]
    const playerShips = player1.ships

    const compCarrier = new Ship('Carrier', 5)
    const compBattleship = new Ship('Battleship', 4)
    const compCruiser = new Ship('Cruiser', 3)
    const compSubmarine = new Ship('Submarine', 3)
    const compDestroyer = new Ship('Destroyer', 2)

    const computer = new Player('Computer')
    computer.ships = [compCarrier, compBattleship, compCruiser, compSubmarine, compDestroyer]
    // computer.ships = [compDestroyer]

    computer.gameboard.randomShipPlacement(computer.ships)

    let isVertical = true

    const toggleDirection = document.querySelector('.direction')

    toggleDirection.addEventListener('click', () => {
      isVertical = !isVertical

      if (!isVertical) {
        toggleDirection.textContent = 'Horizontal'
      } else {
        toggleDirection.textContent = 'Vertical'
      }
    })

    const cells = document.querySelectorAll('.cell')

    let currentShipIndex = 0

    // Add event listeners to cells for ship placement
    function shipEvent () {
      const cell = this
      const startX = cell.getAttribute('data-xcoord')
      const startY = cell.getAttribute('data-ycoord')
      const name = cell.getAttribute('data-player')
      const currentShip = playerShips[currentShipIndex]

      // Check if the ship can be placed at the clicked cell
      if (playerGameboard.placementValid(currentShip, startX, startY, isVertical) && (name === 'Player')) {
        // Place the ship on the gameboard
        playerGameboard.placeShip(currentShip, startX, startY, isVertical)

        // Move to the next ship
        currentShipIndex++

        // Check if all ships have been placed
        if (currentShipIndex === playerShips.length) {
          console.log('All player ships have been placed.')
          resolve({ player1, computer, done: true })
          cells.forEach(function (cell) {
            cell.removeEventListener('click', shipEvent)
          })
        } else {
          console.log(`Place ${playerShips[currentShipIndex].name} on the board.`)
        }
      }
    }
    // Add event listeners to cells for ship placement
    cells.forEach(function (cell) {
      cell.addEventListener('click', shipEvent)
    })

    const getPlayerNameButton = document.querySelector('.start')

    getPlayerNameButton.addEventListener('click', () => {
      const playerName = document.getElementById('name').value

      const playerLabel = document.querySelector('.player')
      playerLabel.textContent = playerName
      player1.name = playerName

      ClearPopUp()
    })
    return { player1, computer }
  })
}

function ClearPopUp () {
  const overlay = document.querySelector('.overlay')
  const formcontainer = document.querySelector('.formcontainer')

  overlay.style.display = 'none'
  formcontainer.innerHTML = ''
}

export { initialize, ClearPopUp }
