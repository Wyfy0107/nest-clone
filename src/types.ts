export type HandlerConfig = {
  name: string
  path: string
  method: HandlerMethods
}

export enum Classes {
  Controller = 'controller',
  Service = 'service',
}

export enum HandlerMethods {
  Get = 'get',
  Post = 'post',
}
