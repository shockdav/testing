<div id="body">

	<div class="flex flex-2" style="min-height: 600px">
		<div style="background: #224a56">
			<div style="padding:60px">
				<h1 itemprop="headline"><?=$the_page["page"]["H1Tag"]?></h1>
				<?=$the_page["Body"];?>
			</div>
		</div>
		<div id="aboutimage" style="background: url(https://cdn.stockbrokers.com/uploads/drrlr1s/about.jpg) no-repeat center center; background-size: cover">
		</div>
	</div>

	<section class="facts">
		<div>
			<b>50,000+</b>
			<span>Words of Research</span>
		</div>
		<div>
			<b>2,916</b>
			<span>Data Points Tracked</span>
		</div>
		<div>
			<b>2.8+ Million</b>
			<span>Visitors Since Inception</span>
		</div>
	</section>
	<div>
		<section class="inner pad-50 team" itemprop="articleBody">
			<?=$the_page["Body2"]?>
		</section>

	</div>
</div>



<style>
h2{
	font-size: 26px;
	color: #657073;
}
.facts{
	display: flex;
	justify-content: space-around;
	background: #fff;
	padding:40px;
	text-align: center
}
.facts > div{
	display: inline-block;
}
.flex-2 a{
	color: #fff
}
.facts b{
	color: #2f900e;
	font-size: 54px;
	display: block;
	font-weight: 200;
	-webkit-font-smoothing: antialiased
}
.facts span{
	font-size: 16px;
	font-weight: bold;
	color: #36383d;
}
#body .flex-2 p{
	color: #fff
}
#body .flex-2 h1{
	color: #44c716;
	font-size: 40px;
	font-weight: 200;
	-webkit-font-smoothing: antialiased
}
#body{
	background: #f4f4f4
}

.team > div{
	display: flex;
	padding:40px 0;
	flex-direction: row;
	justify-content: space-between;
	border-bottom: 1px #ddd solid;
}

.team > div:last-child{
	border: none
}

.team b{
	color: #36383d
}

.team img{
	margin-right:50px;
	align-self: baseline;
}
.social{
	justify-content:flex-start !important;
	max-width: none;
	margin:20px 0;
}
.social a{
	color: #36383d;
	border: 1px #36383d solid;
	border-radius: 100%;
	width: 2em;
	height: 2em;
	display: inline-flex;
	margin: 10px;
	align-items: center;
	justify-content: center;
	margin:0;
	margin-right:10px;
}

@media only screen and (max-width:768px){
	.facts > div{
		display: block;
		margin:20px;
	}
	.team img{
		margin:0;
		display: block;
		width: auto;
		max-width: 100%;
		margin-bottom: 20px;
	}
	.facts{
		display: block
	}
	.team > div{
		display: block
	}
}
</style>

<? require_once("footer.php") ?>
