# author: Daniel Kaiser
'''
Dash demonstration of creating a music network from some data
and then visualizing that network with neat stuff in Dash
'''

# -------------------------- IMPORTS AND GLOBALS -------------------------------
import dash
import dash_core_components as dcc
import dash_html_components as html
import plotly.graph_objects as go
import networkx as nx
import random
import music21
import mnet
# ------------------- NETWORK GENERATION AND VISUALIZATION ---------------------
# Network generation
# Create local corpus with access pieces

localCorpus = music21.corpus.corpora.LocalCorpus()
localCorpus.addPath('../library')
music21.corpus.cacheMetadata()

# Save Telemann Fantasie No. 1 as a stream object
s = music21.corpus.parse('telemannfantasie1.xml')

# Inspect stream to see where desired parts are located
#s.show("text")

# Save Solo Flute part
flute = s[5]

# # Basic Conversion Pipeline

# Convert stream to list of notes
flute_notes =flute.recurse().notes
notelst = list(flute_notes)

# Convert list of notes to list of nodes for graph
nodelst_basic=mnet.convert_basic(notelst)

# Create Multiedge Directional Graph
g_basic=mnet.create_graph(nodelst_basic)

#write as .gexf
nx.write_gexf(g_basic, "basic_composition.gexf")

G = nx.read_gexf('basic_composition.gexf')
# need to add pos for visualization. Note there are layout options,
# but I opted for the quick and dirty for this demo
for node in G.nodes:
    G.nodes[node]['pos'] = (random.random(), random.random())

# Network visualization
# build list of edge locations to draw them on the page later
edge_x = []
edge_y = []
for edge in G.edges():
    x0, y0 = G.nodes[edge[0]]['pos']
    x1, y1 = G.nodes[edge[1]]['pos']
    edge_x.append(x0)
    edge_x.append(x1)
    edge_x.append(None)
    edge_y.append(y0)
    edge_y.append(y1)
    edge_y.append(None)

# the actual drawn edges (as objects, not drawn yet)
edge_trace = go.Scatter(
    x=edge_x, y=edge_y,
    line=dict(width=0.5, color='#888'),
    hoverinfo='none',
    mode='lines')

# the actual drawn nodes (as objects, not drawn yet)
node_x = []
node_y = []
for node in G.nodes():
    x, y = G.nodes[node]['pos']
    node_x.append(x)
    node_y.append(y)

# adds color to nodes, and colorbar and node outlines and all that
node_trace = go.Scatter(
    x=node_x, y=node_y,
    mode='markers',
    hoverinfo='text',
    marker=dict(
        showscale=True,
        # colorscale options
        #'Greys' | 'YlGnBu' | 'Greens' | 'YlOrRd' | 'Bluered' | 'RdBu' |
        #'Reds' | 'Blues' | 'Picnic' | 'Rainbow' | 'Portland' | 'Jet' |
        #'Hot' | 'Blackbody' | 'Earth' | 'Electric' | 'Viridis' |
        colorscale='Viridis',
        reversescale=True,
        color=[],
        size=10,
        colorbar=dict(
            thickness=15,
            title='Node Connections',
            xanchor='left',
            titleside='right'
        ),
        line_width=2))

# add hover text
# not sure what node_adjacencies does
node_adjacencies = []
node_text = []
for node, adjacencies in enumerate(G.adjacency()):
    node_adjacencies.append(len(adjacencies[1]))
    #node_text.append('# of connections: '+str(len(adjacencies[1])))
    node_text.append('Note: {}'.format(list(G.nodes)[node]))

# declares the hover text to be what we set above
node_trace.marker.color = node_adjacencies
node_trace.text = node_text

# Plotly figure object, ties up the backend for all the stuff we set above
fig = go.Figure(data=[edge_trace, node_trace],
             layout=go.Layout(
                plot_bgcolor = 'rgb(237,237,237)',
                title='Music network visualized in Dash',
                titlefont_size=16,
                showlegend=False,
                hovermode='closest',
                margin=dict(b=20,l=5,r=5,t=40),
                #annotations=[ dict(
                #    text="Python code: <a href='https://plotly.com/ipython-notebooks/network-graphs/'> https://plotly.com/ipython-notebooks/network-graphs/</a>",
                #    showarrow=False,
                #    xref="paper", yref="paper",
                #    x=0.005, y=-0.002 ) ],
                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
                )
# would show the figure, but we want a Dash visual not a Plotly one
# see below
#fig.show()


# declares the Plotly figure as a Dash app to be put into an html doc
app = dash.Dash()
app.layout = html.Div([
    dcc.Graph(figure=fig)
])


#if __name__ == '__main__':
# actual starts the Dash app. Console will print out an IP, go there to see it.
app.run_server(debug=True)
