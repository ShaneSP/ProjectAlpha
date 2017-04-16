//I think this one is done until we add future functionality

function GameModel(entities, inputQueue) {
    window.requestAnimationFrame =
        window.requestAnimationFrame ||        //Chrome
        window.mozRequestAnimationFrame ||     //Firefox
        window.webkitRequestAnimationFrame || //Safari
        window.msRequestAnimationFrame;

    if(!window.requestAnimationFrame) {
      throw new Exception("Failed to get requestAnimationFrame function");
    }

    this.lastSpeedMeasureTime = new Date().getTime();

    this.lastLoopCallTime = 0;
    this.accumulatedTimeMs = 0;

    this._entities = GAME_ENTITIES;
    this._queue = inputQueue;

    this.inputEvent = new Event(this);
    this.entityAdded = new Event(this);
    this.entityRemoved = new Event(this);
}

GameModel.prototype = {
    input : function (e) {
      var self = this;
      var actualLoopDurationMs = self.getCurrentTimeMs()-self.lastLoopCallTime;
      self.lastLoopCallTime = self.getCurrentTimeMs();
      self.accumulatedTimeMs += actualLoopDurationMs;
      while(self.accumulatedTimeMs>= FIXED_STEP_IDEAL_DURATION_MS) {
        self.inputEvent.notify({e});
        self.accumulatedTimeMs -= FIXED_STEP_IDEAL_DURATION_MS;
      }
    },

    addEntity : function (e) {
      this._entities.push(e);
      this.entityAdded.notify({e});
    },

    removeEntity : function (index) {
      var removed;
      removed = this._entities[index];
      this._entities.splice(index, 1);
      this.entityRemoved.notify({removed});
    },

    getCurrentTimeMs : function() {
  		return new Date().getTime();
  	}
};
