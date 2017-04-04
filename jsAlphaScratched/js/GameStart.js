function main() {
  createInputQueueGame();
}

function createInputQueueGame() {
  var canvas, stage;
  var maplayout, tileSheet;
  var tiles;
  var player;
  var bit;

  canvas = document.getElementById("canvas");
  stage = new createjs.Stage(canvas);

  maplayout = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  tileSheet = new createjs.SpriteSheet({
    "images": ["assets/floortiles40px.png"],
    "frames": {
      "height": 40,
      "width": 40,
      "regX": 0,
      "regY": 0,
      "count": 14
    }
  });

  var characterSheet = new createjs.SpriteSheet({
    "images": ["assets/spritesheet_2.png"],
    "frames": {"height": 42, "width": 42, "count": 74, "regX": 0, "regY": 1, "spacing": 1, "margin": 1},
    "animations": {
      "wkForward": [0, 6],
      "wkRight": [9, 17],
      "wkLeft": [18, 26],
      "wkBackward": [27, 33],
      "fcForward": [0],
      "fcRight": [9],
      "fcLeft": [18],
      "fcBackward": [27],
      "shieldR": [36,42],
      "shieldL": [45,51],
      "shieldF": [54,60],
      "shieldB": [63,69]
      }
  });

  var bitSheet = new createjs.SpriteSheet({
    "images": ["assets/bitSprite36px.png"],
    "frames": {"height": 36, "width": 36, "count": 15, "regX": 18, "regY": 18},
    "animations": {
      "idle": [0, 3],
      "agro": [5, 8],
      "charge": [10, 14]
    }
  });

  levelmap = new map(maplayout, stage, tileSheet);
  var cr = [1, 4];
  var bcr = [8,4];
  player = new playerclass(cr, levelmap, stage, characterSheet);
  bit = new monsterclass(bcr, levelmap, stage, bitSheet, player);

  var gameEntity = new GameEntity(cr, levelmap, 42, 42, player);

  var gameEntities = new Array();
  gameEntities[0] = gameEntity;

  var inputQueue = new Queue(USER_INPUT_BUFFER_CAPACITY);
  var gameLoop = new GameLoop(gameEntities, inputQueue, "canvas");

  gameLoop.start();
}

function runCode() {
  var code = editor.getValue();
  eval(code);
}
