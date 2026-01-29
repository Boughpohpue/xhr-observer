/* ================================================================================== */
/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>        JUST.JS       <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
/* ================================================================================== */

/* >>>---> nameof.js >--------------------------------------------------------------> */
/* Just a nameof */
export class Name {
  static of(o) {
    if (o == undefined || o == null) {
      return o;
    }
    let name = undefined;
    try {
      if (typeof o === "object") {
        name = o.name;
        if (name === undefined) {
          for (let prop in o) {
            if (o.hasOwnProperty(prop)) {
              name = prop;
              break;
            }
          }
        }
        if (name === undefined) {
          name = o.constructor.name;
        }
      } else if (typeof o === "function") {
        let body = o.toString();
        let head = body.substr(0, Math.min(body.indexOf("("), body.indexOf("{"))).trim();
        let parts = head.split(" ");
        name = parts[parts.length - 1];
      }
    } catch (e) {}

    return name;
  }
}
export function nameof(o) {
  return Name.of(o);
}
/* <--------------------------------------------------------------< nameof.js <---<<< */

/* >>>---> isthis.js >--------------------------------------------------------------> */
/* Just is this */
export class Is {
  static thisTrue(q) {
    return q === true;
  }
  static thisFalse(q) {
    return q === false;
  }
  static thisNull(q) {
    return q === null;
  }
  static thisUndefined(q) {
    return typeof q === "undefined";
  }
  static thisBoolean(q) {
    return typeof q === "boolean";
  }
  static thisNumber(q) {
    return typeof q === "number";
  }
  static thisBigInt(q) {
    return typeof q === "bigint";
  }
  static thisString(q) {
    return typeof q === "string";
  }
  static thisSymbol(q) {
    return typeof q === "symbol";
  }
  static thisObject(q) {
    return typeof q === "object";
  }
  static thisFunction(q) {
    return typeof q === "function";
  }
  static thisNothing(q) {
    return Is.thisNull(q) || Is.thisUndefined(q);
  }
  static thisSomething(q) {
    return !Is.thisNothing(q);
  }
  static thisAnything(q) {
    return !Is.thisNothing(q);
  }
  static thisDefined(q) {
    return !Is.thisUndefined(q);
  }
  static thisArray(q) {
    return Array.isArray(q);
  }
  static thisEmpty(q) {
    return Is.thisNothing(q) || ((Is.thisString(q) || Is.thisArray(q)) && q.length == 0);
  }
  static thisEmptyArray(q) {
    return Is.thisArray(q) && q.length == 0;
  }
  static thisClass(q) {
    return Is.thisFunction(q) && q.toString().startsWith("class ");
  }
  static thisGetter(q, propertyName) {
    try {
      return !!Object.getOwnPropertyDescriptor(q, propertyName)["get"];
    } catch (e) {
      return false;
    }
  }
  static thisSetter(q, propertyName) {
    try {
      return !!Object.getOwnPropertyDescriptor(q, propertyName)["set"];
    } catch (e) {
      return false;
    }
  }
}
/* <--------------------------------------------------------------< isthis.js <---<<< */

/* >>>---> gimme.js >---------------------------------------------------------------> */
/* Just a getter */
export class Gimme {
  static get currentTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  static get currentDate() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = String(now.getFullYear());
    return `${dd}.${mm}.${yyyy}`;
  }
  static get currentDateTime() {
    return `${Gimme.currentDate()} ${Gimme.currentTime()}`;
  }
  static get randomUuid() {
    var s = new Array(36);
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  }
}
/* <---------------------------------------------------------------< gimme.js <---<<< */

/* >>>---> bitwiser.js >------------------------------------------------------------> */
/* Just a bit wiser */
export class Bitwiser {
  static contains(current, expected) {
    return (current & expected) > 0;
  }
  static merge(values) {
    if (!Is.thisArray(values)) {
      return null;
    }
    let val = undefined;
    for (let v of values) {
      if (!Is.thisBigInt(v)) {
        continue;
      }
      if (Is.thisUndefined(val)) {
        val = v;
      } else {
        val = val | v;
      }
    }
    return val;
  }
  static extract(value) {
    if (!Is.thisBigInt(value)) {
      return null;
    }
    let items = [];
    let current = value;
    while (current > 0) {
      if (value != current && (value & current) > 0) {
        items.push(current);
      }
      current = 1n >> current;
    }
    return items;
  }
  static extractFrom(val, values) {
    if (!Is.thisBigInt(val)) {
      return null;
    }
    if (!Is.thisArray(values)) {
      return null;
    }
    if (values.some((b) => !Is.thisBigInt(b))) {
      return null;
    }
    return values.filter((b) => val > b && (val & b) > 0);
  }
}
/* <------------------------------------------------------------< bitwiser.js <---<<< */

/* >>>---> matcher.js >-------------------------------------------------------------> */
/* Prerequisites */
import extendObjectPrototype from './jxtensions-1.0.1.js';
extendObjectPrototype();
/* Just a bit wild */
export class Wild {
  static Surely = "+";
  static Perhaps = "?";
  static Whatever = "*";
}
/* Just a matcher */
export class Matcher {
  static get #tagRex() {
    return /\[%\s*([A-Za-z_$][\w.$]*)\s*%\]/g;
  }
  static isMatching(text, expr) {
    if (!Is.thisString(text) || !Is.thisString(expr)) return false;
    if (text === expr) return true;

    const parts = expr.split(Wild.Whatever);
    const start = parts.first;
    const end = parts.last;

    return text.startsWith(start) && text.endsWith(end) && parts.filter((p) => !text.includes(p)).length == 0;
  }
  static entag(toTag) {
    if (this.tagged(toTag)) {
      return toTag;
    }
    return Is.thisNothing(toTag) ? toTag : `[%${toTag}%]`;
  }
  static tagged(text) {
    return text != text.replace(this.#tagRex, "");
  }
  static detag(text, source) {
    if (Is.thisNothing(source) || !Is.thisString(text) || !this.tagged(text)) {
      return text;
    }
    return text.replace(this.#tagRex, (m, p) => {
      const val = source.resolveProperty(p);
      return val != null ? String(val) : m;
    });
  }
}
/* <-------------------------------------------------------------< matcher.js <---<<< */

export default nameof;

/* ================================================================================== */
/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   END OF: JUST.JS    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
/* ================================================================================== */
