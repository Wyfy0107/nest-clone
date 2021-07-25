import 'reflect-metadata'

export class Injector extends Map {
  public resolve<T>(target: Type<any>): T {
    const tokens = Reflect.getMetadata('design:paramtypes', target) || []
    const injections = tokens.map((token: any) => this.resolve(token))

    const classInstance = this.get(target)
    if (classInstance) {
      return classInstance
    }

    const newClassInstance = new target(...injections)
    this.set(target, newClassInstance)

    console.log(
      `DI-Container created class ${newClassInstance.constructor.name}`
    )

    return newClassInstance
  }
}
