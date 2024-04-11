import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";

 export default function Piechart1({ datapollution }) {
  const [data, setData] = useState([]);
  const colours=["#44FF07","#FED60A","#FB0007","#3700FF","#FB13F3","#008B8B"]
  const color={
    'BOD':colours[0],
    'DO':colours[1],
    'FEcalColiform':colours[2],
    'Nitrate':colours[3],
    'TotalColiform':colours[4],
    'pH':colours[5]
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