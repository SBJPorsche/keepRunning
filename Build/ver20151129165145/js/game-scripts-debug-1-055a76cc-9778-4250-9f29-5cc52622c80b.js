/**
 * 用户自定义脚本.
 */
(function(window, Object, undefined) {
    "use strict";

/**
 * @author chenqx
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 负责处理游戏的节点淡入淡出
 * @class qc.NodeFadeInOut
 */
var NodeFadeInOut = qc.defineBehaviour('qc.Plugins.NodeFadeInOut', qc.Tween, function() {
    /**
     * @property {number} fadeType - 淡入淡出类型
     */
    this.fadeType = NodeFadeInOut.FADE_IN;
    /**
     * @property {number} columnCount - 变化的列数
     */
    this.columnCount = 1;
    /**
     * @property {number} rowCount - 变化的列数
     */
    this.rowCount = 1;
    /**
     * @property {number] pivotX - 变化时的原点 x 位置
     */
    this.pivotX = 0.5;
    /**
     * @property {number} pivotY - 变化时的原点 y 坐标
     */
    this.pivotY = 0.5;
    /**
     * @property {number} style - 淡入淡出的类型
     */
    this.fadeStyle = NodeFadeInOut.STYLE_ZOOM;
    /**
     * @property {number} effect - 生效的效果
     */
    this.fadeEffect = NodeFadeInOut.EFFECT_XY;

    /**
     * @property {qc.Node} target - 需要淡入淡出的节点，不设置默认为自身节点
     */
    this.target = null;
}, {
    fadeType : qc.Serializer.NUMBER,
    columnCount : qc.Serializer.NUMBER,
    rowCount : qc.Serializer.NUMBER,
    pivotX : qc.Serializer.NUMBER,
    pivotY : qc.Serializer.NUMBER,
    fadeStyle : qc.Serializer.NUMBER,
    fadeEffect : qc.Serializer.NUMBER,
    target : qc.Serializer.NODE
});
NodeFadeInOut.__menu = 'Plugins/NodeFadeInOut';

Object.defineProperties(NodeFadeInOut.prototype, {
    /**
     * @property {number} columnCount - 分隔的列数
     */
    columnCount : {
        get : function() { return this._columnCount; },
        set : function(v) {
            v = (isNaN(v) || v === 0) ? 1 : v;
            if (v === this._columnCount) {
                return;
            }
            this._columnCount = v;
        }
    },
    /**
     * @property {number} rowCount - 分隔的行数
     */
    rowCount : {
        get : function() { return this._rowCount; },
        set : function(v) {
            v = (isNaN(v) || v === 0) ? 1 : v;
            if (v === this._rowCount) {
                return;
            }
            this._rowCount = v;
        }
    },
    /**
     * @property {qc.Node} _cachedTarget - 缓存的对象
     * @private
     * @readonly
     */
    _cachedTarget : {
        get : function() {
            if (this.target && this.target._destroy) {
                this.target = null;
            }
            return this.target || this.gameObject;
        }
    }
});


/**
 * 生效
 */
NodeFadeInOut.prototype.onEnable = function() {
    if (this._cachedTarget._destroy) {
        return;
    }
    this._cachedTarget.visible = true;
    if (this._cachedTexture) {
        this._cachedTexture.destroy(true);
        this._cachedTexture = null;
    }
    // 获取缓存信息
    this._cachedBounds = this._cachedTarget.localBounds;
    this._cachedTexture = this._cachedTarget.generateTexture();
    this._cachedSprite = new PIXI.Sprite(this._cachedTexture);
    this._cachedSprite.worldTransform = this._cachedTarget.worldTransform;
    this._cachedTarget.phaser.anchor && (this._cachedSprite.anchor = this._cachedTarget.phaser.anchor);

    // 替换绘制函数
    if (!this._nodeRenderCanvas) {
        this._nodeRenderCanvas = this.gameObject.phaser._renderCanvas;
        this.gameObject.phaser._renderCanvas = this.renderCanvas.bind(this);
    }

    if (!this._nodeRenderWebGL) {
        this._nodeRenderWebGL = this.gameObject.phaser._renderWebGL;
        this.gameObject.phaser._renderWebGL = this.renderWebGL.bind(this);
    }

    // 缓存对象不是自身时，直接隐藏
    //if (this._cachedTarget !== this.gameObject) {
    //    this._cachedTarget.visible = false;
    //}
};

/**
 * 失效
 */
NodeFadeInOut.prototype.onDisable = function() {
    if (this._nodeRenderCanvas) {
        this.gameObject.phaser._renderCanvas = this._nodeRenderCanvas;
        this._nodeRenderCanvas = null;
    }
    if (this._nodeRenderWebGL) {
        this.gameObject.phaser._renderWebGL = this._nodeRenderWebGL;
        this._nodeRenderWebGL = null;
    }
    if (this._cachedTexture) {
        this._cachedTexture.destroy(true);
        this._cachedTexture = null;
    }
    if (this._cachedSprite) {
        this._cachedSprite = null;
    }
    qc.Tween.prototype.onDisable.call(this);
};

/**
 * 销毁
 */
NodeFadeInOut.prototype.onDestroy = function() {
    if (this._nodeRenderCanvas) {
        this.gameObject.phaser._renderCanvas = this._nodeRenderCanvas;
        this._nodeRenderCanvas = null;
    }
    if (this._nodeRenderWebGL) {
        this.gameObject.phaser._renderWebGL = this._nodeRenderWebGL;
        this._nodeRenderWebGL = null;
    }
    if (this._cachedTexture) {
        this._cachedTexture.destroy(true);
        this._cachedTexture = null;
    }
    if (this._cachedSprite) {
        this._cachedSprite = null;
    }
    if (qc.Tween.prototype.onDestroy)
        qc.Tween.prototype.onDestroy.call(this);
};

// 帧调度: 驱动位置
NodeFadeInOut.prototype.onUpdate = function(factor, isFinished) {
    this._factorValue = this.fadeType === NodeFadeInOut.FADE_IN ? (1 - factor) : factor;
    if (isFinished && !this._cachedTarget._destroy && this._cachedTarget === this.gameObject) {
        this._cachedTarget.visible = this.fadeType === NodeFadeInOut.FADE_IN;
    }
};

/**
 * canvas下的绘制
 * @param renderSession
 */
NodeFadeInOut.prototype.renderCanvas = function(renderSession) {
    // 自身不是淡入淡出对象时，绘制自身
    if (this._cachedTarget !== this.gameObject) {
        this._nodeRenderCanvas.call(this.gameObject.phaser, renderSession);
    }

    var texture = this._cachedTexture;
    var sprite = this._cachedSprite;
    var bounds = this._cachedBounds;

    //  Ignore null sources
    if (texture)
    {
        var resolution = texture.baseTexture.resolution / renderSession.resolution;

        renderSession.context.globalAlpha = sprite.worldAlpha;

        //  If smoothingEnabled is supported and we need to change the smoothing property for this texture
        if (renderSession.smoothProperty && renderSession.scaleMode !== texture.baseTexture.scaleMode)
        {
            renderSession.scaleMode = texture.baseTexture.scaleMode;
            renderSession.context[renderSession.smoothProperty] = (renderSession.scaleMode === PIXI.scaleModes.LINEAR);
        }

        //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions
        var dx = (texture.trim) ? texture.trim.x - sprite.anchor.x * texture.trim.width : sprite.anchor.x * -texture.frame.width;
        var dy = (texture.trim) ? texture.trim.y - sprite.anchor.y * texture.trim.height : sprite.anchor.y * -texture.frame.height;

        //  Allow for pixel rounding
        if (renderSession.roundPixels)
        {
            renderSession.context.setTransform(
                sprite.worldTransform.a,
                sprite.worldTransform.b,
                sprite.worldTransform.c,
                sprite.worldTransform.d,
                (sprite.worldTransform.tx * renderSession.resolution) | 0,
                (sprite.worldTransform.ty * renderSession.resolution) | 0);
            dx = dx | 0;
            dy = dy | 0;
        }
        else
        {
            renderSession.context.setTransform(
                sprite.worldTransform.a,
                sprite.worldTransform.b,
                sprite.worldTransform.c,
                sprite.worldTransform.d,
                sprite.worldTransform.tx * renderSession.resolution,
                sprite.worldTransform.ty * renderSession.resolution);
        }

        var xStep = texture.crop.width / this.columnCount;
        var yStep = texture.crop.height  / this.rowCount;

        var effectX = this.fadeEffect === NodeFadeInOut.EFFECT_X || this.fadeEffect === NodeFadeInOut.EFFECT_XY;
        var effectY = this.fadeEffect === NodeFadeInOut.EFFECT_Y || this.fadeEffect === NodeFadeInOut.EFFECT_XY;
        var cellShowWidth = (effectX ? (1 - this._factorValue) : 1) * xStep / resolution;
        var cellShowHeight = (effectY ? (1 - this._factorValue) : 1) * yStep / resolution;
        var cellWidth = effectX && this.fadeStyle === NodeFadeInOut.STYLE_CLIP ? xStep * (1 - this._factorValue) : xStep;
        var cellHeight = effectY && this.fadeStyle === NodeFadeInOut.STYLE_CLIP ? yStep * (1 - this._factorValue) : yStep;
        for (var yPos = 0; yPos < texture.crop.height; yPos += yStep) {
            var showY = (dy + yPos + yStep * (effectY ? this._factorValue : 0) * this.pivotY )/ resolution + bounds.y;
            for (var xPos = 0; xPos < texture.crop.width; xPos += xStep) {
                var showX = (dx + xPos + xStep * (effectX ? this._factorValue : 0) * this.pivotX ) / resolution + bounds.x;
                renderSession.context.drawImage(
                    texture.baseTexture.source,
                    texture.crop.x + xPos,
                    texture.crop.y + yPos,
                    cellWidth,
                    cellHeight,
                    showX,
                    showY,
                    cellShowWidth,
                    cellShowHeight);
            }
        }
    }
};

/**
 * webGL 下的绘制
 * @param renderSession
 */
NodeFadeInOut.prototype.renderWebGL = function(renderSession){
    // 自身不是淡入淡出对象时，绘制自身
    if (this._cachedTarget !== this.gameObject) {
        this._nodeRenderWebGL.call(this.gameObject.phaser, renderSession);
    }

    var texture = this._cachedTexture;
    var bounds = this._cachedBounds;
    var sprite = this._cachedSprite;

    var uvs = texture._uvs;
    if (! uvs) return;

    var resolution = texture.baseTexture.resolution / renderSession.resolution;
    var xStep = texture.crop.width / this.columnCount;
    var yStep = texture.crop.height  / this.rowCount;

    var effectX = this.fadeEffect === NodeFadeInOut.EFFECT_X || this.fadeEffect === NodeFadeInOut.EFFECT_XY;
    var effectY = this.fadeEffect === NodeFadeInOut.EFFECT_Y || this.fadeEffect === NodeFadeInOut.EFFECT_XY;
    var cellShowWidth = (effectX ? (1 - this._factorValue) : 1) * xStep / resolution;
    var cellShowHeight = (effectY ? (1 - this._factorValue) : 1) * yStep / resolution;
    var cellWidth = effectX && this.fadeStyle === NodeFadeInOut.STYLE_CLIP ? xStep * (1 - this._factorValue) : xStep;
    var cellHeight = effectY && this.fadeStyle === NodeFadeInOut.STYLE_CLIP ? yStep * (1 - this._factorValue) : yStep;

    var worldTransform = sprite.worldTransform;

    var a = worldTransform.a / resolution;
    var b = worldTransform.b / resolution;
    var c = worldTransform.c / resolution;
    var d = worldTransform.d / resolution;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;
    var uvWith = uvs.x2 - uvs.x0;
    var uvHeight = uvs.y2 - uvs.y0;
    for (var yPos = 0; yPos < texture.crop.height; yPos += yStep) {
        var showY = (yPos + yStep * (effectY ? this._factorValue : 0) * this.pivotY )/ resolution + bounds.y;
        for (var xPos = 0; xPos < texture.crop.width; xPos += xStep) {
            var showX = (xPos + xStep * (effectX ? this._factorValue : 0) * this.pivotX ) / resolution + bounds.x;
            this._webGLAddQuad(renderSession.spriteBatch,sprite,
                showX, showY, showX + cellShowWidth, showY + cellShowHeight,
                uvs.x0 + uvWith * xPos / texture.crop.width,
                uvs.y0 + uvHeight * yPos / texture.crop.height,
                uvs.x0 + uvWith * (xPos + cellWidth) / texture.crop.width,
                uvs.y0 + uvHeight * (yPos + cellHeight) / texture.crop.height,
                a, b, c, d, tx, ty, sprite.tint);
        }
    }
};


// 增加定点
NodeFadeInOut.prototype._webGLAddQuad = function(spriteBatch, sprite, w1, h1, w0, h0, uvx0, uvy0, uvx1, uvy1, a, b, c, d, tx, ty, tint) {
    if(spriteBatch.currentBatchSize >= spriteBatch.size)
    {
        spriteBatch.flush();
        spriteBatch.currentBaseTexture = sprite.texture.baseTexture;
    }

    var colors = spriteBatch.colors;
    var positions = spriteBatch.positions;

    var index = spriteBatch.currentBatchSize * 4 * spriteBatch.vertSize;


    if(spriteBatch.renderSession.roundPixels)
    {
        // xy
        positions[index] = a * w1 + c * h1 + tx | 0;
        positions[index+1] = d * h1 + b * w1 + ty | 0;

        // xy
        positions[index+5] = a * w0 + c * h1 + tx | 0;
        positions[index+6] = d * h1 + b * w0 + ty | 0;

        // xy
        positions[index+10] = a * w0 + c * h0 + tx | 0;
        positions[index+11] = d * h0 + b * w0 + ty | 0;

        // xy
        positions[index+15] = a * w1 + c * h0 + tx | 0;
        positions[index+16] = d * h0 + b * w1 + ty | 0;
    }
    else
    {
        // xy
        positions[index] = a * w1 + c * h1 + tx;
        positions[index+1] = d * h1 + b * w1 + ty;

        // xy
        positions[index+5] = a * w0 + c * h1 + tx;
        positions[index+6] = d * h1 + b * w0 + ty;

        // xy
        positions[index+10] = a * w0 + c * h0 + tx;
        positions[index+11] = d * h0 + b * w0 + ty;

        // xy
        positions[index+15] = a * w1 + c * h0 + tx;
        positions[index+16] = d * h0 + b * w1 + ty;
    }
    // uv
    positions[index+2] = uvx0;
    positions[index+3] = uvy0;

    // uv
    positions[index+7] = uvx1;
    positions[index+8] = uvy0;

    // uv
    positions[index+12] = uvx1;
    positions[index+13] = uvy1;

    // uv
    positions[index+17] = uvx0;
    positions[index+18] = uvy1;

    // color and alpha
    colors[index+4] = colors[index+9] = colors[index+14] = colors[index+19] = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);

    // increment the batchsize
    spriteBatch.sprites[spriteBatch.currentBatchSize++] = sprite;
};

/**
 * 淡入
 * @constant
 * @type {number}
 */
NodeFadeInOut.FADE_IN = 0;

/**
 * 淡出
 * @constant
 * @type {number}
 */
NodeFadeInOut.FADE_OUT = 1;

/**
 * 缩放淡入淡出
 * @constant
 * @type {number}
 */
NodeFadeInOut.STYLE_ZOOM = 0;

/**
 * 裁切淡入淡出
 * @constant
 * @type {number}
 */
NodeFadeInOut.STYLE_CLIP = 1;

/**
 * x,y轴同时变化
 * @constant
 * @type {number}
 */
NodeFadeInOut.EFFECT_XY = 0;
/**
 * x轴变化
 * @constant
 * @type {number}
 */
NodeFadeInOut.EFFECT_X = 1;
/**
 * y轴变化
 * @constant
 * @type {number}
 */
NodeFadeInOut.EFFECT_Y = 2;
/**
 * 场景加载的进度提示界面
 */
var LoadingUI = qc.defineBehaviour('qc.demo.LoadingUI', qc.Behaviour,
    function() {
        this.clue = null;
    },
    {
        // 需要序列化的字段
        clue: qc.Serializer.NODE
    }
);

// 初始化处理
LoadingUI.prototype.awake = function() {
    // 关注场景开始切换和切换结束的事件
    var self = this;
    self.game.state.onStartLoad.add(function() {
        // 场景加载开始，显示本界面
        self.show();
    });
    self.game.state.onEndLoad.add(function() {
        // 场景加载完毕，隐藏本界面
        if (self.gameObject.visible) {
            if (self.duringTween)
                self.nextChange = 1;
            else
                self.hide();
        }
    });
};

// 帧调度，保证本界面永远在其他界面之上
LoadingUI.prototype.update = function() {
    var self = this,
        loaded = self.game.assets.loaded,
        total = self.game.assets.total;
    if (total) {
        self.clue.text = '拼命加载中：' + loaded + '/' + total;
    }
    else {
        self.clue.text = '';
    }
    // 扔到最后面去
    self.gameObject.parent.setChildIndex(this.gameObject, self.gameObject.parent.children.length - 1);
};

// 开始显示本界面
LoadingUI.prototype.show = function() {
    var self = this,
        fadeInOut = self.gameObject.getScript('qc.Plugins.NodeFadeInOut');

    self.gameObject.visible = true;
    self.gameObject.alpha = 0;
    fadeInOut.stop();
    fadeInOut.enable = false;
    fadeInOut.target = self.gameObject.game.world;
    fadeInOut.fadeType = NodeFadeInOut.FADE_OUT;
    fadeInOut.fadeStyle = this.getRandomInt(0, 2);
    fadeInOut.fadeEffect = this.getRandomInt(0, 3);
    fadeInOut.pivotX = Math.random(0, 1);
    fadeInOut.pivotY = Math.random(0, 1);
    fadeInOut.columnCount = this.getRandomInt(1, 32);
    fadeInOut.rowCount = this.getRandomInt(1, 32);
    fadeInOut.resetToBeginning();
    fadeInOut.playForward();
    self.gameObject.alpha = 1;
    self.duringTween = true;
    fadeInOut.onFinished.addOnce(function() {
        self.duringTween = false;
        if (self.nextChange) {
            self.hide();
            self.nextChange = 0;
        }
    });
};

// 结束显示本页面，加载完毕了
LoadingUI.prototype.hide = function() {
    var self = this,
        fadeInOut = self.gameObject.getScript('qc.Plugins.NodeFadeInOut');

    self.gameObject.alpha = 1;
    fadeInOut.enable = false;
    fadeInOut.target = null;
    fadeInOut.fadeType = NodeFadeInOut.FADE_OUT;
    fadeInOut.fadeStyle = this.getRandomInt(0, 2);
    fadeInOut.fadeEffect = this.getRandomInt(0, 3);
    fadeInOut.pivotX = Math.random(0, 1);
    fadeInOut.pivotY = Math.random(0, 1);
    fadeInOut.columnCount = this.getRandomInt(1, 32);
    fadeInOut.rowCount = this.getRandomInt(1, 32);
    fadeInOut.resetToBeginning();
    fadeInOut.playForward();
    self.duringTween = true;
    fadeInOut.onFinished.addOnce(function() {
        self.gameObject.visible = false;
        self.duringTween = false;
        self.nextChange = 0;
    });
};

LoadingUI.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

}).call(this, this, Object);
