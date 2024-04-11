import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import Card from "./Home/Card";
import { SafeAreaView } from "react-native-safe-area-context";

const History = () => {
  const data = [
    {
      text: "Xiaomi Mi Air Purifier for Home",
      image: "https://m.media-amazon.com/images/I/71zAlwulOOL._SX522_.jpg",
    },
    {
      text: "AGARO Grand Cool Mist Ultrasonic Humidifier",
      image: "https://m.media-amazon.com/images/I/617JNscqntL._SX522_.jpg",
    },
  ];
  const data1 = [
    {
      text: "Pet waste bags",
      image:
        "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/518CVgwaksL._SX300_SY300_QL70_FMwebp_.jpg",
    },
    {
      text: "Biodegradable soaps and detergents",
      image:
        "https://ecomaniac.org/wp-content/uploads/2022/12/How-Do-You-Know-If-A-Soap-Is-Biodegradable.jpg",
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView>
      <View>
        <Text style={{ fontSize: 24 }}>Products for improving Air Quality</Text>
        <View>
          {data.map((item, index) => (
            <Card key={index} title={item.text} imageUrl={item.image} />
          ))}
          {/* Add a similar map function for data1 */}
        </View>
        <Text style={{ fontSize: 24 }}>
          Products for improving Water Quality
        </Text>
        <View>
          {data1.map((item, index) => (
            <Card key={index} title={item.text} imageUrl={item.image} />
          ))}
          {/* Add a similar map function for data1 */}
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
