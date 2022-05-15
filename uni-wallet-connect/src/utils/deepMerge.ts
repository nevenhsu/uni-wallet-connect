export function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

type Obj = { [key: string]: any }

export function mergeDeep<T>(target: Obj, ...sources: Obj[]): Obj {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}
