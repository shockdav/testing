<?php

class frontendAPI extends brain{

	function __construct(){
		parent::__construct();

		parse_str($_SERVER['REQUEST_URI'], $parse_test );

		if( isset($parse_test["page"]) && $parse_test["page"] != "" ){
			$_SERVER['REQUEST_URI'] = $parse_test["page"];
		}

	}

	function fetchPage( $page ){
		return $this->db->pages->findOne(array(
			"NameURL"=>$page
		));
	}

}