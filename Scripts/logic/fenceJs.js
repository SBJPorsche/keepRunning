// define a user behaviour
var fenceJs = qc.defineBehaviour('qc.engine.fenceJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    this.fence = null;
    this.player = null;
}, {
    fence: qc.Serializer.NODE,
    player: qc.Serializer.NODE
});

// Awake is called when the script instance is being loaded.
fenceJs.prototype.awake = function() {
};

// Update is called every frame, if the behaviour is enabled.
fenceJs.prototype.update = function() {

};

fenceJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

fenceJs.prototype.onClick = function() {
    this.gameObject.destroy();
    G.bgRun = true;
};
