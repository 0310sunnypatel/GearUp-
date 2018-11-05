var x= document.getElementById("output");
		function resetForm()
		{
			document.getElementById("My-Form").reset();
			
		}
		function getLocation()
		{
		
			if(navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition(showPosition);
			}
			else
			{
				x.innerHTML="Browser not supporting";
			}
					
		}
		function showPosition(position)
		{
			var locAPI="https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat="+position.coords.latitude+
				"&lon="+position.coords.longitude;
			$.get({
			 	url:locAPI,
			 	success: function(data){
					console.log(data);
					document.getElementById("city").value = data.address.city;
					document.getElementById("state").value = data.address.state;
					document.getElementById("country").value = data.address.country;
					document.getElementById("zip").value = data.address.postcode;	 
				 }
			 });
		}	
	