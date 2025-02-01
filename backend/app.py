from flask import Flask,request,Response,jsonify
import requests
from flask_cors import CORS
import bcrypt
from database import MongoDatabase
from mailer import Mailer
import json
import pickle
import os
from dotenv import load_dotenv
import secrets
import PyPDF2
from bson import ObjectId

 
# --- LLM IMPORTS --- 
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings

from langchain_ollama import ChatOllama
from langchain_community.docstore.in_memory import InMemoryDocstore

import faiss
from langchain_community.vectorstores import FAISS
# --- --- ---


load_dotenv() 
app = Flask(__name__)
CORS(app)
salt = bytes(os.environ.get("SALT"),encoding='utf-8')
DB  = MongoDatabase()
mdb = DB.db #database variable

mail_func = Mailer()

#token for forgot password
def generate_token(length=14):
    return secrets.token_urlsafe(length)[:length]


embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
vector_store = FAISS.load_local("../../med_db", embeddings=embeddings, allow_dangerous_deserialization=True)
# num_predict=100 - parameter to set tokens
retriever = vector_store.as_retriever(search_type="mmr", search_kwargs = {'k': 2, 'fetch_k': 100,'lambda_mult': 1})
model = ChatOllama(model="llama3.2" ,base_url="http://localhost:11434")

prompt = """You are a Medical Chatbot answering questions strictly related to healthcare. 
Do not provide any consultation or suggest medicines. Give answers only for medical queries. Answer the question based only on the following context:
{context}
Question: {question}
"""
prompt = ChatPromptTemplate.from_template(prompt)

def format_docs(docs):
    return "\n\n".join([doc.page_content for doc in docs])

def powerLLM(question):
    rag_chain = (
        {"context": retriever|format_docs, "question": RunnablePassthrough()}
        | prompt
        | model
        | StrOutputParser()
    )
    
    return rag_chain.invoke(question+" in 35 words")
    
    
    

@app.route("/signup",methods=['POST'])
def signup():
    data = request.json
    password = bcrypt.hashpw(str(data["password"]).encode('utf-8'), salt)#password hashing
    data["password"]=password.decode("utf-8")
    del data["cpassword"]
    email = data["email"]
    name = data["name"]
    a_type = data["type"]
    #database submission
    try:
        mdb.users.insert_one(data)
        mail_func.welcome(name,email)
        if(a_type == "doctor"):
            d_response = mdb.users.find_one(data) #to get object_id
            
            d_data = {
                "d_id":str(d_response["_id"]),
                "specialization":data["specialization"],
            }
            mdb.doctor.insert_one(d_data)
            return jsonify({"message": "successful","name":name,"email":email,"type":a_type,"id":str(d_response["_id"])}), 200
        
        #return for normal users    
        return jsonify({"message": "successful","name":name,"email":email,"type":a_type}), 200
    except:
        return jsonify({"message": "MailId already in use"}), 500


@app.route("/login",methods=["POST"])
def login():
    data = request.json
    password = bcrypt.hashpw(str(data["password"]).encode('utf-8'), salt)
    data["password"]=password.decode("utf-8")
    #verify
    response = mdb.users.find_one(data)
    if(response):
        # name = response["name"]
        # a_type = response["type"]
        return jsonify({"message": "successful","email":response["email"],"name":response["name"],"type":response["type"],"id":str(response["_id"])}), 200
    else:
        return jsonify({"message": "incorrect"}), 500


@app.route("/forgotpassword",methods=["POST"]) 
def forgot_password():
    data = request.json
    response = mdb.users.find_one(data)
    #mail found
    if(response):
        token = generate_token() #getting unique token
        mail_func.forgotpass(data["email"],str(token)) #sending reset password link
        mdb.users.update_one({"email":data["email"]},{"rtoken":token})
        return jsonify({"message": "mail sent"}), 200
    else:
        return jsonify({"message":"mail not found"}),500


@app.route("/chat",methods=["POST"])
def chat():
    data = request.json
    message = powerLLM(data["chat"])
    return jsonify({"message":message}),200



@app.route("/summarize",methods=["POST"])
def summarize():
    if 'pdf' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['pdf']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400    
    try:
        
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    except:
         return jsonify({'message': 'File Parsing error'}), 400  

    payload = {
        "model": "llama3.2",  
        "prompt": text+" \nSummarize this report briefly. Include all details. Do not provide any consultation.",
        "stream": False
    }
     
    try:
        response = requests.post("http://localhost:11434/api/generate", json=payload)
        if response.status_code == 200:
            return response.json(),200
        else:
            print(f"Error: {response.status_code}, {response.text}")
        return jsonify({'message': 'LLM error'}), 400
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return jsonify({'message': 'LLM error'}), 400

    
    
    
app.run(port=4000)
