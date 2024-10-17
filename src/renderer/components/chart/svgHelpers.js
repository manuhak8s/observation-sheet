
import { 
    CENTER_X, CENTER_Y, OUTER_RADIUS_X, OUTER_RADIUS_Y, 
    HORIZONTAL_SCALE 
} from './constants.js';
import { dimensions } from './dimensions.js';

export function createSector(startAngle, endAngle, color) {
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
    
    const startX = CENTER_X + OUTER_RADIUS_X * Math.cos(startAngle);
    const startY = CENTER_Y + OUTER_RADIUS_Y * Math.sin(startAngle);
    const endX = CENTER_X + OUTER_RADIUS_X * Math.cos(endAngle);
    const endY = CENTER_Y + OUTER_RADIUS_Y * Math.sin(endAngle);
    
    return `<path d="M${CENTER_X},${CENTER_Y} L${startX},${startY} A${OUTER_RADIUS_X},${OUTER_RADIUS_Y} 0 ${largeArcFlag},1 ${endX},${endY} Z" fill="${color}" fill-opacity="0.2" />`;
}

export function createCurvedField(innerRadiusY, outerRadiusY, startAngle, endAngle, color) {
    const innerRadiusX = innerRadiusY * HORIZONTAL_SCALE;
    const outerRadiusX = outerRadiusY * HORIZONTAL_SCALE;

    const innerStartX = CENTER_X + innerRadiusX * Math.cos(startAngle);
    const innerStartY = CENTER_Y + innerRadiusY * Math.sin(startAngle);
    const outerStartX = CENTER_X + outerRadiusX * Math.cos(startAngle);
    const outerStartY = CENTER_Y + outerRadiusY * Math.sin(startAngle);
    const innerEndX = CENTER_X + innerRadiusX * Math.cos(endAngle);
    const innerEndY = CENTER_Y + innerRadiusY * Math.sin(endAngle);
    const outerEndX = CENTER_X + outerRadiusX * Math.cos(endAngle);
    const outerEndY = CENTER_Y + outerRadiusY * Math.sin(endAngle);

    return `M${innerStartX},${innerStartY}
            A${innerRadiusX},${innerRadiusY} 0 0,1 ${innerEndX},${innerEndY}
            L${outerEndX},${outerEndY}
            A${outerRadiusX},${outerRadiusY} 0 0,0 ${outerStartX},${outerStartY}
            Z`;
}

export function createLabel(name, angle) {
    const radius = OUTER_RADIUS_Y + 60;
    const x = CENTER_X + (radius * HORIZONTAL_SCALE) * Math.cos(angle);
    const y = CENTER_Y + radius * Math.sin(angle);
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