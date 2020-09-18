import json

from cdlib import algorithms
import networkx as nx
import infomap
import igraph as ig

from networkx.readwrite import json_graph

def create_dicts(maxes, level = 0):
	if level == len(maxes):
		return []

	dicts = []
	for i in range(maxes[level]):
		dicts.append({
			'name': 'Level ' + str(level) + ', Group ' + str(i+1),
			'children': create_dicts(maxes, level + 1)
		})

	return dicts

def generate_dendrogram(partition_data):
    '''
    Generates a JSON file with dendrogram of community assignments

    Inputs:
        partition_data : dict
            Dict with note names as keys and partition data as values, an ordered array of hierarchical placement

        Returns: 
            None
    '''
    # to keep track of recursion stop points
    level_data = {tier: max([a[tier] for a in partition_data.values()]) for tier in range(len(list(partition_data.values())[0]))} 
    
    # generate empty dicts
    d = {"name" : "Music Network", "children" : create_dicts(list(level_data.values()))}
    print("in dengrogram dictionary is ", d)
    # fill dicts with data
    for name, hier in partition_data.items():
        listy = d['children']
        for tier in hier:
            listy = listy[tier-1]['children']
        listy.append({"name" : name, "value":1})

    # remove empty leaves
    ch = d['children']
    for group in ch:
        group['children'] = [x for x in group['children'] if x['children']]

    # save
    j = json.dumps(d, indent=4)
    with open('dendrogram.json', 'w') as fp:
        fp.write(j)

    return d

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
        lpm_partition_assignment = {g.vs[i]['name'] : [lpm_partition.membership[i]]
                        for i in range(g.vcount())}
        
        return lpm_partition_assignment
    

    elif method == 'louvain':
        louvain_partition = g.community_multilevel(weights=[e['weight'] for e in g.es], return_levels=True)
        louvain_partition_assignment = {g.vs[i]['name'] : [level.membership[i] for level in louvain_partition]
                        for i in range(len(g.vs))}
        
        return louvain_partition_assignment

    elif method == 'HLC':
        coms = algorithms.hierarchical_link_community(g)
        
        return coms.communities

        ### TRYING HLC MODULE
        #import hlc 
        #os.system('python hlc -o temp_hlc_clusters.txt' )


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

    # ~~~~~~~~~~~~~
    # add partition data to graph object

    # node-based
    if method != 'HLC':
        for note in graph.nodes:
            graph.nodes[note]['comm'] = partition_data[note]

    #link-based
    else:
        for link in g.es:
            for comm in partition_data:
                if link.tuple in comm:
                    # igraph edge atribute, don't need for final, used in debug
                    #g.es[link.tuple]['comm'] = partition_data.index(comm)

                    
                    # set as link attribute
                    src = g.vs[link.tuple[0]]['name']
                    tgt = g.vs[link.tuple[1]]['name']
                    graph.edges[(src, tgt)]['comm'] = [partition_data.index(comm)]
        for note in graph.nodes():
            # dummy community for nodes so colors aren't whack
            graph.nodes[note]['comm'] = [0] 
    
    # ~~~~~~~~~~~~~~~~~~~
    d = generate_dendrogram(partition_data)

    # ~~~~~~~~~~~~~~~~~~~
    return graph, d