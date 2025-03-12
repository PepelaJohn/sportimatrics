import { ChartData } from "chart.js";
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
  RadialLinearScale,
} from "chart.js";
import { Chart, Line } from "react-chartjs-2";
ChartJS.register(PointElement, RadialLinearScale,LineElement,CategoryScale);
import { Radar } from "react-chartjs-2";

type dataProps = {
  data: any;
  options: { [key: string]: any };
};

const RadarComponent = ({ data, options }: dataProps) => {

  return <Radar data={data} options={options} />;
};

export default RadarComponent;
