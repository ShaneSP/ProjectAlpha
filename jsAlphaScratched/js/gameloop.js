/*
* @public
* @constructor
* @param{Array} Array of GameEntity objects
*/

function GameLoop(gameEntities, inputQueue, canvasId) {

    window.requestAnimationFrame =
        window.requestAnimationFrame ||        //Chrome
        window.mozRequestAnimationFrame ||     //Firefox
        window.webkitRequestAnimation Frame || //Safari
        window.msRequestAnimationFrame;        //IE

    if(!window.requestAnimationFrame) {
        throw new Exception("Failed to get requestAnimationFrame function");
    }

    this.gameEntities = gameEntities;
    this.inputQueue = inputQueue;

    this.canvas = document.getElementById("canvasId");
    this.context = this.canvas.getContext('2d');

    this.ups = -1;
    this.fps = -1;
    this.lastUpsCount = 0;
    this.lastFpsCount = 0;
    this.lastSpeedMeasureTime = new Date().getTime();

    this.lastLoopCallTime = 0;
    this.accumulatedTimeMs = 0;

    /*
    * @public
    */
    this.start function() {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.lastLoopCallTime = this.getCurrentTimeMs();

        this.update();
    };

    this.update = function() {
      var self = this;

      var actualLoopDurationMs = self.getCurrentTimeMs()-self.lastLoopCallTime;
      self.lastLoopCallTime = self.getCurrentTimeMs();
      self.accumulatedTimeMs += actualLoopDurationMs;
      while(self.accumulatedTimeMs>=FIXED_STEP_IDEAL_DURATION_MS) {
          self.updateState();
          self.accumulatedTimeMs -= FIXED_STEP_IDEAL_DURATION_MS;
      }

      self.updateGraphics();

      /*
		 * request a new graphics rendering, specifying this function as the function to be called back when
		 * the browser schedules a frame update
		 */
      window.requestAnimationFrame(function() {self.update();});
    };

    this.processInput = function() {
        while(!inputQueue.isEmpty()) {
            var inputEvent = inputQueue.pop();
            for(var i=0; i<this.gameEntities.length; i++) {
                var gameEntity = this.gameEntities[i];
                gameEntity.processInput(inputEvent);
            }
        }
    };

    this.updateState = function() {
        this.processInput();

        for(var i=0; i<this.gameEntities.length; i++) {
            var gameEntity = this.gameEntities[i];
            gameEntity.updateGraphics(this.context);
        }

        this.lastFpsCount++;
    };

    this.getCurrentTimeMs = function() {
        return new Date().getTime();
    }
}