from flask import *
from json import *
from flask_cors import CORS, cross_origin
from flask import Flask, request, jsonify, send_from_directory
import hiveScript

app = Flask(__name__, static_folder="../build", static_url_path='/')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/Hive', methods = ['POST'])
def HiveMainProgram():
    PARAMETERS = request.json
    #inputs
    CLUSTER_ID = PARAMETERS["cluster_id"]
    QUERY_ID = PARAMETERS["query_id"]
    KEYWORD = PARAMETERS["keyword"].lower()#comma separated inputs for keyword search in the entire logs
    EXCLUSIVE = PARAMETERS["exclusive"] #set to true when keyword search is done from second page else false.
    LOCATION = PARAMETERS["log_location"]
    res=HiveScript.MainProg(CLUSTER_ID,QUERY_ID,KEYWORD,LOCATION,EXCLUSIVE)
    return res

if __name__ == '__main__':
    app.run(debug=True)
