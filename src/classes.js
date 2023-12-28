class Ship {
  constructor(name, size) {
    this.name = name
    this.size = size
    this.coordinates = []
    this.hitCount = 0
    this.sunk = false
  }

  hit() {
    this.hitCount += 1
    if (this.hitCount === this.size) {
      this.sunk = true
    }
  }

  isSunk() {
    if (this.size === this.hitCount) {
      this.sunk = true
      return `You sunk the ${this.name}`
    }
  }
}

class Gameboard {
  constructor(name) {
    this.name = name

    const xCoords = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const yCoords = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']


    const battlefield = document.querySelector('.battlefield')

    const boardctn = document.createElement('div')
    boardctn.classList.add('boardctn')
    if (this.name === 'Computer') {
      boardctn.classList.add('compBoard')
    } else {
      boardctn.classList.add('playerBoard')
    }
    battlefield.appendChild(boardctn)

    const rowLabels = document.createElement('div')
    rowLabels.classList.add('rowlabel')
    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('div')
      cell.classList.add('label')
      cell.textContent = yCoords[i]
      rowLabels.appendChild(cell)
    }

    boardctn.appendChild(rowLabels)

    const boardLabels = document.createElement('div')
    boardLabels.classList.add('boardlabel')
    if (this.name === 'Computer') {
      boardLabels.classList.add('comp')
      boardLabels.textContent = 'Computer'
    } else {
      boardLabels.classList.add('player')
      boardLabels.textContent = 'Player'
    }

    boardctn.appendChild(boardLabels)

    const columnLabels = document.createElement('div')
    columnLabels.classList.add('columnlabel')
    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('div')
      cell.classList.add('label')
      cell.textContent = i + 1
      columnLabels.appendChild(cell)
    }

    boardctn.appendChild(columnLabels)

    const board = document.createElement('div')
    board.classList.add('board')
    boardctn.appendChild(board)

    for (let i = 0; i < 10; i++) {
      const row = document.createElement('div')

      for (let y = 0; y < 10; y++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.dataset.xcoord = xCoords[y]
        cell.dataset.ycoord = yCoords[i]
        cell.dataset.player = `${name}`

        row.appendChild(cell)
      }
      row.classList.add('row')
      board.appendChild(row)
    }
  }

  placeShip(ship, startX, startY, isVertical) {
    if (this.placementValid(ship, startX, startY, isVertical)) {
      for (let i = 0; i < ship.size; i++) {
        const shipCell = document.querySelector(
          `.cell[data-xcoord='${startX}'][data-ycoord='${startY}'][data-player='${this.name}']`
        )
        shipCell.classList.add('ship')
        ship.coordinates.push({ x: startX, y: startY })
        shipCell.classList.add(`${ship.name}`)

        if (isVertical) {
          startY = String.fromCharCode(startY.charCodeAt(0) + 1)
        } else {
          startX++
        }
      }
      return true // Ship placed successfully
    }
    return false // Ship placement failed
  }

  placementValid(ship, startX, startY, isVertical) {
    // Check if the ship will fit on the gameboard
    if (
      isVertical &&
      startY.charCodeAt(0) + ship.size - 65 > 10
    ) {
      return false
    } else if (
      !isVertical &&
      parseInt(startX) + ship.size - 1 > 10
    ) {
      return false
    }
    // Check if the cells are already occupied by another ship
    for (let i = 0; i < ship.size; i++) {
      const cell = document.querySelector(
        `.cell[data-xcoord='${startX}'][data-ycoord='${startY}'][data-player='${this.name}']`
      )
      if (cell && cell.classList.contains('ship')) {
        return false
      }

      if (isVertical) {
        startY = String.fromCharCode(startY.charCodeAt(0) + 1)
      } else {
        startX++
      }
    }

    return true
  }

  randomShipPlacement(ships) {
    if (this.name === 'Computer') {
      const compShips = [...ships]

      for (let i = 0; i < compShips.length; i++) {
        const currentShip = compShips[i]

        while (true) {
          const startY = String.fromCharCode(65 + Math.floor(Math.random() * 10))
          const startX = Math.floor(Math.random() * 10) + 1
          const isVertical = Math.random() < 0.5 // Randomly choose vertical or horizontal placement

          if (this.placementValid(currentShip, startX, startY, isVertical)) {
            this.placeShip(currentShip, startX, startY, isVertical)
            console.log(`Placed ship ${currentShip.name}`)
            break
          } else {
            console.log(`Failed to place ship ${currentShip.name}, retrying...`)
          }
        }
      }
    }
  }
}

class Player {
  constructor(name) {
    this.name = name
    this.gameboard = new Gameboard(name)
    this.ships = []
    this.previousAttacks = new Set()
    this.lastHit = null // Store the coordinates of the last hit
    this.directions = ['up', 'down', 'left', 'right']
    this.currentDirection = ''
  }

  attackEnemy(x, y) {
    const text = document.querySelector('.text')

    const attackCell = document.querySelector(
      `.cell[data-xcoord='${x}'][data-ycoord='${y}'][data-player='Computer']`
    )

    let classes = Array.from(attackCell.classList)
    classes = classes.filter(className => className !== 'cell' && className !== 'ship')

    if (attackCell.classList.contains('ship')) {
      const hitShip = this.ships.find(ship => ship.name === classes[0])

      hitShip.hit()
      attackCell.classList.add('hit')
      attackCell.textContent = 'o'
      text.textContent = "It's a hit!"

      if (hitShip.isSunk()) {
        text.textContent = `You sunk their ${classes[0]}`
      }
      console.log('hit')
    } else {
      attackCell.classList.add('miss')
      attackCell.textContent = 'x'
      text.textContent = 'It missed'
      console.log('miss')
    }
  }

  receiveAttack(x, y, computer) {
    const attackCell = document.querySelector(
      `.cell[data-xcoord='${x}'][data-ycoord='${y}'][data-player='Player']`
    )
    const text = document.querySelector('.text')

    let classes = Array.from(attackCell.classList)
    classes = classes.filter(className => className !== 'cell' && className !== 'ship')

    if (attackCell.classList.contains('ship')) {
      const hitShip = this.ships.find(ship => ship.name === classes[0])

      hitShip.hit()
      attackCell.classList.add('hit')
      attackCell.textContent = 'o'
      text.textContent = "It's a hit!"
      computer.lastHit = { x, y }
      console.log(`x: ${computer.lastHit.x}, y: ${computer.lastHit.y}`)
      console.log('hit')

      if (hitShip.isSunk()) {
        computer.lastHit = null
        text.textContent = `Enemy sunk your ${classes[0]}`
      }

      return computer.lastHit
    } else {
      attackCell.classList.add('miss')
      attackCell.textContent = 'x'
      text.textContent = 'It missed'
      this.currentDirection = this.directions[Math.floor(Math.random() * this.directions.length)]
      console.log('miss')
    }
  }

  hitNextMove(lastHit) {
    // Calculate the next attack based on the current direction
    const { x, y } = lastHit

    console.log(`currDir: '${this.currentDirection}`)
    switch (this.currentDirection) {
      case 'up':
        return { x: x - 1, y }
      case 'down':
        return { x: x + 1, y }
      case 'left':
        return { x, y: String.fromCharCode(y.charCodeAt(0) - 1) }
      case 'right':
        return { x, y: String.fromCharCode(y.charCodeAt(0) + 1) }
      default:
        return null
    }
  }

  getDirection(prev, current) {
    // Determine the direction from the previous hit to the current attack
    if (prev.x === current.x) {
      if (prev.y < current.y) {
        return 'down'
      } else {
        return 'left'
      }
    } else if (prev.y === current.y) {
      if (prev.x < current.x) {
        return 'right'
      } else {
        return 'up'
      }
    } else {
      return this.directions[Math.floor(Math.random() * this.directions.length)]
    }
  }

  changeDirection(currentDirection) {
    // Function to change the current direction based on the previous hit
    switch (currentDirection) {
      case 'up':
        return 'down'
      case 'down':
        return 'left'
      case 'left':
        return 'right'
      case 'right':
        return 'up'
      default:
        return this.directions[Math.floor(Math.random() * this.directions.length)]
    }
  }

  computerAttack() {
    let x, y

    if (this.lastHit) {
      console.log(`Last hit coordinates: x: ${this.lastHit.x}, y: ${this.lastHit.y}`)
    } else {
      console.log('No last hit')
    }

    if (this.lastHit) {
      let failcount = 0

      while (failcount < 4) {
        let nextMove = this.hitNextMove(this.lastHit)

        if (!isValidCoordinate(nextMove.x, nextMove.y) || this.previousAttacks.has(`${nextMove.x}${nextMove.y}`)) {
          this.currentDirection = this.changeDirection(this.currentDirection)
          console.log(`Changing direction to: ${this.currentDirection}`)
          nextMove = this.hitNextMove(this.lastHit)
          failcount += 1
        } else {
          // Valid move and not attacked, so attack it
          x = nextMove.x
          y = nextMove.y
          console.log(`Valid! This move: x: ${x}, y: ${y}`)
          break
        }
      }

      if (failcount === 4) {
        // If no valid moves after 4 attempts, make a random move
        x = Math.floor(Math.random() * 10) + 1
        y = String.fromCharCode(65 + Math.floor(Math.random() * 10))
        console.log(`No valid moves after 4 attempts: x: ${x}, y: ${y}`)
        this.lastHit = ''
        failcount = 0
      }
    } else {
      do {
        x = Math.floor(Math.random() * 10) + 1
        y = String.fromCharCode(65 + Math.floor(Math.random() * 10))
        console.log(`Random move: x: ${x}, y: ${y}`)
        this.currentDirection = this.directions[Math.floor(Math.random() * this.directions.length)]
      } while (this.previousAttacks.has(`${x}${y}`) || !isValidCoordinate(x, y))
      console.log('No last hit, making a random move')
    }

    // Store the attack in the set of previous attacks
    this.previousAttacks.add(`${x}${y}`)

    console.log(`Current direction: ${this.currentDirection}`)

    return { x, y }
  }
}

function isValidCoordinate(x, y) {
  const minX = 1
  const maxX = 10
  const minY = 'A'.charCodeAt(0)
  const maxY = 'J'.charCodeAt(0)

  if (typeof x !== 'number' || typeof y !== 'string') {
    return false // Return false if x or y is not in the expected format
  }

  const yCharCode = y.charCodeAt(0)

  return yCharCode >= minY && xCharCode <= maxY && x >= minX && x <= maxX
}

module.exports = { Ship, Gameboard, Player }
