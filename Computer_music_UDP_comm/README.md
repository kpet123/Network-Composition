

Dependencies: 

	Anaconda package manager - needed to set up virtual environment
	
	MaxMSP - needed to run Max file. Download free trial here: https://cycling74.com/products/max 
	

Note: virtual environment in folder level above should be identical but has not been tested. 
Setup Instructions:


1. Create virtual environment by running.:

	conda env create -f environment.yml


2. Activate the virtual environment by running:

	conda activate music-network-env

You should now be able to run the script and generate a network from MIDI pitch information sent throught the corresponding MaxMSP patch. To view detailed instructions, see directions in the MaxMSP file. 


