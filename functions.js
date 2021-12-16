/*
	Raw copy of SB JS, requires jQuery for legacy support via SB 2.0 2012
*/

var ipad = false;
var ua = navigator.userAgent;
var bind = false;
var active_menu = false;

if( (ua.match(/(iPad|iPhone|Android)/i)) )
	ipad = true;

window.addEventListener("scroll", function(e){
	var position = window.scrollY || window.pageYOffset;
	stickyMenu(position);

	if( position > 200 && !$("body").hasClass("beyond-200") ){
		$("body").addClass("beyond-200");
	}

	if( position <= 200 && $("body").hasClass("beyond-200") ){
		$("body").removeClass("beyond-200");
	}

}, true);

var touch_y;

window.addEventListener("touchstart", function(e){
	var position = window.scrollY || window.pageYOffset;
	touch_y = position;

	if( e.target.closest(".screenshots") != null ){
		e.target.closest(".screenshots").classList.add("activated")
	}

	if( e.target.closest(".compare-table") != null ){
		e.target.closest(".compare-table").parentNode.classList.add("activated")
	}
}, true);

function disableCTA(){
	document.body.innerHTML += '<style>.sticky-cta{display:none !important}</style>'
}

window.addEventListener("touchmove", function(e){
	var position = window.scrollY || window.pageYOffset;
	var diff = position-touch_y;

	if(diff >= 5 && !$("body").hasClass("slide-down")){
		$("body").removeClass("slide-up");
		$("body").addClass("slide-down");
		return;
	}

	if(diff < -5 && !$("body").hasClass("slide-up")){
		$("body").removeClass("slide-down");
		$("body").addClass("slide-up");
		return;
	}

}, true);

window.onkeyup = function(e){
	if(e.keyCode == 27){
		$(".floater").remove();
		$("html, body").removeClass("locked");
	}
}

this.qs = function(i){
	return document.querySelectorAll(i);
}

var lock;
this.submitPopupV2 = function( form ){
	var $form  = qs(form)[0];

	if(qs(form + " " + "input[type='submit']")[0])
		qs(form + " " + "input[type='submit']")[0].setAttribute('disabled', 'disabled');

	if( lock ) return;
	lock=1;

	if( qs(form + " .error-message")[0] )
		qs(form + " .error-message")[0].innerHTML = "";

	var request = new XMLHttpRequest();
	request.open("POST", $form.getAttribute("data-id")  );
	request.send( new FormData( document.querySelector(form) ) );

	if($form.querySelector("input[type=submit]"))
		var form_submit_value = $form.querySelector("input[type=submit]").value;

	if($form.getAttribute("data-save-start") != undefined){
		$form.querySelector(".submit input[type=submit]").value = $form.getAttribute("data-save-start");
	}

	request.onload = function(e){
		lock=false;

		d = JSON.parse( request.response );

		if( d.status==404 ){
			if( qs(form + " .error-message")[0] )
				qs(form + " " + ".error-message")[0].innerHTML = d.message;
		}

		if( qs(form + " " + "input[type='submit']")[0] )
			qs(form + " " + "input[type='submit']")[0].removeAttribute('disabled');

		if($form.getAttribute("data-save-end") != undefined){
			$form.querySelector(".submit input[type=submit]").value = $form.getAttribute("data-save-end");
		}

		setTimeout(function(){
			if( $form.querySelector("input[type=submit]") )
				$form.querySelector("input[type=submit]").value = form_submit_value;
		},1000);

		if( d.alert != undefined ){
			alert(d.alert)
		}

		if( d.disable != undefined ){
			if(qs(form + " " + "input[type='submit']")[0])
				qs(form + " " + "input[type='submit']")[0].setAttribute('disabled', 'disabled');
		}

		if( d.status==200 && d.redirect != undefined && d.redirect != "" ){
			location.href=d.redirect;
			return;
		}

		if( d.status==200 && d.message != undefined && d.message != "" ){
			qs(form + " " + ".error-message")[0].innerHTML = d.message;
			return;
		}

		if( d.status==200 && d.replace != undefined && d.replace != "" ){
			document.querySelector(d.replaceElement).innerHTML = d.replace;
			return;
		}

		if( d.status==200 && d.replaceWith != undefined && d.replaceWith != "" ){
			$form.innerHTML = d.replaceWith;
			return;
		}


	}
}

this.closeDebugger = function(){
	document.cookie="admin_active_debug=0; expires=-1; path=/";
	location.search = "";

}

if( window.location.search.match("admin_active_debug=1") ){
	console.log("debugger enabled")

	var d= new Date();
	d.setTime( d.getTime() + (30*24*60*60*1000) );
	var expires = "expires="+d.toUTCString();

	document.cookie="admin_active_debug=1; " + expires + "; path=/";
	location.search = "";
}

if( document.cookie.match("admin_active_debug=1")  ){
	var d= new Date();
	var request = new XMLHttpRequest();
	request.open("GET", "/apiv1/frontendAPI/validateuserdata?token=" + d.toUTCString() );
	request.send();

	request.onload = function(rr){
		var body = '<b>Debug Mode (JSON)</b> <a href="javascript:void(0)" onclick="closeDebugger()">Close debugger</a><br><pre style="white-space:pre-wrap">'+rr.target.response+'</pre>';
		document.body.insertAdjacentHTML("beforeend", "<div style='position: fixed; opacity:.7; left: 20px; top: 80px; background: #fff; border: 2px #000 solid; padding: 20px; z-index: 99999; border-radius: 20px; max-width: 320px'>"+body+"</div>")
	}

}

this.feedBackModule = function(i){
	i.closest(".feed-actions").querySelector(".feed-2").setAttribute("style", "");
	i.parentElement.setAttribute("style", "display:none");
	i.closest(".feed-actions").querySelector("input[name=rating]").value = i.innerHTML;

	var formData = new FormData();
	var request = new XMLHttpRequest();
	formData.append("url", location.pathname);
	formData.append("rating", i.innerHTML);
	request.open("POST", "/apiv1/frontendAPI/fbve" );
	request.send(formData);
}

this.stickyMenu = function(e){
	if(!window.jQuery)
		return;

	if( (location.pathname.indexOf("/review/") == 0 || location.pathname.indexOf("/reviews/") == 0) && ipad ){
		if( document.querySelector(".exclusive-offer") ){
			return;
		}
	}

	var validator = $(".stickymenu");

	if( validator.length == 0 ){
		stickyMenu = function(){}
		return;
	}

	if( this.stickyPosition == null )
		stickyPosition = validator.offset().top;

	if( e > stickyPosition && !$("body").hasClass("sticky") ){
		$("body").addClass("sticky");
		return;
	}

	if( e < stickyPosition && $("body").hasClass("sticky") ){
		$("body").removeClass("sticky");
		return;
	}

	if( e > 450 ){
		$("body").addClass("scroll-action");
	}else{
		$("body").removeClass("scroll-action");
	}

	/*
	if( !$(".left-menu").length )
		return;

	if( e > ( $(".flex-10").height() + $(".flex-10").offset().top - 500 ) && $("body").hasClass("sticky")  ){
		$(".left-menu").css({display:"none"})
		return;
	}else{
		$(".left-menu").css({display:"block"})
	}
	*/

}

this.documentReady = false;
this.onload = function(e){
	var rr = setInterval(function(){
		if( typeof window.jQuery == "function" ){
			clearInterval(rr);
			this.documentReady = true;
			loaded();
		}

	}, 20);
}

this.toggleParentActive = function( me ){
	$(me).parent().toggleClass("active")
}

this.loaded = function(){
	//hook ads
	var s = document.querySelectorAll("#fetchRotatedAd, .fetchRotatedAd");

	for( var i in s )
		fetchRotatedAd( s[i] )

	var s = document.querySelectorAll("#feedback");

	for( var i in s )
		fetchFeedback( s[i] )


	initExit();
	initScreenShots();
	initOverflows();
	//initFilterControllers();
	initJumpTo();
	initHasher();
	initStickyKiller();
	initSubHandler();
	initAdDc();
	initDisclosure();
	initTracker();

	initMenuV3();

	attachDragger('.master-table .scroller');
	toggleInner(".collapse");
}

this.initTracker = function(){
	document.querySelector("body").addEventListener("click", function(e){

		if( e.target.tagName == "IMG" && typeof gtag == "function" ){
			gtag('event', "click", {
			  'event_category': "Pictures",
			  'event_label': e.target.src,
			  //'value': ""
			});
		}
	}, true )
}

this.initMenuV3 = function(){

	document.querySelector(".navigationv3").addEventListener("click", function(e){
		if( e.target.tagName == "A" && typeof gtag == "function" && e.target.closest(".navigationv3-sub") ){
			gtag('event', "click", {
			  'event_category': "Header Menu V3",
			  'event_label': e.target.innerHTML.replace(/\<i.*?i\>/,""),
			  //'value': ""
			});
		}
	}, true )


	if(ipad){
		document.querySelector(".navigationv3").addEventListener("click", function(e){
			if( e.target.tagName == "A" && e.target.nextElementSibling.tagName == "UL" ){
				e.target.parentNode.classList.toggle("active");
				e.target.parentNode.parentNode.classList.toggle("active")
			}

		}, {passive: true})
	}
}

this.initDisclosure = function(){
	if( document.querySelector(".primary-disclosure") ){
		var location = document.querySelector(".primary-disclosure").getBoundingClientRect().right / window.innerWidth ;
		if( location > .5 ){
			document.querySelector(".primary-disclosure").classList.add("primary-disclosure-right");
		}
	}
}

this.initAdDc = function(){
	document.querySelector("body").onclick = function(e){
		if( e.target.closest(".primary-disclosure") ){
			e.target.closest(".primary-disclosure").classList.toggle("active")
		}else{
			if( document.querySelector(".primary-disclosure") )
				document.querySelector(".primary-disclosure").classList.remove("active")
		}
	}
}

this.initAdTracker = function(){
	window.addEventListener('blur', function(click){

	}, true);
}

this.initSubHandler = function(){
	document.querySelectorAll(".navigation li").forEach(function(e){
		if( e.getAttribute("data-target") == null )
			return;

		if(ipad || (!ipad && window.outerWidth <= 768) ){
			e.innerHTML += "<a href='javascript:void(0)' class='mobile-mover'>&rarr;</a>";

			e.querySelector(".mobile-mover").addEventListener("mouseover", function(a){
				document.querySelectorAll(".secondary-navigation .inner > div").forEach(function(ii){
					ii.style.display='none'
				});
				document.querySelector(".secondary-navigation ." + e.getAttribute("data-target") ).style.display='inline-block';
				document.querySelector(".secondary-navigation").classList.add("active");
			}, true);

			return;
		}

		e.addEventListener("mouseover", function(a){
			if( window.outerWidth <= 768 ){
				return;
			}

			document.querySelectorAll(".secondary-navigation .inner > div").forEach(function(ii){
				ii.style.display='none'
			});
			document.querySelector(".secondary-navigation ." + e.getAttribute("data-target") ).style.display='inline-block';
			document.querySelector(".secondary-navigation").classList.add("active");
		}, true);
	});

	document.querySelector("body").onmouseover = function(e){
		if(document.querySelector(".secondary-navigation") == null )
			return;

		if( e.target.closest(".navigation li[data-target]") == null && e.target.closest(".secondary-navigation") == null ){
			document.querySelector(".secondary-navigation").classList.remove("active");
			document.querySelectorAll(".secondary-navigation .inner > div").forEach(function(ii){
				ii.style.display='none'
			});
		}
	}

	if(ipad || (!ipad && window.outerWidth <= 768) ){
		document.querySelectorAll(".secondary-navigation .inner > div").forEach(function(e){
			e.innerHTML += "<a href='javascript:void(0)' onclick='quickRemoveSub()' class='subnav-mover'>&larr;</a>";
		});
	}
}

this.quickRemoveSub = function(){
	document.querySelector(".secondary-navigation").classList.remove("active");
	document.querySelectorAll(".secondary-navigation .inner > div").forEach(function(ii){
		ii.style.display='none'
	});
}

this.initStickyKiller = function(){
	if(ipad)
		return;

	document.querySelector("body").onclick = function(e){
		if( e.target.closest(".broker-menu-ul, .broker-menu h3, .h1heading h1") == null && $(".stickymenu").hasClass("activeBrokerMenu") ){
			brokerMenu();
		}
	}
}

this.initHasher = function(){
	if( location.hash != "" ){

		if( $("[data-name='"+ location.hash.substr(1) +"']").length == 0)
			return;

		window.scrollTo(0,
			$("[data-name='"+ location.hash.substr(1) +"']").offset().top
		)
	}
}

this.initJumpTo = function(){
	$(".jumpto a").on("click", function(e){
		e.preventDefault();
		var target_name = $(this).attr("href").substr(1);
		$(this).parent().parent().find("li").removeClass("active")
		$(this).parent().addClass("active");
		$(this).parent().parent().parent().parent().removeClass("selector");
		$('html,body').animate({ 'scrollTop': $("[data-name='"+target_name+"']").offset().top - 135 }, 300);
	});
}

this.jumpTo = function(i){
	var target_name = $(i).attr("href").substr(1);
	$('html,body').animate({ 'scrollTop': $("[data-name='"+target_name+"']").offset().top - 135 }, 300);
}

var touchTimer = null;
var logTimer = null;
this.initFilterControllers = function(){
	var click = false;

	$(".screener form input[type=checkbox]").click(triggerChange);

	$(".screener form input[type=range]").on("onchange mousemove", function(e){
		$(this).next().html("Less than: $" + $(this).val() );
	});

	$(".screener form .rating, .screener form .value").on("mousedown mousemove mouseup touchend touchmove touchstart",function(e){
		e.preventDefault();

		$(this).css({"cursor":"pointer"})

		if(e.type=="mousedown" || e.type=="touchstart") click = true;
		if(e.type=="mouseup" || e.type=="touchend") return click = false;

		if(click){
			var type = $(this).attr("class").split(" ")[0];

			if( e.type=="touchmove" || e.type == "touchstart" ){
				var pageX = e.originalEvent.touches[0].clientX;
			}else{
				var pageX = e.pageX;
			}

			var left = pageX - $(this).offset().left;
			var pos = left  / $(this).width();

			$(this).next().attr("data-touched", 1);

			pos = Math.round(pos*10) / 10;
			pos = pos * 100

			var valueout;

			if( typeof $(this).next().attr("data-max") != "undefined" ){
				var max = Number($(this).next().attr("data-max"));
				var min = Number($(this).next().attr("data-min"));

				valueout = max * (pos/100);

				if(valueout >=max) valueout = max;
				if(valueout <=min) valueout = min;
				if(valueout <= 0) valueout = 0;
			}else{
				valueout = pos / 20;
			}

			pos = pos / 20;

			$(this).next().val( valueout );
			$(this).parent().find("small").html("Less than: $"+valueout.toFixed(2));

			pos = pos.toString().replace(".","-");
			$(this).removeClass();
			$(this).addClass(type+" "+type+"-"+pos);

			clearTimeout(touchTimer);
			touchTimer = setTimeout(function(){
				triggerChange();
			},100);
		}
	});
	$(window).on("mouseup touchend", function(){
		click = false;
	});
}

this.swapSubHead = function( type ){
	$(".subhead").toggleClass("selector")

	if(type==1)
		$(".subhead li").removeClass("active");

	if(type==2 && $(".subhead li.active").length==0 )
		$(".subhead li:first-child").addClass("active");
}

this.compareSelected = function(e){
	var items = $("input[type='checkbox']:checked");
	$(".error_message").hide();

	if( items.length == 0){
		$(".error_message").html("Please select at least two brokers to compare.").show().attr('style','display: inline; position: absolute; bottom: 5px; right: 0px; font-size: 14px; color: red;')
		return;
	}

	var url = [];

	$(items).each( function(k,v){
		url.push( $(v).val() );
	})

	location.href="/compare?brokers=" + url.join("+");
}

this.toggleInner = function(i){
	$(i).on("click",function(e){
		e.preventDefault();
		var target = $(this).attr("data-target");

		$("[data-target="+target+"]").toggleClass("hidden");
		$("[data-name="+target+"]").toggleClass("hidden");
	});
}

this.attachDragger = function(i){
	var attachment = false, lastPosition, position, difference;
	$( i ).on("mousedown mouseup mousemove",function(e){
		if( e.type == "mousedown" ) attachment = true, lastPosition = [e.clientX, e.clientY], $(i).css({"cursor":"-webkit-grabbing"});
		if( e.type == "mouseup" ) attachment = false, $(i).css({"cursor":"-webkit-grab"});
		if( e.type == "mousemove" && attachment == true ){
			position = [e.clientX, e.clientY];
			difference = [ (position[0]-lastPosition[0]), (position[1]-lastPosition[1]) ];
			$(i).scrollLeft( $(i).scrollLeft() - difference[0] );
			$(i).scrollTop( $(i).scrollTop() - difference[1] );
			lastPosition = [e.clientX, e.clientY];
		}
	});
	$(window).on("mouseup", function(){
		attachment = false;
	});
}

this.initExit = function(){
	if( document.querySelector(".exit") == null )
		return;

	document.querySelector(".exit").addEventListener("click", function(e){
		if(ipad)
			return;
		toggleMenu()
	}, {passive: true});

	document.querySelector(".exit").addEventListener("touchstart", function(e){
		toggleMenu()
		e.preventDefault()
	}, {passive: true});

	document.querySelector(".exit").addEventListener("touchmove", function(e){
		e.preventDefault()
	}, {passive: true});

	document.querySelector(".exit").addEventListener("touchend", function(e){
		e.preventDefault()
	}, {passive: true});
}

this.initOverflows = function(){
	var overflows = document.querySelectorAll(".overflow, .scroller");

	for( var a in overflows ){
		if( typeof overflows[a] != "object" )
			continue;

		overflows[a].addEventListener("touchstart", function(e){
			if( e.target.closest(".scroller") )
				e.target.closest(".scroller").classList.add("activated")

			if( e.target.closest(".overflow") )
				e.target.closest(".overflow").classList.add("activated")
		}, {passive: true});
	}


	var overflows = document.querySelectorAll(".toggle");

	for( var a in overflows ){
		if( typeof overflows[a] != "object" )
			continue;

		overflows[a].addEventListener("click", function(e){
			if( e.target.parentNode.querySelector(".toggle-target") ){
				var tt = e.target.parentNode.querySelector(".toggle-target");
				tt.classList.toggle("toggle-target-active");

				e.target.classList.toggle("toggle-active");
				if( e.target.innerHTML == "Expand" ){
					e.target.innerHTML = "Collapse";
				}else{
					e.target.innerHTML = "Expand";
				}
			}


		}, true);
	}

	if(ipad){
		var overflows = document.querySelectorAll(".overflow");
		for( var a in overflows ){
			if( typeof overflows[a] != "object" )
				continue;

			if( overflows[a].scrollWidth > overflows[a].getBoundingClientRect().width ){
				overflows[a].classList.add("overflow-active");
			}

		}
	}

}

this.initScreenShots = function(){
	var screenshots = document.querySelectorAll(".screenshots a, a.picture");
	for( var a in screenshots ){
		if( typeof screenshots[a] != "object" )
			return;

		screenshots[a].addEventListener("click", openGallery, true );
		screenshots[a].addEventListener("touchleave", openGallery, true );
	}

}

this.openGallery = function(e){
	if(ipad){
		//e.preventDefault();
		//return;
	}

	e.preventDefault();

	$(".floater").remove();

	$("body").append('<div class="floater" onclick="uclose()"></div>');
	$(".floater").append('<div class="dispatch"></div>');
	$(".floater").append('<a href="javascript:close()" class="close">&times;</a>');

	if( $(e.target).prop("tagName") == "IMG" ){
		var target = $(e.target);
		var target_url = target[0].src;
	}else{
		var target = $(e.target).find("img")[0];
		var target_url = e.target.href;
	}

	$(".dispatch").append('<img style="margin-bottom:0" height="'+target.naturalHeight+'" width="'+target.naturalWidth+'" src="'+target_url+'">');

	if( e.target.querySelector("small").tagName == "SMALL" ){
		$(".dispatch").append('<small class="pop-caption">'+e.target.querySelector("small").innerHTML+'</small>');
	}

	$("html, body").addClass("locked");
}

this.uclose = function(){
	$(".floater").remove();
	$("html, body").removeClass("locked");
}


this.close = function(){
	$(".floater").remove();
	$("html, body").removeClass("locked");
}

this.fetchRotatedAd = function( o ){

	if( typeof o != "object")
		return;

	var size = o.getAttribute("data-type");
	var override = o.getAttribute("data-override");
	var isMulti = o.getAttribute("data-multi");
	var tcount = o.getAttribute("data-max");


	$.getJSON("/jsapi/frontendAPI.php?d=fetchRotatedAd",{size:size, page:location.pathname+location.search, override: override, multi: isMulti, tcount: tcount}, function( dat ){
		var offset = 1;

		if( dat.length != undefined  )
			offset = dat.length;

		if( dat.length == undefined && dat.name == ""  )
			o.remove();


		for( var i = 0; i <= offset; i++ ){
			if( offset > 1 ){
				d = dat[i];
				o = document.querySelectorAll(".fetchRotatedAd[data-multi='true']")[i];
			}else{
				d = dat;
			}

			if( o == undefined )
				continue;

			if( d.id == "" )
				continue;

			if(o.getAttribute("data-set") == 1)
				continue;

			o.setAttribute("data-set", "1");

			if( d == undefined ){
				continue;
			}


			if( d.disclaimer && d.disclaimer.length > 3 ){
				document.querySelector(".major-disclaimer").innerHTML += "<br>"+d.disclaimer;
			}

			if( d.script == "javascript" ){

				if( o.style.display == "none" ){
					o.setAttribute("style", "");
				}

				var s = document.createElement("iframe");
				s.src = '/iframe.php?type='+d.type+'&id=' + d.id+'&ref='+document.referrer;

				if( d.height > 0 )
					s.height = d.height;

				if( d.width > 0 ){
					s.width = d.width;
					s.setAttribute("style", "min-width:"+d.width+"px; width:"+d.width+"px")
				}



				s.onload = function(){

					if(d == undefined)
						return;

					if( d.height > 0 ){
						this.style.height = d.height;
					}

					if( d.width > 0 ){
						this.style.width = d.width;
					}else{
						//this.style.width = this.contentWindow.document.body.scrollWidth + 'px';
					}


					setTimeout(function(){
						if( d.height > 0 ){
							s.style.height = d.height;
						}


						if( d.width > 0 ){
							s.style.width = d.width;
						}else{
							//s.style.width = (s.contentWindow.document.body.clientWidth || s.contentWindow.document.body.scrollWidth || s.contentWindow.document.body.offsetWidth ) + 'px';
						}

					}, 2000);
				}

				s.scrolling = "no";
				o.appendChild(s);


				if( size == "mobile-wide" ){
					$("body").addClass("hasMobileAd");
				}

			}else{
				if( d.html == null )
					return;

				if( size == "mobile-wide" ){
					$("body").addClass("hasMobileAd");
				}

				o.insertAdjacentHTML("beforeend", d.html );

				if( o.style.display == "none" ){
					o.setAttribute("style", "");
				}


			}

			if( d.disclaimer_inline && d.disclaimer_inline.length > 3 ){
				o.innerHTML += d.disclaimer_inline;
			}

		}

		initAdTracker();

	});

}

this.fetchFeedback = function( o ){
	if( typeof o != "object")
		return;

	var request = new XMLHttpRequest();
	request.open("GET", "/module-feedback.php" );
	request.send();

	request.onload = function(rr){
		o.outerHTML = rr.target.response;
	}

}


this.selectAll = function(e){
	e.preventDefault()
	$("#body input[type='checkbox']").each(function(k,v){
		if( $(v).is(":checked") == false )
			$(v).click();
	});
}

this.unselectAll = function(e){
	e.preventDefault()
	$("#body input[type='checkbox']").each(function(k,v){
		if( $(v).is(":checked") == true )
			$(v).click();
	});
}

this.continueReading = function(e){
	$('.articleBody').toggleClass("activeReading")
}

this.brokerMenu = function(){
	$('.stickymenu').toggleClass("activeBrokerMenu");
	$('.stickymenu').removeClass("activeAnnualMenu");
}

this.validateMaxChecks = function(e){

	if(ipad){
		if( $(".checkboxes input[type=checkbox]:checked").length <= 2 )
			$(".checkboxes input[type=submit]").val("Compare "+$(".checkboxes input[type=checkbox]:checked").length+" (Max 2)");

		if( $(".checkboxes input[type=checkbox]:checked").length > 2 ){
	 		e.stopPropagation();
			e.preventDefault();
		}

	}else{
		if( $(".checkboxes input[type=checkbox]:checked").length <= 5 )
			$(".checkboxes input[type=submit]").val("Compare "+$(".checkboxes input[type=checkbox]:checked").length+" (Max 5)");

		if( $(".checkboxes input[type=checkbox]:checked").length > 5 ){
	 		e.stopPropagation();
			e.preventDefault();
		}
	}


}

this.filterMenuLast;
this.filterMenu = function(id, relay){
	$('.stickymenu').removeClass("activeBrokerMenu");

	$('.stickymenu h3').removeClass("focus")

	if(id == this.filterMenuLast){
		$('.stickymenu').removeClass("activeFilterMenu");
		this.filterMenuLast="";
		return;
	}

	$(relay).addClass("focus")
	$('.stickymenu').addClass("activeFilterMenu");

	$('.stickymenu .filter-menu-ul form > div').hide();
	$('.stickymenu .filter-menu-ul .'+id).show();

	$('.stickymenu .filter-menu-ul .broker-submit').show();
	this.filterMenuLast = id;
}


this.toggleSelectMenu = function( i ){
	$('.stickymenu').toggleClass(i);

}


this.annualMenu = function(){
	$('.stickymenu').toggleClass("activeAnnualMenu");
	$('.stickymenu').removeClass("activeBrokerMenu");
}


if( location.search.match(/ref=st-osb|utm_source=stocktrader.com/) ){
	var d= new Date();
	d.setTime( d.getTime() + (30*24*60*60*1000) );
	var expires = "expires="+d.toUTCString();

	var value = new Date().getTime()/1000;

	document.cookie="sttg_refferal="+ (value) +"; " + expires + "; path=/";
}

if( location.search.match(/ref=investorjunkie|utm_source=investorjunkie.com/) ){
	var d= new Date();
	d.setTime( d.getTime() + (30*24*60*60*1000) );
	var expires = "expires="+d.toUTCString();

	var value = new Date().getTime()/1000;

	document.cookie="ij_refferal="+ (value)+"; " + expires + "; path=/";
}

if( document.referrer.match(/(gclid|googleadservices)/) || location.search.match(/gclid/) ){
	var d= new Date();
	d.setTime( d.getTime() + (30*24*60*60*1000) );
	var expires = "expires="+d.toUTCString();

	var value = new Date().getTime()/1000;

	document.cookie="adwords_refferal="+ (value)+"; " + expires + "; path=/";
}


var storage = {};

/* forms */
this.compareBrokers = function(i, url){
	var obj = $(i);
	var checked = $(i+" :checked");

	if(url == undefined )
		url = "compare";

	var serial = obj.serialize();
	serial = serial.replace(/1|=/ig, "").split("&").sort().join("&");

	if(checked.length == 2){
		serial = serial.replace(/\&/ig, "-vs-");
		location.href = "/"+url+"/"+serial;
	}else{
		serial = serial.replace(/\&/ig, "+");
		location.href = "/"+url+"?brokers="+serial;
	}
}

this.trackWindowSize = function(){
	if( $(window).width() <= 768 )
		$(".links").css("display", "none");


	$(window).resize(function(e){
		if( $(window).width() > 768 && ( $(".links").css("display")=="none" || $(".links").css("display")=="block" ) )
			$(".links").css("display", "inline-block");

		if( $(window).width() < 768 && $(".links").css("display")=="inline-block" )
			$(".links").css("display", "none");
	});
}

this.calculateValues = function(){
	//validate selection first

	$("#calc input[type='text']").removeClass("red-outline")

	$(".notification").html("").hide();
	if( $("input[data-master=1]").is(":checked") == false ) return $(".notification").html("There are no results to return.").show();



	var has_issues = false;
	$("#calc input[type='text']:visible").each(function(k,v){
		if( $(v).val() == "" ){
			has_issues = true;
			$(v).addClass("red-outline")
		}
	});

	if(has_issues){
		return $(".notification").html("Please fill in the missing values outlined in red above.").show();
	}

	var form = $("#calc").serialize();
	document.getElementById("calc").action     = "/commissionscalculator";
	document.getElementById("calc").enctype    = "multipart/form-data";
	document.getElementById("calc").method     = "post";
	setTimeout(function(){
		document.getElementById("calc").submit();
	}, 10);
}

this.extendSearch = function( me ){
	var s = $(me).parent().parent().find("input[name=search]").val()
	setTimeout(function(){
		location.href="/results?q="+s;
	},100)
}

this.popSearch = function(i){
	$("header .search").toggleClass("active");
	$(i).toggleClass("active");
	$(i).toggleClass("svg-close");
	$("header .search input").focus()
	return false;
}

var xtimer = null;
this.doSearch = function(i){
	var placer =  $(i).next();
	if( placer.length == 0 ) $(i).after("<div class='dropdown'></div>").show();
	clearTimeout(xtimer);

	if( i.value == "" )
		return;

	xtimer = setTimeout(function(){
		$.getJSON("/jsapi/frontendAPI.php?d=searchBrokers",{q:i.value}, function(d){
			storage.q = i.value;

			if( typeof d != null ){
				placer.html("");
				$(d).each(function(k,v){
					placer.append("<a onclick='trackSearch(this, event)' href='"+v.url+"'>"+v.Name+"</a>");
				});
			}

			placer.append("<a onclick='trackSearch(this, event); extendSearch(this)' href='javascript:void(0)' style='font-size:12px; color:#333'>Search the site</a>");

		});
	}, 250);
}

this.doCountrySearch = function(i, e){
	var s = $(i).val();
	var n = $(i).next();

	if( s.length <= 0 ){
		n.hide();
		return;
	}

	var sr = new RegExp( "^"+s+"", "ig" )

	n.show();
	n.children("a").hide();

	n.children("a").each(function(k,v){
		if( v.innerHTML.match(sr) ){
			$(v).show();
		}
	});

	if(e && e.keyCode == 13 && n.find("a:visible").length == 1){
		n.find("a:visible")[0].click();
		$('.dropdown').hide();
	}

}

this.fetchCountrySearch = function(i, full){

	if( i.tagName == "SELECT" ){
		full = i.options[i.selectedIndex].innerHTML;

		i = i.value;
	}


	$(".broker-list > div").hide();

	//$("#cl_search input").val(full);

	$("#search_query").html("Showing results for \""+full+"\"")

	$(".broker-list > div").each(function(k,v){
		if( $(v).attr("data-list").match(i) ){
			$(v).show();
		}
	});

	if( $(".broker-list > div:visible").length == 0){
		$("#search_query").html("<b>We could not find any regulated online brokers matching this search. Please try again.</b>")
	}

	$.getJSON("/jsapi/frontendAPI.php?d=trackSearch",{q:full, t:location.href});
}

this.fetchCountrySearchV2 = function(i,full){
	var full = i.options[i.selectedIndex].text;
	var i = i.options[i.selectedIndex];
	$(".compare-table tbody tr").hide();

	$("#cl_search input").val(full);

	$("#search_query").html("Showing results for "+full+" \""+i.value+"\"")

	$(".compare-table thead tr th:eq(1)").html("Accepts "+i.value+" Residents");

	$(".compare-table tbody tr").each(function(k,v){
		if( $(v).attr("data-list").match(i.value) ){
			$(v).show();
		}
	});

	//if( $(".compare-table tbody tr:visible").length == 0)
	//	$("#search_query").html("<b>We could not find any regulated online brokers matching this search. Please try again.</b>")

	$.getJSON("/jsapi/frontendAPI.php?d=trackSearch",{q:full, t:location.href});
}


this.trackSearch = function(o, e){
	e.preventDefault();
	$.getJSON("/jsapi/frontendAPI.php?d=trackSearch",{q:storage.q, t:o.href}, function(d){
		location.href=o.href;
	});

}

this.whatIs = function(i){
	var v = $(i).attr("data-v");
	if( $(".popup_dialogue").length > 0 ){
		$(".popup_dialogue").remove();
	}
	$("body").append('<div class="popup_dialogue"></div>');
	$(".popup_dialogue").append('<h2><span class="icon-question2"></span> What is this?</h2>');
	$(".popup_dialogue").append('<p>'+v.replace(/\"/g, "'")+'</p>');
	$(".popup_dialogue").append("<a href='javascript:void(0)' onclick='$(\".popup_dialogue\").remove()' class='button blue'>Close</a>");
}



/* navigation */
this.toggleMenu = function(){
	if( $("html").hasClass("navActive") ){
		$("html").removeClass("navActive")
		$("html, body").removeClass("locked");
		active_menu = false;

		if(ipad){
			document.querySelector(".secondary-navigation").classList.remove("active");
			document.querySelectorAll(".secondary-navigation .inner > div").forEach(function(ii){
				ii.style.display='none'
			});
		}

	}else{
		$("html").addClass("navActive")
		$("html, body").addClass("locked");
		active_menu = true;
	}
}

this.showAll = function(){
	$(".checkboxes input[type=checkbox]").attr("checked","checked")
	compareBrokers('.compare .checkboxes')
}

this.toggleLinks = function(){
	$(".links").toggle(0);
}

this.triggerChange = function(){

	var form = $(".screener form input");
	var brokers = $(".column");
	var hidden = 0;

	clearTimeout(logTimer);
	logTimer = setTimeout(function(){
		var inputs = $(".screener form input[data-touched=1], .screener form input[type=checkbox]:checked").serialize();
		$.get("/jsapi/frontendAPI.php?d=trackScreener", inputs);
	}, 5000);

	brokers.show();
	$(".error_message").hide();

	brokers.find("input[type=checkbox]").prop("checked", false)

	$(brokers).each(function(k,v){
		$(form).each(function(kk,vv){
			if( $(vv).attr("type") == "text" && $(vv).attr("data-max") == undefined ){
				$(v).filter(function(){
					if(  Number($(this).attr("data-"+ $(vv).attr("name") )) < Number($(vv).val())  ){
						$(this).hide();
					}
				});
				return;
			}

			if( $(vv).attr("type") == "range" ){
				$(v).filter(function(){
					if(  Number($(this).attr("data-"+ $(vv).attr("name") )) > Number($(vv).val())  ){
						$(this).hide();
					}
				});
				return;
			}

			if( $(vv).attr("type") == "text" && $(vv).attr("data-max") != "undefined" ){
				$(v).filter(function(){
					if(  Number($(this).attr("data-"+ $(vv).attr("name") )) > Number($(vv).val())  ){
						$(this).hide();
					}
				});
				return;
			}

		});
	});


	$(".activeFilters").html("");

	$(".screener form input").each(function(k,v){
		if( $(v).attr("type") == "checkbox" && $(v).is(":checked") ){
			var p = $(v).parent().html().replace(/\<input.*?\/b>/, "").trim();
			$(".activeFilters").append("<div>"+p+" <a data-id='"+$(v).attr("name")+"' href='#'>&times;</a></div>");
		}else if( $(v).attr("type") == "range" && $(v).val() != $(v).attr("max") ){
			var p = $(v).parent().find("span").html();
			$(".activeFilters").append("<div>"+p+" <$"+$(v).val()+" <a href='#' data-id='"+$(v).attr("name")+"'>&times;</a></div>");
		}else if( $(v).attr("type") == "text" && $(v).val() != 0 ){
			var p = $(v).parent().find("span").html();
			$(".activeFilters").append("<div>"+p+" <span class='rating smaller rating-"+ $(v).val().replace(".", "-") +"'></span> <a href='#' data-id='"+$(v).attr("name")+"'>&times;</a></div>");
		}
	});

	$(".activeFilters a").on("click", function(e){
		e.preventDefault();
		var r = $(".screener form input[name='"+ $(this).attr("data-id") +"']");

		if( r.attr("type") == "text" ){
			r.val(0)
		}else if( r.attr("type") == "range" ){
			r.val( r.attr("max") )
		}else if( r.attr("type") == "checkbox" ){
			r.click();
		}
		triggerChange();
	})


	if( $(".screener form input[type='checkbox']:checked").length > 0 ){
		var buffer_check = $(".screener form input[type='checkbox']:checked");
		$(".column:visible").each(function(k,v){
			var inner_break = false;
			$(v).hide();
			$(buffer_check).each(function(kk,vv){
				if(  $(v).attr( "data-" + $(vv).attr("name") ) != 1  ){
					inner_break = true;
				}
			});

			if(!inner_break) $(v).show();

		});
	}

	$(".column:visible").find("input[type=checkbox]").prop("checked", true)


	if( $(".column:visible").length ==0 )
		$(".error_message").show();

}


var lazyImages = [].slice.call(document.querySelectorAll("img[data-src]"));
if ("IntersectionObserver" in window) {
  var lazyImageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.removeAttribute("data-src")
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  lazyImages.forEach(function(lazyImage) {
    lazyImageObserver.observe(lazyImage);
  });
} else {
	//fall back
}



