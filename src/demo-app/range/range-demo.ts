import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IRange, IRangeEvent, IStepRangeEvent, Range } from '../../component/range/range.interface';
import { ranges, rangesWithInterval, readOnlyRanges, steps, weights } from './ranges.mock';
import { IWeight, Weight } from './weight.interface';

@Component({
    selector: 'deja-range-demo',
    styleUrls: ['./range-demo.scss'],
    templateUrl: './range-demo.html',
})
export class DejaRangeDemo {
    public readOnlyRanges: Range[];
    public rangesWithInterval: Range[];
    public steps: number[];
    public ranges: Range[];
    public numericStep: number = 1;
    public weights: Weight[];

    public errors: Observable<any>;
    @Output() protected errorFeed: EventEmitter<any> = new EventEmitter();

    @ViewChild('dejaRange') protected rangeRef;
    @ViewChild('dejaWeight') protected weightRef;

    constructor() {
        this.readOnlyRanges = readOnlyRanges;
        this.rangesWithInterval = rangesWithInterval;
        this.ranges = ranges;

        this.weights = weights;
        this.steps = steps;

        this.computeRangeFromWeight();

        // error management
        this.errors = Observable
            .from(this.errorFeed)
            .map((error: Error) => ({
                gate: true,
                message: error.message,
            }))
            .scan((acc, curr) => [...acc, curr], [])
            .defaultIfEmpty([]);
    }

    /**
     * compute next step for the weights (rounded to one)
     * 
     * @protected
     * @param {IStepRangeEvent} event
     * @returns
     * 
     * @memberOf DejaRangeDemo
     */
    protected stepFn(event: IStepRangeEvent, step: number) {

        const weight = event.ranges[event.index] as IWeight;

        const isLastWeight = event.ranges.length - 1 === event.index;

        const rangeDifference = event.newMax - weight.min;
        const weightDifference = Math.E ** (rangeDifference) / 4;
        let maxWeight = weight.minWeight + weightDifference;

        maxWeight = Math.round(maxWeight);
        maxWeight = Math.max(maxWeight, weight.minWeight + 1);

        if (!isLastWeight) {
            const nextWeight = event.ranges[event.index + 1] as IWeight;
            maxWeight = Math.min(maxWeight, nextWeight.maxWeight - 1);
            nextWeight.minWeight = maxWeight;
            weight.maxWeight = maxWeight;
        }

        const newRangeMax = weight.min + Math.log(4 * (maxWeight - weight.minWeight));

        return newRangeMax;
    }

    /**
     * compute range min and max from weight value
     * 
     * @private
     * 
     * @memberOf DejaRangeDemo
     */
    private computeRangeFromWeight() {
        let min = 0;

        this.weights = this.weights
            .map((weight: Weight) => {
                const weightDifference = weight.maxWeight - weight.minWeight;
                const rangeDifference = Math.log(4 * weightDifference);

                weight.min = min;
                weight.max = min + rangeDifference;

                min += rangeDifference;

                return weight;
            });
    }

    private remove(index: number) {
        if (weights.length >= 2) {

            const weight = this.weights
                .find((w: Weight, i: number) => index === i);

            const weights = this.weights
                .filter((w: Weight, i: number) => index !== i);

            if (index > 0) {
                weights[index - 1].maxWeight = weight.maxWeight;
            }

            this.weights = weights;

            this.weightRef.selected = 0;
            this.computeRangeFromWeight();
        }
    }

    private add(index: number) {
        const weight = this.weights
            .find((w: Weight, i: number) => index === i);

        const weightDifference = weight.maxWeight - weight.minWeight;
        if (weightDifference >= 2) {

            const leftWeight = new Weight(weight.minWeight, weight.minWeight + weightDifference / 2);

            weight.minWeight = weight.minWeight + weightDifference / 2;
            const leftWeights = index !== 0 ? this.weights.slice(0, index) : [];
            const rightWeights = index < this.weights.length ? this.weights.slice(index + 1) : [];
            this.weights = [...leftWeights, leftWeight, weight, ...rightWeights];

            this.weightRef.selected = 0;
            this.computeRangeFromWeight();
        }
    }

    /**
     * increase the maximum of the biggest weight
     * 
     * @private
     * 
     * @memberOf DejaRangeDemo
     */
    private increase(): void {
        this.weights[this.weights.length - 1].maxWeight++;
        this.computeRangeFromWeight();
    }

    /**
     * decrease the minimum of the smallest weight
     * 
     * @private
     * 
     * @memberOf DejaRangeDemo
     */
    private decrease(): void {
        if (this.weights[0].minWeight > 0) {
            this.weights[0].minWeight--;
            this.computeRangeFromWeight();
        }
    }
}
