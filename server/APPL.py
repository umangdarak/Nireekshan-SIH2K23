# imports
import requests
import pandas as pd
from sklearn.model_selection import train_test_split
import xgboost as xgb
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from scipy.stats import zscore
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.ensemble import GradientBoostingRegressor
from flask import jsonify




def WQIPrediction(StringDistrict):
    dat=pd.read_csv('./Final_WQI_data.csv')
    dat= dat.fillna(0)
    def concTotalSol(row):
        result=row['TDS (mg/L)']+row['TFS (mg/L)']+row['TSS (mg/L)']
        return result
    dat['TotalSolids']=dat.apply(concTotalSol,axis=1)
    dat= dat.drop(columns=['ID','StName','WaterBody'],axis=1)
    dat=dat.drop(columns=['TDS (mg/L)','TFS (mg/L)','TSS (mg/L)'],axis=1)
    df_num_final = dat.select_dtypes(exclude="object")
    
    df_num_final_norm = zscore(df_num_final, axis=0)
    def indices_of_greater_than_3(df_norm):
        indices_arr = []
        n_col = df_norm.shape[1]
        for index in range(n_col):
            col_index = df_norm.iloc[: ,index]
            greater_than_3 = df_norm[col_index > 3]
            greater_than_3_index = greater_than_3.index
            indices_arr.extend(greater_than_3_index)
        return indices_arr
    indices_arr = indices_of_greater_than_3(df_num_final_norm)
    dat.drop(indices_arr, axis=0, inplace=True)

    def convert_to_numeric(input_string):
        try:
            numeric_value = float(input_string)
            return numeric_value
        except ValueError:
            print("Error: Unable to convert the string to a numeric value.")
            return None 
    dat['DO (mg/L)']=dat['DO (mg/L)'].apply(convert_to_numeric)
    dat['DO (mg/L)']=dat['DO (mg/L)'].apply(convert_to_numeric)
    dat['COD (mg/L)']=dat['COD (mg/L)'].apply(convert_to_numeric)
    dat['Fecal Coliform (MPN/100ml)']=dat['Fecal Coliform (MPN/100ml)'].apply(convert_to_numeric)
    dat=dat.drop(columns=['Fluoride (mg/L)','Chloride (mg/L)','TotalSolids','COD (mg/L)','Total Phosphate (mg/L)','Turbidity (NTU)','Conductivity (mS/cm)'])
    df_num_final = dat.select_dtypes(exclude="object")
    wi = np.array([ 0.2604,0.2213, 0.4426, 0.0492, 0.0221, 0.0022])
    si = np.array([ 8.5,10, 5, 45, 100, 1000])
    vIdeal = np.array([ 7,14.6,0, 0, 0, 0])
    def calc_wqi(sample):
        wqi_sample = 0
        num_col = 6
        for index in range(num_col):
            v_index = sample[index] # Obeserved value of sample at index
            v_index_ideal = vIdeal[index] # Ideal value of obeserved value
            w_index = wi[index] # weight of corresponding parameter of obeserved value
            std_index = si[index] # Standard value recommended for obeserved value
            q_index = (v_index - v_index_ideal) / (std_index - v_index_ideal)
            q_index = q_index * 100 # Final qi value of obeserved value
            wqi_sample += q_index*w_index
        return wqi_sample
    def calc_wqi_for_df(df):
        wqi_arr = []
        for index in range(df.shape[0]):
            index_row = df.iloc[index, :]
            wqi_row = calc_wqi(index_row)
            wqi_arr.append(wqi_row)
        for i in range(len(wqi_arr)):
            wqi_arr[i]=(wqi_arr[i]/2)-5
        return wqi_arr

    wqi_arr = calc_wqi_for_df(df_num_final)
    wqi_arr = np.array(wqi_arr)
    wqi_arr = np.reshape(wqi_arr, (-1, 1))
    dat = dat.reset_index()
    df_wqi = pd.concat([dat, pd.DataFrame(wqi_arr, columns=["WQI"])], axis=1)
    df_wqi.drop("index", axis=1, inplace=True)
    df_wqi[(df_wqi["WQI"] < 0)]
    df_neg_indices = df_wqi[(df_wqi["WQI"] < 0)].index
    df_wqi.drop(df_neg_indices, axis=0, inplace=True)
    X=df_wqi.drop(columns=['pH',	'DO (mg/L)',	'BOD (mg/L)',	'Nitrate',	'Fecal Coliform (MPN/100ml)',	'Total Coliform (MPN/100ml)','WQI'])
    Y=df_wqi['WQI']
    X_train,X_test,Y_train,Y_test=train_test_split(X,Y,test_size=0.15,random_state=2)
    preprocessor = ColumnTransformer(
    transformers=[('encoder', OneHotEncoder(handle_unknown='ignore'), ['District'])],remainder='passthrough')
    pipeline = Pipeline(steps=[('preprocessor', preprocessor),('regressor',GradientBoostingRegressor(n_estimators=500))])
    pipeline.fit(X_train, Y_train)
    def predictCalculator(thisisastring):
        inp=thisisastring
        new_data = pd.DataFrame({'District': [inp]})
        prediction = pipeline.predict(new_data)
        return {"prediction":prediction[0]}
    def printparam(distatt):
        def search_district(district_name):
            district_data = df_wqi[df_wqi['District'] == district_name]
            return district_data if not district_data.empty else f"No data found for '{district_name}'"
        result=search_district(distatt)
        index=[]
        for i in result:
            index.append(i)
        lis=[]
        for i in index:
            lis.append(result.iloc[0][i])
        lis.pop()
        lis.pop(0)
        return lis
    l1=printparam(StringDistrict)
    
    return {"pollution_parameters":{
        'pH':l1[0],	'DO (mg/L)':l1[1],	'BOD':l1[2],	'Nitrate':l1[3],	'FecalColiform':l1[4],	'TotalColiform':l1[5]
            },
            "prediction_wqi":predictCalculator(StringDistrict)}



def AQIPrediction(listofjsondata,latitude,longitude):
    var1 = [{"lat": item.get("coord", {}).get("lat", None), "lon": item.get("coord", {}).get("lon", None)} for item in listofjsondata if "coord" in item]
    var2 = [entry["components"] for item in listofjsondata if "list" in item for entry in item.get("list", [])]

    df1 = pd.DataFrame(var1)
    df2 = pd.DataFrame(var2)
    result = pd.concat([df1, df2], axis=1)
    row = result
    row = row.drop(["no", "nh3"], axis=1)
    print(row)
    
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


    row["AQI value"] = row.apply(calcAQI, axis=1)


    def Air_Quality(row):
        if row["AQI value"] > 0 and row["AQI value"] <= 50:
            return "Very Good"
        elif row["AQI value"] > 50 and row["AQI value"] <= 100:
            return "Good"
        elif row["AQI value"] > 100 and row["AQI value"] <= 200:
            return "Moderate"
        elif row["AQI value"] > 200 and row["AQI value"] <= 300:
            return "Poor"
        else:
            return "Very Poor"


    row["Air Quality"] = row.apply(Air_Quality, axis=1)
    X_train, X_test, y_train, y_test = train_test_split(
        row[
            [
                i
                for i in row.columns
                if i not in ["AQI value", "Air Quality", "lat", "lon", "city"]
            ]
        ],
        row["AQI value"],
        test_size=0.2,
        random_state=45,
    )
    xg_reg = xgb.XGBRegressor(
        objective="reg:squarederror",
        colsample_bytree=0.3,
        learning_rate=0.1,
        max_depth=5,
        alpha=10,
        n_estimators=100,
        )
    # Fit the model on the training data
    xg_reg.fit(X_train, y_train)
    # Make predictions on the validation set
    preds = xg_reg.predict(X_test)
    # Calculate and print the Mean Squared Error (MSE) on the validation set
    mse = mean_squared_error(y_test, preds)


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
        return r


    resparam = []
    res = requests.get(
        f"http://api.openweathermap.org/data/2.5/air_pollution?lat={latitude}&lon={longitude}&appid=db112d3739aa9252822907ef98be86ad"
    )
    var1 = res.json()
    var2 = var1["list"][0]["components"]
    x = list(var2.values())
    x.pop(1)
    x.pop()
    resultparam = calmaxpoll(x)
    result = xg_reg.predict([x])
    result_list = result.tolist() 
    return {'predicted_aqi': result_list, 'pollution_parameters': {
        'PM2.5':resultparam[0],
        'PM10':resultparam[1],
        'CO':resultparam[2],
        'SO2':resultparam[3],
        'O3':resultparam[4],
        'NO2':resultparam[5]
    }}