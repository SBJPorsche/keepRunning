var arrowRJs = qc.defineBehaviour('qc.engine.arrowRJs', qc.Behaviour, function() {
    var self = this;
    self.touchdone = false;
}, {
});

// Awake is called when the script instance is being loaded.
arrowRJs.prototype.awake = function() {
};

// Update is called every frame, if the behaviour is enabled.
arrowRJs.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(self.gameObject.y < 0 || self.gameObject.x < -self.gameObject.width/2){
        self.gameObject.destroy();
    }
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

arrowRJs.prototype.onCollide = function(o1,o2) {
    var self = this;
    G.bgRun = false;
};

arrowRJs.prototype.onClick = function() {
//     this.gameObject.destroy();
//     G.bgRun = true;
};

arrowRJs.prototype.onDragStart = function(e) {
    // 记录当前的坐标位置，并标记拖拽开始
    var self = this,
        o = self.gameObject;
    self.oldPos = new qc.Point(o.x, o.y);
};

// 节点拖拽中的处理
arrowRJs.prototype.onDrag = function(e) {
    var self = this,o = self.gameObject;
    // 改变节点的目标位置
    var p = o.getWorldPosition();
    p.x += e.source.deltaX;
    p.y += e.source.deltaY;
    p = o.parent.toLocal(p);
    if(p.x < o.x){
        o.x = p.x;
        if(self.oldPos.x - p.x > 100){
            G.bgRun = true;
            self.touchdone = true;
            tp = self.getScript('qc.TweenPosition');
            tp.from.x = o.x;
            tp.play();
        }
    }
    //         o.y = p.y;
};

// 节点拖拽结束的处理
arrowRJs.prototype.onDragEnd = function(e) {
    // 拖拽结束了
    var self = this,o = self.gameObject;

    if (self.touchdone === false) {
        // 没有任何容器接受，反弹回去
        this.gameObject.x = this.oldPos.x;
//         this.gameObject.y = this.oldPos.y;
    }
};