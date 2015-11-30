// define a user behaviour
var player = qc.defineBehaviour('qc.engine.player', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
}, {
    // fields need to serialize
});

// Awake is called when the script instance is being loaded.
//player.prototype.awake = function() {
//
//};

// Update is called every frame, if the behaviour is enabled.
player.prototype.update = function() {
	if(G.playerDead === true){
        self.game.state.load('mainMenu', false, function() {
        }, function() {
            console.log(self.scene + '场景加载完毕。');
        });
    }
};
