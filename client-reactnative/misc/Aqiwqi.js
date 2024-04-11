import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import AirQualityIndex from '../screens/Home/AirQualityIndex/AirQualityIndex'
import WaterQuality from '../screens/Home/WaterQualityIndex/WaterQuality'
const AqiwqiBox = ({props}) => {
    const [aqihit,setAqihit]=useState(true);
    const [wqihit,setWqihit]=useState(false);
    const aqihitting=()=>{
        setAqihit(true);
        setWqihit(false);
    }
    const wqihitting=()=>{
        setAqihit(false);
        setWqihit(true);
    }
  return (<View>
    <View style={tw`h-18 bg-white rounded-xl ml-4 mr-2 mt-12 flex-row py-2 px-4`}>
        <TouchableOpacity style={tw`w-1/2 `}
        onPress={aqihitting}
        ><View style={[aqihit?tw`bg-blue-700 h-full w-full rounded-xl`:tw`bg-white h-full w-full rounded-xl`,tw`flex-row items-center justify-center`]}>
        <Ionicons name="cloudy-outline" size={34} color={aqihit?"white":"black"}/>
            <Text style={aqihit?tw`text-white text-2xl ml-1`:tw`text-black text-2xl ml-1`}>AQI</Text></View></TouchableOpacity>
        <TouchableOpacity onPress={wqihitting}style={tw`w-1/2 `}><View style={[wqihit?tw`bg-blue-700 h-full w-full rounded-xl`:tw`bg-white h-full w-full rounded-xl`,tw`flex-row items-center justify-center`]}>
        <Ionicons name="ios-water-outline" size={34} color={wqihit?"white":"black"} />
            <Text style={wqihit?tw`text-white text-2xl ml-1`:tw`text-black text-2xl ml-1`}>WQIs</Text></View></TouchableOpacity>
    </View>
    {aqihit&&<AirQualityIndex/>}
    {wqihit&&<WaterQuality />}
    </View>
  )
}

export default AqiwqiBox