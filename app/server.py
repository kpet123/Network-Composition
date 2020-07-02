# Nikki Pet, ap3536
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)



data = {"attr1": "hi", "attr2:": "seeya"}
@app.route('/') 
def default(name=None): 
	global data
	d1={"data": "test"}
	return render_template('index.html', data=d1)   
    

@app.route('/pass_eg', methods=['GET', 'POST'])
def pass_eg(name=None):
	global data

	json_data = request.get_json()
	print("New Data is ", json_data)
	print("Original Data is ", data);
	#return jsonify(data=data)
	return render_template('index.html', data=json_data)




if __name__ == '__main__':
   app.run(debug = True)




