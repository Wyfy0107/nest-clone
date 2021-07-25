"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const const_1 = require("./const");
const index_1 = require("./util/index");
const container_1 = require("./container");
const course_controller_1 = require("./course/course.controller");
const types_1 = require("./types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const controllers = [course_controller_1.CourseController];
const bootstrap = () => {
    const injector = new container_1.Injector();
    const injected = controllers.map(c => {
        return injector.resolve(c);
    });
    const app = express_1.default();
    app.use(express_1.default.json());
    injected.map(instance => {
        const instanceType = Reflect.getMetadata(const_1.ClassType, instance);
        const pathPrefix = Reflect.getMetadata(const_1.ControllerPathPrefix, instance);
        if (!instanceType || instanceType !== types_1.Classes.Controller) {
            throw new Error('Instance is not a controller');
        }
        const methodNames = index_1.getInstanceMethodNames(instance);
        methodNames.map(method => {
            const methodMapping = Reflect.getMetadata(const_1.HandlerMapping, instance[method]);
            const { path, method: handlerMethod, name } = methodMapping;
            const withRequest = Reflect.getMetadata(const_1.WithReq, instance.constructor, name);
            const withBody = Reflect.getMetadata(const_1.WithBody, instance.constructor, name);
            const dto = Reflect.getMetadata(const_1.BodyDto, instance.constructor, name);
            if (dto) {
                app.use(`${pathPrefix}${path}`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                    const convert = class_transformer_1.plainToClass(dto, req.body);
                    const errors = yield class_validator_1.validate(convert);
                    if (errors.length > 0) {
                        const transform = errors.map(error => {
                            const constraints = error.constraints;
                            if (!constraints)
                                return;
                            const msgs = Object.values(constraints);
                            return msgs;
                        });
                        return res.json(transform);
                    }
                    return next();
                }));
            }
            app[handlerMethod](`${pathPrefix}${path}`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                let result;
                const args = [withRequest, withBody]
                    .filter(a => Boolean(a))
                    //@ts-ignore
                    .sort((a, b) => {
                    if (a.index > b.index) {
                        return 1;
                    }
                    if (a.index < b.index) {
                        return -1;
                    }
                })
                    .map(a => {
                    if (a.name === 'body') {
                        return req.body;
                    }
                    if (a.name === 'request') {
                        return req;
                    }
                });
                result = yield instance[method](...args);
                res.json(result);
            }));
        });
    });
    app.listen(3000);
};
exports.bootstrap = bootstrap;
exports.bootstrap();
