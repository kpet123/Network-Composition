./dc296880051cbfd9@1205.js                                                                          000644  000000  000000  00000055300 13707343542 012567  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         // https://observablehq.com/@kaiser-dan/music-composition-graph-link-view@1205
import define1 from "./e93997d5089d7165@2283.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["myfile@4.json",new URL("./files/7512a903fcb99a2a3e8ec25e369d35c550cff8e0e3f3ac39b42ef41ff433ae8720e00692a47d4955954f1f7815abc9277f8f1e26b2a8207f70443204163c61f4",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Music Composition Graph Link View`
)});
  main.variable(observer("viewof start_walk")).define("viewof start_walk", ["html"], function(html){return(
html`<form>${Object.assign(html`<button type=button>Start Random Walk`, {onclick: event => event.currentTarget.dispatchEvent(new CustomEvent("input", {bubbles: true}))})}`
)});
  main.variable(observer("start_walk")).define("start_walk", ["Generators", "viewof start_walk"], (G, _) => G.input(_));
  main.define("initial chosen_source", function(){return(
null
)});
  main.variable(observer("mutable chosen_source")).define("mutable chosen_source", ["Mutable", "initial chosen_source"], (M, _) => new M(_));
  main.variable(observer("chosen_source")).define("chosen_source", ["mutable chosen_source"], _ => _.generator);
  main.variable(observer("passed_src")).define("passed_src", ["md","chosen_source"], function(md,chosen_source){return(
md`${chosen_source}`
)});
  main.define("initial chosen_target", function(){return(
null
)});
  main.variable(observer("mutable chosen_target")).define("mutable chosen_target", ["Mutable", "initial chosen_target"], (M, _) => new M(_));
  main.variable(observer("chosen_target")).define("chosen_target", ["mutable chosen_target"], _ => _.generator);
  main.variable(observer("passed_dst")).define("passed_dst", ["md","chosen_target"], function(md,chosen_target){return(
md`${chosen_target}`
)});
  main.define("initial weight", function(){return(
null
)});
  main.variable(observer("mutable weight")).define("mutable weight", ["Mutable", "initial weight"], (M, _) => new M(_));
  main.variable(observer("weight")).define("weight", ["mutable weight"], _ => _.generator);
  main.variable(observer("passed_weight")).define("passed_weight", ["md","weight"], function(md,weight){return(
md`**${weight}**`
)});
  main.define("initial highlighted_edge", function(){return(
null
)});
  main.variable(observer("mutable highlighted_edge")).define("mutable highlighted_edge", ["Mutable", "initial highlighted_edge"], (M, _) => new M(_));
  main.variable(observer("highlighted_edge")).define("highlighted_edge", ["mutable highlighted_edge"], _ => _.generator);
  main.variable(observer("chart")).define("chart", ["data","d3","width","height","attraction","radius","distance","link_thickness","color","drag","play","mutable highlighted_edge","mutable weight","mutable chosen_source","mutable chosen_target","linkArc","invalidation","random_walk"], function(data,d3,width,height,attraction,radius,distance,link_thickness,color,drag,play,$0,$1,$2,$3,linkArc,invalidation,random_walk)
{
  
/*
****************
Extracts links and nodes from data
****************
*/
    
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

  
/*
****************
Simulation Parameters. Check out D3 force-direct graph documentation for more info
****************
*/
     
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(50))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody().strength(attraction)) //this variable controlled by slider above
        .force("collide", d3.forceCollide().radius(radius*distance))
        .force("y", d3.forceY().strength(.01));

/*
****************
Create SVG that holds image. 'width' is automatically detected by Observable. Height is defined below
****************
*/  
  
  
    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])  


  
/*
************
Create Markers. Code adapted from:
https://observablehq.com/@xianwu/force-directed-graph-network-graph-with-arrowheads-and-lab
**************
*/
  
  //appending little triangles, path object, as arrowhead
  //The <defs> element is used to store graphical objects that will be used at a later time
  //The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers on a given <path>, <line>, <polyline> or <polygon> element.
/*
    
    svg.append('defs').append('marker')
      .attr("id",'arrowhead')
      .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
       .attr('refX',radius*2) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
       .attr('refY',0)
       .attr('orient','auto')
          .attr('markerWidth',3)
          .attr('markerHeight',3)
          .attr('xoverflow','visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', 'black')
      .style('stroke','none')
      .style("opacity", .6);

*/
    
    
  // black marker - normal mode
  svg.append("defs").selectAll("marker")
    .data(nodes)
    .join("marker")
      .attr("id", 'arrowhead')
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)// where arrow is starting
      .attr("refY", 0)
      .attr("markerWidth", 3)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
    .append("path")
      .attr("fill", "black")
     .attr("d", "M0,-5L10,0L0,5");  
 
   //Blue marker - mouseover
   svg.append("defs").selectAll("marker")
    .data(nodes)
    .join("marker")
      .attr("id", 'arrowhead-blue')
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)// where arrow is starting
      .attr("refY", 0)
      .attr("markerWidth", 3)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
    .append("path")
      .attr("fill", "blue")
     .attr("d", "M0,-5L10,0L0,5");  
  
 //red marker - selected and changed 
 svg.append("defs").selectAll("marker")
    .data(nodes)
    .join("marker")
      .attr("id", 'arrowhead-red')
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)// where arrow is starting
      .attr("refY", 0)
      .attr("markerWidth", 3)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
    .append("path")
      .attr("fill", "red")
     .attr("d", "M0,-5L10,0L0,5");  
  
   //Magenta marker: changed 
 svg.append("defs").selectAll("marker")
    .data(nodes)
    .join("marker")
      .attr("id", 'arrowhead-magenta')
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)// where arrow is starting
      .attr("refY", 0)
      .attr("markerWidth", 3)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
    .append("path")
      .attr("fill", "magenta")
     .attr("d", "M0,-5L10,0L0,5"); 
/*
************
Initialize Links
**************
*/
   


  
const link = svg.append("g")
        .attr("fill", "none")

        .attr("stroke-opacity", 0.4)

      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke-width",  link_thickness )
      .attr('marker-end',function(d){
        if( d.changed_edge ==1){
          return 'url(#arrowhead-magenta)';
        }
        else{
           return 'url(#arrowhead)'
        }
      })
      .attr("stroke", function(d){
            if( d.changed_edge == 1){
              return "magenta";
            }
            else{
              return color // Add the switch to community-based coloring here?
            }});          


  link.append("title")
      .text(d => d.weight);

 

/*
const link = svg.append("g")
    .selectAll("line")
    .data(data.links)
    .attr("class", "link")
    .style("stroke-width", function (d) {
    return Math.sqrt(d.value);
})
    .attr("x1", function (d) {
    return d.source.x;
})
    .attr("y1", function (d) {
    return d.source.y;
})
    .attr("x2", lineX2)
    .attr("y2", lineY2)
    .attr("marker-end", "url(#arrowGray)");
 
*/

/*
************
Initialize Nodes
**************
*/



    
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", radius/20)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", radius) //This variable corresponds to slider above 
        .attr("fill", color)
        .attr("opacity", 1)
        .call(drag(simulation));

/*
************
Initialize Text
**************
*/
      
   var texts  = svg.selectAll(".texts")
      .data(nodes)
      .enter()
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("dx", -0.8*radius)
      .attr("dy", "0.12em")
      .attr("font-size", radius*.9)
      .attr("fill", "white")
      .text( d => d.pitch )
      .call(drag(simulation))
      .on("click", clickedtext);
 

  node.append("title")
      .text(d => d.id);
/*
************
Animation: Play note and animate when text is clicked
**************
*/
 
    function clickedtext(d) {
    if (d3.event.defaultPrevented) return; // dragged
    
   // play(d.data.node.note);
    d3.select(this).transition()
        .attr("fill", "black")
        .attr("r", radius * 2)
      .transition()
        .attr("r", radius)
        .attr("fill", "white");
      if(d.id != "start" && d.id != "end"){
          play(d.pitch);
      }
  }
  
  
  
 /*
**************
Link MouseClick Functionality. 
  -Allows user to choose link and change weight
**************
*/
  
   link.on('click',function (d) {
        d3.select(this)
        .attr('stroke', 'red')
        .attr("stroke-opacity", .4)
        .attr('marker-end','url(#arrowhead-red)');
        $0.value = `{${d.source.id} ,  ${d.target.id}}`
        $1.value = `${d.weight}`

   });   
  
  
 /*
**************
Link Mouseover Functionality. 
  -should turn selected link blue (only works before mousing over node?)
  -show tool tip in top right corner with link name
**************
*/
  
   link.on('mouseover',function (d) {
       d3.select(this)
        .attr('stroke', 'blue')
        .attr("stroke-opacity", .4)
        .attr('marker-end','url(#arrowhead-blue)')
        .attr("stroke-width",  5);
        $0.value = `{${d.source.id} ,  ${d.target.id}}`
  
   }); 
  
     link.on('mouseout',function (d) {
       d3.select(this)
        .attr('stroke', '#999')
        .attr("stroke-opacity", 0.4)
       .attr("stroke-width",  link_thickness )
             .attr('marker-end',function(d){
        if( d.changed_edge ==1){
          return 'url(#arrowhead-magenta)';
        }
        else{
           return 'url(#arrowhead)'
        }
      })
      .attr("stroke", function(d){
            if( d.changed_edge == 1){
              return "magenta";
            }
            else{
              return "#999"
            }});        
    
       d3.select("#tooltip").remove();
  });

  
     link.on('click',function (d) {
        d3.select(this)
        .attr('stroke', 'red')
        .attr("stroke-opacity", .7)
        .attr('marker-end','url(#arrowhead-red)');
        $2.value = `${d.source.id}`;
        $3.value = `${d.target.id}`;
        $1.value = `${d.weight}`

   });   
  
/*
**************
Describes Simulation
**************
*/  
 
  
  
  
  simulation.on("tick", () => {
    link.attr("d", linkArc);
    node.attr("transform", d => `translate(${d.x},${d.y})`);
    texts.attr("transform", d => `translate(${d.x},${d.y})`);
  });



/*  
simulation.on("tick", function () {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", lineX2)
      .attr("y2", lineY2)
      .attr("r", d=>Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y));

    node
      .attr("cx", d=>d.x)
      .attr("cy", d=>d.y);
  
   texts
        .attr("x", d =>d.x)
        .attr("y", d=>d.y);
}); 
*/

  /*
    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

     // node
       //   .attr("cx", d => d.x)
         // .attr("cy", d => d.y);
      
     node
          .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
    texts
        .attr("x", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
          .attr("y", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
    });


*/
  
/*
**************
Not 100% sure what this does
**************
*/  

    invalidation.then(() => simulation.stop());

/*
**************
Return function - houses update for random walk
-only activated when 'pnt' changes
**************
*/  

  
  return Object.assign(svg.node(), {
    update({nodes, links}, c) {

      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(node.data().map(d => [d.id, d]));
      nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
      links = links.map(d => Object.assign({}, d));

      //new variable
      const pnt = random_walk[c];
      
      
      node = node
        .data(nodes, d => d.id)
        .join(enter => enter.append("circle")
          .attr("fill", d => color(color)))
         .attr("r", function (n) {
            if(n.id === pnt.id){
              return radius*1.5;
           }
          else{
              return radius; 
          }
         });
      



      

      
      link = link
        .data(links, d => [d.source, d.target])
        .join("line");

      simulation.nodes(nodes);
      simulation.force("link").links(links);
      simulation.alpha(1).restart();
      

    }
  });
}
);
  main.variable(observer("update")).define("update", ["chart","data","counter"], function(chart,data,counter){return(
chart.update(data, counter)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Input Parameters`
)});
  main.variable(observer("viewof distance")).define("viewof distance", ["slider"], function(slider)
{

return slider({
    min: 1.5,
    max: 5, 
    step: .1,
    title: "Node Distance",
   
    value: 2
 })
  
}
);
  main.variable(observer("distance")).define("distance", ["Generators", "viewof distance"], (G, _) => G.input(_));
  main.variable(observer("viewof radius")).define("viewof radius", ["slider","default_radius"], function(slider,default_radius)
{

return slider({
    min: 1,
    max: 30, 
    step: 1,
    title: "Node Radius",
    value: default_radius
 })
  
}
);
  main.variable(observer("radius")).define("radius", ["Generators", "viewof radius"], (G, _) => G.input(_));
  main.variable(observer("viewof attraction")).define("viewof attraction", ["slider"], function(slider)
{

return slider({
    min: -100,
    max: 0, 
    step: 1,
    title: "Node Actraction",
   
    value: -10
 })
  
}
);
  main.variable(observer("attraction")).define("attraction", ["Generators", "viewof attraction"], (G, _) => G.input(_));
  main.variable(observer("viewof volume")).define("viewof volume", ["slider"], function(slider)
{

return slider({
    min: -24,
    max: 0, 
    step: 1,
    title: "Playback Volume",
   
    value: -3
 })
  
}
);
  main.variable(observer("volume")).define("volume", ["Generators", "viewof volume"], (G, _) => G.input(_));
  main.variable(observer("viewof type")).define("viewof type", ["DOM"], function(DOM){return(
DOM.select(['sine', 'triangle', 'sawtooth', 'square'])
)});
  main.variable(observer("type")).define("type", ["Generators", "viewof type"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`# Data and Random Walk`
)});
  main.variable(observer("random_walk")).define("random_walk", function(){return(
[{'note': 'A4', 'duration': 250.0, 'id': '1_A4'}, {'note': 'E5', 'duration': 250.0, 'id': '1_E5'}, {'note': 'A4', 'duration': 250.0, 'id': '1_A4'}, {'note': 'E4', 'duration': 250.0, 'id': '1_E4'}, {'note': 'A4', 'duration': 250.0, 'id': '1_A4'}, {'note': 'B4', 'duration': 250.0, 'id': '1_B4'}, {'note': 'C#5', 'duration': 250.0, 'id': '1_C#5'}, {'note': 'D5', 'duration': 250.0, 'id': '1_D5'}, {'note': 'E5', 'duration': 250.0, 'id': '1_E5'}, {'note': 'C#5', 'duration': 250.0, 'id': '1_C#5'}]
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("myfile@4.json").json()
)});
  main.variable(observer()).define(["md"], function(md){return(
md` # Other Parameters`
)});
  main.variable(observer()).define(["md"], function(md){return(
md` Calculates default radius given number of nodes and viewbox size`
)});
  main.variable(observer("default_radius")).define("default_radius", ["width","height","data"], function(width,height,data){return(
Math.sqrt((width * height/(data.nodes.length * 10))/3.14)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Height of viewbox for chart`
)});
  main.variable(observer("height")).define("height", function(){return(
800
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Calculates thickness of link based on weight of link`
)});
  main.variable(observer("link_thickness")).define("link_thickness", ["d3"], function(d3)
{
  const scale = d3.scaleLinear();
  return d => scale(d.weight);
}
);
  main.variable(observer()).define(["md"], function(md){return(
md` Color of Node based on community assignment`
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.comm);
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Helper Functions and Objects`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Controls playing of music in random walk + sends node ID to chart for display`
)});
  main.variable(observer("counter")).define("counter", ["start_walk","random_walk","play","Promises"], function*(start_walk,random_walk,play,Promises)
{
  start_walk;
  let i = 0;
  while (i < random_walk.length) {
    play(random_walk[i].note);
    yield Promises.delay(random_walk[i].duration, ++i);
  }
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `Plays synthesizer`
)});
  main.variable(observer("play")).define("play", ["synth"], function(synth){return(
note => {
  
 return synth.triggerAttackRelease(note, '8n')
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md` Drag simulation for chart`
)});
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md` Synthesizer`
)});
  main.variable(observer("synth")).define("synth", ["Tone","Volume","type","invalidation"], function*(Tone,Volume,type,invalidation)
{
  //create a synth and connect it to the master output (your speakers)
  var synth = new Tone.PolySynth().chain(Volume, Tone.Master);
  synth.set({
    oscillator: {
      type
    },
    envelope: {
      decay: 1,
      release: 1
    }
  });
  try {
    yield synth;
    yield invalidation;
  } finally {
    synth.dispose();
  }
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`Line target X, calculated to be on edge of node. Code from //code from http://jsfiddle.net/mzz9B/3/  `
)});
  main.variable(observer("lineX2")).define("lineX2", ["radius"], function(radius){return(
function (d) {
    //self loop
    if (d.target.x == d.source.x && d.target.y == d.source.y){
        return d.target.x      
    }
    var length = Math.sqrt(Math.pow(d.target.y - d.source.y, 2) + Math.pow(d.target.x - d.source.x, 2));
    var scale = (length - radius) / length;
    var offset = (d.target.x - d.source.x) - (d.target.x - d.source.x) * scale;
    return d.target.x - offset;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Line target Y, calculated to be on edge of node. Code from //code from http://jsfiddle.net/mzz9B/3/  `
)});
  main.variable(observer("lineY2")).define("lineY2", ["radius"], function(radius){return(
function (d) {
        //self loop
    if (d.target.x == d.source.x && d.target.y == d.source.y){
        return d.target.y      
    }
    var length = Math.sqrt(Math.pow(d.target.y - d.source.y, 2) + Math.pow(d.target.x - d.source.x, 2));
    var scale = (length - radius) / length;
    var offset = (d.target.y - d.source.y) - (d.target.y - d.source.y) * scale;
    return d.target.y - offset;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md` # Second Chart`
)});
  main.variable(observer("linkArc")).define("linkArc", ["lineX2","lineY2"], function(lineX2,lineY2){return(
function linkArc(d) {
  const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  return `
    M${d.source.x},${d.source.y}
    A${r},${r} 0 0,1 ${lineX2(d)},${lineY2(d)}
  `;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md ` Section for defining and testing Synthesizer. Code adapted from  https://observablehq.com/@tmcw/playing-with-tone-js`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Type of waveform, user can choose tone type`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Speed`
)});
  main.variable(observer("viewof delay")).define("viewof delay", ["DOM"], function(DOM){return(
DOM.range(100, 500, 10)
)});
  main.variable(observer("delay")).define("delay", ["Generators", "viewof delay"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`Creates synthesizer. Has some sort of automatic clean up function. Not sure if we need something this fancy if less options, but more are nice`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This is a button connected to an event listener in the 'chart' object below. Whenever it is clicked, the 'update' function in the chart object will trigger. Right now clicking it turns all the nodes orange`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Imports`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.variable(observer("Tone")).define("Tone", ["require"], function(require){return(
require('tone')
)});
  main.variable(observer("Volume")).define("Volume", ["Tone","volume"], function(Tone,volume){return(
new Tone.Volume(volume)
)});
  return main;
}
                                                                                                                                                                                                                                                                                                                                PaxHeader                                                                                           000644  000000  000000  00000000222 13707343542 011124  x                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         146 path=./files/7512a903fcb99a2a3e8ec25e369d35c550cff8e0e3f3ac39b42ef41ff433ae8720e00692a47d4955954f1f7815abc9277f8f1e26b2a8207f70443204163c61f4
                                                                                                                                                                                                                                                                                                                                                                              PaxHeader                                                                                           000644  000000  000000  00000025152 13707343542 011025  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         {"directed": true, "multigraph": false, "graph": {}, "nodes": [{"comm": 0, "pitch": "A4", "id": "A4"}, {"comm": 0, "pitch": "B4", "id": "B4"}, {"comm": 0, "pitch": "E4", "id": "E4"}, {"comm": 1, "pitch": "C#5", "id": "C#5"}, {"comm": 2, "pitch": "E5", "id": "E5"}, {"comm": 3, "pitch": "A5", "id": "A5"}, {"comm": 1, "pitch": "D5", "id": "D5"}, {"comm": 2, "pitch": "F#5", "id": "F#5"}, {"comm": 1, "pitch": "D4", "id": "D4"}, {"comm": 0, "pitch": "D#4", "id": "D#4"}, {"comm": 0, "pitch": "G#4", "id": "G#4"}, {"comm": 0, "pitch": "G4", "id": "G4"}, {"comm": 0, "pitch": "C#6", "id": "C#6"}, {"comm": 0, "pitch": "G5", "id": "G5"}, {"comm": 2, "pitch": "D#5", "id": "D#5"}, {"comm": 0, "pitch": "end", "id": "end"}, {"comm": 3, "pitch": "G#5", "id": "G#5"}, {"comm": 2, "pitch": "A#4", "id": "A#4"}, {"comm": 1, "pitch": "B5", "id": "B5"}, {"comm": 1, "pitch": "F#4", "id": "F#4"}, {"comm": 0, "pitch": "start", "id": "start"}], "links": [{"weight": 1, "changed_edge": 0.0, "source": "A4", "target": "A4"}, {"weight": 12, "changed_edge": 0.0, "source": "A4", "target": "B4"}, {"weight": 6, "changed_edge": 0.0, "source": "A4", "target": "E4"}, {"weight": 16, "changed_edge": 0.0, "source": "A4", "target": "C#5"}, {"weight": 4, "changed_edge": 0.0, "source": "A4", "target": "E5"}, {"weight": 7, "changed_edge": 0.0, "source": "A4", "target": "A5"}, {"weight": 6, "changed_edge": 0.0, "source": "A4", "target": "D5"}, {"weight": 5, "changed_edge": 0.0, "source": "A4", "target": "F#5"}, {"weight": 2, "changed_edge": 0.0, "source": "A4", "target": "D4"}, {"weight": 2, "changed_edge": 0.0, "source": "A4", "target": "D#4"}, {"weight": 5, "changed_edge": 0.0, "source": "A4", "target": "G#4"}, {"weight": 1, "changed_edge": 0.0, "source": "A4", "target": "G4"}, {"weight": 1, "changed_edge": 0.0, "source": "A4", "target": "C#6"}, {"weight": 3, "changed_edge": 0.0, "source": "A4", "target": "G5"}, {"weight": 1, "changed_edge": 0.0, "source": "A4", "target": "D#5"}, {"weight": 1, "changed_edge": 0.0, "source": "A4", "target": "end"}, {"weight": 26, "changed_edge": 0.0, "source": "B4", "target": "A4"}, {"weight": 21, "changed_edge": 0.0, "source": "B4", "target": "C#5"}, {"weight": 2, "changed_edge": 0.0, "source": "B4", "target": "G#4"}, {"weight": 2, "changed_edge": 0.0, "source": "B4", "target": "G#5"}, {"weight": 7, "changed_edge": 0.0, "source": "B4", "target": "E5"}, {"weight": 1, "changed_edge": 0.0, "source": "B4", "target": "A#4"}, {"weight": 1, "changed_edge": 0.0, "source": "B4", "target": "D5"}, {"weight": 1, "changed_edge": 0.0, "source": "B4", "target": "B5"}, {"weight": 2, "changed_edge": 0.0, "source": "B4", "target": "A5"}, {"weight": 1, "changed_edge": 0.0, "source": "B4", "target": "G5"}, {"weight": 2, "changed_edge": 0.0, "source": "B4", "target": "D#5"}, {"weight": 4, "changed_edge": 0.0, "source": "B4", "target": "E4"}, {"weight": 11, "changed_edge": 0.0, "source": "E4", "target": "A4"}, {"weight": 10, "changed_edge": 0.0, "source": "E4", "target": "G#4"}, {"weight": 1, "changed_edge": 0.0, "source": "E4", "target": "C#6"}, {"weight": 1, "changed_edge": 0.0, "source": "E4", "target": "F#5"}, {"weight": 5, "changed_edge": 0.0, "source": "E4", "target": "D5"}, {"weight": 1, "changed_edge": 0.0, "source": "E4", "target": "G#5"}, {"weight": 3, "changed_edge": 0.0, "source": "E4", "target": "C#5"}, {"weight": 1, "changed_edge": 0.0, "source": "E4", "target": "B4"}, {"weight": 11, "changed_edge": 0.0, "source": "C#5", "target": "A4"}, {"weight": 34, "changed_edge": 0.0, "source": "C#5", "target": "D5"}, {"weight": 15, "changed_edge": 0.0, "source": "C#5", "target": "E5"}, {"weight": 31, "changed_edge": 0.0, "source": "C#5", "target": "B4"}, {"weight": 7, "changed_edge": 0.0, "source": "C#5", "target": "A5"}, {"weight": 1, "changed_edge": 0.0, "source": "C#5", "target": "D4"}, {"weight": 5, "changed_edge": 0.0, "source": "C#5", "target": "F#5"}, {"weight": 1, "changed_edge": 0.0, "source": "C#5", "target": "G4"}, {"weight": 1, "changed_edge": 0.0, "source": "C#5", "target": "G#4"}, {"weight": 2, "changed_edge": 0.0, "source": "C#5", "target": "F#4"}, {"weight": 1, "changed_edge": 0.0, "source": "C#5", "target": "C#5"}, {"weight": 1, "changed_edge": 0.0, "source": "C#5", "target": "E4"}, {"weight": 1, "changed_edge": 0.0, "source": "C#5", "target": "D#5"}, {"weight": 2, "changed_edge": 0.0, "source": "E5", "target": "A4"}, {"weight": 15, "changed_edge": 0.0, "source": "E5", "target": "F#5"}, {"weight": 23, "changed_edge": 0.0, "source": "E5", "target": "C#5"}, {"weight": 2, "changed_edge": 0.0, "source": "E5", "target": "B4"}, {"weight": 11, "changed_edge": 0.0, "source": "E5", "target": "E4"}, {"weight": 2, "changed_edge": 0.0, "source": "E5", "target": "B5"}, {"weight": 5, "changed_edge": 0.0, "source": "E5", "target": "G#4"}, {"weight": 5, "changed_edge": 0.0, "source": "E5", "target": "D5"}, {"weight": 7, "changed_edge": 0.0, "source": "E5", "target": "A5"}, {"weight": 2, "changed_edge": 0.0, "source": "E5", "target": "G#5"}, {"weight": 4, "changed_edge": 0.0, "source": "E5", "target": "E5"}, {"weight": 6, "changed_edge": 0.0, "source": "E5", "target": "F#4"}, {"weight": 8, "changed_edge": 0.0, "source": "E5", "target": "D#5"}, {"weight": 5, "changed_edge": 0.0, "source": "A5", "target": "E5"}, {"weight": 6, "changed_edge": 0.0, "source": "A5", "target": "A4"}, {"weight": 4, "changed_edge": 0.0, "source": "A5", "target": "D5"}, {"weight": 11, "changed_edge": 0.0, "source": "A5", "target": "C#5"}, {"weight": 2, "changed_edge": 0.0, "source": "A5", "target": "F#4"}, {"weight": 7, "changed_edge": 0.0, "source": "A5", "target": "F#5"}, {"weight": 12, "changed_edge": 0.0, "source": "A5", "target": "G#5"}, {"weight": 2, "changed_edge": 0.0, "source": "A5", "target": "A5"}, {"weight": 1, "changed_edge": 0.0, "source": "A5", "target": "G#4"}, {"weight": 1, "changed_edge": 0.0, "source": "A5", "target": "E4"}, {"weight": 1, "changed_edge": 0.0, "source": "A5", "target": "D#4"}, {"weight": 16, "changed_edge": 0.0, "source": "D5", "target": "E5"}, {"weight": 8, "changed_edge": 0.0, "source": "D5", "target": "B4"}, {"weight": 23, "changed_edge": 0.0, "source": "D5", "target": "C#5"}, {"weight": 8, "changed_edge": 0.0, "source": "D5", "target": "F#5"}, {"weight": 7, "changed_edge": 0.0, "source": "D5", "target": "A5"}, {"weight": 2, "changed_edge": 0.0, "source": "D5", "target": "F#4"}, {"weight": 1, "changed_edge": 0.0, "source": "D5", "target": "D4"}, {"weight": 4, "changed_edge": 0.0, "source": "D5", "target": "A4"}, {"weight": 3, "changed_edge": 0.0, "source": "D5", "target": "E4"}, {"weight": 3, "changed_edge": 0.0, "source": "D5", "target": "B5"}, {"weight": 6, "changed_edge": 0.0, "source": "D5", "target": "D5"}, {"weight": 1, "changed_edge": 0.0, "source": "D5", "target": "G#4"}, {"weight": 11, "changed_edge": 0.0, "source": "F#5", "target": "D5"}, {"weight": 3, "changed_edge": 0.0, "source": "F#5", "target": "G#5"}, {"weight": 4, "changed_edge": 0.0, "source": "F#5", "target": "C#5"}, {"weight": 1, "changed_edge": 0.0, "source": "F#5", "target": "B5"}, {"weight": 1, "changed_edge": 0.0, "source": "F#5", "target": "G5"}, {"weight": 10, "changed_edge": 0.0, "source": "F#5", "target": "E5"}, {"weight": 1, "changed_edge": 0.0, "source": "F#5", "target": "D4"}, {"weight": 4, "changed_edge": 0.0, "source": "F#5", "target": "A5"}, {"weight": 1, "changed_edge": 0.0, "source": "F#5", "target": "B4"}, {"weight": 12, "changed_edge": 0.0, "source": "F#5", "target": "D#5"}, {"weight": 2, "changed_edge": 0.0, "source": "F#5", "target": "F#5"}, {"weight": 2, "changed_edge": 0.0, "source": "D4", "target": "C#5"}, {"weight": 3, "changed_edge": 0.0, "source": "D4", "target": "B5"}, {"weight": 2, "changed_edge": 0.0, "source": "D4", "target": "D5"}, {"weight": 3, "changed_edge": 0.0, "source": "D#4", "target": "C#5"}, {"weight": 7, "changed_edge": 0.0, "source": "G#4", "target": "B4"}, {"weight": 6, "changed_edge": 0.0, "source": "G#4", "target": "E5"}, {"weight": 1, "changed_edge": 0.0, "source": "G#4", "target": "A5"}, {"weight": 2, "changed_edge": 0.0, "source": "G#4", "target": "C#5"}, {"weight": 3, "changed_edge": 0.0, "source": "G#4", "target": "D5"}, {"weight": 6, "changed_edge": 0.0, "source": "G#4", "target": "A4"}, {"weight": 1, "changed_edge": 0.0, "source": "G4", "target": "A4"}, {"weight": 1, "changed_edge": 0.0, "source": "G4", "target": "D5"}, {"weight": 1, "changed_edge": 0.0, "source": "G4", "target": "G5"}, {"weight": 1, "changed_edge": 0.0, "source": "C#6", "target": "A4"}, {"weight": 1, "changed_edge": 0.0, "source": "C#6", "target": "D5"}, {"weight": 1, "changed_edge": 0.0, "source": "G5", "target": "F#5"}, {"weight": 1, "changed_edge": 0.0, "source": "G5", "target": "E4"}, {"weight": 3, "changed_edge": 0.0, "source": "G5", "target": "E5"}, {"weight": 1, "changed_edge": 0.0, "source": "G5", "target": "D5"}, {"weight": 1, "changed_edge": 0.0, "source": "G5", "target": "G5"}, {"weight": 1, "changed_edge": 0.0, "source": "G5", "target": "D#5"}, {"weight": 4, "changed_edge": 0.0, "source": "D#5", "target": "F#5"}, {"weight": 6, "changed_edge": 0.0, "source": "D#5", "target": "B4"}, {"weight": 7, "changed_edge": 1, "source": "D#5", "target": "E5"}, {"weight": 2, "changed_edge": 0.0, "source": "D#5", "target": "E4"}, {"weight": 15, "changed_edge": 0.0, "source": "G#5", "target": "A5"}, {"weight": 2, "changed_edge": 0.0, "source": "G#5", "target": "E5"}, {"weight": 2, "changed_edge": 0.0, "source": "G#5", "target": "E4"}, {"weight": 2, "changed_edge": 0.0, "source": "G#5", "target": "A4"}, {"weight": 1, "changed_edge": 0.0, "source": "A#4", "target": "E5"}, {"weight": 2, "changed_edge": 0.0, "source": "B5", "target": "E4"}, {"weight": 1, "changed_edge": 0.0, "source": "B5", "target": "B4"}, {"weight": 1, "changed_edge": 0.0, "source": "B5", "target": "G4"}, {"weight": 1, "changed_edge": 0.0, "source": "B5", "target": "D5"}, {"weight": 1, "changed_edge": 0.0, "source": "B5", "target": "C#5"}, {"weight": 1, "changed_edge": 0.0, "source": "B5", "target": "E5"}, {"weight": 1, "changed_edge": 0.0, "source": "B5", "target": "B5"}, {"weight": 2, "changed_edge": 0.0, "source": "B5", "target": "F#5"}, {"weight": 1, "changed_edge": 0.0, "source": "B5", "target": "D#5"}, {"weight": 1, "changed_edge": 0.0, "source": "F#4", "target": "G#5"}, {"weight": 1, "changed_edge": 0.0, "source": "F#4", "target": "B4"}, {"weight": 1, "changed_edge": 0.0, "source": "F#4", "target": "G5"}, {"weight": 2, "changed_edge": 0.0, "source": "F#4", "target": "D4"}, {"weight": 1, "changed_edge": 0.0, "source": "F#4", "target": "D5"}, {"weight": 1, "changed_edge": 0.0, "source": "F#4", "target": "C#5"}, {"weight": 1, "changed_edge": 0.0, "source": "F#4", "target": "A4"}, {"weight": 4, "changed_edge": 0.0, "source": "F#4", "target": "D#5"}, {"weight": 1, "changed_edge": 0.0, "source": "start", "target": "A4"}]}                                                                                                                                                                                                                                                                                                                                                                                                                      ./e93997d5089d7165@2283.js                                                                          000644  000000  000000  00000133013 13707343542 012401  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         // https://observablehq.com/@jashkenas/inputs@2283
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["capstan.gif",new URL("./files/c051fbc024553912e31968b35e537d4ad3592201b5f8e7bd13fd9d02e38599c5d541a704d0858c676328babb3e5c9c35dd7c6d67240090d094882a1cad8eece4",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md","FileAttachment"], async function(md,FileAttachment){return(
md`# Inputs
<div style="margin-top: -3px; font-size: 1.05em;">*a.k.a “The Grand Native Inputs Bazaar”*</div>

<img width="350px" src="${await FileAttachment("capstan.gif").url()}" />

A collection of assorted fancy inputs, odds and ends — with which to produce values to feed your burgeoning sketches. All inputs support optional **titles** and **descriptions**; where it makes sense, inputs also support a **submit** option, which allows you to prevent the value from updating until the input has been finalized.

Wares we have on offer: 
  * [\`slider\`](#sliderDemo)
  * [\`button\`](#buttonDemo)
  * [\`select\`](#selectDemo)
  * [\`autoSelect\`](#autoSelectDemo)
  * [\`color\`](#colorDemo)
  * [\`coordinates\`](#coordinatesDemo)
  * [\`worldMapCoordinates\`](#worldMapCoordinatesDemo)
  * [\`usaMapCoordinates\`](#usaMapCoordinatesDemo)
  * [\`date\`](#dateDemo)
  * [\`time\`](#timeDemo)
  * [\`file\`](#fileDemo)
  * [\`text\`](#textDemo)
  * [\`textarea\`](#textareaDemo)
  * [\`radio\`](#radioDemo)
  * [\`checkbox\`](#checkboxDemo)
  * [\`number\`](#numberDemo)
  * [\`password\`](#passwordDemo)`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`| <h3>Friends & Family:</h3>  |   |
|---|---|
| **[@mbostock/form-input](/@mbostock/form-input)**  | Fully custom forms, combining inputs into a single reactive cell. |
| **[@mbostock/scrubber](/@mbostock/scrubber)** | A slider that automatically plays through its range, useful for driving and scrubbing through animations. |
| **[@bumbeishvili/input-groups](/@bumbeishvili/input-groups)** | A wrapper function that can put many of these inputs into a more compact grid layout. | 
| **[@zechasault/color-schemes-and-interpolators-picker](/@zechasault/color-schemes-and-interpolators-picker)**  | Color scheme and interoplation pickers. |
| **[@awhitty/fips-county-code-brush](/@awhitty/fips-county-code-brush)**  | A brushable map of the United States, allowing you to quickly select sets of counties to get their FIPS codes. |
| **[@mootari/range-slider](https://observablehq.com/@mootari/range-slider)**  |  True range sliders, setting both a minimum and maximum value. |
| **[@bumbeishvili/data-driven-range-sliders](/@bumbeishvili/data-driven-range-sliders)** | Data-driven range sliders, displaying a distribution histogram of the underlying data. |
| **[@trebor/snapping-histogram-slider](/@trebor/snapping-histogram-slider)** | Another data-driven range slider option. |
| **[@mootari’s 2D Slider](https://observablehq.com/d/98bbb19bf9e859ee)** | Two dimensional sliders, exploring discrete points on a plane. |
| **[@yurivish/ternary-slider](/@yurivish/ternary-slider)** | Nifty ternary plot inputs, describing the percentages of a whole composed of exactly three things. |
| **[@rreusser/binary-input](/@rreusser/binary-input)** | Input numbers in binary, great for working with values where results vary with specific bit positions. |
| **[@bartok32/diy-inputs](/@bartok32/diy-inputs)** | A fun tool for defining your own fancy and colorful inputs. |
| **[@bobkerns/elements-input](/@bobkerns/elements-input)** | A periodic table of the elements input! You can construct molecules programmatically, or click on the table to create formulas. |
| **[@fil/selectflat](/@fil/selectflat)** | A fast selector to explore a discrete parameter space. The value changes on mouseover, and sticks when you click. |
| **[@oscar6echo/player](/@oscar6echo/player)** | A slider with buttons to play, pause, step, and change speed and direction — useful for animations. |
| **[@harrislapiroff/list-input](/@harrislapiroff/list-input)** | A input for when you want more than one of something. |

<br>*If you have any improvements for the bazaar, [please make your change in a fork and send it to me as a suggestion.](https://observablehq.com/@observablehq/suggestions-and-comments)*`
)});
  main.variable(observer("sliderDemo")).define("sliderDemo", ["md"], function(md){return(
md`---
## Sliders

~~~js
import {slider} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof a")).define("viewof a", ["slider"], function(slider){return(
slider()
)});
  main.variable(observer("a")).define("a", ["Generators", "viewof a"], (G, _) => G.input(_));
  main.variable(observer("viewof a1")).define("viewof a1", ["slider"], function(slider){return(
slider({
  min: 0, 
  max: 1, 
  step: 0.01, 
  format: ".0%",
  description: "Zero to one, formatted as a percentage"
})
)});
  main.variable(observer("a1")).define("a1", ["Generators", "viewof a1"], (G, _) => G.input(_));
  main.variable(observer("viewof a1_1")).define("viewof a1_1", ["slider"], function(slider){return(
slider({
  min: 0, 
  max: 1, 
  step: 0.01, 
  format: v => `${Math.round(100 * v)} per cent`,
  description: "Zero to one, formatted with a custom function"
})
)});
  main.variable(observer("a1_1")).define("a1_1", ["Generators", "viewof a1_1"], (G, _) => G.input(_));
  main.variable(observer("viewof a2")).define("viewof a2", ["slider"], function(slider){return(
slider({
  min: 0,
  max: 1e9,
  step: 1000,
  value: 3250000,
  format: ",",
  description:
    "Zero to one billion, in steps of one thousand, formatted as a (US) number"
})
)});
  main.variable(observer("a2")).define("a2", ["Generators", "viewof a2"], (G, _) => G.input(_));
  main.variable(observer("viewof a3")).define("viewof a3", ["slider"], function(slider){return(
slider({
  min: 0, 
  max: 100, 
  step: 1, 
  value: 10, 
  title: "Integers", 
  description: "Integers from zero through 100"
})
)});
  main.variable(observer("a3")).define("a3", ["Generators", "viewof a3"], (G, _) => G.input(_));
  main.variable(observer("viewof a4")).define("viewof a4", ["slider"], function(slider){return(
slider({
  min: 0.9,
  max: 1.1,
  precision: 3,
  description: "A high precision slider example"
})
)});
  main.variable(observer("a4")).define("a4", ["Generators", "viewof a4"], (G, _) => G.input(_));
  main.variable(observer("viewof a5")).define("viewof a5", ["slider"], function(slider){return(
slider({
  min: 0.9,
  max: 1.1,
  precision: 3,
  submit: true,
  description: "The same as a4, but only changes value on submit"
})
)});
  main.variable(observer("a5")).define("a5", ["Generators", "viewof a5"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`More [fancy slider techniques](https://beta.observablehq.com/@mootari/prime-numbers-slider).`
)});
  main.variable(observer("slider")).define("slider", ["input"], function(input){return(
function slider(config = {}) {
  let {
    min = 0,
    max = 1,
    value = (max + min) / 2,
    step = "any",
    precision = 2,
    title,
    description,
    disabled,
    getValue,
    format,
    display,
    submit
  } = typeof config === "number" ? { value: config } : config;
  precision = Math.pow(10, precision);
  if (!getValue)
    getValue = input => Math.round(input.valueAsNumber * precision) / precision;
  return input({
    type: "range",
    title,
    description,
    submit,
    format,
    display,
    attributes: { min, max, step, disabled, value },
    getValue
  });
}
)});
  main.variable(observer("buttonDemo")).define("buttonDemo", ["md"], function(md){return(
md`---
## Buttons

~~~js
import {button} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof b")).define("viewof b", ["button"], function(button){return(
button()
)});
  main.variable(observer("b")).define("b", ["Generators", "viewof b"], (G, _) => G.input(_));
  main.variable(observer()).define(["b"], function(b)
{
  b
  return !this;
}
);
  main.variable(observer("viewof b1")).define("viewof b1", ["button"], function(button){return(
button({value: "Click me", description: "We use a reference to the button below to record the time you pressed it."})
)});
  main.variable(observer("b1")).define("b1", ["Generators", "viewof b1"], (G, _) => G.input(_));
  main.variable(observer()).define(["b1"], function(b1)
{
  b1;
  return new Date(Date.now()).toUTCString()
}
);
  main.variable(observer("button")).define("button", ["input"], function(input){return(
function button(config = {}) {
  const {
    value = "Ok", title, description, disabled
  } = typeof config === "string" ? {value: config} : config;
  const form = input({
    type: "button", title, description,
    attributes: {disabled, value}
  });
  form.output.remove();
  return form;
}
)});
  main.variable(observer("selectDemo")).define("selectDemo", ["md"], function(md){return(
md`---
## Dropdown Menus and Multiselects

~~~js
import {select} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof dd")).define("viewof dd", ["select"], function(select){return(
select(["Spring", "Summer", "Fall", "Winter"])
)});
  main.variable(observer("dd")).define("dd", ["Generators", "viewof dd"], (G, _) => G.input(_));
  main.variable(observer()).define(["dd"], function(dd){return(
dd
)});
  main.variable(observer("viewof dd1")).define("viewof dd1", ["select"], function(select){return(
select({
  title: "Stooges",
  description: "Please pick your favorite stooge.",
  options: ["Curly", "Larry", "Moe", "Shemp"],
  value: "Moe"
})
)});
  main.variable(observer("dd1")).define("dd1", ["Generators", "viewof dd1"], (G, _) => G.input(_));
  main.variable(observer()).define(["dd1"], function(dd1){return(
dd1
)});
  main.variable(observer("viewof dd2")).define("viewof dd2", ["select"], function(select){return(
select({
  description: "As a child, which vegetables did you refuse to eat?",
  options: ["Spinach", "Broccoli", "Brussels Sprouts", "Cauliflower", "Kale", "Turnips", "Green Beans", "Asparagus"],
  multiple: true
})
)});
  main.variable(observer("dd2")).define("dd2", ["Generators", "viewof dd2"], (G, _) => G.input(_));
  main.variable(observer()).define(["dd2"], function(dd2){return(
dd2
)});
  main.variable(observer("viewof dd3")).define("viewof dd3", ["select"], function(select)
{
  const dd3 = select({
    title: "How are you feeling today?",
    options: [
      { label: "🤷", value: "shrug" },
      { label: "😂", value: "tears-of-joy" },
      { label: "😍", value: "loving-it" },
      { label: "🤔", value: "hmmm" },
      { label: "😱", value: "yikes", disabled: true },
      { label: "😈", value: "mischievous" },
      { label: "💩", value: "poo" }
    ],
    value: "hmmm"
  });
  dd3.input.style.fontSize = "30px";
  dd3.input.style.marginTop = "8px";
  return dd3;
}
);
  main.variable(observer("dd3")).define("dd3", ["Generators", "viewof dd3"], (G, _) => G.input(_));
  main.variable(observer()).define(["dd3"], function(dd3){return(
dd3
)});
  main.variable(observer("select")).define("select", ["input","html"], function(input,html){return(
function select(config = {}) {
  let {
    value: formValue,
    title,
    description,
    disabled,
    submit,
    multiple,
    size,
    options
  } = Array.isArray(config) ? { options: config } : config;
  options = options.map(o =>
    typeof o === "object" ? o : { value: o, label: o }
  );
  const form = input({
    type: "select",
    title,
    description,
    submit,
    attributes: { disabled },
    getValue: input => {
      const selected = Array.prototype.filter
        .call(input.options, i => i.selected)
        .map(i => i.value);
      return multiple ? selected : selected[0];
    },
    form: html`
      <form>
        <select name="input" ${
          multiple ? `multiple size="${size || options.length}"` : ""
        }>
          ${options.map(({ value, label,disabled }) =>
            Object.assign(html`<option>`, {
              value,
              selected: Array.isArray(formValue)
                ? formValue.includes(value)
                : formValue === value,
              disabled : disabled ? disabled : false,
              textContent: label
            })
          )}
        </select>
      </form>
    `
  });
  form.output.remove();
  return form;
}
)});
  main.variable(observer("autoSelectDemo")).define("autoSelectDemo", ["md"], function(md){return(
md`---
## Autoselects
*A variant of an option menu, using an autocompleting text input, via HTML’s datalist element.* 

~~~js
import {autoSelect} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof as")).define("viewof as", ["autoSelect","usa"], function(autoSelect,usa){return(
autoSelect({
  options: usa.objects.states.geometries.map(d => d.properties.name),
  placeholder: "Search for a US state . . ."
})
)});
  main.variable(observer("as")).define("as", ["Generators", "viewof as"], (G, _) => G.input(_));
  main.variable(observer()).define(["as"], function(as){return(
as
)});
  main.variable(observer("autoSelect")).define("autoSelect", ["input","html"], function(input,html){return(
function autoSelect(config = {}) {
  const {
    value,
    title,
    description,
    disabled,
    autocomplete = "off",
    placeholder,
    size,
    options,
    list = "options"
  } = Array.isArray(config) ? { options: config } : config;

  const optionsSet = new Set(options);

  const form = input({
    type: "text",
    title,
    description,
    attributes: { disabled },
    action: fm => {
      fm.value = fm.input.value = value || "";
      fm.onsubmit = e => e.preventDefault();
      fm.input.oninput = function(e) {
        e.stopPropagation();
        fm.value = fm.input.value;
        if (!fm.value || optionsSet.has(fm.value))
          fm.dispatchEvent(new CustomEvent("input"));
      };
    },
    form: html`
      <form>
         <input name="input" type="text" autocomplete="off" 
          placeholder="${placeholder ||
            ""}" style="font-size: 1em;" list=${list}>
          <datalist id="${list}">
              ${options.map(d =>
                Object.assign(html`<option>`, {
                  value: d
                })
              )}
          </datalist>
      </form>
      `
  });

  form.output.remove();
  return form;
}
)});
  main.variable(observer("colorDemo")).define("colorDemo", ["md"], function(md){return(
md`---
## Color Pickers

*value: a hexadecimal string, e.g. * \`"#bada55"\` 

~~~js
import {color} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof c")).define("viewof c", ["color"], function(color){return(
color()
)});
  main.variable(observer("c")).define("c", ["Generators", "viewof c"], (G, _) => G.input(_));
  main.variable(observer("viewof c1")).define("viewof c1", ["color"], function(color){return(
color({
  value: "#0000ff",
  title: "Background Color",
  description: "This color picker starts out blue"
})
)});
  main.variable(observer("c1")).define("c1", ["Generators", "viewof c1"], (G, _) => G.input(_));
  main.variable(observer("color")).define("color", ["input"], function(input){return(
function color(config = {}) {
  const { value = "#000000", title, description, disabled, submit, display } =
    typeof config === "string" ? { value: config } : config;
  const form = input({
    type: "color",
    title,
    description,
    submit,
    display,
    attributes: { disabled, value }
  });
  // The following two lines are a bugfix for Safari, which hopefully can be removed in the future.
  form.input.value = '';
  form.input.value = value;
  if (title || description) form.input.style.margin = "5px 0";
  return form;
}
)});
  main.variable(observer("coordinatesDemo")).define("coordinatesDemo", ["md"], function(md){return(
md` ---
## Coordinates

*value: an array pair of \`[longitude, latitude]\`, e.g. * \`[-122.27, 37.87]\` 

~~~js
import {coordinates} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof coords1")).define("viewof coords1", ["coordinates"], function(coordinates){return(
coordinates()
)});
  main.variable(observer("coords1")).define("coords1", ["Generators", "viewof coords1"], (G, _) => G.input(_));
  main.variable(observer()).define(["coords1"], function(coords1){return(
coords1
)});
  main.variable(observer("viewof coords2")).define("viewof coords2", ["coordinates"], function(coordinates){return(
coordinates({
  title: "Hometown",
  description: "Enter the coordinates of where you were born",
  value: [-122.27, 37.87],
  submit: true
})
)});
  main.variable(observer("coords2")).define("coords2", ["Generators", "viewof coords2"], (G, _) => G.input(_));
  main.variable(observer()).define(["coords2"], function(coords2){return(
coords2
)});
  main.variable(observer("coordinates")).define("coordinates", ["html","input"], function(html,input){return(
function coordinates(config = {}) {
  const { value = [], title, description, submit } = Array.isArray(config)
    ? { value: config }
    : config;
  let [lon, lat] = value;
  lon = lon != null ? lon : "";
  lat = lat != null ? lat : "";
  const lonEl = html`<input name="input" type="number" autocomplete="off" min="-180" max="180" style="width: 80px;" step="any" value="${lon}" />`;
  const latEl = html`<input name="input" type="number" autocomplete="off" min="-90" max="90" style="width: 80px;" step="any" value="${lat}" />`;
  const form = input({
    type: "coordinates",
    title,
    description,
    submit,
    getValue: () => {
      const lon = lonEl.valueAsNumber;
      const lat = latEl.valueAsNumber;
      return [isNaN(lon) ? null : lon, isNaN(lat) ? null : lat];
    },
    form: html`
      <form>
        <label style="display: inline-block; font: 600 0.8rem sans-serif; margin: 6px 0 3px;">
          <span style="display: inline-block; width: 70px;">Longitude:</span>
          ${lonEl}
        </label>
        <br>
        <label style="display: inline-block; font: 600 0.8rem sans-serif; margin: 0 0 6px;">
          <span style="display: inline-block; width: 70px;">Latitude:</span>
          ${latEl}
        </label>
      </form>
    `
  });
  form.output.remove();
  return form;
}
)});
  main.variable(observer("worldMapCoordinatesDemo")).define("worldMapCoordinatesDemo", ["md"], function(md){return(
md` ---
## World Map Coordinates

*value: an array pair of \`[longitude, latitude]\`, e.g. * \`[-122.27, 37.87]\` 

~~~js
import {worldMapCoordinates} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof worldMap1")).define("viewof worldMap1", ["worldMapCoordinates"], function(worldMapCoordinates){return(
worldMapCoordinates([-122.27, 37.87])
)});
  main.variable(observer("worldMap1")).define("worldMap1", ["Generators", "viewof worldMap1"], (G, _) => G.input(_));
  main.variable(observer()).define(["worldMap1"], function(worldMap1){return(
worldMap1
)});
  main.variable(observer("worldMapCoordinates")).define("worldMapCoordinates", ["html","DOM","d3geo","graticule","land","countries","input"], function(html,DOM,d3geo,graticule,land,countries,input){return(
function worldMapCoordinates(config = {}) {
  const {
    value = [], title, description, width = 400
  } = Array.isArray(config) ? {value: config} : config;
  const height = Math.round((210 / 400) * width);
  let [lon, lat] = value;
  lon = lon != null ? lon : null;
  lat = lat != null ? lat : null;
  const formEl = html`<form style="width: ${width}px;"></form>`;
  const context = DOM.context2d(width, height);
  const canvas = context.canvas;
  canvas.style.margin = "10px 0 3px";
  const projection = d3geo
    .geoNaturalEarth1()
    .precision(0.1)
    .fitSize([width, height], { type: "Sphere" });
  const path = d3geo.geoPath(projection, context).pointRadius(2.5);
  formEl.append(canvas);

  function draw() {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.beginPath();
    path(graticule);
    context.lineWidth = 0.35;
    context.strokeStyle = `#ddd`;
    context.stroke();
    context.beginPath();
    path(land);
    context.fillStyle = `#f4f4f4`;
    context.fill();
    context.beginPath();
    path(countries);
    context.strokeStyle = `#aaa`;
    context.stroke();
    if (lon != null && lat != null) {
      const pointPath = { type: "MultiPoint", coordinates: [[lon, lat]] };
      context.beginPath();
      path(pointPath);
      context.fillStyle = `#f00`;
      context.fill();
    }
  }

  canvas.onclick = function(ev) {
    const { offsetX, offsetY } = ev;
    var coords = projection.invert([offsetX, offsetY]);
    lon = +coords[0].toFixed(2);
    lat = +coords[1].toFixed(2);
    draw();
    canvas.dispatchEvent(new CustomEvent("input", { bubbles: true }));
  };

  draw();

  const form = input({
    type: "worldMapCoordinates",
    title,
    description,
    display: v =>
      html`<div style="width: ${width}px; white-space: nowrap; color: #444; text-align: center; font: 13px sans-serif; margin-bottom: 5px;">
            <span style="color: #777;">Longitude:</span> ${lon != null ? lon.toFixed(2) : ""}
            &nbsp; &nbsp; 
            <span style="color: #777;">Latitude:</span> ${lat != null ? lat.toFixed(2) : ""} 
          </div>`,
    getValue: () => [lon != null ? lon : null, lat != null ? lat : null],
    form: formEl
  });
  return form;
}
)});
  main.variable(observer("usaMapCoordinatesDemo")).define("usaMapCoordinatesDemo", ["md"], function(md){return(
md` ---
## U.S.A. Map Coordinates

*value: an array pair of \`[longitude, latitude]\`, e.g. * \`[-122.27, 37.87]\` 

~~~js
import {usaMapCoordinates} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof usaMap1")).define("viewof usaMap1", ["usaMapCoordinates"], function(usaMapCoordinates){return(
usaMapCoordinates([-122.27, 37.87])
)});
  main.variable(observer("usaMap1")).define("usaMap1", ["Generators", "viewof usaMap1"], (G, _) => G.input(_));
  main.variable(observer()).define(["usaMap1"], function(usaMap1){return(
usaMap1
)});
  main.variable(observer("viewof usaMap2")).define("viewof usaMap2", ["usaMapCoordinates"], function(usaMapCoordinates){return(
usaMapCoordinates({
  title: "A Mini Map",
  description: "Defaults to New York City",
  width: 200,
  value: [-74, 40.71]
})
)});
  main.variable(observer("usaMap2")).define("usaMap2", ["Generators", "viewof usaMap2"], (G, _) => G.input(_));
  main.variable(observer()).define(["usaMap2"], function(usaMap2){return(
usaMap2
)});
  main.variable(observer("usaMapCoordinates")).define("usaMapCoordinates", ["html","DOM","d3geo","nation","states","input"], function(html,DOM,d3geo,nation,states,input){return(
function usaMapCoordinates(config = {}) {
  const {
    value = [], title, description, width = 400
  } = Array.isArray(config) ? {value: config} : config;
  const scale = width / 960;
  const height = scale * 600;
  let [lon, lat] = value;
  lon = lon != null ? lon : null;
  lat = lat != null ? lat : null;
  const formEl = html`<form style="width: ${width}px;"></form>`;
  const context = DOM.context2d(width, height);
  const canvas = context.canvas;
  canvas.style.margin = "5px 0 20px";
  const projection = d3geo
    .geoAlbersUsa()
    .scale(1280)
    .translate([480, 300]);
  const path = d3geo
    .geoPath()
    .context(context)
    .pointRadius(2.5 / scale);
  formEl.append(canvas);

  function draw() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.scale(scale, scale);
    context.lineWidth = 0.35 / scale;
    context.beginPath();
    path(nation);
    context.fillStyle = `#f4f4f4`;
    context.fill();
    context.beginPath();
    path(states);
    context.strokeStyle = `#aaa`;
    context.stroke();
    if (lon != null && lat != null) {
      const pointPath = {
        type: "MultiPoint",
        coordinates: [projection([lon, lat])]
      };
      context.beginPath();
      path(pointPath);
      context.fillStyle = `#f00`;
      context.fill();
    }
    context.restore();
  }

  canvas.onclick = function(ev) {
    const { offsetX, offsetY } = ev;
    var coords = projection.invert([offsetX / scale, offsetY / scale]);
    lon = +coords[0].toFixed(2);
    lat = +coords[1].toFixed(2);
    draw();
    canvas.dispatchEvent(new CustomEvent("input", { bubbles: true }));
  };

  draw();

  const form = input({
    type: "worldMapCoordinates",
    title,
    description,
    display: v =>
      html`<div style="position: absolute; width: ${width}px; white-space: nowrap; color: #444; text-align: center; font: 13px sans-serif; margin-top: -18px;">
            <span style="color: #777;">Longitude:</span> ${lon != null ? lon : ""}
            &nbsp; &nbsp; 
            <span style="color: #777;">Latitude:</span> ${lat != null ? lat : ""} 
          </div>`,
    getValue: () => [lon != null ? lon : null, lat != null ? lat : null],
    form: formEl
  });
  return form;
}
)});
  main.variable(observer("dateDemo")).define("dateDemo", ["md"], function(md){return(
md` ---
## Dates

*value: a YYYY-MM-DD formatted string: * \`"2016-11-08"\` 

~~~js
import {date} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof d")).define("viewof d", ["date"], function(date){return(
date()
)});
  main.variable(observer("d")).define("d", ["Generators", "viewof d"], (G, _) => G.input(_));
  main.variable(observer("viewof d1")).define("viewof d1", ["date"], function(date){return(
date({
  title: "2017", 
  min: "2017-01-01",
  max: "2017-12-31",
  value: "2017-01-01",
  description: "Only dates within the 2017 calendar year are allowed"
})
)});
  main.variable(observer("d1")).define("d1", ["Generators", "viewof d1"], (G, _) => G.input(_));
  main.variable(observer("date")).define("date", ["input"], function(input){return(
function date(config = {}) {
  const { min, max, value, title, description, disabled, display } =
    typeof config === "string" ? { value: config } : config;
  return input({
    type: "date",
    title,
    description,
    display,
    attributes: { min, max, disabled, value }
  });
}
)});
  main.variable(observer("timeDemo")).define("timeDemo", ["md"], function(md){return(
md` ---
## Times

*value: a HH:MM:SS formatted string: * \`"09:30:45"\`
<br>*(Time values are always in 24-hour format)*

~~~js
import {time} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof t")).define("viewof t", ["time"], function(time){return(
time()
)});
  main.variable(observer("t")).define("t", ["Generators", "viewof t"], (G, _) => G.input(_));
  main.variable(observer()).define(["t"], function(t){return(
t
)});
  main.variable(observer("viewof t1")).define("viewof t1", ["time"], function(time){return(
time({
  title: "Afternoon",
  min: "12:00:00",
  max: "23:59:59",
  value: "13:00:00",
  step: 1,
  description: "Only times after noon are allowed, and seconds are included"
})
)});
  main.variable(observer("t1")).define("t1", ["Generators", "viewof t1"], (G, _) => G.input(_));
  main.variable(observer()).define(["t1"], function(t1){return(
t1
)});
  main.variable(observer("time")).define("time", ["input"], function(input){return(
function time(config = {}) {
  const { min, max, step, value, title, description, disabled, display } =
    typeof config === "string" ? { value: config } : config;
  const el = input({
    type: "time",
    title,
    description,
    display,
    getValue: d => (d.value ? d.value : undefined),
    attributes: { min, max, step, disabled, value }
  });
  el.output.remove();
  return el;
}
)});
  main.variable(observer("fileDemo")).define("fileDemo", ["md"], function(md){return(
md`---
## File Upload
*Use the JavaScript [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) to work with uploaded file contents.*

\`import {file} from "@jashkenas/inputs"\``
)});
  main.variable(observer("viewof e")).define("viewof e", ["file"], function(file){return(
file()
)});
  main.variable(observer("e")).define("e", ["Generators", "viewof e"], (G, _) => G.input(_));
  main.variable(observer("viewof e1")).define("viewof e1", ["file"], function(file){return(
file({
  title: "Photographs",
  description: "Only .jpg files are allowed in this example. Choose some images, and they’ll appear in the cell below.",
  accept: ".jpg",
  multiple: true,
})
)});
  main.variable(observer("e1")).define("e1", ["Generators", "viewof e1"], (G, _) => G.input(_));
  main.variable(observer()).define(["html","e1","Files"], async function(html,e1,Files)
{
  const div = html`<div>`;
  for (var j = 0; j < e1.length; j++) {
    let file = e1[j];
    let img = html`<img height="125px" style="margin: 2px;" />`;
    img.src = await Files.url(e1[j]);
    div.append(img);
  }
  return div;
}
);
  main.variable(observer("file")).define("file", ["input"], function(input){return(
function file(config = {}) {
  const { multiple, accept, title, description, disabled } = config;
  const form = input({
    type: "file",
    title,
    description,
    attributes: { multiple, accept, disabled },
    action: form => {
      form.input.onchange = () => {
        form.value = multiple ? form.input.files : form.input.files[0];
        form.dispatchEvent(new CustomEvent("input"));
      };
    }
  });
  form.output.remove();
  form.input.onchange();
  return form;
}
)});
  main.variable(observer("textDemo")).define("textDemo", ["md"], function(md){return(
md`---
## Text Inputs

~~~js
import {text} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof f")).define("viewof f", ["text"], function(text){return(
text()
)});
  main.variable(observer("f")).define("f", ["Generators", "viewof f"], (G, _) => G.input(_));
  main.variable(observer("viewof f1")).define("viewof f1", ["text"], function(text){return(
text({title: "A Text Input", placeholder: "Placeholder text", description: "Note that text inputs don’t show output on the right"})
)});
  main.variable(observer("f1")).define("f1", ["Generators", "viewof f1"], (G, _) => G.input(_));
  main.variable(observer()).define(["f1"], function(f1){return(
f1
)});
  main.variable(observer("viewof f2")).define("viewof f2", ["text"], function(text){return(
text({placeholder: "Placeholder text", description: "This input only changes value on submit", submit: "Go"})
)});
  main.variable(observer("f2")).define("f2", ["Generators", "viewof f2"], (G, _) => G.input(_));
  main.variable(observer()).define(["f2"], function(f2){return(
f2
)});
  main.variable(observer("text")).define("text", ["input"], function(input){return(
function text(config = {}) {
  const {
    value,
    title,
    description,
    disabled,
    autocomplete = "off",
    maxlength,
    minlength,
    pattern,
    placeholder,
    size,
    submit,
    getValue
  } = typeof config === "string" ? { value: config } : config;
  const form = input({
    type: "text",
    title,
    description,
    submit,
    getValue,
    attributes: {
      value,
      autocomplete,
      maxlength,
      minlength,
      pattern,
      placeholder,
      size,
      disabled
    }
  });
  form.output.remove();
  form.input.style.fontSize = "1em";
  return form;
}
)});
  main.variable(observer("textareaDemo")).define("textareaDemo", ["md"], function(md){return(
md`---
## Textareas

~~~js
import {textarea} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof g")).define("viewof g", ["textarea"], function(textarea){return(
textarea()
)});
  main.variable(observer("g")).define("g", ["Generators", "viewof g"], (G, _) => G.input(_));
  main.variable(observer()).define(["g"], function(g){return(
g
)});
  main.variable(observer("viewof g1")).define("viewof g1", ["textarea"], function(textarea){return(
textarea({
  title: "Your Great American Novel", 
  placeholder: "Insert story here...", 
  spellcheck: true,
  width: "100%",
  rows: 10,
  submit: "Publish"
})
)});
  main.variable(observer("g1")).define("g1", ["Generators", "viewof g1"], (G, _) => G.input(_));
  main.variable(observer()).define(["g1"], function(g1){return(
g1
)});
  main.variable(observer("textarea")).define("textarea", ["input","html"], function(input,html){return(
function textarea(config = {}) {
  const {
    value = "",
    title,
    description,
    autocomplete,
    cols = 45,
    rows = 3,
    width,
    height,
    maxlength,
    placeholder,
    spellcheck,
    wrap,
    submit,
    disabled,
    getValue
  } = typeof config === "string" ? { value: config } : config;
  const form = input({
    form: html`<form><textarea style="display: block; font-size: 0.8em;" name=input>${value}</textarea></form>`,
    title,
    description,
    submit,
    getValue,
    attributes: {
      autocomplete,
      cols,
      rows,
      maxlength,
      placeholder,
      spellcheck,
      wrap,
      disabled
    }
  });
  form.output.remove();
  if (width != null) form.input.style.width = width;
  if (height != null) form.input.style.height = height;
  if (submit) form.submit.style.margin = "0";
  if (title || description) form.input.style.margin = "3px 0";
  return form;
}
)});
  main.variable(observer("radioDemo")).define("radioDemo", ["md"], function(md){return(
md`---
## Radio Buttons

~~~js
import {radio} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof r")).define("viewof r", ["radio"], function(radio){return(
radio(["Lust", "Gluttony", "Greed", "Sloth", "Wrath", "Envy", "Pride"])
)});
  main.variable(observer("r")).define("r", ["Generators", "viewof r"], (G, _) => G.input(_));
  main.variable(observer()).define(["r"], function(r){return(
r
)});
  main.variable(observer("viewof r1")).define("viewof r1", ["radio"], function(radio){return(
radio({
  title: 'Contact Us',
  description: 'Please select your preferred contact method',
  options: [
    { label: 'By Email', value: 'email' },
    { label: 'By Phone', value: 'phone' },
    { label: 'By Pager', value: 'pager' },
  ],
  value: 'pager'
})
)});
  main.variable(observer("r1")).define("r1", ["Generators", "viewof r1"], (G, _) => G.input(_));
  main.variable(observer()).define(["r1"], function(r1){return(
r1
)});
  main.variable(observer("radio")).define("radio", ["input","html"], function(input,html){return(
function radio(config = {}) {
  let {
    value: formValue,
    title,
    description,
    submit,
    options,
    disabled
  } = Array.isArray(config) ? { options: config } : config;
  options = options.map(o =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const form = input({
    type: "radio",
    title,
    description,
    submit,
    getValue: input => {
      if (input.checked) return input.value;
      const checked = Array.prototype.find.call(input, radio => radio.checked);
      return checked ? checked.value : undefined;
    },
    form: html`
      <form>
        ${options.map(({ value, label }, i) => {
          const input = html`<input type=radio name=input ${
            value === formValue ? "checked" : ""
          } style="vertical-align: top; ${
            i === 0 ? `margin-left: 1px;` : ``
          }" />`;
          input.setAttribute("value", value);
          if (disabled) input.setAttribute("value", disabled);
          const tag = html`
          <label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
          return tag;
        })}
      </form>
    `
  });
  form.output.remove();
  return form;
}
)});
  main.variable(observer("checkboxDemo")).define("checkboxDemo", ["md"], function(md){return(
md`---
## Checkboxes

~~~js
import {checkbox} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof ch")).define("viewof ch", ["checkbox"], function(checkbox){return(
checkbox(["Lust", "Gluttony", "Greed", "Sloth", "Wrath", "Envy", "Pride"])
)});
  main.variable(observer("ch")).define("ch", ["Generators", "viewof ch"], (G, _) => G.input(_));
  main.variable(observer()).define(["ch"], function(ch){return(
ch
)});
  main.variable(observer("viewof ch1")).define("viewof ch1", ["checkbox"], function(checkbox){return(
checkbox({
  title: "Colors",
  description: "Please select your favorite colors",
  options: [
    { value: "r", label: "Red" },
    { value: "o", label: "Orange" },
    { value: "y", label: "Yellow" },
    { value: "g", label: "Green" },
    { value: "b", label: "Blue" },
    { value: "i", label: "Indigo" },
    { value: "v", label: "Violet" }
  ],
  value: ["r", "g", "b"],
  submit: true
})
)});
  main.variable(observer("ch1")).define("ch1", ["Generators", "viewof ch1"], (G, _) => G.input(_));
  main.variable(observer()).define(["ch1"], function(ch1){return(
ch1
)});
  main.variable(observer("viewof ch3")).define("viewof ch3", ["checkbox"], function(checkbox){return(
checkbox({
  description: "Just a single checkbox to toggle",
  options: [{ value: "toggle", label: "On" }],
  value: "toggle"
})
)});
  main.variable(observer("ch3")).define("ch3", ["Generators", "viewof ch3"], (G, _) => G.input(_));
  main.variable(observer()).define(["ch3"], function(ch3){return(
ch3
)});
  main.variable(observer("checkbox")).define("checkbox", ["input","html"], function(input,html){return(
function checkbox(config = {}) {
  let {
    value: formValue,
    title,
    description,
    submit,
    disabled,
    options
  } = Array.isArray(config) ? { options: config } : config;
  options = options.map(o =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const form = input({
    type: "checkbox",
    title,
    description,
    submit,
    getValue: input => {
      if (input.length)
        return Array.prototype.filter
          .call(input, i => i.checked)
          .map(i => i.value);
      return input.checked ? input.value : false;
    },
    form: html`
      <form>
        ${options.map(({ value, label }, i) => {
          const input = html`<input type=checkbox name=input ${
            (formValue || []).indexOf(value) > -1 ? "checked" : ""
          } style="vertical-align: top; ${
            i === 0 ? `margin-left: 1px;` : ``
          }" />`;
          input.setAttribute("value", value);
          if (disabled) input.setAttribute("disabled", disabled);
          const tag = html`<label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
          return tag;
        })}
      </form>
    `
  });
  form.output.remove();
  return form;
}
)});
  main.variable(observer("numberDemo")).define("numberDemo", ["md"], function(md){return(
md`---
## Numbers

~~~js
import {number} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof h")).define("viewof h", ["number"], function(number){return(
number()
)});
  main.variable(observer("h")).define("h", ["Generators", "viewof h"], (G, _) => G.input(_));
  main.variable(observer()).define(["h"], function(h){return(
h
)});
  main.variable(observer("viewof h1")).define("viewof h1", ["number"], function(number){return(
number({placeholder: "13+", title: "Your Age", submit: true})
)});
  main.variable(observer("h1")).define("h1", ["Generators", "viewof h1"], (G, _) => G.input(_));
  main.variable(observer()).define(["h1"], function(h1){return(
h1
)});
  main.variable(observer("number")).define("number", ["input"], function(input){return(
function number(config = {}) {
  const {
    value,
    title,
    description,
    disabled,
    placeholder,
    submit,
    step = "any",
    min,
    max
  } =
    typeof config === "number" || typeof config === "string"
      ? { value: +config }
      : config;
  const form = input({
    type: "number",
    title,
    description,
    submit,
    attributes: {
      value,
      placeholder,
      step,
      min,
      max,
      autocomplete: "off",
      disabled
    },
    getValue: input => input.valueAsNumber
  });
  form.output.remove();
  form.input.style.width = "auto";
  form.input.style.fontSize = "1em";
  return form;
}
)});
  main.variable(observer("passwordDemo")).define("passwordDemo", ["md"], function(md){return(
md`---
## Passwords

~~~js
import {password} from "@jashkenas/inputs"
~~~`
)});
  main.variable(observer("viewof i")).define("viewof i", ["password"], function(password){return(
password({value: "password"})
)});
  main.variable(observer("i")).define("i", ["Generators", "viewof i"], (G, _) => G.input(_));
  main.variable(observer()).define(["i"], function(i){return(
i
)});
  main.variable(observer("viewof i1")).define("viewof i1", ["password"], function(password){return(
password({
  title: "Your super secret password", 
  description: "Less than 12 characters, please.",
  minlength: 6,
  maxlength: 12
})
)});
  main.variable(observer("i1")).define("i1", ["Generators", "viewof i1"], (G, _) => G.input(_));
  main.variable(observer()).define(["i1"], function(i1){return(
i1
)});
  main.variable(observer("password")).define("password", ["input"], function(input){return(
function password(config = {}) {
  const {
    value,
    title,
    description,
    disabled,
    autocomplete = "off",
    maxlength,
    minlength,
    pattern,
    placeholder,
    size,
    submit
  } = typeof config === "string" ? { value: config } : config;
  const form = input({
    type: "password",
    title,
    description,
    submit,
    attributes: {
      value,
      autocomplete,
      maxlength,
      minlength,
      pattern,
      placeholder,
      size,
      disabled
    }
  });
  form.output.remove();
  form.input.style.fontSize = "1em";
  return form;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
## Wishlist (Send suggestions, please!)

* 3D coordinate input (for say, positioning a camera in a WebGL sketch)
* Geocoder search with location autocomplete that returns longitude and latitude.
* Degrees or radians input, for circular things, or angles.
* A dimensions input, or a box-model input, with margin (and optionally, padding).
* A map-projection-picker input, rendering little thumbnails of all the d3-geo-projections.
* Other useful formatting options.

---`
)});
  main.variable(observer("input")).define("input", ["html","d3format"], function(html,d3format){return(
function input(config) {
  let {
    form,
    type = "text",
    attributes = {},
    action,
    getValue,
    title,
    description,
    format,
    display,
    submit,
    options
  } = config;
  const wrapper = html`<div></div>`;
  if (!form)
    form = html`<form>
	<input name=input type=${type} />
  </form>`;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) form.input.setAttribute(key, val);
  });
  if (submit)
    form.append(
      html`<input name=submit type=submit style="margin: 0 0.75em" value="${
        typeof submit == "string" ? submit : "Submit"
      }" />`
    );
  form.append(
    html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
  );
  if (title)
    form.prepend(
      html`<div style="font: 700 0.9rem sans-serif; margin-bottom: 3px;">${title}</div>`
    );
  if (description)
    form.append(
      html`<div style="font-size: 0.85rem; font-style: italic; margin-top: 3px;">${description}</div>`
    );
  if (format)
    format = typeof format === "function" ? format : d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit
      ? "onsubmit"
      : type == "button"
      ? "onclick"
      : type == "checkbox" || type == "radio"
      ? "onchange"
      : "oninput";
    form[verb] = e => {
      e && e.preventDefault();
      const value = getValue ? getValue(form.input) : form.input.value;
      if (form.output) {
        const out = display ? display(value) : format ? format(value) : value;
        if (out instanceof window.Element) {
          while (form.output.hasChildNodes()) {
            form.output.removeChild(form.output.lastChild);
          }
          form.output.append(out);
        } else {
          form.output.value = out;
        }
      }
      form.value = value;
      if (verb !== "oninput")
        form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    };
    if (verb !== "oninput")
      wrapper.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
    form[verb]();
  }
  while (form.childNodes.length) {
    wrapper.appendChild(form.childNodes[0]);
  }
  form.append(wrapper);
  return form;
}
)});
  main.variable(observer("d3geo")).define("d3geo", ["require"], function(require){return(
require("d3-geo@1")
)});
  main.variable(observer("d3format")).define("d3format", ["require"], function(require){return(
require("d3-format@1")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("world")).define("world", async function(){return(
(await fetch("https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.json")).json()
)});
  main.variable(observer("land")).define("land", ["topojson","world"], function(topojson,world){return(
topojson.feature(world, world.objects.land)
)});
  main.variable(observer("countries")).define("countries", ["topojson","world"], function(topojson,world){return(
topojson.feature(world, world.objects.countries)
)});
  main.variable(observer("usa")).define("usa", async function(){return(
(await fetch("https://cdn.jsdelivr.net/npm/us-atlas@^2.1/us/states-10m.json")).json()
)});
  main.variable(observer("nation")).define("nation", ["topojson","usa"], function(topojson,usa){return(
topojson.feature(usa, usa.objects.nation)
)});
  main.variable(observer("states")).define("states", ["topojson","usa"], function(topojson,usa){return(
topojson.feature(usa, usa.objects.states)
)});
  main.variable(observer("graticule")).define("graticule", ["d3geo"], function(d3geo){return(
d3geo.geoGraticule10()
)});
  main.variable(observer("viewof license")).define("viewof license", ["md"], function(md)
{
  const license = md`License: [MIT](https://opensource.org/licenses/MIT)`;
  license.value = "MIT";
  return license;
}
);
  main.variable(observer("license")).define("license", ["Generators", "viewof license"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`*Clip art courtesy [ClipArt ETC](https://etc.usf.edu/clipart/), radio buttons and checkboxes courtesy [Amit Sch](https://beta.observablehq.com/@meetamit/multiple-choice-inputs).*`
)});
  return main;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     PaxHeader                                                                                           000644  000000  000000  00000000222 13707343542 011124  x                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         146 path=./files/c051fbc024553912e31968b35e537d4ad3592201b5f8e7bd13fd9d02e38599c5d541a704d0858c676328babb3e5c9c35dd7c6d67240090d094882a1cad8eece4
                                                                                                                                                                                                                                                                                                                                                                              PaxHeader                                                                                           000644  000000  000000  00000257664 13707343542 011044  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         GIF89a����    			


   !!!"""###$$$%%%&&&'''((()))***+++,,,---...///000111222333444555666777888999:::;;;<<<===>>>???@@@AAABBBCCCDDDEEEFFFGGGHHHIIIJJJKKKLLLMMMNNNOOOPPPQQQRRRSSSTTTUUUVVVWWWXXXYYYZZZ[[[\\\]]]^^^___```aaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqqqrrrssstttuuuvvvwwwxxxyyyzzz{{{|||}}}~~~������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������!�     ,    �� � �	H����*\Ȱ�Ç#J�H��ŋ3j�ȱ�Ǐ����H��ɓ(S�\ɲ�˗0c�\8r�͛8s��ɳ�ϟ@�<H�#8e� ʴ�ӧP�J�jshA{�H���`�.@Q�J��V��]˶�۷pK�C�� FN��%`�M�/��@�k�VH�q+^̸�c�Y�T�`�����k#�i�M���i�E���e?ʠ ��5)8�rIңB=el Bʓ�?h�^μ���0ɑ���5r�5@@q|�P�h� � 6�CГ�	"�~�+�wW@z����� �Ǝ_ QX,Іm0"I*u��;�DCW*.� �$e���ׁ��@J�(���S��e$Z��y�I�#��B�_U8�'� ��eU!IZ!Ît��
����TVi�.!�^��1��7�0rK.Ĥrf.�x�[@�ף$��C9W��-���͘�Jf4[��塈&�hD������
���@�_�TA@����G.ߐ��^Z��_�����?,*무*j;� ��`����� �H�k�*F�!��0_�a���� mX� ���܎�֖��g\t��'��1�p���zH���������W*�A�/N0Hg�anU��p Ym<���"����W�Hm��]zU�#f{AЕ��
���#]�@F�2��,��0en��i�q�H']H䈨p�;��H'�4J!���"� 5v"�w���B/�����`��zU�Ap��	2��rK�v~�Zy-��x/������hw(�HY���m��y��k����,xD¡1������g�9�_�
�@ʆ�&��}C�'_D�KX(l����ڳ�kU@`�'"'��}J�� �.��Ȫ���e�cs��E�V���/�o����+�eT}ؒIw�z|����b���*~ 6�%��!�YeU I�?��W��xb� ���c)(�Tȍ ���>�>Z���ْ�к�����K���2`��(l�<� � _�­��5@ z�(!�R��Reu� B���2|k�|��B:���ڐ-���pMz`#� �s ��H�2���:�R�c�ث|��-�B73��2)CX����E?�1�?����nxL�"7b�-n�!5���EZ�	���qE'T� !�F4r3k�FA�L�*)�G���n���粯�p�̥.B
��!���f&?�m��L�?��ˈ|��#�Ը��j�lKqHM�2�-T���8�0@TҊĒ�W�T�'��'{YGe3!����|��n��v�1���4�Dȏ@��D����=�W�{$��Y ؃�6�av���H/h�I�Xm�eA�D&���2z�L/HM�%z�2������`p���u��ux�sTX4��D���@�a-L�X�ݩ Fi��7�$�=BrT/4�KN�Ь�uf�x�	���D�h��Bj �7�(tUcU�[�4;	,z�G6�T=� ���@X���qG,�8�X*���n�*�hC~p JUѓ����!wH
}�!�=<�1֦x�Q*0�C�7QCaD��
8��.ҳ�?x�Ďթ� F��qU���,��hX��̰8��m=�zd��%�U���R�\��D_�)��$H孫�"yQd]� c
"`�<a�������G*fTv��l�E}{Y=��s� � Ab��� /bD��ʈ`� ��ª�A�����:!A2�|�����k/Il�#&E�B6�N/SB��H�,�I/( �bq�eǤ���AJW��
;� ��N��#��Ў����|c?�'��H�2�����ܻԵ:�ˈv�P����x�i��#KAf�(�7��J��8��Ƌ�� �+F���lMa�6Ѱ^�7�ц�}!c�
Y�"��	�i��a;AsEu���ė/��BӘn��M)Șl4��X{*_H�n�[��z�b�`Uo�R<�$�$���'°����y��^L�� 8��q���BBHB�`��>�9~�Qzȋ�,��|�	ߐ�^�D���H�Çt�>�?�nu=#b�"^V �ϹO2��X56�p;�[J���5]�d��թ�#�� c_�����@!Z�L�s^ �S���&6���ʄ2=4�����A{��3e�@}�dW/��A���_��A.4����
��=naB���@��wdXܳ{>%cMq4�v���@eY��K��Tt˻�oڱ����U��+��,�$���8��]�_ V���x���g	9�-<�#b��K�|�9}�� ~��썈@��#2t��h_�9�R0�'�����?4H,���B }x�R=�G
ʷ:F�F� 2����E7N+�W�aQ|'Z{a46%]�g4� [1\��9&���zPi� lU�6���|�u�~.(]�CW��1�`OeBF���a0Q,Fl��mu%80*{�E'�h����~(��t18&�U	w�hX��0��0��|� `�0��b@yգ�vs.��,?0zٲ5�C#��xb>$�P=_�:�e_ND�@6���b甆�I�)��G'%	��K�S"�9_q�d-�P�w�sR@7�#7bB*GL.fn�"AFfwz��S��"tM��b;d���F�j���B&f�z��v_yb l`4�t��'��d;K�U�$��bܤc�t�t�4G7��z���60#gx�
�<���HA�"�rzT�Ԧ�	�wP*��C�wH֑�D��
��eppw'v�c1]"��&
�|�Sz�Q3[��>�L ge�%M�Q�.� ғ��4�� �Q=_�@��}{�'�/%�% gBO�o��@�0}��b/y.9dUU0#1�y>i���y'��t��@1�	��&�fd� �U��B$ԕ��.�u*m w�D�/E&�'eDdD�os�_!3���E��Rsy��3� 4��>��4�eC�	�rjJB�S'�*ɓ���(#\FC]�P*[Ǒ��� ]��T��F8��Q��m��i�Rs�@]Syq+U����A�o�w�ㇱ���)c-�j�
b!S�p$�9IHr{㎚�@U��a������
�:���޷b���t#[w�P��j ����w��BԚ�����_��S"	�'��|��](��s.
SnP~�-�b�qh�p� F��K���f&2s{���\�0S[�D���(@7�x�S�x�P;��PD$.�G6Y�q7v�%9��T��	�IG
���h��Ԧ�ddm:,��:��EN5F�9'2�(A�}pW!tC6	b�PčU�?C�@7�URF�Z9��ww�¢w&M�qR�����9�s�@-6%" ]�HB��b`�6`qFF*��z�$٧���)V�fz�繡�M�CIX�A�r�A¢@4M6ȍ��TX���8��&��}d�\�"=D@ {�-�ǏmP!�@p���~��V*| �a_@
� ��yr��2��M@�63��
}�g-\q�sH=� �Uk*s�@Dw�\@�� �#{̔
��
Ė�ѓV	� ���_(U�N`d*�%^!E�2@��ל��M�62��З1'r˵)����a��A�7�UNBz����#��W�zv<SP2�NZ�� w�J?�pW�<�pt��.ȑ��$�gW����
���:2ʄ"�љ���|�U@P= ��z_�^2��.�Q�wBrz�#�Gc�K��\\�p�k�
���`�
������vg'r;p& ����G��W�7,��?�w��`�Wb�1� |.d�/�p:]�w�*�ztL����(�d��k\d�t�{R�O���?R�) x~؀1e}�;��F_�D�>xRP�azW�&����9?(��&�z$ V��F��|�I܈�z�`4H�`d�1pYSw�R&����cB��t��D�A��A�u_	��|҄��&�0Jm9t���!��8�hȰ�z'�BY{ǧw�4z3,��:��� �apW���+U �>'�ĐC�w�����f@e�"�wt ��1���v�1tR���u�ن��Y��,�a4��'E)m������x$�X#s�e�\��� p�$�K�"��`��z�/��\��vCs(C�s�N�miS��1e� ��UT�����U�{�ܺwƑ_��٢o��E�گ�J�@`��T9��TҜhP+N�$tR�W_�7H�0zр�� z��҆�~�t"����vB�TVj��"yx�~q�"j'��S�\C:�� w�"?��^�Yj�eͥ��v}l8HT�1&D
Q8," ��LmH_���8��i��[{h��Xz�1K�m9?�8z��U�Z!j,JBCTu63IFv� ���f-?;%Ѡc%�;у��G�P��X�Z<o��4�_d!;z�TN��� %��?�4�<����2�`1JN��6�dkl��j�v�`��B�=o&]E�&��+��J�(c"��9�r��<\d����a/���Ȩs�C�b8%g��$�}��o6\���P���}\��]�ws�g�b}�ǅ+�Vl�aL��܇w��[@R��e*��1�!F�t�r���ɃԪ�zYQjF�|��ս�����5 `]���9�c��*�6e�<�#���QH�|�wVJʱ2s��W�D`� ��+1�2m��ؚb/�C��.����́Ǣ�$�Y�[�I����|���'9~y.*,����9�\�:��rճRģ,��#�$yw+��1�f���	BNΞ %�%�*�͙ B��X�X:eҤo��l�1m[j�v65W��Cd��Y�.�w?���ߊ�5��OWȦ��/Sb-���.���X�=v�0�g�A��>N���Kцkv`_�L;�Tz����1ȠGۄ;�ח
5ee2^�t�ep��W�Ct���\�z�_�j���L�:�s�GZ�B��5'E�c銣��DDI�|�S �vb��'e����!�%Q{�ݩ��9"�L�^AL��p��LL�)j��#r��.Sd�:�B_��u��`>�co<6�D��Py�B��:p���S�9�[�%�@
)3;��_H�u�J�E��7��{WN3�k%Yt<�T�X�:�])��A_� S<{����ڻք�.4�fL�F=��B�WVB�#��{���rb1h��0�Q�����"y����Nx�2����ْz�ZD6�pb�:�DB����m4{�C�;%\�a���\��B/��{H]�|�@F��6��4�v2j�"5ӳ�8WR²��ƻ�-mo��%	(C/+&(��1����vSO�AX�����n;X�K)z�� !�$rȜ�K!��Q�D�-^ĘQ�F�=~R�H�%M�D�R�J�-]���"#�����6�BX��95 CF�ʭ[�~�� 'CIp�����:����mP8D��h*{�P�#Ɛ�=����V���O�)L��/�6i� �R�bƍ?�Y�dʕE"�ο!��G� �h@��_ 0d��8�^c���[�_���@�{��#kX�o�^����*�h�B P�*�ֶ�Ya���R5�*B����iY�|����ǟ_�F��D��ΐ�c'�� ��
# �o��:������!�r��
�!1r��b@�ɰ/"�&��h(����.@�!&D�# d"�"I�Ҁ�vͧo�kc?'��2J)��Ҳ����	�"�Ǔ�
��G/Ң�oh"`�2:��\`�gN'����� �rR��	Î�)����kCb��N�stGV���1��I_��O|J%R����TSOE5UU�C@�M4,��A�����҃ '$i(+�" ��~��IZ�. �(@J��6�H��B�6b��GM�n�X�r���*B���s�Ǫ*�qd�j(�U��_�헬i*m7�l�WB�t���H5 k�� G��&�� �Q�	F�BF��_��K( �����[���Z�F$��p���2��#@9�{�
�a�`��f�i��+�9���v$!��2ր�\�[
�*�Қ!=v*w��l Gv�p4b`�<d��kI��h1�T�������>�A'�[q�#2�&�{\&QZ����s�?��
Dp�\2A��i@�`�/x������pΉ����~%g�2��B�/����8��>�CF��|ݞ��.6 �w�o��؉d���[Ը��P=~��?ʳ��.�6�v�b`?L�s��<?xP��l��G!���>D
��?��VD���fE^_(� � �.�i�7x��&6`Vl 2�� � 08�_�8D"*�0��"���i���	;ȑ�n-Q.��WF��0Ę���7K��q��)�oh���;pd|��S&��\@�Pt���8�I�}hqB4�ц������d$%�����zYY��#�Qtp��O<��DȊu�X���>I�AuP���|OP��PD� �aI³ΰ�� '��C$ ƣ2 �!# 1
��T���:�$��;r0�(��d8�9N��iEV[�5����Fd�2��	Z��Mz��U�a�pI���Ml�$<�h8��
�n1�ڈ�8�Tk�r����x#l��T. M���jBx��u�&���$��/�iLU����E"�8
s�	MTi�DE�H5�n@pʎb�1��F�"FLr��?I
1�d�d%.E�
)b���`���\2-ȭz��s��8�2�k^������6X@�I�&:��R��&��Ea�{h2(z"xs�]DS���g*V�"��Cz@��7Ѥ1�Ʈ0�ȑّ�J�E���!hχ�:\�W2�H*R4���W�a��xb�4�J"�B�-�S=A9��T4RQ�ЩvA|���dL0��~�Z@���9��@~��!�Ѐ�����A�vِ$Ƹ�p�O� �q)���O�3F�E5�|ɻ�M�?��ۆ"4ìԅ(��N)V<�$j1.�(�쑊���[p,rHB�9	����U��U_v��Q�W��K\D�@Dz�dC��]���\C��0�5�i
�`��#)���?Z"�H�I�w<KT';6#��~�JU�2��9@ �Z#|y���4˟�G�l�"bto��
����i�.��n��TB$i�-��d"�)E�PmCU���*�yT��i|cI��4;���\���Y(=�Ga�j�9;�MF�"��+jv��%��\*?�UF8�	V�ƙ5P�N�\u&r�/qo�����I1�:B��D��X|��?2V�D���Y��3�<d6��A�e��ܖvh	��e����->/��Q"�������#k��?G�C�&�zy�rB�@�D?hf����7�A�Q�sj�l�Z�9����"¦dƤ
�Y@.��o��r�I����:y�
6�p5 �#;�7�-��Rx��8�$̂�("�`�a��E�R���K�C���&q�۹=�a��
���er�h*�*4�,�`r�6�
P�)�ԃOr���]T��Ɖ2Wx��n��߫�p�"�@���;��J7�Z�����b|�/�ֺ����|:$�MR�?��i :�q._D����F%����<v �20ј�Q�����CRБ���@�ƃ��x�#�7/��/Rp�JӃ�S�` Z(�X�Ih����8��C����ӑ{�;�)27Z�E�
2�"�8Y�֢�/`�
r&��r�$�;$���PgB��h>���2d�|�/�q�� @h�a>�k��@F�����Q
�I�&�(@@�6ȵD���ú &7�$�2�����D2+�P�6Y�"�.!1I8����U{�"3���C��2��93�Eˈ�$� �B�?l@ ����%I �1R������<���c=dؤ�y�Q���J�^��S��P�i�Z֓5A��(5���q�����6������@*���AF���I%�ؕDl�-#ËH���(� ���Z�Ȕp)�	3���8��R�� T$��!=���#�/92W���
��I�b�y-�-�RT�7r�b�7��,KD!Ʌn��K���1� ��)��J���1<��&��Qڑ�s�p��X7��xKȈ@@	�@��+��Ȋ�K��OU `=ب�ۡ�ڳ7B��r�\��*��r�s4�#+�\��s��c�� ����� �Z����&��xY����h2���,�(���D�1�w
��&���H�TH%���0�y2s09��r���g�A|���{+���$O�h�QA�zh�����h`)�ey��c�2��-΢���vr��t�C�FX.��K�0ȟ��9d�6����$:v ��`�p�� {:����90����6Ҁ�|���l��,�4H�����^l������5��δx+顡�-�$���3)�Yc�h0�=��R�8l@'x-���<@vP��Я�aYk�S�������H�R� ݜ�0����q�:���8�L���(!�"Ga���(�ȉ���ӟ��YO  
�4��R<2x�&"�[�Q���
D樚#M�V刚�)���钹� (̅���o���I0�o��h /�!: ����yʟ.b�3�AIwzH��6�t���V��'ZҦN�,�	���viA��l�6�=����B�@D�\OF0���T�KZ�(�,�K0-�����;L?WeX��	@j����l��1��&-�el�/ƴ�+�8F�LI���=h̈�Sd�yI�p�Q��8|B;L
r1'��6�Q�P��Y?y�5� b��5:�2 �Ҹ���[��|q��0�T�(<KZH_�4��#m�/��H��^$�KȷD҆��T �[%���H|�t�Io����)&et.��e����#E
�m�<�J���1�9���b�����̩����A)|��k�֔5Y+˞Հ�tk�Ō8�р�B+��ȋY7��U.!ѕ����̈�u�<O�ȷ���D�\PX�)0#a폋 ��;+��� 3
*�<=B@�}HO�"�a�i�(*�٣q�i{���I�	�]��������Ɔ<OA�_59��@H��i.�H��Ȉ�+�[pǭ�o ���I^�.���#�E��kE^� �93��J*ۋU-�P�*�Q�x���ύ�4������4n=��E�xŋ������!� y��6��(��(��� ��U�qC`O��E�"V��){9Ĕ�.ä����������<���{0�L���$�-1���@��������/��a,���!�I�9�ɋ�6�j!!né+����o�����PMYR��:�;�����!
�<h�pc�deYÀ�@dQYL�o�L.j��M��������Ր�F) g+`�dI҇�dØ�V��]�⍈tC*�*�찁��u&L�ȍp�>{�����3������B���E����m���9q�p�F8����x�rf�0�����d���h *nv]�\��@<������n�7\P���/hd�3M(܉蠉ڈ!Ϣ<́�6�Q��������H9b�֨��4H�iE�ˍАjK� k>id0�T(H���]*���1�?�-�i͝�Q��9H6�4}��cܻL�L��%��^M�� n[�8��1���a�JX�n���;vȋ���oЖ~f����(=���δ,�D�4�[RH�\�&�Ӄ�f�v:����p�\�d9<���<�n$Vb@P�J�Qhy��u��\��x���<�J�VhY�=�h��]�!���.Ih�Y$��n��r�\-����Cœ��r� >�������~���h}����f�EII�h2d<����gBB��EER�iF I�q�x��`:1Y���-VR��i�Ԁ;��[p��xXdu�^T�ªoƍ\�v�ɍ\����O	��߲�cU�3U�^?�>I�-\��p��@#?�G�5�� �I�&Y�cV�ng7�@f��Ջ^�:�&3:@A��X���m���<]\��L?T<=�WEjãi��F�<�˙�����j�E)G�5�X���n������4�{�������JLK5n�����;i6���p��_
>��=��ֻ�搲/��V�*a�Y(e�"�)�W�7�eg��f�LWi�\�l�@�������ѣ�o� ����%F���g�^��Yh�Ns�>oB��8<8 �1v�~���^�]�����a��p���q@H�߰y�An��F�'��%�҃����+�#���ɼ�@�ml*���f(İ4�]OM{(�Z����o������Dg���=*f�O����h�����S<f�]N�#Q���6�˭�N�@�8�CɎ��ڹ�j)*��/���(8]L�:�H#�. Ъ���N���D�c��*@4�x#�L�≾*e��F����/k����c�'�r������:lC>y�9������{���������Yˉ.�R8�� ��b��9N_?����_���k��\}��������Z��R�[h�5���<��|�ț�P��K��X4 �����cU��I�6x�X��I�T���kX� D�R�h�"ƌ7r���#Ȑ"G�,i�$ʔ*A!�A������R`�h�I�aPNH��i�g.bJ�!ǉ'���-ڷo����$I��*�h�ꟽo�n���+L$U�1�`��z7��CDD���1�G� �����@Ξ_��H��M=F�"���(� �S崈ԁ� b���\�2�C���\U @������/n�8��	b�
���ƨJt�r����'���R��YbpR�cX��`O�溕
j\�c!|)� �	��Yi��p �
���@gզ�I�(Pd9-i��$�?���@����\H���iT����?�$?���p��XJ�ZS��4��:�$�QJ9���=�pU �d��- A�}�U*S��@tśj5�U�����A@0r�7ѤrӇEy��@N<'�|TV4!m������_�QN!J�?p  �`���QZ8~Dt/� �'�QU��AtWA>r�H�b$���{,��F�@�Y�D��Ɯd61� %�o�dE,9��b)�8��IB�-I�"	;��1!;ӆ	
�(�#_����z�]�*�A4��r�
��A �z�v�8_t���?���M�^�L��`Ã��8g`����W�);3�5�|s�7!	UH�gm�|U܂;Y�C��A�#e0��7Y^�$EY���@�Q}�K��d�KUc2pT*�'�4��8/�#�<�#
@���E(h�`p�ÈD�zbj�n���>9�k^��,�5exBӌ�)l7饛~�J��#Yr�P$-m� s4��2�֙V�A�Qn����@�]E�l� ��-ˣ�qK���m�'Ȕ��@"�-��nE9{���6�!	#��6zE��bd6��zR�&�~H��tM6��$*c��� k�C#(�	R�6��@�Ɣ��	��H.�:O��"K# �2 ��� R$E)D!�=�g�\�'?%��Nj3-٠��ǡ���0*��f�4�L���r@���}D�H��h��0��� `F@_�� �I|LZ��1$�}��~�# I��L�bodOM<�6(��*��W���8��=���#�A��lrC��Lc�%����'�֧��*��w��#�L��|yZ0�T�Ke"�DD�>O��(��|>���gB�(�?��!� mp��� �.}�mʣ��"&��R��<':#�̂��ILޫ�cR��*hQ9����	�e���X��M9�p24��-��6 ����6�@�lJ z؋3u�/��'NJQ (I8�6��Ï�T�\p�/.	U���3k�du>���+j %���)ԡ��t̒A�@F�p���$����jY����;f�SiW��<�� ��j� 1��P_��E<R0�6��P��r얊V��q���|	J��L���"��G�ؖ����=!���=� �a��I�40Qɐ�(%�[D&>�eZc��-�E�-nsk��a�hCҞsS�g,(`������,G�׵&�/�T��lDRc�[T�L!y�І�,�G?�'na�~z����j��F�7�2s��a�@\s���mHKm��F�>��E��a`�3�C��+U@�|ZԷ4FG�1���gBq�UAt���x8�AT^���P 689���|�>�p
)$�}&(���8� ��P,1�q �ʳ��w�8J��6�Ĝ�Y�`9Y#��/x���y���
yij�p �=�9���Ѐ��NfV�:Q�a�R�pU�!�+�:��/�"�ߟ,z�f��-�4�C��.5e�_�95��:�rw���ܝ��U�/9��<�I�oZ�����%�7^�B�S��H�1r˕\n�Q锔&�A���焮X���zrϪ�@MHPl#��~Yl�<-b��@_}�A
B�ء8�T�p���COm㞒�����5��WN�5�#jg��c�!��ƨ�[�O(`�B4iG@�F��abB��:�2G_K���򴡓A�-T�]��ٴK ��6t3�Wv�Wi�6���A��xOS�>���hCE]���f
^�������U3�c9��;��Dr���t2c{8�	/�/�Q]���� ,��?<�s�΁�!܋	���,j �3��RQ.pÁ�B�4_�f��%��1H1K�T,�k�&�K�0� z`��]#'���Ji�Fr3{׽)��bIB���kɫn����-��S�9"�h�T�]��JC�����+�/��|���w5or���,��?���:��|��k����A 4�tE��Em��Z��7�O� )<�c Nּ�%����[,�4�NX �P�������e(���՝ƑUAf��-S0B�����M�@ED^�L�
�TMD��O�l�?HE�`�؃��F���3������А���h f�>�Xd�Z��!���I`,@3�X%Ct����/e�>y��܀H]ݍ��˛�E�pɘ���ބ�̰C��	��Y���|��HB ���l���`iJ�ƨ�W�툑 
lGÜEa�2,�-(��\�Y@M
��d �=|�J������� �R�������C\tS� Fb����6��I�B�
]We��%J, �(��i�xM.m���UA�^�]NP;�����_���u�����y���y��Y��qM�������С�!DD�y�F]��s|�=�DH������يa���� A��E����$� C1"�ua��@0��F�m#R&e�,�Hb4� T|�M1+�� j�iӅ�U��||�P��\1�/����@��#�Q^ �d���|	#�Q�5D|e�zA�Ȑ�K�]�y�2�Uh�C�@?B�V̏4������|FSv�wH�O�7H&���/��a��3��@Dý�LO)%m֦�����X�S�� �|C����V ` �{�HQ�����Py��Y�(�@�\č&-@���ja�Ct�]L�
���lh&���k�׹��x���<�t��نDFz�Qhs��o�c��;T�$h��ȩ`���Q*��?ԡ��tQ�� 9L^��f6�&��(J`b?�_��%)���H~��C�Mߤ��\�z4�Z�B��vm�&Y����nRD[�z 9�ި��\�1��`J���o�J���-PjX�X�1͞�J4@V4�?@��VS�� �Q�AF^�@L�E���c�4�?!y�����H�Ǵɹ<��&��
������de��J����U�Ga�JB)	H%�d��O��L�Y�UhA�F��C&
0�I��'TJ_�C.X�a�E�9K�AU*�L�6U�xBw��mDKTA?j����Hc^����\
T�. )�fV�B$�\��W\��T�4����I�'�E�^�;.��ޫH �A��@�]�x�ԡ��g��8�l��K��P��T��x���4[Bj�b����Cx����D��W�]�=�'���^��pXeO��`�O����5Eh�h����<ǩe��H����?��4���A�J�\̊���V��� �f���'y4*�R�������^CMC�\�Q�� (��X!����/�i��K�|̟-�)9��M��̙���FL�V�(I�H��Uh��|���a�)q�`��g��%�`T)�p����Y4@�Uh��H�Or)-�ԶQ�6����.�6�X�I��Sz�Z�v��IٸHlt��s��L�8n�0�&���V����QL5�<������u�WK+��3E��:�GH|�H�=Dwܨψ��/����7��w, 1��P�����$,�?Le�J��^�n�ZL��E����.�hmH��(�4De�����S�TņQH��SFe`��:y´�����ՆN�
�q�;�I|C������x5Y_JIdPG��iE�����T�Ec^E�d�d!��I��O��0#`y41N�p0�|��0+%���4]T��Xe�Y!�┹�"�%�6sԆ�6r���y�X�4�'���Fa������eH�4`��n`QI�B���n��1	��C�K⸮4��l��l�z=���ܠ�d�G�I������X�N�LWsm.�6�S�AM��X�@�=JR �{���}39SDt��v�G��`=Ҝ��4��laHb���e� X�B��LGcH�;��=L��L������(*���LDJU��H��Ț�T��̄� �ZFFЪ5��6v��Q��F�����4Z�t�Q\��Ro�ҘDQ���x}�$E���5������Z�+RL��
�t��=�q������jYI�9�A��d$"���$�a�F�)�h^xχE��"��K�5�Ն����H\,@��Ё��O�
*_�1hT`�h��|k֐Q ����\���l�3m��֚��U���E�
���
A�F��<���#2�/���e�a�^��vn�^.�O���K�1)��.`G��q��4�e<E�-n�=�7<tk�@�ژce3wp�EDg�h���q.�B~`�喋�dk�F+��=��@絑� בECH׉L��\Td�]$�f�K�C'�i��O�IS.�H �k��SNSF�t�����_�����Е����8�̴�=��`�����TA���.��`�ϐ
���PX���~�N��K�!��Q�+�@ A ���c�~QGt�UI�d8��8kj��C`����x_]lJ3�Ϲna���Hb�E��Ǹ�*�tCHSH�'�e��x����݂RD����d�FL��X�@\���E���V�}�����v��V%Z5߁K�2G�h �@��[C�Cא]
�~'qT-�{��܄$�#����z(H���j�jК^�nE�$�)�y���ʈ��v��9�7u��`���.
����5�zÍ.n��Xp�_����_ g��I}�fTg�	S�o�-k�yH���
;��̄|���2F��Eed˜A�3��{h��F� 7L����t���h��4�{�b�m�Nv�ks ��E����n���Z�:9x���̇y�@�Hg>D���뒊4]����'@�$�@)�E�Rj'��U����h2\V���ǰ�4�i�L�<	�9���ޜ\ɮd��F�iIMۨ��7�݉)5�NP?�g�T�� N��T��B�D�������D�\@ �����쏙J�'UO�O���Wޝ�G_IԢ$����EKD�7P�|���]�W�Вbl�� ��� ��-S���c,�������y ��
L�P-Q�Ł\ke3�<Ѵ��jp'�EQ�����ɫh�O�@@ ���*�������_4 H�"�1bdG�,cG��- �cɌ� ,�f�eK�/aƔ9�fM�7q�Թ�'�T�������E#��bSO�ȑ���Iph �qh8pR��؆"#@��!�#�#8ND�lJ�ʏ*eV����V��)��P�b��(z&����]Nni�@Ή�\DD�h���z<�dw�/E �� 8(l���,�ڄ��@Han��؎��0�Y�9����3��zu�ױg׾���_���͞�6�˛��(����<#Y�L{kn���" \���{�ĉ��!�lX���� ��$�N;���8 �����/��{�� ��q"��"��4 �s����FB� R�!@9z�@$�2I�5<������/�S�Ĉ)�����'��!9���A��4�����ȶ�J������*n9У�(��	`�	I�K��$��h �r����	��������Ha� Ini�� xP�6ʤȷԾX@��a�
v4����)3M���1Q��\� �:� �E��Ě*����`�N�W�q�%ņ�rb' ���2��'�Pm�a*d�AR�/7-/�����|���,�@�Ƽ=�ƞh�a����$�[���?���8�$F$�X FX3k�����=�5�������S!�r��$4v.k�@�~#f)�*F��`ێ��'�2�)��[��N���rR�NT^@��C� �@�6V"�鈉�'"������TxP�?���⳧b���A~�$�o0�� �p��[�ĒzL��`�'Db���c���� ����1pv��DIP��%ir�h  %8=����=q��������m*����_��wb�B����T֠nf��L�/RJ�
��?�>n�fd@x��;�CrD#NX
��X�!>��`�f.i�	1,"�=�5��x$A�h`H@ �?$� ���{�q�i�����Yȁ��5�bE= F� ��H���S�#v\M&D�����E-n1#�HB��- p��A$��hLqw?���	D9#��7���,���>����z����&�1�Qsʵ��D��7�Z�.�
ư� �0�{Q��T�J�D�#f� ��`.����X� ������+`�q ّ\D�&��UM��H.��ͬ�7 ab�<�a��M���*2nA
8��D$���>w�GœLV�
�l�H�)2žx"�p��� �'��U�R1'(�bp��OPৈ@H�?��	�L�;
x����l,+����d��� z )�L�R �&���-b��˙=��O�4:��$C� ��*�A����I�\�E�aG�̬���!�xȈSΥ�e ���(����CM��*DL��S#�g��m ��p�(d���XPhܧVb �a�H. 1����f�a'R@]9
��IX3؛|C�|���SծV�,����ؔ� m b����I�GS�yJ�	=���N@���.�ʏ�c���=��(�P6F�,f�fڏ�˴q�c�h���l^�p�:ك�A�|c�FkH��˕e4"=��I��ё��h�"��LS�
I�\�K��*k!a�QQ'���"�?-���g�����@
]�P��*���ܘ�T �v쀃E��6�A��I���]� I+� �TF�F9n��sa�T��jG��.R�� �	��L�����a�S D�E���lʃJ�P8&�x���gg�3�;�F�"��	Џ�P4��M���b�W�D C
�~e�J�؆2Ԯ.}����рE
��d������u�Ġ2 N�T22X�����d�#��4Ek��آz�-|�G��P�lPU8@�3E*�)��%1Nz�m=����[�r�����fU`�[��bt�W6 �9�o}�`M�q�b�*�h����S��(�����R�߄r���C����/w�]@�<р��0����20�U1_'��h-�?fm��?���ϒ��������f�V�Vĸ�7JS�%�D�Fw�*i
Nݥ';ϊ!�Ξ�I�y�����B���+Ji��qe�}��ONl��`N_˛ٹQΘ�/��}J��^'�)juAlDpѨ;����1�ڹGԌ���D)7�*�AO��D����_"*�/c���.NrQ���Ab	NE�&1�n�e��=��:�5��"�7�$$��&�I1�;�j�C%Eڛ�Ҥ���Fp� K أ@�`
 �)@�|�jp�s������K5QQ����ф/�K�<AI��3>�1 I,�"�2B,��FF��#��A��=��j�b�䮖�ݬE�@���VV� R!�l ��Fb�i�a��l��*{.j�Ȍ �Ɯ�  !E"�@ � L�0|d.�#��`�?F���-����md�Bl���@�P���C2�h�#� G2����P������������2�H��>�P@��z�lư���	�d��H���k� Be�#�%QB��}�5��D�Dnd�\��m�2�Ć�#>�OhB�P 
��C�@Z�%d��F��L���
�V6O��P/�� ��2�d: �H
b.Ra`�lZ<��B�����"�h�)��#X��*X��T� �|%+�!8n�?�����/<J1��Dډ�
B%z��bƎD�$c���c*�$
��l��l�"kq�hb�x��1����D�č��%<0}.���Z��1��Z�!���I � �(C
�#HPK臊H�	���*�1��R��t!4��"#��Nl��n�w"�	�*�%z>� "+_ZJU��Ĝ��XB�Ƅ�,�-��)f��h���Q[�?6S�κ#?X��2��R�Q�H`�Q
bHvXhd��Q ��Cp#��%f$~�:�ǋj�1�G�"N���K�F0����W��T%p�b�j�Mp��� ��"�$r�
�%.g"��9��QhBb��&6�%�b��)CR-����'��>B�"��4�$,૖$8��6� �i:�t��8Y�fBm�'�"��T/5lc�bUF��AL���&�T�0/c���'aDl�M(��*�P���S��C9g%�9M�0Y�QC��a��i.D�&ȑ��6
�VBI�� ��H�QD@lC�L��4<�B' �Da�z�j�Fg�D"��B�!F��?���"�D$oƊ+�@@�+��*O-$S�vI¨9L�Bs�3=b:>�8�O4Q!'$����)����Ny�bH�c�+XH�<W%4&� (#M
�~�V�J�G&2e�$J�`�h�2�0&�@��S5H�*�rh~ O�ϣv�H���0��D��1�
P�e�� na��z�4��4�0�I,5P��/g�
�@E�\��L��#��%��%�h$29D�?�uk :DD��)��j�l`v`C���ҤL%�ZV�$�B�Ґ'�([�V��M3H��2��e �Zp`��8n!��A�M��,��$6�p��!��M�c%q%dS�)!d$����EP��hs�~�P&�,*�:�8a�)�crp.X˂?�&���	Ģ ��B�#M  H�H�J�:+}�`J"��=� |;��U��Zy0C
2�*4V�ǁ0�*�D���*�dd$~���%�#�H�O�*��4b�Pn��A�$���+TF.��8��]�ia�&�&��2������MD3N�".F�E��[y��E/�hoAUAI��$��s�Z�

�Q�sIn�.�����$�6#L�
g�̷%L,� �jP
jf�i��D�
|q�D"o�#�+Q��I�����f�/�h"중��%"l#�QH��*,d�횱Vcw�q�3��#�1��Pe����D�È�@)�ZH�H��v*�"�#Q�L�Ep�	m�dv� �<�c B%W`JZ��F��<W�[.�T�8ev�j���dF~a	�#t��"��';"��)+���$&#��@fX i h�ΦL�p�v�1�Д��sң4,�8��T���8D9���胓1��B���wP�@VCc���"��j���"�"=���DIrRt�GIif36�F8�&�r<��B��cR{@�b���0p�'^j�
d\z�$=o7z�A��Bg�u1�%�Ht؅�QT��R"�,>�3�/?\���m�K�P, *�.BF."����s�s*ّ��#���f��3��?n�^�O�"}0#.D�b���)�j#F>U� Rcw��IW?Fiv�(~�MIo$6g<�>��>�	�ג�E:;F�d�<Z�'a�b*�b�!�<��s���3�)>�D��D�.Z�44f�A<F��E$8��oP��"��&IJN3ĂĢ2�eUc�K�1�XfS�����$n�\A3�S�w]���W_1��G�o��c�,t�~ ��H0�x��)�zg�F�UK/d��@I��Dؗ#�o8=�yaQ3"&=�r
Z���gBˢ�3D� �4e� M1�����f�"�Q�J�1L�P@9�<Hִ=�~LX\Gð_�K��@��rF>���6z�z��4�j�}�I:�u�F#��R��p�z�QO�N���B�/H�ոXt*�u[<��+(i$,�L~ ��@�� x���,�n�"��2%�k
��e	�@����/��2�M��Bû������5"4��\)�A��μ�]�l:|D�1�x	�a}�����h6�,"ʇO���R��M����������%v'�����(#�#ʄ��3�p�?n�28�ẗl�]���e��t.t�?|$��B�(I%9�n5Q�J��j�F*^�@�3�_�ËgI�����fG@�q�B'}/bRL%�QB��Z��@3䱒	��G ���$:���GcL:6TH��-V��L���6����ˡ#R�hjBPȜ�^#Me��"���;ނEB�����äf�	*f׀�'X$[�׈�ǐhV8��T��2�V��3B
�C�� sa�J�X"�r1�.���d߃YF薣�I��*F�w�O�p:մj
���xD@�;i�X���H0h�&{:k�J"�s��,�q��&2�a����?�ޒ�u�}�U��(��e�!(��h[0�� Q�K$��HÏ�+"z؁�pG%���� �8"r�l�K�I��@m��/#=㓅N󸚫��D+xj�c�c�3��5;���"ʂ5�n���5��?�m�EA�z7���fDz�˥AF
A��r�x&I�h��zN�bF8ąv�D�n�V��9>轜��#�c���2b����#�x�0l@IAD�c���P�� ��N��.c{����(�	�)��9�k�2(g�}����É�6�ib�c�D��f�Vr�7t���� � R�
��%�A{F����6�P�_E@�D�������D�`/�[�,I ��\mD���L������cH@�|�$P� �|!�J�ņ�<j5�֭\�z�
6�رd˚=�6�Z{Ī��GέAF !�! �~X�!��hU�&eG�I�h!�9�®.]RPE �v렆\E��*��/�e�~�=t].(�ʂzr����zl0�'�n�\cɑ���VRL!��K P4e���#�M�e.L��]bY�1Bؔ9��� my^"�����EΥD��ȑC�t���=� �7xB�Sx��{�	�BA
�ÙX߼�a�~b�"�ĉ^C�}�J��=�Q��GCN��#EE���e� ��z����jt%�NܒYA�,�cSH?�]A��j(h�Z�pU�����6�=I�Jm[�"�?��8��̆�M���;{E�	����6<%2Y�È[�ٙUg�IB;�UH2�� � ɨ�bC(�D� c����$���
�UAʢ2��U���l��.�,����U����=n$-�9��\mh�O+��� �X���!C�0����B�~˭��iH��7"T�e�@�D4�Z�WI�@�?P�EO�� Nh ��9��������]Y{�A_�e16��b)G��SXt�,�;hj0ۢ6p���� ��[=���$6��WuO�Y�?�(V�Ff��h���%�B�!sҾ���B Gx	�nCG�5w�vߍw�!ftWN, �Vz�y�/FDtA�,Z�?N�A�Z��xA�8Aζ|}aKLSB�U$�ot���U�X�-"��_ ELK�1Zu���=h~�b0Wi���y;�3:�<YWV�J�>�eJ&Rx-P{R�W������),�^&	Du����?T�C�$��І{����e �j0&=��^âP吁<��� ����.��j�+p(�V��@�� ��	��0�z��3��v�4(�MH�0�o|�ә�P�'b|�9P��n1��_x�o$��$EHa��Q a2[�s�|�~��Nt>}�B�~�TX��9�-
�@ �+��@F��aqmP���@ń+ȸ����- u		J�F =8�%@`
l ��A s��-Z33�3j3�<��(p+���Y�Q�mp��쥈tI	Vv��V�h6Da%�Ҿ��iN5�ʏ�#��\|ēI��Ѩ��`EȀ�rn���y{I
2��9�3�:�n��}�p��p�A*8"����������C�����#Q?[�"ᷕ����8fU�}�r���7���/�P  d��na��0�Ča<q �!�Tj�7��KvΗD-�Q�ˎz5��:�Gm��_Z�4��(� f�V��s� 4�\����V���2�c�h(�@�
raN�@ �a�%ee(��[���@�_]��Ɏ�F�iC(�rٮ��qRE�Az#��Hb�[a%5��oT�$��^(�ɞ��F\-Y���
�.$�vy���T�е��U]���цy�" "L�- ls���X�u����
3֭��ީ�T1��i�����-y×�D��Xr��R�3%S�t`F�gXp8eCD��8�@%C�G�@� �@a�-H!���8�9(I���YI�o���� �!�o���.`�^a.� =�-"�p������.722o�v[R������R&��!�<�|J�J�2`�}�V�LR�c�+�W.c�y�<�1�E��ZeCGlCbِo��q��=.���h�)�TC�*�ɋB;�.�|�Q7��v��d������)�T9h�������!��2 i����z�\L��[@:�It>L �|RapPeR`h5D"�ⁿA��	D��aHAŲ�)9���Z����=!�AlP߭���]�Sh��x�2�_Y�P=Zb���m�#p����0�V	�%���dB�;q��Ĉ�NH���� ��(�D�A�qB�z���D/�&�?Ƨw�	������X�@mh m2Dh�S��T��h�(p�"�"����=z5u�+�3�B����[p�Z��WR7�;�r�����!r��+O��V�ܧ46�~Q��'�lh�!��th�Pj�5er��ɰM��@C�j�'�*�8����q��(�!*O,1ȁ�9!q��J* �,@"p����M)����m@�葋;2���R#G���Y-�y>ۤ8@���-�k�x�C�A���{��+�yoVP��7���N�!�U�}�y-��A qM���仾?F�M��7�b5rD ����b5rN?�4m¢y)��W-/�
$X�d-f���7�W�NY�1E�V�1DB�^��k�f `�a#�~qNC
����I6!��БN��ye��>An�0e�<�'7\.�ǅg��)Vxc�Y_s*�!-���BH'7[h%4�<� �M�<�F��HRd��sJNb��d�#,'�%�7,N`1N0^��4r�z�m�~t�|R^� �!2���C�VAI���� ZSuAIb�x�'|!���l��=PA(��F�xp )���K��u� �� �f^?ganׅ��]�!�p��l��8�XуDC�VTa;57~Q9!�G�2�!E�@E�B(t�� ��R��htSHcE�K�36�F�w�����[�v-ȰtrW3aǲZu!(��o.�	����e��	ґd���6r�U@�֑a�S��a� Na�2ғ�9��0���HVVSdYG`a+�'��^����j��bk\AU�S-2u4t�kM)_��_�G�fRr,7C[Vp�v0�]�VOANe�e�a��	t�37PQ+�R�p���\>�<��r��O��P^��uH�(�F��Uih���Y_Q6R�V1I�$n�C#I�!%D�S5(�%�Ԛ��I
ab'W�~�2���0{h �
��`�	&����߉7�>]{�%�Y�R�g{i6@8&c~H!)�R.�w�x|�X��F)eIB&������tQ�]vr��
>T7j�|�E;+�.e�+�Eh�W�2v�ޱ'�ЗT@]	%`!�X1"<�З��S~Q��@U�X��rܔ;���8!��1c�� gU@*EAKVx��`P�k�1�$�H�7�	� �����?��H��u���O}�c!-hYj���=)�3Q�I�)G2!:'!�C%�VQ�<�9�0]�y���!U�?��� hJ �Ӟ���v��})cNa1Y�m`�NS�b�YX9�Fj�Hc{VC]��e�H�
��Aʁ��M,�4a����U,�kq~4F�����!��*_q,��Bd��>�Z(��ЧW����"4e���0Z��R�zj7p�����`�ŊC����7S�!�\�H�a*��6���&�+|RUIod%~��w��9A�O�D�)-N��"G���d%��	�9��9��@SwA{ȰN%�BB �3.������A��H@��.�k-Qs.$���_
�kۍ;7���r(�<y&A��v-A[�Κ;~��=��?�BҢyҲt�X04j;��xH�&U)&T�e7!^d+�DZ��'&a�c7���bH'19\ENZC�a;e;��(^�Q@�?��@t�;�S1�Tyzb'���A�1.�A��G���[�P#Q&Z�C��5���{`�ɶ�k���99�7tU9��B�ih� Q}2��k�_���d�jx"�(  e�T�P�6 ��I��B|�a��.�RdR$#��j�\��E��d�������!lHS��c}�uS#��@Py,����\��b89!UP3��	�p}K��3´�&�WZ�q���(��&6_�L!x��lZ��Z���e�d�L��\�C�~����5��60�+�(vL&��HCr��Q�!`��Udx�9L�9�1 KIaj�
W�@I����Z�q@���Jbl^X����$_п�.rT��Z,�Y���K�(���Z#E�U�M9�H�R;��16��&�Z���z�V����0�k@��A*���Ƣ�a��cn�g5��S�k,��+5��Y���$�&?�u7S_pwkE��A��$����\�H/M��!( 	�ȵz�Z�6��:m��aBgwX�³t
�M��GGE;�J��aq���;�6�#/�ZעBfc}♦���[2v��@�	.��s	mͅ~( *����I!,60(��'�gP����XI�h0h�����!�/*�Nu*g#��"�V�X��7�}ݣ�,_�g��sCb�~�S7�p�%����m�:u�8!��ѨV��(z������-�ƙm�0;�ǂ��>U��/#�}�+��!U�`�!L��X�п#�~�����K��(̘M;, �X+t]mA����6�$X�X+�wLY�Ȁ��I��ة[`��Y���@�^:h��~=��99��UbC�:�"n%���C��YxK�m��Z3�L�/�i/x2,Lu��d9�J��IQ������2!�P��7���I����pY��ېS�./r9�K2=�ȣ+6�VL�S@�(����x��?q�"
�i�pdK�Y�LAF��Sq@�"�bҢ���D&)
q0s�3��ra�j��B��.7Ң[b��c1���&�d��C���BH�֑%:+�a��&*j����j�Z�rD
�p���0���M�nBRAP�[@ F��9�G�^�6#��b�rЦ�-��O9�M��(^D���\�~��F8f
Hu��6}��
��!��O�AItVh�6��9+����8(`eС��o�@�'���r�r#�"��.�U3�C�]!�����{�^v�hmP�#�c%W)�kC��J�JI� 3�S�	��?�垚���.G�� �O������H�E�6;8<#�ABg�4[u4B}}2(�S���<�t�Uh"F��E�����E8��,�8�5#'��8p4V?�tq- ��Qjq�q&g*�6�:.Wc�]�:����`���`2#�T���<-����&��y�>2]�̜[�2�q�!G�8!MD�A�R6�IzG���v���<�A<3��de��E�����s-,�d�
T��@6�0$qQ')�uB:C���rj��b��53�Z'v-Hq!jCa�C"PZmt?IJJ*?0aU�6!	�p���z�����	�W� �BfСB��܊X��E�5n����G�!B���� �y�
K�e�T��#��"��S�
(��I��Im�i� i��"`HR=� $�Zœ�a���Ra.�\!T��%���F�I��M���(%�P��m<��D�9�w�E#U��}9�k�`�h)/�#H��~(��`�����AAl���ف�iZ÷m�H�h A=~� �͂r%{�y��[��������tFF��=m�!e<U���"��V<ɂ�$ӄH
�|��1~�_�� p����@�@��?r� �Z ���"�A��6��0�[������ �S�*@�I��dK1�2��J�۸ҠR�!&{��8���M����b֜��[���䟚N� 'B���IP ����xK�.I��*6R�"͠[#��LB�����'FHAH�*AͰTH�Q'RRA�7I�ԣ0`K�I�ٞr,"�+��
"������!�8���\b�5r$��"��� In�1ԤH�	bJ��"v~�f�,"���$��oZ�H��C�Z��v[nt�+mɆ,A��S"澈�D��TR�26܀�r�Kjʔ���*,�y0��K�F������%��Dp�%vr�O ��W*���m�x�Y��hZ=��h��`����t"� �+O��� I<�+4�����34�WjB�;�l�t�26�tj钺��h��!z�������S��U{F�� �c	@&��r��0K�dI�LO���d,�H�*4��3�ǆg���"b���r�3��[�9��o:w\���ŝN�Ɠ/b�������)�R�M�V�L*d�؍�ʀ{�
�\�qē���R6$H�}�lҫh.L�#���. �抜o�"�J�@�'Sj=� �!@�Ҥ$K���j�"�~�`��1&N��I&�8 ���X��+�D�_R�00��a����R�2��	�)�e�O,� � ;�0X�m@hZ�'��ą !����=i��:�i"��\�pI��,�xEs[�b�'/���4�?�F^��t�F��pW�_4���e�jPH��{D�R�D~���1(�D�1�V��mPg���)F!��d���Uq
 �=���J���7b�� E}�DC��$��� Ѩ���Ens�]�ʤ�Í�,�|�.� �V	�e�x���>~��I�:������A�(�-H�%d�iCpP=Ŵ;�3R��C����D��*;�0Ō��*�\�Pm�u!����ɤ�L ���r�D���5��x��	�X�7l�"�8E���V)�T`�~� �fKR�1U�0\.b�*Ta/U�"�����~>MK���&z�JZ��@�D,Y�󢁔0��c�Բ~�� p�U.�R����1�����)m"� 0�g>k��F��!{�x�Z*�?�}s�b,�a���� ?8Z��!pȎo�T��,{{!�c���#��'�6QϠ�"�s9�'Z���ens3w� �$)���'C�r��Oz D���Ƣ�h����:Yfo�n���"�9���@�Had\W����&Ê��x�1dl*3TZ*y@qժB�\+�+�Rl��u'`�s�}Dp�E�!��
 T�U��V�@�\X�+6X�-
�ב(��������/)���Il�����H�8���Y�B��=�.{�F�Ea��%��tV��.�_k��'� b��IO�*\��Y��EB���s��Y�4P��S ��	1�U=ܦVYM��R�N�g���3wr�0� ���T�>����F�Oe�6,9���ӂ����$���U@��P��):�J( x�%�#@�s����+�@WV�&�r�Ψ���s���M6 �=ȡ'B���L�|���ؒ��Qr2�����؁�[t6��Y�� H�� &��; ���h�{~8��*`�p�ٞ=�qy	Ιc�јfF|_`�7�5�*��h�HЕZ#2�R9"x���j26�@�%!Y � ��j����yJjխ��#qE8��ѩ��� YG,) aXr���,��Z$	Pd��:���Z, P/�O��%��a� ����/~%L��Q�(%ȨD.#��l�G°��qn�j��{2�6ʎ	�{�	��<�����AFw�q� ,�OQ6޳*���/�Ԇ"w��'F��\b���wn� �e�dc=�;qp?{6�e�fsŦAO�"M"���ͽ��Ϯ�yl�� Q�σ��o���*°R�����9������<�v@�0���/`/����33v�+hQ5 �˻� v@%IY �
��� � "a��f���4�Ȓ�J7�[������髈B)��h ��р�A�.#��6�8�E�<a���-�2R��>Z�� �� �C�җ����>�P�CrO��h���昑���V��d#����0�b;�(t'@�U�.[�+.�I�@$�� �! �a�t)6�����2��H���=8������ ���I)$'hԨ�!�@Ј�y�8��q�(����qF�X O��ºêFJ	�#��0��x9�6�� °�	G����ЙL�3r 8��sBV�����
�� ��!������2�K	M<CO@iY�o����Al��'�6�C��8����(�:����\ �#�c+���h�q����A��4ã���L�5#	��N�Vh��E<�c�a/O(�X���{s�V���3h���b����������9R�Fd����x^���(�����H;S��6��K�3"����-%���%�%Gl,�	D]��[�
� �ȡ{�I����bH8�XA�����C�v�"r��c����;�H��K9̖�˩�*m
����&h�<UkA��J�B���T���X 狎ѳ�ȅ���t�{1��M*�.��;h���xx��	`�>�x�0Y%�X���3�AA��ϐ�T���AG���l�ta�t9��"E��13r�i��X ��/�Y��2����rL�NC*�)������\X��q
b��y���*@=�����	����gԋВ	� 	$�A=�C������ ��T�ܸ��:���$��ȅ6Ȍ�SN��o�����G��;\�����*��� �z�q�Ti����?B�x�Y[0��
%���IX���
�KS�TX�|!� sӃ�I8�x�4��åT�� 'o���4���	�ȑ|�<�hԻ.8H�Hk@R!���{ڕ[ �"�������Ѓ[ɻ��5�/��"Cr����)ڋ��%��� ���R{�y@�8�;�P�c&u����hˢA���B�KaL��.ؙRH������k��g��Qˑ"��a�O�I�0����	:���+�,�h@��x[M�K��1#�2@���������J��r���:��gI��9H�U�q����Q
���*ؐ��(��͈�Ra4r�֥���%C��;�Ȍ�S�Q-�@Q��
@��A�p������{M\�"��ƏJ�|3��-�J�߰�O%�����(,�XS%�?�x	(әM��2��S<#�'c->�i���0f˧�%ڃq�z9H�커讄���@�؋�t�� ޤ�)�!�ݨW��-\��)���z�31�?��#!��5ԋQ=�x�M!�]8'ȝR=�(��*�+Ϥ��+,�"��B�����4���ӈ Ô��;͈t]��Ј�+��`m9+ڌ�8]J�����̸��E��
BL������CJ@(�{���0J�4ʍ�����;(����H�U�踽�	�2P��3,���b�fR��� [ҩ:�'襧`F\��:�%���-���e	>8iߋ�:y'8��C�σ�ݍ���?�غ:���2�I�O��)��i������Y����8+"8����������
F��s7v��&$�������M����!�Y;' �@�R&�	cr8;� 8�6��R{ө�#X�p���Ҕ 	�{��p�U�)I"¨Uy$�/G�v�?�b��.HY��;�Y�꼟'�����p�J�Y�	���	�QscA��e�da���:�h}a�
�@���ڟ аx��"V�3�;V�R�����J�����o��^��頯ۘAt��e��q�H̜(9TS�q�/����e���(S	�)��J�r5���N{�"�s>)��6N�ggO�����%���� `?$ ��*�o�j�"g����!�[Us�6h�Uɀ���I��h> ��j���'��JY�o ޢ�����F���`	7�����Z�ϛ"4�^.TL�faۗ�0)��ե�o���!��	_� �ˈ�Q�aT< ����0M�����a������'�H���*��)J�����o�05�`@(����%��j#|!�AI��ΔdZ��ؑ�3$)n^��ֵ[�/��It�����
Nt��h�jyb��/�2�ϚӪ����k���̧ ����P����䦬�(��th��x�&r���A�@*�`���=�@�:51%�,���rK����Z�T���R��x����%����+���Ў���8\� ��r�)A��!'8��!�GJ����\��4�4o>/@�
1;qD*�h6I����K,$��2��#8�C������	a�A�@� ��<�����M���䑈��ԉ�{`�K���x�!�G����q�}��B�I5�H���٨�����Q���[�lɐ����a���63L꿰�j������U,��u��{�<�v^�f���h����҃��)��hŪ�#�/���m��ƙ��č�Q_������*���gAY"Xag���6k
��L��`�"���s�R<��������냞��6T�5*�7)���;�V��>�Ğ ���Pꋠc���g�Bd8��˩Y6fk�T�(6�u��bɘk8�v'$����(6�@[� ��Ⱥ�^����@��������`�h	�O���Pi�x[�`5�����I8���X-My)�6_���.8�An#�)��Ľ'0����+6>2�h�P�^�ZA�d�*4?;������Z��Eχ'���i-9�d!��$,zhY���	Q��gyS����p2R�N�1����!�IUK���h�=Cߨ<˟eL"�W�t!��� ���/���!��@$PF�6("b�H�F�6UV9h�=@"F����Avr5�9���� ��&��� ���-� `tQ�om$��� )�}d�+)Ã�0"�/����و�P9�n�
�v.ݺv���{w�޷3i����zX�B�JM?�U��� 
'H1�`�̷o�n�B�7���1�鉩V4�q�p��E��*���2m���0%����a��O��8"�r`~HR���m *C ���l@�0�;p��Qÿ[mz
;�_�3oe�)_ ��O��6R4����}��#����q�E�)�ІFi�LmG
0!D
����?�F�7±cK��=ړ
}@��� �J)v_P�r����7N2�Wb�1�H��d�6ڥ�}�Y��g�Y�ib��2�XHLc�1"D?�c�r?�WF*��� �D���Y|1�h%2�
_:-�C&5�̃yTC�,@�h�8aUW|3���5i�f1B��H���v�ـ���l�hF ��
�̉у@TAΜ�@���A~��cD�D��$l=F�2N�i�!�IU��Pj��P.06DJn���!Deh��E��A�P��PV�����j��*�k�@Pz��tQB!C 2�نl�]G�pz<h
��c����;��@ Bz�,3C��#	����*i1��Y(����K+�"A���fN-[�t*�X�ֈQ4Y���7�*��m|a�k�L��P��=D�PuCF���6*�|�3�q���2B� a8��1)3���=xE|O{<)�A�E;m,�P4&*A���#D� ƈ$,z*?�ZA���F�[���XF3�)2S�#������o��
6�dÞ j D�}�eޅ8*+L9j#S���#��E�T��C�Uq���Nx�Ft�9�6��
 ��>9�\�	�(؛]HĴ�0���Pp�*��]���=���"�D���#X� ԄE��y"x������̄F�	9��Fx	h/�2�� {#ʽ��Q��$�+X�J�Jq
R�s
�~�D3��e	�O:e:9*���H�������!@U���2�$G�bRA�.�# 6����c�T.��$Ҥ](0�?%$�H�ue(9��+Ei`Rp�[��я3��n�f�ʙhH((�[V���O6AQ"u&#�[/���H!���H!|a�W~�v��Q�1 E �,Fn���N���Wd��zIGVe��v����ED8����""�, ��D�	��有Z&�4���.�"�EK�>	��p)��7���<���dt��j)��\�R|� �"�MSSP=p_��iX�L�hⱇ�3;��c8��B�F�\D�2{ ��-N�ABFV��U�����j��u�7#q�<��D1�Hy42��AV#i�HF���F.�	׋̲>\��f9eWL��i�����s�>�
�C�JY���M�j�H���\<O&�Y�����7ꌉ��ȑ���&4�À�2�c�].�S�F��L�Î+�J4�$�-\��S��+&�0��&�4�
�Ɇ�8�H^�խ�bRv�`���<	0)L�r�dj�xk�6��b+c�,R3X�L."�ԩ�R�ӓD&���(8p�x�0�-t7X�e%�.�!��*X���R)!����S�CS� ���1��f5�t�R�CWmQ �n<-T�����*��ӛ�P�i�Ep#�ՙ�L܍�JR�v�5��C�ц��%�-�ݙ]��0"paHQ���>�PI � ���4ل��HBS�̆I��8E͒c����2٨:�EOlJ^,;�CbRΘ�,&C���X�9�Lr`�w@�K��Ȏ ���u�5�@uV��B.���0_HŻ�����F����\���ѱ9��u#<��R7!�LÊ�AQc��b�Wi�`!Sr�w�L�7�"�/EEyp4�0��~�tY�4P(��*��c�J��:�9R���DC
/I����Fx�TL�І��\��6�`�>��&��H�k,�� ���U� �'$񅨕Ű�Җ��Z7��%�D:R�,V;[Y�����H.�|Tcd�� 479��G�� ��(-�R��d����#�8��!��!PN礝@�I�XL�^����3O}�&�M�P����Tl
uK�$��y�=��ༀ��$tP�H4h���PgXL� ����`�5_��X�-�Y��C������~C)=��E.��-y+Bps�����#��� ��`�Y C|C��E��������A��$�2��l�K�T`���@*@�x�ԖvɄ��S_8L�W�,HL��$]{��V`樍��H.d���M���c�;�H��ĦmE(!&��Z�I��p���L��EÙ�IBa�AA���$X�lx�$����dh�ZD�~!U0��1P�\a��9���8�άə�e�?x�d_`��H BH�|�|��$�ɍ��lEKMd�B M�� "��,�L��$ށaO�*ԍ�eQ�	��P�\]��ơ��͠2͚Nt�W�~p�`�ō�8jT v���@. ��ɔ���OD��Mʁ�Er�;<�LhC ������ECx��M���Jv�U�J�֔N�]�M����SAD.dF�N1E}D���m��`D%P8�E��V,�x�9�$ץ
�0UXyB�5~dE.����B���؞��D�D�`@STF`h��x�E�F��4�N�گ��/���u�B@�@X0�U�?,�o,JM,�d0Lv D����D����P���Pu1���0`
#���g �-$
F8Ax܉.A�-4�DC4 «�� �A=me��	
��Ԩ8�ۙy5`C`]C��ؤ��D�c�F�D�1��W1�捊���� N��L*��P����=�YZ��E���MFH��f���||z�ΐPA����#:E,�| �-�[�M�w,�Y]EX�� �x�ͨ�h��ͤ�s�2�$C��GDFX 5�B�
E��Аi*eA|�P$9�eKx�]���D�$�#X��͵����H�'A�K�r�Y�d�f�R����DK�	V�`_��@�'u����Q;Ċ�x)L���`��(J�d���4e���դ���X�A�1��� OR�]&]Tp"A�����P��\����8��ޜ� ���F�DN�
L��JM��*�
�E�ktF$1,ه��9 )X�FA90�M�Ng��Q���@ZH%6Fzn��p	F�����$dE�N6 b��a��MDl`S��0�kUG�fS��W�Nڵ����v�L���E�C�Y	l����vLH�R�%F�H�퇗��8�Đ� ҐCN��K�IH����1H���	p]����
�R��C��l��LN���1`LFИP	H�%}�c0:�����qR>��$#q��^��!���@�AF������HtG�XI���XHw�Ά8D�E���5����GА�R�Q@�D���ihP#D���T��Fh(F.�ˋ��e��y|K�D���Aņs�Ȏ�ȟ]U=�G�1��D\d�A��iDk�@dhƘ��� �EEQV9
mh�����m�,y��DX� ���T���Gw���������|��(�"�= ����E
�$(f
�C`U��^pA��0c�Lڇ��X�#����I��	7�����Ź9x��Z����
�i��|�B۩ėChV��i>����V<����U(��)FEj(��BD-��X�V���QXI*���l�NpFxB�m��G4�)�7�
��
 &#֍ӊ�'dE;�S�I���%F	Ր��S��VLǾ�iՓ.m��X
S-�v�- �N�DtǻN���ʪ|�B=a�i�
.��M����Y�Zi��\�q�K����l�d�뺅�~��0��5$�D�k��dDcjĠT�	:�ȸE�̐L��&�`��e��$� 2�yf��oT�L��gjq�Й�.�	]C����L��CPS��S���F�`��82W�R���
�^�!x^*�=FSQX���G��'��U��N��ǀ�c���Kjg�� �{�)�Vc���RQX�/_�fd�4�$�DE�� ))Q�0BA:D�'�r�Q�݂<�VL�B�D4t�uP���L4���Հ̄�xB=��<�>6Q�-Ė9�&���q_T-���L^�tMDدDdg����L'�����g���`�J��� Aʜ� o��R�4�����tC��Y��3�#)Y��4Ō�F���K�
�DF�0Tu���/9e��O��ErN�Č|��OP���M�����F-���� S��mt%fE)c�D������kxB�HGN�1lH�̯�\|�� c�|�9��q$�R7��V:�lh i�{l�z�FX�b��\�r��~ �X�H�K.��TAX8h��D�})TT�@,`_DnH��ҿ���.f��@=�$��F$����IƖF^�>mn��(\�S�����|,)�Vt���Ɉ�}���t	��=SĽ ��@\�^4�<#�P��t�-W�r��|0��m
VY�d��%Ս$�a�In��r�H�vT(���Da��4F�A�k�p	.�Pd��qc�o���M2ghx�JL�l��Oe�\DY��]c1���p��YA����U5S,9D�=(L�����S�E�H�]�(=�ԸP��F$�9��N'����g����`K�YuG�XBlPCX���FK��Y|��(�Մ���j@�kbP�Dr���&Y����Z'%�i�S|�����a�����Ρ�7p0�کSTu����H�D�tP�"�k�|$Dl�����l�$�xX��oT�r����%�K�HĢ��x���xO�C���~�B,�xYɈ��WL���k�wbk[��D6n��5w[���I��R��)H�L��f�ɟ�D�V�����r���D�FFNK�w��Ţ��C����wӮ�G:^49��U(��t��ţ}ب�P��G��9=C���8��mx���؋8#o�u��
ҰM��	��\N��|X�W ��p�A_�1�d���|��%� 2xh5SZ_�RQ�Ekl��ǝ��k\�:�������$�� ��>���L�\��6b���G}�HS��0�Y���*�V��O|m�� �}{Y�Jw`}$�^����(L�z�[���~K�P	����C���RV8FMJ*|U����:�ա<�֓�P�#Vg3���r$����_�k�4��t9�T��Y�b�f�B�Jl"Ó��8��KE W�� )�W��B�%���LaF�y����h��H�֗h"8aG�^_�IBaO�
Iф����?���H��7'Ѫ �R��7�}� ��=6j�%�@*{W�1�*� �: "��z�D�
M��ڤ��(A=z�y"@�2�X��Ʋ!c�:%!�4�U�@�<���Bv�(������m��# (W���hXA�2E�c��g�eZB����jV!�n�T��iH�Hl ۆ��C1���h#S������R�wY8R���ק���{�ll&�#r�!FP�B�[�+��|P����T���L#�/��*(+�� �����)���iО� yIE,$� �����RȆ�a���P(ȓ�0�4�Ѡ�����n�iH�<�ſ�L�	��G8H!�����ڢj̄ ��' ��b��Щ�&	hkO$�F=X�E�$9	�/>�%4�<�2�"�.��b�҉&'$��lH���Jݬ
�>"f�n���o�|�	B!H�D�2O "M�8,��h�H��� �@!@�30�0���G�� (��P(� 6T�H1��� �
��Q�B��S��W!�4�ǰ����B�=���%g��p�H���HУ�D�������oN#	��Z|�=��ꨜ|$G�!z�zq2Ҩ[��GrX���z_=
��l��`9ډ v�X�Ė^�%'&���I�;� ��]�Bd4���h�����Њ+�ra�*��Rp-P���,��D�ߐ���f��gXk�Y�P�؜�9�6b�	�S	x˨���������H��h����TsB��~ D*d�i�AA3��d�ЍJECC	Ͱ��@K^z�h�h�`��_��sI���X��[N�����q��|/uRHI��#ݻ�}ݖ��1��U"c�P߆s��)�F�b�c��� (���V6?� ��3e!{��^aZAX���V�)�JCbT�#K�0v��f
�c
4@ �F!E���3��>
�'�D:���	j��-6�\, XS2��)�}cSA��$�H�|�� N�'��8��WHY_���,�l�7_ F7�'܂];<Mgރ��dZ��ZAV�����b��1&O(�B"�Ɣ���&�:Y��,5&�� ��CUaHm�2hۘ	#z�Cir�=[Ո{e"I� @u-�T����Lg.�I�h<נ/��&�2�Č"���`w��lp�[�J�zȝ�����	�����>r؏쳇�L��}���*��b'��&e������ث�:� K<(}��c��#z���C1@)��$	2�	MBA2�:i���R*�**L�k�A�˂�%��D�%�f	)��gF]�cp��B@��2��!z����;!#be�JN��F�:�A1� ��$dLĐ+à��8A6&Y%�HA����H���{a+A�&���8�C&E��g^��%�7`C��M���Ϻ��.�m��]���1vK!�Nc3:~d<a���ϰ�~��?�Q΂8�P8�ea�(����+dl�C�[�"�HY�t�� �d#?
1�R��q� ؤP�����:��-�S������C�����S@(L���:.>��Y�DJ���Td+a��z���ZECgEiY'��l�J3[Q�%�\�+X#� ����$�X�H���8��&Z��2Y@��	��^�� �d>�ɨf�\�����%H*G��Z���j,H̠*|�duQ 鄈͊�<!�C	��=�
A�Ire���]G�� ��*�	�-����r\e�1is%�,i`-h�rE��n�?�՘l��Є�;Hh~2����p��b ��*Np��>�F�Hp<�,e���c��A����xv*��,����A�A"g*ɥ�q����#�T,@�DL��l�O�@�l�Vgp4\Q{b��Ƴ��0�o(�M0�ʅ�>V`��"OV���Ol�v�Ġe$�L�9�ڪ�ʠF�4V]�U��V�C=��-H�2<Ĥ*ǔbhN٠CUars�dۤ9� f'R�6�v��?2�삞˽H	v��ZbR>!F��F�f��1�tI2���,�lG�
ll���2�C��;KA�$�-��Ԍ�Egt���o1UQ�f!�YF���i�f��f"bd8AC"(����;Y(�9�.d�i���Be4 { �%�x	;62��mYw:���6;��l��ї���G&R-HN�xi�&2�<���Tj,��҄���#Hg8�� 1e�L�o��90�/��R~N��N8#���zoB>�%���|��
�N��Y��,֧�L�7v�x��IH!'2�T��|ڢ����n���+�|/���$�El�'%�Ǧ��D�e�ʁ�`��,L�8�L~����*`8BC� @,������O��� Rmm#�.� 6�	�e�p� ��B4� �g"�Ca"�Z�~R�D<f����'�L>ȁC�M�j(!�L�������KR�!؁ΐ�3���V)�
B1���"0��ȡ�PH!T%i�	���-� �$���(��D哎
�t"U�(@ʄ$�b�,�bJ 4'dD@8�b#d�&�D X&?��n�FaB�j��	 �� <A��/�k��H''� D�jLj-�%��x>�I<���B<au���@/heZ~��
#��<N�C�DC��f�X#?��w��\X���
xR���j2��9�rb����x#�X���lEHBA>"��A�*�(�)'�}��$b�癩c^E��+^�#��#�a��,1�ǅ2�D,B��J�ԑ�N�Q�Hc�>B�D&.��8ȰJK���#�~��62��k3~� �
%Ֆ,�@�&��B��+��IT2АL*���(J��؂-����,�	N���-����&��*<:�pHH%bƈ+"���X&k���*%��r��0Ҧ/l�!��n�?�j1^B-�	�|�e�T�&Τ;��6� ��M��1k��B#'0��D� d�_��ALj��=ۧ1<k"z��Lj�Ҡ�~Я0,_H���(h� ���i���eR�+tML�?��~`5:[q<�� :.aNC���o��HF�
q5�q1��,F0��G0�2H��"Y"�9�4x���n(KO���<��Y�jlH
�l�I~�8���2� ~�3� ���^~$?~H)��n"hZr4-�����h�%u�C���Ci2�z'D��E&��]��u$�0������<�Y�ʠ(P@C�b�2H*4�.#!�K�	��%c	��K��C^�(L�A��IޓU�ʠ�(�0'���4\b�T� �ft�CH.VP��L>��dtU�.��#���8K��H�$�I�B%
4_���P	�$�`
Ɩ��V�An�Rna�pF8pä�l�J�BI�K��%�U(�Cl�krҫ�����"�r�iL�R��8lE+zP��H'�A!G/���B��j�Ƅx#`�r�4P`&#���,��'����F'�4/6���bor�+��$�����JB8�ȍ+��B~b<t�<s�4�-` ��!0F~R��i/��UöU��"n�=��ʐ�6�B�	D��)1Z�~z�( ��d��4�~ �R����K6�=��kBL`2#�!��J�����$��6#���|�ܮd0���OhL��74����xO'�jC*a7/�|���p-��#E�K!����0���|q$n�/~�R�J��N�֌脒�?VNXTI&���.vLRa;�qsDvJz�ún�.�f����\�%)�04��0,�����ц���ap�&�M@���Ӆ,�AdElxAl"Eu�GԒ:ʯE��{�qWo����(VW"��h�E�Ť��2��B&���tb=R@BjŅ��I���Bj�:mA@��w_�a/�@{TA��!F ��P�����(�N쑹�(��+�%
C�d�xJB�\��
��F��I`.1n"i`��%�	ꀂE�V�ІB'I��H;�pOP�z�M���.�ڢy����4�$Τ
��	�E	���&�˰�#/�`H�K�J�v�D1ZHhbL�':m` �G�P��
Ze�("gy�QȖ# @� �+�G����ٕ���3��Hn�#d�}�&�n�@�i�Z�ZwUc� ���<41�h� � HxD���<�GR!_�o��&6c6���R�D<�D��`��{J� �B'�dO��2��'��?h�o�D�Ғ%�Q��i�v�=���:w��ӈI�Ʌ�O3� ���EYB(��2�
?D ������N�^�5�,TB�L�K�zz%��`�yyQ4�aʠ
nA�X�V..ǒ:Ab��$�H���CP�H�*��#Z�/d^�%.'8���%�V�NBKr!��b6E��\�D��h�$/.dL�)i/${b��BE�~(-��h��Hd%��'��,֪������n�U'��.������B4�~�uJ�N�+�,�-��0cH�K$��y���XB�}ׇvИD��J]��% �FL�m+6�:�C�z'ڂB�+%��F�%s���*���2&�(� R� Kl��e#2;�1lR�1��� (�9bbإ@���2�3B"��X�ް��>��$7��a����(Ǝ�B�`bY�&N�1Ӣ��D����#�-�%������N���(��l��b�g�3 �3Ӌ�a4J�!rN�$�&J�y˦K*�$���L�j߯S��?��?n�m��Ir�C�zg���r��qN�lL�P0�a�����A;0�ׂ&��5�I��+'�ls ��ʩ�ra�t����ld�.��J2i�-�g|
�jG����fU�D�� ��H��4\�Ƅ�c��.����'�iU�< ��l��(���:"��r��}y�n!�3+����A�x�� �B�rU'"*'��#x��v�#2j$�Q���l�E.������b��,�h�5 ��R'��8ƎtgL�(�04��/���!�4`?��ݘgR \�_�B� �L���lC�|sB�r�3$b�p�D4@� ch��I�aH�#�~ĹKVbV�TV��AZpב�B��K�KdnE>��B= W����[Ц��zj�$��R�W�Kٵ�^�j5��B`����e]qtb�4h�#�{#�CF^�����B�p�$4*�Krt�d]�b#�	�"�@>Kc}FbL�����nh1����s��~ ?�[8��B1m!ԭ�/��������+��K����F#�l���$V�����U49���(��^{��e�w��e�Eے��M"RX�=F|�+�;g�"�إ�.�~�@��e�#<�Dc���v��C� ���OO��4��g�_����рP��4 #�Bd�""���*��1I ��cʜI�������&i`��Ѿ���2mn� ���?I���B�'1"�u4������l ����Y(�z=����T�����2g���˷�Z��n��5��0�wK�J_�9!��'Zd }#�i��ɤ�.`���U~��p����C!�m�Ν6��B�)C��[�c̆���#F B8!o�$儨��سk�νf4�nc��>���Q8a~��\�-��H䁛��W��?��}m��g�'"��T;���@,D�J�D�-01B�N�
t�AU��[B�Cp�����F� �d@'�eASw@�w]cyb����'���CJ*���C����KU������Y|�2�����%���-��a�Ĥ�
(��מ|�t�Y�Ն�6t�d(0h�߄7:���$�H�r�mVF�_ b (��^C6@�e$�D��r�,`�?tD�Pِ�@z��9�I�*|i�L�8�݉A6��Ж�^L��� �"�2�K����)UdCt����j��ӆ���A�C.g)1jDAp�@y6�P( ��F쌆;(���D��	�/2T�_�� �A����@�yu����&
ph�c�3�2[4�V�,���QWn��GL�p:ǎ�C�'� �%Wj���i���R��D����#,E�0�A���᭝N��W�}ByK*e�ȕ�TE�=m99�8�dh�dRٜ9Q0�1���, J�Qe�$?�f*�� z����(��ҿ��Ϳ�0����}��P/��~68{M�¬�x;w�{(R�05�3B���A���z���j�էǏU��`�5�p��t�z��rL��V�0�6���r"�R\@u� Ue�dp�X�`�.�!��C����#�#�R�F7��Z�2&l��(I�P'��(h�ZPְ�%+z���vT�W�L�3�h���@ԣL"�/��e	ݪ�c=�H�EABD@ �o ���Ss��`!pȌd�aD��	�\E`J݆h#�|Ag�#`>��V�M�!	��_z��M��?��^�5F����t�k}��dk����1�]�@����>T� �iHv�OP?��OU�E �@E ��V	���__P�Vy$�y�}N�;<�9�l-��F vc�B�%ȯH.,$��d4����	��!��M�����b�0T�Hg�ቪ	��Ic7��P狞{�s��(+l�Xz�&�f.$
�7�$P-2�[	��[��@�?�G��*�� K}�1 `�dK)zARA>F\���*d���D1�G)��FcB�1�jήz5&�)SL�豣vB��Ȳ�� w6H� (�*D�!�����--z��G��ހ�q��P��\X� �A�K�'JL�"�Q�����*'NX"2JQ%�|+7J �A�_����į�t�Wf�ĸ�O�+�3�$�6��%y+
ؑ<���-������+2':Ht�Rr5U8�| �B��B��ĞJ�ñ�/N��WV���٠
�JE\��_��	��SO�\�7�@���79����y ��<&�b��GR*�>Y��hI2�0	z"��c�$����m�Um���o��!���T���9^@�R!�2��w��w�%��oB)�#C�i=�`�2��z	��h�V��.����h�%�F����4�����8�xe�4�$[����΁���SJB�$Bҭ�`��X�`���`ݵ&Y���@Y!\]7Wů6�R2Z�MK��e��<;5\����H�d
%fఙ�f���LxN���@z���r�EX9��o%%m�v���V����h��"����e��@(�)B�w#jFH*|#dӆ|��(A�B=؛V��*]�.F��T���%3bX+��)^F
�p)�Fl�=���� ��㦞��[���f��f��iS��0�s-D,CY�� iK�����_m ���ָ�K�h@ I����:oQ��SPC~��i��.�>=�J�6�X@��3I�w2�(eO�#��fmІ���Ifioc?wU?���6[<u��5�wbvR��&#O�z�r�۠�-�*Z�Yǚ��״u��LV�(L��o�iL!2�~~� z'�o?hWd�bp!�=Ӆ	2H�t�+J]/C���-��C�X����0��<�����x{��
�P��E���h��m�~�_4`��L&���A^Q(8�j��q- � � 	N0B�@��	�a~)Q��x��W�m�qWȐ��u���"���AfG́�px�BD����21%�z@}��eU�wha'/N�&qS0��C�0?Q,�Tc�!,12�7r�HJ�"��n�׆�AVޥ\�d5c>�&>��XO�J8d�1E1�(���G�+��S0��"*e<M�z��w/��d��?qE��	@P�3;�c* #s��~��5/e�avr X��~[T5_�	:���(_`�$	&�`�(	Kwh��3��`d?peg� ������m�a��4��4m�)Ā΁r��E�xh�@t�Uq�tՁ�"FrAvW�ڃPK�/�`opp�Bd��*� T�����@2w���J\�Lti��r)�C2z�E�boyW< (?���E��yE�G�mڑ
��:y��_�w1a�$� g-r�z$����>9d?�>%�RO�u�c^�"K�WR��+�VQ�R5"����:��07O��,.�Zϡ�~\��s��vr=�A�EMNQ(�5%��v�O_\_!�8x&s��'�" ��+��Q���1����s��s��]xQ�a��V�	 (/<U������m0J+�/��-�1e�����G��"0-|S'�4!U87���]-��{m �y^QGxTf+L�E�>��+f`�� ��9��;�UIޒB3�G-���!��ur1� ����o�>��<aǂ���V1���;Q���'�5&�&�B.�R�e�o<����c?�<����w�1�����5Y������?� ='��X=�����M�Q%@ h����9<�X#��	�IL���#�]+�2&�ygfA���p�@-��U����i�Bb8Ke	�+#Da���V>!��g'��l�" BR�+�c'��j��W�*]q�2W1�KeP�9��y9�F��1�+(@KU�xeXQ���wer�Am@eY�+2�U?��7q[z���@?�r�HT� �JO2EP�&1�%�!C��-�o�?b��7�:�q������F�y��2�܇o܇����`W�8G�0�"n��VK��g����5Ga"N�TL����Te�B�䐍�r0&�s�F�VLR�"?qzr6,�⌼"t�!��Qj'�C�J��-Ჩ��1PB)���m�x����*�!��C�
!=O�0��R�GX�7�zE_�j;�e���!�s�
m�r,�Ö0��Iڱ��ڸF[���y��h�2��1����H��/+�$H+Ti٢X��t$bX�v�F�JJ_ �τ�=U=RD�@����&i!��#?�z�Z�~e ��QD�FF��^�U��t.�B6�$!�FJ�/���J1!�'=٨�@�U��RbrsvV)x�2��?�����N5��t����R��8����x�5�т顩)�*��]��	�����1�QѠ��h��	�g=��Y�"́t�4T-�̣=�!FT9�Q)�f$@���|sd��y�mjE)�Se5!WT��c1�����W�������*�vT߰ �T�qC�rd�u��yRf�㟵%Z�p��a�&����W�7�4�����a�¤j��F�&u�@�������/��VF+�pe8�0I(!:�x+1B{rf��%�9�_ �V�s,���_R"X�� �hQ'}1(�u�bo��>J�r]0ATQ��Uy�$2�-Zħ�%n(  t�!�Rf�<����ƺ��.����r���"64�	W�T�H)�-LB�U�@�*$�0�"�8~�Dӭ��x�.��:"K2�Q��M�d'�sW�V!�'$p�f�t��XU���vH.�l}��/��&ѫ�%b�� '=��UK!q�?��6 4��L�00��Q0V7+�ǩJd˄UP�`�<gK���ѿ�b&2�`r%�39#����+OC"�1��5�Rq�.SG
0�̪:T�R��_��$
q!`�h��i�s����5[�-N T�|z�����ho�b�WdI������Z[�ǆ7�&���8�u�'T�@b "� �RGI�p,1bXK�g<V��������"��3��(�Cz6�Z�w���Y2�#�d��Ĝ?aqH���R����/�0���@�MJ k^��!�g/;�rf�\b��sS湦�����g!����'m�r� jV��A%���%bp��6_X�-:�]���D�-��˭�|����l�]���=L2)ZD���<��dI��%��F��)�� ��^WV�#j��w����S3R��-epT�ݸ�ە練�	=m�#���p��*B�@KL�/�$���\0I��,m)�^�LD2�ǁ�cB�P!<!}eQx��O($+�@*%7w&���[0����s)���G�B�
��Y�s��&Qf�C�� �p�MKa8z�k\�'��-�#h�A8���F �Ⱥ	.O]���B������B������������"�Ʌ� ֝� �s���E��f1 ,�5�b�����u��0��cQb,�@�o���c%�{~m�0��y=%G��NJF�|c%|{o�/`��1:7�-�KD�Kƫ��FK�J�؂�C4TB�c���t�{6Ld���w�Yz�Y\���O��8�+m�@N�I��HFI@�F��&���ҷ4M��P�!�xCD&[&6T��%��-S)a�U+��!aM[,�Rw��"��T�������<�J�)u�������&�3@�	�^[~!<K��'Ц:I;0�5�#��G}�-�󅐮�|PYf�����T�2�/�"<|��*���811��J��o��*"���C�G�W�&Ut�]��Ad�>�b�k� �=���h �pAB"� ����?{�l(��Fm�U��_4HX�g�d"���D��E'��c�LdH� ���T�Pd?0���1R�� �@�j�\䨐��\8ɑC�;v���!`���heB@���h�� hA\r"���H��/"S٠�Aڿ��T�5��T m��?�D"�0�1�� pK�U�n��$d�B;�� ?~����̐����ސ���eHI�C����_H��e:,�6"�x�^=�N���_�|���k@�[���D�HY ���(��o��E"�*�%����R�$���0$Rl�ˢ�xҠ<��HM$I�j��QB�����p��ob'�Z�!��D��nlO+�!�E8�`�A�Ƶ����'\-/6c�RY`�\8��+��$P�N>v<����S��A�\�1'=�!�oV�#��ӎ.�Jkc��3-���K��Dx��)P��� ��Gz.�?D-��D ��\�@,�olc狚�A7\;�9���ǆ�\��9����ْ�F��0P���!.)� ��W���N{n��>8��3^y�W�pwz�:����	�CJŴhr��Vk��*���j%A��/ō���u��D�^=�	P@Ord/�\�����!�'��Ȇ6|��Wc����`�ҍB�q7�����V��*�A���*�D0r�0��	��_|��[$���6�hMO$���oʮ�!8�$��nqb5����J$i&�ةT$G�D�"~0L@{��I4{��" ${�g�E���$�PWY	5ʤB��A,o{6D����N�B7��3��8W��Y ���+�m��)��1װp�y/�h�W��t20_���Pk��:є�^=����F�?�#��E�������`�w{4`���b���� ��GB!)���2�".���X3ڈ$G��F�H�g!AKo6���@5Y{ �o�E@���>��>;�O*��b�)�pBU@{�I�-R!�L�j|"��,Z�_42�	��	A,){�hU'�;�Ȏ��X��B�P�e�=zhb�����=1�U�x"'R�P�3f
	"�����M8�q�B�*��n�M@7���+G_H �H�ҕ��F>8�ki�c
6��1�U")�N(#�P�rs��Qi�.�¤�q$_��й6�(�9���8��5$� ����SJ����������)(Wܦ��
6%Q�,�gr�-�^ ��c���Ӣ;�R�,'!E�
)H����b$A��l �e�U(�V4w�h��'�і���Uu�T��� c1:.�h�׆w�-�	TdTE�Ԑ�;��{�Ҁ�"��"y����?���HB����0"D�tB����G����J��0��`Bə��d5�XN�<�8�@�Z�(H�0Ր�E�Tj!����T�-���D≽�5?� E�s��\e��QCb0�K6@M;�5�J.;PZ2T���,	)��"ڝ�H�H�h��O�%��\�`�����QUH�Q��Z��O<�ĺD�*]c�E�c���hZ�I���5��h`��CƧ��9A[�,��xz��,`B�0�H�9�v�(C.$1�ɮ06Reȷ�N�$E���g� �V�]��LE��!bF�VŸ2Tf���P*t"� �| L�r��W&�/�_HO�tg1AA�#sq�8���9�r��ѐ�A19�����Hl0N��h�@�IŒXI�e��[ ���* W?� E.�!	=�u'�% �����ﳩ�c�ZH�B�H0��Ѓh���R���!�?1�d���,�b����hCo������Uy	T	�/��-!�b�𒊐c�<� �DP9�D�4�@��b�����d �����'i�P����l�#&i �Q0�!�N`&���{Z���bfr��<gC������h�G�"�7��ʟ^�3=��x�5��x����C�>��ظ(�.Ҁ�:����w��뀒HH8�b�7%1� @T���6�T$��7�$)ڐ@`S{E�Ҡe*��h	Tn��.���ؓ�Ҽ�g�i��	L�gj�y4D��iYF0B�U�6�Y��=+I��d��έ[B� �վ�2�=m}�/tD��S���9�`�R3�O5���p#���l�Xm�cюke/n������l�$Q�a��S��B4\��"�1S�	���h�q�i뾩�@,B*WB>���B��p=e�x��E���b�v�`o�YY��;��|�*��j�,�	�(�*��o�;���c��

r��*0�t���R�mb'����[����#(�����(\I�+B���)�D�0�H
�@������	��`�q@W2��� ��	rh���� �Y<�X�cу��(��:�I~�/��Tp�e�,�;����[ȡ6��	�2��K��2��� �7c�S��������ڈ*h�!���
���:1
���0+䒪�+�
�")R��J؎bqR0
���h�����4�����q�(S�Z��;$
�����荝3� i��I�����x�Ă�}�ں[Ȧ�@�("���TЃ/�F=�b�b�*�0�	mܽ��ӏ#�pd��
�\)�(� ������ .v`-�8<k%�Y�oЈ���C�WKB��&�X�P��p�6 #�or��Ɋ�ƿH��z����h���`��G�X�@��t���	R��b��"���\8�o��؈��h�2�a�[��"�ݐ��0�C	5��*(��"�hE �� �d���@$����X<x��PY����jOp$[��zq��Aޒ)�+#�<�2*��r�{��(�mB�"-ӝ�����Ԃ���#��4r܈j|�����D����O ������)�
�[<ȭ�讲cFH�p�����KX"&���#����h`��H���Ј6���B'���H�N����  +�q$�L
��	�#8�39>Ԧfѿ2�����*�uڠ����h��1����(�����p��8��X���2)Ȁ��X��T���� �#�{*�\ �o�	�i��p�7A��`������Y���j�鮭���̲K)1�(��`���Y�hhFh�*X'� ��8|!��2 Z  �$ZP���SMO�$���� '�|!�Y(=���ٵ�xl��9:	U���N܊/����
�T�1�9��ȗK��"H�t����b�i����]�[ ����w3���AM���S�b���@�i̡�A�/��`�/�H���/`:z�����`�[���v�����$�z��� �����`�RC\A��IP�E�s9�'�ר!Щ;�H�H� 3H����тM���۴�t&�:�f̚�K
u�/蟝DCd�A� �)�K�h�F��P�a�=�
�9���/��~i̭�����A���&"Oۈ%
	"Y '�	�X'"���i������������՘b���`{���sG�U@ ?�b�Pu��_1�Z\+$�0��������O��@���8�����P���U�9	
M��#��v��v"z"�=��	�VW[BְP�8��0����ȣ&��}�O�F@Îp�����}?���//È�2�ٝ�&�������h��I�\��Z��?�������&N�$���2��"������٫$@���A���j[)d�So��pۆ�&���4��岊|���N(�A��� ��#�o����=�5� ���h�!�H�!�(���Tp�B�B@q��=����D�Ւ���� ����Y��̐`�O�h4��;_`*\	����Y�A
� � ����
=]�J�p����}���*wթ�5w% v@��{%D��ڸ�E/
���?���(.��.S��Y���)$C��!=�	��	l2�( �0r�R�!ط�;@
��ɭ�	ʸ}5�L�'r�*��T���Q���]!���m����b&��E�C�X�Պ~�A|���u��&�7��h^�ܒШp�*h�
Ҩı`�����
��cc��F��*Z%Y��9A�u� �Gvp�HR\k!�3�aϹ�N��m�5�	J[��Qʕ� C+D����#3F��ܚU4�����;�5�n�Ký�q�u��@���1  
�����x"@�EO`&�͠H��U��p�����;
��e��}�����S��({(j-%S�Y۳�����rY���1�:Rx
��-�(ӗq�y�&"�bؕV|�1N�Wl@bff���6��7����a4٨�!��Z�/�S4�F ��%���d&4W�m�XY=�����@��� R�0�	��iڡj
�!���P��O�[A��(�JK��(�H*-�ٌ��"D:���҄h	QY:֥k5�����(���^��.�%;@�/�`����I��}���f��C�����c��o����$4t���S�*�\!�6̭Vd|������p�
jC�Փ�]�ּ��{�v�Z-�چC�o��y��؋Y�����m��#�����B%��N�����$�ŐZ����oP�A�!a�
^�kۥ#��o��yN�c����KOn�h����lF�vYUכ�N�����imO��a�QCQQ�LB	��(�9�9��������1�`B꾈�ˍ�
�2���:m��)m6?�	r;���޸�
$�	��@���h:�i���.F���T�ۊ�+�����H�[�3;_�p�;�.��y����j.��椈T8��Ȩ�!߬�e��%F�`�(F����e���BVm'�h���a���A�v�����{� �Iw��5��G=usu	iCx�������ٸ!�T		��G�`������4<�Q����I,M
*y�X�p��A�o�,Ș�]�К� ��>�.E�*�̆�/��R����4�}��ZQ�i�8��9!Z�M3Y
���ƥ\�]=��f���7[2�x��OI����_��5��c;��Gސ�+�_�Rs�Ӑx�;�e�	� �ID���mL(�P=��Tby��C�7ɑ��Ҙ0j���o ���wBz�2�\�-h�{�L�>yځ���M9��J�Њ�7I����I���x��z*T�WI���A%��sE.�9� ��s�A�
�,'g2��i��%lQI�Ȓ��I�"���:I@CΈ�į,������qz��Hb"���g�1����2"�!�6��"@� 1��#��"�x�8�$L��<!CF�S��<}�@�',�SCF�b2D��O=������(��0ّD� �Dh0j�@�\(	���@��p8!�����_  � D�F�������?U:q���T�n�J���T���;h�^�?�H�D*W�T������	
�E�:��EN�o�)��	�T����
t�2�3WLLRs"r�%��t��I��Y��h߾�E��]��e�F��HK2�3�]FU��}�Op �GG|�=�ID���D7!PU����1�)���HA�@0L���BM$B*utYA�y�O4�	VP02�L�T�R>
9$�Eyd��1d�K}ccA.��$N0�^���� "�N�@�(�����RP�q�qDA��lg� 2.���$q~�;� �^�@�#�L��S(� s|����Tm,�`����@`���Hҙ���|��Y���J"@�+���E!s��1�'�|�`N�"kK��Ho *6��K�D�5��[��C�� %�'��D�@�Q�q.P�OUd��U?))��2���t ñ��A}�X4w�\����}AQ�'��@|Q�xdH9���D�I8C?|U
V�D��E#����T)�!Y� ��3�A=�7��DN�$+X�N$"�|�����?�0��X@,4;��)eĜuq���k�6����k��jT�LES�T���(
f��E�@���$�AL@�1�mY�(��H��r*�.I$g�LVFUT�ҍ�J(�`����U���m�r�<$����9晪vle-�
_+�N9�k��Pe��qto.w�rU���P��3y�)Fܹ�Bv?��FH�R1PU����(��O�~b=@���]�\V��ԨRZ!�z����\.Jx�B��-�x�!@0ZL����%&��Q�n���Ѱ�5��`B�����$!�&��Ю)1����'�*�U���� Q@|�hz���J���@�	��Z
_��/\��S�p�h�&H��~��8��#3��ƐJ]�M��� D�D@UY4� �Z	�?�#�f�$A�߸��6�萑mPޯXw-����jNl�W<.J"?C�Ou.v�B[ڹ
:�s�E|�@���](�
�'����h1O.� ���"�=(wi.:K���4�9aj!��Aر �Cm�

>���C%K�Cr��^iM����i��n��=h��� M�X�ň`Bi�%d'J����L�����
X'� Fq"5��(F_�\ܔ����������������<�ԋ�� H:̓0�l,a�DpifL@�;� L� O��'�R�F�љ��EI�����"id�B_���P�El6�Đ:��ş�h�J�����m񲥠��̠ ,@�by����|���/a�/8��ڑ��~�]�<S��?�w��D"��%���̉!"�"����2|�-���H�zR�$�Z�Φ\��I�D(vmFϬ���ʻ�F m ���RI"�x��rq�D2�� BQ�R�j�ey�?��R����MN�b��z�	m �7ʰ���(G�G��\�,>(�_Q���Č�w�+	�\&AM�{2ԛ����}I�D�*d(��ITo�)b�9��VtD�8XWш}��96�*	L�0����}0N�CKe	��� `(�T�er��Q�OЗi^d{��fAL��,i��C0���Ƅ����l��? 	xIK���
b�ƶ�>R�o,�1�)SSSn����EIwڈ��D��Tg�:�VF��8���r�T���s�K�ȁR*p�h�F����T �(�s�Q��=���=�B���`y[44`�W1BA�G4�$E=��0I%���[�O����$&Sd�X�!�=�Q��2� �]3W* �5U%� �Ҝ.:����b�d� �J\n�O���%bE=�"���eY��N,�1�`g�>�FE*�R hM�޶��Q�����!ȫ	#�%�w#�fH�����5נ�5D  wdU�RwL�}��wA�&HG-�$��eh����}�$I
�1H�8�p���o$)e�!�yMM�!I"������Z�67�֍*�Xd��z=���{��#MD3�*������A�2Le����e�@���H�M^㽿2�Wk��ʙO�8r�W�'�������;�؁��D��j_�F)�2�_�����r�,��2�u$�Y$>��	9��w�v0Nl%�:�HH,E�0
��o�h,�� �܂�K��B������D})�K�ٳ HܙڑD�̝ԅTZ�UL8�V�� �Lk)]H׍DR4�ϔq�gx�"�"5�B��EI�|AT��G�����!m�`���= �O8A�яeL�a��55����$�\�x�t}�-p�$��@ ���{��\��܂Yݗ�Q\GY��y��|��e��a�XKU尔��_��=$ƘlQ�E����K�I�T�� A���t_�N���`E��4�ɟy�	�He��`P��	-��|��Y ���ֹ����clttF���$�A4�Np�Z1�I�� :^��� C٘=��$�Ь$�P�8���yE�I� �(�+n���pE�E�})�P ��Ȏ5SA�AYd"�pb[p!I��	a�������Ƿ��A�\U�� ���Q�ty �r)�LD�S�S,"^��\#FGlX��Z.(
;L�M����q��T��PQ��(=�Oe�%�O CT&⹄�W�
�bǈ�aE% Cb��� J�UD�`GH�xw��ȟ���4}�lUeU�HH#1pT�)��D�H��˄���` ����g����}��Ѝ0c	��U��JV��L*F�4����K,9�rY�(ލ�$|����&F�:�K��Ș�u�d҉H�[+iĐ`�p�#�(���7���:����T�};1D)D��m�Ɣ�|j�o���9x�7<ǰT��PH&9K���"y��I�~!�y Blz]y%+R�{��[�bL����V]�H;����{hDG �oĨ��C��Dx#,txaO�0�I�8�B��)�s5)@�` �u<R]�3~N"��}�gCj�I��CH#C��g�է���S�2��ʕʑ���F�0�9�Ņ��^L�����Ch�-T��Ѝ���-U�L��W �_$�q���=I��Q�AWH�P�����z
g(\[N���qLiԔ}�Js��'��*u�(ڏ(O^��D����
�����:Yt�@HH��l�݇l�H�
ghG=�Ņ���hğ�Kf��]A��"u)��,�7>�`�?�@��Cx@Dt�ӏ�1D4|���C*,b|G0W���R):�S���I�?qF�=$#dA��c�^�|FoR��5���Rr1,��׸�%2*�Hffz �A��q���a��8���ITd"�-D�9	2,t8P���`˅��N`N.D���I�P�b��O�����,I�o|��t��������[���N�ǳNetM���_� t2��� P|5E�� n���gpj=ɠ��P��+��V;������I>�C��o���ǤL�0H9��ӄ C�PUH��AA�d�	Ģ���]V	���^�\&тљ
�5�%�ږ%
J�nj U-�I��E���Bj ���Ʈ�,�(��A��`��K�˗�E��DG8�wE=>���	]�El�EVM
�-�Å���'4��pHt���&�(�Q!��_-�	��Y�T�F��E��I_4��A�_�EKqQ���DC�(�Q$D���"M�kq���N(��]A�h=-�Tty���	\l}�|��^�DD�D52���b��D�kH�P�ECD�+�V�9�G��g,1<�X�,��鴀\t�P�ò�"W��U  ��-�&x��O��Ȍa����P]ɂ�ӡ��P�ѧ�G⠟�T�a8ͱ0�{��!�Ăh;���q�G��|TĿ��b)�H$��ʥ�����F�p��L��$R��ύ������4]V\��7����ѫ�� �_�A�[ji u��r��lD���I,D�p1י�M��鈱��j��,��)��B������l o'�|��`�B��Δ��C�C�˹�`�Ec�)��$�ot��p�E�����̚�f�L�x�����Z.���3Ì��T���X�	�U�Ł�OAK���yh ��I}��R ��a܂�ae蔪)���.ETDZ*�M�<�`N�*!���F3��Hn�e�4/�\��_�
P(�y(���_\�[\�X�~���ġu�A��\�4�~���W�<<_H�C[�<�9F͒��L�F` ���CGgC�X�Ę�A� 
Y��TO��$�H������2���tDZ���/U���9�tWq���5b��7�ߗ���X#��'	���Ԣ�C!��P�xD_Gb J�ɓ�YU��%��Qt���y�Q�Q`O��/)����BN�U��b�m�
�-��0
P,���7�l�5�.�lP6��Qak�s��FH�e@�E���ZI���CTl5i	��e@������]膄	,H"DDe�yg���ݒREZ:����-Ȭ�VA�ND#	��n�P�
�k�E.�6>V�`s7�aA #$���!-m����DW*�k�P��b��R K}��z\��4֭w�d��-L>쐔5�yW��AV���|ī|tJD��Te��SU�TUb�ꔹ����C�J�fݡeP;$w*��(YP��� L�F�(m�=K/I�WY_��|���3G�؋3U	^?f�XD�<�]����J��GЫy�a�ŝA t\DG����?�
y<�*��������Y��89B�Έ�	2\���D���#��UL�'<�B+[�9��C�D_#"E��TmՔp�|�bOD���E��	�H[� 7
�l8/k,��MD�c]�A�EÚ��С�KD%͐æ�Svy`B�g��- �����|�;��g�=U|	�B�����-�D������qׅ���U�ŵ��b��� EV$�8��痭η7ǘ�_�;��$��]�C�UT���!]�u�{	�NŨ��e�)Ax-`�(��HG���B��c=�(���R�1��m��`A,�����D���. n]�jg�DƉ��|�LX��1w�If���$��E���X��7r��[�yb8�R�O�7�����3^�t�z�J#����~ھ�4a����9@�8�`A������ @Ȣ!���=R@  ��� �64ؓ$��-{_<�+�܏2���
�`�� ��6r9iC�[F�$�$ aAdz ���E'�J��&{(lª�l�[�ʦU[��@D�d��765�b�SS*��/O�r���  �� �� �l���)�,`��Կo�M��gO�/����k��/���p,�GJ�_n�kY ���-$���r����1��yu�ױg׾��=N��`��:k��h�K����d9.�[� ��	�'�\��!�.�������a�����nO��E�  I���r�T��G�"E:�!�5Ȟ*"[8�:,;=l�8IlQ��+H��!��TH!��o�KE+d�)���l��vh-Z��'IF"@v��3[;L � E)𜨂b<A�&�P ��l�9���f>�@nQj>�4�f��\� �r".n���\x�����-1��O�L�T`B-��<Y�T� �t*���	��ɥ'�xI�M�-_�A��L�2��M�!�XQ]�B�HQ�9=�r�@F#Ȯp]�ΓD�LW]�)C=� �C��i���NI�8� ��t��� b��@9��eQ�P��Q�zȹ\ܳA1v�[ �%`A���Z�������(���{8p,�`!�+؋v�*��q�퀌�2F�P��ۢI%{�!���a-�p�������!{Xs͓h4X����Ć6 !����϶��r�a�̻e*����1غ*�I5x��B�p�/P��2F���\�@��I
�2��	���-��r�����47��U7ib��B���-� (#q t���P��7��(�0���'�ua+�����أ�O�\��+O�o$����UR���D��ґg�X�Hd�RA���U���\4�N�@��&	�
(��� �`�H�K�F�f��	���.R�
W�N.�"m��w����=��L:EiV4�W�6�=���h �/r�VI�m�T!b����ķ���6p�^�	� �_ �PPrL���;&宥܂��_��ź@f>���
� K٤nr�	���24勥�MR^��E�����o�G1�y������}!�F#H�!���$qdg`r��7JBKʊ�*�j�����ӫ����.��7�� ;�7H��T�H�J��4�(�ؠ�1��dI\�<�5�k\M.��Y$m�T��$���٣��C�zF�s�1�>B
�g/�ӎc3I��h�,����J��!U�r��[(�����Y�a*C�1rᯥt�3��e��*��+?�Ǭj��$��,L�	1j"`I|"��p��n�$uF�#)
da���I�f��3���:T�c�0�@ڠ���l��x�ěQz
���@Zhy?z�Q�v�d��<&��9���u�E&���ŜD�"@)F�OT��iA�$�v�[��{YP���Y�� a"��C��X�lS�����I�')�bm�S���Zd��VX�1ۃ�-�"��-f,mp�b�Qܱ�cZ�-8 ,���	#c�� eN� �$8�E��F`KA�n1B���1I��k���Md6�
��.�D��ɚ�8=��#"�W,����d���KP٬BE�4�$��=�C=ȈI�P%�p�Of�A��H�s���`�"��3�����U�KH��v~�=�Z�j��.BY:�c9'mh �FC���~����Î\X�
U�� ��*ŲmT���P8��`��BcY��?3#e^ ��Q7���<Ȱ�yR:r�Wk�1ϟ]�΁�����z:�Ur�
�	k|l ��Y9HCrkP�����E�� �d�T̴3�m�iҪ��L��&����p�"W�e �4��jY��~pb�85&^��u
���te�����?�������1dM�7P�����4)e����\, h��@fT�E�f^{�j4P����K���K�<�u�$~i�:�H(�ch�-����rQ��9!���'ʹĪ7i�y���*�)��@��j�OC>�߂��%ΧiY )���,`��d�V#|v�e��y�<UOWSm�c�w�p�lI���l�Ay���T�����o6qB�x�O�L����tԣ�I�"� )���B�wE�S��]c�=ڮxN'oˉt��]B4��xs�a��*3"�qD����*��j���dH0&����#SQU+��x�&B��τ���vp"�xZ��,��=>9&�^��ؑ�*R�Ę���2�Em���	#g�x'q��F*܆#��z��"� v� ��� r �t�cTl�f1��E�VH��	�6��+��md�~��i>"�Ed*d��>~)�"
;���C��d��#���B,l�(�/W �%j.����f���D�<�
j�����.��<��M��"&C��b���%Т	�yD΃l���B+
#�D"y���~7��h���t9LN��2��^BX	&b�P�i5�h f�:��E4���8h0���NP lR!&4��C(0k��,>k��,<P���澅)h�k��cdJ� �O*�@���N�!4����f���2tFX	v�04 \�h�~�XO�4�W `�ī0FJ��D�5B��*>�� �I����$i�k !f��ǢdV͓�aR@+��l�H�~&J�k-���=RAqx�
r�����>`�")@���MD��P���6�"2�D:�!C���Ј3"� ��<
�GNZ�`����EN�
`)Y��B�t��x<��c�����f7<�E��NCdr�~�M0��pxJ<k��kk존P�	|���M:���(=��<@�ɣ�D�@�g�~���#1���p�!p�
Ʈ�JDxX����XK"x�6�R)�?��R�G\�����\b�l�{:�:�	����BRm*��0b)~�����Q*⮚BI�M=t��B��.�ff��"���F=�auP�P��&أ
�-�E��È!ۈhh[�'Zt7�n ~���A��@B�CDB�����-��.�É(��$%�;@���2A��&� kPk8�3��_�)NZQ0r,,Îl��BNST���b�:�C���<����
���m�bd%�f <!�P��0��d��e�p ��F�h��FKCdb������A�Ba�8�R�؃I���g��k�Ċ�B�RT4lD�,�Δ�"��!Ȅ#-*�f/�l��, Q)�M���,f�
�"x���ZL3>�$�1R�U�,���M^")���BB j5����3WvL N�XV�0��+�K?�N�4n���SK5쎅2Ю ��:H������:R!�t;t*ݚ�=@�	H�!,l-���L��|�c4\��	A�ln!V�I��<���ڜi瞅5���>��n�Rd&��H�:�H E�4 lL���F�oRvU]�n��dA\�44���0$U���Y�/ ""�*q|���B���@��D6}R@��x�|�Kͤ&ʔv1\��=��G�7�� �,�F)���D�4�@v�d!�&�t��0C�R!�G�t)1Tf�"��,K�u ��T�S�,h5 �&�qm%\�P��v/��E��G��9�N�B�œ��X��
��Sʨ���;B��V&,�Cn6�l��&k"�`>F�ړ5�%�h�`T|	�(*�/<A�8��j\�F5EPnj#Ԃ�D�V3�4�2oW�
�	J&�Z��8�X��d��dgnΉ�`%���N�c"�~@�꩞����f�b��ɜ#@�G)�T��Ej�9
¸D�.�ElB��Zz)���l�
��".��"h��2hj�f��`�X(6�dSJU���"<2\�(h� )Yd5�b�|t5v�5,�D4�6�h���t�����,ψTS�5� ZF9�:f	}�u;�AC�:>%=�
�F
J �-�L^��B�B�>�an��t��hє��CV�^4.����@���Ad"���&��Y��G�X�0ᕕN��^N([#�Gm��:ı��J��{�'��j>�R��8�²'8I�~��(O;��X��*�`��p��ST�5�s��m|2d"�[�X5I�	ဳ��j�0b�6�;KE+F�7�;�!=1=�A�8㞆h�`�Y����G�4̃>�Lq����_��f�"	N (#D4�}o����-"#x���ZM���5Z�U	��7�ޅ��6�b�"�q��}	���|$��M12��.T0zC��a/P�e��#��a�@�i�'OF��X
-�B"tu�~��V�$��K��6�L`�"�5�E�b�0;��޲Fn�Ct1g�*n����Kۊ��c�-"�Fn�z;�fJ[�}5 .��,����-<(�ݨu����&���5Y�,#&#�
�*T�^�!�0�6�����xg%1��9��GȐ D�X�f � 8Xc�d��:ЭTV�6M0�v�Di?��F���l�c�ڟ�A*�k�e�u�G���H �r����e�&��D�B�E��V�AF&��Jd ��לW�C�VCZp�� �c �K6�����	��6�-0�h��"��.J�.�H�d�xI�H���n&^�4�����?D�ā�ͪ@�f�/Zf��X��S��ݐ-*pj���~����b���+��Z�iK�P[vL.2�"�tE�\�mY��M����.e���^W�J$�H9�e~k1��nB�v�T�-B� <�:�a4��h�шe� ȁ���/��'��Aȁ<AjָDa� b��Q�� $�)� �/b6ý(��C�1���`m�=I$����KD�,M �?��d�<B���B�E8k���:�O�7Nb>P�a��0E@�G�7�� b'�ĪEs����d�ꢢM�.��ׄ���M[��Fý�"�(�m�Ͷ~F$l��dݎ�^�TK�1@Gץo��F���+���B"��f��\��88��$cM�W2�bF$1p�`p�4f�T�H�9��:r���{`��Ӽ�P���Lɡ/ƃ5�.*|z!�وC��c"ǻ���X�_^*.t_�����eRU @�c�mL	�5G����0�C�$��J�'��	�5x�OKBtV&>�0>?�3HDv����3r*���g���[���(
J��C��9ء�`j�'4 'g�]�e�Mխ�	� �D�S]�M��6����6N�1�B)z�n��g-/`��>��o5�{f��r��n�mt�&u�?�D�&y@f9�o!ڸ둾w����k���I��Vʞ�|/�H��"���S��܎�*<$��ĥ��3J�E��j�5�1b��RHB�!�|�{Ɲ��SƎ�'U�@�G�N��w ��@�G�_*	� �a�T�A ��F�I�`��	K�B@�o)�-  �I�$`�#B{K�$h�[��Ȣ!�%ɓ'F�$I"�*U.bĐ���^�o�n}q�HC'��c��$�*����Y��7�/#x�R5=y93����Q�#'!����/'���hb����� #��|�`�XbA@�B��|I��Z�sW�����͜�0d���n��s����FB=�BQ���e�cG�:�/���ݝ�m��"z'�9?�}�����_B(Q 6A���ˁ��G)e���$@� �T���`�}�RmE��]� �?��\D�b@P�/U
 �D[z�����A����Б	U���D��^*HD�HA@YB?�FP.%�Do���p%喎?�� 3��)�9F�U�DA{� 
:hI� c�-��-��Q�$�Ph���U�}_BC}C#C7S2��(P��:��L	jPjh�D����hi�9TQ����
��h��@��IB 2�ٓ�\z@�����\�AzK�5�B]h�DLw�FbWkT݉�e	��h�%Dp�&�?�����%B.�z�pV�GL�~�A�XI7�0\��*1���	OĔ�*#Tq��;.�b��B�/a�O��`�h��i��8��(�ѐ'o�pq��S����9H�2v�@��|1�jX�rgDQ��Z�&u���Ќ�f[������X3�`C��!W*��B�-�t�¹���TI�'_D�-T�#����\��UB��s�����?�Z�Q^gJYτ�ew��#ߐMl�ip��#��B���??T�h���s�&�h��Nж�����-KW�@o�h�l�����}����"� ��NZ��n���9�aq�t$3r�)"z��O���B!�m�
�W��Dv�2槣� N!��S�$q�DI�p���Z&��0
�FF�fy+	1���/@�m���@�!@
H�����:
��&L��A
_��A�����ސ���7B
�$��GV�@��_hH�J�Ip�#f"��D8
jC�aP�����&�{x�䨂�'�|m����G9��Ď;�E.���?	QN?ȗ���0�"49�ƞds���v#��o���@� Z���R=���aN`G�"Ĉ�oS��Ԩ���Gk�AI�r;�xR�Hl��2�6![�:�H�#����(.��jj(RZD���80L���P��D��F����؃"�@;�aD�8�ua��bf�@`���@N��X�
'
�:�c�9aD�˓6�!8@$4B�iJ"���3a�zҙ�٣�"��X����_zx
��5�eM2{H�2f���/]��.R��L+���>���P0��F�� G��.��ɦ~� ����+1R��_��	}�S�d��0�X��e* ��zAAjB#� )4���H�Ar O��D��%�F#Z��6�\I#�3����,�v�L�0M��R.2܄������nq���	IP�A�N��H�H�	){�0��p�d��h���7�C�S�d�%!EH9�@,��.$iW�6-!�0P �>\�k�Ig�51MfN`"�ǒ���@уvB���9X�r�g����!#	��*OLr����"�-��O�#�R�:��@��=&���%JK9�'>�ׯ��NEBxj3&��N�$�edS=���@ƁJ���DIB�'����m
�׀��v�"�(��	�Nrj�=4 �_:��N�
��`�A{j�|A<���������Y!��)F���e'��L?g�:4�n��AF<��2�pG��O���ӓ�CHV'� A;��m`dGE�v��� 2��W�7JC�$�HFPp�@��WIB>��º_J�	�-��t�ϕ��"=�
�������ֵ&�/^q�Ę"���(�� �g7{��´���|�<�L�t;�<%�l��
c�p���qH��ͥ��Bj�&�����T�ޜ�;�>(��zi���}���>&�?�!�0�2���1g���ѐNK����xfP��r�a�|�o@�bK��x��9'��B>���Gl�_b��1��,n�"`�@V��u$)Q�Ne㚂�	m�v2�0����H���Da� ���Գ�}�+2�������k6��� �5O��[�p`�י�ގ�`D$������@<��f�yj*��D��K����
�D���<.".w�����*�]����OC-H"�E,�q�h�P=��H|�o	�d�h��[C@�OJ?�1r�,@aR	� hN�a����O���o�Ձ��#g/�4Q�q8�aK=TIT�}�a^��(�E�&�@F
A�5�Q&�Pѐ�s8� �� 	��	.s��.���	2�7?�2HC����(S!Vq(%Q2S5\@���=W���T�m�N�*5�C������`p�<��TC��� �I>a7Oև+�c�q}�R�LhA�5��5"�N�+z��0'qH1O=��`*�!�p�+��%��%"%XXc�V"�J��JC ?��bV�O.�0R�DG��O��Z�EB�%}B-Te�$�`rX�i%�]dA�Ă%mTTO�[ga�/O%�o�!'��d�F`�R�c:��w�AhK��1Y߰j%�G9����'OuV��d?�G ��#^EyBG��!@�pW@�%9�e��p�@:�"IKS))3�C'e:����&$A	[�FWBQ=��^q�+1P��p ���3(�����h1U��|q���E��q4SJ|{a6?AI�PB���	C�n&,�%B'y�.m�Y"`tDgN��5���n���v`]%֚�ݑ`�<��b�e��~Rvb=^BA���+�Ga��=�� ��A� ���\�hec�60Of�Kh�AN�A��<�w�b��'@�}0���#��5^	�$h�;`#` �F��9��
�EIXJa9���B4Hi�Q��DY�u4�g-�H_����"� ��i:�7���RB
vi��R��Rr@�5.�*l�+����Q��}B��5�PH��pQ���_�(�d��D��&�']Rc%Rv�.�D;ҙ1�;���@��0�1W�c�ѐ5���U�61^?@��ցZ�"jI'()3�����&�>4,b���1^�{!;�⥚9J@�b�4u���I��A?�Q�4*�+I: C�_���3!��G��:σ#U�H(�P��d�N�p�@`@�S�Hi�/#�!������ G�sYSJN��
Q��TpB�����Z��.�	U0�DYH82�������b;�p�I���9�q��bi�L��$.S�p 	����SE�TD�4S#�Q�6`/��/l���C-ͷa���F����G��wIҧ�7�ԏ�Z8$�A�4�$Eb9���¢h��ڥ<9S=���ah+�N��K1/UA�Q���i;�"�f��	sqI�i/T"�0)�01yZS	"3r"N�?��#��.�Tz����#�+�#�����d�s?q_�"̚"!E+Rq�2H	�DIy,�dJ�^�*	�V[A�P��1%xxa"�?��Up�Rk���vC�)VY �s��P�5F� d�����25�b'PC�B'�.�k9@�l&'&	�[@� @B-�Ĉr����h*b7\Sz 7H&D%�YgUdB\/Aw��ho��������'ۓ1,1m�A]�F�T�qrn1�>������!�۵�2�5���]��cC�QHp�9�$zI�!�-�P=(�;C4O�z�E\���@�KPq� 7T��"��$��+�b����+Ᵽ�G��]h��m/Lzz�(4$�PrS���2�� ^HR�!�yV��@
�!7�&Sӂk�0:T'h��5H'��nǙ"İ�t��'��m��E0��T�ײK2�MK�p�+6k��q�_A�
:�?;�kB�/'/����=̹_�bL�Tf�}�8G<w�H�'\��B�Бŗ;U�z�H
%&)	�'zR�9S�'�d�:^�+�~{Ĥs(P���U��,�QU�1�Q!!/���	m�y�m}� �3���:R!g��<q��HF�!N!	��NG<�"ePe[�@=�F}�>�maT�h�ۮQ��_1S�.�;�\'����w��Ze#IS��Q���v�5�+��EN7���I�%A-n;t�e0Mep��4�� 	���=ԤO
�m� vHZ�
2_�B�#GSN�
�G@ֆ���;Bj���8gĬtTM��M
z�>ص� !,ϡ�tM�]73Iǆ���'�bH)���_2�ۜ'6p��
X���\�"�P�6�9��Sô�z��Ւ�-�,z;�h8��V;R",��4�@bPE�SGə��4l��dݨ�A �B�Z|5�\�J�X�=�<L�r^8k�@ �z 	��m��xkU�A�S�>ᦨ��z�?��f�r�M|�1]S���&�8��)��#�m<��~-2�p�SA3VA:�I���<�O6���P�����,D�|_ �ˣ8�EyǚzBG���W~}�E�+IZ ���q��cG	�4�!&XA
$w!	O2g�+%��g�?H�6@a'�����/�ԁ4K0�A�8V��Զ�1��/��?��vTʔ����<��� E_�D�"��aQ�<S�/��S5VSʕ�5�
0��?�"�|�>�RY��` �����k���۪�S�Que��*����}����$��TNҒpϩ�8���"r��4�淀;J���#y������Ǐ�m!!�{��<C�6@G_P��g�p��R�R���n�w�Lk�
=�5tg�+��bR�F��F#QU�<?����'&�/��h��T)bE�?
��Gg*;5q�c$�&	z>���=S��A(,I�$����f�h>�^�����2W������n�{Q��R��kep0���a�z�����?�P��F&�}��W����W��&��$1T�}��Y���
Q!��]	�(�D��.�H��d_X}4|R�c�$��3xWU3(��n|�%8	�89˰�	��v4W,ׁ��1 t`M�4�c5�Qa���gjXHq��M$FɝY�́���B�9M�4���]n�̎�韬U�L$���4,	�/�c��d]ܗ�	���7�����l`H�
2�=�XP%U488�T��Ǐ"<ٻ�K (D��X`�F=z��a$)W.b�<�$���*�Y��Ѣ h� a�FJQTѠTU5���e@�n1
K� R� }���RU�p��n�2y��C
�-@�n�d'�`���<�1b���#W���\�R�%VO8mڎ�)�P�x	G& _��NE,W4O�J�(�9���	$�e 2����Л�{��!�ω����0(���6��J.0ڂoS�OE`�@R���C�����$�&����<�*=����H��#���T��8�P(�1�8��NÈ��l��� �D"��St1E{��#�'@�"+RJ#@�"�&��b$�c+�l E1{���/bH��*�� ~ �	׾��툉F�~J�*~��K�4@���Ζ\�ዙf��h>�D�IeQ�nQ��9��	$�ZM�l�������<�曳F���^�Ѱ�$�1��c�2r���6��6lb�$H��t)$�bM%�4p­2$qvȂRE���������o  M����Cf���I����ּ櫏�o�H�vTN;��P�B����H�b�oP@�"&=�<��Cq�bU]�)��͑d_�e�l� 
�!v B�PZ�49�e9��l#�'l�ԆԸZ�*�(CL'���'=r�5F�0�&I�nz��꣸�4۴�	�ӥ���,�I�O�&�6�agGb�!Q=fkcm&�(�4�@���Oj����FyF�˼��\��Uv����L�����N�J�H/��b�9���v�����bp�s#/z�}���4<���r�`>rx�b.��������͠*v7� N-�a�|fL RjK1��� YhV�P�_��8�}(ɮ|)9ԗ���! � �I��	�i��x�=y"-���m�F�h��E��P�O�/_� Ҙ��0ds2�D��[���\�H�6T$,3��K�V4���gcbY���Y�A����	R}#F���J�x$	�HIZ�SF�/A�˂CM��#���9U40�͑,�)�c.�A4=�[j�#b��+<�qB�Rb��@�i��y�'�vEC1䉢1('z�BN��!�L?��A���G�s��"�
U�G>	�b�q��>���=  ˃���Y�z�9���ښ� t=�s96t1�!�%�	��7�DF0�k\�U�rL'8�$򄃳�I���o�.Z�ء��<mgF�`L$�1�
J�b�-�H=��M*�K-zѣnt���Ĉ� bQ���.$�|�Tr�Bb�,�h(���8��D5�)3��d����b<��Ǥ�D�D��� B|�(��Y��m2B�ȹ$����<+�C�>Y�� ���vQ@4�dR�@�̂x���A&�p��� �22�׹� iD�z&��!��2S=����� gAΛ�&BF��A$>��P��%��eu��P�ԆP�dV�qUtTz7�TImp�U �3f%�z�\��	 �j1*�Ң���� md���-�y����g"�n�A��0b�.����O��W�aҲ4�Bκ|2�Nꉪ�΂f�`�FC��-����Ǥ�C�F��*�2|'��sIiOE��0��k5OynT� �+�! 1�7��\Pq!�%���2a��f��h����]�R��|���S�Aړ��l�eq%�ʊ�=��O@�ÔJ05)I�sTN^��"[�� "���v�0*uR
l&%�������aDl��\�k&j�:����$gU��*�]I��ӭ�D�� �x���1�A�nD�ˁf[���8�5�Ғ�4�����M�����/��.6$
���h �ʲ��$!i++Y	Ҁ�R%�&�Ri�	Rd��!�����AV�~+��a�@��d�؀;yY��>�<�ю\�gb(�,F7�ڃ�UG&4&�����t�s��Vɒ)�Q*�5�}ѐ�w�e��!6 i*n��E�EwMI�1��A�t�3�J�$����J�J���E�VVJ4oUR��	[ak��HA�N�9�I���q�o�$QmŘ���]�VĀC<)�s���hq<A{��I�LL��U&�V� E�򙩔!|n��tU}�����UQ�jj�3jW�D�:N������n0}J��llM��z���8d|���ۑ�GlW�68��s����~57X(ֶ�'�����$�4p �ko�3�}�B��b�-W��!91H�(�!��`��K�x��Gق��e�jH$4�'Bㄷ4DY6p�nر�\̨=AH�K68�*�����[�)!��(��H"���* )@�⭊h-�H�q�� ��2��r�dx�h0Z�\��b �?�x����ͨ�	7b���\#x���� @:C>�	' �\��*�\В��'-����;*,
�c���=)�x��� A�8q���B�K��@<۳�*����h��᪂�9�h��ñ�17��ӡ�#&{��n�*����������#�!럃����p�>D������(��pA���.�K����b��ڟOˉ*���
%C�j�q*�\����h��b�
6��M������p��`�#|��I����8`��ȋ٨��ʍdb�T�!q��(M�ĩ���/`�� ���H�Tq���h�2�dP�y��	��FI��	&��)z����*6�X	/���X�GË6�
��wbx�h�+��{��k����j��8; �豱���P�X ���A&j�_�1Sdo�,{�
���;���P��+8C�����e�����D<" Xq� ڊÂ��qA,
�`?-=��Չ'7�q���Ȋp�H"q!e�5'`�JQ�x'��$���@����ѱ��IE�a��9��?�)4b���L����Ќ���a��@I� 	��������V��S鍂�����QFX�[��WJ��X 9�FU�(�)�����Z�/�
�	8�7��ډ'1�ȴ�������蠝� I{h���={Ub��� 7�tK���<�ρ��)�d�Jrȥ����Y��xP�"��A9�ѳ9�	-�M�{:���!+���(L���
�h��������H	�`L�tN��;茊�a�m�?R���d�Q��6������S�=����4؄+kN��
�0�e�G�!���2���SY6�`,�=�p����1��0��:����D�)A�ƚz�����R"��)��
������b��X��yy,�X�����7�@�����Q"ƨ�ܧ����%7���P:B����#���Q�e�L�)���>�1��0�v�ӋB�s��ɼ�K��1h�85�2H��@�h�*���|LH�H�`
q�2��r��\��)��΍��x�������:���6fe�]s�6ȧʀ6c�[�.�X����9�
�pǨ���q��*��~�	�AH���8���,����V*�RP�Y5�R�T@��ȋ����Ȼ��hrX ���Q����p���k�~��)UP7�,���P���rqt#; 5���\����9�#�Wa�%h�~�d 8Ua�� h��C��*r�ؚa���[@[�&2�ُ$��$�O�)����诶@W*d��ѻҨ?��D+���3�K��yJ�� .gQ���uү�����
`�E�2|j6c���s�Z'a�L��`�.�I�8�����0!JU:�p��T��q�M�j���'ok���u��4��:;'������bSt2��ڕ�àZT� 1U���B�_ ����+���
܋��|�y!7P��&�P��A�(��#�`������3`� �a����������<�yŃ`T���Y b���3��h���K�K��a��<<���jA%j��LL��������E��kѫ)�-�<���S;@�q�l�ˮ�،������@βa�4у���Mu/�B�ݱA��7���^[�.�y&����#�����0{������p�� ��C��^��#�
-Pz!b�+4�bZ�g�����D�7������~��q`U�R� �S���hнU*�萂Uư�|��@>m����j�e
;@��œ*ӻ��z�	\�V��p)n��(�����)6��H�<C--I	֘ѻ[
�C!�§����h�)#����($�:��
���G[,�ݑݣ�F����g
hr�g�܂��5# p	�c��F���Ts��h��	2� 8�Tؾ��I��pȰb��x�P|6;�V�L��1,�mҀB+����1���p�T�y�ZTOm�����:��+=h�U��r���:E� �J��b*1+^���E���07�5��;������\4�������	���˫����~2�R���@#�a�Tk
^A��`�Z/H��:�l��@��9�'���E.
� ������ϙm��	��w2�`?�pF�y`����̰�2�T���N���=�9ӑbL:R��i1�2�G"�D�P������Ӿm�!Ā��f�[�P��.� ��6:Ig�f�A�e&v�\Ɋ�(� 	����
*$�ɼ��ݢ7�m�	Z�Ί��c����ݔ/y��0���<�fl����������W3��Y�4qF�(�E��>�>�y� �(
�*�L�:������)d̬X#��)��.G��ɸ� ��B�Ҩ���¶Y�2-��ۖ���F�+OWv��#��ώ�R�T;���k��D4����8��K������*�y[�y���"��	*�i�xC�Z"v����h���P���#'n"�|@��'�+�@
$��(��qӒ/l�y��!������"L��6AΜL��DƮ-�?��Oӌψ�ay��Z
����0�`��?yʒG�G�Y��Րt-�[9i�����r�Ǡ�o���XI|r��P"�6�0$t)@�aU*���Տ�d��� 7��W79c��h[=�yk1��2 �c�~9P9_䐄��v��չB��X� i���qĨ�!�h'q�/�p6ָ���Ƹj�H�x;�
1��ѳ+1B�A���Q��Sg�C�[��<�(qs�T�	�s�]� )�<�4.裢q����P'Ar��
]�a4/���3e�5�P��H�Z�9=�:qiި����	�_۵��h�a:��+Q�����7/i_�o�!�@T��mpO��h�[@���@ճ��Z�0:L*�x�M��Q{X[U�[�*��F� ����2������������ـ�P�?=8Z)r�O%
�8r��2ʰ�)� �g�4p� @P�h���8h8�s)ӦN�.�aca�*z�0�T��?�|��C�L ��P�[�n�"F�۷h���+��2e� 1K`AO�D����'��T��E�H�ݿ�,AĜy3獚~C��)@m�8��SR�O_�&�UC�_��q��2h�VEk��y��H���eJ�&P�II8@��)�H�\O�>G���H���7��.�$O���]��R����S.b�~���7_P�#(4CQdP4Z��4$UC�h��
�4D*��HCNh�z4T��d�7@d��MN�b�O!���I��2�7���I�+q���d;�1�A(��K���zV"�eH��@�ƶ�NfƖ��g'�Q%I*�HBJ*r�ߛN�1�Y�7UQz R��}C�"���]��rgn\���A��@�TG*��R_�S�f[�G�"��=�ݒ_�dؚ��(Tѣ~R�D�zȉ�A�5lf� 
"��F�b*5؛&��eL��Jd�D
�[yz�ƱX:�Sd}�E���mpMAY� 
Z��ڐ��Q*G���h*�GB5����!顡=���O*�2B�E��
�;�2�Q`L��1�첶7��HC��D�袉��G35TS� 
��ҟ~YU�_��,���#���K4U�M4��>*�7�x*��N}�TN��.��)1]옪�3����HrڤR��qH/�&WeU�2l�s~HNg��e.���(���imԹ_�s��:9[����g��N��_.��+Uѕ��z$���C��?��-W�r�Q�C9JԠA�WoY.��#<���D�a�jC`��R�����!5����^��������$�bG�DCZ����A��2t1.�iR4��	�+_����cU�Zg���N�B4T���D��""�kV�e�%�Y(p�x�	P�El�� c�[�I�pu�BA	�ff���{~�r�."МO��.	z�Y�{N����D-����7�řn��<o�F�/O��/c9�>��\|DK�IU"	���}kH�ZdI@�#6�YY,⦐\� ���$ Ԑ*d$�8�L8�řD� ��RM�t3�C:E�e��'%.�."��U*ȑ��	�
m��Ƅ�ĉ�6�"�:�9�����$7���z�p:���s'����i�f̅'� 	�,S! �VB���j��{���."Ѹ�^�e�o>��;���9��0=�	Q Q�7��/�Y ���h��O26�dR@���-o���T)���ಥ5(�=�0?�N�I�G.8�F�� ��)T"PՒDF� �"�/&�hC�,b�ɤ�1��H�����o`�-�:2�čq��F6�U���a�
��,�5W3W�&�|�h0sV��h��;�;�T�is@��S����,P-���]�7;���I�"�$��@�L˯NAD@�Ԁe�W�O;���[�(X���p��I�+��g_�i)�,�8mp���t��lo ��I�B!�P�!��醨�J�>م�����d�!�C�t2ӆClM)�g�,'va���*��IDNn]���ʿ͜�
l�݃ER*�]6��a��Aقx RA7�%h�R.��6�F��?�1n�,�hЅ�Ѹ+\���1-M*@yV�x�DF#�	�LZE���"!k׉�b5��M�!�R�rqmiB�-Z$A�u�k�#��җl*p!4�2�v\ݺ)����h����!�V�$��K9��	\�5�fH��ʃ�\�`�,A�'ŋ^���T�ִgl�""�~s��R9�����2�/0��~] �2(g����# �JR7�I��!N�b=<VN�h]]@�*����)ä~p���(�Y��u�D����Q����k�&v��rV$d֞&hB	�	�RMR��SYi�-��㫾J�|N;��V8\�� �D�Jͪ�Y��cH�	��Xy�M�k�$l��ь%� @ʽ�@�����:5-S=����X�Q%�\�#de)1 "��<9^yl��^ۆö�݌[@X�� *h�~�t� �,at͟lK��`1��Tp\�6���ի�ȵ%��VX$vO�N#*��/r�X X�/�R�*]�KB(T�Uh;���o��Qab��K EK�#���e�K��#H���ϐc�!)j�#B:+�M3� �ߢ��6���^�ȡ^�#����ZI�CR��F���eb`��]%�I¶�p}�S�\�/d�Bpj��o4lD8��k���6��n���� ŭ�����#؉{Hߨ
�ܝx0�?������������D� �h�F���1�@� �`�N�Y�D�EY��@t�7�?�
(�U�y^��R��^C�O����� HL[Lx���\V�L��R4��H���L�R�a���7@T���b0x�QюRa߅��XD������8H�
�$p��C����=��͠����^�	w|�t��)���F�	=�Fm��Zx݂���ȉ$�S�� (-�<K��R�]�i}���]5��b�p߬��dܜP�h����Ȇ$��Q,ݷ!�Xг��Ā��ش�����@E�!˝H̸Hʡ�U������Y�O�|���K,S�i�H�<v#7�Z�a�, {��;��{�2x�A0�:U�	�J�THh@B�D�iRuɗ����y��',���B��GxlX�LX��d��@��]�Z�Q]���$.M�_ �ӕ#@@*�{<�-�I{(F�B� JY[��yX���	 ��9	z� �
��_�EX,�1�mͥt�b�����	s��2IP$�A�B��S5VW*\,�x�s4�h�]H��?p[f`�J	:�F��f̅��I�9�L`>���;�#@�#�|�E<��<�?��H.j BV�B��/��$��x-�H� ����DC��'U	hD��GH8�����*��|�Z�s^��H�X�]�V�(�_4�M���$�N�ǘ��Ċr�F{Ċ~d�u��pD
�锧���;)Q� ����d�&N����r���%E���� �Ŋ�F��h�S�����p�&#�eC��Lك'Ԏ�Pg�\�աё����U�ʭԀBz�,��i��?X�L� jr	 @�,�!�f���Ε$���X�����=��PM#"���� ���D*�=l�`z�yl�ʘ�b���E×�ь��̏���7��i�ːBuqOd�\�e�#t��~^
x�ʱ E~��up���#�A���	�J���g�e��ǘ �_�%��d�c\��oE�'(Q쑙\�}��A쩙��?�ݑHD�E�zh�c5��F��@������:2�ez���մ�Gℑ@��fm�$�H ����C�j� �Z\�Dݥ��L߄Ą��XE�
����@� �LS!�D�e �!�L.,�&���D@��&͔����G*�ڹv�$L.�=\ň�����.��N9��؉�QG~ �2��*���D�V�$�}t]��'i�S�[Ț���֑�҄����BL�0!���a�h��yJ�r	��]ȿ C�h�ȒH�L�&�#1|Ĳ^OC�̃Y��|�t���Ȏ�O#F��x�,���H�R%��Hľ��N�+��9i\�L�ƿj�= )�d�����GsV���Bzʿ�ޝ)k�^,Z�� DF�p�gz,  �|UC�0�D��q��(�D �pD�
�j�C�RB��D�o>\�@_B��=DçP�׀%L2P��G��E$�V�y�JԀ��E�VPd�
_^��|�G	G� ����A�h��`D���~��.��M��U��;��riH�~1@�D�Y�wL����(Of�N*)dz�H|iA�D4|�=nn��C��i&�upzԖf B��H�i���R�L�F�"݂��JUȧ	kD|�idyދH�>k�ƈA��mzIϱ8D�i@�W5��xa�EDQ��όJ����r8��hz��"f��B�
�Dd��T�B�'����".�PQsԇ�b�rʱ�Z�p��	��B���D���Ӊ���p_�*#���P�H����E�T���NX�l������=n�e�˄�cw��AL�̢�0K��Ν��`�⫩���0-znN����x`�
��u1y��_��Z<�� \�T�i���ǭ�|�'D.VuU����]�p��u���)��7�?�@����ڥ'}�e��B�A�g��.H��V�e�������_��RE�O��E��^Mm� �B���xv
cq�;I�lN�� `|� 1��(*��BFC���R�U2G�(R݋=�U6�gV���P���,�WU	h|�2�>nL�aQM�H����a>!�~���Vj�J��x������Vz A���*ȅ�W�ZR̜�'��@D����T�x4�ɿR48\f,����v��AR�=p��	X]��U�I
�%�|M��]'b��M�L�L��xR��G�dF��DW�����Ͷ�UTQ�B̆���� �=�Y�TT��f�G�_h ��J6�?�W������a�����Cf6��E�RAv�5G� �EN�3����is���2]�[��7��Y�+^xpx���+��7�i7"G��
�;�Gd��a��
�P�$o��5��d�vU4xaY�xuv3G`g���w`͂��?V��qC��6JB�"GD�.t6�ޮ���1z�����'T9)4�2��1��t�^���~��eR.х@�0]� -x>eq�&�8��Nz|�6KD_���b�d	D\�s9�D�V�L�0NTX������0�/X�XЪ��x��J8�H\H(.�m��%oVy��H�n�Z��W���j���7ࣖZ��wfW�)[��h�D��o�ٔJ�]��yB�e|ۃ��Fo������ނB��,�G+d���Jt�� 7*	τɿ�`x��ᑚ���%d��1p�ǔ+�E ¬UO���y��V{dη�*Q����m�U�؃\�T�{kf��pz�2H��B��O���T�H0�yM�4G��a���Ե�ߌ�58�3��[�af7	�ܶ����$��2��{l���X`���{�䆜 ѽM1P8�FYB��6)�U��PHQq��&VO/��R�t����A��t0����}�XFO��}�'@�E�f3�!��G��7��#1�a�q�A���Ä=,@m��t@w��L�m��ce�r���X�.Q9lB���FT�3q��G5K��M�JFJ^x�]&�
�I�EbT��|���@����Mtx����#9=yp�`�uCB�h�6JH����-}x[A����s%�?X:��4xaB�	,X��Á	E�a��ËN�T�@ ��2(بR�
 z �$��e�hp�������ȓ'p�!�&�_4d�H��E���h���Ju�1��48!F�\.O��U�c�Iľ���[4@Ⱦ����?R(��K���?F %�.���[yC��Sb'm��ؾ��}��$q��y�P,)Z`�~۔��� �zRF�������&p���z^�#�x�?d~�7W�į���8��מz�CV�\mƁ�1?}:2���=�#����.�z��OgG��� ! 5���� @;t ��B�0j��5D�

��	��k���)�S�9P�	'&��OH!����񖸈�+d��*�Ra=$��$!��/<q��6l�I���@ �b����,��H�1e�B' ��#�HiN�t�!4��!���#A=QP�SQ�"$�M ���~h��8��Q�*�!�'$!��R�c�����8�ѓ\c�D���ų@%Ϟ���N.�,n1d"����B�7���
M�/���b�DƾKL�\�0@�د8��\E��?�70=4�pC��� _������Bd��_����E�Ϲ� @Be?�����wc�3N�;�K<����c,�����r���������rD!�Rjȫv��F�q*�1=��	=<���܌�Km���P��"E�~�N�����|Q�.5�NG	%���.s�6\DA����2������I� �FO�)(%I�8��!'�ʅr8rA�O��+O�"Uv��r��
��H��<F��Hb1��N�������.�	� �4��YCO�����<����}������4��1�R;o��wk�@ư�c�'��������%z�A,�[���쥄�������,��ՈFtʥ�e�0 pH�88��#U�Tծf��M
��J����'0#e!Dh���/���씧0�A>�xf�99�f'�)փ��/1� ��*�� ��|�S���D'�LC�  �`�"�@`=�JLԞ�M(D�{X��WF����?���|������a�}�iY4h��!��*�J�I��y"G�xҕ�B���K�Xܔ��2K��S�����mp��F&ID2�I�C��(H��"�@�^D�2��A�"A�� �`5��ֈ�k~�s��wY�q`��H�8��U3����@�c�G��c�`�oK+'{��<�R	�G
�� ᐣ��/�&��}2f�8�/��(ȸ%��Z���;�ρb�*hD)���%&.'�_Fd��@����p0���{#�^��/Z�	�z��	$�ej��FC���cRT/6���A�Qqy�kC~��x�"e*S�����E)j!���	�[H"KZ�P�T�ry��Abf�q������XH��i ���K��$@��K_hP<����(#�#	�<0١�繤��p�(U��%2��_mZʴ8�$I��	G��F��E�����F�1�BU�(7� ��G�'�B�5�	�@�Gƶ��P��M�fK���"����A ����9�-�3c��iERq�(/zU*|����Q�z@&�`E��s:�(	ɄB����5��ُ�=� ���C&P�4"�SG
�0�)3��D"��2ܭ 웤��Em��b���/E}��=�M<��A�j��<Ny>�>dP.3�l��b@b,�H�ޞ�'.`m'4H����)�2��$Q&�%�@�Ϙm��� bMNPd�z�$)Ɂp
���T.�$'w�1����M��TH���LG�b�O����_� Z����-�P��R@���3�/���)�|�PBʻ�X?R$���951+�'��I�(w�k������!ȄP>�H�Bm��K����I�B.�ض��1)��H�- G6�\b��T�T�,�nDR@�q4�IE$�&���`�NtB���g����i��A.jb �Q��Z�:��R�H3�I�
��d���Q{��xBnr��>DR�jF���e�eG�O����`:���xn����t=;�5gP��
�Zx�LfB��՗>qQ��5��<������u]�U��0�|\$���7pI ���Tu�e=Y���܂JɌ�RA�u�_Q�Kֈ�h�#!H�_Hb��7��=��d�������L�A;ᘃ�I�B��@`��S��Y�x~�ӎ�R��q+/�HIC�;l���WȞ�0��D�$	��-�K�DTe�P��L)��/C�3�7	Z�5t{��@+��%e�+H8¥�p��-D ���B ab"=@
[ƓD�.1RECP�`�4(��E�������J˲(/"�`�J�x���'D %P�E���Ļ�D�R̰,�^���O"!����LN�D�u��n�ƻ2�V)�D@F��� �@p��%tn�r���	�#Z��$(�"��K�Đ��6��¤"e�-P�Dll�+�� DC�6P,��j.�	H�F�ORd�#4��%B��Q.��
�$�ƅ4`Q\HPVnuP��k�V}��$tiX2��(#�.1���A쇢H�Ꜩ� */N����\#C$���졼$YnQ(Q��ƃ�jh�K�h�D�h��D4KnjB�M'.�M���� ���K�$D	��%l J*b��\�!���R��� ����@�Ҏ_DB��d� �C��Sr��/!t��
�NJ�lF�\�k&%l����0!7r/$��恲�5
O�抻�EQ$��DxCc����k`�՞hAN�0�5�JE2D%�����n.B-��nJ�q����nJb�F
�0����<��X�e�*��㼄��O~�Ml�#c�+Pfi 0��p���9�/�0S0#� dbO2N��dJrA�"���)�'�������x(�&0_���A԰����'S�Z�Z� a��4��3B�=���~�6n�H�t�M�T�&�E~�����b�N��Om0�S9��9-m��b�~�`d�ƤI���z.�Tz�	�D$8P1���*$�L$a�2]:�&/��Հ�#r�yb�0Z͍�l����#�p=��9ATA�Ѕ�
%*�'(��r"k��7e"S����H!�,.�(�jD�T�r7�:t�7��c��@.�<\=�*0l �C���\c<����CF��B>E?$!1�7��	f�H�3�a[�ny�f��a^6&��K��l��P`�$�!4�:��hl�p��H���*�
H�W��XN��N
�HA����H�a����k7��	D��n:l@>��F��<��?ИD���T�#a&*)¼c0���)CJ�F��wf�4�'��cv
6$Dbe:��$"L�u-�0�$R�MP K�TK6i�'
�r�+��'މs�#�tiH@�<8�Fg(04����b1~,��p�685\�*}�iC(l:<���CB~nx���&��~�g��!W�eaNm:~�_,�D�e9���_�bf�R��eV���?$���
�'t�XBg����#2�	!���RO�f�V)S���R!��r��e��r\�/z�/@H?�(a��S�"Wktk�Z>�J�b�'ᅊna=��pKW�C���`r(1�����薊rA\��*`wCV�b���BdqV�ծ&�&�C(H�"�^.��?$`"S~���'���(*�HӎVUS�B:D@�!	BIr�nN�h�*�	I�.'%jbn"���0M��q�D+��,j�.x6�e��by��@�T�.,�y�::F�ފX�"�<*SQA�AChFf���(�n��}�H9�
�rN1��Zn��GFLc�c����i:@�+d�2J70~��B�jeUWr�4�d&�΢}�y�4�B�o���/e��R�G��by�ᩦc~�S�o��GFO?l�������m�sWt|Ө��(��7�8æ��u�B�50pӘ~`�赁GX��?�G#ce���c����u��f�P!��e)�CA�Dt�S��������fT��e�؎�S�d3Dnlu`��|����
^vޣ���4`=����#X�I]�a�H��ƅu�BG�c< �~�006T��58]���I��(�� OO���7��
wV�)t��u� lR�cbփ���8^I?�x:P3yxx<�"V�8Q����#9h24����2y�&)yC�2׼Yk��N�����j(,X��4�c�!�9z�#<�G/��cȡ�BF�8����&q��D@��|~@<#nNj�Â��A��'uŖ��@�C�j�`����&�U=�~N:1(����F�(c��US!GA�6��(a�T�h�D��Ty�A:.F�vxV�Sm�@���ЃRs���'�5S`�#��'1H�!�`C4r��"�S;�U�	��gAD�U�d5���^8Z��e��9=5�0��c�5�cvYT+#o� m*j�1���� DR!�nx?���=M�u�r����7�y��3D�9�_j��D��c��e
� ���/�d��a8U�+$UY4�)��K�A�!
q81$i:vJt�c�J�i���]@f�d�t�ܖ���~�d��:zv8֯�'�޻�L�_�y�uE�n��n���U��|>�8��{?u
�\T����#����@ԺE]A��7�3�I������'��\�8�p6b;)��ˆ�R@�'��S;£}�b{��<Q�!�e�h��e�Y�H�ɟ(,�;�Ǧ����t�4��!2��Sc�L"C��~V\33c��^R����U(c��4)�#]vʖ3EG�71lٓm�A�R{B��VRdJ8�p�B؁(JD�Lƣd��f�5���۷��Y\�5/vʾ�8�87�_C����B���Ǔ��@���O)���6z&ƿ��mCҗ����2��?���Jn5&�10[�;)sA��� �"�_e�Уe��e��1:E?0�������_G�{(8���Ȩc��h=���>B���,ҥ��Z�|��:I��?��T�[���id>�=1p�&�80���7D��|��'�3>��b�Z]5�k'������L/4@?R�F��v�a3�=(D�4����z�C��AB��DT�$UC�[��6����c�A����w�ړ��e[{�g-�6RŭzE<�%C�U���G���#E0D���}B�ډ�J�5���W��N�R���C֨�z�É���Sd�Gx��;b{de@8p�%\:�X޳?�fJ�IxC����c�#ߑ�UQ��#eU@n]?���D�������$6�D������'�"��S�
�����[(�z����>�keJ��܋�=a6�#�S{"�	 m'f>O�1.p�M��k ���) �տzX|e]ГV� ��H��@ ��� ����J�Gn�ŋ-~�����hoy�R#�!+������R F� ��s�K9������I4�'�����$jN�P�U! �իX�beD��P��v�jPD�ɉ��Ad6��&� ���쥬"�lB�e��sR� G'�1�aY����?l4%P�����1ȵ�eg	ʼ���7�3�!EQシ*�M��-��$��768�m��`��l¬≜�)�����Ld��"��Dv�,~�:ޡҬmR{78������wD&���6�'��0Frx��A��W �e�R0-�����a�HXP*ndTF����	r���a��XW2�2�A��'�?HS���ԛFhP�p��U�@p�(Ee8V4G�cR�(�T����D�s�q���璓2��fF�@�&Y��Q�@U��1d8��@�S��%�#A� ڧ� B�A���Du���Q��ܤ����7hbE[Gsf��0��].m|�L�I�*A;%OȔ6�'\�&��l�RA\��
o*�Ըb�Xi�ܚ@�[��V+�=�	�-�P�U�Z��$1z�YƢ�A�$	��8�(A�`�@(l6R�}�;hZ(�k	"ٕAL;n�7�(�V�(&vQ4�Dy����w��
)�^�ͫ�㲒8y+G}S�<�B�G�� 3�H�
��J���N�9eT���X��Fw&���e���EScE����F�Zk6Y�Hr5T��������Y��Cv�+�8k`(G5q����'��D�Dz-��AAk�.�T]G@v#�T$1!mwȑH@�\�9��@@��|,ѹ?��\A0'#Nr�Lm4X(��)�p��g2�~�2��}t����9T4Y��ĝ-��0A_4K��p�@�LP.��Ӽ��!��@:^�N�����N
bLh \�x�s��0Ȁ�ubis�J�8'����M��,&��gu�р\e<��BctkLP1I���zr�a+��� U4��*�ͪPב�f� �B�A�&5���t���p�&�	1��6l�Y���_D�NCc�p�Dr��MD��Vr0bNI� �3�H���F��d؉v41��*j�����&�'�!���2����Z��L�J��V��,g�F 1~Y����(���4&C���� ��a���WOTn`xT����	�i�4��R�mL�J; 0:}�T��?N��Q��\�7eID�=�3�;%�J��0j��@�#�j�
�։�8�(�H��P)j~���cF��!�6��#3b�˥�Y����\b�^?��40��3+�X ����Dn�3{����y2Eu�z*�TY����]�CT�T� ���D�.�H{L�94o�S! �j���gS�-�����L��Z�z�UW��etU}ςغ�w屩�M�z<B��2�f͡_�L䛓N���'~ �o8��$u�I �YA�`�¤4�˕Y!�O�j�X-&!��dK�/�����]cY�� ��#[�]䪑
-�q��K��zi�VR�C�M�sM�(� �C�̆���M�����񑬦W�FȦ5r��]�����̘�|���UJC2��d�E�8Q(#���, " O�W��˻���s5�@�傾
��D�R���Wq��s�<�GQ�}����_�D�Y�H����$>���Sc�TU(�U���Y�P�L��Ҕ�,ȕГ9��5Bŷ�͊궇Oh�0E^�I�N' ��,l���-�@�,V��c�LPv����K=/d^��?ʰ 8ϒ#tܥVRQ[�����$�+���
(�1���aL�i�iR�y��VC�+n��*q�` 8a��C��١JI�%��4ۜ��5ٹ&�^lG����6R��JM���j[*S�����%CE����?��_?v 2	\G2���'Ѿ�p���륉s̄�=�9B� �����'�`�ԋ��Nx�'hn�x��i�w�����5d�S\p��HEO�T��G��R5�P�8�ђ
���0N�|�u[��\��_�g��F{�8�
�P��ڣ��!�<��%cRM�ZuSS񅆓�����a=����$#����7��&
�8����dhC٧���_��I�������v+	H
�)���_-��@<�M8T�ʐ���]jr�\+)�PC����W���W�t|�_�Id���h��[Y�t�<�K���iY�\N(���)+���֞��=X�����]r�� ����ϾC��T�{���4(��갓���O���?h��������O������Ͽ�������� �8�X�� ;                                                                            ./index.js                                                                                          000644  000000  000000  00000000064 13707343542 011036  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         export {default} from "./dc296880051cbfd9@1205.js";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ./index.html                                                                                        000644  000000  000000  00000000600 13707343542 011362  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         <!DOCTYPE html>
<meta charset="utf-8">
<title>Music Composition Graph Link View</title>
<link rel="stylesheet" type="text/css" href="./inspector.css">
<body>
<script type="module">

import define from "./index.js";
import {Runtime, Library, Inspector} from "./runtime.js";

const runtime = new Runtime();
const main = runtime.module(define, Inspector.into(document.body));

</script>
                                                                                                                                ./inspector.css                                                                                     000644  000000  000000  00000003017 13707343542 012112  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         :root{--syntax_normal:#1b1e23;--syntax_comment:#a9b0bc;--syntax_number:#20a5ba;--syntax_keyword:#c30771;--syntax_atom:#10a778;--syntax_string:#008ec4;--syntax_error:#ffbedc;--syntax_unknown_variable:#838383;--syntax_known_variable:#005f87;--syntax_matchbracket:#20bbfc;--syntax_key:#6636b4;--mono_fonts:82%/1.5 Menlo,Consolas,monospace}.observablehq--collapsed,.observablehq--expanded,.observablehq--function,.observablehq--gray,.observablehq--import,.observablehq--string:after,.observablehq--string:before{color:var(--syntax_normal)}.observablehq--collapsed,.observablehq--inspect a{cursor:pointer}.observablehq--field{text-indent:-1em;margin-left:1em}.observablehq--empty{color:var(--syntax_comment)}.observablehq--blue,.observablehq--keyword{color:#3182bd}.observablehq--forbidden,.observablehq--pink{color:#e377c2}.observablehq--orange{color:#e6550d}.observablehq--boolean,.observablehq--null,.observablehq--undefined{color:var(--syntax_atom)}.observablehq--bigint,.observablehq--date,.observablehq--green,.observablehq--number,.observablehq--regexp,.observablehq--symbol{color:var(--syntax_number)}.observablehq--index,.observablehq--key{color:var(--syntax_key)}.observablehq--prototype-key{color:#aaa}.observablehq--empty{font-style:oblique}.observablehq--purple,.observablehq--string{color:var(--syntax_string)}.observablehq--error,.observablehq--red{color:#e7040f}.observablehq--inspect{font:var(--mono_fonts);overflow-x:auto;display:block;white-space:pre}.observablehq--error .observablehq--inspect{word-break:break-all;white-space:pre-wrap}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ./runtime.js                                                                                        000644  000000  000000  00000111373 13707343542 011420  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         // @observablehq/runtime v4.7.1 Copyright 2020 Observable, Inc.
function e(e,t,n){n=n||{};var r=e.ownerDocument,i=r.defaultView.CustomEvent;"function"==typeof i?i=new i(t,{detail:n}):((i=r.createEvent("Event")).initEvent(t,!1,!1),i.detail=n),e.dispatchEvent(i)}function t(e){return Array.isArray(e)||e instanceof Int8Array||e instanceof Int16Array||e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray||e instanceof Uint16Array||e instanceof Uint32Array||e instanceof Float32Array||e instanceof Float64Array}function n(e){return e===(0|e)+""}function r(e){const t=document.createElement("span");return t.className="observablehq--cellname",t.textContent=`${e} = `,t}const i=Symbol.prototype.toString;function o(e){return i.call(e)}const{getOwnPropertySymbols:a,prototype:{hasOwnProperty:s}}=Object,{toStringTag:l}=Symbol,u={},c=a;function d(e,t){return s.call(e,t)}function f(e){return e[l]||e.constructor&&e.constructor.name||"Object"}function p(e,t){try{const n=e[t];return n&&n.constructor,n}catch(e){return u}}const h=[{symbol:"@@__IMMUTABLE_INDEXED__@@",name:"Indexed",modifier:!0},{symbol:"@@__IMMUTABLE_KEYED__@@",name:"Keyed",modifier:!0},{symbol:"@@__IMMUTABLE_LIST__@@",name:"List",arrayish:!0},{symbol:"@@__IMMUTABLE_MAP__@@",name:"Map"},{symbol:"@@__IMMUTABLE_ORDERED__@@",name:"Ordered",modifier:!0,prefix:!0},{symbol:"@@__IMMUTABLE_RECORD__@@",name:"Record"},{symbol:"@@__IMMUTABLE_SET__@@",name:"Set",arrayish:!0,setish:!0},{symbol:"@@__IMMUTABLE_STACK__@@",name:"Stack",arrayish:!0}];function m(e){try{let t=h.filter(({symbol:t})=>!0===e[t]);if(!t.length)return;const n=t.find(e=>!e.modifier),r="Map"===n.name&&t.find(e=>e.modifier&&e.prefix),i=t.some(e=>e.arrayish),o=t.some(e=>e.setish);return{name:`${r?r.name:""}${n.name}`,symbols:t,arrayish:i&&!o,setish:o}}catch(e){return null}}const{getPrototypeOf:v,getOwnPropertyDescriptors:b}=Object,_=v({});function w(n,i,o,a){let s,l,u,c,d=t(n);n instanceof Map?(s=`Map(${n.size})`,l=g):n instanceof Set?(s=`Set(${n.size})`,l=y):d?(s=`${n.constructor.name}(${n.length})`,l=x):(c=m(n))?(s=`Immutable.${c.name}${"Record"===c.name?"":`(${n.size})`}`,d=c.arrayish,l=c.arrayish?C:c.setish?E:P):a?(s=f(n),l=N):(s=f(n),l=S);const p=document.createElement("span");p.className="observablehq--expanded",o&&p.appendChild(r(o));const h=p.appendChild(document.createElement("a"));h.innerHTML="<svg width=8 height=8 class='observablehq--caret'>\n    <path d='M4 7L0 1h8z' fill='currentColor' />\n  </svg>",h.appendChild(document.createTextNode(`${s}${d?" [":" {"}`)),h.addEventListener("mouseup",(function(e){e.stopPropagation(),ae(p,k(n,null,o,a))})),l=l(n);for(let e=0;!(u=l.next()).done&&e<20;++e)p.appendChild(u.value);if(!u.done){const t=p.appendChild(document.createElement("a"));t.className="observablehq--field",t.style.display="block",t.appendChild(document.createTextNode("  … more")),t.addEventListener("mouseup",(function(t){t.stopPropagation(),p.insertBefore(u.value,p.lastChild.previousSibling);for(let e=0;!(u=l.next()).done&&e<19;++e)p.insertBefore(u.value,p.lastChild.previousSibling);u.done&&p.removeChild(p.lastChild.previousSibling),e(p,"load")}))}return p.appendChild(document.createTextNode(d?"]":"}")),p}function*g(e){for(const[t,n]of e)yield $(t,n);yield*S(e)}function*y(e){for(const t of e)yield L(t);yield*S(e)}function*E(e){for(const t of e)yield L(t)}function*x(e){for(let t=0,n=e.length;t<n;++t)t in e&&(yield M(t,p(e,t),"observablehq--index"));for(const t in e)!n(t)&&d(e,t)&&(yield M(t,p(e,t),"observablehq--key"));for(const t of c(e))yield M(o(t),p(e,t),"observablehq--symbol")}function*C(e){let t=0;for(const n=e.size;t<n;++t)yield M(t,e.get(t),!0)}function*N(e){for(const t in b(e))yield M(t,p(e,t),"observablehq--key");for(const t of c(e))yield M(o(t),p(e,t),"observablehq--symbol");const t=v(e);t&&t!==_&&(yield q(t))}function*S(e){for(const t in e)d(e,t)&&(yield M(t,p(e,t),"observablehq--key"));for(const t of c(e))yield M(o(t),p(e,t),"observablehq--symbol");const t=v(e);t&&t!==_&&(yield q(t))}function*P(e){for(const[t,n]of e)yield M(t,n,"observablehq--key")}function q(e){const t=document.createElement("div"),n=t.appendChild(document.createElement("span"));return t.className="observablehq--field",n.className="observablehq--prototype-key",n.textContent="  <prototype>",t.appendChild(document.createTextNode(": ")),t.appendChild(oe(e,void 0,void 0,void 0,!0)),t}function M(e,t,n){const r=document.createElement("div"),i=r.appendChild(document.createElement("span"));return r.className="observablehq--field",i.className=n,i.textContent=`  ${e}`,r.appendChild(document.createTextNode(": ")),r.appendChild(oe(t)),r}function $(e,t){const n=document.createElement("div");return n.className="observablehq--field",n.appendChild(document.createTextNode("  ")),n.appendChild(oe(e)),n.appendChild(document.createTextNode(" => ")),n.appendChild(oe(t)),n}function L(e){const t=document.createElement("div");return t.className="observablehq--field",t.appendChild(document.createTextNode("  ")),t.appendChild(oe(e)),t}function j(e){const t=window.getSelection();return"Range"===t.type&&(t.containsNode(e,!0)||t.anchorNode.isSelfOrDescendant(e)||t.focusNode.isSelfOrDescendant(e))}function k(e,n,i,o){let a,s,l,u,c=t(e);if(e instanceof Map?(a=`Map(${e.size})`,s=A):e instanceof Set?(a=`Set(${e.size})`,s=O):c?(a=`${e.constructor.name}(${e.length})`,s=R):(u=m(e))?(a=`Immutable.${u.name}${"Record"===u.name?"":`(${e.size})`}`,c=u.arrayish,s=u.arrayish?U:u.setish?T:F):(a=f(e),s=D),n){const t=document.createElement("span");return t.className="observablehq--shallow",i&&t.appendChild(r(i)),t.appendChild(document.createTextNode(a)),t.addEventListener("mouseup",(function(n){j(t)||(n.stopPropagation(),ae(t,k(e)))})),t}const d=document.createElement("span");d.className="observablehq--collapsed",i&&d.appendChild(r(i));const p=d.appendChild(document.createElement("a"));p.innerHTML="<svg width=8 height=8 class='observablehq--caret'>\n    <path d='M7 4L1 8V0z' fill='currentColor' />\n  </svg>",p.appendChild(document.createTextNode(`${a}${c?" [":" {"}`)),d.addEventListener("mouseup",(function(t){j(d)||(t.stopPropagation(),ae(d,w(e,0,i,o)))}),!0),s=s(e);for(let e=0;!(l=s.next()).done&&e<20;++e)e>0&&d.appendChild(document.createTextNode(", ")),d.appendChild(l.value);return l.done||d.appendChild(document.createTextNode(", …")),d.appendChild(document.createTextNode(c?"]":"}")),d}function*A(e){for(const[t,n]of e)yield B(t,n);yield*D(e)}function*O(e){for(const t of e)yield oe(t,!0);yield*D(e)}function*T(e){for(const t of e)yield oe(t,!0)}function*U(e){let t=-1,n=0;for(const r=e.size;n<r;++n)n>t+1&&(yield I(n-t-1)),yield oe(e.get(n),!0),t=n;n>t+1&&(yield I(n-t-1))}function*R(e){let t=-1,r=0;for(const n=e.length;r<n;++r)r in e&&(r>t+1&&(yield I(r-t-1)),yield oe(p(e,r),!0),t=r);r>t+1&&(yield I(r-t-1));for(const t in e)!n(t)&&d(e,t)&&(yield z(t,p(e,t),"observablehq--key"));for(const t of c(e))yield z(o(t),p(e,t),"observablehq--symbol")}function*D(e){for(const t in e)d(e,t)&&(yield z(t,p(e,t),"observablehq--key"));for(const t of c(e))yield z(o(t),p(e,t),"observablehq--symbol")}function*F(e){for(const[t,n]of e)yield z(t,n,"observablehq--key")}function I(e){const t=document.createElement("span");return t.className="observablehq--empty",t.textContent=1===e?"empty":`empty × ${e}`,t}function z(e,t,n){const r=document.createDocumentFragment(),i=r.appendChild(document.createElement("span"));return i.className=n,i.textContent=e,r.appendChild(document.createTextNode(": ")),r.appendChild(oe(t,!0)),r}function B(e,t){const n=document.createDocumentFragment();return n.appendChild(oe(e,!0)),n.appendChild(document.createTextNode(" => ")),n.appendChild(oe(t,!0)),n}function H(e,t){var n=e+"",r=n.length;return r<t?new Array(t-r+1).join(0)+n:n}function W(e){return e<0?"-"+H(-e,6):e>9999?"+"+H(e,6):H(e,4)}var V=Error.prototype.toString;var G=RegExp.prototype.toString;function K(e){return e.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g,Y)}function Y(e){var t=e.charCodeAt(0);switch(t){case 8:return"\\b";case 9:return"\\t";case 11:return"\\v";case 12:return"\\f";case 13:return"\\r"}return t<16?"\\x0"+t.toString(16):t<32?"\\x"+t.toString(16):"\\"+e}function J(e,t){for(var n=0;t.exec(e);)++n;return n}var X=Function.prototype.toString,Q={prefix:"async ƒ"},Z={prefix:"async ƒ*"},ee={prefix:"class"},te={prefix:"ƒ"},ne={prefix:"ƒ*"};function re(e,t,n){var i=document.createElement("span");i.className="observablehq--function",n&&i.appendChild(r(n));var o=i.appendChild(document.createElement("span"));return o.className="observablehq--keyword",o.textContent=e.prefix,i.appendChild(document.createTextNode(t)),i}const{prototype:{toString:ie}}=Object;function oe(e,t,n,i,a){let s=typeof e;switch(s){case"boolean":case"undefined":e+="";break;case"number":e=0===e&&1/e<0?"-0":e+"";break;case"bigint":e+="n";break;case"symbol":e=o(e);break;case"function":return function(e,t){var n,r,i=X.call(e);switch(e.constructor&&e.constructor.name){case"AsyncFunction":n=Q;break;case"AsyncGeneratorFunction":n=Z;break;case"GeneratorFunction":n=ne;break;default:n=/^class\b/.test(i)?ee:te}return n===ee?re(n,"",t):(r=/^(?:async\s*)?(\w+)\s*=>/.exec(i))?re(n,"("+r[1]+")",t):(r=/^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(i))?re(n,r[1]?"("+r[1].replace(/\s*,\s*/g,", ")+")":"()",t):(r=/^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(i))?re(n,r[1]?"("+r[1].replace(/\s*,\s*/g,", ")+")":"()",t):re(n,"(…)",t)}(e,i);case"string":return function(e,t,n,i){if(!1===t){if(J(e,/["\n]/g)<=J(e,/`|\${/g)){const t=document.createElement("span");i&&t.appendChild(r(i));const n=t.appendChild(document.createElement("span"));return n.className="observablehq--string",n.textContent=JSON.stringify(e),t}const o=e.split("\n");if(o.length>20&&!n){const n=document.createElement("div");i&&n.appendChild(r(i));const a=n.appendChild(document.createElement("span"));a.className="observablehq--string",a.textContent="`"+K(o.slice(0,20).join("\n"));const s=n.appendChild(document.createElement("span")),l=o.length-20;return s.textContent=`Show ${l} truncated line${l>1?"s":""}`,s.className="observablehq--string-expand",s.addEventListener("mouseup",(function(r){r.stopPropagation(),ae(n,oe(e,t,!0,i))})),n}const a=document.createElement("span");i&&a.appendChild(r(i));const s=a.appendChild(document.createElement("span"));return s.className=`observablehq--string${n?" observablehq--expanded":""}`,s.textContent="`"+K(e)+"`",a}const o=document.createElement("span");i&&o.appendChild(r(i));const a=o.appendChild(document.createElement("span"));return a.className="observablehq--string",a.textContent=JSON.stringify(e.length>100?`${e.slice(0,50)}…${e.slice(-49)}`:e),o}(e,t,n,i);default:if(null===e){s=null,e="null";break}if(e instanceof Date){s="date",l=e,e=isNaN(l)?"Invalid Date":function(e){return 0===e.getUTCMilliseconds()&&0===e.getUTCSeconds()&&0===e.getUTCMinutes()&&0===e.getUTCHours()}(l)?W(l.getUTCFullYear())+"-"+H(l.getUTCMonth()+1,2)+"-"+H(l.getUTCDate(),2):W(l.getFullYear())+"-"+H(l.getMonth()+1,2)+"-"+H(l.getDate(),2)+"T"+H(l.getHours(),2)+":"+H(l.getMinutes(),2)+(l.getMilliseconds()?":"+H(l.getSeconds(),2)+"."+H(l.getMilliseconds(),3):l.getSeconds()?":"+H(l.getSeconds(),2):"");break}if(e===u){s="forbidden",e="[forbidden]";break}switch(ie.call(e)){case"[object RegExp]":s="regexp",e=function(e){return G.call(e)}(e);break;case"[object Error]":case"[object DOMException]":s="error",e=function(e){return e.stack||V.call(e)}(e);break;default:return(n?w:k)(e,t,i,a)}}var l;const c=document.createElement("span");i&&c.appendChild(r(i));const d=c.appendChild(document.createElement("span"));return d.className=`observablehq--${s}`,d.textContent=e,c}function ae(t,n){t.classList.contains("observablehq--inspect")&&n.classList.add("observablehq--inspect"),t.parentNode.replaceChild(n,t),e(n,"load")}const se=/\s+\(\d+:\d+\)$/m;class le{constructor(e){if(!e)throw new Error("invalid node");this._node=e,e.classList.add("observablehq")}pending(){const{_node:e}=this;e.classList.remove("observablehq--error"),e.classList.add("observablehq--running")}fulfilled(t,n){const{_node:r}=this;if((!(t instanceof Element||t instanceof Text)||t.parentNode&&t.parentNode!==r)&&(t=oe(t,!1,r.firstChild&&r.firstChild.classList&&r.firstChild.classList.contains("observablehq--expanded"),n)).classList.add("observablehq--inspect"),r.classList.remove("observablehq--running","observablehq--error"),r.firstChild!==t)if(r.firstChild){for(;r.lastChild!==r.firstChild;)r.removeChild(r.lastChild);r.replaceChild(t,r.firstChild)}else r.appendChild(t);e(r,"update")}rejected(t,n){const{_node:i}=this;for(i.classList.remove("observablehq--running"),i.classList.add("observablehq--error");i.lastChild;)i.removeChild(i.lastChild);var o=document.createElement("div");o.className="observablehq--inspect",n&&o.appendChild(r(n)),o.appendChild(document.createTextNode((t+"").replace(se,""))),i.appendChild(o),e(i,"error",{error:t})}}async function ue(e){const t=await fetch(await e.url());if(!t.ok)throw new Error(`Unable to load file: ${e.name}`);return t}le.into=function(e){if("string"==typeof e&&null==(e=document.querySelector(e)))throw new Error("container not found");return function(){return new le(e.appendChild(document.createElement("div")))}};class FileAttachment{constructor(e,t){Object.defineProperties(this,{_url:{value:e},name:{value:t,enumerable:!0}})}async url(){return await this._url+""}async blob(){return(await ue(this)).blob()}async arrayBuffer(){return(await ue(this)).arrayBuffer()}async text(){return(await ue(this)).text()}async json(){return(await ue(this)).json()}async stream(){return(await ue(this)).body}async image(){const e=await this.url();return new Promise((t,n)=>{const r=new Image;new URL(e,document.baseURI).origin!==new URL(location).origin&&(r.crossOrigin="anonymous"),r.onload=()=>t(r),r.onerror=()=>n(new Error(`Unable to load file: ${this.name}`)),r.src=e})}}function ce(e){throw new Error(`File not found: ${e}`)}const de=new Map,fe=[],pe=fe.map,he=fe.some,me=fe.hasOwnProperty,ve="https://cdn.jsdelivr.net/npm/",be=/^((?:@[^/@]+\/)?[^/@]+)(?:@([^/]+))?(?:\/(.*))?$/,_e=/^\d+\.\d+\.\d+(-[\w-.+]+)?$/,we=/\.[^/]*$/,ge=["unpkg","jsdelivr","browser","main"];class RequireError extends Error{constructor(e){super(e)}}function ye(e){const t=be.exec(e);return t&&{name:t[1],version:t[2],path:t[3]}}function Ee(e){const t=`${ve}${e.name}${e.version?`@${e.version}`:""}/package.json`;let n=de.get(t);return n||de.set(t,n=fetch(t).then(e=>{if(!e.ok)throw new RequireError("unable to load package.json");return e.redirected&&!de.has(e.url)&&de.set(e.url,n),e.json()})),n}RequireError.prototype.name=RequireError.name;var xe=Ce((async function(e,t){if(e.startsWith(ve)&&(e=e.substring(ve.length)),/^(\w+:)|\/\//i.test(e))return e;if(/^[.]{0,2}\//i.test(e))return new URL(e,null==t?location:t).href;if(!e.length||/^[\s._]/.test(e)||/\s$/.test(e))throw new RequireError("illegal name");const n=ye(e);if(!n)return`${ve}${e}`;if(!n.version&&null!=t&&t.startsWith(ve)){const e=await Ee(ye(t.substring(ve.length)));n.version=e.dependencies&&e.dependencies[n.name]||e.peerDependencies&&e.peerDependencies[n.name]}if(n.path&&!we.test(n.path)&&(n.path+=".js"),n.path&&n.version&&_e.test(n.version))return`${ve}${n.name}@${n.version}/${n.path}`;const r=await Ee(n);return`${ve}${r.name}@${r.version}/${n.path||function(e){for(const t of ge){const n=e[t];if("string"==typeof n)return we.test(n)?n:`${n}.js`}}(r)||"index.js"}`}));function Ce(e){const t=new Map,n=i(null);function r(e){if("string"!=typeof e)return e;let n=t.get(e);return n||t.set(e,n=new Promise((t,n)=>{const r=document.createElement("script");r.onload=()=>{try{t(fe.pop()(i(e)))}catch(e){n(new RequireError("invalid module"))}r.remove()},r.onerror=()=>{n(new RequireError("unable to load module")),r.remove()},r.async=!0,r.src=e,window.define=qe,document.head.appendChild(r)})),n}function i(t){return n=>Promise.resolve(e(n,t)).then(r)}function o(e){return arguments.length>1?Promise.all(pe.call(arguments,n)).then(Ne):n(e)}return o.alias=function(t){return Ce((n,r)=>n in t&&(r=null,"string"!=typeof(n=t[n]))?n:e(n,r))},o.resolve=e,o}function Ne(e){const t={};for(const n of e)for(const e in n)me.call(n,e)&&(null==n[e]?Object.defineProperty(t,e,{get:Se(n,e)}):t[e]=n[e]);return t}function Se(e,t){return()=>e[t]}function Pe(e){return"exports"===(e+="")||"module"===e}function qe(e,t,n){const r=arguments.length;r<2?(n=e,t=[]):r<3&&(n=t,t="string"==typeof e?[]:e),fe.push(he.call(t,Pe)?e=>{const r={},i={exports:r};return Promise.all(pe.call(t,t=>"exports"===(t+="")?r:"module"===t?i:e(t))).then(e=>(n.apply(null,e),i.exports))}:e=>Promise.all(pe.call(t,e)).then(e=>"function"==typeof n?n.apply(null,e):n))}function Me(e){return function(){return e}}qe.amd={};var $e={math:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};var Le=0;function je(e){this.id=e,this.href=new URL(`#${e}`,location)+""}je.prototype.toString=function(){return"url("+this.href+")"};var ke={canvas:function(e,t){var n=document.createElement("canvas");return n.width=e,n.height=t,n},context2d:function(e,t,n){null==n&&(n=devicePixelRatio);var r=document.createElement("canvas");r.width=e*n,r.height=t*n,r.style.width=e+"px";var i=r.getContext("2d");return i.scale(n,n),i},download:function(e,t="untitled",n="Save"){const r=document.createElement("a"),i=r.appendChild(document.createElement("button"));async function o(){await new Promise(requestAnimationFrame),URL.revokeObjectURL(r.href),r.removeAttribute("href"),i.textContent=n,i.disabled=!1}return i.textContent=n,r.download=t,r.onclick=async t=>{if(i.disabled=!0,r.href)return o();i.textContent="Saving…";try{const t=await("function"==typeof e?e():e);i.textContent="Download",r.href=URL.createObjectURL(t)}catch(e){i.textContent=n}if(t.eventPhase)return o();i.disabled=!1},r},element:function(e,t){var n,r=e+="",i=r.indexOf(":");i>=0&&"xmlns"!==(r=e.slice(0,i))&&(e=e.slice(i+1));var o=$e.hasOwnProperty(r)?document.createElementNS($e[r],e):document.createElement(e);if(t)for(var a in t)i=(r=a).indexOf(":"),n=t[a],i>=0&&"xmlns"!==(r=a.slice(0,i))&&(a=a.slice(i+1)),$e.hasOwnProperty(r)?o.setAttributeNS($e[r],a,n):o.setAttribute(a,n);return o},input:function(e){var t=document.createElement("input");return null!=e&&(t.type=e),t},range:function(e,t,n){1===arguments.length&&(t=e,e=null);var r=document.createElement("input");return r.min=e=null==e?0:+e,r.max=t=null==t?1:+t,r.step=null==n?"any":n=+n,r.type="range",r},select:function(e){var t=document.createElement("select");return Array.prototype.forEach.call(e,(function(e){var n=document.createElement("option");n.value=n.textContent=e,t.appendChild(n)})),t},svg:function(e,t){var n=document.createElementNS("http://www.w3.org/2000/svg","svg");return n.setAttribute("viewBox",[0,0,e,t]),n.setAttribute("width",e),n.setAttribute("height",t),n},text:function(e){return document.createTextNode(e)},uid:function(e){return new je("O-"+(null==e?"":e+"-")+ ++Le)}};var Ae={buffer:function(e){return new Promise((function(t,n){var r=new FileReader;r.onload=function(){t(r.result)},r.onerror=n,r.readAsArrayBuffer(e)}))},text:function(e){return new Promise((function(t,n){var r=new FileReader;r.onload=function(){t(r.result)},r.onerror=n,r.readAsText(e)}))},url:function(e){return new Promise((function(t,n){var r=new FileReader;r.onload=function(){t(r.result)},r.onerror=n,r.readAsDataURL(e)}))}};function Oe(){return this}function Te(e,t){let n=!1;if("function"!=typeof t)throw new Error("dispose is not a function");return{[Symbol.iterator]:Oe,next:()=>n?{done:!0}:(n=!0,{done:!1,value:e}),return:()=>(n=!0,t(e),{done:!0}),throw:()=>({done:n=!0})}}function Ue(e){let t,n,r=!1;const i=e((function(e){n?(n(e),n=null):r=!0;return t=e}));if(null!=i&&"function"!=typeof i)throw new Error("function"==typeof i.then?"async initializers are not supported":"initializer returned something, but not a dispose function");return{[Symbol.iterator]:Oe,throw:()=>({done:!0}),return:()=>(null!=i&&i(),{done:!0}),next:function(){return{done:!1,value:r?(r=!1,Promise.resolve(t)):new Promise(e=>n=e)}}}}function Re(e){switch(e.type){case"range":case"number":return e.valueAsNumber;case"date":return e.valueAsDate;case"checkbox":return e.checked;case"file":return e.multiple?e.files:e.files[0];case"select-multiple":return Array.from(e.selectedOptions,e=>e.value);default:return e.value}}var De={disposable:Te,filter:function*(e,t){for(var n,r=-1;!(n=e.next()).done;)t(n.value,++r)&&(yield n.value)},input:function(e){return Ue((function(t){var n=function(e){switch(e.type){case"button":case"submit":case"checkbox":return"click";case"file":return"change";default:return"input"}}(e),r=Re(e);function i(){t(Re(e))}return e.addEventListener(n,i),void 0!==r&&t(r),function(){e.removeEventListener(n,i)}}))},map:function*(e,t){for(var n,r=-1;!(n=e.next()).done;)yield t(n.value,++r)},observe:Ue,queue:function(e){let t;const n=[],r=e((function(e){n.push(e),t&&(t(n.shift()),t=null);return e}));if(null!=r&&"function"!=typeof r)throw new Error("function"==typeof r.then?"async initializers are not supported":"initializer returned something, but not a dispose function");return{[Symbol.iterator]:Oe,throw:()=>({done:!0}),return:()=>(null!=r&&r(),{done:!0}),next:function(){return{done:!1,value:n.length?Promise.resolve(n.shift()):new Promise(e=>t=e)}}}},range:function*(e,t,n){e=+e,t=+t,n=(i=arguments.length)<2?(t=e,e=0,1):i<3?1:+n;for(var r=-1,i=0|Math.max(0,Math.ceil((t-e)/n));++r<i;)yield e+r*n},valueAt:function(e,t){if(!(!isFinite(t=+t)||t<0||t!=t|0))for(var n,r=-1;!(n=e.next()).done;)if(++r===t)return n.value},worker:function(e){const t=URL.createObjectURL(new Blob([e],{type:"text/javascript"})),n=new Worker(t);return Te(n,()=>{n.terminate(),URL.revokeObjectURL(t)})}};function Fe(e,t){return function(n){var r,i,o,a,s,l,u,c,d=n[0],f=[],p=null,h=-1;for(s=1,l=arguments.length;s<l;++s){if((r=arguments[s])instanceof Node)f[++h]=r,d+="\x3c!--o:"+h+"--\x3e";else if(Array.isArray(r)){for(u=0,c=r.length;u<c;++u)(i=r[u])instanceof Node?(null===p&&(f[++h]=p=document.createDocumentFragment(),d+="\x3c!--o:"+h+"--\x3e"),p.appendChild(i)):(p=null,d+=i);p=null}else d+=r;d+=n[s]}if(p=e(d),++h>0){for(o=new Array(h),a=document.createTreeWalker(p,NodeFilter.SHOW_COMMENT,null,!1);a.nextNode();)i=a.currentNode,/^o:/.test(i.nodeValue)&&(o[+i.nodeValue.slice(2)]=i);for(s=0;s<h;++s)(i=o[s])&&i.parentNode.replaceChild(f[s],i)}return 1===p.childNodes.length?p.removeChild(p.firstChild):11===p.nodeType?((i=t()).appendChild(p),i):p}}var Ie=Fe((function(e){var t=document.createElement("template");return t.innerHTML=e.trim(),document.importNode(t.content,!0)}),(function(){return document.createElement("span")}));const ze="https://cdn.jsdelivr.net/npm/@observablehq/highlight.js@2.0.0/";function Be(e){return function(){return e("marked@0.3.12/marked.min.js").then((function(t){return Fe((function(n){var r=document.createElement("div");r.innerHTML=t(n,{langPrefix:""}).trim();var i=r.querySelectorAll("pre code[class]");return i.length>0&&e(ze+"highlight.min.js").then((function(t){i.forEach((function(n){function r(){t.highlightBlock(n),n.parentNode.classList.add("observablehq--md-pre")}t.getLanguage(n.className)?r():e(ze+"async-languages/index.js").then(r=>{if(r.has(n.className))return e(ze+"async-languages/"+r.get(n.className)).then(e=>{t.registerLanguage(n.className,e)})}).then(r,r)}))})),r}),(function(){return document.createElement("div")}))}))}}function He(e){let t;Object.defineProperties(this,{generator:{value:Ue(e=>{t=e})},value:{get:()=>e,set:n=>t(e=n)}}),void 0!==e&&t(e)}function*We(){for(;;)yield Date.now()}var Ve=new Map;function Ge(e,t){var n;return(n=Ve.get(e=+e))?n.then(Me(t)):(n=Date.now())>=e?Promise.resolve(t):function(e,t){var n=new Promise((function(n){Ve.delete(t);var r=t-e;if(!(r>0))throw new Error("invalid time");if(r>2147483647)throw new Error("too long to wait");setTimeout(n,r)}));return Ve.set(t,n),n}(n,e).then(Me(t))}var Ke={delay:function(e,t){return new Promise((function(n){setTimeout((function(){n(t)}),e)}))},tick:function(e,t){return Ge(Math.ceil((Date.now()+1)/e)*e,t)},when:Ge};function Ye(e,t){if(/^(\w+:)|\/\//i.test(e))return e;if(/^[.]{0,2}\//i.test(e))return new URL(e,null==t?location:t).href;if(!e.length||/^[\s._]/.test(e)||/\s$/.test(e))throw new Error("illegal name");return"https://unpkg.com/"+e}function Je(e){return null==e?xe:Ce(e)}var Xe=Fe((function(e){var t=document.createElementNS("http://www.w3.org/2000/svg","g");return t.innerHTML=e.trim(),t}),(function(){return document.createElementNS("http://www.w3.org/2000/svg","g")})),Qe=String.raw;function Ze(e){return new Promise((function(t,n){var r=document.createElement("link");r.rel="stylesheet",r.href=e,r.onerror=n,r.onload=t,document.head.appendChild(r)}))}function et(e){return function(){return Promise.all([e("@observablehq/katex@0.11.1/dist/katex.min.js"),e.resolve("@observablehq/katex@0.11.1/dist/katex.min.css").then(Ze)]).then((function(e){var t=e[0],n=r();function r(e){return function(){var n=document.createElement("div");return t.render(Qe.apply(String,arguments),n,e),n.removeChild(n.firstChild)}}return n.options=r,n.block=r({displayMode:!0}),n}))}}function tt(){return Ue((function(e){var t=e(document.body.clientWidth);function n(){var n=document.body.clientWidth;n!==t&&e(t=n)}return window.addEventListener("resize",n),function(){window.removeEventListener("resize",n)}}))}var nt=Object.assign((function(e){const t=Je(e);Object.defineProperties(this,{DOM:{value:ke,writable:!0,enumerable:!0},FileAttachment:{value:Me(ce),writable:!0,enumerable:!0},Files:{value:Ae,writable:!0,enumerable:!0},Generators:{value:De,writable:!0,enumerable:!0},html:{value:Me(Ie),writable:!0,enumerable:!0},md:{value:Be(t),writable:!0,enumerable:!0},Mutable:{value:Me(He),writable:!0,enumerable:!0},now:{value:We,writable:!0,enumerable:!0},Promises:{value:Ke,writable:!0,enumerable:!0},require:{value:Me(t),writable:!0,enumerable:!0},resolve:{value:Me(Ye),writable:!0,enumerable:!0},svg:{value:Me(Xe),writable:!0,enumerable:!0},tex:{value:et(t),writable:!0,enumerable:!0},width:{value:tt,writable:!0,enumerable:!0}})}),{resolve:xe.resolve});function rt(e,t){this.message=e+"",this.input=t}rt.prototype=Object.create(Error.prototype),rt.prototype.name="RuntimeError",rt.prototype.constructor=rt;var it=Array.prototype,ot=it.map,at=it.forEach;function st(e){return function(){return e}}function lt(e){return e}function ut(){}var ct={};function dt(e,t,n){var r;null==n&&(n=ct),Object.defineProperties(this,{_observer:{value:n,writable:!0},_definition:{value:ht,writable:!0},_duplicate:{value:void 0,writable:!0},_duplicates:{value:void 0,writable:!0},_indegree:{value:NaN,writable:!0},_inputs:{value:[],writable:!0},_invalidate:{value:ut,writable:!0},_module:{value:t},_name:{value:null,writable:!0},_outputs:{value:new Set,writable:!0},_promise:{value:Promise.resolve(void 0),writable:!0},_reachable:{value:n!==ct,writable:!0},_rejector:{value:(r=this,function(e){if(e===ht)throw new rt(r._name+" is not defined",r._name);throw new rt(r._name+" could not be resolved",r._name)})},_type:{value:e},_value:{value:void 0,writable:!0},_version:{value:0,writable:!0}})}function ft(e){e._module._runtime._dirty.add(e),e._outputs.add(this)}function pt(e){e._module._runtime._dirty.add(e),e._outputs.delete(this)}function ht(){throw ht}function mt(e){return function(){throw new rt(e+" is defined more than once")}}function vt(e,t,n){var r=this._module._scope,i=this._module._runtime;if(this._inputs.forEach(pt,this),t.forEach(ft,this),this._inputs=t,this._definition=n,this._value=void 0,n===ut?i._variables.delete(this):i._variables.add(this),e==this._name&&r.get(e)===this)this._outputs.forEach(i._updates.add,i._updates);else{var o,a;if(this._name)if(this._outputs.size)r.delete(this._name),(a=this._module._resolve(this._name))._outputs=this._outputs,this._outputs=new Set,a._outputs.forEach((function(e){e._inputs[e._inputs.indexOf(this)]=a}),this),a._outputs.forEach(i._updates.add,i._updates),i._dirty.add(a).add(this),r.set(this._name,a);else if((a=r.get(this._name))===this)r.delete(this._name);else{if(3!==a._type)throw new Error;a._duplicates.delete(this),this._duplicate=void 0,1===a._duplicates.size&&(a=a._duplicates.keys().next().value,o=r.get(this._name),a._outputs=o._outputs,o._outputs=new Set,a._outputs.forEach((function(e){e._inputs[e._inputs.indexOf(o)]=a})),a._definition=a._duplicate,a._duplicate=void 0,i._dirty.add(o).add(a),i._updates.add(a),r.set(this._name,a))}if(this._outputs.size)throw new Error;e&&((a=r.get(e))?3===a._type?(this._definition=mt(e),this._duplicate=n,a._duplicates.add(this)):2===a._type?(this._outputs=a._outputs,a._outputs=new Set,this._outputs.forEach((function(e){e._inputs[e._inputs.indexOf(a)]=this}),this),i._dirty.add(a).add(this),r.set(e,this)):(a._duplicate=a._definition,this._duplicate=n,(o=new dt(3,this._module))._name=e,o._definition=this._definition=a._definition=mt(e),o._outputs=a._outputs,a._outputs=new Set,o._outputs.forEach((function(e){e._inputs[e._inputs.indexOf(a)]=o})),o._duplicates=new Set([this,a]),i._dirty.add(a).add(o),i._updates.add(a).add(o),r.set(e,o)):r.set(e,this)),this._name=e}return i._updates.add(this),i._compute(),this}function bt(e,t=[]){Object.defineProperties(this,{_runtime:{value:e},_scope:{value:new Map},_builtins:{value:new Map([["invalidation",gt],["visibility",yt],...t])},_source:{value:null,writable:!0}})}function _t(e){return e._name}Object.defineProperties(dt.prototype,{_pending:{value:function(){this._observer.pending&&this._observer.pending()},writable:!0,configurable:!0},_fulfilled:{value:function(e){this._observer.fulfilled&&this._observer.fulfilled(e,this._name)},writable:!0,configurable:!0},_rejected:{value:function(e){this._observer.rejected&&this._observer.rejected(e,this._name)},writable:!0,configurable:!0},define:{value:function(e,t,n){switch(arguments.length){case 1:n=e,e=t=null;break;case 2:n=t,"string"==typeof e?t=null:(t=e,e=null)}return vt.call(this,null==e?null:e+"",null==t?[]:ot.call(t,this._module._resolve,this._module),"function"==typeof n?n:st(n))},writable:!0,configurable:!0},delete:{value:function(){return vt.call(this,null,[],ut)},writable:!0,configurable:!0},import:{value:function(e,t,n){arguments.length<3&&(n=t,t=e);return vt.call(this,t+"",[n._resolve(e+"")],lt)},writable:!0,configurable:!0}}),Object.defineProperties(bt.prototype,{_copy:{value:function(e,t){e._source=this,t.set(this,e);for(const[o,a]of this._scope){var n=e._scope.get(o);if(!n||1!==n._type)if(a._definition===lt){var r=a._inputs[0],i=r._module;e.import(r._name,o,t.get(i)||(i._source?i._copy(new bt(e._runtime,e._builtins),t):i))}else e.define(o,a._inputs.map(_t),a._definition)}return e},writable:!0,configurable:!0},_resolve:{value:function(e){var t,n=this._scope.get(e);if(!n)if(n=new dt(2,this),this._builtins.has(e))n.define(e,st(this._builtins.get(e)));else if(this._runtime._builtin._scope.has(e))n.import(e,this._runtime._builtin);else{try{t=this._runtime._global(e)}catch(t){return n.define(e,(r=t,function(){throw r}))}void 0===t?this._scope.set(n._name=e,n):n.define(e,st(t))}var r;return n},writable:!0,configurable:!0},redefine:{value:function(e){var t=this._scope.get(e);if(!t)throw new rt(e+" is not defined");if(3===t._type)throw new rt(e+" is defined more than once");return t.define.apply(t,arguments)},writable:!0,configurable:!0},define:{value:function(){var e=new dt(1,this);return e.define.apply(e,arguments)},writable:!0,configurable:!0},derive:{value:function(e,t){var n=new bt(this._runtime,this._builtins);return n._source=this,at.call(e,(function(e){"object"!=typeof e&&(e={name:e+""}),null==e.alias&&(e.alias=e.name),n.import(e.name,e.alias,t)})),Promise.resolve().then(()=>{const e=new Set([this]);for(const t of e)for(const n of t._scope.values())if(n._definition===lt){const t=n._inputs[0]._module,r=t._source||t;if(r===this)return void console.warn("circular module definition; ignoring");e.add(r)}this._copy(n,new Map)}),n},writable:!0,configurable:!0},import:{value:function(){var e=new dt(1,this);return e.import.apply(e,arguments)},writable:!0,configurable:!0},value:{value:async function(e){var t=this._scope.get(e);if(!t)throw new rt(e+" is not defined");t._observer===ct&&(t._observer=!0,this._runtime._dirty.add(t));return await this._runtime._compute(),t._promise},writable:!0,configurable:!0},variable:{value:function(e){return new dt(1,this,e)},writable:!0,configurable:!0},builtin:{value:function(e,t){this._builtins.set(e,t)},writable:!0,configurable:!0}});const wt="function"==typeof requestAnimationFrame?requestAnimationFrame:setImmediate;var gt={},yt={};function Et(e=new nt,t=jt){var n=this.module();if(Object.defineProperties(this,{_dirty:{value:new Set},_updates:{value:new Set},_computing:{value:null,writable:!0},_init:{value:null,writable:!0},_modules:{value:new Map},_variables:{value:new Set},_disposed:{value:!1,writable:!0},_builtin:{value:n},_global:{value:t}}),e)for(var r in e)new dt(2,n).define(r,[],e[r])}function xt(e){const t=new Set(e._inputs);for(const n of t){if(n===e)return!0;n._inputs.forEach(t.add,t)}return!1}function Ct(e){++e._indegree}function Nt(e){--e._indegree}function St(e){return e._promise.catch(e._rejector)}function Pt(e){return new Promise((function(t){e._invalidate=t}))}function qt(e,t){let n,r,i="function"==typeof IntersectionObserver&&t._observer&&t._observer._node,o=!i,a=ut,s=ut;return i&&(r=new IntersectionObserver(([e])=>(o=e.isIntersecting)&&(n=null,a())),r.observe(i),e.then(()=>(r.disconnect(),r=null,s()))),function(e){return o?Promise.resolve(e):r?(n||(n=new Promise((e,t)=>(a=e,s=t))),n.then(()=>e)):Promise.reject()}}function Mt(e){e._invalidate(),e._invalidate=ut,e._pending();var t=e._value,n=++e._version,r=null,i=e._promise=Promise.all(e._inputs.map(St)).then((function(i){if(e._version===n){for(var o=0,a=i.length;o<a;++o)switch(i[o]){case gt:i[o]=r=Pt(e);break;case yt:r||(r=Pt(e)),i[o]=qt(r,e)}return e._definition.apply(t,i)}})).then((function(t){return function(e){return e&&"function"==typeof e.next&&"function"==typeof e.return}(t)?e._version!==n?void t.return():((r||Pt(e)).then((o=t,function(){o.return()})),function(e,t,n,r){function i(){var n=new Promise((function(e){e(r.next())})).then((function(r){return r.done?void 0:Promise.resolve(r.value).then((function(r){if(e._version===t)return $t(e,r,n).then(i),e._fulfilled(r),r}))}));n.catch((function(r){e._version===t&&($t(e,void 0,n),e._rejected(r))}))}return new Promise((function(e){e(r.next())})).then((function(e){if(!e.done)return n.then(i),e.value}))}(e,n,i,t)):t;var o}));i.then((function(t){e._version===n&&(e._value=t,e._fulfilled(t))}),(function(t){e._version===n&&(e._value=void 0,e._rejected(t))}))}function $t(e,t,n){var r=e._module._runtime;return e._value=t,e._promise=n,e._outputs.forEach(r._updates.add,r._updates),r._compute()}function Lt(e,t){e._invalidate(),e._invalidate=ut,e._pending(),++e._version,e._indegree=NaN,(e._promise=Promise.reject(t)).catch(ut),e._value=void 0,e._rejected(t)}function jt(e){return window[e]}Object.defineProperties(Et,{load:{value:function(e,t,n){if("function"==typeof t&&(n=t,t=null),"function"!=typeof n)throw new Error("invalid observer");null==t&&(t=new nt);const{modules:r,id:i}=e,o=new Map,a=new Et(t),s=l(i);function l(e){let t=o.get(e);return t||o.set(e,t=a.module()),t}for(const e of r){const t=l(e.id);let r=0;for(const i of e.variables)i.from?t.import(i.remote,i.name,l(i.from)):t===s?t.variable(n(i,r,e.variables)).define(i.name,i.inputs,i.value):t.define(i.name,i.inputs,i.value),++r}return a},writable:!0,configurable:!0}}),Object.defineProperties(Et.prototype,{_compute:{value:function(){return this._computing||(this._computing=this._computeSoon())},writable:!0,configurable:!0},_computeSoon:{value:function(){var e=this;return new Promise((function(t){wt((function(){t(),e._disposed||e._computeNow()}))}))},writable:!0,configurable:!0},_computeNow:{value:function(){var e,t,n=[];(e=new Set(this._dirty)).forEach((function(t){t._inputs.forEach(e.add,e);const n=function(e){if(e._observer!==ct)return!0;var t=new Set(e._outputs);for(const e of t){if(e._observer!==ct)return!0;e._outputs.forEach(t.add,t)}return!1}(t);n>t._reachable?this._updates.add(t):n<t._reachable&&t._invalidate(),t._reachable=n}),this),(e=new Set(this._updates)).forEach((function(t){t._reachable?(t._indegree=0,t._outputs.forEach(e.add,e)):(t._indegree=NaN,e.delete(t))})),this._computing=null,this._updates.clear(),this._dirty.clear(),e.forEach((function(e){e._outputs.forEach(Ct)}));do{for(e.forEach((function(e){0===e._indegree&&n.push(e)}));t=n.pop();)Mt(t),t._outputs.forEach(r),e.delete(t);e.forEach((function(t){xt(t)&&(Lt(t,new rt("circular definition")),t._outputs.forEach(Nt),e.delete(t))}))}while(e.size);function r(e){0==--e._indegree&&n.push(e)}},writable:!0,configurable:!0},dispose:{value:function(){this._computing=Promise.resolve(),this._disposed=!0,this._variables.forEach(e=>{e._invalidate(),e._version=NaN})},writable:!0,configurable:!0},module:{value:function(e,t=ut){let n;if(void 0===e)return(n=this._init)?(this._init=null,n):new bt(this);if(n=this._modules.get(e),n)return n;this._init=n=new bt(this),this._modules.set(e,n);try{e(this,t)}finally{this._init=null}return n},writable:!0,configurable:!0},fileAttachments:{value:function(e){return t=>{const n=e(t+="");if(null==n)throw new Error(`File not found: ${t}`);return new FileAttachment(n,t)}},writable:!0,configurable:!0}});export{le as Inspector,nt as Library,Et as Runtime,rt as RuntimeError};
                                                                                                                                                                                                                                                                     ./package.json                                                                                      000644  000000  000000  00000000605 13707343542 011660  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         {
  "name": "@kaiser-dan/music-composition-graph-link-view",
  "main": "dc296880051cbfd9@1205.js",
  "version": "1205.0.0",
  "homepage": "https://observablehq.com/@kaiser-dan/music-composition-graph-link-view",
  "author": {
    "name": "kaiser-dan",
    "url": "https://observablehq.com/@kaiser-dan"
  },
  "type": "module",
  "peerDependencies": {
    "@observablehq/runtime": "4"
  }
}                                                                                                                           ./README.md                                                                                         000644  000000  000000  00000001540 13707343542 010650  0                                                                                                    ustar 00                                                                000000  000000                                                                                                                                                                         # Music Composition Graph Link View

https://observablehq.com/@kaiser-dan/music-composition-graph-link-view@1205

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
python -m SimpleHTTPServer
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@4
npm install https://api.observablehq.com/d/dc296880051cbfd9.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "@kaiser-dan/music-composition-graph-link-view";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                