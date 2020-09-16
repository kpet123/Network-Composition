
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
            `<p> 
                The structure you see below is built from 
                a music score. Each circle, or "node", 
                corresponds to a note, while each arrow, or 
                "link", corresponds to a transition between 
                two notes. The thickness of each note represents
                its "transition probability" and represents the number
                of times a note transition occurs in the inputted
                score. 
              <p>
                </p>
                 Click the " Start Walk" button below to hear how 
                the score' s original melody moves through 
                the graph. Change how notes map to nodes 
                by altering the <i>graph encoding </i> above, 
                or show different ways to divide the graph into 
                groups by changing community below. You can 
                also generate different \" random walks\" on 
                this graph as a form of algorithmic composition. 
            </p>
        `);
    /*Upload*/
    $("#upload-header-1").append(
             `<h3> 
                 Step 1: Upload New Piece 
              </h3>

              <p> Note: Only the top system of the piece will be 
                considered for the Basic and Grouped graphs. 
                In the Roman Numeral and 
                Grouped Roman Numeral Graphs, the highest note 
                is considered the melody.
                See the <i>Change Graph Structure</i> tab for 
                more information about different graph types. 
                <i>If your file is not being processed, please email 
                kpet@iu.edu for 
                troubleshooting help </i> 
               </p>`

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
                 <p>
                 Some extra information is needed to create
                 graphs other than the <i>Basic</i> graph
                 encoding. If you want to create a 
                 <i>Roman Numeral</i> or <i>Grouped Roman
                 Numeral</i> graph, please enter the
                 relative major of the most prominent
                 key of the piece. This is used for  
                 Roman Numeral Harmonic Analysis -  
                 right now we don't support key  
                 changes so just pick one :). 

                 </p>
                <p>
                 Currently, subgraph creation for the <i> Grouped
                </i> graph and <i>Grouped Roman Numeral</i> graph
                happens in two ways. The <i>Grouped</i> graph is 
                delimited by measure number, while the <i>Grouped
                Roman Numeral </i> is delimited by absolute note 
                offset. TRY TO FIX THIS BEFORE PUBLISHING.
                These delimiters allow separate "subgraphs" to 
                be created. [explain this better]  
                 </p>
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
            <p>
            There are several ways one can turn a score into
            a graph:
            </p>
            <p>
            1. <i>Basic Graph</i>: This graph encoding maps 
            each distinct pitch as a separate node(circles
            on the graph). In fancy terms, the total number of 
            nodes is equal to the size of the set of distinct pitches 
            in the original piece. GCBot then creates something 
            called a "multi-edge directed" out of the score. Each 
            note becomes a node in the graph and each 
            note transition (sequence of two adjacent notes) turns
            into converted to a directed edge, or arrow. If a note 
            transition was repeated, another edge between the 
            original two nodes is added, making the arrow appear thicker.
            A "start" and "end" node are added to show where the piece
            begins and ends.
            </p>
            <p>
            2. <i>Forced Grouping Graph</i> To build this graph, 
            you first divide the score into sections (specified
            as the "grouping" and "offset" parameters
            when you upload a new piece). Apart from making the graph 
            look cool, grouping the graph allows the random walk
            composition to have distinct sections with different
            character. Click here for a more technical explanation
           
            </p>
            <p>
            3. <i>Roman Numeral Graph</i> Roman numeral analysis 
            is a chord classification scheme based on how 
            different harmonies function within a 
            piece. By using Roman numeral analysis to classify 
            nodes, node transitions will now reflect both a 
            piece's harmonic and melodic transition patterns.
            </p>
            <p>               
            4. <i>Roman Numeral Graph</i> This is a combination 
            of the Roman Numeral Graph and Forced Grouping Graph 
            described above. The advantage of this method is 
            a rich node encoding scheme that takes into 
            account local transition probability 
            differences and harmonic structure. 
            </p>


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
           <p> Community detection is a broad, open-ended problem that attempts to answer questions of the archetype "What are some mesoscale structures
           in this network?" Given a network, how do we find groups of nodes that are highly dense, and only sparsely connected to the rest of the network. 
           Finding these communities are important for a variety of applications, but notably to musical composition, they guide the composition process.
           A strong community represents a strong melody within a particular portion of a piece. Being able to identify, and manipulate, these communities a priori 
           is a valuable advantage in composition.
           </p>

           <p> 1.) Infomap - this method is based on the time spent in certain modules of a random walker. 
           It derives from theory generally stating that a strong community will "trap" a random walker for a long time. </p>

           <p> 2.) Label Propogation - label propogation method, or LPM, is a method based on diffusion - node labels are treated as dynamic quantities, and
           are diffused based on a node's neighbors assignments until a steady state is reached. </p>

           <p> 3.) Louvain - this classic algorithm is a fast greedy optimization to a quality function. It's incredibly fast and yields decent results. </p>

           <p> 4.) Hierarchical Links - this creative method employs a hierarchical dendrogram-cutting approach to a dendrogram of links - this 
           clusters the links natively, not the edges, but allows for overlapping community of nodes. </p>



            
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

