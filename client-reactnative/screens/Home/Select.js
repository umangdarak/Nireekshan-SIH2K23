import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import {  useNavigation } from "@react-navigation/native";
import Card from "../../misc/Card";
import AqiwqiBox from "../../misc/Aqiwqi";
import {Asset} from "expo-asset"
import RotatingImage from "../../misc/RotatingScreen";
const Select = () => {
  const navigation = useNavigation();
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    Asset.loadAsync(require("../../assets/Homebg.jpg")).then(()=>{
      setLoading(false)
    })
  },[])
  if(loading){
    return(
      <RotatingImage small={false}/>
    )
  }
  return (
    <View style={tw`w-full h-full flex-1`}>
      <ImageBackground
        source={require("../../assets/Homebg.jpg")}
        style={[
          tw`w-full h-full`,
          {
            flex: 1,
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: -2,
          },
        ]}
        resizeMode="stretch"
      >
        <Card />
       <AqiwqiBox />
      </ImageBackground>
    </View>
  );
};

export default Select;
