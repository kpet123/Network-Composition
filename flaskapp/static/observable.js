
// Load the Observable runtime and inspector.
import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";

// Your notebook, compiled as an ES module.

//import notebook from "https://api.observablehq.com/@kpet123/music-composition-graph.js?v=3"

import notebook from "https://api.observablehq.com/@kpet123/music-composition-graph-link-view.js?v=3"

//which cells to render
const renders = {
    "viewof start_walk": "#start_walk",
    "chart": "#chart",
    "data" : "#data",
    "random_walk": "#random_walk",
    "viewof radius": "#radius",
    "viewof attraction": "#attraction",
    "viewof type": "#wavetype",
    "viewof distance": "#distance",
    "passed_src": "#chosen_source",
    "passed_dst": "#chosen_target",
    "passed_weight": "#cur_weight",
    "viewof speed": "#speed",
  };
//Code adapted from
//https://talk.observablehq.com/t/embedding-only-parts-of-notebook/2470/4


for (let i in renders)
    renders[i] = document.querySelector(renders[i]);
const main = new Runtime().module(notebook, (name) => {
    if (renders[name])
        return new Inspector(renders[name]);
    else return true;
});

//Match the "data" variable defined in Observable to the data variable
//passed into index.html through Flask
console.log("Testing in Observable- key is :")
console.log(key)
console.log(data)
main.redefine("random_walk", walk);
main.redefine("data", data);


//Get values for edge with weight to be changed. src and dst
//var chosen_src = await module2.value("mutable chosen_source");
//var chosen_dst = await module2.value("mutable chosen_target");
