// define a user behaviour
var mathbord = qc.defineBehaviour('qc.engine.mathbord', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
}, {
});

// Awake is called when the script instance is being loaded.
mathbord.prototype.awake = function() {
};

// Update is called every frame, if the behaviour is enabled.
mathbord.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

mathbord.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

mathbord.prototype.onClick = function() {
};


