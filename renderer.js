const dimensions = [
    { name: "Spielen", color: "#90EE90", startField: 1, endField: 38 },
    { name: "Sprechen, Hören, Sehen", color: "#FFA500", startField: 39, endField: 61 },
    { name: "Denken", color: "#40E0D0", startField: 62, endField: 90 },
    { name: "Bewegung", color: "#FFC0CB", startField: 91, endField: 114 },
    { name: "Lebenspraxis", color: "#87CEEB", startField: 115, endField: 143 },
    { name: "Soziales Miteinander / Emotionalität", color: "#FF6347", startField: 144, endField: 169 }
];

const SVG_WIDTH = 800;
const SVG_HEIGHT = 800;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2;
const OUTER_RADIUS = 350;
const INNER_RADIUS = 100;
const ROWS = 10;

function createSector(startAngle, endAngle, color) {
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
    
    const startX = CENTER_X + OUTER_RADIUS * Math.cos(startAngle);
    const startY = CENTER_Y + OUTER_RADIUS * Math.sin(startAngle);
    const endX = CENTER_X + OUTER_RADIUS * Math.cos(endAngle);
    const endY = CENTER_Y + OUTER_RADIUS * Math.sin(endAngle);
    
    return `<path d="M${CENTER_X},${CENTER_Y} L${startX},${startY} A${OUTER_RADIUS},${OUTER_RADIUS} 0 ${largeArcFlag},1 ${endX},${endY} Z" fill="${color}" fill-opacity="0.2" />`;
}

function createCurvedField(innerRadius, outerRadius, startAngle, endAngle, color) {
    const innerStartX = CENTER_X + innerRadius * Math.cos(startAngle);
    const innerStartY = CENTER_Y + innerRadius * Math.sin(startAngle);
    const outerStartX = CENTER_X + outerRadius * Math.cos(startAngle);
    const outerStartY = CENTER_Y + outerRadius * Math.sin(startAngle);
    const innerEndX = CENTER_X + innerRadius * Math.cos(endAngle);
    const innerEndY = CENTER_Y + innerRadius * Math.sin(endAngle);
    const outerEndX = CENTER_X + outerRadius * Math.cos(endAngle);
    const outerEndY = CENTER_Y + outerRadius * Math.sin(endAngle);

    return `M${innerStartX},${innerStartY}
            A${innerRadius},${innerRadius} 0 0,1 ${innerEndX},${innerEndY}
            L${outerEndX},${outerEndY}
            A${outerRadius},${outerRadius} 0 0,0 ${outerStartX},${outerStartY}
            Z`;
}

function createFields(dimension, startAngle, endAngle, index) {
    const fields = [];
    const sectorAngle = endAngle - startAngle;
    const radiusStep = (OUTER_RADIUS - INNER_RADIUS) / ROWS;
    
    const totalFields = dimension.endField - dimension.startField + 1;
    let fieldCount = 0;
    
    for (let row = 0; row < ROWS && fieldCount < totalFields; row++) {
        const innerRadius = INNER_RADIUS + row * radiusStep;
        const outerRadius = innerRadius + radiusStep;
        const fieldsInRow = Math.min(row + 2, totalFields - fieldCount);
        const fieldAngle = sectorAngle / fieldsInRow;

        for (let i = 0; i < fieldsInRow && fieldCount < totalFields; i++) {
            const fieldStartAngle = startAngle + i * fieldAngle;
            const fieldEndAngle = fieldStartAngle + fieldAngle;
            const fieldPath = createCurvedField(innerRadius, outerRadius, fieldStartAngle, fieldEndAngle, dimension.color);
            const centerAngle = (fieldStartAngle + fieldEndAngle) / 2;
            const centerRadius = (innerRadius + outerRadius) / 2;
            const textX = CENTER_X + centerRadius * Math.cos(centerAngle);
            const textY = CENTER_Y + centerRadius * Math.sin(centerAngle);

            const fieldNumber = dimension.startField + fieldCount;
            const field = `
                <g class="field" data-state="0" data-dimension="${index}">
                    <path d="${fieldPath}" fill="white" stroke="${dimension.color}" stroke-width="1" />
                    <text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="central" 
                          fill="black" font-size="10">${fieldNumber}</text>
                </g>
            `;
            fields.push(field);
            fieldCount++;
        }
    }
    
    return fields.join('');
}

function createLabel(name, angle) {
    const radius = OUTER_RADIUS + 30;
    const x = CENTER_X + radius * Math.cos(angle);
    const y = CENTER_Y + radius * Math.sin(angle);
    const rotation = (angle * 180 / Math.PI + 90) % 360;
    return `<text x="${x}" y="${y}" text-anchor="middle" fill="black" font-size="14" transform="rotate(${rotation}, ${x}, ${y})">${name}</text>`;
}

function createHalfFillPatterns(svg) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    dimensions.forEach(dimension => {
        const gradientId = `gradient${dimension.color.substring(1)}`;
        defs.innerHTML += `
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${dimension.color};stop-opacity:1" />
                <stop offset="50%" style="stop-color:${dimension.color};stop-opacity:1" />
                <stop offset="50%" style="stop-color:white;stop-opacity:1" />
                <stop offset="100%" style="stop-color:white;stop-opacity:1" />
            </linearGradient>
        `;
    });
    svg.prepend(defs);
}

function addFieldClickListeners() {
    document.querySelectorAll('.field').forEach(field => {
        field.addEventListener('click', () => {
            const currentState = parseInt(field.dataset.state);
            const newState = (currentState + 1) % 3;
            field.dataset.state = newState;
            
            const dimensionIndex = field.dataset.dimension;
            const color = dimensions[dimensionIndex].color;
            const path = field.querySelector('path');
            
            switch(newState) {
                case 0:
                    path.setAttribute('fill', 'white');
                    break;
                case 1:
                    path.setAttribute('fill', `url(#gradient${color.substring(1)})`);
                    break;
                case 2:
                    path.setAttribute('fill', color);
                    break;
            }
        });
    });
}

function initChart() {
    console.log('initChart called');
    const svg = document.getElementById('chart');
    if (!svg) {
        console.error('SVG element not found');
        return;
    }

    let sectorsHTML = '';
    let fieldsHTML = '';
    let labelsHTML = '';

    let startAngle = -Math.PI / 2;

    dimensions.forEach((dimension, index) => {
        const sectorAngle = (2 * Math.PI) / dimensions.length;
        const endAngle = startAngle + sectorAngle;
        
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
    addFieldClickListeners();

    console.log('Chart initialized');
}


document.addEventListener('DOMContentLoaded', initChart);