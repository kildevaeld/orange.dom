import { isObject, slice } from 'orange';
import * as dom from './dom';

var singleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

function parseHTML(html: string): HTMLElement {
  let parsed = singleTag.exec(html);
  if (parsed) {
    return document.createElement(parsed[0]);
  }
  var div = document.createElement('div');
  div.innerHTML = html;
  var element = div.firstChild;
  return element as HTMLElement;
}



const domEvents: Map<Element, {event:string;callback:(e:Event) => void}[]> = new Map();

export class Html implements Iterable<Element> {

  static query(query: string | HTMLElement | NodeList, context?: string | HTMLElement | NodeList): Html {
    if (typeof context === 'string') {
      context = document.querySelectorAll(<string>context);
    }
    let html: Html;
    let els: HTMLElement[];
    if (typeof query === 'string') {

      if (query.length > 0 && query[0] === '<' && query[query.length - 1] === ">"
        && query.length >= 3) {
        return new Html([parseHTML(query)]);
      }


      if (context) {
        if (context instanceof HTMLElement) {
          els = slice(context.querySelectorAll(query));
        } else {
          html = new Html(slice(context));
          return html.find(query);
        }
      } else {
        els = slice(document.querySelectorAll(query));
      }
    } else if (query && query instanceof Element) {
      els = [query];
    } else if (query && query instanceof NodeList) {
      els = slice(query);
    }

    return new Html(els);
  }

  static removeAllEventListeners() {
    for (let el of domEvents.keys()) {
      let entries = domEvents.get(el);
      for (let entry of entries) {
        dom.removeEventListener(el, entry.event, entry.callback);
      }
      domEvents.delete(el);
    }
  }

  static _domEvents() {
    return domEvents;
  }

  private _elements: HTMLElement[];

  get length(): number {
    return this._elements.length;
  }

  constructor(el: HTMLElement[]) {
    if (!Array.isArray(el)) el = [<any>el]
    this._elements = el || [];
  }

  get(n: number): HTMLElement {
    n = (n === undefined || n < 0) ? 0 : n;
    return n >= this.length ? undefined : this._elements[n];
  }

  addClass(str: string): Html {
    return this.forEach((e) => {
      dom.addClass(e, str);
    });
  }

  removeClass(str: string): Html {
    return this.forEach((e) => {
      dom.removeClass(e, str);
    });
  }

  hasClass(str: string): boolean {
    return this._elements.reduce<boolean>((p, c) => {
      return dom.hasClass(c, str);
    }, false);
  }

  toggleClass(str: string): Html {
    this.forEach(m => {
      dom.toggleClass(m, str);
    });
    return this;
  }

  attr(key: string | Object, value?: any): any {
    let attr;
    if (typeof key === 'string' && value) {
      attr = { [key]: value };
    } else if (typeof key == 'string') {
      if (this.length) return this.get(0).getAttribute(<string>key);
    } else if (isObject(key)) {
      attr = key;
    }
    return this.forEach(e => {
      for (let k in attr) {
        e.setAttribute(k, attr[k]);
      }
    });
  }

  text(): string;
  text(str: string): Html;
  text(str?: string): any {
    if (arguments.length === 0) {
      return this.length > 0 ? this.get(0).textContent : null;
    }
    return this.forEach(e => e.textContent = str);
  }

  html(): string;
  html(html: string): Html;
  html(html?: any): any {
    if (arguments.length === 0) {
      return this.length > 0 ? this.get(0).innerHTML : null;
    }
    return this.forEach(e => e.innerHTML = html);
  }

  css(attr: string | any, value?: any) {
    if (arguments.length === 2) {
      return this.forEach(e => {
        if (attr in e.style) e.style[attr] = String(value);
      });
    } else {
      return this.forEach(e => {
        for (let k in attr) {

          if (k in e.style) e.style[k] = String(attr[k]);
        }
      });
    }
  }

  parent(): Html {
    var out = [];
    this.forEach(e => {
      if (e.parentElement) {
        out.push(e.parentElement);
      }
    })
    return new Html(out);
  }

  remove(): Html {
    return this.forEach(e => {
      if (e.parentElement) e.parentElement.removeChild(e);
    })
  }

  clone(): Html {
    return new Html(this.map(m => m.cloneNode() as HTMLElement))
  }

  find(str: string): Html {
    var out = [];
    this.forEach(e => {
      out = out.concat(slice(e.querySelectorAll(str)));
    });
    return new Html(out);
  }

  map<T>(fn: (elm: HTMLElement, index?: number) => T): T[] {
    let out: T[] = new Array(this.length)
    this.forEach((e, i) => {
      out[i] = fn(e, i);
    });
    return out;
  }

  forEach(fn: (elm: HTMLElement, index: number) => void): Html {
    this._elements.forEach(fn);
    return this;
  }

  on(name: string, callback: (e: Event) => void, useCap?: boolean) {
    return this.forEach(e => {
      let entries = domEvents.get(e);
      if (!entries) {
        entries = [];
        domEvents.set(e, entries);
      }
      dom.addEventListener(e, name, callback, useCap);
      entries.push({
        event: name,
        callback: callback
      });

    });
  }

  once(name:string, callback: (e: Event) => void, useCap?: boolean) {
    return this.on(name, (e) => {
      callback(e);
      setTimeout(() => this.off(name, callback));
    }, useCap);
  }

  off(name?: string, callback?: (e: Event) => void) {
    if (!name) {
      return this.forEach(el => {
        let entries = domEvents.get(el);
        if (entries) {
          entries.forEach(e => {
            dom.removeEventListener(el, e.event, e.callback);
          });
          domEvents.delete(el);
        }
      });
    }

    return this.forEach( el => {
      let entries = domEvents.get(el);
      if (!entries) return;
      entries.forEach( (entry, index) => {
        if (entry.event === name && (callback ? callback === entry.callback : true)) {
          domEvents.get(el).splice(index, 1);
        }
      });
      if (!domEvents.get(el).length) domEvents.delete(el); 
    });
  }

  animationEnd(callback:(e:AnimationEvent) => void, timeout?:number) {
    return this.forEach( el => {
      dom.animationEnd(el, callback, null, timeout);
    });
  }

  transitionEnd(callback:(e:TransitionEvent) => void, timeout?:number) {
    return this.forEach( el => {
      dom.transitionEnd(el, callback, null, timeout);
    });
  }

  // Iterator
  [Symbol.iterator]() {

    let pointer = 0;
    let components = this._elements;
    let len = components.length;
    return {

      next(): IteratorResult<Element> {
        let done = pointer >= len;
        return {
          done: done,
          value: done ? null : components[pointer++]
        }
      }

    }
  }
}

export function html(query: string | HTMLElement | NodeList, context?: string | HTMLElement | NodeList): Html {
  return Html.query(query, context);
}