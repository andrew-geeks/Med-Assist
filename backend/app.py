from flask import Flask,request,Response,jsonify
from flask_cors import CORS
import bcrypt
from database import MongoDatabase
import json
 


app = Flask(__name__)
CORS(app)
salt = bcrypt.gensalt()
DB  = MongoDatabase()
mdb = DB.db #database variable


@app.route("/signup",methods=['POST'])
def signup():
    data = request.json

    password = bcrypt.hashpw(str(data["password"]).encode('utf-8'), salt)#password hashing
    data["password"]=password.decode("utf-8")
    del data["cpassword"]
    
    #database submission
    mdb.users.insert_one(data)
    return jsonify({"message": "successful"}), 200


@app.route("/login",methods=["POST"])
def login():
    data = request.json
    password = bcrypt.hashpw(str(data["password"]).encode('utf-8'), salt)
    data["password"]=password.decode("utf-8")
    #verify
    if(mdb.users.find_one(data)):
        return jsonify({"message": "successful"}), 200
    else:
        return jsonify({"message": "incorrect"}), 500
    
app.run(port=4000)