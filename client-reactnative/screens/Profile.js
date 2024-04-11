import { View, Text, TouchableOpacity, Alert,ImageBackground } from 'react-native'
import React, { useEffect,useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import UserAvatar from '@muhzi/react-native-user-avatar'
import { auth } from '../firebaseConfig.js'
import RotatingImage from '../misc/RotatingScreen'

const Profile = () => {
  const [user,setUser]=useState();
  const [loading,setLoading]=React.useState(true);

  useEffect(()=>{
    const subscribe=auth.onAuthStateChanged((user)=>{
      setUser(user);
      const delay=setTimeout(()=>setLoading(false),1250);
      return ()=>clearTimeout(delay);
    });
    return subscribe;
  },[]);
  if(loading){
    return (
      <RotatingImage />
      );
  }
  const signOut=()=>{
    auth.signOut().then(()=>{Alert.alert("You have Signed Out Successfully")}).catch((e)=>{Alert.alert("There was a Problem SigningOut")})
  }
  return (
    <ImageBackground
 source={require('../assets/Homebg.jpg')}
 style={{width:'100%',height:'100%'}}
 resizeMode="stretch"
 >
    <View style={tw`items-center mt-24`}>
      <UserAvatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQffNEiVzx0h3F6ewtt6Vpj7l0MTz7zz0YrRQ&usqp=CAU" size={150}/>
      <Text
      style={tw`mt-4 text-3xl`}>{user.displayName}</Text>
      <TouchableOpacity
      style={[tw`bg-blue-700 mt-8`,{width:250,
        height:40,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',}]} onPress={signOut}>
        <Text style={tw`text-white text-2xl`}>SignOut</Text>
      </TouchableOpacity>
    </View>
   </ImageBackground>
  )
}

export default Profile