// define a user behaviour
var finddifJs = qc.defineBehaviour('qc.engine.finddifJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
    self.k1 = null;
    self.k2 = null;
    self.k3 = null;
    self.k4 = null;
    self.k5 = null;
    self.k6 = null;
    self.k7 = null;
    self.k8 = null;
    self.k9 = null;
}, {
    k1: qc.Serializer.NODE,
    k2: qc.Serializer.NODE,
    k3: qc.Serializer.NODE,
    k4: qc.Serializer.NODE,
    k5: qc.Serializer.NODE,
    k6: qc.Serializer.NODE,
    k7: qc.Serializer.NODE,
    k8: qc.Serializer.NODE,
    k9: qc.Serializer.NODE
});

// Awake is called when the script instance is being loaded.
finddifJs.prototype.awake = function() {
    var self = this;
    var map = [self.k1,self.k2,self.k3,self.k4,self.k5,self.k6,self.k7,self.k8,self.k9];
    map[G.game.math.random(0,8)].frame = 'grass2.png';
};

// Update is called every frame, if the behaviour is enabled.
finddifJs.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

finddifJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

finddifJs.prototype.onClick = function() {
};



