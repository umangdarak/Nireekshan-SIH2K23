import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  ImageBackground,
  Keyboard,
} from "react-native";
import React from "react";
import { useState } from "react";
import tw from "twrnc";
const { height, width } = Dimensions.get("window");
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { AntDesign } from "@expo/vector-icons";

import { ActivityIndicator } from "react-native";
const Login = ({ navigation }) => {
  //states for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  //login when email and password are entered
  const login = async (email, password) => {
    try {
      //sign-in using email and password
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredentials.user && userCredentials) {
        //logged in
        Alert.alert("", "Logged In");
      }
    } catch (e) {
      //invalid credentials
      Alert.alert("", "Invalid Email or Password");
    }
  };

  //handling the submit button
  const handleSubmit = () => {
    setLoading(true);
    //checking fields
    if (email === "" || password === "") {
      Alert.alert("", "Please fill all the field");
    } else {
      //calling the login function
      login(email, password)
        .then(() => {
          setLoading(false);
        })
        .catch((e) => {
          //Error
          Alert.alert("", "Please Try Again");
        });
    }
  };
  const forgetPassword = async () => {
    try {
      if (email != "") {
        await sendPasswordResetEmail(auth, email);
        Alert.alert("", "A Password Reset Email has been sent to your Email");
      } else {
        Alert.alert("", "Enter your registered Email");
      }
    } catch (e) {}
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ImageBackground
        source={require("../assets/Signinbg.jpg")}
        style={tw`w-full h-full`}
      >
        <View style={tw`flex-row items-start justify-center mt-42`}>
          <Text style={tw`italic font-semibold  text-white text-5xl`}>
            Welcome to Nireekshan
          </Text>
        </View>

        <View
          style={[tw` flex items-center  flex-col max-w-full max-h-full mt-20`]}
        > 
          <View style={tw`flex-col justify-center`}>
            <Text style={tw` text-3xl`}>Sign in</Text>
            <View>
              <View style={[tw`h-12 my-5 bg-white rounded-xl`, { width: 290 }]}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                  <TextInput
                    placeholder="Your Email"
                    style={[tw`h-12 ml-5  `]}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={[tw`h-12  bg-white rounded-xl `, { width: 290 }]}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                  <TextInput
                    placeholder="Password"
                    style={[tw`h-12 ml-5`, { width: 250 }]}
                    value={password}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={tw`justify-end items-end my-2`}>
                <TouchableOpacity
                  onPress={forgetPassword}
                  style={tw`justify-end`}
                >
                  <Text style={tw`text-red-600`}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={tw`flex flex-row items-center my-10 justify-between`}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate("Register");
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
                    Sign Up?
                  </Text>
                }
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit}>
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
    </TouchableWithoutFeedback>
  );
};
export default Login;
