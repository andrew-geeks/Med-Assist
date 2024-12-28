from flask import Flask,request,Response,jsonify
from flask_cors import CORS
import bcrypt



app = Flask(__name__)
CORS(app)
salt = bcrypt.gensalt()





@app.route("/signup",methods=['POST'])
def signup():
    data = request.json
    
    password = bcrypt.hashpw(str(data["password"]).encode('utf-8'), salt)#password hashing
    
    #database submission
    
    
    return jsonify({"message": "successful","data":data}), 200

@app.route("/login",methods=["POST"])
def login():
    pass
    
    
app.run(port=4000)