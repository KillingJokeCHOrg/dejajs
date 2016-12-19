export enum Directions {
    none = 0x0,
    left = 0x1,
    right = 0x2,
    top = 0x4,
    bottom = 0x8,
    horizontal = left + right,
    vertical = top + bottom,
    all = left + top + right + bottom,
}
