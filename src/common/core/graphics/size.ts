export class Size {
    public static equals(s1: Size, s2: Size) {
        return s1.width === s2.width && s1.height === s2.height;
    }

    public width: number;
    public height: number;

    constructor(width?: number, height?: number) {
        this.width = width || 0;
        this.height = height || 0;
    }

    public clone() {
        return new Size(this.width, this.height);
    }
}
