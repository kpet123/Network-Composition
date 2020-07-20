#Flask-related imports
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

#general imports
import music21
import networkx as nx
import igraph as ig
import matplotlib.pyplot as plt
import numpy as np
import mnet
from networkx.readwrite import json_graph
import json
import os

'''
Declare app
'''

app = Flask(__name__)

'''
Set up local corpus
'''
localCorpus = music21.corpus.corpora.LocalCorpus()
localCorpus.addPath('../library/')
music21.corpus.cacheMetadata()

'''
***************
Define Functions

Create graphs based on the currently used piece (filename)
Generate Random walk from a graph and a given encoding
****************
'''
#Can apply to any file in ../library
def make_basic_graph_from_file(filename):
    s = music21.corpus.parse(filename)
    for section in s:
        t=type(section)
        print(t)
        if t == music21.stream.Part or t == music21.stream.PartStaff:
            topline = section
            break
			#ideally throw error if there is no part, need to reupload file
    topline_notes =list(topline.recurse().notes)
    nodelst_basic=mnet.convert_basic(topline_notes)
    g_basic=mnet.create_graph(nodelst_basic)
    data = mnet.convert_to_weighted(g_basic, fraction=False)
    return data

def make_grouped_graph_from_file(filename, grouping):
    s = music21.corpus.parse(filename)
    for section in s:
        if type(section)==music21.stream.Part:
            print(section)
            tl = section
            break
			#ideally throw error if there is no part, need to reupload file
    print("topline is ", tl)
    topline_notes =list(tl.recurse().notes)
    nodelst_group, transition_edges= \
    		mnet.convert_grouping(topline_notes, grouping)
    g_group=mnet.create_graph(nodelst_group)
    data = mnet.convert_to_weighted(g_group)
    return data

def make_roman_numeral_graph_from_file(filename, key):
	s = music21.corpus.parse(filename)
	chord_lst = list(s.chordify().recurse().notes)
	nodelst = mnet.convert_chord_note(chord_lst, key)
	g_rn=mnet.create_graph(nodelst)
	data = mnet.convert_to_weighted(g_rn)
	print("roman numeral converted")	
	return data

def make_grouped_rn_graph_from_file(filename, offsets, key):
    s = music21.corpus.parse(filename)
    chord_lst = s.flat.chordify().recurse().notes
    nodelst_group, transition_edges=mnet.convert_grouped_rn(chord_lst,\
             offsets, key)
    g_group=mnet.create_graph(nodelst_group)
    data = mnet.convert_to_weighted(g_group)
    return data

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
        			  "duration": tune[i].duration.quarterLength*1000,\
					  "id": randomwalk[i]})
    return rwlst

def make_communities(graph, method): #networkx graph object, string
    # options are: infomap, LPM, louvain (high), HLC (Hiearchical Link Clustering), 

    if method == "infomap":
        # convert to igraph
        g = ig.Graph.TupleList(graph.edges(), directed=True)
        for edge in g.es:
            src = g.vs[edge.tuple[0]]['name']
            tgt = g.vs[edge.tuple[1]]['name']
            weight = graph.get_edge_data(src, tgt)['weight']
            edge['weight'] = weight
        # run infomap
        infomap_partition = g.community_infomap(edge_weights='weight')
        infomap_partition_assignment = {g.vs[i]['name'] : infomap_partition.membership[i] 
                        for i in range(len(g.vs))}
        
        return infomap_partition_assignment
    
    elif method == "LPM":
        # convert to igraph
        g = ig.Graph.TupleList(graph.edges(), directed=True)
        for edge in g.es:
            src = g.vs[edge.tuple[0]]['name']
            tgt = g.vs[edge.tuple[1]]['name']
            weight = graph.get_edge_data(src, tgt)['weight']
            edge['weight'] = weight
        # run lpm
        lpm_partition = g.community_label_propagation(weights='weight')
        lpm_partition_assignment = {g.vs[i]['name'] : lpm_partition.membership[i] 
                        for i in range(len(g.vs))}
        
        return lpm_partition_assignment
    
    elif method == 'louvain':
        # convert to igraph
        g = ig.Graph.TupleList(graph.edges(), directed=False)
        for edge in g.es:
            src = g.vs[edge.tuple[0]]['name']
            tgt = g.vs[edge.tuple[1]]['name']
            weight = graph.get_edge_data(src, tgt)['weight']
            edge['weight'] = weight
            print(weight)
        # run louvain
        louvain_partition = g.community_multilevel(weights=[e['weight'] for e in g.es])
        louvain_partition_assignment = {g.vs[i]['name'] : louvain_partition.membership[i] 
                        for i in range(len(g.vs))}
        
        return louvain_partition_assignment

def helper_community_detection(graph, method):
    partition_data = make_communities(graph, method)
    for note in graph.nodes:
        graph.nodes[note]['comm_{}'.format(method)] = partition_data[note]

    return graph

'''
****************************************
Set Default Global Values and Define Parameters 
Can be passed into Observable or 
manipulated directly. 

TODO: implement encoding 
****************************************
'''
filename = 'telemannfantasie1.xml'#DO NOT PASS
key = 'A'
graph = make_basic_graph_from_file('telemannfantasie1.xml')

# DEBUG
# Different encoding to chick triviality of community assignment
graph = make_roman_numeral_graph_from_file(filename, key) 


graph = helper_community_detection(graph, 'infomap')
graph = helper_community_detection(graph, 'LPM')
data = json_graph.node_link_data(graph)
print("data is:",type(data))
#print(data)

#Grouping and offset should be joined into 1 variable ideally - grouping
#refers to measure index, while offset refers to note index
grouping = [1, 5, 11, 27, 37, 49, 61, 75, "end"]
offsets=[0.0, 16.0, 40.0, 104.0,144.0, 162.0, 180.0, 201.0, "end"]
random_walk = make_randomwalk_json(graph, mnet.strto16thnote)
print("randomwalk is :", type(random_walk))

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
	return render_template('index.html', data=data, key=key, grouping = grouping,			offsets=offsets, random_walk=random_walk)   

    
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
    global random_walk


	#Send back filename, key, grouping and offsets
    msg = request.get_json()
    print(msg)
	#for now.....
    new_data = data
    new_key= key
    new_grouping = grouping
    new_offsets = offsets
    new_randomwalk = random_walk

	#Change to Grouped
    if msg == 1:
        print("grouping code executed")
        graph = make_grouped_graph_from_file(filename, new_grouping)
        data = json_graph.node_link_data(graph)	
        random_walk = make_randomwalk_json(graph, mnet.group_strto16thnote)
	#Change to Basic
    if msg == 2:
        graph = make_basic_graph_from_file(filename)
        data = json_graph.node_link_data(graph)
        random_walk = make_randomwalk_json(graph, mnet.strto16thnote)
	#Change to Roman Numeral -- this is very slow, I need to optimize code
    if msg == 3:
        data = json_graph.node_link_data(\
			make_roman_numeral_graph_from_file(filename, new_key))

	#Changed to Group Roman Numeral
    if msg ==4:
        graph = make_grouped_rn_graph_from_file(filename, \
						new_offsets, new_key)
        data = json_graph.node_link_data(graph)

    return jsonify(data = data, random_walk = random_walk)
	#return render_template('index.html', data=json_data)


#Reads user file and saves as 'filename'
#Returns new "Basic" encoding graph and random walk
#based on the user's file 
@app.route('/success', methods = ['POST'])  
def success():  
    if request.method == 'POST': 
	
        f = request.files['file'] 

		#parse and render data with "Basic" default
        global data
        global filename
        global random_walk
        global grouping
        global offsets
        global key
        f.save("../library/"+f.filename)
        filename = f.filename
        graph = make_basic_graph_from_file(filename)
        data = json_graph.node_link_data(graph) 
        random_walk = make_randomwalk_json(graph, mnet.strto16thnote)
        print("code in success executed") 
        return render_template('index.html',
								  data=data, \
                                  key=key, grouping = grouping,\
                                  offsets=offsets, random_walk=random_walk) 

#TODO: implement this
#Reads in additional parameters supplied by user.
#If applicable, changes graph and random walk accordingly
@app.route('/changeparams', methods = ['POST'])
def changeparams():
    if request.method == 'POST':
        global data
        global filename
        global random_walk
        global grouping
        global offsets
        global key  
        return render_template('index.html',
                                  data=data, \
                                  key=key, grouping = grouping,\
                                  offsets=offsets, random_walk=random_walk)


if __name__ == '__main__':
   app.run(debug = True)




