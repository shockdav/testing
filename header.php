<?php 

$defaults = new defaults(); 
	$include_in_header = 'dalskndlakn';
?>
<!DOCTYPE html>
<html lang="<?=$prod_lang?>" class="<?=$defaults->defaults["template"]?>">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="format-detection" content="telephone=no">

	<title><?=($page->title)?:$defaults->defaults["friendlyName"]?></title>

	<meta name='title' content='<?=($page->title)? htmlentities($page->title, ENT_QUOTES) : $defaults->defaults["friendlyName"] ?>'>
	<meta name='description' content='<?=htmlentities($page->desc, ENT_QUOTES)?>'>
	<meta name="robots" content="<?=( isset($robots) && $robots)? $robots :"index,follow"?>">
	<meta name="rating" content="General">
	<meta name="distribution" content="Global">
	<link rel="canonical" href="<?=($_SERVER['HTTP_X_FORWARDED_PROTO']=="https")?"https://":"https://"?><?=strtolower($_SERVER["HTTP_HOST"])?><?=strtolower($_SERVER["REDIRECT_URL"])?>">

	<? if( $_SERVER["HTTP_HOST"] == "www.sb.com"  || $_SERVER["HTTP_HOST"] == "localhost"  ): ?>
		<link href="/templates/prepend.css" rel="stylesheet"/>
		<link href="/templates/<?=$defaults->defaults["template"]?>/styles.css" rel="stylesheet"/>
		<link href="/templates/append.css" rel="stylesheet"/>
	<? else: ?>
		<link href="<?=$defaults->defaults["template_cdn"]?>/<?=$defaults->defaults["template"]?>/styles/<?=file_get_contents( dirname(__FILE__)."/style_source.php" )?>/styles-min.css" rel="stylesheet"/>
	<? endif; ?>

	<link href="https://fonts.googleapis.com/css?family=Yantramanav:300,400,500,700%7CChanga:300,400,500,700%7CMaterial+Icons&display=swap" rel="stylesheet">

	<link rel="shortcut icon" href="<?=$defaults->defaults["template_cdn"]?>/<?=$defaults->defaults["template"]?>/favicon.ico">

	<meta property='og:title' content='<?=($page->title)?htmlentities($page->title, ENT_QUOTES):$defaults->defaults["friendlyName"]?>'>
	<meta property='og:description' content="<?=htmlentities($page->desc, ENT_QUOTES)?>">
	<meta property='og:url' content='https://<?=$_SERVER['HTTP_HOST']?><?=$_SERVER["REQUEST_URI"]?>'>
	<meta property='og:type' content='website'>
	<meta property='og:site_name' content='<?=$defaults->defaults["friendlyName"]?>'>

	<?php if( strlen($include_in_header) >= 10 ):?>
		<!-- <?=$include_in_header?> -->
	<?php else: ?>
		<?php if( !preg_match("/og\:image/", $include_in_header) ): ?>
			<meta property="og:image" content="<?=$defaults->defaults["default_social"]?>" />
		<?php endif; ?>
	<?php endif; ?>

	<?php if( $defaults->defaults["gaq"] != "" ): ?>
	<script async src="https://www.googletagmanager.com/gtag/js?id=<?=$defaults->defaults["gaq"]?>"></script>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', '<?=$defaults->defaults["gaq"]?>', { 'optimize_id': '<?=$defaults->defaults["gaq_op"]?>'});
	</script>
	<?php endif; ?>

	<?=$defaults->defaults["header"]?>

</head>

<body class="<?=$page->name?>">

	<header>
		<div class="inner menu-flex">

			<a href="/" class="logo"><?=$defaults->defaults["friendlyName"]?></a>

			<a href="javascript:void(0)" class="mobile-menu mobile" onclick="toggleMenu()"><i class="material-icons">menu</i></a>
			<div id="navigationv3-controller" style="width: 100%; height: 100%">
				<?=$defaults->defaults["header_menu"]?>
			</div>

		</div>
	</header>


  <main>