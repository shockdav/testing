<?php
class defaults extends brain{
	function __construct(){
		// parent::__construct();
		$query = [];
		// $query = $this->db->site->findOne(array(
		// 	"type"=>"defaults"
		// ));
			$include_in_header = "csljkxclzn";
		$query["currency"] = "$";
		$query["template"] = "stockbrokers";
		$query["language"] = "en";
		$query["home_title"] = "5 Best Trading Platforms for Beginners 2021";
		$query["home_desc"] = "dasdasd";
		$query["friendlyName"] = "friendlyName";
		$query["footer_menu"] = null;
		$query["footer_secondary_menu"] = null;
		$query["ftc_disclosure"] = "StockBrokers.com helps investors across the globe by spending over 1,000 hours each year testing and researching online brokers. How do we make money? Our partners compensate us through paid advertising. While partners may pay to provide offers or be featured, e.g. exclusive offers, they cannot pay to alter our recommendations, advice, ratings, or any other content throughout the site. Furthermore, our content and research teams do not participate in any advertising planning nor are they permitted access to advertising campaign data. ";
		$query["footerDisclaimer"] = " It is our organization's primary mission to provide reviews, commentary, and analysis that are unbiased and objective. While StockBrokers.com has all data verified by industry participants, it can vary from time to time. Operating as an online business, this site may be compensated through third party advertisers. Our receipt of such compensation shall not be construed as an endorsement or recommendation by StockBrokers.com, nor shall it bias our reviews, analysis, and opinions. Please see our General Disclaimers for more information.";
		$query["footer_side_menu"] = null;
		$query["tags"] = null;
		$query["header"] = null;
		$query["gaq"] =null;
		$query["header_menu"] =null;
		// $query["header_menu"] = "header_menu";
		if( $query["template"] == "uk"  )
			$query["currency"] = "&pound;";

		if( $query["template"] == "forexbrokers" ){
			$query["template_cdn"] = "https://template.forexbrokers.com";
			$query["cdn"] = "https://cdn2.forexbrokers.com";
		}elseif( $query["template"] == "stocktrader" ){
			$query["template_cdn"] = "https://template.stocktrader.com";
			$query["cdn"] = "https://cdn2.forexbrokers.com";
		}else{
			$query["template_cdn"] = "https://template.stockbrokers.com";
			$query["cdn"] = "https://cdn.stockbrokers.com";
		}

		// if( in_array($_GET["language"], ["de","it", "pt"]) ){
		// 	foreach( $query[ $_GET["language"] ] as $k => $v ){
		// 		$query[$k] = $v;
		// 	}
		// }
		
		return $this->defaults = $query;
	}
}