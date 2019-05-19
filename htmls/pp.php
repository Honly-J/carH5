<?php
require_once "./php/jssdk.php";
$code = $_GET["code"];
$appid = $appId = 'wx16a48a4614656e0c';
$secret = $appsecret='7809a98746030da7fc1e9e3860738725';

$jssdk = new jssdk($appId, $appsecret);
$signPackage = $jssdk->GetSignPackage();
$access_token = $jssdk->getAccessToken();


//第二步:取得openid
$oauth2Url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$secret&code=$code&grant_type=authorization_code";
$oauth2 = getJson($oauth2Url);
$token= $oauth2['access_token'];


//第三步:根据全局access_token和openid查询用户信息
$openid = $oauth2['openid'];
$get_user_info_url = "https://api.weixin.qq.com/sns/userinfo?access_token=$token&openid=$openid&lang=zh_CN";
$userinfo = getJson($get_user_info_url);

//打印用户信息
// print_r($userinfo);die;

$nickname = isset($userinfo['nickname']) ? $userinfo['nickname'] : '';
$headimgurl = isset($userinfo['headimgurl']) ? $userinfo['headimgurl'] : '';

function getJson($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($ch);
    curl_close($ch);
    return json_decode($output, true);
}

$area_id = $_GET['area_id'] ? intval($_GET['area_id']) : 0;

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>臻享梅西，砥砺前行</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,viewport-fit=cover"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta content="telephone=no" name="format-detection" />
    <meta name="full-screen" content="yes"/>
    <meta name="browsermode" content="application"/>
    <meta name="x5-orientation" content="portrait"/>
    <meta name="x5-fullscreen" content="true"/>
    <meta name="x5-page-mode" content="app"/>
	<link rel="stylesheet" type="text/css" href="./statics/css/reset.css">
	<link rel="stylesheet" type="text/css" href="./statics/css/style.css">
</head>
<body>
 	<div class="container"  id="app">
		<template v-if="step==1">
			<div class="step1  active" >
	 			<em class="i-ball"></em>
	 			<em class="i-book"></em>
	 			<em class="i-man"></em>
	 			<em class="i-loading">
	 				<var class="loading"></var>
	 				<span :style="'width:'+loadNum+'%'"></span>
	 			</em>
	 			<em class="i-logo"></em>

	 			<em class="flower"></em>

				<em class="i-mouse v1"></em>
	 			<em class="i-mouse v2"></em>
	 			<em class="i-mouse v3"></em>

	 		</div>
		</template>
 		
		<template v-if="step==2">
			<div class="step2 "   >
	 		 <em class="i-beauty"></em>
	 		 <em class="rule-txt"></em>
			 <em class="btn" @click="toCall">我也要打啵</em>	

	 		</div>
		</template>
 		
		<template v-if="step==3" >
			<div class="step3  "   >
	 		 <div class="window"     ></div>
	 		 <canvas id="tCanvas"></canvas> 
	 		 <img src="" id="save-img">
			 <em class="btn-v1" @click="finishCall">打啵完成</em>	
			 <em class="btn-v2" @click="shareCall">一起打啵</em>
		
			 <div class="dialog-finish  "  v-if="finishDialog">
			 	<em @click="finishCall">x</em>
			 	<img src="./statics/imgs/bg-finish.png">
			 </div>
			 <div class="dialog-toshare  " v-if="shareDialog"  @click="shareCall"></div>

	 		</div>
		</template>
 	

 	</div>
<script type="text/javascript">
	window.isdebug = false;
	window._domain = "http://h5.zixisi.cn/";
	window.baseImgPath = _domain + "/statics/imgs/";
	var shareConfig = { 
		title:"臻享梅西，砥砺前行",
		img:baseImgPath + "200x200.jpg",
		link:"http://h5.zixisi.cn/pp.php?area_id="+'<?php echo $area_id?>',
		desc:"带梅西回家，赢奶酪好礼", 
		uploadUrl:"//h5.zixisi.cn/upload.php"
	}
</script>
<script src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script type="text/javascript">
	var nickname    = "<?= isset($userinfo['nickname']) ? $userinfo['nickname'] : '';?>"
	var headimgurl = "<?= isset($userinfo['headimgurl']) ? $userinfo['headimgurl'] : ''; ?>"
	var wxConfig = {
 		debug: false,
 		area_id:'<?php echo $area_id?>',
 		token:'<?php echo $access_token; ?>',
 		appId: '<?php echo $signPackage["appId"];?>',
 		timestamp: <?php echo $signPackage["timestamp"];?>,
 		nonceStr: '<?php echo $signPackage["nonceStr"];?>',
 		signature: '<?php echo $signPackage["signature"];?>',
 		jsApiList: [ 'onMenuShareTimeline',
		        'onMenuShareAppMessage',
		        'chooseImage',
		        'uploadImage',
		        'getLocalImgData'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
 	}
</script>
<script src="./statics/js/zepto.v1.2.0.js"></script>
<script src="./statics/js/vue.2.0.js"></script>
<script src="./statics/js/polyfill.js"></script>
<script src="./statics/js/page.js"></script>
</body>
</html>