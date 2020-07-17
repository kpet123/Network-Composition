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
define folder for uploaded data - may not include
'''
UPLOAD_FOLDER = '/uploads'
ALLOWED_EXTENSIONS = {'xml', 'mid', 'midi', 'mxml'}

'''
Declare app
'''

app = Flask(__name__)

'''
Allow User to Upload Data in the form of ALLOWED_EXTENSIONS
Code adapted from: 
https://flask.palletsprojects.com/en/1.1.x/patterns/fileuploads/
'''
#set upload folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#prune out files that are incorrect extension
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS





'''
Create Default Data
'''

localCorpus = music21.corpus.corpora.LocalCorpus()
localCorpus.addPath('../library')
music21.corpus.cacheMetadata()
s = music21.corpus.parse('telemannfantasie1.xml')
flute = s[5]
flute_notes =list(flute.recurse().notes)
nodelst_basic=mnet.convert_basic(flute_notes)
g_basic=mnet.create_graph(nodelst_basic)
data = json_graph.node_link_data( mnet.convert_to_weighted(g_basic))
#print(data)
#data = {"test": "hi"}
#print(data)
 
@app.route('/') 
def default(name=None): 
	return render_template('index.html', data=data)   
    

@app.route('/shiftEncoding', methods=['GET', 'POST'])
def shiftEncoding(name=None):
	global data

	#The message from 
	msg = request.get_json()
	print(msg)

	#Change to Grouped
	if msg == 1:
		print("grouping code executed")
		grouping = [1, 5, 11, 27, 37, 49, 61, 75, "end"]
		nodelst_group, transition_edges= \
		mnet.convert_grouping(flute_notes, grouping)

		g_group=mnet.create_graph(nodelst_group)

		new_data  = json_graph.node_link_data( mnet.convert_to_weighted(g_group))
		data = new_data

	#Change to Basic
	if msg == 2:
		nodelst_basic=mnet.convert_basic(flute_notes)
		g_basic=mnet.create_graph(nodelst_basic)
		new_data = json_graph.node_link_data( mnet.convert_to_weighted(g_basic))
		data = new_data				

	#Change to Roman Numeral -- this is very slow, I need to optimize code
	if msg == 3:
		chord_lst = list(s.chordify().recurse().notes)
		nodelst = mnet.convert_chord_note(chord_lst, 'A')
		g_rn=mnet.create_graph(nodelst)
		new_data = json_graph.node_link_data(mnet.convert_to_weighted(g_rn))
		print("roman numeral converted")	
		data = new_data

	if msg ==4:
		chord_lst = s.flat.chordify().recurse().notes
		offsets=[0.0, 16.0, 40.0, 104.0, 144.0, 162.0, 180.0, 201.0, "end"]
		nodelst_group, transition_edges=mnet.convert_grouped_rn(chord_lst,\
			 offsets, "A")
		g_group=mnet.create_graph(nodelst_group)
		new_data = json_graph.node_link_data(mnet.convert_to_weighted(g_group))
		data = new_data
	#Change to Grouped Roman Numeral
	print("about to be sent")
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
		s = music21.corpus.parse('telemannfantasie1.xml')
        topline = s[5]
        topline_notes =list(topline.recurse().notes)
        nodelst_basic=mnet.convert_basic(topline_notes)
        g_basic=mnet.create_graph(nodelst_basic)
        data = json_graph.node_link_data( mnet.convert_to_weighted(g_basic))  
        return render_template("index.html", data=data)  

if __name__ == '__main__':
   app.run(debug = True)



