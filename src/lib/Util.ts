export function ConstructBitPattern(bits: boolean[]): number {
    let rv = 0;
    for (let i = bits.length - 1; i >= 0; i--) {
        rv = rv | (bits[i] ? 1 : 0);
        if (i > 0)
            rv = rv << 1;
    }
    return rv;
}

export function ConstructArrayPattern(value: number, length: number): boolean[] {
    let rv = [];
    for (let i = 0; i < length; i++) {
        rv.push((value & 1) ? true : false);
        value = value >> 1;
    }
    return rv;
}

export function SetBitRange(target: number, value: number, begin: number, end: number): number {
    let mask = (Math.pow(2, end-begin)-1) << begin;
    return (target & ~mask) | (value << begin);
}

export function GetBitRange(target: number, begin: number, end: number): number {
    return (target & ((Math.pow(2, end - begin)-1) << begin)) >> begin;
}