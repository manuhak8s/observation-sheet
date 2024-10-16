import { 
    CENTER_X, CENTER_Y, INNER_RADIUS_Y, OUTER_RADIUS_Y, 
    ROWS, HORIZONTAL_SCALE 
} from './constants.js';
import { createCurvedField } from './svgHelpers.js';

export function createFields(dimension, startAngle, endAngle, index) {
    const fields = [];
    const sectorAngle = endAngle - startAngle;
    const radiusStep = (OUTER_RADIUS_Y - INNER_RADIUS_Y) / ROWS;
    
    const totalFields = dimension.endField - dimension.startField + 1;
    let fieldCount = 0;

    if (index === 0) {
        // Layout für Dimension 1 (Spielen)
        const rowLayout = [8, 8, 8, 8, 6];
        const standardFieldAngle = sectorAngle / 8;
        
        for (let row = 0; row < rowLayout.length; row++) {
            const innerRadius = INNER_RADIUS_Y + row * radiusStep;
            const fieldsInRow = rowLayout[row];
            
            for (let i = 0; i < fieldsInRow && fieldCount < totalFields; i++) {
                const fieldNumber = dimension.startField + fieldCount;
                const isDoubleHeight = fieldNumber === 31 || fieldNumber === 32;
                const outerRadius = isDoubleHeight ? innerRadius + 2 * radiusStep : innerRadius + radiusStep;

                const fieldStartAngle = startAngle + i * standardFieldAngle;
                const fieldEndAngle = fieldStartAngle + standardFieldAngle;
                fields.push(createFieldElement(dimension, fieldNumber, innerRadius, outerRadius, fieldStartAngle, fieldEndAngle, index));
                fieldCount++;
            }
        }
    } else if (index === 1) {
        // Layout für Dimension 2 (Sprechen, Hören, Sehen)
        const rowLayout = [4, 4, 4, 4, 4, 3];
        const standardFieldAngle = sectorAngle / 4;
        
        for (let row = 0; row < rowLayout.length; row++) {
            const innerRadius = INNER_RADIUS_Y + row * radiusStep;
            const fieldsInRow = rowLayout[row];
            
            for (let i = 0; i < fieldsInRow && fieldCount < totalFields; i++) {
                const fieldNumber = dimension.startField + fieldCount;
                const isDoubleHeight = fieldNumber === 58;
                const outerRadius = isDoubleHeight ? innerRadius + 2 * radiusStep : innerRadius + radiusStep;

                const fieldStartAngle = startAngle + i * standardFieldAngle;
                const fieldEndAngle = fieldStartAngle + standardFieldAngle;
                fields.push(createFieldElement(dimension, fieldNumber, innerRadius, outerRadius, fieldStartAngle, fieldEndAngle, index));
                fieldCount++;
            }
        }
    } else if (index === 2) {
        // Layout für Dimension 3 (Denken)
        const rowLayout = [6, 6, 6, 6, 5];
        const standardFieldAngle = sectorAngle / 6;
        
        for (let row = 0; row < rowLayout.length; row++) {
            const innerRadius = INNER_RADIUS_Y + row * radiusStep;
            const fieldsInRow = rowLayout[row];
            
            for (let i = 0; i < fieldsInRow && fieldCount < totalFields; i++) {
                const fieldNumber = dimension.startField + fieldCount;
                const isDoubleHeight = fieldNumber === 85;
                const outerRadius = isDoubleHeight ? innerRadius + 2 * radiusStep : innerRadius + radiusStep;

                const fieldStartAngle = startAngle + i * standardFieldAngle;
                const fieldEndAngle = fieldStartAngle + standardFieldAngle;
                fields.push(createFieldElement(dimension, fieldNumber, innerRadius, outerRadius, fieldStartAngle, fieldEndAngle, index));
                fieldCount++;
            }
        }
    } else if (index === 3) {
        // Layout für Dimension 4 (Bewegung)
        const rowLayout = [5, 5, 5, 5, 4];
        const standardFieldAngle = sectorAngle / 5;
        
        for (let row = 0; row < rowLayout.length; row++) {
            const innerRadius = INNER_RADIUS_Y + row * radiusStep;
            const fieldsInRow = rowLayout[row];
            
            for (let i = 0; i < fieldsInRow && fieldCount < totalFields; i++) {
                const fieldNumber = dimension.startField + fieldCount;
                const isDoubleHeight = fieldNumber === 110;
                const outerRadius = isDoubleHeight ? innerRadius + 2 * radiusStep : innerRadius + radiusStep;

                const fieldStartAngle = startAngle + i * standardFieldAngle;
                const fieldEndAngle = fieldStartAngle + standardFieldAngle;
                fields.push(createFieldElement(dimension, fieldNumber, innerRadius, outerRadius, fieldStartAngle, fieldEndAngle, index));
                fieldCount++;
            }
        }
    } else if (index === 4) {
        // Layout für Dimension 5 (Lebenspraxis)
        const rowLayout = [6, 6, 6, 6, 5];
        const standardFieldAngle = sectorAngle / 6;
        
        for (let row = 0; row < rowLayout.length; row++) {
            const innerRadius = INNER_RADIUS_Y + row * radiusStep;
            const fieldsInRow = rowLayout[row];
            
            for (let i = 0; i < fieldsInRow && fieldCount < totalFields; i++) {
                const fieldNumber = dimension.startField + fieldCount;
                const isDoubleHeight = fieldNumber === 138;
                const outerRadius = isDoubleHeight ? innerRadius + 2 * radiusStep : innerRadius + radiusStep;

                const fieldStartAngle = startAngle + i * standardFieldAngle;
                const fieldEndAngle = fieldStartAngle + standardFieldAngle;
                fields.push(createFieldElement(dimension, fieldNumber, innerRadius, outerRadius, fieldStartAngle, fieldEndAngle, index));
                fieldCount++;
            }
        }
    } else if (index === 5) {
        // Layout für Dimension 6 (Soziales Miteinander / Emotionalität)
        const rowLayout = [5, 5, 5, 5, 5, 1];
        const standardFieldAngle = sectorAngle / 5;
        
        for (let row = 0; row < rowLayout.length; row++) {
            const innerRadius = INNER_RADIUS_Y + row * radiusStep;
            const fieldsInRow = rowLayout[row];
            
            for (let i = 0; i < fieldsInRow && fieldCount < totalFields; i++) {
                const fieldNumber = dimension.startField + fieldCount;
                const outerRadius = innerRadius + radiusStep;

                let fieldStartAngle, fieldEndAngle;
                if (row === 5) { // Letzte Reihe mit nur einem Feld (rechtsbündig)
                    fieldEndAngle = endAngle;
                    fieldStartAngle = fieldEndAngle - standardFieldAngle;
                } else {
                    fieldStartAngle = startAngle + i * standardFieldAngle;
                    fieldEndAngle = fieldStartAngle + standardFieldAngle;
                }

                fields.push(createFieldElement(dimension, fieldNumber, innerRadius, outerRadius, fieldStartAngle, fieldEndAngle, index));
                fieldCount++;
            }
        }
    }
    
    return fields.join('');
}

function createFieldElement(dimension, fieldNumber, innerRadius, outerRadius, startAngle, endAngle, dimensionIndex) {
    const fieldPath = createCurvedField(innerRadius, outerRadius, startAngle, endAngle, dimension.color);
    const centerAngle = (startAngle + endAngle) / 2;
    const centerRadius = (innerRadius + outerRadius) / 2;
    const textX = CENTER_X + (centerRadius * HORIZONTAL_SCALE) * Math.cos(centerAngle);
    const textY = CENTER_Y + centerRadius * Math.sin(centerAngle);

    return `
        <g class="field" data-state="0" data-dimension="${dimensionIndex}">
            <path d="${fieldPath}" fill="white" stroke="${dimension.color}" stroke-width="1" />
            <text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="central" 
                  fill="black" font-size="10">${fieldNumber}</text>
        </g>
    `;
}