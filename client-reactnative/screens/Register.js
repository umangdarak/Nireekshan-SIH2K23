import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import "firebase/firestore";
const { height, width } = Dimensions.get("window");
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
const Register = ({ navigation }) => {
  //states for text inputs useState hooks
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //function to register user to firebase authentication
  const register = async (username, password, email) => {
    try {
      //creating new user
      
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      //updating profile to have username as well
      await updateProfile(user, { displayName: username });
      Alert.alert("", "User has been Registered");
    } catch (e) {
      //error messages
      Alert.alert("", "User not Registered");
      console.log(e.message);
    }
  };

  const handleSignUp = () => {
    //checking if all fields have been filled
    if (username === "" || password === "" || email === "") {
      Alert.alert("", "Please fill all fields");
    } else {
      if (password === confirmPassword) {
        //calling the register user function
        register(username, password, email)
          .then(() => {
            //navigating to login page
            //navigation.navigate('Login');
          })
          .catch((e) => {
            //Error
            Alert.alert("", "Please Try Again");
          });
      } else {
        Alert.alert("", "Passwords do not match");
      }
    }
  };
  return (
    <ImageBackground
      source={require("../assets/Signupbg.jpg")}
      style={tw`w-full h-full`}
    >
      <View
        style={[tw` flex  justify-center flex-col max-w-full max-h-full mt-30`]}
      >
        <View style={tw`justify-start ml-10`}>
          <Text style={tw` text-white font-semibold text-5xl my-4`}>
            Create
          </Text>
          <Text style={tw`text-white font-semibold text-5xl`}>Account</Text>
        </View>
        <View style={tw`items-center justify-center mt-10`}>
          <View style={[tw`h-12 mt-5 bg-white rounded-xl `, { width: 290 }]}>
            <TextInput
              placeholder="Username"
              style={[tw`h-12 ml-5  `, { width: 290 }]}
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <View style={[tw`h-12 mt-5 bg-white rounded-xl `, { width: 290 }]}>
            <TextInput
              placeholder="Email"
              style={[tw`h-12 ml-5  `, { width: 290 }]}
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={[tw`h-12 mt-5 bg-white rounded-xl `, { width: 290 }]}>
            <TextInput
              placeholder="Password"
              style={[tw`h-12 ml-5  `, { width: 290 }]}
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={[tw`h-12 mt-5 bg-white rounded-xl `, { width: 290 }]}>
            <TextInput
              placeholder=" Confirm Password"
              style={[tw`h-12 ml-5  `, { width: 290 }]}
              value={confirmPassword}
              secureTextEntry={true}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>
          <View
            style={[
              tw`flex-row items-center my-10 justify-between`,
              { width: 290 },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate("Login");
              }}
              style={tw` text-blue-700`}
            >
              {
                <Text
                  style={[
                    tw` text-lg `,
                    {
                      fontSize: 20,
                      textShadowColor: "rgba(0, 0, 0, 0.75)",
                      textShadowOffset: { width: 2, height: 2 },
                      textShadowRadius: 5,
                    },
                  ]}
                >
                  Sign In?
                </Text>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUp}>
              <View
                style={tw` w-12 h-12 bg-blue-700 rounded-full justify-center items-center `}
              >
                <AntDesign name="arrowright" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Register;
