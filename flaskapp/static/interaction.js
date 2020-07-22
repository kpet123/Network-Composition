
//define function that sends a signal to Flask that the -data- variable
//should be updated
var change_encoding = function(action) {
	console.log("data in shiftEncoding"+data);
 //1 is our message - this is just a 'go' signal
 var obj = action;
	jQuery.ajax({
	type: "POST",
	//This url is the destination of the message being sent
	//It needs to be specified in Flask through @app.route()
	url: "/shiftEncoding",    
	dataType : "json",
	contentType: "application/json; charset=utf-8",
	//this is a different data paramenter, must pass in the JSON
	//string to be sent to Flask
	data : JSON.stringify(obj),
	success: function(result){
		//Reload the page after data is updated sucessfully
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

// Community interaction stuff
var change_community = function(action) {
	console.log("data in shiftCommunity"+data);
 //1 is our message - this is just a 'go' signal
 var obj = action;
	jQuery.ajax({
	type: "POST",
	//This url is the destination of the message being sent
	//It needs to be specified in Flask through @app.route()
	url: "/shiftCommunity",    
	dataType : "json",
	contentType: "application/json; charset=utf-8",
	//this is a different data paramenter, must pass in the JSON
	//string to be sent to Flask
	data : JSON.stringify(obj),
	success: function(result){
		//Reload the page after data is updated sucessfully
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

//Upload New Data
var upload = function() {
   
        var form_data = new FormData($('#upload-file')[0]);
        $.ajax({
            type: 'POST',
            url: '/uploadajax',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                location.reload();
                console.log('Success!');
            }
       
    });
};
//in #(document).ready,  you can define responses to 
//actions (e.g. button clicks) executed from 
//the index.html file. To link an html action, use that action's id tag (e.g.
//the id tag for the button to change groups is 'grouped'). The action of 
//telling Flask to update the encoding scheme is detailed in the function 
//change_encoding(), which takes an integer to represent which encoding to switch
//to . 
$(document).ready(function(){
	console.log("in custom_script document ready");
	console.log("data is ");
	console.log(data);
    console.log("key is ");
	console.log(key)
	//'grouped' is the id of the html button associated with this action
	$("#grouped").click(function() {
		console.log(data);
		change_encoding(1)
	});
    $("#basic").click(function() {
        console.log(data);
        change_encoding(2)
	});
    $("#RN").click(function() {
        console.log(data);
        change_encoding(3)
	});
    $("#grouped_RN").click(function() {
        console.log(data);
        change_encoding(4)
		//'data_test' is the id of the div used to show the current 
		//json string being used. We can include the below code in each action
		// blockso the displayed variable will update after we change encodings
		
		//$("#data_test").append(data)
		//console.log(data);
		});

	// Community buttons
	$("#infomap_vis").click(function() {
        console.log("in infomap");
        console.log(data);
        change_community(0)
	});
    $("#lpm_vis").click(function() {
        console.log(data);
        change_community(1);


	});
    $('#upload-file-btn').click(function() {
        console.log("in upload file button")
        upload();        
    });
})

