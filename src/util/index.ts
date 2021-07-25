export const getInstanceMethodNames = (obj: any) => {
  const proto = Object.getPrototypeOf(obj)
  const names = Object.getOwnPropertyNames(proto)
  return names.filter(
    name => typeof obj[name] === 'function' && name !== 'constructor'
  )
}
