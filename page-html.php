<?
	require_once("api/functions.php");

	$api = new frontendAPI();
	$the_page = $api->fetchHTMLPage( $_GET["url"] );

	if(!$the_page)
		header('HTTP/1.0 404 Not Found');

	if( $the_page["page-status"]=="hidden" ){
		header('HTTP/1.0 404 Not Found');
		$the_page = false;
	}

	$friendlyName = $api->returnFriendlyNames();

	$page->name = $the_page["class"]." innerpage page-html";
	$page->key = 1;

	$page->title = $the_page["page"]["MetaTitle"];
	$page->desc_buffer = $page->desc;
	$page->desc = htmlspecialchars($the_page["page"]["MetaDescription"], ENT_QUOTES);
	$page->social_text = $the_page["page"]["H1Tag"];

	$page->url = $the_page["NameURL"];

	if( $the_page["page-status"] == "private" )
		$robots = "noindex, nofollow";

	$defaults = new defaults();

	require_once("header.php");

	$badge_url = $defaults->defaults["default_badge"];

	$author = []; //for testing
	$authors = []; //for testing

	if( $the_page["template"] == "page-about-fx" ){
		require_once("template-about-fx.php");
		return;
	}

	if( $the_page["template"] == "page-media" ){
		require_once("template-media.php");
		return;
	}

	if( $the_page["template"] == "centered" ){
		require_once("template-center.php");
		return;
	}

	if( empty($the_page["_id"]) ){
		$the_page = false;
	}
?>

<div id="body">

	<div>
		<section class="h1heading">
			<div class="inner">
				<a name="head"></a>
				<h1>
					<? if( $the_page ): ?>
						<?=$the_page["page"]["H1Tag"]?>
					<? else: ?>
						404 Error, we're sorry!
					<? endif; ?>
				</h1>
			</div>
		</section>

		<section class="inner pad-50">
		<? if( $the_page ): ?>
			<?
				if( $the_page["eval"]=="code" ){
					print eval($the_page["Body"]);
				}else{
					print $the_page["Body"];
				}
			?>
		<? else: ?>
			<? require("404.php"); ?>
		<? endif; ?>
		</section>

	</div>

</div>

<style>
p{
	margin:10px 0;
}
</style>

<? require_once("footer.php") ?>