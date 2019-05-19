/**
 * Created by jianghonglin on 2017/3/7.
 */
(function (global, factory) {
    if (typeof define === 'function' && define.amd)
        define(function () {
            return factory(global)
        })
    else
        factory(global)
})(window,function(){

    var KOOKEY = {},
        Weixin = window.Weixin;

    function _getShareKey(opt){
        var opts = $.extend({
            title:"",
            desc:"",
            debug:false,
            shareURL:location.href,
            imgUrl:"",
            fnSuccess:null
        },opt);

        $.ajax({
            type: 'post',
            url:"//www.koo.cn/activity/getValue?koourl="+encodeURIComponent( location.href.split('#')[0]  ),
            dataType:"jsonp",
            jsonpCallback:"callback",
            success: function (data) {
                var datas = typeof data == "string"?$.parseJSON(data):data;
                if( datas && typeof datas=="object"){
                    KOOKEY =  {
                        appId    : datas.data.appId,
                        nonceStr : datas.data.nonceStr,
                        timestamp: datas.data.timestamp,
                        signature: datas.data.signature
                    };
                    toShareWX(opts);
                }else{
                    console.warn("ajax data is not object:" + datas);
                }
            },
            error:function(e){
                console.log(e.message);
            }
        });
    }
    function toShareWX (opts){
        WXAPI({
            debug: opts.debug,
            appId    : KOOKEY.appId,
            nonceStr : KOOKEY.nonceStr,
            timestamp: KOOKEY.timestamp,
            signature: KOOKEY.signature,
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'],
            title: opts.title,
            shareTimelineTitle:opts.shareTimelineTitle,
            pyqTitle:"",
            desc: opts.desc,
            link: opts.shareURL,
            imgUrl:opts.imgUrl,
            fnSuccess:opts.fnSuccess
        });
    }
    function WXAPI(opt){
        var opts = $.extend({
            debug: true,
            appId: '',
            timestamp:new Date(),
            nonceStr: '',
            signature: '',
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'],
            title:'',
            shareTimelineTitle:"",
            desc: '',
            pyqTitle:"",
            link: "",
            imgUrl: '',
            type:"link",
            hideOptionMenu: false,
            fnSuccess: null,
            dataUrl:""
        },opt);

        Weixin && Weixin.config({
            debug: opts.debug,
            appId: opts.appId,
            timestamp:opts.timestamp , // 必填，生成签名的时间戳
            nonceStr: opts.nonceStr, // 必填，生成签名的随机串
            signature: opts.signature,// 必填，签名，见附录1
            jsApiList: opts.jsApiList // 必填，
        });
        Weixin && Weixin.ready(function(){
            Weixin.onMenuShareTimeline({
                title: opts.shareTimelineTitle||opts.title,
                link: opts.link,
                imgUrl: opts.imgUrl,
                success: function () {
                    // 用户确认分享后执行的回调函数
                    typeof opts.fnSuccess == "function" && opts.fnSuccess();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    console.log("cancel");
                }
            });

            Weixin.onMenuShareAppMessage({
                title: opts.title,
                desc:opts.desc,
                link: opts.link,
                imgUrl: opts.imgUrl,
                success: function () {
                    // 用户确认分享后执行的回调函数
                    typeof opts.fnSuccess == "function" && opts.fnSuccess();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    console.log("cancel");
                }
            });

        });
    }
    window.toShare =  _getShareKey;
    return  _getShareKey;
});
