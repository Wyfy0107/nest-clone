"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = exports.Req = exports.Post = exports.Get = exports.Controller = exports.Injectable = void 0;
const const_1 = require("./../const");
require("reflect-metadata");
const types_1 = require("../types");
const const_2 = require("../const");
const Injectable = () => {
    return (target) => { };
};
exports.Injectable = Injectable;
const Controller = (path) => {
    return (target) => {
        Reflect.defineMetadata(const_2.ClassType, types_1.Classes.Controller, target.prototype);
        Reflect.defineMetadata(const_2.ControllerPathPrefix, path, target.prototype);
    };
};
exports.Controller = Controller;
const Get = (path) => {
    return (target, propertyKey, descriptor) => {
        const currentHandlerConfig = {
            name: propertyKey,
            method: types_1.HandlerMethods.Get,
            path: path,
        };
        Reflect.defineMetadata(const_2.HandlerMapping, currentHandlerConfig, descriptor.value);
        return descriptor;
    };
};
exports.Get = Get;
const Post = (path) => {
    return (target, propertyKey, descriptor) => {
        const currentHandlerConfig = {
            name: propertyKey,
            method: types_1.HandlerMethods.Post,
            path: path,
        };
        Reflect.defineMetadata(const_2.HandlerMapping, currentHandlerConfig, descriptor.value);
        return descriptor;
    };
};
exports.Post = Post;
const Req = () => {
    return (target, key, index) => {
        Reflect.defineMetadata(const_2.WithReq, { index, name: 'request' }, target.constructor, key);
    };
};
exports.Req = Req;
const Body = (options) => {
    return (target, key, index) => {
        if (options === null || options === void 0 ? void 0 : options.validate) {
            const bodyDto = Reflect.getMetadata('design:paramtypes', target, key)[index];
            Reflect.defineMetadata(const_1.BodyDto, bodyDto, target.constructor, key);
        }
        Reflect.defineMetadata(const_2.WithBody, { index, name: 'body' }, target.constructor, key);
    };
};
exports.Body = Body;
