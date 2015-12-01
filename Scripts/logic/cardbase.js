// define a user behaviour
var cardbase = qc.defineBehaviour('qc.engine.cardbase', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
    self.timerShow = null;
    self.idx = 1;
}, {
});

// Awake is called when the script instance is being loaded.
cardbase.prototype.awake = function() {
    var self = this;
};

// Update is called every frame, if the behaviour is enabled.
cardbase.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }

    var frames = ['card_26.png','card_28.png','card_38.png'];
    self.idx++;
    if(self.idx%100 === 0){
        self.gameObject.frame = frames[G.game.math.random(0,2)];
    }
};

cardbase.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};
