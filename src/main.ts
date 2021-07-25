import express from 'express'
import 'reflect-metadata'

import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

import {
  BodyDto,
  ClassType,
  ControllerPathPrefix,
  HandlerMapping,
  ModuleOptions,
  WithBody,
  WithReq,
} from './const'
import { getInstanceMethodNames } from './util/index'
import { Injector } from './container'
import { Classes, HandlerConfig } from './types'
import { AppModule } from './app.module'

export const bootstrap = <T>(appModule: Type<any>) => {
  const injector = new Injector()
  const imports = Reflect.getMetadata(ModuleOptions, AppModule)
    .imports as Type<any>[]
  const controllers = imports
    .map(cls => {
      const moduleControllers = Reflect.getMetadata(ModuleOptions, cls)
        .controllers as Type<any>[]

      return moduleControllers
    })
    .flat(1)

  const injected = controllers.map(c => {
    return injector.resolve<typeof c>(c)
  })

  const app = express()
  app.use(express.json())

  injected.map(instance => {
    const instanceType = Reflect.getMetadata(ClassType, instance)
    const pathPrefix = Reflect.getMetadata(ControllerPathPrefix, instance)
    if (!instanceType || instanceType !== Classes.Controller) {
      throw new Error('Instance is not a controller')
    }

    const methodNames = getInstanceMethodNames(instance)
    methodNames.map(method => {
      const methodMapping: HandlerConfig = Reflect.getMetadata(
        HandlerMapping,
        //@ts-ignore
        instance[method]
      )

      const { path, method: handlerMethod, name } = methodMapping

      const withRequest = Reflect.getMetadata(
        WithReq,
        instance.constructor,
        name
      )
      const withBody = Reflect.getMetadata(WithBody, instance.constructor, name)
      const dto = Reflect.getMetadata(BodyDto, instance.constructor, name)

      if (dto) {
        app.use(`${pathPrefix}${path}`, async (req, res, next) => {
          if (req.method.toLowerCase() !== handlerMethod.toLowerCase()) {
            return next()
          }

          const convert = plainToClass(dto, req.body)
          const errors = await validate(convert)
          if (errors.length > 0) {
            const transform = errors.map(error => {
              const constraints = error.constraints
              if (!constraints) return

              const msgs = Object.values(constraints)
              return msgs
            })
            return res.json(transform)
          }
          return next()
        })
      }

      app[handlerMethod](`${pathPrefix}${path}`, async (req, res) => {
        let result
        const args = [withRequest, withBody]
          .filter(a => Boolean(a))
          //@ts-ignore
          .sort((a, b) => {
            if (a.index > b.index) {
              return 1
            }

            if (a.index < b.index) {
              return -1
            }
          })
          .map(a => {
            if (a.name === 'body') {
              return req.body
            }

            if (a.name === 'request') {
              return req
            }
          })

        //@ts-ignore
        result = await instance[method](...args)
        res.json(result)
      })
    })
  })

  app.listen(3000)
}

bootstrap<AppModule>(AppModule)
