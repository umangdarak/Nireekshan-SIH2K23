from flask import Flask,request,jsonify;
from flask_cors import CORS;
from APPL import AQIPrediction,WQIPrediction
from time_1 import AQIPredictionFuture
from datetime import datetime
import requests
import json
app=Flask(__name__)
CORS(app)

@app.route("/aqi",methods=["POST"])
def AirQualityIndex():
    data=request.json;
    longitude=data['longitude'];
    latitude=data['latitude'];
    response=requests.get("https://apiforaqidataneww.onrender.com/aqidata")
    finaldata=AQIPrediction(latitude=latitude,longitude=longitude,listofjsondata=response.json())
    return finaldata;

    

@app.route("/wqi",methods=["POST"]) 
def WaterQualityIndex():
    data=request.json;
    district=data['district']
    response=WQIPrediction(district)
    return jsonify(response)

if __name__=="__main__":
    app.run(host='0.0.0.0',debug=False)
