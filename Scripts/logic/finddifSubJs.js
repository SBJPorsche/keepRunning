// define a user behaviour
var finddifSubJs = qc.defineBehaviour('qc.engine.finddifSubJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
    self.parent = null;
}, {
    // fields need to serialize
    parent: qc.Serializer.NODE
});

// Awake is called when the script instance is being loaded.
//finddifSubJs.prototype.awake = function() {
//
//};

// Update is called every frame, if the behaviour is enabled.
//finddifSubJs.prototype.update = function() {
//
//};
finddifSubJs.prototype.onClick = function() {
	var self = this;
    if(self.gameObject.frame === 'grass2.png'){
        self.parent.destroy();
        G.bgRun = true;
    }
};
