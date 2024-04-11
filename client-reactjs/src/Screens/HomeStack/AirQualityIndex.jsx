import React, { useEffect, useState } from "react";
import {
  TileLayer,
  Marker,
  Popup,
  MapContainer,
  useMap,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaSearch } from "react-icons/fa";
import { auth, db } from "../../firebaseConfig";
import { collection, doc, addDoc } from "firebase/firestore";
export default function AirQualityIndex() {
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [color, setColor] = useState(null);
  const [intense, setIntense] = useState(null);
  const [precautions, setPrecautions] = useState(null);
  const [precautionsair, setPrecautionsair] = useState(null);
  const [impacts, setImpacts] = useState(null);
  const [maxpol, setMaxpol] = useState(null);
  const [dataloaded, setDataloaded] = useState(false);
  const [parameter, setParameter] = useState(null);
  const [precautionfarmers, setPrecautionsFarmers] = useState(null);
  const [rural, setRural] = useState(null);
  const [ruralPrecautions, setRuralPrecautions] = useState(null);
  const [farmers, setFarmers] = useState(null);
  const [loading,setLoading]=useState(true);
  const getLocation = async () => {
    try {
      if ("geolocation" in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setLocation(position);
      } else {
        alert("Geolocation not supported in this browser");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Error getting location");
    }
  };
  useEffect(() => {
    getLocation();
  }, []);

  if (!location) {
    return null;
  }

  const getLocation1 = async () => {
    try {
      if (cityName.trim() === "") {
        alert("Please enter a city name.");
        return;
      }

      // Geocoding using OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          cityName
        )}`
      );

      if (!response.ok) {
        throw new Error("Geocoding failed");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        const coordinates = [
          parseFloat(firstResult.lat),
          parseFloat(firstResult.lon),
        ];
        setLocation({
          coords: {
            latitude: coordinates[0],
            longitude: coordinates[1],
          },
        });
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
      alert("Error during geocoding");
    }
  };

  const CustomMap = () => {
    const map = useMap();

    useEffect(() => {
      if (location) {
        map.setView([location.coords.latitude, location.coords.longitude], 13);
      }
    }, [map, location]);

    return null;
  };
  const postDataToServer = async (latitude, longitude) => {
    try {
      const response = await fetch(
        "https://teamacenireekshanam.onrender.com/aqi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude: latitude, longitude: longitude }),
        }
      );
      if (response.status == 200) {
        const data = await response.json();
        console.log(data);
        setAqiData(data);
        setLoading(false);
      } else {
        Alert.alert("", "Error loading data");
        console.log(response.status);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
    console.log(aqiData);
  };

  
  const runCode = () => {
    if (aqiData && aqiData["predicted_aqi"] !== null) {
      const result = aqiData["predicted_aqi"];

      if (result >= 0 && result <= 50) {
        setColor("#013220");
        setIntense("Very Good");
        setImpacts("Minimal Impact ");
        setPrecautionsair("Air quality is acceptable");
      } else if (result >= 51 && result <= 100) {
        setColor("#90EE90");
        setIntense("Good");
        setImpacts("May cause minor breathing discomfort to sensitive people");
        setPrecautionsair(
          "No specific precautions necessary for the general population"
        );
      } else if (result >= 101 && result <= 200) {
        setColor("#FFA500");
        setIntense("Moderately Polluted");
        setImpacts(
          "May cause breathing discomfort to people with lung disease such as asthma, and discomfort to people with heart disease, children and older adults"
        );
        setPrecautionsair(
          "Maintain good health practices: stay hydrated, eat a balanced diet, and consult a doctor if experiencing breathing difficulties or related symptoms"
        );
      } else if (result >= 201 && result <= 300) {
        setColor("#FFFF00");
        setIntense("Poor");
        setImpacts(
          "May cause breathing discomfort to people on prolonged exposure, and discomfort to people with heart disease "
        );
        setPrecautionsair("Wear masks if going outside");
      } else if (result >= 301 && result <= 400) {
        setColor("#FF0000");
        setIntense("Very Poor");
        setImpacts(
          "May cause respiratory illness to the people on prolonged exposure"
        );
        setPrecautionsair(
          "People with existing heart or respiratory illnesses, children, and elderly should limit outdoor exertion. Wear masks if going outside"
        );
      }
      const max = Object.keys(aqiData["pollution_parameters"]).reduce((a, b) =>
        aqiData["pollution_parameters"][a] > aqiData["pollution_parameters"][b]
          ? a
          : b
      );
      const parameterEffect = max;
      setMaxpol(max);
      if (parameterEffect && parameterEffect.length > 1) {
        const parameter = parameterEffect;
        setParameter(parameter);

        if (parameter === "PM10" || parameter === "PM2.5") {
          setPrecautions(
            "These particles, when inhaled, can penetrate deeper into the respiratory system and cause respiratory ailments such as asthma, coughing, sneezing, irritation in the airways, eyes, nose, throat irritation, etc"
          );
          if (parameter === "PM10") {
            setFarmers(
              "Air Quality Impact,Crop Damage,Soil Contamination,Visibility and Safety"
            );
            setPrecautionsFarmers(
              "Emission Reduction Measures,Cover Crops,Dust Control Measures,Respiratory Protection"
            );
            setRural(
              "Respiratory Health Concerns,Outdoor Worker Exposure,Livestock and Animal Health Impact,Limited Access to Healthcare,Reduced Visibility"
            );
            setRuralPrecautions(
              "Education and Awareness Programs, Protective Measures for Outdoor Workers, Promotion of Sustainable Practices, Collaboration with Environmental Agencies"
            );
          } else if (parameter == "PM2.5") {
            setFarmers(
              "Air Quality Impact,Crop Damage,Soil Contamination,Respiratory Health Concerns,"
            );
            setPrecautionsFarmers(
              "Vegetative Buffers,Cover Crops,Dust Control Measures,Respiratory Protection,Advocacy for Air Quality Regulations"
            );
            setRural(
              "Respiratory Health Concerns,Outdoor Worker Exposure,Livestock and Animal Health Impact,Limited Access to Healthcare,Reduced Visibility"
            );
            setRuralPrecautions(
              "Education and Awareness Programs, Protective Measures for Outdoor Workers, Promotion of Sustainable Practices, Collaboration with Environmental Agencies"
            );
          }
        } else if (parameter === "CO") {
          setPrecautions(
            "Increase in its concentration causes carbon monoxide poisoning (interference with oxygen-hemoglobin binding) in human beings, chest pain, heart diseases, reduced mental capabilities, vision problems, and contributes to smog formation."
          );
          setFarmers(
            "Air Quality Impact,Health Concerns for Farm Workers,Greenhouse Gas Emissions,Indoor Air Quality in Farm Buildings,"
          );
          setPrecautionsFarmers(
            "Regular Maintenance,Proper Ventilation,Use of Clean Energy,Compliance with Regulations"
          );
          setRural(
            "Indoor Air Pollution,Unsafe Cooking Practices,Heating Systems,Occupational Exposure,Limited Access to Healthcare,Use of Generators"
          );
          setRuralPrecautions(
            "Education and Awareness Programs,Promotion of Clean Cooking Technologies,Proper Ventilation Practices,Occupational Safety Measures,Emergency Response Training"
          );
        } else if (parameter === "O3") {
          setPrecautions(
            "When ozone is inhaled by humans, reduced lung function, inflammation of airways, and irritation in the eyes, nose & throat are seen"
          );
          setFarmers(
            "Reduced Crop Yields,Damage to Vegetation,Affects Crop Quality,Impact on Sensitive Crops,Long-Term Impact on Soil Health"
          );
          setPrecautionsFarmers(
            "Monitor Air Quality,Choose Ozone-Resistant Crop Varieties,Modify Planting Times,Implement Crop Rotation."
          );
          setRural(
            "Agricultural Impact,Respiratory Health Concerns,Outdoor Worker Exposure,Limited Access to Healthcare,Impact on Livestock,Water Quality Impact"
          );
          setRuralPrecautions(
            "Education and Awareness Programs,Protective Measures for Outdoor Workers,Promotion of Sustainable Practices,Collaboration with Environmental Agencies"
          );
        } else if (parameter === "NO2") {
          setPrecautions(
            "Nitrogen dioxide poisoning is as much as hazardous as carbon monoxide poisoning. It is when inhaled can cause serious damage to the heart, absorbed by the lungs, inflammation, and irritation of airways. Smog formation and foliage damage are some environmental impacts of nitrogen dioxide."
          );
          setFarmers(
            "Livestock Emissions,Ammonia (NH3) Emissions,Combustion Emissions,Respiratory Health Concerns,Crop Damage"
          );
          setPrecautionsFarmers(
            "Livestock Management,Optimized Fertilizer Application,Cover Crops and Buffer Zones,Alternative Energy Sources,Monitoring and Compliance"
          );
          setRural(
            "Respiratory Health Concerns,Livestock Health Impact,Water Quality Impact,Limited Access to Healthcare"
          );
          setRuralPrecautions(
            "Education and Awareness Programs,Protective Measures for Outdoor Workers,Promotion of Sustainable Practices,Collaboration with Environmental Agencies"
          );
        } else if (parameter === "SO2") {
          setPrecautions(
            "In humans, it causes breathing discomfort, asthma, eyes, nose, and throat irritation, inflammation of airways, and heart diseases"
          );
          setFarmers(
            "Industrial Emissions,Acid Rain Formation,Crop Damage,Soil Acidification,Water Contamination"
          );
          setPrecautionsFarmers(
            "Crop Selection,Crop Rotation and Diversification,Soil Amendments,Monitoring and Early Detection"
          );
          setRural(
            "Respiratory Health Concerns, Livestock Health Impact, Water Quality Impact, Limited Access to Healthcare"
          );
          setRuralPrecautions(
            "Education and Awareness Programs, Protective Measures for Outdoor Workers, Promotion of Sustainable Practices, Collaboration with Environmental Agencies"
          );
        }
      }
    }
    saveToFirestore();
  };
  const saveToFirestore = async () => {
    const user = auth.currentUser;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const aqicollection = collection(userDocRef, "aqi");
      const aqidoc = await addDoc(aqicollection, aqiData);
    } catch (e) {
      console.log(e);
    }
  };
useEffect(()=>{runCode()},[loading])
  return (
    <div className="flex flex-row justify-normal mt-4">
      <div className="flex flex-col ml-6 w-1/2 items-center">
        <div className="flex flex-row justify-between w-full mb-5">
          <div className="h-12 bg-white flex flex-row rounded-xl w-full mr-2 ">
            <input
              type="text"
              placeholder="  City Name"
              className="h-12 w-full rounded-xl mb-5"
              onChange={(e) => setCityName(e.target.value)}
            />
            <button className="mx-4" onClick={getLocation1}>
              <FaSearch size={23} />
            </button>
          </div>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() =>
              postDataToServer(
                location.coords.latitude,
                location.coords.longitude
              ).then(runCode())
            }
          >
            Calculate
          </button>
        </div>
        {location ? (
          <MapContainer
            center={[location.coords.latitude, location.coords.longitude]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <CustomMap />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[location.coords.latitude, location.coords.longitude]}
            >
              <Popup></Popup>
            </Marker>
            {color && (
              <Circle
                center={[location.coords.latitude, location.coords.longitude]}
                fill
                fillOpacity={0.6}
                fillColor={color}
                radius={5000}
              />
            )}
          </MapContainer>
        ) : (
          <div
            style={{
              background:
                "url(src/assets/nireekshanam-high-resolution-logo-transparent.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              transition: "transform 0.5s ease-in-out ",
              transform: "rotate(360deg)",

              height: "100vh",
            }}
            className=" flex  flex-col w-full h-full"
          ></div>
        )}
      </div>
      <div className="flex flex-col ml-6 items-center w-1/2">
        <div className="flex flex-row justify-center items-center">
          {aqiData && (
            <div>
              <div className="text-3xl text-black"> Air Quality Index:</div>
              <div className="text-3xl text-blue-700">
                {aqiData["predicted_aqi"]}
                {intense?intense:<>nodata</>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
