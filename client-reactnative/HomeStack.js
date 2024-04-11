import {
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import React from "react";
import Home from "./screens/Home/Home";
import { Ionicons,  Octicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./screens/Profile";
import History from "./screens/History";

//bottom tab navigation
Tab = createBottomTabNavigator();
const HomeStack = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOption={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tw`justify-center items-center`}>
              <AnimateIcon type="Home" focused={focused} />
            </View>
          ),
          headerShown: false,
        }}
        component={Home}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <AnimateIcon type="Profile" focused={focused} />
            </View>
          ),
          headerShown: false,
        }}
        component={Profile}
      />
      <Tab.Screen
        name="History"
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <AnimateIcon type="History" focused={focused} />
            </View>
          ),
          headerShown: false,
        }}
        component={History}
      />
    </Tab.Navigator>
  );
};

const AnimateIcon = ({ focused, type }) => {
  const [popUpAnimation] = useState(new Animated.Value(0));
  useEffect(() => {
    if (focused) {
      const popUp = Animated.timing(popUpAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back()),
        useNativeDriver: true,
      });
      popUp.start();
    }
  }, [focused, popUpAnimation]);
  const c = focused ? "white" : "rgb(29 78 216 / var(--tw-bg-opacity))";
  return (
    <Animated.View
      style={{
        transform: [
          {
            scale: popUpAnimation.interpolate({
              inputRange: [0, 5],
              outputRange: [0.5, 1],
            }),
          },
        ],
      }}
    >
      {type == "Home" && (
        <Ionicons name="ios-home-outline" size={45} color="white" />
      )}
      {type == "History" && <Octicons name="history" size={45} color="white" />}
      {type == "Profile" && (
        <Ionicons name="ios-person-outline" size={45} color="white" />
      )}
    </Animated.View>
  );
};
export default HomeStack;

const TabBar = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={tw`flex-row bottom-10 bg-blue-600 h-12 items-center mx-2 rounded-xl `}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View key={index} style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{ color: isFocused ? "blue" : "black" }}
              onPress={onPress}
            >
              <AnimateIcon type={label} focused={isFocused} />
            </Text>
          </View>
        );
      })}
    </View>
  );
};
