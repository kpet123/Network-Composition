# System imports
import json
import os

#Flask-related imports
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

# Network imports
from cdlib import algorithms
import networkx as nx
import infomap
import igraph as ig
#import _mnet as mnet
import mnet
from networkx.readwrite import json_graph
import comm_det as cd

# General imports
import matplotlib.pyplot as plt
import numpy as np

# Other imports
import music21


'''
Declare app
'''

app = Flask(__name__)

'''
Set up local corpus
'''
localCorpus = music21.corpus.corpora.LocalCorpus()
localCorpus.addPath('../library/')
#music21.corpus.cacheMetadata()

'''
******************
Define Functions

Create graphs based on the currently used piece (filename)
Generate Random walk from a graph and a given encoding
*******************
'''
#Graph making functions - can apply to any file in ../library


#basic graph, returns multiedge graph and pitch dictionary
def make_graph_from_file(filename, encoding, key, offsets,\
                grouping, changed_edges):

    if encoding == "basic":
        s = music21.corpus.parse(filename)
        for section in s:
            t=type(section)
            print("In basic section")
            print(t)
            if t == music21.stream.Part or t == music21.stream.PartStaff:
                topline = section
                break
				 #ideally throw error if there is no part, need to reupload file
        topline_notes =topline.recurse().notes
        nodelst_basic, pitchdict, og_walk =mnet.convert_basic(topline_notes)
        g=mnet.create_graph(nodelst_basic)
        print("basic graph created")
		
    #grouped graph, returns multiedge graph and pitch dictionary
    if encoding == "grouped": 

        s = music21.corpus.parse(filename)
        for section in s:
            t=type(section)
            print("In Grouped checking stream")
            print(t)
            if t == music21.stream.Part or t == music21.stream.PartStaff:
                topline = section
                break
				#ideally throw error if there is no part, need to reupload file
        topline_notes =topline.recurse().notes
        nodelst_grouped, transition_lst, pitchdict, og_walk  = \
                mnet.convert_grouping(topline_notes, grouping)
        print("transition list is ", transition_lst)
        g=mnet.create_graph(nodelst_grouped)
        print("making grouped graph, g is ", g)
		

    #RN graph, returns multiedge graph and pitch dictionary
    if encoding == "rn": 
        s = music21.corpus.parse(filename)
        chord_lst = s.chordify().recurse().notes
        nodelst, pitchdict, og_walk  = mnet.convert_chord_note(\
                chord_lst, key)
        g=mnet.create_graph(nodelst)

    #Grouped RN graph, returns multiedge graph + pitch labels
    if encoding == "grouped_rn":  
        s = music21.corpus.parse(filename)
        chord_lst = s.chordify().recurse().getElementsByClass('Chord')
        nodelst_group, transition_edges, pitchdict, og_walk = \
            mnet.convert_grouped_rn(chord_lst, grouping, key)
        g=mnet.create_graph(nodelst_group)
		 
    #alter edges according to changed_edges

    for edge in changed_edges.keys():
        g = mnet.degree_reassign(g, edge, changed_edges[edge])

    return g, pitchdict, og_walk

#Other Functions:

#Makes randomwalk json
def make_randomwalk_json(graph, encoding_method):
    randomwalk=mnet.generate_randomwalk(graph)
    tune = encoding_method(randomwalk)
    rwlst = []
	#turn into dictionary with each note having 3 features: 
    # note -> pitch to be played
    # duration -> length of pitch
    # id -> name of node on graph
    # Community label should also be added
    for i in range(len(tune)):
        rwlst.append({"note" : tune[i].pitch.nameWithOctave, \
        			  "duration": int(tune[i].duration.quarterLength*1000),\
					  "id": randomwalk[i]})
    
    #replace '-' with 'b'
    rwlst = mnet.convert_flat_js(rwlst)
    return rwlst

#Input weighted community graph, add pitch labels
def make_visualizable_graph(graph, pitchdict, cur_community, changed_edges, returnDendro=True):
  
    #add communities

    weighted_graph = mnet.convert_to_weighted(graph, False)
    community_graph, dendro = cd.helper_community_detection(\
        weighted_graph, cur_community, returnDendro = returnDendro)
    #weighted_graph = mnet.convert_to_weighted(graph, False)

    #Set pitches
    #Assign using pitchdict
    nx.set_node_attributes(community_graph, pitchdict, "pitch")
    #Assign "start" and "end" manually
    community_graph.nodes["start"]["pitch"]="start"
    community_graph.nodes["end"]["pitch"]="end"
    #Replace music21 '-' with 'b' so flat notes will play
    for node in community_graph.nodes:
        community_graph.nodes[node]["pitch"] = \
               ( community_graph.nodes[node]["pitch"]).replace('-', 'b')

    #change mark changed edges as 0
    nx.set_edge_attributes(community_graph, dict(zip(graph.edges(), \
            np.zeros(len(graph.edges())))), "changed_edge")
 
    for edge in changed_edges:
        print("edge label changed for json")
        community_graph.edges[edge[0], edge[1]]["changed_edge"]=1 
  
    return community_graph, dendro

'''
****************************************
Set Default Global Values and Define Parameters 
Can be passed into Observable or 
manipulated directly. 

TODO: implement encoding 
****************************************
'''
#Dictionary of edges that have been assigned a different weight by the user
changed_edges={}

#Name of currently used file
filename = 'telemannfantasie1.xml'#DO NOT PASS

#Key of piece, used for Roman Numeral Analysis
key = 'A'


#Current graph encoding, use to recalculate graph 
cur_graph_encoding = "grouped"

#Community designator
cur_community = "infomap" 

#Current random walk encoding, determines rhythm for random walk
cur_walk_encoding = mnet.strto16thnote
#Grouping and offset should be joined into 1 variable ideally - grouping
#refers to measure index, while offset refers to note index
grouping = [1, 5, 11, 27, 37, 49, 61, 75, "end"]
offsets=[0.0, 16.0, 40.0, 104.0,144.0, 162.0, 180.0, 201.0, "end"]

#Create initial graph
graph, pitchdict, og_walk = make_graph_from_file(filename, cur_graph_encoding,\
         key, offsets, grouping, changed_edges)

#Walk can be original melody or randomly generated one
#Random walk implementation needs MultiDigraph to work
#Do not convert to weighted graph before generating random walk
walk = mnet.convert_flat_js(og_walk) #make_randomwalk_json(graph, mnet.group_strto16thnote)

#Save OG walk to file
out_file = open("og_walk.json", "w") 
json.dump(walk, out_file) 
out_file.close() 
#print(walk)
#Convert graph to weighted graph with pitch names+ comm labels
print("initial graph is ", graph)
vis_graph, dendro = make_visualizable_graph(\
            graph, pitchdict, cur_community, changed_edges)


data = json_graph.node_link_data(vis_graph)


#Setting of playback. Can either play original tune or random walk
setting = "Original Melody"	
'''
*****************************************
App Routing Section. 
Executes python functions when called by the user.
Very important to include reference to global variable 
in the beginning of each app routing function
*****************************************
'''

#homepage
@app.route('/') 
def default(name=None): 
    global data
    global filename
    global key
    global grouping
    global offsets
    global walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph
    global cur_walk_encoding
    global setting
    global changed_edges

    global dendro #still dictionary here

    return render_template('index.html', data=data, key=key,\
         grouping=grouping, offsets=offsets, walk=walk, setting=setting, dendro=dendro)   

    
#Regenerates the graph based on the currently used 
#file and the desired graph encoding scheme
@app.route('/shiftEncoding', methods=['GET', 'POST'])
def shiftEncoding(name=None):

	#referencing outside variables to pass
    global data
    global filename
    global key
    global grouping
    global offsets
    global walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph
    global cur_walk_encoding
    global changed_edges    
    global dendro 

    print("Filename is ", filename)
	#Send back filename, key, grouping and offsets
    msg = request.get_json()

	#Change to Grouped
    if msg == 1:
        cur_graph_encoding = "grouped"
     
 	#Change to Basic
    if msg == 2:
        cur_graph_encoding = "basic"
        #cur_walk_encoding = mnet.strto16thnote
	#Change to Roman Numeral -- this is very slow, I need to optimize code
    if msg == 3:
        cur_graph_encoding = "rn"
        #cur_walk_encoding = mnet.str_rn
	#Changed to Group Roman Numeral
    if msg ==4:
        cur_graph_encoding = "grouped_rn"   
        #cur_walk_encoding = mnet.str_rn_group

    #Generate New Global Values
    changed_edges = {} #reset
    graph, pitchdict, og_walk = make_graph_from_file(filename,\
             cur_graph_encoding, key, offsets, grouping, changed_edges)
    vis_graph, dendro = make_visualizable_graph(\
            graph, pitchdict, cur_community, changed_edges)

    data = json_graph.node_link_data(vis_graph)


    # write file for testing


    #Set walk to original tune
    walk = mnet.convert_flat_js(og_walk) #make_randomwalk_json(graph, cur_walk_encoding)
    setting = "Original Melody"
    #Return data through javascript function
    return jsonify(data = data, walk = walk, setting=setting, dendro=dendro)


@app.route('/shiftCommunity', methods=['GET', 'POST'])
def shiftCommunity(name=None):
    print("in shift community")
	#referencing outside variables to pass
    global data
    global filename
    global key
    global grouping
    global offsets
    global walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph
    global cur_walk_encoding
    global changed_edges
    global dendro 

	#Send back filename, key, grouping and offsets
    msg = request.get_json()
    new_data = data
    returnDendro=True
	#Change to Infomap
    if msg == 0:     
        cur_community='infomap'
        returnDendro=True
    #Change to LPM
    if msg == 1:
        cur_community = 'LPM'
        returnDendro=True
    #Change to Louvain
    if msg == 2:
        cur_community = 'louvain'
        returnDendro=True
    #Change to HLC
    if msg == 3:
        cur_community = 'HLC'
        returnDendro=False



 
    vis_graph, dendro = make_visualizable_graph(\
            graph, pitchdict, cur_community, changed_edges, returnDendro=returnDendro)



    data = json_graph.node_link_data(vis_graph)

    return jsonify(data = data, dendro=dendro)
	





#Reads user file and saves as 'filename'
#Returns new "Basic" encoding graph and random walk
#based on the user's file 
@app.route('/uploadajax', methods = ['POST'])  
def success():  
#    if request.method == 'POST': 
    global data
    global filename
    global key
    global grouping
    global offsets
    global walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph
    global cur_walk_encoding
    global setting
    global changed_edges
    global dendro 
    print("in update ajax method")
    f = request.files['file'] 

    #Parse file and save in library
    f.save("../library/"+f.filename)


    #Update globals- keep current graph encoding
 
    filename = f.filename
    changed_edges = {}

    graph, pitchdict, og_walk = make_graph_from_file(filename,\
         cur_graph_encoding, key, offsets, grouping, changed_edges)
 
    vis_graph, dendro = make_visualizable_graph(\
            graph, pitchdict, cur_community, changed_edges)


    data = json_graph.node_link_data(vis_graph)
    walk = mnet.convert_flat_js(og_walk)
    setting = "Original Melody"

    return jsonify(data=data, walk = walk, setting=setting, dendro=dendro)




#Reads in additional parameters supplied by user.
#If applicable, changes graph and random walk accordingly
@app.route('/changeparams', methods = ['POST'])
def changeparams():
#    if request.method == 'POST':
    global data
    global filename
    global key
    global grouping
    global offsets
    global walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph
    global cur_walk_encoding
    global changed_edges
    global dendro 

    #Get requested values

    grouping_str = request.form['grouping']  
    key = request.form['key']
    
    # Convert grouping to list of ints
    f = lambda x: int(x)  
    grouping = grouping_str.split()
    grouping = list(map(f, grouping))
    grouping.append("end")
 

    print("grouping is ", grouping)   
    # Recalculate data and random walk
    graph, pitchdict, og_walk = make_graph_from_file(filename,\
         cur_graph_encoding,key, offsets, grouping, changed_edges)
    vis_graph, dendro = make_visualizable_graph(\
            graph, pitchdict, cur_community, changed_edges)


    data = json_graph.node_link_data(vis_graph)
    walk = mnet.convert_flat_js(og_walk) #make_randomwalk_json(graph, cur_walk_encoding)
    setting="Original Melody"
    
    print("Grouping is ", grouping[1])


    return jsonify(data = data, walk = walk, \
                grouping = grouping, key=key, offsets=offsets,\
                         setting=setting, dendro=dendro)


#Changes mode of random walk to ignore or consider community
@app.route('/change_walk_encoding', methods = ['POST'])
def change_walk_encoding():
#    if request.method == 'POST':
    global data
    global filename
    global key
    global grouping
    global offsets
    global walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph
    global cur_walk_encoding
    global setting
    global changed_edges
    global dendro 
    #Get requested values

    encoding_option = request.form['walk_type']  
    print(encoding_option)

    print("graph encoding is ", cur_graph_encoding)
    #Set nessesary globals 
    setting="Random Walk"
 
    #Decide walk encoding based on parameters.

    if cur_graph_encoding == "basic":
        cur_walk_encoding = mnet.strto16thnote 
    elif cur_graph_encoding == "grouped":
        cur_walk_encoding = mnet.group_strto16thnote
    elif cur_graph_encoding == "rn":
        cur_walk_encoding = mnet.str_rn
    elif cur_graph_encoding == "grouped_rn":
        cur_walk_encoding = mnet.str_rn_group  


    #Calculate random walk
    walk = make_randomwalk_json(graph, cur_walk_encoding)
   
 
    #In case of community consideration, random time durations are
    #altered to take communities into account   
    if encoding_option == "consider-comm":
        print("consider_comm executed")
        walk = mnet.str_commmunity_rhythm_JSON(walk, data) 

    return jsonify(data = data, walk = walk, grouping = grouping, \
                key = key, offsets = offsets, setting = setting, dendro=dendro)


#Changes mode of random walk to ignore or consider community
@app.route('/change_edge_weight', methods = ['POST'])
def change_edge_weight():
#    if request.method == 'POST':
    global data
    global filename
    global key
    global grouping
    global offsets
    global walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph
    global cur_walk_encoding
    global setting
    global changed_edges
    global dendro 
    #Get requested values

    src = request.form['src']
    dst = request.form['dst']
    weight = int(request.form['weight'])


  
    print(weight)

    print("graph encoding is ", cur_graph_encoding)
    #Set nessesary globals 

    changed_edges[(src, dst)]=weight
    graph, pitchdict, og_walk = make_graph_from_file(filename,\
         cur_graph_encoding,key, offsets, grouping, changed_edges)

    setting = "Random Walk"
    walk = make_randomwalk_json(graph, cur_walk_encoding)
    vis_graph, dendro = make_visualizable_graph(\
            graph, pitchdict, cur_community, changed_edges)


    data = json_graph.node_link_data(vis_graph)


    return jsonify(data = data, walk = walk, grouping = grouping, \
                key = key, offsets = offsets, setting = setting, dendro=dendro)



 
if __name__ == '__main__':
   app.run(debug = True)




