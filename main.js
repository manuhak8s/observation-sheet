import { initChart, resizeChart } from './chartInitialization.js';

window.addEventListener('resize', resizeChart);

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    resizeChart();
});