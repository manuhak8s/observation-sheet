import { VIEWBOX_SIZE } from './constants.js';
import { dimensions } from './dimensions.js';
import { createSector, createLabel, createHalfFillPatterns } from './svgHelpers.js';
import { createFields } from './fieldCreation.js';
import { addFieldClickListeners } from './interactivity.js';

export function initChart() {
    console.log('initChart called');
    const svg = document.getElementById('chart');
    if (!svg) {
        console.error('SVG element not found');
        return;
    }

    svg.setAttribute('viewBox', `0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    let sectorsHTML = '';
    let fieldsHTML = '';
    let labelsHTML = '';

    const totalFields = dimensions.reduce((sum, dim) => sum + (dim.endField - dim.startField + 1), 0);
    const anglePerField = (2 * Math.PI) / totalFields;

    let startAngle = -Math.PI / 2;

    dimensions.forEach((dimension, index) => {
        const dimensionFields = dimension.endField - dimension.startField + 1;
        const endAngle = startAngle + dimensionFields * anglePerField;
        
        sectorsHTML += createSector(startAngle, endAngle, dimension.color);
        fieldsHTML += createFields(dimension, startAngle, endAngle, index);
        labelsHTML += createLabel(dimension.name, (startAngle + endAngle) / 2);
        
        startAngle = endAngle;
    });

    svg.innerHTML = `
        <g id="sectors">${sectorsHTML}</g>
        <g id="fields">${fieldsHTML}</g>
        <g id="labels">${labelsHTML}</g>
    `;

    createHalfFillPatterns(svg);
    
    // Fügen Sie einen kleinen Zeitversatz hinzu
    setTimeout(() => {
        addFieldClickListeners();
        console.log('Click listeners added');
    }, 0);

    console.log('Chart initialized');
}

export function resizeChart() {
    const container = document.getElementById('chart-container');
    const svg = document.getElementById('chart');
    const aspect = VIEWBOX_SIZE / VIEWBOX_SIZE;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    if (containerWidth / containerHeight > aspect) {
        svg.style.width = `${containerHeight * aspect}px`;
        svg.style.height = `${containerHeight}px`;
    } else {
        svg.style.width = `${containerWidth}px`;
        svg.style.height = `${containerWidth / aspect}px`;
    }
}