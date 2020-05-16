type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P]
}

declare module 'factoria' {
  type FactoryFunction = (<T>(model: string) => T)
    & (<T>(model: string, overrides?: RecursivePartial<T>) => T)
    & (<T>(model: string, count: number, overrides?: RecursivePartial<T>) => T[])

  type Factoria = FactoryFunction & {
    define (model: string, handler: (faker: Faker.FakerStatic) => void): Factoria
  }

  const factory: Factoria

  export default factory
}

declare module 'vue-test-helpers' {
  export default function (options?: { registerGlobals: boolean }): void
}

declare module 'crypto-random-string' {
  export default function (length: number): string
}
