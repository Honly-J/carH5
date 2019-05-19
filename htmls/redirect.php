<?php
require_once "./php/jssdk.php";

$appId='wx16a48a4614656e0c';
$appsecret='7809a98746030da7fc1e9e3860738725';
$area_id = $_GET['area_id'] ? intval($_GET['area_id']) : 0;


$redirect_uri = urlencode ( 'http://h5.zixisi.cn/pp.php?area_id='. $area_id);

$url ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=$appId&redirect_uri=$redirect_uri&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
header("Location:".$url);

?>
