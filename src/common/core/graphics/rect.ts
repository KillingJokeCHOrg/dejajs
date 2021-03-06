import { Position } from './position';

export enum RectOverlapDirection {
    horizontal,
    vertical,
}

export interface IRectOverlapInfos {
    area: number;
    width: number;
    height: number;
    direction: RectOverlapDirection;
}

export class Rect {
    public static equals(r1: Rect, r2: Rect) {
        return r1 && r2 && r1.left === r2.left && r1.top === r2.top && r1.width === r2.width && r1.height === r2.height;
    }

    public static union(r1: Rect, r2: Rect) {
        return Rect.fromLTRB(Math.min(r1.left, r2.left), Math.min(r1.top, r2.top), Math.max(r1.right(), r2.right()), Math.max(r1.bottom(), r2.bottom()));
    }

    public static overlapInfos(rect1: Rect, rect2: Rect): IRectOverlapInfos {
        let x = Math.max(0, Math.min(rect1.right(), rect2.right()) - Math.max(rect1.left, rect2.left));
        let y = Math.max(0, Math.min(rect1.bottom(), rect2.bottom()) - Math.max(rect1.top, rect2.top));
        return {
            area: x * y,
            width: x,
            height: y,
            direction: x > y ? RectOverlapDirection.horizontal : RectOverlapDirection.vertical,
        };
    }

    public static fromLTRB(left: number, top: number, right: number, bottom: number): Rect {
        return new Rect(left, top, right - left, bottom - top);
    }

    public static fromPoints(p1: Position, p2: Position) {
        return Rect.fromLTRB(Math.min(p1.left, p2.left), Math.min(p1.top, p2.top), Math.max(p1.left, p2.left), Math.max(p1.top, p2.top));
    }

    public left: number;
    public top: number;
    public width: number;
    public height: number;

    constructor(left?: number | Object, top?: number, width?: number, height?: number) {
        if (typeof left === 'object') {
            let bounds = left as any;
            this.left = bounds.left || 0;
            this.top = bounds.top || 0;
            this.width = bounds.width || 0;
            this.height = bounds.height || 0;
        } else {
            this.left = left || 0;
            this.top = top || 0;
            this.width = width || 0;
            this.height = height || 0;
        }
    }

    public right() {
        return this.left + this.width;
    }

    public bottom() {
        return this.top + this.height;
    }

    public offset(x: number, y: number): Rect {
        return new Rect(
            this.left + x,
            this.top + y,
            this.width,
            this.height,
        );
    }

    public adjacent(bounds: Rect) {
        return bounds.left <= this.right() &&
            bounds.right() >= this.left &&
            bounds.top <= this.bottom() &&
            bounds.bottom() >= this.top;
    }
    
    public contains(bounds: Rect) {
        return bounds.left >= this.left && bounds.right() <= this.right() && bounds.top >= this.top && bounds.bottom() <= this.bottom();
    }

    public containsPoint(point: Position) {
        return point.left >= this.left && point.left <= this.right() && point.top >= this.top && point.top <= this.bottom();
    }

    public intersectWith(bounds: Rect) {
        return bounds.left < this.right() &&
            bounds.right() > this.left &&
            bounds.top < this.bottom() &&
            bounds.bottom() > this.top;
    }

    public clone() {
        return new Rect(this.left, this.top, this.width, this.height);
    }
}
