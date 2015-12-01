// define a user behaviour
var cardJs = qc.defineBehaviour('qc.engine.cardJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
    self.idx = 1;
    self.parent = null;
}, {
    parent: qc.Serializer.NODE
});

// Awake is called when the script instance is being loaded.
cardJs.prototype.awake = function() {
    var self = this;
};

// Update is called every frame, if the behaviour is enabled.
cardJs.prototype.update = function() {

};

cardJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

cardJs.prototype.onClick = function() {
    var self = this;
    var frames = ['card_26.png','card_28.png','card_38.png'];
    if(self.parent.frame == this.gameObject.frame){
        self.parent.destroy();
        G.bgRun = true;
    }else{
        self.parent.frame = frames[G.game.math.random(0,2)];
    }
};