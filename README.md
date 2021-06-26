# Network-Composition


Setup Instructions:

You need to have the anaconda package maneger to setup a virual 
environemnt for the Python side of this project. 


1. Create virtual environment by running:

    conda env create -f environment.yml


2. Activate the virtual environment by running:

    conda activate music-network-env

4. Install nessesary packages with pip 

    pip install flask

    pip install infomap
    
    pip install cdlib # this may have dependecny issue, look into

5. make symblink of mnet.py to flaskapp folder. Delete current mnet.py file in flaskapp folder (should be blank)
