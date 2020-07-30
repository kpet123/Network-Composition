# Nikki Pet, ap3536
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify

import music21
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
import mnet
from networkx.readwrite import json_graph
import json


app = Flask(__name__)

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
print(data)
 
@app.route('/') 
def default(name=None): 
	return render_template('index.html', data=data)   
    

@app.route('/pass_eg', methods=['GET', 'POST'])
def pass_eg(name=None):
	global data
	grouping = [1, 5, 11, 27, 37, 49, 61, 75, "end"]
	nodelst_group, transition_edges= \
	mnet.convert_grouping(flute_notes, grouping)

	g_group=mnet.create_graph(nodelst_group)

	d1  = json_graph.node_link_data( mnet.convert_to_weighted(g_group))
	data = d1
	#print(data)
	
	return jsonify(data = data)
	#return render_template('index.html', data=json_data)




if __name__ == '__main__':
   app.run(debug = True)




