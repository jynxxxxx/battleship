const Ship = require("./classes").Ship;

test("ship", () => {
  const ship = new Ship("Cruiser", 3);
  expect(ship.size).toBe(3)
  expect(ship.hitCount).toBe(0);
  expect(ship.sunk).toBe(false);

  ship.hit();
  expect(ship.hitCount).toBe(1);

  ship.hit();
  expect(ship.hitCount).toBe(2);

  ship.hit();
  expect(ship.hitCount).toBe(3);

  ship.isSunk();
  expect(ship.sunk).toBe(true);
});
