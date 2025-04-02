// components/StockHeatmap.tsx

import React from 'react';
import Highcharts, { SeriesHeatmapOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Heatmap from 'highcharts/modules/heatmap';

// Initialize the heatmap module
if (typeof Highcharts === 'object') {
  Heatmap(Highcharts);
}

// Define a type for the stock data
type StockData = {
  name: string;
  performance: number;
};

interface StockHeatmapProps {
  data: StockData[];
}

const StockHeatmap: React.FC<StockHeatmapProps> = ({ data }) => {
  // Define Highcharts options with TypeScript
  const options: Highcharts.Options = {
    chart: {
      type: 'heatmap',
      height: 600,
      width: 800,
    },
    title: {
      text: 'Indian Market Stock Heatmap',
    },
    xAxis: {
      categories: data.map(stock => stock.name),
      title: {
        text: 'Stock Symbols',
      },
    },
    yAxis: {
      categories: ['Performance'],
      title: {
        text: null,
      },
    },
    colorAxis: {
      min: -10,
      max: 10,
      stops: [
        [0, '#FF0000'], // Red for negative performance
        [0.5, '#FFFFFF'], // Neutral
        [1, '#00FF00'], // Green for positive performance
      ],
    },
    series: [
      {
        type: 'heatmap',
        name: 'Stock Performance',
        borderWidth: 1,
        data: data.map((stock, i) => [i, 0, stock.performance]), // [x, y, value]
        dataLabels: {
          enabled: true,
          color: '#000000',
          format: '{point.value}%',
        },
      } as SeriesHeatmapOptions,
    ],
    tooltip: {
      formatter: function () {
        return `<b>${data[this.point.x].name}</b>: ${this.point.value}%`;
      },
    },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StockHeatmap;
