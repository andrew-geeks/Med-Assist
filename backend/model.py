import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from tensorflow.keras.applications.densenet import preprocess_input
import cv2
from tensorflow.keras.models import load_model
import numpy as np


class Predict:
    def __init__(self):
        self.labels = ['Cardiomegaly', 
          'Emphysema', 
          'Effusion', 
          'Hernia', 
          'Infiltration', 
          'Mass', 
          'Nodule', 
          'Atelectasis',
          'Pneumothorax',
          'Pleural Thickening', 
          'Pneumonia', 
          'Fibrosis', 
          'Edema', 
          'Consolidation']
        
        self.model = load_model("chest_xray_model.h5",compile=False)
        

    def preprocess_image(img_path, img_size=(320, 320)):
        img = cv2.imread(img_path)  # Read image
        img = cv2.resize(img, img_size)  # Resize
        img = np.expand_dims(img, axis=0)  # Add batch dimension
        img = preprocess_input(img)  # Normalize
        return img
    
    def getres(self,img_path):
        img = Predict.preprocess_image(img_path)
        preds = self.model.predict(img)[0]
        pred_ls = preds.tolist()
        if(max(pred_ls)<0.50):
            return "No Findings"
        return self.labels[pred_ls.index(max(pred_ls))]
