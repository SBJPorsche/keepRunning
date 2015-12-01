// define a user behaviour
var gameJs = qc.defineBehaviour('qc.engine.gameJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
    self.timerCreateEnemy = null;
    self.player = null;
    
}, {
    // fields need to serialize
    player: qc.Serializer.NODE
});

// Awake is called when the script instance is being loaded.
gameJs.prototype.awake = function() {
	this.timerCreateEnemy = G.game.timer.loop(3000, this.createEnemy, this);
};

// Update is called every frame, if the behaviour is enabled.
gameJs.prototype.update = function() {

};

gameJs.prototype.createEnemy = function() {
    var self = this;
    var id = G.game.math.random(0, 1);
    id = 8;
    if(G.bgRun === true){
        if(id === 0){
            G.game.assets.load('fence', 'Assets/prefab/fence.bin', function(asset) {
                var fenceclone = G.game.assets.find('fence');
                var rigidbody = G.game.add.clone(fenceclone);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }

        if(id === 1){
            G.game.assets.load('bird', 'Assets/prefab/bird.bin', function(asset) {
                var birdclone = G.game.assets.find('bird');
                var rigidbody = G.game.add.clone(birdclone);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }
        
        if(id === 2){
            G.game.assets.load('arrowL', 'Assets/prefab/arrowL.bin', function(asset) {
                var arrowLclone = G.game.assets.find('arrowL');
                var rigidbody = G.game.add.clone(arrowLclone);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        } 

        if(id === 3){
            G.game.assets.load('arrowR', 'Assets/prefab/arrowR.bin', function(asset) {
                var arrowRclone = G.game.assets.find('arrowR');
                var rigidbody = G.game.add.clone(arrowRclone);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        } 
        
        if(id === 4){
            G.game.assets.load('keylock', 'Assets/prefab/keylock.bin', function(asset) {
                var keylockclone = G.game.assets.find('keylock');
                var rigidbody = G.game.add.clone(keylockclone);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        } 

        if(id === 5){
            G.game.assets.load('cardbase', 'Assets/prefab/cardbase.bin', function(asset) {
                var cardbaseclone = G.game.assets.find('cardbase');
                var rigidbody = G.game.add.clone(cardbaseclone);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }   
        
        if(id === 6){
            G.game.assets.load('mathbord', 'Assets/prefab/mathbord.bin', function(asset) {
                var mathbordclone = G.game.assets.find('mathbord');
                var rigidbody = G.game.add.clone(mathbordclone);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }     
        
        if(id === 7){
            G.game.assets.load('finddif', 'Assets/prefab/finddif.bin', function(asset) {
                var finddifclone = G.game.assets.find('finddif');
                var rigidbody = G.game.add.clone(finddifclone);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }   
        
        if(id === 8){
            G.game.assets.load('dbarrow', 'Assets/prefab/dbarrow.bin', function(asset) {
                var dbarrowclone = G.game.assets.find('dbarrow');
                var rigidbody = G.game.add.clone(dbarrowclone);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }         
    }
};
