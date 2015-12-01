// define a user behaviour
var dbarrowJs = qc.defineBehaviour('qc.engine.dbarrowJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
}, {
});

// Awake is called when the script instance is being loaded.
dbarrowJs.prototype.awake = function() {
    var self = this;
};

// Update is called every frame, if the behaviour is enabled.
dbarrowJs.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

dbarrowJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

dbarrowJs.prototype.onClick = function() {
};




