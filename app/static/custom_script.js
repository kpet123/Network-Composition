
var pass_eg = function(data) {

		var obj = { "name": "John", "age": "30", "city": "New York" };
       $.ajax({
        type: "POST",
        url: "/pass_eg",    
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(obj),
        success: function(result){
            var all_data = result["data"]
            data = all_data
        },
       error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}


$(document).ready(function(){
	console.log("in custom_script document ready");
    $("#save").click(function() {
        pass_eg(data)
		
     
    })
})


