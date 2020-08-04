
import socket
import mnet
import networkx as nx


'''
Create Sockets
'''

UDP_IP = "127.0.0.1"
UDP_PORT = 5005

sock = socket.socket(socket.AF_INET, # Internet
                     socket.SOCK_DGRAM) # UDP
sock.bind((UDP_IP, UDP_PORT))
print("Ready")



lst=[]


keepGoing=True
while keepGoing:
    data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
    data_readable=str(data, 'utf-8')

    message = str(data).split(sep='\\x00')
    #print("received message:", message)

    if message[15] == "stop":
        keepGoing = False

    lst.append(message)


notelst = []
i=0
while i < len(lst)-1:
    message = lst[i]
    message = list(filter(None, message))
    pitch = int(message[4])
    #print(pitch)
    notelst.append(pitch)

    i += 1


nodelst_basic=notelst
g_basic=mnet.create_graph(nodelst_basic)

#write as .gexf
#nx.write_gexf(g_basic, "demo.gexf")

length = 0
while length < 50:
	randomwalk_basic=mnet.generate_randomwalk(g_basic)
	length = len(randomwalk_basic)

print("Length of composition: ", len(randomwalk_basic))     

host = "localhost"
port = 7400
#print(type(buf))
addr = (host, port)

#Sending String
UDPSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

OSC_ADDRESS = "/1/xyz\0\0"
OSC_TYPE_TAG = ",s\0\0"

for note in randomwalk_basic:
    ARG1=str(note)+"\0\0"
    encoded_message=(OSC_ADDRESS+OSC_TYPE_TAG+ARG1).encode()
    UDPSock.sendto(encoded_message, (host, port))
    #print("sent ", note)
# Close socket
UDPSock.close()
sock.close()
