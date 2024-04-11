import requests;
import pandas as pd;
from flask import Flask, request, jsonify;
import joblib;
from datetime import datetime
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import pandas as pd


def AQIPredictionFuture(latitude,longitude,dattime,listofjsondata):
    
    var1 = [{"lat": item.get("coord", {}).get("lat", None), "lon": item.get("coord", {}).get("lon", None)} for item in listofjsondata if "coord" in item]
    var2 = [entry["components"] for item in listofjsondata if "list" in item for entry in item.get("list", [])]
    var3 = [{"dt": entry["dt"]} for item in listofjsondata if "list" in item for entry in item.get("list", [])]
    df1 = pd.DataFrame(var1)
    df2 = pd.DataFrame(var2)
    df3=pd.DataFrame(var3)
    result = pd.concat([df1,df2,df3], axis=1)
    row = result
    row=row.drop(['no','nh3'], axis=1)
    def calc_pm_25(x):
        if x <= 10 and x >= 0:
            IHi = 50
            ILo = 0
            BHi = 10
            BLo = 0
        elif x <= 25 and x > 10:
            IHi = 100
            ILo = 51
            BHi = 60
            BLo = 31
        elif x <= 50 and x > 25:
            IHi = 200
            ILo = 101
            BHi = 50
            BLo = 26
        elif x <= 75 and x > 50:
            IHi = 300
            ILo = 201
            BHi = 75
            BLo = 51
        else:
            IHi = 400
            ILo = 301
            BHi = 100
            BLo = 76
        res = ((IHi - ILo) / (BHi - BLo)) * (x - BLo) + ILo
        return res

    def calc_pm_10(x):
        if x <= 60 and x >= 0:
            IHi = 50
            ILo = 0
            BHi = 60
            BLo = 0
        elif x <= 100 and x > 60:
            IHi = 100
            ILo = 51
            BHi = 100
            BLo = 61
        elif x <= 140 and x > 100:
            IHi = 200
            ILo = 101
            BHi = 140
            BLo = 101
        elif x <= 180 and x > 140:
            IHi = 300
            ILo = 201
            BHi = 180
            BLo = 140
        else:
            IHi = 400
            ILo = 301
            BHi = 200
            BLo = 181
        res = ((IHi - ILo) / (BHi - BLo)) * (x - BLo) + ILo
        return res


    def calc_co(x):
        if x <= 4400 and x >= 0:
            IHi = 50
            ILo = 0
            BHi = 4400
            BLo = 0
        elif x <= 9400 and x > 4400:
            IHi = 100
            ILo = 51
            BHi = 9400
            BLo = 4400
        elif x <= 12400 and x > 9400:
            IHi = 200
            ILo = 101
            BHi = 12400
            BLo = 9400
        elif x <= 15400 and x > 12400:
            IHi = 300
            ILo = 201
            BHi = 15400
            BLo = 12401
        else:
            IHi = 400
            ILo = 301
            BHi = 19000
            BLo = 15441
        res = ((IHi - ILo) / (BHi - BLo)) * (x - BLo) + ILo
        return res


    def calc_so2(x):
        if x <= 20 and x >= 0:
            IHi = 50
            ILo = 0
            BHi = 20
            BLo = 0
        elif x <= 80 and x > 20:
            IHi = 100
            ILo = 51
            BHi = 80
            BLo = 21
        elif x <= 250 and x > 80:
            IHi = 200
            ILo = 101
            BHi = 250
            BLo = 81
        elif x <= 350 and x > 250:
            IHi = 300
            ILo = 201
            BHi = 350
            BLo = 251
        else:
            IHi = 400
            ILo = 301
            BHi = 450
            BLo = 351
        res = ((IHi - ILo) / (BHi - BLo)) * (x - BLo) + ILo
        return res


    def calc_o3(x):
        if x <= 60 and x >= 0:
            IHi = 50
            ILo = 0
            BHi = 60
            BLo = 0
        elif x <= 100 and x > 60:
            IHi = 100
            ILo = 51
            BHi = 100
            BLo = 61
        elif x <= 140 and x > 100:
            IHi = 200
            ILo = 101
            BHi = 140
            BLo = 101
        elif x <= 180 and x > 140:
            IHi = 300
            ILo = 201
            BHi = 180
            BLo = 141
        else:
            IHi = 400
            ILo = 301
            BHi = 220
            BLo = 180
        res = ((IHi - ILo) / (BHi - BLo)) * (x - BLo) + ILo
        return res


    def calc_no2(x):
        if x <= 40 and x >= 0:
            IHi = 50
            ILo = 0
            BHi = 40
            BLo = 0
        elif x <= 70 and x > 40:
            IHi = 100
            ILo = 51
            BHi = 70
            BLo = 41
        elif x <= 150 and x > 70:
            IHi = 200
            ILo = 101
            BHi = 150
            BLo = 71
        elif x <= 200 and x > 150:
            IHi = 300
            ILo = 201
            BHi = 200
            BLo = 151
        else:
            IHi = 400
            ILo = 301
            BHi = 240
            BLo = 201
        res = ((IHi - ILo) / (BHi - BLo)) * (x - BLo) + ILo
        return res


    def calcAQI(row):
        r1 = calc_pm_25(row["pm2_5"])
        r2 = calc_pm_10(row["pm10"])
        r3 = calc_co(row["co"])
        r4 = calc_no2(row["no2"])
        r5 = calc_o3(row["o3"])
        r6 = calc_so2(row["so2"])
        result = (r1 + r2 + r3 + r4 + r5 + r6) / 6
        return result

    def calcAQI(row):
        r1= calc_pm_25(row['pm2_5'])
        r2=calc_pm_10(row['pm10'])
        r3=calc_co(row['co'])
        r4=calc_no2(row['no2'])
        r5=calc_o3(row['o3'])
        r6=calc_so2(row['so2'])
        result= (r1+r2+r3+r4+r5+r6)/6
        return result
    row['AQI value'] = row.apply(calcAQI, axis=1)
    def convert_seconds_to_date(seconds):
        try:
            # Use the datetime.utcfromtimestamp method to convert seconds to a UTC datetime object
            utc_datetime = datetime.utcfromtimestamp(seconds)

            # Format the UTC datetime object as a string
            formatted_date = utc_datetime.strftime('%Y-%m-%d %H:%M:%S')

            return formatted_date
        except Exception as e:
            return f"Error: {e}"
    row['formatteddate'] = row['dt'].apply(convert_seconds_to_date)
    row['formatteddate'] = pd.to_datetime(row['formatteddate'])
    row['numerical_date'] = row['formatteddate'].astype(str)
    
    X =row.drop(['AQI value','dt','lon','lat','formatteddate'], axis=1)
    Y = row['AQI value']
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)
    model = XGBRegressor(objective='reg:squarederror', n_estimators=100,enable_categorical = True)
    model.fit(X_train, Y_train)

    dattime = row['numerical_date'].astype('float64')
    

    def calmaxpoll(passed):
        r = []
        x = calc_co(passed[0])
        r.append(x)
        x = calc_no2(passed[1])
        r.append(x)
        x = calc_o3(passed[2])
        r.append(x)
        x = calc_so2(passed[3])
        r.append(x)
        x = calc_pm_25(passed[4])
        r.append(x)
        x = calc_pm_10(passed[5])
        r.append(x)
        maximum = max(r)
        indexof = r.index(maximum)
        passed[indexof]
        if indexof == 0:
            x = "CO"
        elif indexof == 1:
            x = "NO2"
        elif indexof == 2:
            x = "O3"
        elif indexof == 3:
            x = "SO2"
        elif indexof == 4:
            x = "PM25"
        else:
            x = "PM10"
        return passed[indexof], x
    res = requests.get(f"http://api.openweathermap.org/data/2.5/air_pollution?lat={latitude}&lon={longitude}&appid=db112d3739aa9252822907ef98be86ad")
    var1 = res.json()
    var2 = var1["list"][0]["components"]
    x = list(var2.values())
    x.pop(1)
    x.pop()
    resultparam = calmaxpoll(x)
    x.append(dattime)
    result = model.predict([x])
    finalresult=result.tolist()
    return {"predictedresult":finalresult[0],"parameterEffect":resultparam};
