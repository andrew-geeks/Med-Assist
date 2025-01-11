import os
from dotenv import load_dotenv
import requests

load_dotenv()
class Mailer:
    def __init__(self):
        self.mail = os.environ.get('MAIL')
        self.api = os.environ.get('MAILGUN_API')
        # self.password = os.environ.get('MAIL_PASS')
        # self.server = smtplib.SMTP('smtp.mail.yahoo.com', 587)
    
    def welcome(self,name,send_mail):
        return requests.post(
  		"https://api.mailgun.net/v3/sandbox1765924dabbd444bb9fb791e24d659b1.mailgun.org/messages",
  		auth=("api", self.api),
  		data={"from": "Excited User <mailgun@sandbox1765924dabbd444bb9fb791e24d659b1.mailgun.org>",
  			"to": [send_mail],
  			"subject": "Welcome to MedAssist",
  			"text": "Testing some Mailgun awesomeness!"})
        