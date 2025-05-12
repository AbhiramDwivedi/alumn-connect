// Type declarations for Playwright Test
// This helps TypeScript recognize the @playwright/test module

declare module '@playwright/test' {
  export const test: any;
  export const expect: any;
  export interface Page {
    goto: (url: string, options?: any) => Promise<any>;
    getByText: (text: string) => any;
    getByRole: (role: string, options?: any) => any;
    getByLabel: (label: string) => any;
    getByPlaceholder: (placeholder: string) => any;
    locator: (selector: string) => any;
    waitForURL: (url: string, options?: any) => Promise<any>;
    waitForTimeout: (timeout: number) => Promise<void>;
    evaluate: <T>(pageFunction: Function | string, arg?: any) => Promise<T>;
    textContent: (selector: string) => Promise<string | null>;
  }
  
  export interface BrowserContext {
    newPage: () => Promise<Page>;
  }
  
  export interface Browser {
    newContext: () => Promise<BrowserContext>;
  }
  
  export interface TestState {
    page: Page;
    browser: Browser;
    context: BrowserContext;
  }
  
  export const devices: Record<string, any>;
}
