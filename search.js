document.getElementById("searchBtn").addEventListener("click",function(){
    var str= document.getElementById("search").value;
    $.ajax({
        url: "/searchProductsA",
        type: 'get',
        datatype: 'json',
        data: {
            "search": str
        },
        success: function(data){
             d
        }
        
    });
});
