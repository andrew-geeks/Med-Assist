from flask import Flask,request,Response,jsonify
import requests
from flask_cors import CORS
import bcrypt
from database import MongoDatabase
from mailer import Mailer
from model import Predict
import json
import pickle
import os
from dotenv import load_dotenv
import secrets
import PyPDF2
from bson import ObjectId
import razorpay
import numpy as np

from tensorflow.keras.applications.densenet import preprocess_input
import cv2
from tensorflow.keras.models import load_model
from transformers import pipeline

 
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

img_model  = Predict()
UPLOAD_FOLDER="images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

captioner = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")


#razor-pay
client = razorpay.Client(auth=(os.environ.get("RP_KEYID"),os.environ.get("RP_KEY_SECRET")))

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

#image processing for chest xray
def preprocess_image(img_path, img_size=(320, 320)):
    img = cv2.imread(img_path)  # Read image
    img = cv2.resize(img, img_size)  # Resize
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    img = preprocess_input(img)  # Normalize
    
    return img
    

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
        return jsonify({"message": "successful","email":response["email"],"name":response["name"],"type":response["type"],"id":str(response["_id"]),"location":response["location"]}), 200
    else:
        return jsonify({"message": "incorrect"}), 500


@app.route("/deleteaccount",methods=["DELETE"])
def delete_account():
    data = request.json
    email = data["email"]
    response = mdb.users.find_one({"email":email})
    if(response):
        mdb.users.delete_one({"email":email})
        mdb.doctor.delete_one({"d_id":str(response["_id"])})
        mdb.appointments.delete_many({"patient_mail":email})
        mdb.appointments.delete_many({"doc_id":str(response["_id"])})
        mdb.payments.delete_many({"patient_mail":email})
        return jsonify({"message": "account deleted"}), 200
    else:
        return jsonify({"message": "account not found"}), 500



@app.route("/forgotpassword",methods=["POST"]) 
def forgot_password():
    data = request.json
    response = mdb.users.find_one(data)
    #mail found
    if(response):
        token = generate_token() #getting unique token
        mail_func.forgotpass(data["email"],str(token)) #sending reset password link
        mdb.users.update_one({"email": data["email"]}, {"$set": {"rtoken": token}})
        return jsonify({"message": "mail sent"}), 200
    else:
        return jsonify({"message":"mail not found"}),500

@app.route("/resetpassword", methods=["POST"])
def reset_password():
    data = request.json
    token = data.get("token")
    password = bcrypt.hashpw(str(data.get("password")).encode('utf-8'), salt)#password hashing
    new_password = password.decode("utf-8")
    user = mdb.users.find_one({"rtoken": token})
    if user:
        mdb.users.update_one({"rtoken": token}, {"$set": {"password": new_password}, "$unset": {"rtoken": ""}})
        return jsonify({"message": "Password reset successfully"}), 200
    else:
        return jsonify({"message": "Invalid or expired token"}), 400


@app.route("/userdata",methods=["GET"])
def getuserdata():
    email = request.args.get("email")
    response = mdb.users.find_one({"email":email})
    del response["password"] #removing password
    del response["_id"]
    if(response):
        return jsonify(response),200
    else:
        return jsonify({"message":"data not found"}),500
    
@app.route("/docdata",methods=["GET"]) #retrieves deep info of doctors(days,time slots,hospital details)
def getdocdata():
    id = request.args.get("id")
    response = mdb.doctor.find_one({"d_id":id})
    del response["_id"]
    if(response):
        return jsonify(response),200
    else:
        return jsonify({"message":"data not found"}),500

@app.route("/fetchdoctors",methods=["GET"])
def fetchdoctors():
    location = request.args.get("location")
    response = mdb.doctor.find({"location":location},{"_id": 0})
    return jsonify(list(response)),200
    

@app.route("/updatedoc",methods=["POST"])
def updatedocdata():
    data = request.json
    id = data["d_id"]
    del data["d_id"]
    data["consultationFee"] = int(data["consultationFee"])
    response = mdb.doctor.update_one({"d_id":id},{"$set":data})
    if(response):
        return jsonify({"message":"success"}),200
    else:
        return jsonify({"message":"data not found"}),500

# --- APPOINTMENTS & PAYMENTS ---

@app.route("/pay",methods=["POST"])
def pay():
    reqdata=request.json
    data = { "amount": int(reqdata["amount"])*100, "currency": "INR", "receipt": "order_rcptid_11" }
    payment = client.order.create(data=data)
    return jsonify({"amount":data["amount"],"order_id":payment["id"],"currency":data["currency"]}),200
    
@app.route("/paysuccess",methods=["POST"])
def paysucess():
    data = request.json
    try:
        mdb.payments.insert_one(data)
        return jsonify({"message":"sucess"}),200
    except:
        return jsonify({"message":"payments-insertion error"}),500

@app.route("/appointment",methods=["POST"])
def appointment():
    data = request.json
    mail_func.appointmentconfirmation(data["patient_mail"],data["doctor_name"],data["doc_pho"],data["appointment_date"],data["time_slot"],str(data["fee"]),data["location_address"])
    try:
        mdb.appointments.insert_one(data)
        #mailing to user
        return jsonify({"message":"sucess"}),200
    except:
        return jsonify({"message":"appointments-insertion error"}),500

#for patients
@app.route("/getappointments",methods=["GET"])
def getappointment():
    email = request.args.get("email")
    data = mdb.appointments.find({"patient_mail":email},{"_id": 0})
    return jsonify(list(data)),200
    # try:
    #     data = mdb.appointments.find({"patient_mail":email})
    #     del data["_id"]
    #     return jsonify(data),200
    # except:
    #     return jsonify({"message":"error"}),500




#for doctors
@app.route("/fetchappointments", methods=["GET"])
def fetchappointment():
    doc_id = request.args.get("id")
    appointments = list(mdb.appointments.find({"doc_id": doc_id}))

    if not appointments:
        return jsonify({"message": "no appointments"}), 404

    # Convert ObjectId to string
    for appt in appointments:
        appt["_id"] = str(appt["_id"])

    return jsonify(appointments), 200

#cancel appointment
@app.route("/cancelappointment",methods=["POST"])
def cancelappointment():
    data = request.json
    try:
        mdb.appointments.delete_one(data)
        return jsonify({"message":"success"}),200
    except:
        return jsonify({"message":"error"}),500
    
    
#update appointment
@app.route("/updateappointment", methods=["POST"])
def update_appointment():
    try:
        data = request.get_json()
        appointment_id = data.get("_id")
        new_date = data.get("appointment_date")
        new_slot = data.get("time_slot")

        if not (appointment_id and new_date and new_slot):
            return jsonify({"message": "Missing required fields"}), 400

        # Fetch the appointment document to get the email
        appointment = mdb.appointments.find_one({"_id": ObjectId(appointment_id)})
        if not appointment:
            return jsonify({"message": "Appointment not found"}), 404

        email = appointment["patient_mail"]
        
        # Update the appointment with new date and time slot
        result = mdb.appointments.update_one(
            {"_id": ObjectId(appointment_id)},
            {"$set": {
                "appointment_date": new_date,
                "time_slot": new_slot
            }}
        )
        mail_func.updateappointment(email, new_date, new_slot)  # Send email notification
        return jsonify({
            "message": "Appointment updated successfully",
            "email": email
        }), 200

    except Exception as e:
        print("Error updating appointment:", e)
        return jsonify({"message": "Internal server error"}), 500
# ----------------


@app.route("/chat",methods=["POST"])
def chat():
    data = request.json
    message = powerLLM(data["chat"])
    return jsonify({"message":message}),200



@app.route("/summarize", methods=["POST"])
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
            page_text = page.extract_text()
            if page_text:
                text += page_text
    except Exception as e:
        print(f"PDF parsing error: {e}")
        return jsonify({'message': 'File Parsing error'}), 400  

    # Step 1: Ask LLM if it's a medical report
    classification_prompt = (
        text[:2000] +  # Truncate to avoid overload
        "\n\nIs the above document a medical report? Reply only 'Yes' or 'No'."
    )

    try:
        classification_response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2",
                "prompt": classification_prompt,
                "stream": False
            }
        )
        if classification_response.status_code != 200:
            print(f"Classification error: {classification_response.status_code}, {classification_response.text}")
            return jsonify({'message': 'LLM error'}), 400

        classification_result = classification_response.json().get("response", "").strip().lower()
        if "yes" not in classification_result:
            return jsonify({'message': 'Please upload only medical reports.'}), 400

    except requests.exceptions.RequestException as e:
        print(f"LLM classification request failed: {e}")
        return jsonify({'message': 'LLM error'}), 400

    # Step 2: Send for summarization
    summarization_prompt = (
        text + "\n\nSummarize this report briefly. Include all details. Do not provide any consultation."
    )

    try:
        summary_response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2",
                "prompt": summarization_prompt,
                "stream": False
            }
        )
        if summary_response.status_code == 200:
            return summary_response.json(), 200
        else:
            print(f"Summary error: {summary_response.status_code}, {summary_response.text}")
            return jsonify({'message': 'LLM error'}), 400

    except requests.exceptions.RequestException as e:
        print(f"LLM summary request failed: {e}")
        return jsonify({'message': 'LLM error'}), 400


    
#predict disease from chest x-ray    
@app.route("/predxray", methods=["POST"])
def predict_image():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    caption = captioner(file_path)[0]["generated_text"]
    if("chest" in caption):
        preds = img_model.getres(file_path) # Get predictions
        os.remove(file_path)#removing file path
        return jsonify({"predicted_class":preds}), 200
    else:
        os.remove(file_path)#removing file path
        return jsonify({"error":"Provide a valid Chest X-Ray Image"}), 400


@app.route('/bookedslots', methods=['GET'])
def get_booked_slots():
    doc_id = request.args.get('doc_id')
    appointment_date = request.args.get('appointment_date')

    if not doc_id or not appointment_date:
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        bookings = mdb.appointments.find({
            "doc_id": doc_id,
            "appointment_date": appointment_date
        })
        
        booked_slots = [{"time_slot": booking["time_slot"]} for booking in bookings]
        return jsonify(booked_slots), 200

    except Exception as e:
        print(f"Error fetching booked slots: {e}")
        return jsonify({"error": "Server error"}), 500


app.run(port=4000)
