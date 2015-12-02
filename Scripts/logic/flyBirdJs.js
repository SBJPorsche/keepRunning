// define a user behaviour
var flyBirdJs = qc.defineBehaviour('qc.engine.flyBirdJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
}, {
});

// Awake is called when the script instance is being loaded.
flyBirdJs.prototype.awake = function() {
};

// Update is called every frame, if the behaviour is enabled.
flyBirdJs.prototype.update = function() {
	var self = this;
    if(self.gameObject.y < 0){
        self.gameObject.destroy();
    }
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }    
};

flyBirdJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
    G.playerDead = true;
};

flyBirdJs.prototype.onClick = function() {
    var self = this;
    self.gameObject.destroy();
    G.bgRun = true;
};

