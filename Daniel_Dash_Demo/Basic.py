#!/usr/bin/env python
# coding: utf-8

# # Load Data

# In[1]:


import music21
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
import mnet


# Create path to access local files

# In[2]:


'''
Creat local corpus with access pieces
'''

localCorpus = music21.corpus.corpora.LocalCorpus()
localCorpus.addPath('../library')
music21.corpus.cacheMetadata()


# Save Telemann Fantasie No. 1 as a stream object

# In[4]:


s = music21.corpus.parse('telemannfantasie1.xml')


# Inspect stream to see where desired parts are located

# In[5]:


s.show("text")


# Save Solo Flute part

# In[6]:


flute = s[5]


# # Basic Conversion Pipeline

# Convert stream to list of notes

# In[7]:


flute_notes =flute.recurse().notes


# In[8]:


notelst = list(flute_notes)


# Convert list of notes to list of nodes for graph

# In[9]:


nodelst_basic=mnet.convert_basic(notelst)


# Create Multiedge Directional Graph

# In[10]:


g_basic=mnet.create_graph(nodelst_basic)

#write as .gexf
nx.write_gexf(g_basic, "basic_composition.gexf")

'''
# Run and Save Random Walk

# In[11]:


def convert_to_stream(notelist):

    s = music21.stream.Stream()
    for thisNote in notelist:
        s.append(thisNote)
    return s


# In[12]:


randomwalk_basic=mnet.generate_randomwalk(g_basic)


# In[13]:


len(randomwalk_basic)


# Convert random walk to back to music.
# 
# Uses conversion function strto16thnote, which takes a pitch string and converts it to a note with length of 16th note

# In[14]:


tune = mnet.strto16thnote(randomwalk_basic)
new_composition_basic = convert_to_stream(tune)

#Write to MIDI 
file = new_composition_basic.write('xml', "../xml/Basic.xml")


# # Analysis

# ### Modularity
#     Run in gephi
#     G#5 and A5 make sense becasue they have strong bidirectional link and are often paired. 
#     Highest in-degree: in-range chord tones
#     
#     Would expect groups of chord tones
#     Page Rank-note composition of final piece
#     Eigenvector created more "even field"

# In[14]:


g_basic


# In[ ]:

'''


