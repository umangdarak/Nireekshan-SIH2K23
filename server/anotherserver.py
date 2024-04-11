from flask import Flask,request,jsonify;
from flask_cors import CORS;
import requests 
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import concurrent


app=Flask(__name__)
CORS(app)


#api to get data of particular latitude and longitude
@app.route("/aqidata",methods=["GET"])
def AQIData():    
    result=JsonData()
    return jsonify(result);

#getting data from server based on a single latitude and longitude
def fetch_data(latitude,longitude):
    response=requests.get( f"http://api.openweathermap.org/data/2.5/air_pollution?lat={latitude}&lon={longitude}&appid=db112d3739aa9252822907ef98be86ad")
    return response.json()

#getting all the data
def JsonData():
    # reading longitude and lattitude data from csv file
    df=pd.read_csv("data.csv")
    # converting it to dictionary format
    listofdic = df.to_dict()
    #converting to a list for latitudes and longitude
    latitudes=listofdic["lat"]
    longitudes=listofdic["lng"]
    datetimes=listofdic['dt']
    #submit multiple tasks at a single time
    with ThreadPoolExecutor() as executor:
        #saving data into a dictionary 
        futureData={
            #running the fetch_data for every lat and lng running concurrently 
            executor.submit(fetch_data,lat,lng,datetime):(lat,lng,datetime) for lat,lng,datetime in zip(latitudes,longitudes,datetimes)
        }
        listofjsondata=[];
        #loop on the futures returned by the futureData
        for future in concurrent.futures.as_completed(futureData):
            try:
                #result of the future
                data = future.result()
                #adding to listofjsondata
                listofjsondata.append(data)
            except Exception as e:
                print(f"Error fetching data: {e}")
    #returning listofjsondata
    return listofjsondata

if __name__=="__main__":
    app.run(host='0.0.0.0',debug=False)

