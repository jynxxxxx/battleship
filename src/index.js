import { initialize } from "./initialize";
import { gameplay } from "./gameplay";

initialize()
  .then(({ player1, computer, done }) => {
    if (done) {
      // Start the gameplay function when initialize is done and 'done' is true

      const directionbtn = document.querySelector(".direction");
      directionbtn.remove();

      gameplay(player1, computer);
    } else {
      console.log("Initialization failed: Not all ships are placed.");
    }
  })
  .catch((error) => {
    console.log("Initialization failed:", error);
  });
