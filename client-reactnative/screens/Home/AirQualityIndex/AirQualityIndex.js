import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import React, {  useEffect, useState } from "react";
import MapView, {  } from "react-native-maps";
import { Marker } from "react-native-maps";
import tw from "twrnc";
import * as Location from "expo-location";
import RotatingImage from "../../../misc/RotatingScreen";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");
const LATITUDE_DELTA = 0.28;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const AirQualityIndex = ({ navigation }) => {
  const navigate=useNavigation()
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");

  useEffect(() => {
    
    fetchlocation();
  }, []);
  const fetchlocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("", "Couldnt get Location try again");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const getGeocodeCoordinates = async (cityName) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("", "Couldnt get Location try again");
      return;
    }
    let locationgeo = await Location.geocodeAsync(cityName);
    setLocation({
      coords: {
        latitude: locationgeo[0].latitude,
        longitude: locationgeo[0].longitude,
      },
    });
  };
  const handleCityChange = (text) => {
    setCity(text);
    if(text==''){
      fetchlocation()
    }
  };

  const handleUpdateLocation = () => {
    try {
      getGeocodeCoordinates(city);
    } catch (e) {
      console.log(e);
    }
  };


 


  const calculateAQI = () => {
    if (location && location.coords) {
    //  postDataToServer(location.coords.latitude, location.coords.longitude);
      
      navigate.navigate('AirQualityIndex',{location:location})
    } else {
      Alert.alert("", "Location not available. Please try again.");
    }
  };
  return (
    <View>
      <View style={tw`flex-col`}>
        <View style={[tw`h-12 my-5 bg-white rounded-xl ml-4 mr-4`]}>
          <TextInput
            style={[
              tw`h-4 my-5 border-gray-500`,
              {paddingLeft:10 },
            ]}
            editable
            placeholder="CityName"
            value={city}
            onSubmitEditing={handleUpdateLocation}
            onChangeText={handleCityChange}
          />
        </View>
        <View style={tw` h-50 m-4 rounded-xl`}>
          {location == null ? (
           <View style={tw`w-full h-full rounded-3xl bg-white`}>
              <RotatingImage small={true}/>
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
        <View style={tw`flex-row items-end w-full`}>
          <TouchableOpacity
            onPress={calculateAQI}
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

export default AirQualityIndex;
