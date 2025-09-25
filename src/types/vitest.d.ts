declare module 'vitest' {
  export interface TestContext {}
  export type TestFunction = (ctx?: TestContext) => void | Promise<void>;
  export function describe(name: string, fn: TestFunction): void;
  export function it(name: string, fn: TestFunction): void;
  export const expect: (value: unknown) => {
    toBeTruthy(): void;
  };
}
