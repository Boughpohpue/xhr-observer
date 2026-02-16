import { Matcher } from 'https://boughpohpue.github.io/just.js/compiled/just.js-1.0.1.js';

export class ObservableRequest {
  static PostRequest1 = new ObservableRequest("*/v1/endpoint/post1", RequestMethod.POST);
  static PostRequest2 = new ObservableRequest("*/v1/endpoint/post2", RequestMethod.POST);
  static GetRequest1 = new ObservableRequest("*/v1/endpoint?get1", RequestMethod.GET);
  static GetRequest2 = new ObservableRequest("*/v1/endpoint?get2", RequestMethod.GET);
  static DeleteRequest = new ObservableRequest("*/v1/endpoint/*", RequestMethod.DELETE);

  #pattern;
  #method;
  #name;

  static get all() {
    return Object.values(ObservableRequest).filter(v => v instanceof ObservableRequest);
  }

  constructor(pattern, method) {
    if (!pattern) throw new Error("Invalid pattern value!");

    const ensuredMethod = RequestMethod.ensure(method);
    if (!ensuredMethod) throw new Error("Invalid method value!");

    this.#pattern = pattern;
    this.#method = ensuredMethod;
  }

  get name() {
    if (!this.#name) {
      for (const [key, value] of Object.entries(ObservableRequest)) {
        if (value === this) {
          this.#name = key;
          break;
        }
      }
    }
    return this.#name;
  }

  get pattern() {
    return this.#pattern;
  }

  get method() {
    return this.#method;
  }

  isMatching(url, method) {
    const ensuredMethod = RequestMethod.ensure(method);
    return ensuredMethod === this.#method && Matcher.match(this.#pattern, url);
  }

  static match(url, method) {
    if (!url) return undefined;
    return ObservableRequest.all.find(r => r.isMatching(url, method));
  }
}

export default ObservableRequest;
