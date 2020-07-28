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
from cdlib import algorithms#.hierarchical_link_community
import hlc  #moved this here to catch error
import networkx as nx
import igraph as ig
import mnet
from networkx.readwrite import json_graph
import infomap
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
music21.corpus.cacheMetadata()

'''
******************
Define Functions

Create graphs based on the currently used piece (filename)
Generate Random walk from a graph and a given encoding
*******************
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
        nodelst_basic, pitchdict, og_walk =mnet.convert_basic(topline_notes)
        g_basic=mnet.create_graph(nodelst_basic)
		 
        return g_basic, pitchdict, og_walk


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
        nodelst_grouped, transition_lst, pitchdict, og_walk  = \
                mnet.convert_grouping(topline_notes, grouping)
        print("transition list is ", transition_lst)
        g_group=mnet.create_graph(nodelst_grouped)
		 
        return g_group, pitchdict, og_walk



#RN graph, returns multiedge graph and pitch dictionary
    if encoding == "rn": 
        s = music21.corpus.parse(filename)
        chord_lst = list(s.chordify().recurse().notes)
        nodelst, pitchdict, og_walk  = mnet.convert_chord_note(\
                chord_lst, key)
        g_rn=mnet.create_graph(nodelst)

        print("roman numeral converted")	
        return g_rn, pitchdict, og_walk

#Grouped RN graph, returns multiedge graph + pitch labels
    if encoding == "grouped_rn":  
        s = music21.corpus.parse(filename)
        chord_lst = s.flat.chordify().recurse().notes
        nodelst_group, transition_edges, pitchdict, og_walk = \
            mnet.convert_grouped_rn(chord_lst,offsets, key)
        g_group=mnet.create_graph(nodelst_group)
		 
        return g_group, pitchdict, og_walk

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
        edge_tuples = [edge.tuple for edge in g.es]
        im = infomap.Infomap()
        im.add_links(edge_tuples)
        im.run("-d -N 10")
        modules = im.get_multilevel_modules()
        
        # igraph non-hierarchical version
        #infomap_partition = g.community_infomap(edge_weights='weight')
        
        infomap_partition_assignment = {g.vs[i]['name'] : modules[i] 
                        for i in range(g.vcount())}
        
        return infomap_partition_assignment
    

    elif method == "LPM":
        lpm_partition = g.community_label_propagation(weights='weight')
        lpm_partition_assignment = {g.vs[i]['name'] : lpm_partition.membership[i] 
                        for i in range(g.vcount())}
        
        return lpm_partition_assignment
    

    elif method == 'louvain':
        louvain_partition = g.community_multilevel(weights=[e['weight'] for e in g.es], return_levels=True)
        louvain_partition_assignment = {g.vs[i]['name'] : [level.membership[i] for level in louvain_partition]
                        for i in range(len(g.vs))}
        
        return louvain_partition_assignment

    elif method == 'HLC':
        coms = algorithms.hierarchical_link_community(g)
        
        #return coms.communities

        ### TRYING HLC MODULE
        os.system('python hlc -o temp_hlc_clusters.txt' )


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
    if method != 'HLC':
        for note in graph.nodes:
            graph.nodes[note]['comm'] = partition_data[note]
    else:
        for link in g.es:
            for comm in partition_data:
                if link.tuple in comm:
                    # igraph edge atribute, don't need for final, used in debug
                    g.es[link.tuple]['comm'] = partition_data.index(comm)
                    # set as link attribute, should be easily retrievable from JSON?
                    src = g.vs[link.tuple[0]]['name']
                    tgt = g.vs[link.tuple[1]]['name']
                    graph.edges[(src, tgt)]['comm'] = partition_data.index(comm)
    
    
    return graph

#Input weighted community graph, add pitch labels
def make_visualizable_graph(graph, pitchdict, cur_community):

    #add communities
    community_graph = helper_community_detection(mnet.convert_to_weighted(\
            graph, False), cur_community)
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
graph, pitchdict, og_walk = make_graph_from_file(filename, cur_graph_encoding, key, offsets, grouping)

#Walk can be original melody or randomly generated one
#Random walk implementation needs MultiDigraph to work
#Do not convert to weighted graph before generating random walk
walk = mnet.convert_flat_js(og_walk) #make_randomwalk_json(graph, mnet.group_strto16thnote)

print(walk)
#Convert graph to weighted graph with pitch names+ comm labels

data = json_graph.node_link_data(make_visualizable_graph(\
            graph, pitchdict, cur_community) )


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

    return render_template('index.html', data=data, key=key,\
         grouping=grouping, offsets=offsets, walk=walk, setting=setting)   

    
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

    #Generate graph and pitchlist
    graph, pitchdict, og_walk = make_graph_from_file(filename,\
             cur_graph_encoding, key, offsets, grouping)
    data = json_graph.node_link_data(make_visualizable_graph(\
                graph, pitchdict, cur_community))


    #write file for testing
    out_file = open("myfile.json", "w") 
    json.dump(data, out_file) 
    out_file.close() 

    #Set walk to original tune
    walk = mnet.convert_flat_js(og_walk) #make_randomwalk_json(graph, cur_walk_encoding)
    setting = "Original Melody"
    #Return data through javascript function
    return jsonify(data = data, walk = walk, setting=setting)


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
    global walk
    global cur_graph_encoding
    global pitchdict
    global cur_community
    global graph
    global cur_walk_encoding
    global setting

    print("in update ajax method")
    f = request.files['file'] 

    #parse and render data with "Basic" default
 

    f.save("../library/"+f.filename)
    filename = f.filename
    graph, pitchdict, og_walk = make_graph_from_file(filename,\
         cur_graph_encoding, key, offsets, grouping)
    data = json_graph.node_link_data(make_visualizable_graph(\
                 graph, pitchdict, cur_community))
    walk = mnet.convert_flat_js(og_walk)
    setting = "Original Melody"
    return jsonify(data=data, walk = walk, setting=setting)




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
    graph, pitchdict, og_walk = make_graph_from_file(filename,\
         cur_graph_encoding,key, offsets, grouping)
    data = json_graph.node_link_data(make_visualizable_graph(\
                 graph, pitchdict, cur_community))
    walk = mnet.convert_flat_js(og_walk) #make_randomwalk_json(graph, cur_walk_encoding)
    setting="Original Melody"
    
    print("Grouping is ", grouping[1])


    return jsonify(data = data, walk = walk, \
                grouping = grouping, key=key, offsets=offsets,\
                         setting=setting)


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
    elif cur_graph_encoding == "group_rn":
        cur_walk_encoding = mnet.str_rn_group  


    #Calculate random walk
    walk = make_randomwalk_json(graph, cur_walk_encoding)
   
 
    #In case of community consideration, random time durations are
    #altered to take communities into account   
    if encoding_option == "consider-comm":
        walk = mnet.str_commmunity_rhythm_JSON(walk, data) 

    return jsonify(data = data, walk = walk, grouping = grouping, \
                key = key, offsets = offsets, setting = setting)


 
if __name__ == '__main__':
   app.run(debug = True)




