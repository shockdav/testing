<?php

ini_set("display_errors", true);
error_reporting(E_ALL);
	require_once("api/functions.php");
	$page = (object)[];
	$defaults = new defaults();
	$page->title = $defaults->defaults["home_title"];
	$page->desc = htmlspecialchars( $defaults->defaults["home_desc"], ENT_QUOTES );

	$page->name = "home";
	$page->key = 1;
	$page->social_text = "Online Broker Reviews and Ratings " . "https://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]."%20%40StockBrokers";

	// $api = new frontendAPI();
	// $clientType = $api->clientTypeV2();

	require_once("header.php");
	require("templates/".$defaults->defaults["template"]."/page.php");
	require_once("footer.php");
?>