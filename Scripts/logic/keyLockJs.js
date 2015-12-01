// define a user behaviour
var keyLockJs = qc.defineBehaviour('qc.engine.keyLockJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
}, {
});

// Awake is called when the script instance is being loaded.
keyLockJs.prototype.awake = function() {
    var self = this;
//     var locks = ['suo.png','suo1.png'];
//     var keys = ['key.png','key1.png'];
// //     alert(self.gameObject.frame);
//     self.gameObject.frame = G.game.getRandom(locks);
};

// Update is called every frame, if the behaviour is enabled.
keyLockJs.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

keyLockJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

keyLockJs.prototype.onClick = function() {
//     this.gameObject.destroy();
//     G.bgRun = true;
};

