~(function() {
	if (!isWXBrowser()) {
		//  alert("请在微信浏览器打开")
	}
	var basePath = window.baseImgPath;
	//是否是微信浏览器
	function isWXBrowser() {
		return navigator.userAgent.toLowerCase().match(/MicroMessenger/i);
	}

	function isIOS() {
		return navigator.userAgent.toLowerCase().match(/iphone|ipad/i)
	}

	// alert(screen.height+"_"+document.documentElement.clientHeight)
	//获取href中的search
	function getParam(key) {
		var search = location.search,
			result = {};
		if (search) {
			var paramArr = location.search.slice(1).split("&");
			$.each(paramArr, function(i) {
				result[paramArr[i].slice(0, paramArr[i].indexOf("="))] = paramArr[i].slice(paramArr[i].indexOf("=") + 1);
			})
		}
		return result[key] || "";
	}
	new Vue({
		el: '#app',
		data: {
			step: 0, // 页面索引
			qIndex:1, // 题目索引
			iProvince:0, //'省会索引'
			icity:0, //'城市索引'
			videoEnd: false,
			afterPressShare: false,
			tform:{
				name:'',
				tel:'',
				province:'',
				city:'',
				order:''
			},
			fData: window.tFormData,
			AIndex: (function(){ return parseInt(Math.random()*5,10)+1; })(),
			qArr: [
				{a:'X学院最强学员',b:'东风标致新一代508L'},
				{a:'靠直觉力就可以掌控一切',b:'风驰电掣的驾驶快感'},
				{a:'夜视功能',b:'獠牙行车灯'},
				{a:'搭载双色轮毂的新一代508L',b:'凤凰女的童年回忆'},
				{a:'1.8T发动机+8AT变速箱',b:'猛踩油门，时刻不停'},
			],
			msg:'',
			hasload:false,
			finishDialog: false,
			shareDialog: false,
			hideIWinStatus: false,
			loadNum: 0, //预加载图片数量
			wxUserInfo: {}
		},
		mounted: function() {
			// if( !isWXBrowser()){ alert("请在微信浏览器中打开");return false; }
			this.toInitWX();
			this.loadImg();
		},
		computed: {

		},
		watch:{
			step:function(a,b){
				console.log(a,b,"step")
				var _this = this;
				_this.hasload = false;
				setTimeout(() => {
					_this.hasload = true;
				}, 500);
			}
		},
		methods: {
			// load 完图片后初始化页面
			initPage: function(){
				this.step = 2;
				this.loadNum = 100;
			},
			videoPlayEnd: function(){
				var _this = this;
				setTimeout(() => {
					var v = $("#videoRef").get(0);
					v.play();
					v.addEventListener("ended",function(){
						console.log("结束");
						_this.videoEnd = true
					})
				}, 300);
			},
			step2BtnEvent(){
				this.step = 3 
				this.videoPlayEnd()
			},
			step3BtnEvent(){
				if( this.videoEnd ){
					this.step = 4;
				} 
			},
			nextQuestion: function(){
				this.qIndex++
				if(this.qIndex >= 5){
					this.step = 5
					return
				}
				var _this = this;
				_this.hasload = false;
				setTimeout(() => {
					_this.hasload = true;
				}, 500);
			},
			getWxInfo: function() {
				this.wxUserInfo = {
					nickname: nickname,
					city: "",
					headimgurl: headimgurl
				}
			},
			toShare: function(){
				this.afterPressShare = true
				// to 生成图片
				this.createPoster()
			},
			//init微信 
			toInitWX: function() {
				var _c = $.extend({
					debug: false,
					appId: "",
					timestamp: "",
					nonceStr: "",
					signature: "",
					jsApiList: []
				}, window.wxConfig, true);

				wx.config(_c);
				// this.getWxInfo();
				wx.ready(function() {
					//朋友圈
					wx.onMenuShareTimeline({
						title: shareConfig.title, // 分享标题
						link: shareConfig.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: shareConfig.img, // 分享图标
						success: function() {
							// 用户点击了分享后执行的回调函数
						},
					});
					//朋友
					wx.onMenuShareAppMessage({
						title: shareConfig.title, // 分享标题
						desc: shareConfig.desc, // 分享描述
						link: shareConfig.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: shareConfig.img, // 分享图标
						success: function() {
							// 用户点击了分享后执行的回调函数
						}
					});

				})
				wx.error(function(res) {
					wx.config(_c);
				});

			},
			loadImg: function() {
				this.step = 1;
				var that = this,
					arr = [
						'1.bg.jpg','2-bg.jpg','2-btn.png','3-bg.jpg','3-car.png','long-btn.png',
						'1-car.png','7-btn.png','2-bg-2.jpg','2-text.png','3-btn.png','7-bg.jpg','code.png',
						'question/option-a.png','question/option-b.png','question/q-bg-2.jpg','question/q-bg-4.jpg','question/q-txt-1.png','question/q-txt-3.png','question/q-txt-5.png','question/q-bg-3.jpg','question/q-bg-5.jpg','question/q-txt-2.png','question/q-txt-4.png',
						'answer/1.jpg','answer/2.jpg','answer/3.jpg','answer/4.jpg','answer/5.jpg','answer/btn.png'
					],
					oimg, _acount = 0,
					timer = null;
				arr.forEach(function(item) {
					oimg = new Image();
					oimg.onload = function() {
						_acount++;
						that.loadNum = Math.max(0, parseInt(_acount / arr.length * 100) - 80);
						if (_acount == arr.length) {
							timer = setInterval(function() {
								if (timer && that.loadNum >= 100) {
									setTimeout( function(){
										that.initPage()
									}, 1000);
									timer && clearInterval(timer);
									timer = null;
								} else {
									that.loadNum++;
		 						}
							}, 1000 / 30)
						}
					}
					oimg.src = basePath + item;
				})
			},
			//生成分享海报
			createPoster: function() {
				var that = this;
				var cv = document.getElementById("tCanvas");
				var ctx = cv.getContext('2d');
				var ratio = getPixelRatio(ctx);
				console.log(ratio)
				//var ratio = 1;
				var W = document.documentElement.clientWidth,
					H = document.documentElement.clientHeight;

				cv.height =  H*ratio;
				cv.width = W*ratio;

				cv.style.width = W +'px';
				cv.style.height = H +'px';
				cv.style.display = "none";
				//大背景
				try {
					drawImg(baseImgPath + "answer/"+ this.AIndex +".jpg", 0, 0, 0, 0, 0, 0, cv.width, cv.height, function() {
						console.log(12222)
						drawImg( baseImgPath + "code.png" , 0, 0, 0, 0, 130,1050, 352, 249, function() {
							console.log(33333)
							drawImg( baseImgPath + "2code.jpg" , 0, 0, 0, 0, 285, 1100, 164, 164, function() {
								console.log(4444)
								var _imgSrc = cv.toDataURL("image/png", 1),
									 saveImg = document.getElementById("save-img");
								saveImg.setAttribute("src", _imgSrc);
							},true)
						}, true);
					});
				} catch (e) {
					alert(e.name + ": " + e.message);
				}

				function drawImg(img, x1, y1, w1, h1, x2, y2, w2, h2, fn, bool) {
					var oimg = new Image();
					var sacleX = screen.width / 750;
					var sacleY = document.documentElement.clientHeight / 1333;
					//oimg.setAttribute("crossOrigin",'*');
					oimg.setAttribute("crossOrigin", 'Anonymous');
					oimg.onload = function() {
						console.log(img, "img onload ")
						if (bool) {
							var oldW = oimg.width,
								oldH = oimg.height;

							//竖图  30 -> 23 : 80 = 80*w2/w1?                   23:40
							if ( oldW <= oldH &&  oldW / oldH <=  w2 / h2) {
								w1 = oldW;
								h1 = w1/w2  * h2;

								x1 = 0;
								y1 = oldH / 2 - h1 / 2;
							} else {
								//横图
								h1 = oldH;
								w1 =  h1/h2 * w2;

								x1 = oldW / 2 - w1 / 2;
								y1 = 0;
							}

							x2 *= sacleX;
							y2 *= sacleY;

							w2 *= sacleX;
							h2 *= sacleY;

							x2 *= ratio ;
							y2 *= ratio ;
							w2 *= ratio ;
							h2 *= ratio ;
							 
						}
 						ctx.drawImage(oimg, x1 , y1 , (w1 || oimg.width) , (h1 || oimg.height)  , x2 , y2 , w2 , h2 );
						fn && fn();
					}
					oimg.onerror = function() {
						alert("加载图片错误了:" + img)
					}
					oimg.src = img;
				}
				 function  getPixelRatio(context) {
			        var backingStore = context.backingStorePixelRatio ||
			            context.webkitBackingStorePixelRatio ||
			            context.mozBackingStorePixelRatio ||
			            context.msBackingStorePixelRatio ||
			            context.oBackingStorePixelRatio ||
			            context.backingStorePixelRatio || 1;
			        return (window.devicePixelRatio || 1) / backingStore;
			    };


			},
			showPosterPop: function(bool) {
				this.isShowPoster = bool;
			},
			//上传数据
			subDueInfo() {
				if(this.subing)return;
				var data = {
					name: this.tform.name,
					tel:this.tform.tel,
					province: this.fData[this.iProvince].province,
					city:this.fData[this.iProvince].city[this.icity].name,
					order:this.tform.order
				}
				if(!data.name){
					this.alert('请输入姓名');
					return;
				}
				if(!data.tel || !/^[\d|\+|-|\s]+$/.test(data.tel)){
					this.alert('请输入正确的电话');
					return;
				}
				if(!data.order){
					this.alert('请选择经销商');
					return;
				}
				console.log(data)
				var _this = this;
				_this.subing = true;
				$.ajax({
					url: saveUrl,
					data: data,
					dataType: "json",
					type: "post",
					async: false,
					success: function(res) {
						if(res.status === '0'){
							_this.alert('您的信息已提交，感谢您的参与')
							setTimeout(() => {
								_this.step = 5
								_this.afterPressShare = false;
								_this.subing = false
							}, 3000);
						}
					},
					error: function() {
						_this.alert("网络开小差了，请重新试")
						_this.subing = false
					}
				})
			},
			toshare: function() {
				toShare({
					title: "为世界杯一起打啵",
					shareTimelineTitle: "一起打啵吧",
					imgUrl: (location.protocol) + "//images.koolearn.com/fe_upload/2018/4/2018-4-2-1522665570961.jpg",
					debug: false,
					desc: "一起打啵吧，come on~",
					shareURL: "//h5.zixisi.cn",
					fnSuccess: null
				})

			},
			alert(msg){
				this.msg = msg;
				var _this = this;
				var timer = null;
				setTimeout( function(){
					_this.msg = ''
					clearTimeout(timer)
				}, 2000);
			}

		}

	})
})();