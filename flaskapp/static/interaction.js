
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

/*
All long text descriptions are moved here. They are referenced 
in the index.html file by id
*/
var load = function(){
    /*Homepage*/
    $("#homepage").append(           
            `<h4> 
                This Graph is build from a score 
                where pitches and/or harmonies are 
                mapped to nodes and pitch/harmony 
                transitions are mapped to links.
                Click \" Start Walk\" below to hear how 
                the score \' s original melody moves through 
                the graph. Change how notes map to nodes 
                by changing graph encoding below, or show 
                different community partitions by
                changing community algorithmn below. You can 
                also generate different \" random walks\" on 
                this graph as a form of algorithmic composition. 
            </h4>
        `);
    /*Upload*/
    $("#upload-header-1").append(
             `<h3> 
                 Step 1: Upload New Piece 
              </h3>

              <h4> Note: Only the top system of the piece will be 
                considered for the Basic and Grouped graphs. 
                In the Roman Numeral and 
                Grouped Roman Numeral Graphs, the highest note 
                is considered the melody.
                <i>If your file is not being processed, please email 
                kpet@iu.edu for 
                troubleshooting help </i> 
               </h4>`

        );

    //Code adapted from https://stackoverflow.com/questions/18334717/how-to-upload-a-file-using-an-ajax-call-in-flask  
 
    $("#upload-form-div").append(
          
       ` <form id="upload-file" method="post" enctype="multipart/form-data"> 
          
                <label for="file">Select a file. 
                Accepts files with the extension 
                <i>.xml</i>, <i>.mxl</i>, <i>.mid</i>  
                and <i>.musicxml</i> 
                </label> 
                <input name="file" type="file"> 
                <br>          
                <button id="upload-file-btn" type="button">Upload</button> 
        
        </form>` 

       );
    $("#upload-header-2").append(
        
        ` 
                <h3>  
                 Step 2: Enter Information about  
                 the piece you uploaded  
                 </h3> 
                 <h4>  
                 The key of the piece is used for  
                 Roman Numeral Harmonic Analysis -  
                 right now we don't support key  
                 changes so just pick one :).  
                 To create separate subgraphs for different 
                 sections of the piece, end the measure  
                 and note offset of the position  
                 you want that break to be.    
                 </h4>
        `

        );



    $("#change_param_div").append(
               ` <form id="changeparams"  method = "post" 
                        enctype="multipart/form-data">
             
                    <label for="key">
                    Enter Key of piece being processed. 
                    (for pieces in a minor 
                    key, enter the relative major):
                    </label>
                   <input type="text" id="key" name="key">
                     (e.g. <i>A</i>  ) 

                   <label for="grouping">
                    Enter New Measure Offsets for Forced Grouping graph 
                    as measure numbers separated by spaces:
                   </label>
                   <input type="text" id="grouping" name="grouping" >
                       ( e.g. <i>1 10 20 </i>) 
                   <label for="offsets">
                        Enter New New Note Offsets for Roman Numeral Forced
                        Grouping Graph as note offsets separated by spaced:
                    </label>
                   <input type="text" id="offsets" name="offsets" >
                    (e.g. <i>1  35 50 90</i>)
                   <br>
                <button id = "update-params-btn" type="button" class="submit">
                Submit
                </button>

         </form>
        `
        );   

    /*Change Encoding*/
    $("#change-structure-div").append(

        `           
            <h3>
            Click the below button to change to a different encoding scheme
            </h3>
            <h4>
            Explain how graph encoding scheme works, crib from paper. 
            Allow for custom scheme to be inputted? 
            </h4>


              <div class="col-sm-3">
                <button id="basic" class="option">
                Basic Encoding
                </button>
              </div>

              <div class="col-sm-3">        
                <button id="grouped" class="option">
                Forced Grouping Encoding
                </button>      
              </div>

              <div class="col-sm-3">
                <button id="RN" class="option">
                Roman Numeral Encoding
                </button>
              </div>

              <div class="col-sm-3">
                <button id="grouped_RN" class="option">
                Grouped Roman Numeral Encoding
                </button>
              </div>          
        `
        );
/*Change Community*/
    $("#change-community-div").append(

        `   
            <h2>
            Click the below button to change visualized communities
            </h2>

            <h4>
            Explain about communities. crib from paper.
            </h4>
            <div class="row">
              <div class="col-sm-3">
                    <button id="infomap_vis" class="option">
                    Change to Infomap
                    </button>
              </div>

              <div class="col-sm-3">
                    <button id="lpm_vis" class="option">
                    Change to Label Propagation
                    </button>
              </div>

              <div class="col-sm-3">
                    <button id="louvain_vis" class="option">
                    Change to Louvain
                    </button>
              </div>

              <div class="col-sm-3">
                    <button id="hlc_vis" class="option">
                    Change to Hierarchical Links
                    </button>
              </div>
        `
        );

/* Change Edges */
    $("#change-edge-div").prepend(

        `            
            <h2> Change Edge Weight</h2>
            <h4>
                You can change the weight (thickness) of edges 
                by clicking on a link to select it (the selected 
                link will turn red), typing in a new weight, then 
                clicking "submit". The altered link will turn magenta.
            </h4>

            <h4>
                Changing the weight of a node's outgoing edge alters
                the probability the next note of a generated composition
                will be the node on the other side of that link. 
                A thinker link means higher chance of transitioning,
                a thinner link means lower chance of transitioning. 
            </h4>
        `
        );

    $("#changed-edge-div-2").append(`     
                <form>
                    <label for="new_weight">
                       New Weight for Selected Edge
                    </label>
                    <input type="text"  id="new_weight" name="new_weight" >
                    ( e.g. <i>6</i>)
                    <button id = "change-weight-btn" type="button" 
                        class="submit">Submit</button>
                </form>
         
        `);

/*Generate Composition */

    $("#generate-composition-div").append(`

<h2>
Generate Composition from a random walk of this graph. To create the random walk, choose an option below and click "Submit"
</h2>

<form >
  <fieldset>
  <label for="walk-encoding-options">
        Choose Rhythm of Generated Composition:
  </label>
  <select id="walk-encoding-options" name="walk-encoding-options">
    <option value="ignore-comm">Ignore Communities</option>
    <option value="consider-comm">Consider Communities</option>

  </select>
  <button id = "change-walk-btn" type="button">Submit</button>
  </fieldset>
</form>





    `);




}

/*
In #(document).ready,  you can define responses to 
actions (e.g. button clicks) executed from 
the index.html file. To link an html action, use that action's id tag (e.g.
the id tag for the button to change groups is 'grouped'). The action of 
telling Flask to update the encoding scheme is detailed in the function 
change_encoding(), which takes an integer to represent 
which encoding to switch to .
*/ 
$(document).ready(function(){
    load();
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

