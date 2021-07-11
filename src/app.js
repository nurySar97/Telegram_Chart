import { chart } from "./chart";
import { getChartData } from './data';

chart(document.getElementById('chart'), getChartData()).init();