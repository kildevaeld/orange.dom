export declare class Html implements Iterable<Element> {
    static query(query: string | HTMLElement | NodeList, context?: string | HTMLElement | NodeList): Html;
    static removeAllEventListeners(): void;
    static _domEvents(): Map<Element, {
        event: string;
        callback: (e: Event) => void;
    }[]>;
    private _elements;
    readonly length: number;
    constructor(el: HTMLElement[]);
    get(n: number): HTMLElement;
    addClass(str: string): Html;
    removeClass(str: string): Html;
    hasClass(str: string): boolean;
    toggleClass(str: string): Html;
    attr(key: string | Object, value?: any): any;
    text(): string;
    text(str: string): Html;
    html(): string;
    html(html: string): Html;
    css(attr: string | any, value?: any): Html;
    parent(): Html;
    remove(): Html;
    clone(): Html;
    find(str: string): Html;
    map<T>(fn: (elm: HTMLElement, index?: number) => T): T[];
    forEach(fn: (elm: HTMLElement, index: number) => void): Html;
    on(name: string, callback: (e: Event) => void, useCap?: boolean): Html;
    once(name: string, callback: (e: Event) => void, useCap?: boolean): Html;
    off(name?: string, callback?: (e: Event) => void): Html;
    animationEnd(callback: (e: AnimationEvent) => void, timeout?: number): Html;
    transitionEnd(callback: (e: TransitionEvent) => void, timeout?: number): Html;
    [Symbol.iterator](): {
        next(): IteratorResult<Element>;
    };
}
export declare function html(query: string | HTMLElement | NodeList, context?: string | HTMLElement | NodeList): Html;
