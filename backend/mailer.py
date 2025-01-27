import os
from dotenv import load_dotenv
import requests

load_dotenv()
class Mailer:
    def __init__(self):
        self.mail = os.environ.get('MAIL')
        self.api = os.environ.get('MAILGUN_API')
        self.domain_url = os.environ.get('MAILGUN_DOMAIN')
        # self.password = os.environ.get('MAIL_PASS')
        # self.server = smtplib.SMTP('smtp.mail.yahoo.com', 587)
    
    def welcome(self,name,send_mail):
        return requests.post(
  		self.domain_url,
  		auth=("api", self.api),
  		data={"from": "MedAssist Crew <medassisst.crew@gmail.com>",
  			"to": [send_mail],
  			"subject": "Welcome to MedAssist",
  			"text": "Hello "+name+".\nHearty Welcome to the modern healthcare through AI!\n\n\nRegards\nTeam MedAssist"})

    def forgotpass(self,send_mail,rtoken):
       return requests.post(
  		self.domain_url,
  		auth=("api", self.api),
  		data={"from": "MedAssist Crew <medassisst.crew@gmail.com>",
  			"to": [send_mail],
  			"subject": "Reset Your Password",
  			"text": "Click this link to reset your password: http://localhost:3000/resetpassword?token="+rtoken+"\n\n\nRegards\nTeam MedAssist"})


