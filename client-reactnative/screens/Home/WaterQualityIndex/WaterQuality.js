import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import tw from "twrnc";
import * as Location from "expo-location";
import RotatingImage from "../../../misc/RotatingScreen";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";

const { height, width } = Dimensions.get("window");
const LATITUDE_DELTA = 0.28;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const WaterQualityIndex = ({ navigation }) => {
  const navigate = useNavigation();
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const telanganaDistricts = [
    "Medchal Malkajgiri",
    "Sangareddy",
    "Rangareddy",
    "Hyderabad",
    "RR-shamshabad",
    "Rangareddy",
    "Nalgonda",
    "Warangal Urban",
    "Peddapalli",
    "Bhadradri Kothagudem",
    "Mulugu",
    "Karimnagar",
    "Warangal",
    "Suryapet",
    "Khammam",
    "Mahaboobnagar",
    "Shamshabad",
    "Uppal",
    "Jayashankar Bhoopalpalli",
    "Yadadri Bhuvanagiri",
    "Warangal Rural",
    "Jogulamba Gadwal",
    "Adilabad",
    "Siddipet",
    "Rajanna Siricilla",
    "Nizamabad",
    "Rangareddy-I",
    "Ramagundem",
    "Mancherial",
    "Medak",
    "Nirmal",
  ];
  

  const getGeocodeCoordinates = async (cityName) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
   try{ if (status !== "granted") {
      Alert.alert("", "Couldnt get Location try again");
      return;
    }
    let locationgeo = await Location.geocodeAsync(cityName);
    setLocation({
      coords: {
        latitude: locationgeo[0].latitude,
        longitude: locationgeo[0].longitude,
      },
    });}catch(e){}
  };
  const handleCityChange = (text) => {
    setCity(text);
    
  };
  useEffect(()=>{
    handleUpdateLocation();
  },[city])

  const handleUpdateLocation = () => {
    try {
      getGeocodeCoordinates(city);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateWQI = () => {
    if (location && location.coords) {
      //  postDataToServer(location.coords.latitude, location.coords.longitude);

      navigate.navigate("WaterQualityIndex", { location: location,district:city });
    } else {
      Alert.alert("", "Location not available. Please try again.");
    }
  };
  return (
    <View>
      <View style={tw`flex-col`}>
        
          <SelectList 
            maxHeight={200}
            boxStyles={{margin:20,backgroundColor:"white"}}
            setSelected={(val) => {
              handleCityChange(val);
            }}
            data={telanganaDistricts.map((city) => ({
              label: city,
              value: city,
            }))}
            save="value"
            placeholder="Select a District"
          />
        
        <View style={tw` h-50 m-4 rounded-xl`}>
          {city&&(
            <View>
              {location == null ? (
                <View style={tw`w-full h-full rounded-3xl bg-white`}>
                  <RotatingImage small={true} />
                </View>
              ) : (
                <MapView
                  mapType="standard"
                  zoomEnabled={true}
                  loadingEnabled
                  scrollEnabled={true}
                  showsScale={true}
                  region={{
                    latitude: location?.coords?.latitude || 0,
                    latitudeDelta: LATITUDE_DELTA,
                    longitude: location?.coords?.longitude || 0,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                  style={tw`w-full h-full rounded-3xl`}
                >
                  {location && (
                    <Marker
                      coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                      }}
                      title="You are here"
                      draggable
                      onDragEnd={(e) => {
                        const newLatitude = e.nativeEvent.coordinate.latitude;
                        const newLongitude = e.nativeEvent.coordinate.longitude;
                        setLocation({
                          coords: {
                            latitude: newLatitude,
                            longitude: newLongitude,
                          },
                        });
                      }}
                    />
                  )}
                </MapView>
              )}
            </View>
          )}
        </View>
        <View style={tw`flex-row items-end w-full`}>
          <TouchableOpacity
            onPress={calculateWQI}
            style={tw`flex-row items-end w-full justify-end `}
          >
            <View
              style={tw`w-25 h-12 bg-blue-700 rounded-3xl justify-center items-center mr-5`}
            >
              <Text style={tw`text-white text-xl`}>Calculate</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WaterQualityIndex;
