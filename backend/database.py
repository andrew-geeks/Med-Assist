from pymongo import MongoClient

class MongoDatabase:
    def __init__(self):
        self.mClient = MongoClient("mongodb://localhost:27017/")
        self.db = self.mClient["medassist"]
    
    def UserSchema(self):
        schema = {
            "$jsonSchema":{
                "bsonType": "object",
                "required":["name","email","gender","location","type","password"],
                "properties": {
                    "name": {"bsonType": "string"},
                    "email": {"bsonType": "string"},
                    "gender": {"bsonType": "string"},
                    "location": {"bsonType": "string"},
                    "type": {"bsonType": "string"},
                    "password": {"bsonType": "string"},
                    "specialization": {"bsonType": "string"},
                }
                
            }
            
        }
        
        #self.db.create_collection("users")
        self.db.command("collMod","users",validator=schema)
        self.db.users.create_index([( "email", 1 )],unique=True) #for making email unique
        print("users validated")
    
    
    def DoctorSchema(self):
        schema = {
        "$jsonSchema":{
            "bsonType": "object",
            "required":["d_id","specialization"],
            "properties": {
                "d_id": {"bsonType": "string"},
                "specialization": {"bsonType": "string"},
                "hospitalName": {"bsonType": "string"},
                "hospitalPlace": {"bsonType": "string"},
                "consultationFee": {"bsonType": "int"},
                "availableDays": {"bsonType": "array"},
                "availableTimeSlots": {"bsonType": "array"},
                "phoneNumber": {"bsonType": "string"}
            }
            
        }   
        }
        #self.db.create_collection("doctor")
        self.db.command("collMod","doctor",validator=schema)
        print("doctor validated")
    
    def PaymentsSchema(self):
        schema = {
            "$jsonSchema":{
            "bsonType": "object",
            "properties": {
                "orderCreationId": {"bsonType": "string"},
                "razorpayPaymentId": {"bsonType": "string"},
                "razorpayOrderId": {"bsonType": "string"},
                "razorpaySignature": {"bsonType": "string"},
                "booked_email": {"bsonType": "string"},
                "pay_date": {"bsonType": "string"},
            }
        }
        }
        #self.db.create_collection("payments")
        self.db.command("collMod","payments",validator=schema)
        print("payments validated")
    
    def AppointmentSchema(self):
        schema = {
            "$jsonSchema":{
            "bsonType": "object",
            "properties": {
                "patient_mail": {"bsonType": "string"},
                "doc_id": {"bsonType": "string"},
                "doctor_name": {"bsonType": "string"},
                "specialization": {"bsonType": "string"},
                "doc_pho": {"bsonType": "string"},
                "appointment_date": {"bsonType": "string"},
                "fee": {"bsonType": "int"},
                "time_slot": {"bsonType": "string"},
                "location_address": {"bsonType": "string"},
            }
        }
        }
        
        #self.db.create_collection("appointments")
        self.db.command("collMod","appointments",validator=schema)
        print("appointments validated")
    

MDb = MongoDatabase()
MDb.UserSchema()
MDb.DoctorSchema()
MDb.PaymentsSchema()
MDb.AppointmentSchema()
        