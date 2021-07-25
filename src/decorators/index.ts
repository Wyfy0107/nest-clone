import { BodyDto, BodyParamIndex } from './../const'
import 'reflect-metadata'
import { plainToClass } from 'class-transformer'

import { Classes, HandlerConfig, HandlerMethods } from '../types'
import {
  HandlerMapping,
  ControllerPathPrefix,
  ClassType,
  WithReq,
  WithBody,
} from '../const'
import { validate } from 'class-validator'

export const Injectable = () => {
  return (target: Type<any>) => {}
}

export const Controller = (path?: string) => {
  return (target: Type<any>) => {
    Reflect.defineMetadata(ClassType, Classes.Controller, target.prototype)
    Reflect.defineMetadata(ControllerPathPrefix, path, target.prototype)
  }
}

export const Get = (path: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const currentHandlerConfig: HandlerConfig = {
      name: propertyKey,
      method: HandlerMethods.Get,
      path: path,
    }

    Reflect.defineMetadata(
      HandlerMapping,
      currentHandlerConfig,
      descriptor.value
    )

    return descriptor
  }
}

export const Post = (path: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const currentHandlerConfig: HandlerConfig = {
      name: propertyKey,
      method: HandlerMethods.Post,
      path: path,
    }

    Reflect.defineMetadata(
      HandlerMapping,
      currentHandlerConfig,
      descriptor.value
    )

    return descriptor
  }
}

export const Req = () => {
  return (target: any, key: string, index: number) => {
    Reflect.defineMetadata(
      WithReq,
      { index, name: 'request' },
      target.constructor,
      key
    )
  }
}

type Options = {
  validate: Boolean
}

export const Body = (options: Options) => {
  return (target: any, key: string, index: number) => {
    if (options?.validate) {
      const bodyDto = Reflect.getMetadata('design:paramtypes', target, key)[
        index
      ]
      Reflect.defineMetadata(BodyDto, bodyDto, target.constructor, key)
    }

    Reflect.defineMetadata(
      WithBody,
      { index, name: 'body' },
      target.constructor,
      key
    )
  }
}
