# Nikki Pet, ap3536
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

@app.route('/clickme', methods=['GET', 'POST'])
def clickme(name=None):
	data="Hello World"

	json_data = request.get_json()
	data2 = json_data["data"]

	return jsonify(data=data)





if __name__ == '__main__':
   app.run(debug = True)




