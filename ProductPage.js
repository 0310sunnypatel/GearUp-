$(document).ready(function(){
	$("button").mouseover(function(){
		$(this).css("box-shadow","0 2px 4px 0 rgba(200,200,200,2)");
	})
	$("button").mouseout(function(){
		$(this).css("box-shadow","0 1px 2px 0 rgba(0,0,0,0.2)");
	})

});
