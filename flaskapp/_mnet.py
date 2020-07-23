'''
Module for musicnet functions
'''

import music21
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
import random
import queue

'''
*******************
General Functions
*******************
'''
#given note in stream, returns measure
def getMeasureFromNote(note_in_stream):
    return str(note_in_stream.activeSite).split()[1]

'''
*******************
#Conversion Functions: turn list of notes into list of nodes
Also return pitchdict, used later to assign pitches to the graph
*******************
'''
'''
*** convert_basic ***

Param:

	lst- list of music21 Note objects

Return:
	nodelst - list of nodes
 
'''
#def convert_basic(lst):

#		convert_note = lambda x: x.name+str(x.octave)
#		nodelst = list(map(convert_note, lst))
#		pitchdict = dict((zip(nodelst, nodelst)))
#		return nodelst, pitchdict

def convert_basic(lst):
    nodelst=[]
    convert_note = lambda x: x.name+str(x.octave)
    for note in lst:
        node=note
        if type(note) == music21.chord.Chord :
            node = convert_note(max(note.pitches))
        elif type(note) == music21.note.Note:
            node = convert_note(note)
        else:
            print("ERROR UNHANDLED TYPE ", type(note))
        nodelst.append(node)
            
    pitchdict = dict((zip(nodelst, nodelst)))
    return nodelst, pitchdict

'''
*** convert_grouping ***

Param:

	lst- list of music21 Note objects
	grouping - list of note indices starting new group 
				E.g. [0, 10, 20] would mean that a group starts at note 
				0, 10 and 20
Return:
	nodelst - list of nodes
 
'''

#def convert_grouping(lst, grouping):
#    convert_note = lambda x: x.name+str(x.octave)
#    pitchdict = {}
#    nodelst=[] #list to store nodes
#    #add first node
#    transition_lst=[]
#    i=0
#    g=0
#    node_group=grouping[g]
#    while i < len(lst):
#        note = lst[i]
#        node_id = convert_note(note)
#        #print(getMeasureFromNote(note))
#        if getMeasureFromNote(note) == str(grouping[g]):
#            node_group = grouping[g]
#            g+=1
#            if i !=0:
#                transition_lst.append((nodelst[i-1],\
#                     str(node_group)+"_"+str(node_id)))
#        node = str(node_group)+"_"+str(node_id)
#        nodelst.append(node)
#        pitchdict[node]= str(node_id)
#        i +=1
#    return nodelst, transition_lst, pitchdict


def convert_grouping(lst, grouping):
    convert_note = lambda x: x.name+str(x.octave)
    pitchdict = {}
    nodelst=[] #list to store nodes
    #add first node
    transition_lst=[]
    i=0
    g=0
    node_group=grouping[g]
    while i < len(lst):
        note = lst[i]
        if type(note) == music21.chord.Chord :
            node_id = convert_note(max(note.pitches))
        elif type(note) == music21.note.Note:
            node_id = convert_note(note)
        else:
            print("ERROR UNHANDLED TYPE ", type(note))
        print("In convert, grouping is ", grouping)
        print("g is ", g)
        #print(getMeasureFromNote(note))
        if getMeasureFromNote(note) == str(grouping[g]):
            node_group = grouping[g]
            g+=1
            if i !=0:
                transition_lst.append((nodelst[i-1],\
                     str(node_group)+"_"+str(node_id)))
        node = str(node_group)+"_"+str(node_id)
        nodelst.append(node)
        pitchdict[node]= str(node_id)
        i +=1
    return nodelst, transition_lst, pitchdict

def convert_chord_note(chord_lst, key):
    pitchdict = {}
    nodelst=[]
    for chord in chord_lst:
        #extract melody
        mel = max(chord.pitches)
        #extract harmony
        harm = chord.remove(mel)
        rn = music21.roman.romanNumeralFromChord(chord, music21.key.Key(key))
        rn=str(rn).split()[1]
        node = str(mel)+"_"+rn
        nodelst.append(node)
        pitchdict[node] = str(mel)    
    return nodelst, pitchdict


'''
conversion with roman numerals and groups
'''
def convert_grouped_rn(chord_lst, offsets, key):
    pitchdict = {}
    nodelst=[]
    transition_lst=[]
    i=0
    g=1
    node_group=offsets[0]    
    
    while i < len(chord_lst):
        
        '''
        Extract note + rn
        '''
        chord=chord_lst[i]
        #extract melody
        mel = max(chord.pitches)
        #extract harmony
        harm = chord.remove(mel)
        rn = music21.roman.romanNumeralFromChord(chord, music21.key.Key(key))
        rn=str(rn).split()[1]
        
        '''
        determine group
        '''
        #print("looking for ", offsets[g] )
        #print("currently at ", chord.offset)
        if chord.offset == offsets[g]:
            node_group = offsets[g]
            g+=1
            if i !=0:
                transition_lst.append((nodelst[i-1],\
                     str(mel)+"_"+rn+"_"+str(node_group)))
                
        node = str(mel)+"_"+rn+"_"+str(node_group)
        nodelst.append(node)
        pitchdict[node]=str(mel)
        i +=1
        

    return nodelst, transition_lst, pitchdict


'''
*******************
#Create graph using nodelist and groups
*******************
'''

def create_graph(nodelst):
    g = nx.MultiDiGraph()


    g.add_node(nodelst[0]) #adds first note
    i=1
    while i < len(nodelst):
        curNode = nodelst[i]
        #creates directed edge from previous note to current note   
        g.add_edge(nodelst[i-1], curNode) 
        i +=1
    #add start and end nodes
    g.add_edge("start", nodelst[0])
    
    '''
    #Testing commenting out this section
    if nodelst.count(nodelst[len(nodelst)-1]) != 1:
        g.add_node("end")
        g.add_edge(nodelst[len(nodelst)-1], "end")
    '''
    #and adding this:
    g.add_edge(nodelst[len(nodelst)-1], "end")
    return g



'''
*******************
Generate random walk from graph
*******************
'''

def generate_randomwalk(g):
    get_neighbor = lambda x: x[1]
    randomwalk =[]
    cur_node = 'start'
    while cur_node != ['end']:
            edge_lst = list(g.edges(cur_node))
            neighbor_lst = list(map(get_neighbor, edge_lst))
            next_node = random.sample(neighbor_lst, 1)
            randomwalk.append(cur_node[0])
            cur_node = next_node
    randomwalk.pop(0)
    
    return randomwalk

    


'''
*******************
Functions that convert randomwalk to list of music21 notes
*******************
'''

#for basic graph w/o communities
def strto16thnote(randomwalk):
    notelist = []
    for string in randomwalk:
        n = music21.note.Note(string)
        n.duration.quarterLength = .25
        notelist.append(n)
    return notelist


#for forced grouping graph w/o communities
def group_strto16thnote(randomwalk):
    notelist = []
    i=0
    randomwalk.append('pad long')
    #print(len(randomwalk))
    while i < len(randomwalk)-1:
        #print(i)
        string = randomwalk[i].split("_")
        #print("cur node ", string)
        #note pitch
        notestr=string[1]
        n = music21.note.Note(notestr)
        group_cur = string[0]
        group_next = randomwalk[i+1].split("_")[0]
        #print("next :", group_next)
        #note duration
        if group_cur !=group_next:
            #print("different")
            n.duration.quarterLength =2
        else:
            n.duration.quarterLength = .25 
        
        
        notelist.append(n)
        i +=1
    return notelist

#Roman numeral graph w/o communities, produces melody and harmony
def str_rn_full(randomwalk):
    harmlst=[]
    mellst = []
    for node in randomwalk:

        mel = node.split()[0]
        n = music21.note.Note(mel)
        n.duration.quarterLength =.5
        mellst.append(n)
        
        harm = node.split()[1]
        chord = music21.roman.RomanNumeral(harm, "A")
        chord.duration.quarterLength =.5
        chord.lyric = chord.figure
        harmlst.append(chord)
    return mellst, harmlst




#Roman numeral graph, labels communities
def str_rn_annotated(randomwalk, nodeToGroup_dict):

    mellst = []
    lyriclst = []
    for node in randomwalk:

        mel = node.split("_")[0]
        n = music21.note.Note(mel)
        n.duration.quarterLength =.5
        lyric= nodeToGroup_dict[node]
        n.lyric = lyric
        lyriclst.append(lyric)
        mellst.append(n)
        
  
    return mellst, lyriclst

#Roman numeral graph, just melody w/o communities
def str_rn(randomwalk):

    mellst = []
    print("in str_rn")
    for node in randomwalk:

        mel = node.split("_")[0]
        print("mel is ", mel)
        n = music21.note.Note(mel)
        n.duration.quarterLength =.5
        mellst.append(n)
        
  
    return mellst


'''
grouped roman numeral
'''
def str_rn_group(randomwalk):
        
    notelist = []
    i=0
    randomwalk.append('pad long boo')
    #print(len(randomwalk))
    while i < len(randomwalk)-1:
        
        #print(i)
        string = randomwalk[i].split("_")
        #print(string)
        #note pitch
        notestr=string[0]
        n = music21.note.Note(notestr)
        group_cur = string[2]
        node_next = randomwalk[i+1]
        #print(node_next)
        group_next = node_next.split()[2]
        #print(group_cur, group_next)
        #note duration
        if group_cur !=group_next:
            n.duration.quarterLength =2
        else:
            n.duration.quarterLength = .25 
        
        
        notelist.append(n)
        i +=1
    return notelist  



'''
Assigns note lengths based on community strucuture. Every time a community switches, note will be lengthend accoridng to 
noteLengthAssign. 


noteLengthAssign: list with lengths of note types. Default length, then ascending for community changes
levels: layers of hirarchical structure
nodeToGroupDict: Dictionary with community assignment of each node. Assignments must be in the from a:b:c, where
                b is embedded in a, and c is embedded in b
Long position: where longer note should be places (end of current community or beginning of next community)

'''
def str_commmunity_rhythm(randomwalk, noteLengthAssign, nodeToGroupDict, long_position = 'cur_comm'):
        
        
    #randomwalk.append('pad long boo')
    mellst = []
    lyriclst = []
    i = 0
    while i < len(randomwalk)-1:
        #print(i)
        node = randomwalk[i]
        mel = node.split()[0]
        n = music21.note.Note(mel)
        community= nodeToGroupDict[node]
        n.lyric = community
        lyriclst.append(community)
        
        #determine community equality
        community_next = nodeToGroupDict[randomwalk[i+1]]
        
        com_lst = community.split(":")

        com_next_lst = community_next.split(":")
        
        if com_lst == com_next_lst:

            n.duration.quarterLength = noteLengthAssign[0]
            #print(noteLengthAssign[0])
            mellst.append(n)
        else:
            

            p=0
            pmax = min([len(com_lst), len(com_next_lst)])
            while p < pmax:
                print("p is ", p)
                print(com_lst)
                print(com_next_lst)
                if com_lst[p] != com_next_lst[p]: #if group not equal
                    emph_note_len = noteLengthAssign[p+1] 
                    break
                p += 1

            #next comm condition
            if long_position == 'next_comm':
                
                n.duration.quarterLength = noteLengthAssign[0]
                mellst.append(n)
                
                i += 1 # go to next note
                #print(i)
                nextNote = music21.note.Note(randomwalk[i].split()[0])
                nextNote.duration.quarterLength = emph_note_len
                print("longer note: ", emph_note_len)
                nextNote.lyric=community_next
                mellst.append(nextNote)

                    
            elif long_position == 'cur_comm':
               
                n.duration.quarterLength = emph_note_len
            
                mellst.append(n)
                    
                

        i +=1
        
        
  
    return mellst, lyriclst
    
    
    
    
#Convert list of randomwalk to stream

def convert_to_stream(notelist):

    s = music21.stream.Stream()
    for thisNote in notelist:
        s.append(thisNote)
    return s


#Degree Manipulation

'''
Increase degree by certain number of edges by certain amount

Params:
	graph: networkx MultiDiGraph
	transition_lst: list of edges to be increased
	increase: number of edges to be increased

Return:
	graph: networkx MutliDiGraph
'''
def degree_increase(graph, transition_lst, increase):
    for x in transition_lst:

        i=0
        while i<increase:
            graph.add_edge(x[0], x[1])
            i += 1
    return graph



#Convert to Digraph with weighted edges

'''
Increase degree by certain number of edges by certain amount

Params:
    graph: networkx MultiDiGraph
  
Return:
    graph: networkx DiGraph with weighted edges
'''
def convert_to_weighted(g, fraction = True):
    g_weight=nx.DiGraph()

    for edge in g.edges:
        num=g.number_of_edges(edge[0], edge[1])
        g_weight.add_edge(edge[0], edge[1], weight=num)
        
    if fraction == False:
        return g_weight

    for node in g_weight.nodes:
        neighbors = list(g_weight.neighbors(node))
        #print(neighbors)
        totalweight=0
        
        for n in neighbors:
            w=g_weight.get_edge_data(node, n)['weight'] #optimize by turning into dictionary, see documentation
            totalweight += w
        #print("new weights")
        for n in neighbors:
            w=g_weight.get_edge_data(node, n)['weight']
            g_weight.add_edge(node, n, weight=w/totalweight)
            #print(w/totalweight)
    return g_weight


 

def gen_path_histogram(subgraph1,  startnode,  outgoing_edge, additional_depth=5, outgoing_edge_weight=5):
    #set outgoing edge weight
    subgraph = subgraph1.copy()

    subgraph=degree_increase(subgraph,\
                            [ outgoing_edge], outgoing_edge_weight)

    subgraph = convert_to_weighted(subgraph)
    print(subgraph.edges)
    
  
    endnode=outgoing_edge[1]
    
    '''
    Breath-first search
    '''


    q = queue.Queue(maxsize=0)
    q.put([0, startnode, 1]) #length, topnode, weight
    

    
    shortest_path_length = nx.shortest_path_length(subgraph, \
                            source=startnode, target=endnode)
    
    total_searched_length = additional_depth+shortest_path_length+1
    #stores probability of each path length
    finished = np.zeros(total_searched_length) 
    
    while 1:
        curpath = q.get()
        length=curpath[0]
        curnode=curpath[1]
        weight=curpath[2]
        print("current path length is ", length)
        
        #stopping condition
        if length == total_searched_length: 
            break

        
        #path found
        if curnode == endnode:
            finished[length] += weight
        else:
            for n in list(subgraph.neighbors(curnode)):
                         
                l=length+1
                w = weight *  subgraph.get_edge_data(curnode, n)['weight']
                print ("n is ", n)
                print("weight is ", w)
                q.put([l, n, w])
        
          
    return finished
            
            
            
    
    
    
    
 ## Community Analysis Functions



def generateCommunities(group_dict, graph):
    communityLookup = {}
    for node in group_dict.keys():
        val = group_dict[node]
        if val not in communityLookup.keys():
            communityLookup[val]=set([])
        communityLookup[val].add(node)
    
    subgraphlst=[]
    for label in communityLookup.keys():
        subgraph = graph.subgraph(communityLookup[label])
        subgraphlst.append(subgraph)
    return communityLookup, subgraphlst
        
    
'''
Alters lst in place, gets previous nodes that are not 100% funneled to certain spot
'''
def findpred(graph, edge, lst):
    #print(list(graph.neighbors(edge[0])))    
    
    #the only neighbor, i.e. when node is reached 100% probability of switching communities
    if len(list(graph.neighbors(edge[0]))) == 1:     

        for pred in list(graph.predecessors(edge[0])):
           findpred(graph, (pred, edge[0]), lst)
    else:
           lst.append(edge)
 
'''
Find edges connecting 2 communities where strengthening edge will increase flow
'''
def findBridges(g_info, nodeset1, nodeset2):
    bigcom1 = g_info.subgraph(nodeset1)
    bigcom2 = g_info.subgraph(nodeset2)
    bigcom12 = g_info.subgraph(nodeset1  | nodeset2)
    edges = bigcom12.edges- bigcom1.edges-bigcom2.edges
    edgelst1 = []
    edgelst2 = []
    

               
    for edge in edges:
        if edge[0] in nodeset1:
            findpred(bigcom12, edge, edgelst1)
        else:
            findpred(bigcom12, edge, edgelst2)
    return edgelst1, edgelst2





def pagerank_analysis(g_rn1):
    
    #generate pagerank
    g_weighted1 = convert_to_weighted(g_rn1, fraction=False)
    pagerank1 = nx.pagerank(g_weighted1)
    pagerank1_vals = np.sort(np.array([ v for v in pagerank1.values() ]))
    
    #Plot pagerank
    x=np.arange(0, len(pagerank1_vals), 1)
    pagerankplot = [x, pagerank1_vals]
    
    return pagerankplot

def getComOrder(community_lst):
    i=0
    orderlst=[]
    temp = 0
    while i < len(community_lst)-1:
        if community_lst[i] != temp:

            orderlst.append(community_lst[i])
            temp = community_lst[i]
        i += 1
    return orderlst



def countQuantity(orderlst, sections):
    quantitylst=[]
    for s in sections:
        quantitylst.append(np.count_nonzero(orderlst == s))
        
    return quantitylst

def community_freq_analysis(g_rn, community_nodeDictionary, node_communityDictionary, iterations = 50):
    
    sections = list(community_nodeDictionary.keys())
    
    freq_arr = np.zeros(( iterations, len(sections)))
    time_arr = np.zeros(( iterations, len(sections)))
    length_arr = np.zeros(iterations)
    
    #Run 50 random walks
    i = 0
    while i < iterations:
        

        
        randomwalk=generate_randomwalk(g_rn)
        melody_list, community_lst= str_rn_annotated(randomwalk, node_communityDictionary)

        #Get frequency of each section
        orderlst = np.array(getComOrder(community_lst))
        section_freq = countQuantity(orderlst, sections)
        freq_arr[i]=section_freq
        
        #Get time spent in each section
        time_per_section = countQuantity(np.array(community_lst), sections)
        time_arr[i] = time_per_section
        #print(time_per_section)
        
        #Get Length
        length_arr[i]=len(community_lst)
        
        i += 1
        
    freq_average = np.sum(freq_arr, axis=0)/iterations
    time_average = np.sum(time_arr, axis=0)/iterations



    return [sections, freq_average], [sections, time_average], length_arr

    
#Get lengths of random walks    
    
def get_Lengths(g_rn, iterations = 50):
    
 
    length_arr = np.zeros(iterations)
    
    #Run 50 random walks
    i = 0
    while i < iterations:

        
        randomwalk=generate_randomwalk(g_rn)
        length_arr[i]=len(randomwalk)
        
        i += 1




    return length_arr

   
    
    
    
def gen_standard_plot(g_rn, filepath, iterations=100):
    fig = plt.figure(figsize=(10,5) )   
    ax0 = plt.subplot2grid((1,2), (0,0))
    
    

    length_arr = get_Lengths(g_rn, iterations)
    ax0.hist(length_arr, color='g')
    #ax.set_yscale('log')
    ax0.set_xlabel("Binned Length")
    ax0.set_ylabel("# of Walks")
    ax0.set_title("Walk Length Distribution")

    
    pagerankplot0 = pagerank_analysis(g_rn)
    ax1 = plt.subplot2grid((1,2), (0,1))
    ax1.hist(pagerankplot0[1])
    ax1.set_yscale('log')

    ax1.set_xlabel("Binned PageRank")
    ax1.set_ylabel("# of Nodes")
    ax1.set_title("PageRank Histogram")
    #ax.plot(bins_center, hist, lw=2)
    #ax.set_ylim([0, 400000])
    plt.tight_layout()
    plt.savefig(filepath)
    plt.show()    

    
   


