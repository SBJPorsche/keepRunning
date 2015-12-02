// define a user behaviour
var player = qc.defineBehaviour('qc.engine.player', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
}, {
    // fields need to serialize
});

var betadirection=0,gammadirection=0,alphadirection=0;
G.playerRotation = 0;
var surportRotation = true;
function deviceOrientationListener(event) {
  alphadirection = Math.round(event.alpha);
  betadirection = Math.round(event.beta);
  gammadirection = Math.round(event.gamma);
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", deviceOrientationListener);
} else {
    surportRotation = false;
    alert("您使用的浏览器不支持Device Orientation特性");
}
// Awake is called when the script instance is being loaded.
player.prototype.awake = function() {

};

// Update is called every frame, if the behaviour is enabled.
player.prototype.update = function() {
    var self = this;
	if(G.playerDead === true){
        self.game.state.load('mainMenu', false, function() {
        }, function() {
            console.log(self.scene + '场景加载完毕。');
        });
    }
    
    // 手机感应
//     if (gammadirection>20 || gammadirection<-20) {
//         self.gameObject.rotation = gammadirection ;
//     }else{
//         self.gameObject.rotation = 0;
//     }
//     if (betadirection>60) {
//         self.gameObject.rotation = 180;
//     }
//     G.playerRotation = Math.ceil((self.gameObject.rotation+360)%360);
};
