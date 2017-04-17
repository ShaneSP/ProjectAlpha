//3 TODO

/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */
function GameView(model, elements) {
    this._model = model;
    //html elements
    this._elements = elements;

    this.updatedGraphics = new Event(this);
    this.runCode = new Event(this);

    var _this = this;

    // attach model listeners here
    this._model.inputEvent.attach(function (sender, args) {
      _this.processInput(args);
    });

    this._model.entityAdded.attach(function () {
      _this.addBit();
    });

    this._model.entityRemoved.attach(function () {
      _this.processInput();
    });

    //attach listeners to runcode button
    this._elements.button.click(function () {
      _this.runCode.notify();
    });
}

GameView.prototype = {
    show : function () {
      this.update();
      var animationsDone = true;
      for(var i=0; i<GAME_ENTITIES.length; i++) {
        var gameEntity = GAME_ENTITIES[i];
        animationsDone = animationsDone && gameEntity.animationDone();
      }
      if (!animationsDone) {
        return;
      }
      if (!this._model._queue.isEmpty()) {
        var inputEvent = this._model._queue.pop();
        for(var i=0; i<GAME_ENTITIES.length; i++) {
    			var gameEntity = GAME_ENTITIES[i];
          gameEntity.processAnimation(inputEvent[1]);
        }
      }
    },

    update : function (a) {
        //TODO: Stage ticker
        for(var i=0; i<GAME_ENTITIES.length; i++) {
    			var gameEntity = GAME_ENTITIES[i];
    			gameEntity.updateGraphics(a);
        }
    },

    processInput : function(inputEvent) {
      console.log(inputEvent);
      for(var i=0; i<GAME_ENTITIES.length; i++) {
  			var gameEntity = GAME_ENTITIES[i];
        var animationaction = gameEntity.processInput(inputEvent[1]);
        this._model._queue.push([inputEvent[0], animationaction]);
      }
    },

    addBit : function() {
      BIT = new GameEntity([8,4],LEVEL_MAP,"bit");
      GAME_ENTITIES[1] = BIT;
    }

    // processInput : function () {
    //   var animationsDone = true;
    //   for(var i=0; i<GAME_ENTITIES.length; i++) {
    //     var gameEntity = GAME_ENTITIES[i];
    //     animationsDone = animationsDone && gameEntity.animationDone();
    //   }
    //   if (!animationsDone) {
    //     return;
    //   }
    //   if (!this._model._queue.isEmpty()) {
    //     var inputEvent = this._model._queue.pop();
    //     for(var i=0; i<GAME_ENTITIES.length; i++) {
    // 			var gameEntity = GAME_ENTITIES[i];
    //       gameEntity.processInput(inputEvent); //TODO: change gameEntity's processInput()
    //     }
    //     this.update(inputEvent);
    //   }
    // }
};

/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */
function GameController(model, view) {
    this._model = model;
    this._view = view;

    var _this = this;

    this._view.runCode.attach(function () {
      console.log("attaching runCode");
      _this.runCode();
    })
}

GameController.prototype = {
    runCode : function() {
      var code = editor.getValue();
      eval(code);
    },

    moveRight : function() {
      console.log("moveRight");
      this._model.inputEvent.notify(["player","wkRight"]);
    },

    moveLeft : function() {
      console.log("moveLeft");
      this._model.inputEvent.notify(["player","wkLeft"]);
    },

    addEnemy : function() {
      this._model.entityAdded.notify();
    }
};