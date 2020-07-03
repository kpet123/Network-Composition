//testing

$("#demo").html("11");
//define function
var pass_eg = function(data) {
	console.log("data in pass_eg "+data);
 var obj = 1;
	jQuery.ajax({
	type: "POST",
	url: "/pass_eg",    
	dataType : "json",
	contentType: "application/json; charset=utf-8",
	data : JSON.stringify(obj),
	success: function(result){
		location.reload();
		console.log("Success");	
	},  
error: function(request, status, error){
		console.log("Error");
		console.log(request)
		console.log(status)
		console.log(error)
	}   
}); 
}
//interactivity

$(document).ready(function(){
	console.log("in custom_script document ready");
	console.log(data);
	$("#demo").html("11");
	$("#save").click(function() {
		console.log(data);
		pass_eg(data)
		$("#data_test").append(data)
		console.log(data);


	})
})

