import { DecimalPipe } from '@angular/common';
import { Inject, LOCALE_ID } from '@angular/core';
import { IRange } from '../../component/range/range.interface';

/**
 * IWeight interface
 * 
 * @export
 * @interface IWeight
 * @extends {IRange}
 */
export interface IWeight extends IRange {
    minWeight: number;
    maxWeight: number;
}

/**
 * Transform function, used to interpolate
 * 
 * @export
 * @param {number} x
 * @returns
 */
export function interpolate(x: number) {
    return Math.log10(x);
}

/**
 * Transform function, used to de-interpolate
 * 
 * @export
 * @param {number} x
 * @returns
 */
export function deinterpolate(x: number) {
    return 10 ** x;
}

const decimalPipe = new DecimalPipe(Inject(LOCALE_ID));

/**
 * IWeight class implementation
 * An example of non linear interpolation using logarithm
 * 
 * @export
 * @class Weight
 * @implements {IWeight}
 */
export class Weight implements IWeight {
    public min: number;
    public max: number;
    public $width: number;
    constructor(public minWeight: number, public maxWeight: number) { }
}
