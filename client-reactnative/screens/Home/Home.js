import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Select from './Select';
import ResultAirQuality from './AirQualityIndex/ResultAirQuality';
import ResultWaterQuality from './WaterQualityIndex/ResultWaterQuality';

Stack=createNativeStackNavigator();

export default function Home() {
  return (
    <Stack.Navigator >
        <Stack.Screen options={{headerShown:false}} name="Select" component={Select}/>
        <Stack.Screen options={{headerShown:false}} name="AirQualityIndex" component={ResultAirQuality}/>
        <Stack.Screen options={{headerShown:false}} name="WaterQualityIndex" component={ResultWaterQuality} />
    </Stack.Navigator>
  )
}