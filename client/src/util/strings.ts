import escapeRegExp from "lodash/escapeRegExp";
import has from "lodash/has";
import isNumber from "lodash/isNumber";
import isObject from "lodash/isObject";
import map from "lodash/map";
import startCase from "lodash/startCase";
import { log } from './logging-config';
import { UserData } from '../models/user-models';

export function replaceAll(find: any, replace: any, str: any): string | number {
  let replacedValue;
  let initialValue = "" + str;
  while (true) {
    replacedValue = initialValue.replace(new RegExp(escapeRegExp("" + find), "g"), replace);
    if (replacedValue !== initialValue) {
      initialValue = replacedValue;
    } else {
      break;
    }
  }
  return isNumber(str) ? +replacedValue : replacedValue;
}

export function stringify(message): string {
  let returnValue;
  if (message instanceof TypeError) {
    returnValue = message.toString();
  } else if (has(message, ["error", "message"])) {
    returnValue = message.error.message + (message.error.error ? " - " + message.error.error : "");
  } else if (has(message, ["error", "errmsg"])) {
    returnValue = message.error.errmsg + (message.error.error ? " - " + message.error.error : "");
  } else if (isObject(message)) {
    returnValue = stringifyObject(message);
  } else {
    returnValue = message;
  }

  log.debug("stringify:message", message, "message:", message, "returnValue:", returnValue);
  return returnValue;
}


export function stringifyObject(inputValue, defaultValue?: string): string {
  if (typeof inputValue === "object") {
    return map(inputValue, (value, key) => {
      if (isObject(value)) {
        return `${startCase(key)} -> ${stringifyObject(value, defaultValue)}`;
      } else {
        return `${startCase(key)}: ${value || defaultValue || "(none)"}`;
      }
    }).join(", ");
  } else {
    return inputValue || defaultValue || "(none)";
  }
}

export function stripLineBreaks(str, andTrim: boolean) {
  const replacedValue = str.replace(/(\r\n|\n|\r)/gm, "");
  return andTrim && replacedValue ? replacedValue.trim() : replacedValue;
}

export function left(str, chars) {
  return str.substr(0, chars);
}

export function pluraliseWithCount(count: number, text: string) {
  return `${count} ${count === 1 ? text : text + "s"}`;
}

export function fullTextSearch<T>(itemsToSearch: T[], searchText: string): T[] {
  if (!itemsToSearch) {
    return [];
  }

  if (!searchText) {
    return itemsToSearch;
  }

  return itemsToSearch.filter(item => JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase()));
}

export function initialsForFullName(fullName = ""): string {
  return fullName
      .replace(/\s+/, " ")
      .split(" ")
      .slice(0, 2)
      .map((v) => v && v[0].toUpperCase())
      .join("");
}

export function initialsForUser(user: UserData): string {
  return initialsForFullName(fullNameForUser(user));
}

export function fullNameForUser(user: UserData): string {
  return `${user.firstName} ${user.lastName}`;
}
