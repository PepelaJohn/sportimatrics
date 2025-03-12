import React from 'react'
import {PolarArea} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  RadialLinearScale,ArcElement
} from "chart.js";
import { Chart, Line } from "react-chartjs-2";
ChartJS.register(PointElement, RadialLinearScale,LineElement,CategoryScale,ArcElement);
type dataProps = {
  data: any;
 
};

const PolarComponent = ({data}: dataProps) => {
  return (
    <PolarArea className='w-full' data={data} />
  )
}

export default PolarComponent