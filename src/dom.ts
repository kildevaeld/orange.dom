// TODO: CreateHTML
import {indexOf, unique, slice, isObject, Promise, IPromise} from 'orange'

var ElementProto: any = (typeof Element !== 'undefined' && Element.prototype) || {};

var matchesSelector = ElementProto.matches ||
  ElementProto.webkitMatchesSelector ||
  ElementProto.mozMatchesSelector ||
  ElementProto.msMatchesSelector ||
  ElementProto.oMatchesSelector || function (selector) {
    var nodeList = (this.parentNode || document).querySelectorAll(selector) || [];
    return !!~indexOf(nodeList, this);
  }

var elementAddEventListener = ElementProto.addEventListener || function (eventName, listener) {
  return this.attachEvent('on' + eventName, listener);
}
var elementRemoveEventListener = ElementProto.removeEventListener || function (eventName, listener) {
  return this.detachEvent('on' + eventName, listener);
}

const transitionEndEvent = (function transitionEnd() {
  var el = document.createElement('bootstrap')

  var transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd otransitionend',
    'transition': 'transitionend'
  }

  for (var name in transEndEventNames) {
    if (el.style[name] !== undefined) {
      return transEndEventNames[name]
    }
  }

  return null
});

const animationEndEvent = (function animationEnd() {
  var el = document.createElement('bootstrap')

  var transEndEventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'MozAnimation': 'animationend',
    'OAnimation': 'oAnimationEnd oanimationend',
    'animation': 'animationend'
  }

  for (var name in transEndEventNames) {
    if (el.style[name] !== undefined) {
      return transEndEventNames[name]
    }
  }

  return null
});


export function matches(elm, selector): boolean {
  return matchesSelector.call(elm, selector)
}

export function addEventListener(elm: Element, eventName: string, listener, useCap: boolean = false) {
  elementAddEventListener.call(elm, eventName, listener, useCap)
}

export function removeEventListener(elm: Element, eventName: string, listener) {
  elementRemoveEventListener.call(elm, eventName, listener)
}

const unbubblebles = 'focus blur change load error'.split(' ');
let domEvents = [];

export function delegate(elm: HTMLElement | string, selector: string, eventName: string, callback, ctx?): Function {
  let root = elm
  let handler = function (e) {
    let node = e.target || e.srcElement;

    // Already handled
    if (e.delegateTarget) return;

    for (; node && node != root; node = node.parentNode) {
      if (matches(node, selector)) {

        e.delegateTarget = node;
        callback(e);
      }
    }
  }

  let useCap = !!~unbubblebles.indexOf(eventName)
  addEventListener(<HTMLElement>elm, eventName, handler, useCap);
  domEvents.push({ eventName: eventName, handler: handler, listener: callback, selector: selector });
  return handler;
}

export function undelegate(elm: HTMLElement | string, selector: string, eventName: string, callback) {
  /*if (typeof selector === 'function') {
      listener = <Function>selector;
      selector = null;
    }*/

  var handlers = domEvents.slice();
  for (var i = 0, len = handlers.length; i < len; i++) {
    var item = handlers[i];

    var match = item.eventName === eventName &&
      (callback ? item.listener === callback : true) &&
      (selector ? item.selector === selector : true);

    if (!match) continue;

    removeEventListener(<HTMLElement>elm, item.eventName, item.handler);
    domEvents.splice(indexOf(handlers, item), 1);
  }
}


export function addClass(elm: HTMLElement, className: string) {
  if (elm.classList) {
    let split = className.split(' ');
    for (let i = 0, ii = split.length; i < ii; i++) {
      if (elm.classList.contains(split[i].trim())) continue;
      elm.classList.add(split[i].trim());
    }
  } else {
    elm.className = unique(elm.className.split(' ').concat(className.split(' '))).join(' ')
  }
}
export function removeClass(elm: HTMLElement, className: string) {
  if (elm.classList) {
    let split = className.split(' ');
    for (let i = 0, ii = split.length; i < ii; i++) {
      elm.classList.remove(split[i].trim());
    }
  } else {
    let split = elm.className.split(' '),
      classNames = className.split(' '),
      tmp = split, index

    for (let i = 0, ii = classNames.length; i < ii; i++) {
      index = split.indexOf(classNames[i])
      if (!!~index) split = split.splice(index, 1)
    }
  }
}

export function hasClass(elm: HTMLElement, className: string) {
  if (elm.classList) {
    return elm.classList.contains(className);
  }
  var reg = new RegExp('\b' + className)
  return reg.test(elm.className)
}

export function selectionStart(elm: HTMLInputElement): number {
  if ('selectionStart' in elm) {
    // Standard-compliant browsers
    return elm.selectionStart;
  } else if ((<any>document).selection) {
    // IE
    elm.focus();
    var sel = (<any>document).selection.createRange();
    var selLen = (<any>document).selection.createRange().text.length;
    sel.moveStart('character', -elm.value.length);
    return sel.text.length - selLen;
  }
}

var _events = {
  animationEnd: null,
  transitionEnd: null
};

export function transitionEnd(elm: Element, fn: (event: TransitionEvent) => void, ctx?: any, duration?: number) {
  var event = _events.transitionEnd || (_events.transitionEnd = transitionEndEvent());
  var callback = function (e) {
    removeEventListener(elm, event, callback);
    fn.call(ctx, e);
  };
  addEventListener(elm, event, callback);
}

export function animationEnd(elm: Element, fn: (event: AnimationEvent) => void, ctx?: any, duration?: number) {
  var event = _events.animationEnd || (_events.animationEnd = animationEndEvent());
  var callback = function (e) {
    removeEventListener(elm, event, callback);
    fn.call(ctx, e);
  };
  addEventListener(elm, event, callback);
}

export const domReady = (function () {
  var fns = [], listener
    , doc = document
    , hack = (<any>doc.documentElement).doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded: boolean = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded) {
    doc.addEventListener(domContentLoaded, listener = function () {
      doc.removeEventListener(domContentLoaded, listener)
      loaded = true

      while (listener = fns.shift()) listener()
    })
  }

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }
})();


export function createElement<T extends HTMLElement>(tag: string, attr): T {
  let elm = <T>document.createElement(tag);
  if (attr) {
    for (let key in attr) {
      elm.setAttribute(key, attr[key]);
    }
  }
  return elm;
}

class LoadedImage {
  pImage: HTMLImageElement;
  isLoaded: boolean
  fn: (err: Error) => void

  constructor(private img: HTMLImageElement) { }

  check(fn: (err: Error) => void) {
    this.fn = fn;
    var isComplete = this.getIsImageComplete();
    
    if (isComplete) {
      // report based on naturalWidth
      this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
      return;
    }
    
    this.img.addEventListener('load', this);
    this.img.addEventListener('error', this);
    
  }

  confirm(loaded: boolean, msg:string, err?:Error) {
    this.isLoaded = loaded;
    if (this.fn) this.fn(err);
  }


  getIsImageComplete() {
    return this.img.complete && this.img.naturalWidth !== undefined && this.img.naturalWidth !== 0;
  }

  handleEvent(e: Event) {
    var method = 'on' + event.type;
    if (this[method]) {
      this[method](event);
    }
  }
  
  onload(e:Event) {
    this.confirm(true, 'onload');
    this.unbindEvents();
  }

  onerror(e:ErrorEvent) {
    this.confirm(false, 'onerror', new Error(e.error));
    this.unbindEvents()
  }

  unbindEvents() {
    this.img.removeEventListener('load', this);
    this.img.removeEventListener('error', this);
    this.fn = void 0;
  }

}

export function imageLoaded(img:HTMLImageElement): IPromise<boolean> {
    return new Promise<boolean>(function (resolve, reject) {
      let i = new LoadedImage(img);
      i.check(function (err) {
        if (err) return reject(err);
        resolve(i.isLoaded);
      });
    });
  }