import { nameof, Is, Otis } from 'https://boughpohpue.github.io/just.js/compiled/just.js-1.0.1.js';
import Interceptor from './interceptor.js';

export class RequestHandler {
  static #customHandler;
  static #initialized = false;

  static get isInitialized() {
    return RequestHandler.#initialized;
  }

  static get hasHandler() {
    return typeof RequestHandler.#customHandler === "function";
  }

  static init(customHandler = null) {
    try {
      if (RequestHandler.isInitialized) {
        throw new Error("Already initialized!");
      }

      if (Is.thisFunction(customHandler)) {
        RequestHandler.#customHandler = customHandler;
      }

      RequestHandler.#initialized = Interceptor.init(RequestHandler.#handle);
      Otis.log("Init complete.", `${RequestHandler.name}.${nameof(RequestHandler.init)}`);
      return RequestHandler.#initialized;
    } catch (e) {
      Otis.log(e, `${RequestHandler.name}.${nameof(RequestHandler.init)}`);
      return false;
    }
  }

  static applyHandler(customHandler) {
    try {
      if (RequestHandler.hasHandler) {
        throw new Error("Already handled!");
      }
      if (!Is.thisFunction(customHandler)) {
        throw new Error("Handler must be a function!");
      }

      RequestHandler.#customHandler = customHandler;
      Otis.log("Handler applied.", `${RequestHandler.name}.${nameof(RequestHandler.applyHandler)}`);
      return true;
    } catch (e) {
      Otis.log(e, `${RequestHandler.name}.${nameof(RequestHandler.applyHandler)}`);
      return false;
    }
  }

  static #handle(url, method, contentType, content) {
    if (RequestHandler.hasHandler) {
      RequestHandler.#customHandler(url, method, contentType, content);
    }
  }
}

export default RequestHandler;
