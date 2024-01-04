import { initialize } from "./initialize";
import { gameplay } from "./gameplay";

initialize()
  .then(({ player1, computer, done }) => {
    if (done) {

      const directionctn = document.querySelector(".dirctn");
      directionctn.remove();

      gameplay(player1, computer);
    } else {
      console.log("Initialization failed: Not all ships are placed.");
    }
  })
  .catch((error) => {
    console.log("Initialization failed:", error);
  });
