from pymongo import MongoClient

class MongoDatabase:
    def __init__(self):
        self.mClient = MongoClient("mongodb://localhost:27017/")
        self.db = self.mClient["medassist"]
        self.users = self.db["users"]
    
    def UserSchema(self):
        schema = {
            "bsonType": "object",
            "properties": {
                "name": {"bsonType": "string", "required": True},
                "email": {"bsonType": "string", "required": True,"unique":True},
                "gender": {"bsonType": "string","required":True},
                "location": {"bsonType": "string","required":True},
                "password": {"bsonType": "string","required":True},
            }
        }
        
        self.db.command("collMod","users",validator=schema)
        