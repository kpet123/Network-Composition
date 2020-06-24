# author: Daniel Kaiser
'''
Dash demonstration of creating a music network from some data
and then visualizing that network with neat stuff in Dash
'''

# -------------------------- IMPORTS AND GLOBALS -------------------------------
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import plotly.graph_objects as go

import networkx as nx
import music21
import mnet

import random
# ------------------------------- FUNCTIONS ------------------------------------
def set_hover_text(G, type="Note"):
    # not sure what node_adjacencies does
    node_adjacencies = []
    node_text = []
    for node, adjacencies in enumerate(G.adjacency()):
        node_adjacencies.append(len(adjacencies[1]))
        if type == "Note":
            node_text.append('Note: {}'.format(list(G.nodes)[node]))
        elif type == "Degree":
            node_text.append('# of connections: '+str(len(adjacencies[1])))

    return node_adjacencies, node_text




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
# declares the hover text to be what we set above
node_trace.marker.color, node_trace.text = set_hover_text(G)



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
    # Upload data
    html.Div([
        dcc.Upload(
        id='upload-data',
        children=html.Div([
            'Drag and Drop or ',
            html.A('Select Files')
        ]),
        style={
            'width': '100%',
            'height': '60px',
            'lineHeight': '60px',
            'borderWidth': '1px',
            'borderStyle': 'dashed',
            'borderRadius': '5px',
            'textAlign': 'center',
            'margin': '10px'
        },
        # Don't allow multiple files to be uploaded
        multiple=False
    ),
        html.Div(id='output-data-upload')
    ]),

    # Main figure
    html.Div([
        dcc.Graph(figure=fig, id='fig'),
        html.Div("Information displayed on node hover: ", id='dummy1'),
        dcc.RadioItems(
                    id='node-display',
                    options=[{'label': i, 'value': i} for i in ['Note', 'Degree']],
                    value='Note',
                    labelStyle={'display': 'inline-block'}
                )
    ]),

    # Encoding scheme box
    html.Div([
        dcc.RadioItems(
                    id='encoding',
                    options=[{'label': i, 'value': i} for i in ['Roman', 'Discrete', 'Thingy']],
                    value='Roman',
                    labelStyle={'display': 'inline-block'}
                ),
        html.H5(id="encoding-div"),
    ], style=dict(display='inline-block', verticalAlign = 'middle', margin = '20')),

    # Community detection box
    html.Div([
        html.H5(id="comm-det-div"),

        dcc.Dropdown(
                    id='comm-det-method',
                    options=[{'label': i, 'value': i} for i in ['Infomap', 'Louvain', 'LPM', 'CNM']],
                    value='Infomap',
                    style=dict(
                        width='75%',
                        verticalAlign="middle"
                    )
                ),
    ], style=dict(display='inline-block', verticalAlign='middle', margin = 50)),

    # Basic stats box
    html.Div([
        html.H1('Basic Stats Block'),
        html.Div('There are {} nodes'.format(G.number_of_nodes()), id='num-nodes'),
        html.Div('The node with the highest degree is {}'.format(sorted(G.degree, key=lambda x: x[1], reverse=True)[0][0]), id='hub')
    ])

])

# Update node hover
@app.callback(
    Output(component_id='fig', component_property='figure'),
    [Input(component_id='node-display', component_property='value')]
)
def update_node_display(input_value):
    node_trace.marker.color, node_trace.text = set_hover_text(G, input_value)
    return dict(
        data=[edge_trace, node_trace],
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

# Update Encoding Scheme
@app.callback(
    Output(component_id='encoding-div', component_property='children'),
    [Input(component_id='encoding', component_property='value')]
)
def update_encoding(input_value):
    return 'Current encoding scheme:\n "{}"'.format(input_value)


# Update Community Detection
@app.callback(
    Output(component_id='comm-det-div', component_property='children'),
    [Input(component_id='comm-det-method', component_property='value')]
)
def update_comm_det(input_value):
    return 'Current community detection method: "{}"'.format(input_value)

#if __name__ == '__main__':
# actual starts the Dash app. Console will print out an IP, go there to see it.
app.run_server(debug=True)
