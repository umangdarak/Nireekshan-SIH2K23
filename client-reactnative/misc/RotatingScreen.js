import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing,ImageBackground } from 'react-native';
import tw from 'twrnc'
const RotatingImage = ({small}) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.timing(rotateValue, {
      toValue: 1,
      duration: 2000, // You can adjust the duration as needed
      easing: Easing.linear,
      useNativeDriver: true,
    });

    // Loop the animation
    Animated.loop(rotateAnimation).start();
  }, [rotateValue]);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     {small!=true? <ImageBackground
        source={require("../assets/Homebg.jpg")}
        style={[
          tw`w-full h-full justify-center items-center`,
          {
            flex: 1,
            position: "absolute",
            width: "100%",
            height: "100%",
          },
        ]}
        resizeMode="stretch"
      > 
      <Animated.Image
        source={require('./assets/nireekshanam-high-resolution-logo-transparent.png')}
        style={[{ width: 100, height: 100 }, animatedStyle]}
      />
      </ImageBackground>:<Animated.Image
        source={require('./assets/nireekshanam-high-resolution-logo-transparent.png')}
        style={[{ width: 100, height: 100 }, animatedStyle]}
      />}
    </View>
  );
};

export default RotatingImage;

