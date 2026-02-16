import { nameof, Is, Otis } from 'https://boughpohpue.github.io/just.js/compiled/just.js-1.0.1.js';

export class Interceptor {
  static #open;
  static #send;
  static #sendHandler;

  static get isInitiated() {
    return !!Interceptor.#open && !!Interceptor.#send;
  }

  static get hasHandler() {
    return typeof Interceptor.#sendHandler === "function";
  }

  static init(sendHandler = null) {
    try {
      if (Interceptor.isInitiated) {
        throw new Error("Already initiated!");
      }

      if (Is.thisFunction(sendHandler)) {
        Interceptor.#sendHandler = sendHandler;
      }

      Interceptor.#open = XMLHttpRequest.prototype.open;
      Interceptor.#send = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = Interceptor.#interceptorOpen;
      XMLHttpRequest.prototype.send = Interceptor.#interceptorSend;

      Otis.log("Init complete.", `${Interceptor.name}.${nameof(Interceptor.init)}`);
      return true;
    } catch (e) {
      Otis.log(e, `${Interceptor.name}.${nameof(Interceptor.init)}`);
      return false;
    }
  }

  static applyHandler(sendHandler) {
    try {
      if (Interceptor.hasHandler) {
        throw new Error("Already handled!");
      }
      if (!Is.thisFunction(sendHandler)) {
        throw new Error("Handler must be a function!");
      }

      Interceptor.#sendHandler = sendHandler;
      Otis.log("Handler applied.", `${Interceptor.name}.${nameof(Interceptor.applyHandler)}`);
      return true;
    } catch (e) {
      Otis.log(e, `${Interceptor.name}.${nameof(Interceptor.applyHandler)}`);
      return false;
    }
  }

  static #interceptorOpen(method, url, ...rest) {
    this._url = url;
    this._method = method;
    return Interceptor.#open.call(this, method, url, ...rest);
  }

  static #interceptorSend(...args) {
    this.addEventListener(
      "load",
      function () {
        try {
          let content = this.responseText;
          const contentType = this.getResponseHeader("content-type") ?? "N/A";

          if (contentType === "N/A") {
            const acam = this.getResponseHeader("access-control-allow-methods");
            if (acam) content = acam;
          }

          if (Interceptor.hasHandler) {
            Interceptor.#sendHandler(this._url, this._method, contentType, content);
          }
        } catch (e) {
          Otis.log(e, `${Interceptor.name}.${nameof(Interceptor.#interceptorSend)}`);
        }
      },
      { once: true } // prevents listener accumulation
    );

    return Interceptor.#send.apply(this, args);
  }
}

export default Interceptor;
