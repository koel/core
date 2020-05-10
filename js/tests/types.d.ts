declare module 'factoria' {
  type FactoryFunction = (<T>(model: string) => T)
    & (<T>(model: string, overrides?: Partial<T>) => T)
    & (<T>(model: string, count: number, overrides?: Partial<T>) => T[])

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
