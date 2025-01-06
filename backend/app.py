from flask import Flask,request,Response,jsonify
from flask_cors import CORS
import bcrypt
from database import MongoDatabase
import json
import pickle
 
# --- LLM IMPORTS --- 
from langchain_community.chat_models import ChatOllama
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from langchain_chroma import Chroma
import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
from langchain_huggingface import HuggingFaceEmbeddings
# --- --- ---



app = Flask(__name__)
CORS(app)
salt = bcrypt.gensalt()
DB  = MongoDatabase()
mdb = DB.db #database variable

client = chromadb.PersistentClient(path='../../chroma_db')
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
chroma_db = Chroma(client=client, collection_name="langchain",embedding_function=embeddings) 
model_local = ChatOllama(model="llama3.2")
after_rag_template = """You are a Medical Chatbot called MedBot, answering questions strictly related to chest diseases. Do not provide any consultation. Give answers only for medical queries. Answer the question based only on the following context:
{context}
Question: {question}
"""

def powerLLM(question):
    retriever = chroma_db.as_retriever()
    after_rag_prompt = ChatPromptTemplate.from_template(after_rag_template)
    after_rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | after_rag_prompt
        | model_local
        | StrOutputParser()
    )
    return after_rag_chain.invoke(question+" in 35 words")
    
    
    

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
    
@app.route("/chat",methods=["POST"])
def chat():
    data = request.json
    message = powerLLM(data["chat"])
    return jsonify({"message":message}),200
    
app.run(port=4000)

# print(powerLLM("what is effusion?"))
# print(powerLLM("what is effusion"))