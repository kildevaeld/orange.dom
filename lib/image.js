/*import {Promise, IPromise} from 'orange'
import {addEventListener, removeEventListener} from './dom';


class LoadedImage {
  private __resolved:boolean = false;
  isLoaded: boolean
  fn: (err: Error) => void



  constructor(private img: HTMLImageElement, private timeout = 200, private retries = 10) { }

  check(fn: (err: Error) => void) {
    this.fn = fn;
    var isComplete = this.getIsImageComplete();
    
    if (isComplete) {
      // report based on naturalWidth
      this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
      return;
    }
    var retries = this.retries;
    const retry = () => {
        setTimeout(() => {
            if (this.__resolved) return;
            if (this.img.naturalWidth > 0) {
                this.__resolved = true;
                return this.onload(null);
            } else if (retries > 0) {
                retries--;
                retry();
            }

        }, this.timeout);
    }

    retry();
    
    addEventListener(this.img, 'load', this);
    addEventListener(this.img, 'error', this);
    
  }

  confirm(loaded: boolean, msg:string, err?:Error) {
    this.__resolved = true;
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
    removeEventListener(this.img, 'load', this);
    removeEventListener(this.img, 'error', this);
    this.fn = void 0;
  }

}

export function imageLoaded(img:HTMLImageElement, timeout?:number, retries?:number): IPromise<boolean> {
    return new Promise<boolean>(function (resolve, reject) {
      let i = new LoadedImage(img, timeout, retries);
      i.check(function (err) {
        if (err) return reject(err);
        resolve(i.isLoaded);
      });
    });
  }*/
"use strict";