var stage, loader;
var character;
var bit;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var xVel = 4;
var moveLeft = false;
var moveRight = false;
var characterWidth = 23;
var characterHeight = 38;

function init() {
  stage = new createjs.Stage(canvas);

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleComplete);
  loader.loadFile({id:"character", src:"assets/spritegridside.png"});
  loader.loadFile({id:"bit", src:"assets/bitSpriteIdle.png"});

}

function handleComplete() {
  var spriteSheet = new createjs.SpriteSheet({
    framerate: 1,
    "images": [loader.getResult("character")],
    "frames": {"height": 38, "width": 23, "count": 20, "regX": 0, "regY": 1, "spacing": 1, "margin": 1},
    "animations": {
      "wkRight": [11,19],
      "stand": [10],
      "wkLeft": [0,8]
    }
  });
  var spriteSheetBit = new createjs.SpriteSheet({
    framerate: 1,
    "images": [loader.getResult("bit")],
    "frames": {"height":28, "width": 28, "count": 4, "regX":14, "regY":14, "spacing": 0},
    "animations": {"idle":[0,1,2,3,2,1]}
  });
  bit = new createjs.Sprite(spriteSheetBit,"idle");
  bit.x = 30;
  bit.y = 30;
  character = new createjs.Sprite(spriteSheet, "stand");

  stage.addChild(character);
  stage.addChild(bit);

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.setInterval(25);
  createjs.Ticker.setFPS(40);
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
}

function handleKeyDown(e) {
    switch(e.keyCode) {
        case KEYCODE_LEFT:
        case 65:
            moveLeft = true;
            character.spriteSheet.getAnimation("wkRight").frequency = 0.5;
            if (character.currentAnimation != "wkRight" ) {
                moveRight = false;
                character.gotoAndPlay("wkRight");
            }
            break;
        case KEYCODE_RIGHT:
        case 68:
            moveRight = true;
            character.spriteSheet.getAnimation("wkLeft").frequency = 0.5;

            if (character.currentAnimation != "wkLeft" ) {
                moveLeft = false;
                character.gotoAndPlay("wkLeft");
            }
            break;
    }
}

function handleKeyUp(e) {
    switch(e.keyCode) {
        case KEYCODE_LEFT:
        case 65:
            moveLeft = false;
            moveRight = false;
            if (character.currentAnimation != "stand" ) {
                character.gotoAndStop("stand");
            }
            break;
        case KEYCODE_RIGHT:
        case 68:
            moveRight = false;
            moveLeft = false;
            if (character.currentAnimation != "stand" ) {
                character.gotoAndStop("stand");
            }
            break;
    }
}

function tick(event) {
  var speedControl = createjs.Ticker.getTicks() % 4;
  if(speedControl == 0) {
      if(moveLeft) {
          character.x -= xVel;
          if(character.scaleX > 0) {
              character.scaleX *= -1;
              character.x += characterWidth;
          }
      } else if(moveRight) {
          character.x += xVel;
          if(character.scaleX > 0) {
              character.scaleX *= -1;
              character.x -= characterWidth;
          }
      }
      stage.update();
  }
}
