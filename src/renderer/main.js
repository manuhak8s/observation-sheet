import { initChart, resizeChart } from './components/chart/chartInitialization.js';

window.addEventListener('resize', resizeChart);

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    resizeChart();
});