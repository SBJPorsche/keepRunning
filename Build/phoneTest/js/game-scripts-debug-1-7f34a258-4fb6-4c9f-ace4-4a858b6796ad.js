/**
 * 用户自定义脚本.
 */
(function(window, Object, undefined) {
    "use strict";

var title = '', imgUrl = '', desc = '', url = '';
var wx_sign, ready = false;
var callback;

window.init_wx_api = function(sign) {
	wx_sign = sign;
	wx.config({
	    debug: false,
	    appId: sign.appId,
	    timestamp: sign.timestamp,
	    nonceStr: sign.nonceStr, 
	    signature: sign.signature,
	    jsApiList: ['onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareAppMessage']
	});

	wx.ready(function() {
        ready = true;

        wx.checkJsApi({
            jsApiList: ['onMenuShareTimeline'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                window.isOpenInWeixin = true;
            }
        });

        wx.onMenuShareAppMessage({
            title: title,
            desc: desc,
            link: url,
            imgUrl: imgUrl,
            success: function () {
                if (callback) callback();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

		wx.onMenuShareTimeline({
		    title: title,
		    desc: desc, 
		    link: url,
		    imgUrl: imgUrl,
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    },
		    cancel: function() {}
		});

	    wx.onMenuShareQQ({
		    title: title,
		    desc: desc, 
		    link: url,
		    imgUrl: imgUrl,
		    success: function () {
                if (callback) callback();
		    },
		    cancel: function () { 
		       // 用户取消分享后执行的回调函数
		    }
		});

		wx.onMenuShareQZone({
		    title: title,
		    desc: desc, 
		    link: url,
		    imgUrl: imgUrl,
		    success: function () {
                if (callback) callback();
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});

	});
};

/**
 * 微信分享的信息设置
 * @param _title
 * @param _imageUrl
 * @param _desc
 * @param _url
 * @param callback
 */
window.set_wx_info = function(_title, _imageUrl, _desc, _url, _callback) {
	title = _title;
	imgUrl = _imageUrl;
    desc = _desc;
    url = _url;
    callback = _callback
	if (!ready) return;

    wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: url,
        imgUrl: imgUrl,
        success: function () {
            if (callback) callback();
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareTimeline({
        title: title,
        desc: desc,
        link: url,
        imgUrl: imgUrl,
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function() {}
    });

    wx.onMenuShareQQ({
        title: title,
        desc: desc,
        link: url,
        imgUrl: imgUrl,
        success: function () {
            if (callback) callback();
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareQZone({
        title: title,
        desc: desc,
        link: url,
        imgUrl: imgUrl,
        success: function () {
            if (callback) callback();
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
};
/**
 * @author weism
 * @copyright 2015 Qcplay All Rights Reserved.
 */

var WeChat = qc.defineBehaviour('qc.WeChat', qc.Behaviour, function() {
    var self = this;

    /**
     * @property {string} appId - 微信公众号的appid
     */
    self.appId = '';

    /**
     * @property {string} webAppId - 网站应用的appid
     */
    self.webAppId = '';

    /**
     * @property {string} domain
     *  域名（存放php文件的域名地址，例如：http://engine.zuoyouxi.com/wx/）
     *  域名最后面以 '/' 结束
     */
    self.domain = '';

    /**
     * @property {string} gameDomain
     *   游戏服务器存放的域名（即放game_client文件的域名地址）
     *   例如： http://engine.zuoyouxi.com/teris/
     */
    self.gameDomain = '';

    /**
     * @property {boolean} redirectCurrentUrl
     *   = true：使用游戏页直接换取code。当在微信公众号后台配置了游戏域名（gameDomain）为回调地址时采用
     *   = false：使用this.domain + 'code.php'作为接收code的回调页，之后再跳转到本页面。当微信公众号后台配置的是domain时采用
     *            这种情况下，游戏的域名和公众号后台配置的可以是不一样的，并且多个游戏可以共用一个公众号的信息。缺点是浏览器会有两次跳转
     */
    self.redirectCurrentUrl = true;

    /**
     * @property {boolean} debug - 微信接口的debug是否打开，在发布时一定要关闭哦
     */
    self.debug = false;

    /**
     * 微信分享的接口实例
     */
    self.wx = new WX();

    /**
     * @property {qc.Signal} onStartLogin - 开始登录的事件
     */
    self.onStartLogin = new qc.Signal();

    /**
     * @property {qc.Signal} onLogin - 登录成功的事件
     */
    self.onLogin = new qc.Signal();

    /**
     * @property {qc.Signal} sessionExpired - 会话过期的事件
     */
    self.sessionExpired = new qc.Signal();

    /**
     * @property {object} user - 微信的用户信息
     * @readonly
     */
    self.user = null;

    /**
     * @property {string} status - 当前的登录状态
     *   loggingIn - 登录中
     *   loggedIn - 已登录
     *   expired - 会话过期
     */
    self.status = '';
}, {
    appId: qc.Serializer.STRING,
    webAppId: qc.Serializer.STRING,
    domain: qc.Serializer.STRING,
    gameDomain: qc.Serializer.STRING,
    redirectCurrentUrl: qc.Serializer.BOOLEAN,
    debug: qc.Serializer.BOOLEAN
});
WeChat.__menu = 'Plugins/WeChat';

// 初始化处理
WeChat.prototype.awake = function() {
    // 请求签名信息
    var self = this;
    if (!self.domain) return;

    var url = self.domain + 'index.php?cmd=sign&appid=' + self.appId + '&url=' + encodeURIComponent(window.location.href);
    self.game.log.trace('开始请求微信分享的签名信息：{0}', url);
    qc.AssetUtil.get(url, function(r) {
        self.game.log.trace('获取签名成功：' + r);
        self.parseSign(r);
    }, function() {
        console.error('获取签名信息失败');
    });

    // 加载js库
    self.loadWXLib();

    // 获取code
    self._code = this.getParam('code');
    self._state = this.getParam('state');
    if (self._code) {
        // 请求换取token，如果失败需要重新请求登录
        self.status = 'loggingIn';
        self.game.timer.add(1, function() {
            self.requestToken(self._code);
        });
    }
};

// 析构的处理
WeChat.prototype.onDestroy = function() {
    if (this.timer) {
        this.game.timer.remove(this.timer);
    }
};

/**
 * 请求微信登录
 */
WeChat.prototype.login = function() {
    if (this.isWeChat()) {
        this.loginInWX();
        return;
    }
    this.loginInWeb();
};

// 微信内登陆
WeChat.prototype.loginInWX = function() {
    var url = '',
        redirectUri = window.location.origin + window.location.pathname;
    if (this.redirectCurrentUrl) {
        url = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
            "appid=" + this.appId +
            "&redirect_uri=" + encodeURIComponent(redirectUri) +
            "&response_type=code&scope=snsapi_userinfo&state=weixin#wechat_redirect";
    }
    else {
        // 跳转到code.php页面，再跳转回本页面
        url = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
            "appid=" + this.appId +
            "&redirect_uri=" + encodeURIComponent(this.domain + 'code.php') +
            "&response_type=code&scope=snsapi_userinfo" +
            "&state=" + encodeURIComponent(redirectUri) +
            "#wechat_redirect";
    }
    window.location.href = url;
};

// 微信外登录
WeChat.prototype.loginInWeb = function() {
    var url = '',
        redirectUri = window.location.origin + window.location.pathname;
    if (this.redirectCurrentUrl) {
        url = "https://open.weixin.qq.com/connect/qrconnect?" +
            "appid=" + this.webAppId +
            "&redirect_uri=" + encodeURIComponent(redirectUri) +
            "&response_type=code&scope=snsapi_login&state=pc#wechat_redirect";
    }
    else {
        // 跳转到code.php页面，再跳转回本页面
        url = "https://open.weixin.qq.com/connect/qrconnect?" +
            "appid=" + this.webAppId +
            "&redirect_uri=" + encodeURIComponent(this.domain + 'code.php') +
            "&response_type=code&scope=snsapi_login" +
            "&state=" + encodeURIComponent(redirectUri) +
            "#wechat_redirect";
    }
    window.location.href = url;
};

// 解析签名信息
WeChat.prototype.parseSign = function(r) {
    var self = this;
    var sign = JSON.parse(r);
    self.timeStamp = sign.timestamp;
    self.nonceStr = sign.nonceStr;
    self.signature = sign.signature;

    if (!self.jweixin) {
        // 微信接口尚未载入，延迟继续检测
        self.game.timer.add(500, function() {
            self.parseSign(r);
        });
        return;
    }

    // 调用微信的初始化接口
    self.game.log.trace('开始初始化微信接口');
    self.wx.debug = self.debug;
    self.wx.init({
        timeStamp: self.timeStamp,
        nonceStr: self.nonceStr,
        signature: self.signature,
        appId: self.appId
    }, function() {
        self.game.log.trace('初始化微信接口完成。');
    });
};

// 动态加载wx的库
WeChat.prototype.loadWXLib = function() {
    var self = this;
    var src = "http://res.wx.qq.com/open/js/jweixin-1.0.0.js";
    var js = document.createElement('script');
    js.onerror = function() {
        console.error('加载jweixin库失败');
    };
    js.onload = function() {
        // 标记加载完成了
        self.game.log.trace('微信接口下载完成');
        self.jweixin = true;
    };
    js.setAttribute('src', src);
    js.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(js);
};

// 当前是否运行在微信客户端
WeChat.prototype.isWeChat = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == 'micromessenger';
};

// 获取url的参数
WeChat.prototype.getParam = function(key) {
    var r = new RegExp("(\\?|#|&)" + key + "=([^&#]*)(&|#|$)");
    var m = location.href.match(r);
    return decodeURIComponent(!m ? "" : m[2]);
};

// 使用code换取token
WeChat.prototype.requestToken = function(code) {
    var self = this,
        url = self.gameDomain + "login.php?code=" + code;
    if (!self.isWeChat()) url += "&web=1";
    self.onStartLogin.dispatch();
    qc.AssetUtil.get(url, function(r) {
        var data = JSON.parse(r);
        if (data.error) {
            // 换取token失败，重新请求登录
            self.game.log.error('换取token失败，重新请求登录');
            self.login();
            return;
        }

        // 登录成功了，抛出事件
        self.game.log.trace('登录成功：{0}', r);
        self.status = 'loggedIn';
        self.user = data;
        self.onLogin.dispatch();

        // 定期刷新access_token，并保持会话
        self.timer = self.game.timer.loop(5 * 60000, self.refreshToken, self);
    });
};

// 刷新token
WeChat.prototype.refreshToken = function() {
    var self = this,
        url = self.gameDomain + "refresh.php";
    if (!self.isWeChat()) url += "?web=1";
    qc.AssetUtil.get(url, function(r) {
        var data = JSON.parse(r);
        if (data.error) {
            // 刷新token失败了，抛出事件
            self.status = 'expired';
            self.game.timer.remove(self.timer);
            delete self.timer;
            self.sessionExpired.dispatch();
            return;
        }

        // 成功了，啥也不用处理
        self.game.log.trace('刷新Access Token成功。');
    });
};

var WX = qc.WX = function() {
    var self = this;

    self.title = '';
    self.imgUrl = '';
    self.desc = '';
    self.url = '';
    self.sign = null;
    self.ready = false;
    self.debug = false;
};
WX.prototype = {};
WX.prototype.constructor = WX;

/**
 * 初始化微信接口
 */
WX.prototype.init = function(sign, callback) {
    var self = this;
    self.sign = sign;

    // 不支持微信接口？
    if (!window.wx) return;
    wx.config({
        debug: self.debug,
        appId: sign.appId,
        timestamp: sign.timeStamp,
        nonceStr: sign.nonceStr,
        signature: sign.signature,
        jsApiList: [
            'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareAppMessage', 'onMenuShareWeibo',
            'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd',
            'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage',
            'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'closeWindow', 'scanQRCode'
        ]
    });

    wx.ready(function() {
        // 标记下已经初始化完毕了
        self.ready = true;
        if (callback) callback();
    });
};

/**
 * 分享接口
 */
WX.prototype.share = function(title, imgUrl, desc, url, callback) {
    var self = this;
    self.title = title;
    self.imgUrl = imgUrl;
    self.desc = desc;
    self.url = url;
    self.callback = callback;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }

    var body = {
        title: self.title,
        desc: self.desc,
        link: self.url,
        imgUrl: self.imgUrl,
        success: function() {
            if (callback) callback();
        },
        cancel: function() {}
    };

    // 分享到朋友圈
    wx.onMenuShareTimeline(body);

    // 分享给朋友
    wx.onMenuShareAppMessage(body);

    // 分享到QQ
    wx.onMenuShareQQ(body);

    // 分享到腾讯微博
    wx.onMenuShareWeibo(body);

    // 分享到QQ空间
    wx.onMenuShareQZone(body);
};

/**
 * 拍照或从手机相册中选图
 * @param {number} count - 图片的数量
 */
WX.prototype.chooseImage = function(count, sizeType, sourceType, callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }

    if (!sizeType) sizeType = ['original', 'compressed'];
    if (!sourceType) sourceType = ['album', 'camera'];

    wx.chooseImage({
        count: count,
        sizeType: sizeType,
        sourceType: sourceType,
        success: function(res) {
            if (callback) callback(res.localIds);
        }
    });
};

/**
 * 预览图片
 */
WX.prototype.previewImage = function(current, urls) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }

    current = current || '';
    urls = urls || [];
    wx.previewImage({
        current: current,
        urls: urls
    });
};

/**
 * 上传图片，有效期为3天
 */
WX.prototype.uploadImage = function(localId, isShowProgressTips, callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.uploadImage({
        localId: localId,
        isShowProgressTips: isShowProgressTips ? 1 : 0,
        success: function(res) {
            if (callback) callback(res.serverId);
        }
    });
};

/**
 * 下载图片
 */
WX.prototype.downloadImage = function(serverId, isShowProgressTips, callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.downloadImage({
        serverId: serverId,
        isShowProgressTips: isShowProgressTips ? 1 : 0,
        success: function(res) {
            if (callback) callback(res.localId);
        }
    });
};

/**
 * 开始录音
 */
WX.prototype.startRecord = function() {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.startRecord();
};

/**
 * 停止录音
 */
WX.prototype.stopRecord = function(callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.stopRecord({
        success: function(res) {
            if (callback) callback(res.localId);
        }
    });
};

/**
 * 监听录音自动停止
 */
WX.prototype.onVoiceRecordEnd = function(callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.onVoiceRecordEnd({
        complete: function(res) {
            if (callback) callback(res.localId);
        }
    });
};

/**
 * 播放语音
 */
WX.prototype.playVoice = function(localId) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.playVoice({
        localId: localId
    });
};

/**
 * 暂停播放语音
 */
WX.prototype.pauseVoice = function(localId) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.pauseVoice({
        localId: localId
    });
};

/**
 * 暂停播放语音
 */
WX.prototype.stopVoice = function(localId) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.stopVoice({
        localId: localId
    });
};

/**
 * 监听语音播放完毕
 */
WX.prototype.onVoicePlayEnd = function(callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.onVoicePlayEnd({
        success: function (res) {
            if (callback) callback(res.localId);
        }
    });
};

/**
 * 上传语音，有效期为3天
 */
WX.prototype.uploadVoice = function(localId, isShowProgressTips, callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.uploadVoice({
        localId: localId,
        isShowProgressTips: isShowProgressTips ? 1 : 0,
        success: function(res) {
            if (callback) callback(res.serverId);
        }
    });
};

/**
 * 下载语音
 */
WX.prototype.downloadVoice = function(serverId, isShowProgressTips, callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.downloadVoice({
        serverId: serverId,
        isShowProgressTips: isShowProgressTips ? 1 : 0,
        success: function(res) {
            if (callback) callback(res.localId);
        }
    });
};

/**
 * 语音识别
 */
WX.prototype.translateVoice = function(localId, isShowProgressTips, callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.translateVoice({
        localId: localId,
        isShowProgressTips: isShowProgressTips ? 1 : 0,
        success: function(res) {
            if (callback) callback(res.translateResult);
        }
    });
};

/**
 * 获取网络状态：2g 3g 4g wifi
 */
WX.prototype.getNetworkType = function(callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.getNetworkType({
        success: function(res) {
            if (callback) callback(res.networkType);
        }
    });
};

/**
 * 查看位置
 */
WX.prototype.openLocation = function(lat, lng, name, address, scale, infoUrl) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    lat = lat || 0;
    lng = lng || 0;
    scale = scale || 1;
    name = name || '';
    address = address || '';
    infoUrl = infoUrl || '';
    wx.openLocation({
        latitude: lat,
        longitude: lng,
        name: name,
        address: address,
        scale: scale,
        infoUrl: infoUrl
    });
};

/**
 * 获取当前位置
 * @param {string} type - 'wgs84'(默认)，'gcj02'(火星坐标)
 * 返回的结果中，包含如下信息：
 *   latitude
 *   longitude
 *   speed
 *   accuracy
 */
WX.prototype.getLocation = function(type, callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    type = type || 'wgs84';
    wx.getLocation({
        type: type,
        success: callback
    });
};

/**
 * 微信扫一扫
 */
WX.prototype.scanQRCode = function(needResult, callback) {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.scanQRCode({
        needResult: needResult,
        scanType: ["qrCode","barCode"],
        success: function(res) {
            if (callback) callback(res.resultStr);
        }
    });
};

/**
 * 关闭当前网页
 */
WX.prototype.closeWindow = function() {
    var self = this;
    if (!self.ready) {
        console.error('尚未初始化完成');
        return;
    }
    wx.closeWindow();
};

/**
 * 微信支付
 */
WX.prototype.chooseWXPay = function() {
    // 后续增加
};
/**
 * @author chenx
 * @date 2015.11.13
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * tween 回调函数
 * @class qc.TweenFunction
 */
var TweenFunction = qc.defineBehaviour('qc.TweenFunction', qc.Tween, function() {
    var self = this;

    /**
     * @property {string} func - 回调函数名
     */
    self.funcName = '';

    /**
     * @property {function} _func - 回调函数
     */
    self.func = null;

    // 回调函数的属主
    self.funcContext = null;

    // 默认情况下不可用
    self.enable = false;
},{
    funcName: qc.Serializer.STRING
});

// 菜单上的显示
TweenFunction.__menu = 'Plugins/TweenFunction';

Object.defineProperties(TweenFunction.prototype, {
    funcName: {
        get: function() { return this._funcName; },
        set: function(v) {
            if (v === this._funcName) return;

            this._funcName = v;
            this.onEnable();
        }
    }
});

// 组件 enabled
// gameObject 所有脚本挂载完后，才调用该接口，在此处将函数名转换成函数
TweenFunction.prototype.onEnable = function() {

    if (this._funcName.length <= 0)
        return;

    // 遍历 gameObject 及其所有的 scripts，查找回调函数
    this.func = this.gameObject[this._funcName];
    var classList = [];
    if (this.func)
    {
        // 记录存在该函数名的类名
        classList.push(this.gameObject.class);
        this.func = this.func.bind(this.gameObject);
        //this.funcContext = this.gameObject;
    }

    var self = this;
    this.gameObject.scripts.forEach(function(scriptOb) {
        var func = scriptOb[self._funcName];
        if (func)
        {
            // 记录存在该函数名的类名
            classList.push(scriptOb.class);
            self.func = func.bind(scriptOb);
            //this.funcContext = scriptOb;
        }
    });

    if (!self.func && this.enable)
        this.game.log.important('TweenFunction({0}) not find!', this._funcName);

    if (classList.length <= 1)
        return;

    // 存在多个相同名字的函数，提示错误
    self.game.log.error('Error: Exist multi functions with same name: {0}', classList);

    if (self.game.device.editor === true)
    {
        // 在编辑器中，弹出错误提示框
        var G = window.parent && window.parent.G;
        if (G)
        {
            var str = G._('TweenFunction func error') + classList;
            G.notification.error(str);
        }
    }
};


// 帧调度
TweenFunction.prototype.onUpdate = function(factor, isFinished) {
    if (typeof(this.func) != 'function')
        return;

    if (this.duration == 0 && !isFinished)
        // 表示该回调只在完成的调用一次
        return;

    // 调用回调函数
    this.func(factor, this.duration);
};

/**
 * 开始变化
 * @param node {qc.Node} - 需要改变的节点
 * @param duration {number} - 经历的时间
 * @param funcName {string} - 回调函数名
 * @returns {qc.TweenFunction}
 */
TweenFunction.begin = function(node, duration, funcName) {
    var tween = qc.Tween.begin('qc.TweenFunction', node, duration);
    tween.funcName = funcName;

    return tween;
};

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

/**
 * @author chenx
 * @date 2015.10.15
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 负责与服务器通信
 */

/**
 * 负责处理服务器通信相关逻辑
 * @class qc.ServerCommunicate
 */
var ServerCommunicate = qc.defineBehaviour('qc.ServerCommunicate', qc.Behaviour, function() {

    /**
     * @property {string} url - 服务器url地址
     */
    this.url = '';
}, {
    url : qc.Serializer.STRING,
});
ServerCommunicate.__menu = 'Plugins/ServerCommunicate';

/**
 * 收到消息回复
 * @param cmd {xhr} - 请求对象
 * @param resCallback {function} - 收到回复的回调函数
 * @param callbackArg {json} - 回调函数参数
 */
ServerCommunicate.prototype.receiveResponse = function(xhr, cmd, resCallback) {

    if (xhr.status == 0)
    {
        this.game.log.trace('消息{0}没有收到回复。', cmd);

        // 出错或没收到回复
        resCallback({ ret : false, reason : 'no response' });
        return;
    } else if(xhr.status != 200)
    {
        this.game.log.trace('消息{0}发送出错。', cmd);

        // 出错或没收到回复
        resCallback({ ret : false, reason : xhr.statusText });
        return;
    }

    var json = window.JSON.parse(xhr.responseText);
    json = json || {};

    this.game.log.trace('消息{0}收到回复:', cmd);
    this.game.log.trace(json);

    // 调用回调
    resCallback(json);
};

/**
 * 发送消息给服务器
 * @param cmd {string} - 消息串
 * @param para {json} - 消息参数
 * @param resCallback {function} - 收到回复的回调函数
 */
ServerCommunicate.prototype.sendMessage = function(cmd, para, resCallback) {
    var xhr = qc.AssetUtil.getXHR();
    var url = this.url + '/cmd';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    para["cmd"] = cmd;
    xhr.send(window.JSON.stringify(para));

    var _this = this;
    xhr.onload = function(){
        return _this.receiveResponse(xhr, cmd, resCallback);
    }

    xhr.onerror = function(){
        return _this.receiveResponse(xhr, cmd, resCallback);
    }
};

/**
 * 发送消息给服务器
 * 用户自定义消息可通过该接口发送给指定的服务器
 * @param node {qc.Node} - 节点
 * @param cmd {string} - 消息串
 * @param para {json} - 消息参数
 * @param resCallback {function} - 收到回复的回调函数
 */
ServerCommunicate.sendMessage = function(node, cmd, para, resCallback) {
    var serverCommunicate = node.getScript('qc.ServerCommunicate');
    serverCommunicate.sendMessage(cmd, para, resCallback);
};

/**
 * 登录服务器
 * @param node {qc.Node} - 节点
 * @param username {string} - 用户名
 * @param password {string} - 密码
 * @param authInfo {json} - 验证相关信息
 * @param resCallback {function} - 收到回复的回调函数
 */
ServerCommunicate.login = function(node, username, password, authInfo, resCallback) {

    authInfo = authInfo || {};
    authInfo['username'] = username;
    authInfo['password'] = hex_md5(password + 'sdf1!@3fdd8*(+3dfFdkO%$@ffdln');
    console.log(authInfo);

    ServerCommunicate.sendMessage(node, 'LOGIN', authInfo, resCallback);
};

/**
 * 登出服务器
 * @param node {qc.Node} - 节点
 * @param username {string} - 用户名
 * @param password {string} - 密码
 * @param authInfo {json} - 验证相关信息
 * @param saveData {json} - 需要保存的用户数据
 * @param resCallback {function} - 收到回复的回调函数
 */
ServerCommunicate.logout = function(node, username, password, authInfo, saveData, resCallback) {

    authInfo = authInfo || {};
    authInfo['username'] = username;
    authInfo['password'] = hex_md5(password + 'sdf1!@3fdd8*(+3dfFdkO%$@ffdln');
    authInfo['saveData'] = window.JSON.stringify(saveData);
    console.log(authInfo);

    ServerCommunicate.sendMessage(node, 'LOGOUT', authInfo, resCallback);
};

/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 保持横版或者竖版的组件
 * 在本节点下面的对象都会进行旋转
 * @class qc.Plugins.LockOrientation
 */
var LockOrientation = qc.defineBehaviour('qc.Plugins.LockOrientation', qc.Behaviour, function() {
    var self = this;

    /**
     * @property {int} orientation - 当前是限定为横版还是竖版，有如下取值：
     * Device.AUTO = 0;
     * Device.PORTRAIT = 1;
     * Device.LANDSCAPE = 2;
     */
    self.orientation = self.game.device.orientation;

    // 在PC上默认不启用
    self.desktop = false;

    // 本组件可以在编辑器模式下运行
    self.runInEditor = true;
}, {
    orientation: qc.Serializer.INT,
    desktop: qc.Serializer.BOOLEAN
});
LockOrientation.__menu = 'Plugins/LockOrientation';

Object.defineProperties(LockOrientation.prototype, {
    orientation: {
        get: function() {
            return this._orientation;
        },
        set: function(v) {
            if (v === this._orientation) return;
            this._orientation = v;
            this._doOrientation(this.game.device.orientation);
        }
    }
});

// 初始化处理，关注横竖版事件并做处理
LockOrientation.prototype.awake = function() {
    var self = this, o = self.gameObject;
    self.game.world.onSizeChange.add(self._doOrientation, self);
    o.parent.onRelayout.add(self.assureSize, self);

    // 确保目标节点大小、pivot与世界一致
    self._doOrientation();
    self.assureSize();
};

// 组件析构的处理
LockOrientation.prototype.onDestroy = function() {
    this.game.world.onSizeChange.remove(this._doOrientation, this);
    this.gameObject.parent.onRelayout.remove(this.assureSize, this);
};

// 确保和父亲节点的大小保持一致
LockOrientation.prototype.assureSize = function() {
    var self = this, o = self.gameObject;

    var rect = o.parent.rect;
    if (self.game.device.rotate90 === true) {
        // 旋转时，对调下长宽，确保和父亲节点重合
        o.width = rect.height;
        o.height = rect.width;
    }
    else {
        o.width = rect.width;
        o.height = rect.height;
    }
    o.setAnchor(new qc.Point(0.5, 0.5), new qc.Point(0.5, 0.5));
    o.anchoredX = 0;
    o.anchoredY = 0;
    o.pivotX = 0.5;
    o.pivotY = 0.5;
};

// 横竖屏发生变化的处理
LockOrientation.prototype._doOrientation = function() {
    var self = this, o = self.gameObject, v = self.game.device.orientation;

    if (!self.desktop && !self.game.editor && self.game.device.desktop) {
        o.rotation = 0;
        self.game.device.rotate90 = false;
        return;
    }

    switch (self.orientation) {
    case qc.Device.AUTO:
    default:
        o.rotation = 0;
        self.game.device.rotate90 = false;
        return;

    case qc.Device.PORTRAIT:
    case qc.Device.LANDSCAPE:
        if (v === self.orientation) {
            // 一致，就不需要旋转了
            o.rotation = 0;
            self.game.device.rotate90 = false;
        }
        else {
            // 不一致，旋转90度
            o.rotation = -Math.PI / 2;
            self.game.device.rotate90 = true;
        }
        self.assureSize();
        break;
    }
};

// 本插件需要重载掉ScaleAdapter，在屏幕宽高缩放时，需要按照旋转后的长宽来获取
var oldScaleAdapter_getReferenceResolution = qc.ScaleAdapter.prototype.getReferenceResolution;
qc.ScaleAdapter.prototype.getReferenceResolution = function() {
    var p = oldScaleAdapter_getReferenceResolution.call(this);
    if (this.game.device.rotate90) {
        return new qc.Point(p.y, p.x);
    }
    return p;
};

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
 * The Arcade Physics world. Contains Arcade Physics related collision, overlap and motion methods.
 *
 * @class Phaser.Physics.Arcade
 * @constructor
 * @param {Phaser.Game} game - reference to the current game instance.
 */
var Arcade = Phaser.Physics.Arcade = function(game) {
    /**
     * @property {Phaser.Game} game - Local reference to game.
     */
    this.game = game;

    /**
     * @property {Phaser.Point} gravity - The World gravity setting. Defaults to x: 0, y: 0, or no gravity.
     */
    this.gravity = new Phaser.Point();

    /**
     * @property {Phaser.Rectangle} bounds - The bounds inside of which the physics world exists. Defaults to match the world bounds.
     */
    this.bounds = new Phaser.Rectangle(0, 0, game.world.width, game.world.height);

    /**
     * Set the checkCollision properties to control for which bounds collision is processed.
     * For example checkCollision.down = false means Bodies cannot collide with the World.bounds.bottom.
     * @property {object} checkCollision - An object containing allowed collision flags.
     */
    this.checkCollision = { up: true, down: true, left: true, right: true };

    /**
     * @property {number} maxObjects - Used by the QuadTree to set the maximum number of objects per quad.
     */
    this.maxObjects = 10;

    /**
     * @property {number} maxLevels - Used by the QuadTree to set the maximum number of iteration levels.
     */
    this.maxLevels = 4;

    /**
     * @property {number} OVERLAP_BIAS - A value added to the delta values during collision checks.
     */
    this.OVERLAP_BIAS = 4;

    /**
     * @property {boolean} forceX - If true World.separate will always separate on the X axis before Y. Otherwise it will check gravity totals first.
     */
    this.forceX = false;

    /**
     * @property {number} sortDirection - Used when colliding a Sprite vs. a Group, or a Group vs. a Group, this defines the direction the sort is based on. Default is Phaser.Physics.Arcade.LEFT_RIGHT.
     * @default
     */
    this.sortDirection = Phaser.Physics.Arcade.LEFT_RIGHT;

    /**
     * @property {boolean} skipQuadTree - If true the QuadTree will not be used for any collision. QuadTrees are great if objects are well spread out in your game, otherwise they are a performance hit. If you enable this you can disable on a per body basis via `Body.skipQuadTree`.
     */
    this.skipQuadTree = true;

    /**
     * @property {boolean} isPaused - If `true` the `Body.preUpdate` method will be skipped, halting all motion for all bodies. Note that other methods such as `collide` will still work, so be careful not to call them on paused bodies.
     */
    this.isPaused = false;

    /**
     * @property {Phaser.QuadTree} quadTree - The world QuadTree.
     */
    this.quadTree = new Phaser.QuadTree(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

    /**
     * @property {number} _total - Internal cache var.
     * @private
     */
    this._total = 0;

    // By default we want the bounds the same size as the world bounds
    this.setBoundsToWorld();
};
Arcade.prototype = {};
Arcade.prototype.constructor = Arcade;

/**
 * A constant used for the sortDirection value.
 * Use this if you don't wish to perform any pre-collision sorting at all, or will manually sort your Groups.
 * @constant
 * @type {number}
 */
Arcade.SORT_NONE = 0;

/**
 * A constant used for the sortDirection value.
 * Use this if your game world is wide but short and scrolls from the left to the right (i.e. Mario)
 * @constant
 * @type {number}
 */
Arcade.LEFT_RIGHT = 1;

/**
 * A constant used for the sortDirection value.
 * Use this if your game world is wide but short and scrolls from the right to the left (i.e. Mario backwards)
 * @constant
 * @type {number}
 */
Arcade.RIGHT_LEFT = 2;

/**
 * A constant used for the sortDirection value.
 * Use this if your game world is narrow but tall and scrolls from the top to the bottom (i.e. Dig Dug)
 * @constant
 * @type {number}
 */
Arcade.TOP_BOTTOM = 3;

/**
 * A constant used for the sortDirection value.
 * Use this if your game world is narrow but tall and scrolls from the bottom to the top (i.e. Commando or a vertically scrolling shoot-em-up)
 * @constant
 * @type {number}
 */
Arcade.BOTTOM_TOP = 4;

/**
 * Updates the size of this physics world.
 *
 * @method Phaser.Physics.Arcade#setBounds
 * @param {number} x - Top left most corner of the world.
 * @param {number} y - Top left most corner of the world.
 * @param {number} width - New width of the world. Can never be smaller than the Game.width.
 * @param {number} height - New height of the world. Can never be smaller than the Game.height.
 */
Arcade.prototype.setBounds = function (x, y, width, height) {
    this.bounds.setTo(x, y, width, height);
};

/**
 * Updates the size of this physics world to match the size of the game world.
 *
 * @method Phaser.Physics.Arcade#setBoundsToWorld
 */
Arcade.prototype.setBoundsToWorld = function() {
    this.bounds.setTo(this.game.world.bounds.x, this.game.world.bounds.y,
        this.game.world.bounds.width, this.game.world.bounds.height);
};

/**
 * This will create an Arcade Physics body on the given game object or array of game objects.
 * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
 *
 * @method Phaser.Physics.Arcade#enable
 * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
 * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
 */
Arcade.prototype.enable = function(object, children) {
    if (typeof children === 'undefined') { children = true; }

    var i = 1;

    if (Array.isArray(object))
    {
        i = object.length;
        while (i--)
        {
            if (object[i] instanceof Phaser.Group)
            {
                //  If it's a Group then we do it on the children regardless
                this.enable(object[i].children, children);
            }
            else
            {
                this.enableBody(object[i]);

                if (children && object[i].hasOwnProperty('children') && object[i].children.length > 0)
                {
                    this.enable(object[i], true);
                }
            }
        }
    }
    else
    {
        if (object instanceof Phaser.Group)
        {
            //  If it's a Group then we do it on the children regardless
            this.enable(object.children, children);
        }
        else
        {
            this.enableBody(object);

            if (children && object.hasOwnProperty('children') && object.children.length > 0)
            {
                this.enable(object.children, true);
            }
        }
    }
};

/**
 * Creates an Arcade Physics body on the given game object.
 * A game object can only have 1 physics body active at any one time, and it can't be changed until the body is nulled.
 *
 * @method Phaser.Physics.Arcade#enableBody
 * @param {object} object - The game object to create the physics body on. A body will only be created if this object has a null `body` property.
 */
Arcade.prototype.enableBody = function (object) {
    if (object.hasOwnProperty('body') && object.body === null)
    {
        object.body = new Phaser.Physics.Arcade.Body(object);
    }
};

/**
 * Called automatically by a Physics body, it updates all motion related values on the Body unless `World.isPaused` is `true`.
 *
 * @method Phaser.Physics.Arcade#updateMotion
 * @param {Phaser.Physics.Arcade.Body} The Body object to be updated.
 */
Arcade.prototype.updateMotion = function(body) {
    var velocityDelta = this.computeVelocity(0, body, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity;
    body.angularVelocity += velocityDelta;
    body.rotation += (body.angularVelocity * this.game.time.physicsElapsed);

    body.velocity.x = this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x, body.maxVelocity.x);
    body.velocity.y = this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y, body.maxVelocity.y);

};

/**
 * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
 * Based on a function in Flixel by @ADAMATOMIC
 *
 * @method Phaser.Physics.Arcade#computeVelocity
 * @param {number} axis - 0 for nothing, 1 for horizontal, 2 for vertical.
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to be updated.
 * @param {number} velocity - Any component of velocity (e.g. 20).
 * @param {number} acceleration - Rate at which the velocity is changing.
 * @param {number} drag - Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
 * @param {number} [max=10000] - An absolute value cap for the velocity.
 * @return {number} The altered Velocity value.
 */
Arcade.prototype.computeVelocity = function(axis, body, velocity, acceleration, drag, max) {
    if (typeof max === 'undefined') { max = 10000; }

    if (axis === 1 && body.allowGravity)
    {
        velocity += (this.gravity.x + body.gravity.x) * this.game.time.physicsElapsed;
    }
    else if (axis === 2 && body.allowGravity)
    {
        velocity += (this.gravity.y + body.gravity.y) * this.game.time.physicsElapsed;
    }

    if (acceleration)
    {
        velocity += acceleration * this.game.time.physicsElapsed;
    }
    else if (drag)
    {
        // var _drag = drag * this.game.time.physicsElapsed;
        drag *= this.game.time.physicsElapsed;

        if (velocity - drag > 0)
        {
            velocity -= drag;
        }
        else if (velocity + drag < 0)
        {
            velocity += drag;
        }
        else
        {
            velocity = 0;
        }
    }

    if (velocity > max)
    {
        velocity = max;
    }
    else if (velocity < -max)
    {
        velocity = -max;
    }

    return velocity;
};

/**
 * Checks for overlaps between two game objects. The objects can be Sprites, Groups or Emitters.
 * You can perform Sprite vs. Sprite, Sprite vs. Group and Group vs. Group overlap checks.
 * Unlike collide the objects are NOT automatically separated or have any physics applied, they merely test for overlap results.
 * Both the first and second parameter can be arrays of objects, of differing types.
 * If two arrays are passed, the contents of the first parameter will be tested against all contents of the 2nd parameter.
 * NOTE: This function is not recursive, and will not test against children of objects passed (i.e. Groups within Groups).
 *
 * @method Phaser.Physics.Arcade#overlap
 * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|array} object1 - The first object or array of objects to check. Can be Phaser.Sprite, Phaser.Group or Phaser.Particles.Emitter.
 * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|array} object2 - The second object or array of objects to check. Can be Phaser.Sprite, Phaser.Group or Phaser.Particles.Emitter.
 * @param {function} [overlapCallback=null] - An optional callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you specified them.  The two objects will be passed to this function in the same order in which you specified them, unless you are checking Group vs. Sprite, in which case Sprite will always be the first parameter.
 * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then overlapCallback will only be called if processCallback returns true.
 * @param {object} [callbackContext] - The context in which to run the callbacks.
 * @return {boolean} True if an overlap occurred otherwise false.
 */
Arcade.prototype.overlap = function (object1, object2, overlapCallback, processCallback, callbackContext) {
    overlapCallback = overlapCallback || null;
    processCallback = processCallback || null;
    callbackContext = callbackContext || overlapCallback;

    this._total = 0;
    if (!Array.isArray(object1) && Array.isArray(object2))
    {
        for (var i = 0; i < object2.length; i++)
        {
            this.collideHandler(object1, object2[i], overlapCallback, processCallback, callbackContext, true);
        }
    }
    else if (Array.isArray(object1) && !Array.isArray(object2))
    {
        for (var i = 0; i < object1.length; i++)
        {
            this.collideHandler(object1[i], object2, overlapCallback, processCallback, callbackContext, true);
        }
    }
    else if (Array.isArray(object1) && Array.isArray(object2))
    {
        for (var i = 0; i < object1.length; i++)
        {
            for (var j = 0; j < object2.length; j++)
            {
                this.collideHandler(object1[i], object2[j], overlapCallback, processCallback, callbackContext, true);
            }
        }
    }
    else
    {
        this.collideHandler(object1, object2, overlapCallback, processCallback, callbackContext, true);
    }

    return (this._total > 0);
};

/**
 * Checks for collision between two game objects. You can perform Sprite vs. Sprite, Sprite vs. Group, Group vs. Group, Sprite vs. Tilemap Layer or Group vs. Tilemap Layer collisions.
 * Both the first and second parameter can be arrays of objects, of differing types.
 * If two arrays are passed, the contents of the first parameter will be tested against all contents of the 2nd parameter.
 * The objects are also automatically separated. If you don't require separation then use ArcadePhysics.overlap instead.
 * An optional processCallback can be provided. If given this function will be called when two sprites are found to be colliding. It is called before any separation takes place,
 * giving you the chance to perform additional checks. If the function returns true then the collision and separation is carried out. If it returns false it is skipped.
 * The collideCallback is an optional function that is only called if two sprites collide. If a processCallback has been set then it needs to return true for collideCallback to be called.
 * NOTE: This function is not recursive, and will not test against children of objects passed (i.e. Groups or Tilemaps within other Groups).
 *
 * @method Phaser.Physics.Arcade#collide
 * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.TilemapLayer|array} object1 - The first object or array of objects to check. Can be Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.TilemapLayer.
 * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.TilemapLayer|array} object2 - The second object or array of objects to check. Can be Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.TilemapLayer.
 * @param {function} [collideCallback=null] - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them, unless you are colliding Group vs. Sprite, in which case Sprite will always be the first parameter.
 * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
 * @param {object} [callbackContext] - The context in which to run the callbacks.
 * @return {boolean} True if a collision occurred otherwise false.
 */
Arcade.prototype.collide = function(object1, object2, collideCallback, processCallback, callbackContext) {
    collideCallback = collideCallback || null;
    processCallback = processCallback || null;
    callbackContext = callbackContext || collideCallback;

    this._total = 0;
    if (!Array.isArray(object1) && Array.isArray(object2))
    {
        for (var i = 0; i < object2.length; i++)
        {
            this.collideHandler(object1, object2[i], collideCallback, processCallback, callbackContext, false);
        }
    }
    else if (Array.isArray(object1) && !Array.isArray(object2))
    {
        for (var i = 0; i < object1.length; i++)
        {
            this.collideHandler(object1[i], object2, collideCallback, processCallback, callbackContext, false);
        }
    }
    else if (Array.isArray(object1) && Array.isArray(object2))
    {
        for (var i = 0; i < object1.length; i++)
        {
            for (var j = 0; j < object2.length; j++)
            {
                this.collideHandler(object1[i], object2[j], collideCallback, processCallback, callbackContext, false);
            }
        }
    }
    else
    {
        this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext, false);
    }

    return (this._total > 0);
};

/**
 * This method will sort a Groups _hash array based on the sortDirection property.
 *
 * Each function should return -1 if `a > b`, 1 if `a < b` or 0 if `a === b`.
 *
 * @method sort
 * @protected
 * @param {Phaser.Group} group - The Group to sort.
 */
Arcade.prototype.sort = function(group) {
    if (this.sortDirection === Phaser.Physics.Arcade.LEFT_RIGHT)
    {
        //  Game world is say 2000x600 and you start at 0
        group._hash.sort(function(a, b) {
            if (!a.body || !b.body)
            {
                return -1;
            }
            return a.body.x - b.body.x;
        });
    }
    else if (this.sortDirection === Phaser.Physics.Arcade.RIGHT_LEFT)
    {
        //  Game world is say 2000x600 and you start at 2000
        group._hash.sort(function(a, b) {
            if (!a.body || !b.body)
            {
                return -1;
            }
            return b.body.x - a.body.x;
        });
    }
    else if (this.sortDirection === Phaser.Physics.Arcade.TOP_BOTTOM)
    {
        //  Game world is say 800x2000 and you start at 0
        group._hash.sort(function(a, b) {
            if (!a.body || !b.body)
            {
                return -1;
            }
            return a.body.y - b.body.y;
        });
    }
    else if (this.sortDirection === Phaser.Physics.Arcade.BOTTOM_TOP)
    {
        //  Game world is say 800x2000 and you start at 2000
        group._hash.sort(function(a, b) {
            if (!a.body || !b.body)
            {
                return -1;
            }
            return b.body.y - a.body.y;
        });
    }
};

/**
 * Internal collision handler.
 *
 * @method Phaser.Physics.Arcade#collideHandler
 * @private
 * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.TilemapLayer} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.TilemapLayer.
 * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.TilemapLayer} object2 - The second object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.TilemapLayer. Can also be an array of objects to check.
 * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
 * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
 * @param {object} callbackContext - The context in which to run the callbacks.
 * @param {boolean} overlapOnly - Just run an overlap or a full collision.
 */
Arcade.prototype.collideHandler = function(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly) {
    //  If neither of the objects are set or exist then bail out
    if (!object1 || !object2 || !object1.exists || !object2.exists)
    {
        return;
    }

    //  Groups? Sort them
    if (this.sortDirection !== Phaser.Physics.Arcade.SORT_NONE)
    {
        if (object1.physicsType === Phaser.GROUP)
        {
            this.sort(object1);
        }

        if (object2.physicsType === Phaser.GROUP)
        {
            this.sort(object2);
        }
    }

    //  SPRITES
    this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
};

/**
 * An internal function. Use Phaser.Physics.Arcade.collide instead.
 *
 * @method Phaser.Physics.Arcade#collideSpriteVsSprite
 * @private
 * @param {Phaser.Sprite} sprite1 - The first sprite to check.
 * @param {Phaser.Sprite} sprite2 - The second sprite to check.
 * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
 * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
 * @param {object} callbackContext - The context in which to run the callbacks.
 * @param {boolean} overlapOnly - Just run an overlap or a full collision.
 * @return {boolean} True if there was a collision, otherwise false.
 */
Arcade.prototype.collideSpriteVsSprite = function(sprite1, sprite2, collideCallback, processCallback, callbackContext, overlapOnly) {

    if (!sprite1.body || !sprite2.body)
    {
        return false;
    }

    if (this.separate(sprite1.body, sprite2.body, processCallback, callbackContext, overlapOnly))
    {
        if (collideCallback)
        {
            collideCallback.call(callbackContext, sprite1, sprite2);
        }

        this._total++;
    }
    return true;
};

/**
 * The core separation function to separate two physics bodies.
 *
 * @private
 * @method Phaser.Physics.Arcade#separate
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body object to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body object to separate.
 * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this function is set then the sprites will only be collided if it returns true.
 * @param {object} [callbackContext] - The context in which to run the process callback.
 * @param {boolean} overlapOnly - Just run an overlap or a full collision.
 * @return {boolean} Returns true if the bodies collided, otherwise false.
 */
Arcade.prototype.separate = function(body1, body2, processCallback, callbackContext, overlapOnly) {
    if (!body1.enable || !body2.enable || !this.intersects(body1, body2))
    {
        return false;
    }

    //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
    if (processCallback && processCallback.call(callbackContext, body1.sprite, body2.sprite) === false)
    {
        return false;
    }

    //  Do we separate on x or y first?

    var result = false;

    //  If we weren't having to carry around so much legacy baggage with us, we could do this properly. But alas ...
    if (this.forceX || Math.abs(this.gravity.y + body1.gravity.y) < Math.abs(this.gravity.x + body1.gravity.x))
    {
        result = (this.separateX(body1, body2, overlapOnly) || this.separateY(body1, body2, overlapOnly));
    }
    else
    {
        result = (this.separateY(body1, body2, overlapOnly) || this.separateX(body1, body2, overlapOnly));
    }

    return overlapOnly ? true : result;
};

/**
 * 相交检查
 */
Arcade.prototype.intersects = function(body1, body2) {
    // 需要判定几个离散点
    var count = Math.max(body1.ccdIterations, body2.ccdIterations);
    if (count <= 0) {
        // 不需要离散点，直接判定
        return !(body1.right <= body2.x || body1.bottom <= body2.y ||
                 body1.x >= body2.right || body1.y >= body2.bottom);
    }

    // 做线性插值
    var deltaX1 = body1._dx / (count + 2),
        deltaX2 = body2._dx / (count + 2),
        deltaY1 = body1._dy / (count + 2),
        deltaY2 = body2._dy / (count + 2);
    var pt1 = Array(count + 1),
        pt2 = Array(count + 1);
    pt1[count] = [body1.x, body1.right, body1.y, body1.bottom];
    pt2[count] = [body2.x, body2.right, body2.y, body2.bottom];
    for (var i = count - 1; i >= 0; i--) {
        pt1[i] = [pt1[i + 1][0] - deltaX1, pt1[i + 1][1] - deltaX1, pt1[i + 1][2] - deltaY1, pt1[i + 1][3] - deltaY1];
    }
    for (i = count - 1; i >= 0; i--) {
        pt2[i] = [pt2[i + 1][0] - deltaX2, pt2[i + 1][1] - deltaX2, pt2[i + 1][2] - deltaY2, pt2[i + 1][3] - deltaY2];
    }

    // 逐个点比较
    for (i = 0; i <= count; i++) {
        if (pt1[i][1] <= pt2[i][0] || pt1[i][3] <= pt2[i][2] ||
            pt1[i][0] >= pt2[i][1] || pt1[i][2] >= pt2[i][3]) {
            // 这个点没有碰撞，继续检测
            continue;
        }

        // 在这个点碰撞了，修正位置
        body1.x = pt1[i][0];
        body1.y = pt1[i][2];
        body2.x = pt2[i][0];
        body2.y = pt2[i][2];
        return true;
    }
    return false;
};

/**
 * The core separation function to separate two physics bodies on the x axis.
 *
 * @private
 * @method Phaser.Physics.Arcade#separateX
 * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The Body object to separate.
 * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
 * @return {boolean} Returns true if the bodies were separated, otherwise false.
 */
Arcade.prototype.separateX = function(body1, body2, overlapOnly) {
    //  Can't separate two immovable bodies
    if (body1.immovable && body2.immovable)
    {
        return false;
    }

    var overlap = 0;

    //  Check if the hulls actually overlap
    if (this.intersects(body1, body2))
    {
        var maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + this.OVERLAP_BIAS;

        if (body1.deltaX() === 0 && body2.deltaX() === 0)
        {
            //  They overlap but neither of them are moving
            body1.embedded = true;
            body2.embedded = true;
        }
        else if (body1.deltaX() > body2.deltaX())
        {
            //  Body1 is moving right and/or Body2 is moving left
            overlap = body1.right - body2.x;

            if ((overlap > maxOverlap) || body1.checkCollision.right === false || body2.checkCollision.left === false)
            {
                overlap = 0;
            }
            else
            {
                body1.touching.none = false;
                body1.touching.right = true;
                body2.touching.none = false;
                body2.touching.left = true;
            }
        }
        else if (body1.deltaX() < body2.deltaX())
        {
            //  Body1 is moving left and/or Body2 is moving right
            overlap = body1.x - body2.width - body2.x;

            if ((-overlap > maxOverlap) || body1.checkCollision.left === false || body2.checkCollision.right === false)
            {
                overlap = 0;
            }
            else
            {
                body1.touching.none = false;
                body1.touching.left = true;
                body2.touching.none = false;
                body2.touching.right = true;
            }
        }

        //  Resets the overlapX to zero if there is no overlap, or to the actual pixel value if there is
        body1.overlapX = overlap;
        body2.overlapX = overlap;

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (overlap !== 0)
        {
            if (overlapOnly || body1.customSeparateX || body2.customSeparateX)
            {
                return true;
            }

            var v1 = body1.velocity.x;
            var v2 = body2.velocity.x;

            if (!body1.immovable && !body2.immovable)
            {
                overlap *= 0.5;

                body1.x -= overlap;
                body2.x += overlap;

                var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
                var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
                var avg = (nv1 + nv2) * 0.5;

                nv1 -= avg;
                nv2 -= avg;

                body1.velocity.x = avg + nv1 * body1.bounce.x;
                body2.velocity.x = avg + nv2 * body2.bounce.x;
            }
            else if (!body1.immovable)
            {
                body1.x -= overlap;
                body1.velocity.x = v2 - v1 * body1.bounce.x;

                //  This is special case code that handles things like vertically moving platforms you can ride
                if (body2.moves)
                {
                    body1.y += (body2.y - body2.prevY) * body2.friction.y;
                }
            }
            else if (!body2.immovable)
            {
                body2.x += overlap;
                body2.velocity.x = v1 - v2 * body2.bounce.x;

                //  This is special case code that handles things like vertically moving platforms you can ride
                if (body1.moves)
                {
                    body2.y += (body1.y - body1.prevY) * body1.friction.y;
                }
            }

            return true;
        }
    }

    return false;
};

/**
 * The core separation function to separate two physics bodies on the y axis.
 *
 * @private
 * @method Phaser.Physics.Arcade#separateY
 * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The Body object to separate.
 * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
 * @return {boolean} Returns true if the bodies were separated, otherwise false.
 */
Arcade.prototype.separateY = function(body1, body2, overlapOnly) {
    //  Can't separate two immovable or non-existing bodies
    if (body1.immovable && body2.immovable)
    {
        return false;
    }

    var overlap = 0;

    //  Check if the hulls actually overlap
    if (this.intersects(body1, body2))
    {
        var maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + this.OVERLAP_BIAS;

        if (body1.deltaY() === 0 && body2.deltaY() === 0)
        {
            //  They overlap but neither of them are moving
            body1.embedded = true;
            body2.embedded = true;
        }
        else if (body1.deltaY() > body2.deltaY())
        {
            //  Body1 is moving down and/or Body2 is moving up
            overlap = body1.bottom - body2.y;

            if ((overlap > maxOverlap) || body1.checkCollision.down === false || body2.checkCollision.up === false)
            {
                overlap = 0;
            }
            else
            {
                body1.touching.none = false;
                body1.touching.down = true;
                body2.touching.none = false;
                body2.touching.up = true;
            }
        }
        else if (body1.deltaY() < body2.deltaY())
        {
            //  Body1 is moving up and/or Body2 is moving down
            overlap = body1.y - body2.bottom;

            if ((-overlap > maxOverlap) || body1.checkCollision.up === false || body2.checkCollision.down === false)
            {
                overlap = 0;
            }
            else
            {
                body1.touching.none = false;
                body1.touching.up = true;
                body2.touching.none = false;
                body2.touching.down = true;
            }
        }

        //  Resets the overlapY to zero if there is no overlap, or to the actual pixel value if there is
        body1.overlapY = overlap;
        body2.overlapY = overlap;

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (overlap !== 0)
        {
            if (overlapOnly || body1.customSeparateY || body2.customSeparateY)
            {
                return true;
            }

            var v1 = body1.velocity.y;
            var v2 = body2.velocity.y;

            if (!body1.immovable && !body2.immovable)
            {
                overlap *= 0.5;

                body1.y -= overlap;
                body2.y += overlap;

                var nv1 = Math.sqrt((v2 * v2 * body2.mass) / body1.mass) * ((v2 > 0) ? 1 : -1);
                var nv2 = Math.sqrt((v1 * v1 * body1.mass) / body2.mass) * ((v1 > 0) ? 1 : -1);
                var avg = (nv1 + nv2) * 0.5;

                nv1 -= avg;
                nv2 -= avg;

                body1.velocity.y = avg + nv1 * body1.bounce.y;
                body2.velocity.y = avg + nv2 * body2.bounce.y;
            }
            else if (!body1.immovable)
            {
                body1.y -= overlap;
                body1.velocity.y = v2 - v1 * body1.bounce.y;

                //  This is special case code that handles things like horizontal moving platforms you can ride
                if (body2.moves)
                {
                    body1.x += (body2.x - body2.prevX) * body2.friction.x;
                }
            }
            else if (!body2.immovable)
            {
                body2.y += overlap;
                body2.velocity.y = v1 - v2 * body2.bounce.y;

                //  This is special case code that handles things like horizontal moving platforms you can ride
                if (body1.moves)
                {
                    body2.x += (body1.x - body1.prevX) * body1.friction.x;
                }
            }

            return true;
        }
    }

    return false;
};

/**
 * Move the given display object towards the destination object at a steady velocity.
 * If you specify a maxTime then it will adjust the speed (overwriting what you set) so it arrives at the destination in that number of seconds.
 * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
 * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
 * Note: The display object doesn't stop moving once it reaches the destination coordinates.
 * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
 *
 * @method Phaser.Physics.Arcade#moveToObject
 * @param {any} displayObject - The display object to move.
 * @param {any} destination - The display object to move towards. Can be any object but must have visible x/y properties.
 * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
 * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
 * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
 */
Arcade.prototype.moveToObject = function(displayObject, destination, speed, maxTime) {
    if (typeof speed === 'undefined') { speed = 60; }
    if (typeof maxTime === 'undefined') { maxTime = 0; }

    var angle = Math.atan2(destination.y - displayObject.y, destination.x - displayObject.x);

    if (maxTime > 0)
    {
        //  We know how many pixels we need to move, but how fast?
        speed = this.distanceBetween(displayObject, destination) / (maxTime / 1000);
    }

    displayObject.body.velocity.x = Math.cos(angle) * speed;
    displayObject.body.velocity.y = Math.sin(angle) * speed;
    return angle;
};

/**
 * Given the angle (in degrees) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
 * One way to use this is: velocityFromAngle(angle, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
 *
 * @method Phaser.Physics.Arcade#velocityFromAngle
 * @param {number} angle - The angle in degrees calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
 * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
 * @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated velocity.
 * @return {Phaser.Point} - A Point where point.x contains the velocity x value and point.y contains the velocity y value.
 */
Arcade.prototype.velocityFromAngle = function(angle, speed, point) {
    if (typeof speed === 'undefined') { speed = 60; }
    point = point || new Phaser.Point();

    return point.setTo((Math.cos(this.game.math.degToRad(angle)) * speed), (Math.sin(this.game.math.degToRad(angle)) * speed));
};

/**
 * Given the rotation (in radians) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
 * One way to use this is: velocityFromRotation(rotation, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
 *
 * @method Phaser.Physics.Arcade#velocityFromRotation
 * @param {number} rotation - The angle in radians.
 * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
 * @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated velocity.
 * @return {Phaser.Point} - A Point where point.x contains the velocity x value and point.y contains the velocity y value.
 */
Arcade.prototype.velocityFromRotation = function(rotation, speed, point) {
    if (typeof speed === 'undefined') { speed = 60; }
    point = point || new Phaser.Point();

    return point.setTo((Math.cos(rotation) * speed), (Math.sin(rotation) * speed));
};

/**
 * Sets the acceleration.x/y property on the display object so it will move towards the target at the given speed (in pixels per second sq.)
 * You must give a maximum speed value, beyond which the display object won't go any faster.
 * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
 * Note: The display object doesn't stop moving once it reaches the destination coordinates.
 *
 * @method Phaser.Physics.Arcade#accelerateToObject
 * @param {any} displayObject - The display object to move.
 * @param {any} destination - The display object to move towards. Can be any object but must have visible x/y properties.
 * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
 * @param {number} [xSpeedMax=500] - The maximum x velocity the display object can reach.
 * @param {number} [ySpeedMax=500] - The maximum y velocity the display object can reach.
 * @return {number} The angle (in radians) that the object should be visually set to in order to match its new trajectory.
 */
Arcade.prototype.accelerateToObject = function(displayObject, destination, speed, xSpeedMax, ySpeedMax) {
    if (typeof speed === 'undefined') { speed = 60; }
    if (typeof xSpeedMax === 'undefined') { xSpeedMax = 1000; }
    if (typeof ySpeedMax === 'undefined') { ySpeedMax = 1000; }

    var angle = this.angleBetween(displayObject, destination);

    displayObject.body.acceleration.setTo(Math.cos(angle) * speed, Math.sin(angle) * speed);
    displayObject.body.maxVelocity.setTo(xSpeedMax, ySpeedMax);

    return angle;
};

/**
 * Find the distance between two display objects (like Sprites).
 *
 * @method Phaser.Physics.Arcade#distanceBetween
 * @param {any} source - The Display Object to test from.
 * @param {any} target - The Display Object to test to.
 * @return {number} The distance between the source and target objects.
 */
Arcade.prototype.distanceBetween = function(source, target) {
    var dx = source.x - target.x;
    var dy = source.y - target.y;

    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Find the angle in radians between two display objects (like Sprites).
 *
 * @method Phaser.Physics.Arcade#angleBetween
 * @param {any} source - The Display Object to test from.
 * @param {any} target - The Display Object to test to.
 * @return {number} The angle in radians between the source and target display objects.
 */
Arcade.prototype.angleBetween = function(source, target) {
    var dx = target.x - source.x;
    var dy = target.y - source.y;

    return Math.atan2(dy, dx);
};

Phaser.Physics.Arcade.Body = function(sprite) {
    /**
     * @property {qc.Sprite} sprite - Reference to the parent Sprite.
     */
    this.sprite = sprite;
    this.qc = sprite._qc;

    /**
     * @property {qc.Game} game - Local reference to game.
     */
    this.game = sprite.game;

    /**
     * @property {number} type - The type of physics system this body belongs to.
     */
    this.type = Phaser.Physics.ARCADE;

    /**
     * @property {boolean} enable - A disabled body won't be checked for any form of collision or overlap or have its pre/post updates run.
     * @default true
     */
    this.enable = true;

    /**
     * @property {number} x - 刚体左上角的屏幕X坐标
     */
    this.x = sprite.world.x;
    this.prevX = this.x;

    /**
     * @property {number} y - 刚体左上角的屏幕Y坐标
     */
    this.y = sprite.world.y;
    this.prevY = this.y;

    /**
     * @property {number} width - 刚体在屏幕中的宽度
     * @readonly
     */
    this.width = sprite.width;

    /**
     * @property {number} height - 刚体在屏幕中的高度
     * @readonly
     */
    this.height = sprite.height;

    /**
     * @property {boolean} allowRotation - Allow this Body to be rotated? (via angularVelocity, etc)
     * @default
     */
    this.allowRotation = true;

    /**
     * An Arcade Physics Body can have angularVelocity and angularAcceleration. Please understand that the collision Body
     * itself never rotates, it is always axis-aligned. However these values are passed up to the parent Sprite and updates its rotation.
     * @property {number} rotation
     */
    this.rotation = sprite.rotation;

    /**
     * @property {number} preRotation - The previous rotation of the physics body.
     * @readonly
     */
    this.preRotation = sprite.rotation;

    /**
     * @property {qc.Point} gravity
     */
    this.gravity = new Phaser.Point(0, 0);

    /**
     * @property {number} ccdIterations - 连续碰撞的散列值
     * @default 0
     */
    this.ccdIterations = 0;

    /**
     * @property {qc.Point} velocity - 运动速度（基于父亲节点）
     */
    this.velocity = new Phaser.Point();
    this.newVelocity = new Phaser.Point(0, 0);

    /**
     * @property {qc.Point} deltaMax - 单次移动的最大距离限制
     */
    this.deltaMax = new Phaser.Point(0, 0);

    /**
     * @property {qc.Point} acceleration - 加速度
     */
    this.acceleration = new Phaser.Point();

    /**
     * @property {qc.Point} drag - The drag applied to the motion of the Body.
     */
    this.drag = new Phaser.Point();

    /**
     * @property {boolean} allowGravity - Allow this Body to be influenced by gravity? Either world or local.
     * @default
     */
    this.allowGravity = true;

    /**
     * @property {Phaser.Point} bounce - The elasticity of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
     */
    this.bounce = new Phaser.Point();

    /**
     * @property {Phaser.Point} maxVelocity - The maximum velocity in pixels per second sq. that the Body can reach.
     * @default
     */
    this.maxVelocity = new Phaser.Point(10000, 10000);

    /**
     * @property {Phaser.Point} friction - The amount of movement that will occur if another object 'rides' this one.
     */
    this.friction = new Phaser.Point(1, 0);

    /**
     * @property {number} angularVelocity - The angular velocity controls the rotation speed of the Body. It is measured in radians per second.
     * @default
     */
    this.angularVelocity = 0;

    /**
     * @property {number} angularAcceleration - The angular acceleration is the rate of change of the angular velocity. Measured in radians per second squared.
     * @default
     */
    this.angularAcceleration = 0;

    /**
     * @property {number} angularDrag - The drag applied during the rotation of the Body.
     * @default
     */
    this.angularDrag = 0;

    /**
     * @property {number} maxAngular - The maximum angular velocity in radians per second that the Body can reach.
     * @default
     */
    this.maxAngular = 1000;

    /**
     * @property {number} mass - The mass of the Body. When two bodies collide their mass is used in the calculation to determine the exchange of velocity.
     * @default
     */
    this.mass = 1;

    /**
     * @property {number} angle - The angle of the Body in radians, as calculated by its angularVelocity.
     * @readonly
     */
    this.angle = 0;

    /**
     * @property {number} speed - The speed of the Body as calculated by its velocity.
     * @readonly
     */
    this.speed = 0;

    /**
     * @property {number} facing - A const reference to the direction the Body is traveling or facing.
     * @default
     */
    this.facing = Phaser.NONE;

    /**
     * @property {boolean} immovable - An immovable Body will not receive any impacts from other bodies.
     * @default
     */
    this.immovable = false;

    /**
     * If you have a Body that is being moved around the world via a tween or a Group motion, but its local x/y position never
     * actually changes, then you should set Body.moves = false. Otherwise it will most likely fly off the screen.
     * If you want the physics system to move the body around, then set moves to true.
     * @property {boolean} moves - Set to true to allow the Physics system to move this Body, otherwise false to move it manually.
     * @default
     */
    this.moves = true;

    /**
     * This flag allows you to disable the custom x separation that takes place by Physics.Arcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateX - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateX = false;

    /**
     * This flag allows you to disable the custom y separation that takes place by Physics.Arcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateY - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateY = false;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapX - The amount of horizontal overlap during the collision.
     */
    this.overlapX = 0;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapY - The amount of vertical overlap during the collision.
     */
    this.overlapY = 0;

    /**
     * If a body is overlapping with another body, but neither of them are moving (maybe they spawned on-top of each other?) this is set to true.
     * @property {boolean} embedded - Body embed value.
     */
    this.embedded = false;

    /**
     * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
     * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
     */
    this.collideWorldBounds = false;

    /**
     * Set the checkCollision properties to control which directions collision is processed for this Body.
     * For example checkCollision.up = false means it won't collide when the collision happened while moving up.
     * @property {object} checkCollision - An object containing allowed collision.
     */
    this.checkCollision = { none: false, any: true, up: true, down: true, left: true, right: true };

    /**
     * This object is populated with boolean values when the Body collides with another.
     * touching.up = true means the collision happened to the top of this Body for example.
     * @property {object} touching - An object containing touching results.
     */
    this.touching = { none: true, up: false, down: false, left: false, right: false };

    /**
     * This object is populated with previous touching values from the bodies previous collision.
     * @property {object} wasTouching - An object containing previous touching results.
     */
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

    /**
     * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
     * For example if blocked.up is true then the Body cannot move up.
     * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
     */
    this.blocked = { up: false, down: false, left: false, right: false };

    /**
     * @property {boolean} dirty - If this Body in a preUpdate (true) or postUpdate (false) state?
     */
    this.dirty = false;

    /**
     * @property {boolean} _reset - Internal cache var.
     * @private
     */
    this._reset = true;

    /**
     * @property {number} _sx - Internal cache var.
     * @private
     */
    this._sx = sprite.scale.x;
    this._spx = this._sx;

    /**
     * @property {number} _sy - Internal cache var.
     * @private
     */
    this._sy = sprite.scale.y;
    this._spy = this._sy;

    /**
     * @property {number} _dx - Internal cache var.
     * @private
     */
    this._dx = 0;

    /**
     * @property {number} _dy - Internal cache var.
     * @private
     */
    this._dy = 0;
};
var Body = Phaser.Physics.Arcade.Body;
Body.prototype = {};
Body.prototype.constructor = Body;

Object.defineProperties(Body.prototype, {
    right: {
        get: function() { return this.x + this.width; }
    },
    bottom: {
        get: function() { return this.y + this.height; }
    }
});

/**
 * 当节点缩放变化时，需要重新计算下
 */
Body.prototype.updateBounds = function(force) {
    var wt = this.qc.worldTransform;
    var asx = wt.a, asy = wt.d;

    var pwt = this.qc.parent.worldTransform;
    this._spx = pwt.a;
    this._spy = pwt.d;

    if (force ||
        (asx !== this._sx || asy !== this._sy)) {
        // 缓存scale的数据
        this._sx = asx;
        this._sy = asy;

        // 计算节点的世界宽和高
        // Note: get/set比较耗，这里直接访问内部变量了
        this.width = Math.abs(asx * this.qc._width);
        this.height = Math.abs(asy * this.qc._height);

        // 标记下
        this._reset = true;
    }
};

/**
 * 帧调度
 */
Body.prototype.preUpdate = function() {
    if (!this.enable || this.game.physics.arcade.isPaused) return;

    this.dirty = true;

    //  Store and reset collision flags
    this.wasTouching.none = this.touching.none;
    this.wasTouching.up = this.touching.up;
    this.wasTouching.down = this.touching.down;
    this.wasTouching.left = this.touching.left;
    this.wasTouching.right = this.touching.right;
    this.touching.none = true;
    this.touching.up = false;
    this.touching.down = false;
    this.touching.left = false;
    this.touching.right = false;
    this.blocked.up = false;
    this.blocked.down = false;
    this.blocked.left = false;
    this.blocked.right = false;
    this.embedded = false;

    // 计算当前的位置
    this.updateBounds();
    if (this._sx >= 0) {
        this.x = this.sprite.world.x - (this.sprite.anchor.x * this.width);
    }
    else {
        this.x = this.sprite.world.x - ((1 - this.sprite.anchor.x) * this.width);
    }
    if (this._sy >= 0) {
        this.y = this.sprite.world.y - (this.sprite.anchor.y * this.height);
    }
    else {
        this.y = this.sprite.world.y - ((1 - this.sprite.anchor.y) * this.height);
    }
    this.rotation = this.sprite.angle;
    this.preRotation = this.rotation;

    if (this._reset || this.sprite.fresh)
    {
        this.prevX = this.x;
        this.prevY = this.y;
    }

    if (this.moves)
    {
        this.game.physics.arcade.updateMotion(this);

        this.newVelocity.set(this.velocity.x * this.game.time.physicsElapsed,
            this.velocity.y * this.game.time.physicsElapsed);
        this.x += this.newVelocity.x * this._spx;
        this.y += this.newVelocity.y * this._spy;

        if (this.x !== this.prevX || this.y !== this.prevY)
        {
            this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        }

        //  Now the State update will throw collision checks at the Body
        //  And finally we'll integrate the new position back to the Sprite in postUpdate
        if (this.collideWorldBounds)
        {
            this.checkWorldBounds();
        }
    }

    // 计算期望的位移差
    this._dx = this.x - this.prevX;
    this._dy = this.y - this.prevY;

    this._reset = false;
};

Body.prototype.postUpdate = function() {
    if (!this.enable || !this.dirty) return;

    this.dirty = false;

    // 计算调整后的位移（可能因为碰撞等原因进行了调整）
    var dx = this.x - this.prevX,
        dy = this.y - this.prevY;
    if (dx < 0)
    {
        this.facing = Phaser.LEFT;
    }
    else if (dx > 0)
    {
        this.facing = Phaser.RIGHT;
    }
    if (dy < 0)
    {
        this.facing = Phaser.UP;
    }
    else if (dy > 0)
    {
        this.facing = Phaser.DOWN;
    }

    if (this.moves)
    {
        this._dx = dx;
        this._dy = dy;

        if (this.deltaMax.x !== 0 && this._dx !== 0)
        {
            if (this._dx < 0 && this._dx < -this.deltaMax.x)
            {
                this._dx = -this.deltaMax.x;
                this.x = this._dx + this.prevX;
            }
            else if (this._dx > 0 && this._dx > this.deltaMax.x)
            {
                this._dx = this.deltaMax.x;
                this.x = this._dx + this.prevX;
            }
        }

        if (this.deltaMax.y !== 0 && this._dy !== 0)
        {
            if (this._dy < 0 && this._dy < -this.deltaMax.y)
            {
                this._dy = -this.deltaMax.y;
                this.y = this._dy + this.prevY;
            }
            else if (this._dy > 0 && this._dy > this.deltaMax.y)
            {
                this._dy = this.deltaMax.y;
                this.y = this._dy + this.prevY;
            }
        }

        // 根据left和right，计算目标的原点位置
        if (this._dx !== 0) this.qc.x += this._dx / this._spx;
        if (this._dy !== 0) this.qc.y += this._dy / this._spy;
        this._reset = true;
    }

    if (this.allowRotation)
    {
        this.sprite.angle += this.deltaZ();
    }
    this.prevX = this.x;
    this.prevY = this.y;
};

Body.prototype.destroy = function() {
    this.sprite.body = null;
    this.sprite = null;
    this.qc = null;
};

Body.prototype.checkWorldBounds = function() {
    if (this.x < this.game.physics.arcade.bounds.x && this.game.physics.arcade.checkCollision.left &&
        this._dx < 0)
    {
        // 碰到左边界了，需要拉回来
        var qc = this.sprite._qc;
        this.x = this.game.physics.arcade.bounds.x;

        this.velocity.x *= -this.bounce.x;
        this.blocked.left = true;
    }
    else if (this.right > this.game.physics.arcade.bounds.right && this.game.physics.arcade.checkCollision.right &&
        this._dx > 0)
    {
        // 碰到右边界了，需要拉回来
        var qc = this.sprite._qc;
        this.x = this.game.physics.arcade.bounds.right - this.width;

        this.velocity.x *= -this.bounce.x;
        this.blocked.right = true;
    }

    if (this.y < this.game.physics.arcade.bounds.y && this.game.physics.arcade.checkCollision.up &&
        this._dy < 0)
    {
        // 碰到上边界了，需要拉回来
        var qc = this.sprite._qc;
        this.y = this.game.physics.arcade.bounds.y;

        this.velocity.y *= -this.bounce.y;
        this.blocked.up = true;
    }
    else if (this.bottom > this.game.physics.arcade.bounds.bottom && this.game.physics.arcade.checkCollision.down &&
        this._dy > 0)
    {
        // 碰到下边界了，需要拉回来
        var qc = this.sprite._qc;
        this.y = this.game.physics.arcade.bounds.bottom - this.height;

        this.velocity.y *= -this.bounce.y;
        this.blocked.down = true;
    }
};

Body.prototype.reset = function(x, y) {
    this.velocity.set(0);
    this.acceleration.set(0);

    this.speed = 0;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;

    this._reset = true;
};

/**
 * Returns true if the bottom of this Body is in contact with either the world bounds or a tile.
 *
 * @method Phaser.Physics.Arcade.Body#onFloor
 * @return {boolean} True if in contact with either the world bounds or a tile.
 */
Body.prototype.onFloor = function() {
    return this.blocked.down;
};

/**
 * Returns true if either side of this Body is in contact with either the world bounds or a tile.
 *
 * @method Phaser.Physics.Arcade.Body#onWall
 * @return {boolean} True if in contact with either the world bounds or a tile.
 */
Body.prototype.onWall = function() {
    return (this.blocked.left || this.blocked.right);
};

/**
 * Returns the absolute delta x value.
 *
 * @method Phaser.Physics.Arcade.Body#deltaAbsX
 * @return {number} The absolute delta value.
 */
Body.prototype.deltaAbsX = function() {
    return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
};

/**
 * Returns the absolute delta y value.
 *
 * @method Phaser.Physics.Arcade.Body#deltaAbsY
 * @return {number} The absolute delta value.
 */
Body.prototype.deltaAbsY = function() {
    return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
};

/**
 * Returns the delta x value. The difference between Body.x now and in the previous step.
 *
 * @method Phaser.Physics.Arcade.Body#deltaX
 * @return {number} The delta value. Positive if the motion was to the right, negative if to the left.
 */
Body.prototype.deltaX = function (){
    return this.x - this.prevX;
};

/**
 * Returns the delta y value. The difference between Body.y now and in the previous step.
 *
 * @method Phaser.Physics.Arcade.Body#deltaY
 * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
 */
Body.prototype.deltaY = function() {
    return this.y - this.prevY;
};

/**
 * Returns the delta z value. The difference between Body.rotation now and in the previous step.
 *
 * @method Phaser.Physics.Arcade.Body#deltaZ
 * @return {number} The delta value. Positive if the motion was clockwise, negative if anti-clockwise.
 */
Body.prototype.deltaZ = function() {
    return this.rotation - this.preRotation;
};

/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 负责处理游戏的物理（使用arcade physics），刚体
 * @class qc.arcade.RigidBody
 */
var RigidBody = qc.defineBehaviour('qc.arcade.RigidBody', qc.Behaviour, function() {
        var self = this;
        self.arcade = self.game.phaser.physics.arcade;
        self.phaser = self.gameObject.phaser;

        // 检测碰撞的节点
        self._collide = [];

        // 检测重合的节点
        self._overlap = [];

        // 只有精灵和UIImage才能挂载刚体
        if (!(self.gameObject instanceof qc.Sprite) && !(self.gameObject instanceof qc.UIImage))
            throw new Error('Only Sprite or UIImage can attack RigidBody!');
        self.phaser.enableBody = false;
        self.phaser.physicsBodyType = Phaser.Physics.ARCADE;
        self.arcade.enable(self.phaser, self.phaser.physicsBodyType, false);
        self.phaser.body.enable = false;
        self.phaser.body._qc = self;
    }, function() {
        return {
            // 需要序列化的字段列表
            mass: qc.Serializer.NUMBER,
            collideWorldBounds: qc.Serializer.BOOLEAN,
            allowRotation: qc.Serializer.BOOLEAN,
            allowGravity: qc.Serializer.BOOLEAN,
            velocity: qc.Serializer.POINT,
            maxVelocity: qc.Serializer.POINT,
            acceleration: qc.Serializer.POINT,
            drag: qc.Serializer.POINT,
            gravity: qc.Serializer.POINT,
            friction: qc.Serializer.POINT,
            angularVelocity: qc.Serializer.NUMBER,
            maxAngular: qc.Serializer.NUMBER,
            angularAcceleration: qc.Serializer.NUMBER,
            angularDrag: qc.Serializer.NUMBER,
            bounce: qc.Serializer.POINT,
            immovable: qc.Serializer.BOOLEAN,
            moves: qc.Serializer.BOOLEAN,
            checkCollision: qc.Serializer.MAPPING,
            tilePadding: qc.Serializer.POINT,
            collides: qc.Serializer.NODES,
            overlaps: qc.Serializer.NODES,
            ccdIterations: qc.Serializer.INT
        }
    }
);

// 菜单上的显示
RigidBody.__menu = 'Plugins/Arcade/RigidBody';

Object.defineProperties(RigidBody.prototype, {
    /**
     * @property {number} mass - 物体的质量
     * @default 1
     */
    mass: {
        get: function()  { return this.phaser.body.mass; },
        set: function(v) { this.phaser.body.mass = v;    }
    },

    /**
     * @property {boolean} collideWorldBounds - 碰到游戏世界的边界是否反弹
     * @default false
     */
    collideWorldBounds: {
        get: function()  { return this.phaser.body.collideWorldBounds; },
        set: function(v) { this.phaser.body.collideWorldBounds = v;    }
    },

    /**
     * @property {boolean} allowRotation - 是否允许刚体旋转
     * @default true
     */
    allowRotation: {
        get: function()  { return this.phaser.body.allowRotation; },
        set: function(v) { this.phaser.body.allowRotation = v;    }
    },

    /**
     * @property {boolean} allowGravity - 是否受重力影响
     * @default true
     */
    allowGravity: {
        get: function()  { return this.phaser.body.allowGravity; },
        set: function(v) { this.phaser.body.allowGravity = v;    }
    },

    /**
     * @property {qc.Point} velocity - 速度
     * @default {x:0, y:0}
     */
    velocity: {
        get: function()  { return this.phaser.body.velocity; },
        set: function(v) { this.phaser.body.velocity = v;    }
    },

    /**
     * @property {qc.Point} maxVelocity - 最大移动速度
     * @default {x:10000, y:10000}
     */
    maxVelocity: {
        get: function()  { return this.phaser.body.maxVelocity; },
        set: function(v) { this.phaser.body.maxVelocity = v;    }
    },

    /**
     * @property {number} angularAcceleration - 角移动加速度
     * @default
     */
    angularAcceleration: {
        get: function()  { return this.phaser.body.angularAcceleration; },
        set: function(v) { this.phaser.body.angularAcceleration = v;
                           this.gameObject._isTransformDirty = true;    }
    },

    /**
     * @property {qc.Point} acceleration - 加速度
     * @default {x:0, y:0}
     */
    acceleration: {
        get: function()  { return this.phaser.body.acceleration; },
        set: function(v) { this.phaser.body.acceleration = v;    }
    },

    /**
     * @property {qc.Point} drag - 空气阻力
     * @default {x:0, y:0}
     */
    drag: {
        get: function()  { return this.phaser.body.drag; },
        set: function(v) { this.phaser.body.drag = v;    }
    },

    /**
     * @property {qc.Point} gravity - 重力
     * @default {x:0, y:0}
     */
    gravity: {
        get: function()  { return this.phaser.body.gravity; },
        set: function(v) { this.phaser.body.gravity = v;
                           this.gameObject._isTransformDirty = true; }
    },

    /**
     * @property {qc.Point} bounce - 反弹力
     * @default {x:0, y:0}
     */
    bounce: {
        get: function()  { return this.phaser.body.bounce; },
        set: function(v) { this.phaser.body.bounce = v;
                           this.gameObject._isTransformDirty = true; }
    },

    /**
     * @property {qc.Point} friction - 摩擦力
     * @default {x:1, y:0}
     */
    friction: {
        get: function()  { return this.phaser.body.friction; },
        set: function(v) { this.phaser.body.friction = v;
                           this.gameObject._isTransformDirty = true; }
    },

    /**
     * @property {number} angularVelocity - 角速度（弧度）
     * @default 0
     */
    angularVelocity: {
        get: function()  { return this.phaser.body.angularVelocity; },
        set: function(v) { this.phaser.body.angularVelocity = v;
                           this.gameObject._isTransformDirty = true; }
    },

    /**
     * @property {number} angularDrag - 角阻力
     * @default 0
     */
    angularDrag: {
        get: function()  { return this.phaser.body.angularDrag; },
        set: function(v) { this.phaser.body.angularDrag = v;
                           this.gameObject._isTransformDirty = true; }
    },

    /**
     * @property {number} maxAngular - 最大角速度（弧度）
     * @default 1000
     */
    maxAngular: {
        get: function()  { return this.phaser.body.maxAngular; },
        set: function(v) { this.phaser.body.maxAngular = v;    }
    },

    /**
     * @property {number} angle - 当前物体的角度（弧度）
     * @readonly
     */
    angle: {
        get: function() { return this.phaser.body.angle; }
    },

    /**
     * @property {number} speed - 当前物体的移动速度
     * @readonly
     */
    speed: {
        get: function() { return this.phaser.body.speed; }
    },

    /**
     * @property {boolean} immovable - 物理固定不动，不受其他刚体的影响
     * @default false
     */
    immovable: {
        get: function()  { return this.phaser.body.immovable; },
        set: function(v) { this.phaser.body.immovable = v;    }
    },

    /**
     * @property {boolean} moves - 当前是否由物理来决定其位置信息
     * @default true
     */
    moves: {
        get: function()  { return this.phaser.body.moves; },
        set: function(v) { this.phaser.body.moves = v;
                           this.gameObject._isTransformDirty = true; }
    },

    /**
     * @property {number} overlapX - 物理重叠后X方向的重叠范围
     * @readonly
     */
    overlapX: {
        get: function() { return this.phaser.body.overlapX; }
    },

    /**
     * @property {number} overlapY - 物理重叠后Y方向的重叠范围
     * @readonly
     */
    overlapY: {
        get: function() { return this.phaser.body.overlapY; }
    },

    /**
     * @property {boolean} embedded - 两个物体重叠但都没运动时，设置为true
     * @readonly
     */
    embedded: {
        get: function()  { return this.phaser.body.embedded; },
        set: function(v) { this.phaser.body.embedded = v;    }
    },

    /**
     * @property {object} checkCollision - 当物体向某方向移动时，是否检查碰撞
     * @default { none: false, any: true, up: true, down: true, left: true, right: true }
     */
    checkCollision: {
        get: function()  { return this.phaser.body.checkCollision; },
        set: function(v) { this.phaser.body.checkCollision = v;    }
    },

    /**
     * @property {object} touching - 物体碰撞后指明是从什么方向进入碰撞的
     * 例如：touching.up = true - 表示碰撞发生在顶部
     * @readonly
     */
    touching: {
        get: function() { return this.phaser.body.touching; }
    },

    /**
     * @property {object} wasTouching - This object is populated with previous touching values from the bodies previous collision.
     * @readonly
     */
    wasTouching: {
        get: function() { return this.phaser.body.wasTouching; }
    },

    /**
     * @property {object} blocked - 物体不能向某个方向移动
     * @readonly
     */
    blocked: {
        get: function()  { return this.phaser.body.blocked; },
        set: function(v) { this.phaser.body.blocked = v;    }
    },

    /**
     * @property {qc.Point} tilePadding -
     * 物体高速运动时，可能会穿过其他物体。
     * 设置这个值可以额外按照步长检测，防止这种情况的发生
     */
    tilePadding: {
        get: function()  { return this.phaser.body.tilePadding; },
        set: function(v) { this.phaser.body.tilePadding = v;    }
    },

    /**
     * @property {boolean} onFloor - 物体是不是在世界（地图）的底部
     * @readonly
     */
    onFloor: {
        get: function() { return this.phaser.body.onFloor(); }
    },

    /**
     * @property {boolean} onWall - 物体是不是某一边靠在世界边界
     * @readonly
     */
    onWall: {
        get: function() { return this.phaser.body.onWall(); }
    },

    /**
     * @property {number} deltaX - 两帧之间，物体在X方向移动的距离
     * @readonly
     */
    deltaX: {
        get: function() { return this.phaser.body.deltaX(); }
    },

    /**
     * @property {number} deltaY - 两帧之间，物体在Y方向移动的距离
     * @readonly
     */
    deltaY: {
        get: function() { return this.phaser.body.deltaY(); }
    },

    /**
     * @property {number} deltaZ - 两帧之间，物体旋转的弧度
     * @readonly
     */
    deltaZ: {
        get: function() { return this.phaser.body.deltaZ(); }
    },

    /**
     * @property {array} collides - 需要进行碰撞检测的元素
     */
    collides: {
        get: function()  { return this._collide; },
        set: function(v) { this._collide = v;    }
    },

    /**
     * @property {array} collides - 需要进行重叠检测的元素
     */
    overlaps: {
        get: function()  { return this._overlap; },
        set: function(v) { this._overlap = v;    }
    },

    /**
     * @property {number} ccdIterations
     *  碰撞检测时的离散点数量（0或-1表示不检测离散点）
     *  注意：值越大性能越差，但碰撞检测的效果越好
     * @default 0
     */
    ccdIterations: {
        get: function()  { return this.phaser.body.ccdIterations; },
        set: function(v) { this.phaser.body.ccdIterations = v;    }
    }
});

/**
 * 组件初始化
 */
RigidBody.prototype.awake = function() {
    // 强制重更新包围盒
    var body = this.phaser.body;
    body.updateBounds(true);
};

/**
 * 组件启用的处理
 */
RigidBody.prototype.onEnable = function() {
    var self = this;
    self.phaser.enableBody = true;
    self.phaser.body.enable = true;
};

/**
 * 组件禁用的处理
 */
RigidBody.prototype.onDisable = function() {
    var self = this;
    self.phaser.enableBody = false;
    self.phaser.body.enable = false;
};

/**
 * 帧调度
 */
RigidBody.prototype.update = function() {
    var self = this;
    for (var i = 0; i < self._collide.length; i++) {
        var node = self._collide[i];
        if (!node || node._destroy) continue;
        self.arcade.collide(self.phaser, node.phaser, self._collideCallback, undefined, self);
    }
    for (var i = 0; i < self._overlap.length; i++) {
        var node = self._overlap[i];
        if (!node || node._destroy) continue;
        self.arcade.overlap(self.phaser, node.phaser, self._overlapCallback, undefined, self);
    }
};

/**
 * 重置刚体的数据
 * @method qc.arcade.RigidBody#reset
 */
RigidBody.prototype.reset = function() {
    this._collide = [];
    this._overlap = [];
    this.phaser.body.reset(this.gameObject.x, this.gameObject.y);
};

/**
 * 添加一个碰撞检测节点
 * @method qc.arcade.RigidBody#addCollide
 */
RigidBody.prototype.addCollide = function(node) {
    if (this._collide.indexOf(node) === -1) {
        this._collide.push(node);
    }
};

/**
 * 删除一个碰撞检测节点
 * @method qc.arcade.RigidBody#removeCollide
 */
RigidBody.prototype.removeCollide = function(node) {
    var index = this._collide.indexOf(node);
    if (index !== -1) {
        this._collide.splice(index, 1);
    }
};

/**
 * 添加一个重叠检测节点
 * @method qc.arcade.RigidBody#addOverlap
 */
RigidBody.prototype.addOverlap = function(node) {
    if (this._overlap.indexOf(node) === -1) {
        this._overlap.push(node);
    }
};

/**
 * 删除一个重叠检测节点
 * @method qc.arcade.RigidBody#removeOverlap
 */
RigidBody.prototype.removeOverlap = function(node) {
    var index = this._overlap.indexOf(node);
    if (index !== -1) {
        this._overlap.splice(index, 1);
    }
};

/**
 * 按照一定的速度移动到目标位置
 * 如果指定了maxTime，会自动调整移动速度（确保按照指定的时间到达目标点）
 * 注意：移动时不会跟踪目标
 * 注意：当移动到目标位置时才会停止
 * @method qc.arcade.RigidBody#moveToObject
 * @param {any} destination - 目标位置（包含有xy属性即可）
 * @param {number} [speed=60] - 移动速度，每秒移动多少像素
 * @param {number} [maxTime=0] - 最大的耗时时间，单位毫秒
 * @return {number} 当前物体的旋转弧度
 */
RigidBody.prototype.moveToObject = function(destination, speed, maxTime) {
    return this.arcade.moveToObject(this.phaser, destination, speed, maxTime);
};

/**
 * 根据角度和速度，得到水平和垂直方向的速度
 * @param angle
 * @param speed
 * @param point
 * @returns {qc.Point}
 */
RigidBody.prototype.velocityFromAngle = function(angle, speed, point) {
    return this.arcade.velocityFromAngle(angle, speed, point);
};

/**
 * 根据弧度和速度，得到水平和垂直方向的速度
 * @param rotation
 * @param speed
 * @param point
 */
RigidBody.prototype.velocityFromRotation = function(rotation, speed, point) {
    return this.arcade.velocityFromRotation(rotation, speed, point);
};

/**
 * 以加速度移动到目标位置
 * @method qc.arcade.RigidBody#accelerateToObject
 * @param destination
 * @param speed
 * @param xSpeedMax
 * @param ySpeedMax
 */
RigidBody.prototype.accelerateToObject = function(destination, speed, xSpeedMax, ySpeedMax) {
    return this.arcade.accelerateToObject(this.phaser, destination, speed, xSpeedMax, ySpeedMax);
};

/**
 * 计算距离
 * @method qc.arcade.RigidBody#distanceBetween
 * @param target
 * @returns {number}
 */
RigidBody.prototype.distanceBetween = function(target) {
    return this.arcade.distanceBetween(this.phaser, target);
};

/**
 * 计算夹角（弧度）
 * @method qc.arcade.RigidBody#angleBetween
 * @param target
 * @returns {number}
 */
RigidBody.prototype.angleBetween = function(target) {
    return this.arcade.angleBetween(this.phaser, target);
};

/**
 * 碰撞的回调
 * @private
 */
RigidBody.prototype._collideCallback = function(o1, o2) {
    this.gameObject._sendMessage('onCollide', o1._qc, o2._qc);
};

/**
 * 重叠的回调
 * @private
 */
RigidBody.prototype._overlapCallback = function(o1, o2) {
    this.gameObject._sendMessage('onOverlap', o1._qc, o2._qc);
};

    // 定义本工程的名字空间
    qc.keepRunning = {};

    // 用来存放所有的全局数据（函数、变量等）
    window.G = qc.keepRunning.G = {
    };
	G.bgRun = true;
	G.distance = 0;
	G.offset = 4;
	G.playerDead = false;

    // 初始化逻辑
    qc.initGame = function(game) {
        game.log.trace('Start the game logic.');

        // 将game实例的引用记录下来，方便在其他逻辑脚本模块中访问
        G.game = game;

        // TODO: 其他逻辑待补充
    };
/**
 * 场景加载的进度提示界面
 */
var LoadingUI = qc.defineBehaviour('qc.demo.LoadingUI', qc.Behaviour,
    function() {
        this.clue = null;    
    	this.bg = null;
    },
    {
        // 需要序列化的字段
        clue: qc.Serializer.NODE,
    	bg:qc.Serializer.NODE
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
//     if(this.clue){
        if (total) {
            self.clue.text = '拼命加载中：... ' + loaded + '/' + total;
        }
        else {
            self.clue.text = '';
        }
//     }
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
// define a user behaviour
var bgLoop = qc.defineBehaviour('qc.engine.bgLoop', qc.Behaviour, 
    function() {
        this.bg1 = null;    
    	this.bg2 = null;
    },
    {
        // 需要序列化的字段
        bg1: qc.Serializer.NODE,
    	bg2:qc.Serializer.NODE
    }
);

// Awake is called when the script instance is being loaded.
//bgLoop.prototype.awake = function() {
//
//};

// Update is called every frame, if the behaviour is enabled.
bgLoop.prototype.update = function() {
// 	if ( G.bgRun == true) {
//         G.distance ++ ;
//         if(this.bg1){
//         	this.bg1.y = this.bg1.y - G.offset;
//             if (this.bg1.y < -this.bg1.height) {
//                 this.bg1.y = this.bg1.height-10;
//             };
//         }
//         if(this.bg2){
//             this.bg2.y = this.bg2.y - G.offset;
//             if (this.bg2.y < -this.bg2.height) {
//                 this.bg2.y = this.bg2.height-10;
//             };   
//         }
//     };
};

// define a user behaviour
var startGameBtnClicked = qc.defineBehaviour('qc.engine.startGameBtnClicked', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    this.scene = '';
}, {
     scene: qc.Serializer.STRING
});


 startGameBtnClicked.prototype.onClick = function() { 
    // 切换到指定场景
    var self = this;
    var load = function() {
        self.game.state.load(self.scene, false, function() {
            // 方式1：预加载中，我们可以做一些资源的加载操作
//             self.game.assets.load('loadSync', 'Assets/atlas/pic.bin');
        }, function() {
            console.log(self.scene + '场景加载完毕。');

//             self.game.world.find('UIRoot/UIText').text =
//                 '切场景成功。\n' +
//                 '注意下面2图分别演示了：\n' +
//                 'preload中预加载、载入成功后异步加载。\n' +
//                 '详细见 Scripts/nextScene.js 中的处理。';

//             // 这里面预加载的资源一定都已经加载完毕可以供后续游戏使用，用于自定资源的预加载
//             var node = self.game.world.find('syncShow');
//             if (!node) {
//                 node = self.game.add.image();
//                 node.name = 'syncShow';
//                 node.x = 10;
//                 node.y = 120;
//             }
//             node.texture = self.game.assets.find('loadSync');

//             // 方式2：异步加载，结束回调后资源为可用状态
//             self.game.assets.load('loadAsync', 'Assets/atlas/loadAsync.bin', function(asset) {
//                 var nodeAsync = self.game.world.find('asyncShow');
//                 if (!nodeAsync) {
//                     nodeAsync = self.game.add.image();
//                     nodeAsync.name = 'asyncShow';
//                     nodeAsync.x = 160;
//                     nodeAsync.y = 120;
//                 }

//                 // 设置异步加载好的资源
//                 nodeAsync.texture = asset;
//                 // or
//                 // nodeAsync.texture = self.game.assets.find('loadAsync');
//             });
        });
    };
    self.game.timer.add(1, load);
 };
// Awake is called when the script instance is being loaded.
//startGameBtnClicked.prototype.awake = function() {
//
//};

// Update is called every frame, if the behaviour is enabled.
//startGameBtnClicked.prototype.update = function() {
//
//};

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
// define a user behaviour
var mathbord = qc.defineBehaviour('qc.engine.mathbord', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
}, {
});

// Awake is called when the script instance is being loaded.
mathbord.prototype.awake = function() {
};

// Update is called every frame, if the behaviour is enabled.
mathbord.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

mathbord.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

mathbord.prototype.onClick = function() {
};



// define a user behaviour
var keyLockJs = qc.defineBehaviour('qc.engine.keyLockJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
    self.keyL = null;
    self.keyR = null;
}, {
});

// Awake is called when the script instance is being loaded.
keyLockJs.prototype.awake = function() {
    var self = this;
    var locks = ['suo.png','suo1.png'];
    
    self.gameObject.frame = locks[G.game.math.random(0,1)];
};

// Update is called every frame, if the behaviour is enabled.
keyLockJs.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

keyLockJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

keyLockJs.prototype.onClick = function() {
//     this.gameObject.destroy();
//     G.bgRun = true;
};


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
    var id = G.game.math.random(0, 8);
//     id = 8;
    if(G.bgRun === true){
        if(id === 0){
            G.game.assets.load('fence', 'Assets/prefab/fence.bin', function(asset) {
                var fenceclone = G.game.assets.find('fence');
                var rigidbody = G.game.add.clone(fenceclone,self.gameObject);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }

        if(id === 1){
            G.game.assets.load('bird', 'Assets/prefab/bird.bin', function(asset) {
                var birdclone = G.game.assets.find('bird');
                var rigidbody = G.game.add.clone(birdclone,self.gameObject);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }
        
        if(id === 2){
            G.game.assets.load('arrowL', 'Assets/prefab/arrowL.bin', function(asset) {
                var arrowLclone = G.game.assets.find('arrowL');
                var rigidbody = G.game.add.clone(arrowLclone,self.gameObject);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        } 

        if(id === 3){
            G.game.assets.load('arrowR', 'Assets/prefab/arrowR.bin', function(asset) {
                var arrowRclone = G.game.assets.find('arrowR');
                var rigidbody = G.game.add.clone(arrowRclone,self.gameObject);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        } 
        
        if(id === 4){
            G.game.assets.load('keylock', 'Assets/prefab/keylock.bin', function(asset) {
                var keylockclone = G.game.assets.find('keylock');
                var rigidbody = G.game.add.clone(keylockclone,self.gameObject);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        } 

        if(id === 5){
            G.game.assets.load('cardbase', 'Assets/prefab/cardbase.bin', function(asset) {
                var cardbaseclone = G.game.assets.find('cardbase');
                var rigidbody = G.game.add.clone(cardbaseclone,self.gameObject);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }   
        
        if(id === 6){
            G.game.assets.load('mathbord', 'Assets/prefab/mathbord.bin', function(asset) {
                var mathbordclone = G.game.assets.find('mathbord');
                var rigidbody = G.game.add.clone(mathbordclone,self.gameObject);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }     
        
        if(id === 7){
            G.game.assets.load('finddif', 'Assets/prefab/finddif.bin', function(asset) {
                var finddifclone = G.game.assets.find('finddif');
                var rigidbody = G.game.add.clone(finddifclone,self.gameObject);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }   
        
        if(id === 8){
            G.game.assets.load('dbarrow', 'Assets/prefab/dbarrow.bin', function(asset) {
                var dbarrowclone = G.game.assets.find('dbarrow');
                var rigidbody = G.game.add.clone(dbarrowclone,self.gameObject);
                var prefabRigidBody = rigidbody.getScript('qc.arcade.RigidBody');
                prefabRigidBody.addCollide(self.player);
            });    
        }         
    }
};

// define a user behaviour
var flyBirdJs = qc.defineBehaviour('qc.engine.flyBirdJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
}, {
});

// Awake is called when the script instance is being loaded.
flyBirdJs.prototype.awake = function() {
};

// Update is called every frame, if the behaviour is enabled.
flyBirdJs.prototype.update = function() {
	var self = this;
    if(self.gameObject.y < 0){
        self.gameObject.destroy();
    }
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }    
};

flyBirdJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
    G.playerDead = true;
};

flyBirdJs.prototype.onClick = function() {
    var self = this;
    self.gameObject.destroy();
    G.bgRun = true;
};


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




// define a user behaviour
var fenceJs = qc.defineBehaviour('qc.engine.fenceJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    this.fence = null;
    this.player = null;
}, {
    fence: qc.Serializer.NODE,
    player: qc.Serializer.NODE
});

// Awake is called when the script instance is being loaded.
fenceJs.prototype.awake = function() {
};

// Update is called every frame, if the behaviour is enabled.
fenceJs.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

fenceJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

fenceJs.prototype.onClick = function() {
    this.gameObject.destroy();
    G.bgRun = true;
};

// define a user behaviour
var dbarrowJs = qc.defineBehaviour('qc.engine.dbarrowJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
}, {
});

// Awake is called when the script instance is being loaded.
dbarrowJs.prototype.awake = function() {
    var self = this;
};

// Update is called every frame, if the behaviour is enabled.
dbarrowJs.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

dbarrowJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

dbarrowJs.prototype.onClick = function() {
};





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

// define a user behaviour
var cardJs = qc.defineBehaviour('qc.engine.cardJs', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
    self.idx = 1;
    self.parent = null;
}, {
    parent: qc.Serializer.NODE
});

// Awake is called when the script instance is being loaded.
cardJs.prototype.awake = function() {
    var self = this;
};

// Update is called every frame, if the behaviour is enabled.
cardJs.prototype.update = function() {

};

cardJs.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

cardJs.prototype.onClick = function() {
    var self = this;
    var frames = ['card_26.png','card_28.png','card_38.png'];
    if(self.parent.frame == this.gameObject.frame){
        self.parent.destroy();
        G.bgRun = true;
    }else{
        self.parent.frame = frames[G.game.math.random(0,2)];
    }
};
// define a user behaviour
var cardbase = qc.defineBehaviour('qc.engine.cardbase', qc.Behaviour, function() {
    // need this behaviour schedule in editor
    //this.runInEditor = true;
    var self = this;
    self.timerShow = null;
    self.idx = 1;
}, {
});

// Awake is called when the script instance is being loaded.
cardbase.prototype.awake = function() {
    var self = this;
};

// Update is called every frame, if the behaviour is enabled.
cardbase.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }

    var frames = ['card_26.png','card_28.png','card_38.png'];
    self.idx++;
    if(self.idx%100 === 0){
        self.gameObject.frame = frames[G.game.math.random(0,2)];
    }
};

cardbase.prototype.onCollide = function(o1,o2) {
    G.bgRun = false;
};

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
var arrowLJs = qc.defineBehaviour('qc.engine.arrowLJs', qc.Behaviour, function() {
    var self = this;
    self.touchdone = false;
}, {
});

// Awake is called when the script instance is being loaded.
arrowLJs.prototype.awake = function() {
};

// Update is called every frame, if the behaviour is enabled.
arrowLJs.prototype.update = function() {
	var self = this;
    var rigid = self.getScript('qc.arcade.RigidBody');
    if(self.gameObject.y < 0 || self.gameObject.x > G.game.width+self.gameObject.width/2){
        self.gameObject.destroy();
    }
    if(G.bgRun === false){
	    rigid.moves = false;
    }else{
        rigid.moves = true;
    }
};

arrowLJs.prototype.onCollide = function(o1,o2) {
    var self = this;
    G.bgRun = false;
};

arrowLJs.prototype.onClick = function() {
//     this.gameObject.destroy();
//     G.bgRun = true;
};

arrowLJs.prototype.onDragStart = function(e) {
    // 记录当前的坐标位置，并标记拖拽开始
    var self = this,
        o = self.gameObject;
    self.oldPos = new qc.Point(o.x, o.y);
};

// 节点拖拽中的处理
arrowLJs.prototype.onDrag = function(e) {
    var self = this,o = self.gameObject;
    // 改变节点的目标位置
    var p = o.getWorldPosition();
    p.x += e.source.deltaX;
    p.y += e.source.deltaY;
    p = o.parent.toLocal(p);
    if(p.x > o.x){
        o.x = p.x;
        if(p.x - self.oldPos.x > 100){
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
arrowLJs.prototype.onDragEnd = function(e) {
    // 拖拽结束了
    var self = this,o = self.gameObject;

    if (self.touchdone === false) {
        // 没有任何容器接受，反弹回去
        this.gameObject.x = this.oldPos.x;
//         this.gameObject.y = this.oldPos.y;
    }
};

}).call(this, this, Object);
