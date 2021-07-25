"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstanceMethodNames = void 0;
const getInstanceMethodNames = (obj) => {
    const proto = Object.getPrototypeOf(obj);
    const names = Object.getOwnPropertyNames(proto);
    return names.filter(name => typeof obj[name] === 'function' && name !== 'constructor');
};
exports.getInstanceMethodNames = getInstanceMethodNames;
