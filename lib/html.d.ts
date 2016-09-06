export declare class Html {
    static query(query: string | HTMLElement | NodeList, context?: string | HTMLElement | NodeList): Html;
    private _elements;
    length: number;
    constructor(el: HTMLElement[]);
    get(n: number): HTMLElement;
    addClass(str: string): Html;
    removeClass(str: string): Html;
    hasClass(str: string): boolean;
    attr(key: string | Object, value?: any): any;
    text(str: string): any;
    html(html: string): any;
    css(attr: string | any, value?: any): Html;
    parent(): Html;
    remove(): Html;
    clone(): Html;
    find(str: string): Html;
    map<T>(fn: (elm: HTMLElement, index?: number) => T): T[];
    forEach(fn: (elm: HTMLElement, index: number) => void): Html;
}
