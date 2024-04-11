import React, { useEffect, useState } from "react";
import { TileLayer, Marker, Popup, MapContainer, useMap,Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const telanganaDistricts = [
  "Adilabad",
  "Bhadradri Kothagudem",
  "Hyderabad",
  "Jagtial",
  "Jangaon",
  "Jayashankar Bhupalapally",
  "Jogulamba Gadwal",
  "Kamareddy",
  "Karimnagar",
  "Khammam",
  "Komaram Bheem Asifabad",
  "Mahabubabad",
  "Mahabubnagar",
  "Mancherial",
  "Medak",
  "Medchal-Malkajgiri",
  "Nagarkurnool",
  "Nalgonda",
  "Nirmal",
  "Nizamabad",
  "Peddapalli",
  "Rajanna Sircilla",
  "Ranga Reddy",
  "Sangareddy",
  "Siddipet",
  "Suryapet",
];

export default function WaterQualityIndex() {
  const [location, setLocation] = useState(null);
  const [selectedOption, setSelectedOption] = useState(telanganaDistricts[0]);
  const [wqiData, setWqiData] = useState(null);
  const [color, setColor] = useState(null);
  const [intense, setIntense] = useState(null);
  const [impacts,setImpacts]=useState(null);
  const [precautions,setPrecautions]=useState(null);
  useEffect(() => {
    setSelectedOption(telanganaDistricts[0]);
  }, []);
  useEffect(() => {
    getLocation();
  }, [selectedOption]);
  useEffect(() => {
    console.log(location);
  }, [location]);
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
        console.log(data);
        setWqiData(data);
      } else {
        Alert.alert("", "Error loading data");
        console.log(response.status);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
    console.log(wqiData);
    runCode();
  };

  const runCode = () => {
    if (wqiData && wqiData.prediction !== null) {
      const result = wqiData.prediction;

      if (result >= 0 && result <= 25) {
        setColor("#013220");
        setImpacts("Generally safe; low risk of waterborne diseases");
        setIntense("Excellent");
        setPrecautions("Water quality is acceptable");
      } else if (result >= 26 && result <= 50) {
        setColor("#90EE90");
        setImpacts("Minimal risk; water generally safe for human consumption");
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
  };
  const getLocation = async () => {
    try {
      // Geocoding using OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${selectedOption}, Telangana, India`
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

    return location ? (
      <>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[location.coords.latitude, location.coords.longitude]}
        >
          <Popup></Popup>
        </Marker>
      </>
    ) : null;
  };

  const handleDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  return (
    <div className="flex flex-row justify-normal mt-4">
      <div className="flex flex-col ml-6 w-1/2 items-center">
        <div className="flex flex-row justify-between w-full mb-5">
          <div className="h-12 bg-white flex flex-row rounded-xl w-full mr-2 items-center ">
            <label htmlFor="dropdown" className="y-4">
              Select a district:
            </label>
            <select
              id="dropdown"
              className="w-full"
              onChange={handleDropdownChange}
              value={selectedOption}
            >
              {telanganaDistricts.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            onClick={() => {
              postDataToServer(selectedOption);
            }}
          >
            Calculate
          </button>
        </div>
        <MapContainer
          center={[
            location?.coords.latitude || 0,
            location?.coords.longitude || 0,
          ]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <CustomMap />
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
      </div>
      <div className="flex flex-col ml-6 items-center w-1/2">
        <div className="flex flex-row justify-center items-center">
          {wqiData && (
            <div>
              <div className="text-3xl text-black"> Water Quality Index:</div>
              <div className="text-3xl text-blue-700">
                {wqiData["prediction"]}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
