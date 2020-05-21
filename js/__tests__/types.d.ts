declare module 'vue-test-helpers' {
  export default function (options?: { registerGlobals: boolean }): void
}

declare module 'crypto-random-string' {
  export default function (length: number): string
}
