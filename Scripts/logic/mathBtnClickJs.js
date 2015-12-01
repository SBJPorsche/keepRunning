// define a user behaviour
var mathBtnClickJs = qc.defineBehaviour('qc.engine.mathBtnClickJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
    self.mathtext = null;
    self.parent = null;
}, {
    mathtext: qc.Serializer.NODE,
    parent: qc.Serializer.NODE
});

var right = false;

// Awake is called when the script instance is being loaded.
mathBtnClickJs.prototype.awake = function() {
    var self = this;
    if(!self.parent.init){
        self.parent.init = true;
        self.cal();
    }
};

// Update is called every frame, if the behaviour is enabled.
mathBtnClickJs.prototype.cal = function() {
	var self = this;
    right = false;
    var a = Math.ceil(Math.random()*100);
    var b = Math.ceil(Math.random()*100);
    var arr = ['+','-'];
    var subs = [-20,-10,0,10,20,0,0];
    var sub = subs[Math.ceil(Math.random()*(subs.length-1))];
    var sum = a+b+sub;
    if (sub === 0) {
        right = true;
    }
    var str = a+arr[0]+b+'='+sum;
    self.mathtext.text = str;
    G.game.log.trace('cal:'+right);
};

mathBtnClickJs.prototype.onClick = function() {
    var self = this;
    G.game.log.trace('onClick:'+right);
    if((right === true && self.gameObject.name === 'yes') || (right === false && self.gameObject.name === 'no')){
        self.parent.destroy();
        G.bgRun = true;
    }else{
        self.cal();
    }
};