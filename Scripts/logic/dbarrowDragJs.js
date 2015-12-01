var dbarrowDragJs = qc.defineBehaviour('qc.engine.dbarrowDragJs', qc.Behaviour, function() {
    var self = this;
    self.touchdone = false;
    self.parent = null;
}, {
    parent: qc.Serializer.NODE
});

// Awake is called when the script instance is being loaded.
dbarrowDragJs.prototype.awake = function() {
    var self = this;
    self.parent.al = self.parent.al || true;
    self.parent.ar = self.parent.ar || true;
};

// Update is called every frame, if the behaviour is enabled.
dbarrowDragJs.prototype.update = function() {
};

dbarrowDragJs.prototype.onDragStart = function(e) {
    // 记录当前的坐标位置，并标记拖拽开始
    var self = this,
        o = self.gameObject;
    self.oldPos = new qc.Point(o.x, o.y);
};

// 节点拖拽中的处理
dbarrowDragJs.prototype.onDrag = function(e) {
    var self = this,o = self.gameObject;
    // 改变节点的目标位置
    G.game.log.trace('al:'+self.parent.al+'   ar:'+self.parent.ar);
    var p = o.getWorldPosition();
    p.x += e.source.deltaX;
    p.y += e.source.deltaY;
    p = o.parent.toLocal(p);
    if(o.name === 'arrowL'){
        if(p.x < o.x){
            o.x = p.x;
            if(self.oldPos.x - p.x > 100){
                self.touchdone = true;
                tp = self.getScript('qc.TweenPosition');
                tp.from.x = o.x;
                tp.play();
                tp.onFinished.add(function(){
                    self.parent.al = false;
                    G.game.log.trace('++++++++++++++++++++++arrowL+');
                    if(self.parent.ar === false){
                        G.bgRun = true;
                        self.touchdone = true;
                        self.parent.destroy();
                    }
                });
            }
        }
    }
    if(o.name === 'arrowR'){
        if(p.x > o.x){
            o.x = p.x;
            if(p.x - self.oldPos.x > 100){
                self.touchdone = true;
                tp = self.getScript('qc.TweenPosition');
                tp.from.x = o.x;
                tp.play();          
                tp.onFinished.add(function(){
                    self.parent.ar = false;
                    G.game.log.trace('++++++++++++++++++++++arrowL+');
                    if(self.parent.al === false){
                        G.bgRun = true;
                        self.parent.destroy();
                    }
                });
            }
        }
        
    }    
    //         o.y = p.y;
};

// 节点拖拽结束的处理
dbarrowDragJs.prototype.onDragEnd = function(e) {
    // 拖拽结束了
    var self = this,o = self.gameObject;

    if (self.touchdone === false) {
        // 没有任何容器接受，反弹回去
        this.gameObject.x = this.oldPos.x;
//         this.gameObject.y = this.oldPos.y;
    }
};
