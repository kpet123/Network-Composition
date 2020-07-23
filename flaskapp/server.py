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
#Graph making functions - can apply to any file in ../library


#basic graph, returns multiedge graph and pitch dictionary
def make_graph_from_file(filename, encoding, key, offsets, grouping):

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
        topline_notes =list(topline.recurse().notes)
        nodelst_basic, pitchdict =mnet.convert_basic(topline_notes)
        g_basic=mnet.create_graph(nodelst_basic)
		 
        return g_basic, pitchdict


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
        topline_notes =list(topline.recurse().notes)
        nodelst_grouped, transition_lst, pitchdict =mnet.convert_grouping(\
						topline_notes, grouping)
        print("transition list is ", transition_lst)
        g_group=mnet.create_graph(nodelst_grouped)
		 
        return g_group, pitchdict



#RN graph, returns multiedge graph and pitch dictionary
    if encoding == "rn": 
        s = music21.corpus.parse(filename)
        chord_lst = list(s.chordify().recurse().notes)
        nodelst, pitchdict  = mnet.convert_chord_note(chord_lst, key)
        g_rn=mnet.create_graph(nodelst)

        print("roman numeral converted")	
        return g_rn, pitchdict

#Grouped RN graph, returns multiedge graph + pitch labels
    if encoding == "grouped_rn":  
        s = music21.corpus.parse(filename)
        chord_lst = s.flat.chordify().recurse().notes
        nodelst_group, transition_edges, pitchdict=mnet.convert_grouped_rn(\
						chord_lst,offsets, key)
        g_group=mnet.create_graph(nodelst_group)
		 
        return g_group, pitchdict

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
        			  "duration": tune[i].duration.quarterLength*1000,\
					  "id": randomwalk[i]})
    return rwlst

def make_communities(g, method): 
    '''
    Function to run community detection

    Inputs:
        g : networkx object
            Networkx network object representing raw music data
        method : string
            String identifying clustering method to be used.
            Options are (case-sensitive):
                1) infomap
                2) LPM
                3) louvain
                4) HLC
    Returns:
        graph : networkx object
            Networkx network object with added community data
    '''
    print("*******Inside main comm function *******")


    if method == "infomap":
        infomap_partition = g.community_infomap(edge_weights='weight')
        infomap_partition_assignment = {g.vs[i]['name'] : infomap_partition.membership[i] 
                        for i in range(g.vcount())}
        
        return infomap_partition_assignment
    

    elif method == "LPM":
        lpm_partition = g.community_label_propagation(weights='weight')
        lpm_partition_assignment = {g.vs[i]['name'] : lpm_partition.membership[i] 
                        for i in range(g.vcount())}
        
        return lpm_partition_assignment
    

    elif method == 'louvain':
        louvain_partition = g.community_multilevel(weights=[e['weight'] for e in g.es])
        louvain_partition_assignment = {g.vs[i]['name'] : louvain_partition.membership[i] 
                        for i in range(len(g.vs))}
        
        return louvain_partition_assignment

    elif method == 'HLC':
        pass

def helper_community_detection(graph, method):
    '''
    Helper function to route graph and method to correct community detection

    Inputs:
        graph : networkx object
            Networkx network object representing raw music data
        method : string
            String identifying clustering method to be used
            Options are (case-sensitive):
                1) infomap
                2) LPM
                3) louvain
                4) HLC
    Returns:
        graph : networkx object
            Networkx network object with added community data
    '''
    print("********* Inside Helper Comm Function*****")


    # Node methods
    if method != 'HLC':
        # igraph methods' conversion
        if method == 'louvain':
            # Note louvain does not apply for directed networks, be wary of the results!
            g = ig.Graph.TupleList(graph.edges(), directed=False)
        else:
            g = ig.Graph.TupleList(graph.edges(), directed=True)
        for edge in g.es:
            src = g.vs[edge.tuple[0]]['name']
            tgt = g.vs[edge.tuple[1]]['name']
            try:
                edge['weight'] = graph.get_edge_data(src, tgt)['weight']
            except TypeError:
                edge['weight'] = 1

        partition_data = make_communities(g, method)
        # add partition data to graph object
        for note in graph.nodes:
            graph.nodes[note]['comm'] = partition_data[note]
    
    # Link methods
    else:
        partition_data = make_communities(graph, method)
    
    
    return graph

#Input weighted community graph, add pitch labels
def make_visualizable_graph(graph, pitchdict, cur_community):

    #add communities
    community_graph = helper_community_detection(mnet.convert_to_weighted(\
            graph, False), cur_community)
    #weighted_graph = mnet.convert_to_weighted(graph, False)
    nx.set_node_attributes(community_graph, pitchdict, "pitch")
    return community_graph 


'''
****************************************
Set Default Global Values and Define Parameters 
Can be passed into Observable or 
manipulated directly. 

TODO: implement encoding 
****************************************
'''

#Name of currently used file
filename = 'telemannfantasie1.xml'#DO NOT PASS

#Key of piece, used for Roman Numeral Analysis
key = 'A'


#Current graph encoding, use to recalculate graph 
cur_graph_encoding = "basic"

#Community designator
cur_community = "louvain" 

#Current random walk encoding, determines rhythm for random walk
cur_walk_encoding = mnet.strto16thnote
#Grouping and offset should be joined into 1 variable ideally - grouping
#refers to measure index, while offset refers to note index
grouping = [1, 5, 11, 27, 37, 49, 61, 75, "end"]
offsets=[0.0, 16.0, 40.0, 104.0,144.0, 162.0, 180.0, 201.0, "end"]

#Create initial graph
graph, pitchdict = make_graph_from_file(filename, cur_graph_encoding,\
					 key, offsets, grouping)

#Random walk implementation needs MultiDigraph to work
#Do not convert to weighted graph before generating random walk
random_walk = make_randomwalk_json(graph, mnet.strto16thnote)


#Convert graph to weighted graph with pitch names+ comm labels

data = json_graph.node_link_data(make_visualizable_graph(\
            graph, pitchdict, cur_community) )
	

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
    global data
    global filename
    global key
    global grouping
    global offsets
    global random_walk
    global cur_graph_encoding
    global pitchdict
    global cur_community

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
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph

    print("Filename is ", filename)
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
        cur_graph_encoding = "grouped"
        cur_walk_encoding = mnet.group_strto16thnote
 	#Change to Basic
    if msg == 2:
        cur_graph_encoding = "basic"
        cur_walk_encoding = mnet.strto16thnote
	#Change to Roman Numeral -- this is very slow, I need to optimize code
    if msg == 3:
        cur_graph_encoding = "rn"
        cur_walk_encoding = mnet.str_rn
	#Changed to Group Roman Numeral
    if msg ==4:
        cur_graph_encoding = "grouped_rn"   


    #Generate graph and pitchlist
    graph, pitchdict = make_graph_from_file(filename, cur_graph_encoding,\
                     key, offsets, grouping)
    data = json_graph.node_link_data(make_visualizable_graph(\
                graph, pitchdict, cur_community))


    #write file for testing
    out_file = open("myfile.json", "w") 
    json.dump(data, out_file) 
    out_file.close() 


    print("Current walk encoding is ", str(cur_walk_encoding))
    random_walk = make_randomwalk_json(graph, cur_walk_encoding)
    #Return data through javascript function
    return jsonify(data = data, random_walk = random_walk)
	#return render_template('index.html', data=json_data)

@app.route('/shiftCommunity', methods=['GET', 'POST'])
def shiftCommunity(name=None):
    print("in shift community")
	#referencing outside variables to pass
    global data
    global filename
    global key
    global grouping
    global offsets
    global random_walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph

	#Send back filename, key, grouping and offsets
    msg = request.get_json()
    new_data = data

	#Change to Infomap
    if msg == 0:     
	    cur_community='infomap'
    #Change to LPM
    if msg == 1:
        cur_community = 'LPM'
    #Change to Louvain
    if msg == 2:
        cur_community = 'louvain'
    #Change to HLC
    if msg == 3:
        cur_community = 'HLC'

    print("cur_community is ", cur_community)
 
    data = json_graph.node_link_data(make_visualizable_graph(\
            graph, pitchdict, cur_community) )

    return jsonify(data = data)
	





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
    global random_walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph


    f = request.files['file'] 

    #parse and render data with "Basic" default
 

    f.save("../library/"+f.filename)
    filename = f.filename
    graph, pitchdict = make_graph_from_file(filename, cur_graph_encoding,\
                 key, offsets, grouping)
    data = json_graph.node_link_data(make_visualizable_graph(\
                 graph, pitchdict, cur_community))
    random_walk = make_randomwalk_json(graph, cur_walk_encoding)
    print("code in success executed") 
    return jsonify(data=data, raondom_walk = random_walk)



#TODO: implement this
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
    global random_walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph 


    #Get requested values

    grouping_str = request.form['grouping']  
    offsets_str = request.form['offsets'] 
    key = request.form['key']
    
    # Convert grouping and offsets to list of ints
    f = lambda x: int(x)  
    grouping = grouping_str.split()
    grouping = list(map(f, grouping))
    grouping.append("end")
 
    offsets = offsets_str.split()
    offsets = list(map(f, offsets))
    offsets.append("end")

    print("grouping is ", grouping)   
    # Recalculate data and random walk
    graph, pitchdict = make_graph_from_file(filename, cur_graph_encoding,\
                 key, offsets, grouping)
    data = json_graph.node_link_data(make_visualizable_graph(\
                 graph, pitchdict, cur_community))
    random_walk = make_randomwalk_json(graph, cur_walk_encoding)

    
    print("Grouping is ", grouping[1])


    return jsonify(data = data, random_walk = random_walk, \
                grouping = grouping, key = key, offsets = offsets)



 
if __name__ == '__main__':
   app.run(debug = True)




