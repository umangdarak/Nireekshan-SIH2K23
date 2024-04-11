import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Circle } from "react-native-maps";
import tw from "twrnc";
import { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
const { height, width } = Dimensions.get("window");
const LATITUDE_DELTA = 0.28;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
import { Asset } from "expo-asset";
import RotatingImage from "../../../misc/RotatingScreen";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../firebaseConfig";
import { collection, doc, addDoc } from "firebase/firestore";
import PollutionPieChart from "../../../misc/Piechart";
import Piechart1 from "../../../misc/piechart2";

const ResultWaterQuality = ({ route }) => {
  const { location, district } = route.params;
  const [wqiData, setWqiData] = useState(null);
  const [color, setColor] = useState(null);
  const [intense, setIntense] = useState(null);
  const [impacts, setImpacts] = useState(null);
  const [precautions, setPrecautions] = useState(null);
  const [farmers,setFarmers]=useState(null)
  const [precautionsfarmers,setPrecautionsFarmers]=useState("null");
  const [dataloaded,setDataloaded]=useState(true)
  const navigate = useNavigation();
  useEffect(() => {
    console.log(wqiData);

    if (wqiData) {
      setDataloaded(false);
    }
    const runCode = () => {
      if (wqiData && wqiData["prediction_wqi"]["prediction"] !== null) {
        const result = wqiData["prediction_wqi"]["prediction"];

        if (result >= 0 && result <= 25) {
          setColor("#013220");
          setImpacts("Generally safe; low risk of waterborne diseases");
          setIntense("Excellent");
          setPrecautions("Water quality is acceptable");
        } else if (result >= 26 && result <= 50) {
          setColor("#90EE90");
          setImpacts(
            "Minimal risk; water generally safe for human consumption"
          );
          setIntense("Good");
          setPrecautions("Minimal treatment required before consumption");
        } else if (result >= 51 && result <= 75) {
          setColor("#FFA500");
          setImpacts(
            "Potential for mild to moderate water-related diseases.Examples: Gastroenteritis, mild dysentery"
          );
          setIntense("Fair");
          setPrecautions(
            "Regular monitoring is recommended to ensure sustained quality"
          );
        } else if (result >= 76 && result <= 100) {
          setColor("#FFFF00");
          setImpacts(
            "Increased likelihood of waterborne diseases. Examples: Cholera, typhoid fever, more severe cases of gastroenteritis"
          );
          setIntense("Poor");
          setPrecautions(
            "Boiling or other treatment methods are advised before consumption. Continuous monitoring and potential corrective measures are necessary"
          );
        } else if (result >= 100) {
          setColor("#FF0000");
          setIntense("Very Poor");
          setImpacts(
            "Serious health hazards; high risk of waterborne diseases, including outbreaks. Examples: Severe cholera outbreaks, widespread contamination leading to various waterborne illnesses"
          );
          setPrecautions(
            "Strict treatment measures are necessary. Avoid direct contact and consumption without proper purification"
          );
        }
      }
      saveToFirestore();
    };
    runCode();
  }, [wqiData]);

  const saveToFirestore = async () => {
    const user = auth.currentUser;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const aqicollection = collection(userDocRef, "wqi");
      const aqidoc = await addDoc(aqicollection, wqiData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const postDataToServer = async (district) => {
      try {
        const response = await fetch(
          "https://teamacenireekshanam.onrender.com/wqi",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ district: district }),
          }
        );
        if (response.status == 200) {
          const data = await response.json();
          setWqiData(data);
        } else {
          Alert.alert("", "Error loading data");
          console.log(response.status);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    postDataToServer(district);
    Asset.loadAsync(require("../../../assets/Homebg.jpg"));
  }, []);

  if (wqiData == null) {
    return <RotatingImage small={false} />;
  }
  return (
    <View style={tw`w-full h-full flex-1`}>
      <ImageBackground
        source={require("../../../assets/Homebg.jpg")}
        style={[
          tw`w-full h-full`,
          {
            flex: 1,
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: -2,
          },
        ]}
        resizeMode="stretch"
      >
        <View style={tw`mt-10`}>
          <View style={tw`ml-4 flex-row items-center`}>
            <TouchableOpacity
              onPress={() => {
                navigate.navigate("Select");
              }}
            >
              <Ionicons name="chevron-back-outline" size={27} color="black" />
            </TouchableOpacity>
            <Text style={tw`text-2xl text-black ml-1 font-bold`}>
              Water Quality Index
            </Text>
          </View>
          <ScrollView>
            <View>
          <View style={tw` h-50 m-4 rounded-xl`}>
            {wqiData && (
              <MapView
                mapType="standard"
                zoomEnabled={true}
                loadingEnabled
                scrollEnabled={true}
                showsScale={true}
                region={{
                  latitude: location?.coords?.latitude || 0,
                  latitudeDelta: LATITUDE_DELTA,
                  longitude: location?.coords?.longitude || 0,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                style={tw`w-full h-full rounded-3xl`}
              >
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="You are here"
                />
                <Circle
                  center={location.coords}
                  radius={5000}
                  fillColor={color}
                />
              </MapView>
            )}
          </View>
          {wqiData && (
              <View>
                  <View style={tw`w-full`}>
                    {!dataloaded && wqiData ? (
                      <Piechart1 datapollution={wqiData} />
                    ) : (
                      <></>
                    )}
                  </View>
                <View style={tw`flex-col ml-4 `}>
                  <Text style={tw`text-2xl font-bold`}>
                    The Water Quality Index in your region is:
                  </Text>
                  <View style={tw`flex-row`}>
                    <Text style={[tw`text-2xl font-bold text-blue-700 mt-4`]}>
                      {wqiData["prediction_wqi"]["prediction"]}
                    </Text>
                    <Text
                      style={[
                        tw`text-2xl font-bold ml-4 mt-4`,
                        { color: color },
                      ]}
                    >
                      {intense}
                    </Text>
                  </View>
                </View>
                <View style={tw`flex-col ml-4 mt-4`}>
                  <Text style={tw`text-2xl font-bold`}>
                    The Associated Health Impacts in your region is:
                  </Text>
                  <View style={tw`flex-row`}>
                    <Text style={[tw`text-2xl font-bold text-blue-700 mt-4`]}>
                      {impacts}
                    </Text>
                  </View>
                </View>
                <View style={tw`flex-col ml-4 mt-4 `}>
                  <Text style={tw`text-2xl font-bold`}>
                    The Precautions in your region is:
                  </Text>
                  <View style={tw`flex-row `}>
                    <Text style={[tw`text-2xl font-bold text-blue-700 mt-4`]}>
                      {precautions ? precautions : "No precautions available"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            </View>
            </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};
export default ResultWaterQuality;
