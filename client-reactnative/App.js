import {registerRootComponent} from 'expo';
import Login from './screens/Login';
import Register from './screens/Register';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { auth,db} from './firebaseConfig';
import RotatingImage from './misc/RotatingScreen';
import HomeStack from './HomeStack';
Stack=createNativeStackNavigator()

const handleDebugReset = async () => {
  await AsyncStorage.clear();
};
export default function App() {
  const [user,setUser]=React.useState(null);
  const [loading,setLoading]=React.useState(true);
  React.useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged(user=>{
      setUser(user);
      const delay=setTimeout(()=>setLoading(false),1250);
      return ()=>clearTimeout(delay);
    });
    return unsubscribe;
  },[]);
  if(loading){
    return (
      <RotatingImage />
    );
  }
  return (
         <NavigationContainer>
            <Stack.Navigator>
            {user ? (
          <>
           <Stack.Screen options={{headerShown:false}} name="HomeStack" component={HomeStack}/>
          </>
        ) : (
          <>
            <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
            <Stack.Screen options={{ headerShown: false }} name="Register" component={Register} />
          </>
        )}
            </Stack.Navigator>
         </NavigationContainer>

  );
}
registerRootComponent(App);
