import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function PollutionPieChart({ datapollution }) {
  const [data, setData] = useState([]);
  const colours=["#44FF07","#FED60A","#FB0007","#3700FF","#FB13F3","#008B8B"]
  const color={
    'PM2.5':colours[0],
    'PM10':colours[1],
    'CO':colours[2],
    'NO2':colours[3],
    'O3':colours[4],
    'SO2':colours[5]
  }
  useEffect(() => {
    if (datapollution && datapollution.pollution_parameters) {
      const pollutionParameters = datapollution.pollution_parameters;
      const chartData = Object.entries(pollutionParameters).map(
        ([label, value]) => ({
          name: label,
          population: value,
          color: color[label],
          legendFontColor: "#7F7F7F",
          legendFontSize: 8,
        })
      );

      setData(chartData);
    }
  }, [datapollution]);

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  };

  return (
    <View>
      {data.length > 0 ? (
        <PieChart
          data={data}
          width={380}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          absolute
        />
      ) : (
        <Text>Error</Text>
      )}
    </View>
  );
}
 