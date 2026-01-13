import numpy as np
from flask import Flask,request,jsonify,render_template
import pickle
#create flask app

app=Flask(__name__)
#load the pickle model

model = pickle.load(open("model.pkl","rb"))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict",methods=["POST"])
def predict():
    data = request.get_json()
    features=[np.array(data["features"])]  
    prediction = model.predict(features)
    return jsonify({'prediction': int(prediction[0])})
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)   