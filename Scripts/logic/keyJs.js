var lockLJs = qc.defineBehaviour('qc.engine.lockLJs', qc.Behaviour, function() {
    var self = this;
    self.parent = null;
    self.touchdone = false;
}, {
    parent: qc.Serializer.NODE
});

lockLJs.prototype.awake = function() {
    var self = this;
    var prefabRigidBody = self.getScript('qc.arcade.RigidBody');
    prefabRigidBody.addOverlap(self.parent);
    var keys = ['key.png','key1.png'];
    //换帧
//     self.parent.keyL = self.parent.keyL || self.gameObject.frame;
    if(self.parent.keyL){
        if(self.parent.keyL == 'key.png'){
	        self.gameObject.frame = 'key1.png';
        }else{
  	        self.gameObject.frame = 'key.png';
        }
        self.parent.keyL = null;
    }else{
        self.parent.keyL = keys[G.game.math.random(0,1)];
        self.gameObject.frame = self.parent.keyL;
    }
};

lockLJs.prototype.onDragStart = function(e) {
    // 记录当前的坐标位置，并标记拖拽开始
    var self = this,
        o = self.gameObject;
    self.oldPos = new qc.Point(o.x, o.y);
};

lockLJs.prototype.onOverlap = function(o1, o2) {
	var self = this;
    G.game.log.trace(self.parent.frame+self.gameObject.frame);
    if((self.parent.frame == 'suo.png' && self.gameObject.frame == 'key.png')||(self.parent.frame == 'suo1.png' && self.gameObject.frame == 'key1.png')){
        G.bgRun = true;
        self.touchdone = true;
        self.parent.destroy();
    } 
};

// 节点拖拽中的处理
lockLJs.prototype.onDrag = function(e) {
    var self = this,o = self.gameObject;
    // 改变节点的目标位置
    var p = o.getWorldPosition();
    p.x += e.source.deltaX;
    p.y += e.source.deltaY;
    p = o.parent.toLocal(p);
    o.x = p.x;
    o.y = p.y;
};

// 节点拖拽结束的处理
lockLJs.prototype.onDragEnd = function(e) {
    // 拖拽结束了
    var self = this,o = self.gameObject;

    if (self.touchdone === false) {
        // 没有任何容器接受，反弹回去
        this.gameObject.x = this.oldPos.x;
        this.gameObject.y = this.oldPos.y;
    }
};
