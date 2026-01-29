export class RequestMethod {
  static GET = new RequestMethod();
  static PUT = new RequestMethod();
  static HEAD = new RequestMethod();
  static POST = new RequestMethod();
  static PATCH = new RequestMethod();
  static DELETE = new RequestMethod();
  static OPTIONS = new RequestMethod();

  #name;

  get name() {
    if (!this.#name) {
      for (const [key, value] of Object.entries(RequestMethod)) {
        if (value === this) {
          this.#name = key.toUpperCase();
          break;
        }
      }
    }
    return this.#name;
  }

  isMatching(method) {
    return typeof method === "string" && method.toUpperCase() === this.name;
  }

  static get all() {
    return Object.values(RequestMethod).filter(v => v instanceof RequestMethod);
  }

  static match(method) {
    return RequestMethod.all.find(m => m.isMatching(method));
  }

  static ensure(method) {
    if (method instanceof RequestMethod) return method;
    if (typeof method === "string") return RequestMethod.match(method);
    return undefined;
  }
}

export default RequestMethod;
