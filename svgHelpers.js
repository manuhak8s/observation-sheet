import { CENTER, OUTER_RADIUS } from './constants.js';
import { dimensions } from './dimensions.js';

export function createSector(startAngle, endAngle, color) {
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
    
    const startX = CENTER + OUTER_RADIUS * Math.cos(startAngle);
    const startY = CENTER + OUTER_RADIUS * Math.sin(startAngle);
    const endX = CENTER + OUTER_RADIUS * Math.cos(endAngle);
    const endY = CENTER + OUTER_RADIUS * Math.sin(endAngle);
    
    return `<path d="M${CENTER},${CENTER} L${startX},${startY} A${OUTER_RADIUS},${OUTER_RADIUS} 0 ${largeArcFlag},1 ${endX},${endY} Z" fill="${color}" fill-opacity="0.2" />`;
}

export function createCurvedField(innerRadius, outerRadius, startAngle, endAngle, color) {
    const innerStartX = CENTER + innerRadius * Math.cos(startAngle);
    const innerStartY = CENTER + innerRadius * Math.sin(startAngle);
    const outerStartX = CENTER + outerRadius * Math.cos(startAngle);
    const outerStartY = CENTER + outerRadius * Math.sin(startAngle);
    const innerEndX = CENTER + innerRadius * Math.cos(endAngle);
    const innerEndY = CENTER + innerRadius * Math.sin(endAngle);
    const outerEndX = CENTER + outerRadius * Math.cos(endAngle);
    const outerEndY = CENTER + outerRadius * Math.sin(endAngle);

    return `M${innerStartX},${innerStartY}
            A${innerRadius},${innerRadius} 0 0,1 ${innerEndX},${innerEndY}
            L${outerEndX},${outerEndY}
            A${outerRadius},${outerRadius} 0 0,0 ${outerStartX},${outerStartY}
            Z`;
}

export function createLabel(name, angle) {
    const radius = OUTER_RADIUS + 60;
    const x = CENTER + radius * Math.cos(angle);
    const y = CENTER + radius * Math.sin(angle);
    const rotation = (angle * 180 / Math.PI + 90) % 360;
    return `<text x="${x}" y="${y}" text-anchor="middle" fill="black" font-size="14" transform="rotate(${rotation}, ${x}, ${y})">${name}</text>`;
}

export function createHalfFillPatterns(svg) {
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