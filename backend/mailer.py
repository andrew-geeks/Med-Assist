import os
from dotenv import load_dotenv
import smtplib

load_dotenv()
class Mailer:
    def __init__(self):
        self.mail = os.environ.get('MAIL')
        self.password = os.environ.get('MAIL_PASS')
        self.server = smtplib.SMTP('smtp.mail.yahoo.com', 587)
    
    def start(self):
        self.server.starttls()
        self.server.login(self.mail, self.password)
    
    def welcome(self,name,send_mail):
        self.server.sendmail(self.mail, send_mail, "welcome to MedAssist")
        