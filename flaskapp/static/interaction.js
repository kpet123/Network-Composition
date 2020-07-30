
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
        var form_data = new FormData($('#upload-file')[0])
      
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
            },
        error: function(request, status, error){
            console.log("from should be ")
            console.log(form_data)
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
    }
      
    });
};


//Change Graph generation parameters
var change_params = function() {
         var form_data = {
            key: $('#key').val(),
            offsets: $('#offsets').val(),
            grouping: $('#grouping').val(),

         };
         console.log("in change params function") 
         console.log(form_data)
         $.ajax({
            type: 'POST',
            url:'/changeparams',
            data: form_data,
        //    contentType: false,
        //    cache: false,
        //    processData: false,
            success: function(data) {
                location.reload();
                console.log('Success!');
            },
         error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
    }
     
    });
};
/****************
Change weight of edge
****************/
var change_weight = function() {
         var form_data = {
            src: document.getElementById("chosen_source").innerText,
            dst: document.getElementById("chosen_target").innerText,
            weight: $('#new_weight').val(),

         };
         console.log("in change weight function") 
         console.log(form_data)
         $.ajax({
            type: 'POST',
            url:'/change_edge_weight',
            data: form_data,
        //    contentType: false,
        //    cache: false,
        //    processData: false,
            success: function(data) {
                location.reload();
                console.log('Success!');
            },
         error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
    }
     
    });
};

//Change Graph generation parameters
var change_walk_encoding = function() {
         var form_data = {
            walk_type: $('#walk-encoding-options').val(),
         };
         console.log("in change params function") 
         console.log(form_data)
         $.ajax({
            type: 'POST',
            url:'/change_walk_encoding',
            data: form_data,
        //    contentType: false,
        //    cache: false,
        //    processData: false,
            success: function(data) {
                location.reload();
                console.log('Success!');
            },
         error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
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
    $("#louvain_vis").click(function() {
        console.log(data);
        change_community(2);
    });
    $("#hlc_vis").click(function() {
        console.log(data);
        change_community(3);
    });
    // New Data Upload
     $('#upload-file-btn').click(function() {
        console.log("in upload file button")
        upload();        
    });
    //Update Parameters
    $('#update-params-btn').click(  function() {
        console.log("in change params document ready")
        change_params();        
    });
    //Change Edge weights
    $('#change-weight-btn').click(  function() {
        console.log("in change weight document ready")
        change_weight();    
    }); 
    //Change walk enoding option
    $('#change-walk-btn').click( function(){
        console.log("in change walk document ready");
        change_walk_encoding();

    });

})

