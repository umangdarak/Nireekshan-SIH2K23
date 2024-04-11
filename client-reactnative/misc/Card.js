import { View, Text, Button ,TouchableOpacity, ImageBackground,StyleSheet,Dimensions,Image} from 'react-native';
import React from 'react'
import tw from 'twrnc';
import { auth } from '../firebaseConfig';
import RotatingImage from '../misc/RotatingScreen'


export default function Card() {
    const [user,setUser]=React.useState();
  const [loading,setLoading]=React.useState(true);

  React.useEffect(()=>{
    const subscribe=auth.onAuthStateChanged((user)=>{
      setUser(user);
      const delay=setTimeout(()=>setLoading(false),1250);
      return ()=>clearTimeout(delay);
    });
    return subscribe;
  },[]);
  if(loading){
    return (
      <RotatingImage small={true}/>
      );
  }
  
  return (
    <View style={tw`justify-center flex-col items-center px-4 mr-3`}>
  <View style={tw` bg-blue-500 w-full h-25 mt-24 rounded-xl flex-row justify-between  px-4`}>
    <View style={tw`flex-col mt-5`}><Text style={tw`text-white text-3xl`}>Hi {user.displayName}</Text>
    <Text style={tw`text-white text-xl`}>{user.email}</Text>
    </View>
    <Image
    source={require('../assets/luffy.jpg')}
    style={tw`rounded-full h-24 w-25`}
    resizeMode='cover'
    ></Image> 
  </View></View>
  )
}