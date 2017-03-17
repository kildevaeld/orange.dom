
export function unique<T>(array: T[]): T[] {
    let seen = new Map<T, boolean>();
    return array.filter(function (e, i) {
        if (seen.has(e)) return false;
        seen.set(e, true);
        return true;
    })
}

export function indexOf(array, item): number {
    for (var i = 0, len = array.length; i < len; i++) if (array[i] === item) return i;
    return -1;
}

export function isObject(obj: any): obj is Object {
    return obj === Object(obj);
}

const _slice = Array.prototype.slice;
export function slice(array: any, begin?: number, end?: number): any {
    return _slice.call(array, begin, end);
}