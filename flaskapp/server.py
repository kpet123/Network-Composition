#Flask-related imports
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

#general imports
import music21
import networkx as nx
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
localCorpus.addPath('../library')
music21.corpus.cacheMetadata()

'''
***************
Define Functions
****************
'''
#Can apply to any file in ../library
def make_basic_graph_from_file(filename):
    s = music21.corpus.parse(filename)
    for section in s:
        t=type(section)
        if t == music21.stream.Part:
            topline = section
            break;
			#ideally throw error if there is no part, need to reupload file
    topline_notes =list(topline.recurse().notes)
    nodelst_basic=mnet.convert_basic(topline_notes)
    g_basic=mnet.create_graph(nodelst_basic)
    data = mnet.convert_to_weighted(g_basic)
    return data

def make_grouped_graph_from_file(filename, grouping):
    s = music21.corpus.parse(filename)
    for section in s:
        if type(section)==music21.stream.Part:
            topline = section
            break;
			#ideally throw error if there is no part, need to reupload file
    topline_notes =list(topline.recurse().notes)
    nodelst_group, transition_edges= \
    		mnet.convert_grouping(flute_notes, grouping)
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
	chord_lst = s.flat.chordify().recurse().notes
	nodelst_group, transition_edges=mnet.convert_grouped_rn(chord_lst,\
             offsets, key)
	g_group=mnet.create_graph(nodelst_group)
	data = mnet.convert_to_weighted(g_group)
	return data

def make_randomwalk_json(graph, encoding_method):
    randomwalk=mnet.generate_randomwalk(graph)
    tune = encoding_method(randomwalk)
    rwdict = {}
    for note in tune:
        rwdict[note.pitch.nameWithOctave] = note.duration.quarterLength*1000
    return rwdict

'''
****************************************
Set Default Values and Define Parameters 
Can be passed into Observable
****************************************
'''
filename = 'telemannfantasie1.xml'
graph = make_basic_graph_from_file('telemannfantasie1.xml')
data = json_graph.node_link_data(graph)
key = 'A'
#Grouping and offset should be joined into 1 variable ideally - grouping
#refers to measure index, while offset refers to note index
grouping = [1, 5, 11, 27, 37, 49, 61, 75, "end"]
offsets=[0.0, 16.0, 40.0, 104.0, 144.0, 162.0, 180.0, 201.0, "end"]
randomwalk = make_randomwalk_json(graph, mnet.strto16thnote)


 
@app.route('/') 
def default(name=None): 
	return render_template('index.html', data=data, filename = filename,
										key=key, grouping = grouping,
										offsets=offsets, randomwalk=randomwalk)   
    

@app.route('/shiftEncoding', methods=['GET', 'POST'])
def shiftEncoding(name=None):

	#referencing outside variables to pass
    global data
    global filename
    global key
    global grouping
    global offsets
    global randomwalk


	#Send back filename, key, grouping and offsets
    msg = request.get_json()
    print(msg)
	#for now.....
    new_data = data
    new_filename = filename
    new_key= key
    new_grouping = grouping
    new_offsets = offsets
    new_randomwalk = randomwalk

	#Change to Grouped
    if msg == 1:
        print("grouping code executed")
        data = json_graph.node_link_data(\
			make_grouped_graph_from_file(new_filename, new_grouping))	

	#Change to Basic
    if msg == 2:
        data = json_graph.node_link_data(make_basic_graph_from_file(\
				new_filename))

	#Change to Roman Numeral -- this is very slow, I need to optimize code
    if msg == 3:
        data = json_graph.node_link_data(\
			make_roman_numeral_graph_from_file(new_filename, new_key))

	#Changed to Group Roman Numeral
    if msg ==4:
        data = json_graph.node_link_data(\
			make_grouped_rn_graph_from_file(\
				new_filename, new_offsets, new_key))

    return jsonify(data = data)
	#return render_template('index.html', data=json_data)

@app.route('/success', methods = ['POST'])  
def success():  
    if request.method == 'POST': 
	
        f = request.files['file'] 

		#parse and render data with "Basic" default
        global data
		 
        f.save("../library/"+f.filename)
        s = music21.corpus.parse(f.filename)
        for section in s:
            if type(section)==music21.stream.Part:
                topline = section
                break;
        topline_notes =list(topline.recurse().notes)
        nodelst_basic=mnet.convert_basic(topline_notes)
        g_basic=mnet.create_graph(nodelst_basic)
        data = json_graph.node_link_data( mnet.convert_to_weighted(g_basic))  
        return render_template("index.html", data=data)  

if __name__ == '__main__':
   app.run(debug = True)




