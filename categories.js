$(document).ready(function(){
	$(".text").css('text-transform','uppercase');

	$(".Badminton").click(function(){
    	window.location.href="productsAsCategories/Badminton";
	});
	$(".Basketball").click(function(){
    	window.location.href="productsAsCategories/Basketball";
	});$(".Football").click(function(){
    	window.location.href="productsAsCategories/Football";
	});$(".Cricket").click(function(){
    	window.location.href="productsAsCategories/Cricket";
	});

	$(".zoom").mouseover(function(){
		$(this).css('transform','scale(1.10)');
	})

	$(".zoom").mouseout(function(){
		$(this).css('transform','scale(1)');
	})
})


