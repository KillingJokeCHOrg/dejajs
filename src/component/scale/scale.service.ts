import { Injectable } from '@angular/core';

@Injectable()
export class ScaleService {

    /**
     * Return value of selected step in scale. It can be a main scale step or a zoomable scale step.
     * @param $event
     * @returns {string}
     */
    public getStepValueByEvent($event): string {
        let target: HTMLElement = $event.target;
        let svg: HTMLElement = target.parentElement;
        if ((target.tagName === 'rect' || target.tagName === 'text') && svg) {
            return svg.getAttribute("data-value");
        } else {
            return target.getAttribute("data-value");
        }
    }

    /**
     * Return main scale step HTMLElement by child contained in this step.
     * @param node
     * @returns {any}
     */
    public getScaleStepByChild(node: HTMLElement): HTMLElement {
        if (!node || node.nodeName === "DIV") {
            return null;
        }

        let svg: HTMLElement = node.parentElement;
        if ((node.tagName === 'rect' || node.tagName === 'text') && svg && svg.classList.contains("scale-step")) {
            return svg;
        } else if (node.classList.contains("scale-step")) {
            return node;
        } else {
            return this.getScaleStepByChild(svg);
        }
    }
}
