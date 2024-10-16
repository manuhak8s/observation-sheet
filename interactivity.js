import { dimensions } from './dimensions.js';

export function addFieldClickListeners() {
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