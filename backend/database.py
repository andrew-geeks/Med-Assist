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
                }
                
            }
            
        }
        
        #self.db.create_collection("users")
        self.db.command("collMod","users",validator=schema)
        self.db.users.create_index([( "email", 1 )],unique=True) #for making email unique
        print("users validated")

MDb = MongoDatabase()
MDb.UserSchema()
        