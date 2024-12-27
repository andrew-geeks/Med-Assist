from flask import Flask,request,Response,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/signup",methods=['POST'])
def signup():
    data = request.json
    
    #password hashing
    
    #database submission
    
    return jsonify({"message": "sucessful","data":data}), 200
    
    
app.run(port=4000)