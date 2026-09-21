/* =====================================================================  
   game.js  --  THE RULES AND THE LOOP.  
  
   The game is always in exactly ONE mode: "playing", "dead", "won",  
   or "next". Which mode it is in decides what happens each frame.  
   ===================================================================== */  
  
var Game = {  
  mode: "playing",   // "playing", "dead", "won", or "next"  
  levelNumber: 0,  
  deaths: 0,             // how many times you have died this session  
  wasRestartDown: false, // was R already held last frame?  
  wasJumpDown: false     // was a jump key already held last frame?  
};  
  
Game.startLevel = function (levelNumber) {  
  Game.levelNumber = levelNumber;  
  Level.build(levelNumber);  
  Crumble.reset();  
  Player.reset();  
  Game.mode = "playing";  
  Game.showMessage("");  
};  
  
Game.showMessage = function (text) {  
  document.getElementById("message").textContent = text;  
};  
  
// --- ONE FRAME --------------------------------------------------------  
Game.update = function () {  
  
  // R restarts only on the moment the key goes DOWN (press-edge fix).  
  var restartJustPressed = Input.restart && !Game.wasRestartDown;  
  Game.wasRestartDown = Input.restart;  
  if (restartJustPressed) {  
    Game.startLevel(Game.levelNumber);  
    return;  
  }  
  
  // SPACE advances to the next level after winning.  
  var jumpJustPressed = Input.jump && !Game.wasJumpDown;  
  Game.wasJumpDown = Input.jump;  
  if (Game.mode === "next" && jumpJustPressed) {  
    Game.startLevel(Game.levelNumber + 1);  
    return;  
  }  
  
  // If we are not playing, nothing moves. We just wait.  
  if (Game.mode !== "playing") { return; }  
  
  Player.update();  
  Crumble.update();  
  
  // The death check reports HOW you died, so the message tells the truth.  
  var death = Player.isDead();  
  if (death === "spike") {  
    Game.mode = "dead";  
    Game.deaths = Game.deaths + 1;  
    Game.showMessage("You hit a spike. Press R to try again. (Deaths: " + Game.deaths + ")");  
    return;  
  }  
  if (death === "fall") {  
    Game.mode = "dead";  
    Game.deaths = Game.deaths + 1;  
    Game.showMessage("You fell off the world. Press R to try again. (Deaths: " + Game.deaths + ")");  
    return;  
  }  
  
  if (Player.hasWon()) {  
    // Is there another level after this one?  
    var next = Game.levelNumber + 1;  
    if (next < Level.levels.length) {  
      Game.mode = "next";  
      Game.showMessage("Level complete! Push SPACE for the next one. (Deaths: " + Game.deaths + ")");  
    } else {  
      Game.mode = "won";  
      Game.showMessage("You beat every level! Push R to play again. (Deaths: " + Game.deaths + ")");  
    }  
    return;  
  }  
};  
  
// --- THE LOOP ITSELF --------------------------------------------------  
Game.loop = function () {  
  Game.update();  
  Draw.updateCamera();  
  Draw.everything();  
  window.requestAnimationFrame(Game.loop);  
};
