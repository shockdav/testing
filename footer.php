	</main>

	<footer>
		<div class="inner">
			<div class="grid">
				<div class="grid-10 border-right">
					<a href="/" class="logo"><?=$defaults->defaults["friendlyName"]?></a>

					<?=$defaults->defaults["footer_menu"]?>
					<?=$defaults->defaults["footer_secondary_menu"]?>

					<hr>

					<!-- <div class="tiny disclaimer major-disclaimer">
						<p>
							<a id="advertiserdisclosure"></a>
							<b>Advertiser Disclosure</b>: <?=$defaults->defaults["ftc_disclosure"]?>
						</p>
						<br>
						<p>
							<b>Disclaimer</b>: <?=$defaults->defaults["footerDisclaimer"]?>
						</p>
						<? if( isset($footer_disclaimers) ): foreach( $footer_disclaimers as $fd ): ?>
						<br>
						<p>
							<?=$fd?>
						</p>
						<? endforeach; endif; ?>
						<br>
					</div>
				</div> -->
				<div class="grid-2">
					<?=$defaults->defaults["footer_side_menu"]?>
				</div>
			</div>
		</div>
	</footer>

	<div class="subfooter default-lang-<?=$_SERVER["HTTP_X_COUNTRY_CODE"]?> default-lang-state-<?=$_SERVER["HTTP_X_STATE_CODE"]?>">
	</div>

	<div class="mobile-footer fetchRotatedAd" data-type="mobile-wide">
		<a href="javascript:void(0)" onclick="$('body').addClass('noadty')" class="mobile-only exit-ad">&times;</a>
	</div>

	<?=$defaults->defaults["tags"]?>


	<script src="https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver"></script>


	<script data-ird="<?=$_SERVER["HTTP_X_COUNTRY_CODE"]?>">
		(function(s,t,o,c,k){
			var a=t.createElement(o),m=t.getElementsByTagName(o)[0];a.async=1;a.src=c;m.parentNode.insertBefore(a,m)
		})(window, document, "script", "https://www.stockbrokers.com/eu-cookie.php");
	</script>

	<? if( $_SERVER["HTTP_HOST"] == "www.sb.com" ): ?>
		<script>
			(function(s,t,o,c,k){
				var a=t.createElement(o),m=t.getElementsByTagName(o)[0];a.async=1;a.src=c;m.parentNode.insertBefore(a,m)
			})(window, document, "script", "/functions.js");
		</script>
	<? else: ?>
		<script>
			(function(s,t,o,c,k){
				var a=t.createElement(o),m=t.getElementsByTagName(o)[0];a.async=1;a.src=c;m.parentNode.insertBefore(a,m)
			})(window, document, "script", "<?=$defaults->defaults["template_cdn"]?>/js/<?=file_get_contents( dirname(__FILE__)."/js_source.php" )?>/functions-min.js");
		</script>
	<? endif; ?>

<script>
if( typeof gtag === "undefined" ){
	this.gtag = function(empty){
		console.log(empty)
	}
}
</script>

</body>
</html>